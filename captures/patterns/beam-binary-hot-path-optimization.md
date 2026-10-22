# BEAM Binary Hot Path Optimization: Accumulator, Match Context, Chunk Matching, Cheap Map Keys

Four reusable techniques for making binary-heavy Erlang and Elixir code fast, taken from rewriting the hot paths of the `dns_erlang` DNS library. Each one works by writing code that lets the BEAM compiler and JIT prove something and skip a copy: keep a single append-only accumulator, never let the rest of a binary escape the match context, dispatch on chunk size with function clauses instead of `rem`, and choose map keys the VM can compare with a single `memcmp`. (Pattern 4 of the source article, SWAR string scanning, is filed separately as [SWAR String Scanning on the BEAM with 56-bit Words](beam-swar-string-scanning.md).)

## Why binary handling is hot code in DNS

DNSimple's managed [DNS hosting](https://dnsimple.com/products/dns-hosting) has two layers. Queries for your domains first reach our [cache edge](https://blog.dnsimple.com/2026/08/building-our-fully-independent-dns-edge/), a global anycast network we build and operate ourselves, which answers whatever it already has cached. Everything else goes to the origin: the authoritative [name servers](https://support.dnsimple.com/articles/dnsimple-nameservers/) that hold every zone and build every answer. The origin runs [`erldns`](https://github.com/dnsimple/erldns), our open-source DNS server written in Erlang, and since it does the real work behind every cache miss, every query it answers has to be as cheap as possible.

Like many other protocols (HTTP for example), DNS is a request-response system where payloads need to be encoded and decoded as they travel through the wire. So just like a JSON parser is hot code in a JSON API, a DNS parser is hot code for us: every DNS query that reaches a DNSimple nameserver goes through [`dns_erlang`](https://github.com/dnsimple/dns_erlang) twice: once to decode the request, and once to encode the response. At a few queries per second, nobody cares how long that takes, but as queries per second scale, under attack, every nanosecond spent turning bytes into terms and back is a nanosecond not spent answering the next query.

So over the last several months we've rewritten most of the hot paths of `dns_erlang`, the open-source DNS library that powers `erldns` and our authoritative name servers. The result: on a production-shaped workload, our nameserver now spends **12% less CPU per query** and serves **14% more queries per second** before saturating, from library changes alone.

None of it required NIFs, C, or exotic tooling. It came from understanding how the BEAM handles binaries, and writing code that the compiler and the JIT can turn into something fast. If you write Elixir or Erlang, and especially if you parse or produce binary protocols, these patterns apply to your code too. Many of them are not well known, even among experienced Elixir developers, so let's dive into it.

## BEAM binaries in five minutes

Before looking at the optimisations, we need a mental model of what a binary is on the BEAM. The [Erlang efficiency guide](https://www.erlang.org/doc/system/binaryhandling.html) has the full details; here is the short version.

**Everything is immutable, at least in principle.** On the BEAM, data never changes once it's created: "updating" a tuple, a map or a binary produces a new one, and anyone holding the old one still sees it unchanged. That's a big part of what makes processes and concurrency so easy to reason about, but taken literally it would mean copying on every change. In practice the compiler, the JIT and the runtime cheat whenever they can prove that nobody could notice, that is, when the semantics of the language can be respected: they reuse memory, write in place, or skip the copy entirely. Most of the tricks in this post are about writing code that makes that proof easy.

**Slicing and matching are cheap.** Binaries up to 64 bytes live on the process heap, and bigger ones live outside any process, shared by reference. Matching `<<Header:12/binary, Rest/binary>>` copies nothing: `Rest` is a *sub-binary*, a small term pointing into the original. Better still, when a function recursively matches the rest of a binary, the compiler keeps a *match context*, a cursor that walks the bytes, and only materialises a sub-binary if you let `Rest` escape, for example by returning it or storing it in a tuple.

**Appending can be (almost) free too.** This is the one that surprises people. Consider:

```erlang
loop(<<C, Rest/binary>>, Acc) -> loop(Rest, <<Acc/binary, C>>);
loop(<<>>, Acc) -> Acc.
```

Naively, each iteration copies `Acc` into a new, one-byte-longer binary, making the loop quadratic. It doesn't, because the runtime can prove that `Acc` came from an append and nobody else is looking at it, so writing in place can't break immutability for anyone. The first append allocates spare capacity, and later appends write into it:

```
<<Acc/binary, C>> on a binary only this loop holds

  +---------------------------+-----------------------+
  |  bytes written so far     |   spare capacity      |
  +---------------------------+-----------------------+
                              ^ next append writes here, no copy
```

So an append-only accumulator costs amortised O(1) per append, like pushing onto a `std::vector` in C++. The catch: if the binary escapes, if you build pieces separately and glue them together, or if you append the *accumulator* onto something else, you're back to copying.

**Integers have a size limit you can feel.** To know each term's type at runtime, the BEAM tags it: a few low bits of every word say what the term is. On a 64-bit BEAM a small integer's tag takes 4 bits, so integers that fit in the remaining 60 (59 bits of magnitude plus a sign) are *small integers*: immediate values that never touch the heap. Anything larger becomes a *bignum*, allocated on the heap. This will matter a lot when we get to SWAR.

**Work is counted in reductions.** The scheduler gives each process a budget of reductions (roughly, function calls) before switching to another, so fewer reductions for the same work means more throughput.

Tip

You can ask the compiler where binary optimisations apply, and where they don't. Compile with `erlc +bin_opt_info`, or `ERL_COMPILER_OPTIONS=bin_opt_info mix compile --force` in Elixir, and it will report every match context it keeps and every place it has to give one up.

## Pattern 1: one accumulator, appended all the way

Encoding a DNS response means writing a header, the question, and then every record in the answer, authority and additional sections. The old encoder built each section as its own binary and then copied it onto the message. Each record's data (its RDATA) was also built as a separate binary, measured to write its length, and copied in.

Each of those intermediate binaries is allocated, filled, copied and thrown away. The append optimisation can't help, because we keep starting new binaries instead of extending one.

In [#100](https://github.com/dnsimple/dns_erlang/pull/100) and [#139](https://github.com/dnsimple/dns_erlang/pull/139) we turned the whole encoder around: a single accumulator flows through every section, and each record appends itself straight onto it. Even the RDATA length is computed from the parts and written in the same append as the data:

```erlang
%% Before: the RDATA is built on its own, measured, then copied in.
encode_rr(Acc, RR) ->
    Data = encode_rrdata(RR),
    <<Acc/binary, (byte_size(Data)):16, Data/binary>>.

%% After: the length and the data go onto the message in one append.
encode_mx(Acc, Pref, Exchange) ->
    <<Acc/binary, (2 + byte_size(Exchange)):16, Pref:16, Exchange/binary>>.
```

There was one more wrinkle. A DNS message starts with a 12-byte header whose counters (how many answers, how many authority records, and so on) we only know at the end. So the accumulator starts with 12 zero bytes as a placeholder. Every section is appended after it, and because the placeholder is already there, the accumulator's size is always the current position in the final message, which is exactly what name compression pointers need. When the message is complete, the real header is built and placed in front of the body, in the only copy of the body the whole encoding makes.

## Pattern 2: stay in the match context

Decoding has the mirror-image problem: it's easy to accidentally force the BEAM to materialise terms it never needed.

A good example is TXT records, which carry a list of length-prefixed strings. The old code delegated each string to a helper that returned a `{Rest, String}` tuple. That's one tuple allocation per string, and because `Rest` escapes inside the tuple, the compiler must create a real sub-binary for it. In [#135](https://github.com/dnsimple/dns_erlang/pull/135) we match the string directly in the loop's head, so the match context survives:

```erlang
%% Before: a helper returns a tuple, and Rest escapes inside it.
decode_text(<<>>) ->
    [];
decode_text(Bin) ->
    {Rest, Str} = decode_string(Bin),
    [Str | decode_text(Rest)].

decode_string(<<Len, Str:Len/binary, Rest/binary>>) ->
    {Rest, Str}.

%% After: match the string in the loop's own head.
decode_text(<<Len, Str:Len/binary, Rest/binary>>) ->
    [Str | decode_text(Rest)];
decode_text(<<>>) ->
    [].
```

The same pull request found a less obvious copy: the decoder stored each section into the `#dns_message{}` record as soon as it was decoded. Records are immutable tuples, so every update copies the whole thing, and this record is 19 words. Updating it four times per message (questions, answers, authority, additional) meant four copies. Passing the sections along as function arguments and building the record once at the end cut 11% of the reductions and 10% of the allocation for decoding a query, which is exactly what every incoming packet goes through.

## Pattern 3: match in big chunks, and read the assembly

Domain names are case-insensitive, so `dns_erlang` lowercases them a lot. The old `to_lower/1` used binary comprehensions over 8, 7, 6, … 2-byte chunks, picking the largest chunk size that evenly divided the input:

```erlang
to_lower_chunk(Data) when byte_size(Data) rem 8 =:= 0 -> ...;
to_lower_chunk(Data) when byte_size(Data) rem 7 =:= 0 -> ...;
to_lower_chunk(Data) when byte_size(Data) rem 6 =:= 0 -> ...;
%% ... down to rem 2, then one byte at a time
```

It looks reasonable. Then we looked at what the JIT actually generates for it. On x86-64, `rem 8`, `rem 4` and `rem 2` compile to cheap bit masks, but `rem 7`, `rem 6`, `rem 5` and `rem 3` each compile to an `idiv` instruction, which costs somewhere between 20 and 90 cycles. A name whose length isn't a multiple of 8 (most of them) paid for up to four divisions just to choose a strategy, and a prime length paid for all four and then went byte by byte anyway.

The rewrite in [#114](https://github.com/dnsimple/dns_erlang/pull/114) uses plain function clauses that match large chunks first and fall back to smaller ones. A clause like `<<B0, ..., B7, Rest/binary>>` compiles to a single size comparison, with no division anywhere:

```erlang
lower(<<A, B, C, D, E, F, G, H, Rest/binary>>, Acc) ->
    lower(Rest, <<Acc/binary, (l(A)), (l(B)), (l(C)), (l(D)),
                              (l(E)), (l(F)), (l(G)), (l(H))>>);
lower(<<A, Rest/binary>>, Acc) ->
    lower(Rest, <<Acc/binary, (l(A))>>);
lower(<<>>, Acc) ->
    Acc.
```

Funnily enough, this wasn't the first time that dispatch had shipped. Years ago I contributed the very same trick to OTP's hex encoding in [erlang/otp#4690](https://github.com/erlang/otp/pull/4690), where it made `binary:encode_hex/1` two to three times faster than the [original implementation](https://github.com/erlang/otp/pull/3014). It survived the addition of `binary:encode_hex/2` in [erlang/otp#6297](https://github.com/erlang/otp/pull/6297), until Björn Gustavsson replaced it in [erlang/otp#6869](https://github.com/erlang/otp/pull/6869): a size not divisible by anything from 2 to 7 took about three times longer than the best case, so the new code encodes the largest multiple of 8 bytes in one comprehension and finishes the last few bytes one at a time. The same pull request made `binary:decode_hex/1` almost ten times faster. In other words, the OTP team had already found and fixed this exact pattern in my own code, three years before I found it again in dns_erlang.

The lesson isn't really about `rem`. It's that the BEAM JIT is now good enough that the generated machine code is worth reading. Start Erlang with `+JDump true` (or `ERL_FLAGS="+JDump true"` for Elixir) and it writes the assembly of every loaded module to disk. Ten minutes in those files can explain a benchmark that hours of guessing can't.

## Pattern 5: pick keys the VM can compare cheaply

DNS has its own compression scheme: when a name, or the tail of a name, already appears earlier in the message, you write a 2-byte pointer to it instead of the name. The encoder keeps a map from every name suffix it has written to its position in the message.

The old map was keyed on lists of lowercased labels: `[<<"www">>, <<"example">>, <<"com">>]`. Every lookup had to hash or compare a deep term, and a name couldn't be looked up at all until it had been split, validated and lowercased, even when the answer was going to be "use this 2-byte pointer".

Two rounds of work changed that. In [#133](https://github.com/dnsimple/dns_erlang/pull/133) the encoder stopped splitting every name twice, and stopped growing the map one key at a time. Inserting into a small map copies it, so inserting a key per label meant one copy per label; the encoder now collects a name's suffixes and inserts them in one batch. For a name with 50 one-character labels, encoding went from 211 µs to 9.4 µs, 22 times faster. More importantly, an ordinary 8-label name went from 1.51 µs to 0.54 µs.

Then in the [next round](https://github.com/dnsimple/dns_erlang/commit/f673eb4) the keys themselves changed: each suffix is now the lowercased name as a *binary*, and each one is a sub-binary of the same name, so they cost nothing to produce and a single `memcmp` to compare. As a result, the raw input name is its own first key, and a name that's already in the map is answered before any splitting or lowercasing happens. That's the common case in a real response: every record in a set repeats the owner name, the answer repeats the question, and glue records repeat the nameserver names. Whole-message encoding got between 1.1 and 8.9 times faster, depending on how much the message repeats itself.

## See also

- [SWAR String Scanning on the BEAM with 56-bit Words](beam-swar-string-scanning.md)
- [Micro-Optimization Locality: Amdahl's Law in Practice on the BEAM](../observations/beam-micro-optimization-locality.md)
- [BEAM File Descriptor Limits: ulimit, +Q, and Containers](beam-file-descriptor-limits.md)

> Source: inbox/articles/Making dns_erlang Fast Binary Tricks for the BEAM.md · processed 2026-10-21
