# SWAR String Scanning on the BEAM with 56-bit Words

SWAR — SIMD Within A Register — lets the BEAM test several bytes at once with ordinary arithmetic and bitwise operations instead of inspecting them one at a time. On most platforms you would use a 64-bit word; on the BEAM that would be a bignum, so the technique uses **56-bit words** (7 bytes), which keeps every intermediate value a small integer and lets each `band`, `bxor`, `+` and `-` compile to a bare machine instruction. The whole test fits in a guard, so a BEAM application can scan a string for special characters without ever materialising a term per byte.

## SWAR: SIMD Within A Register

This one started with Daniel Lemire's post on [detecting special characters with SWAR](https://lemire.me/blog/2025/04/13/detect-control-characters-quotes-and-backslashes-efficiently-using-swar/), and a simple question: can we do that on the BEAM?

SWAR stands for *SIMD Within A Register*. Instead of looking at bytes one at a time, you load several bytes into one integer and use ordinary arithmetic and bitwise operations to test all of them at once. The classic trick answers "does this word contain a zero byte?" without looking at any byte individually:

```
has_zero(V) = (V - 0x0101...01) band (bnot V) band 0x8080...80
```

Subtracting 1 from each byte only borrows into a byte's high bit when that byte was zero, so the result is non-zero exactly when some byte of `V` is zero. To ask whether a word contains a *specific* byte, say `.`, XOR the word with that byte repeated in every lane first: matching bytes become zero.

On most platforms you'd use a 64-bit word. On the BEAM that would be a mistake, because a 64-bit value doesn't fit in a small integer: the arithmetic would allocate bignums on the heap, and the JIT can't emit plain machine instructions for it. The largest whole number of bytes that fits is 7, so we use **56-bit words**. All the intermediate values stay small integers, and every `band`, `bxor`, `+` and `-` compiles to a bare instruction with no type checks.

## SWAR in a guard: the macros and escape_label/2

Best of all, the whole test is legal in a guard. Here's how `dns_erlang` escapes a label while decoding a name: seven bytes at a time when they contain neither `.` nor `\`, byte by byte only around the ones that need escaping.

```erlang
-define(ONES, 16#01010101010101).
-define(HIGHS, 16#80808080808080).
-define(HAS_ZERO(V), ((((V) - ?ONES) band bnot (V)) band ?HIGHS)).
-define(CLEAN(W),
    (0 =:= (?HAS_ZERO((W) bxor (?ONES * $.)) bor ?HAS_ZERO((W) bxor (?ONES * $\\))))).

escape_label(<<W:56, Rest/binary>>, Acc) when ?CLEAN(W) ->
    escape_label(Rest, <<Acc/binary, W:56>>);
escape_label(<<$., Rest/binary>>, Acc) ->
    escape_label(Rest, <<Acc/binary, "\\.">>);
escape_label(<<$\\, Rest/binary>>, Acc) ->
    escape_label(Rest, <<Acc/binary, "\\\\">>);
escape_label(<<C, Rest/binary>>, Acc) ->
    escape_label(Rest, <<Acc/binary, C>>);
escape_label(<<>>, Acc) ->
    Acc.
```

In Elixir, `defguardp` plays the role of those macros, so the same guard reads just as naturally there.

Notice how all the previous patterns are in there too: the label is only ever matched, so it stays a match context; the output is a single append-only accumulator; and the clauses go from the biggest chunk to the smallest.

## Branch-free case conversion with SWAR

The same idea makes case conversion branch-free. With a couple more subtractions you can find every byte between `A` and `Z` in the word, and flip their `0x20` bit in one go. That's how `to_lower/1`, `to_upper/1` and the case-insensitive comparisons in `dns_erlang` work today ([#124](https://github.com/dnsimple/dns_erlang/pull/124)).

## SWAR upstream: Erlang/OTP and Elixir

The fun part is that this didn't stay in our library. The same week it landed in `dns_erlang`, we took the trick upstream, to Erlang/OTP and Elixir themselves:

- [erlang/otp#10938](https://github.com/erlang/otp/pull/10938) applies it to the `json` module's string scanning. The JIT output for the hot loop shrank from about 1,750 lines of assembly to about 100, and 768 jump-table entries disappeared. Benchmarks borrowed from Jason improved by 3% to 55%.
- [erlang/otp#10948](https://github.com/erlang/otp/pull/10948) brings it to the `string` module, making `string:length/1` and `string:slice/3` up to twice as fast on ASCII input.
- [elixir-lang/elixir#15255](https://github.com/elixir-lang/elixir/pull/15255) does the same for Elixir's `String.length/1` and `String.slice/3`: `String.length/1` got 2 to 5 times faster on ASCII strings.

All three shipped in OTP 29 and Elixir 1.20. If you're on those versions, you're already running this code.

## The community spread

And then the community ran with it. Over the following months, other people brought SWAR to more corners of the ecosystem:

- [elixir-lang/elixir#15357](https://github.com/elixir-lang/elixir/pull/15357) applies it to the validation functions in Elixir's `Base` module, making `Base.valid16?/2` and `Base.valid32?/2` about 25% faster.
- [elixir-plug/plug#1311](https://github.com/elixir-plug/plug/pull/1311) adds a 56-bit SWAR guard to the ASCII fast path of Plug's UTF-8 validation.
- [elixir-mint/mint#513](https://github.com/elixir-mint/mint/pull/513) rewrites Mint's HTTP/1 header parser to read 7 bytes at a time, using SWAR to find the colon and the end of the line while validating the bytes.
- [erlang/otp#11473](https://github.com/erlang/otp/pull/11473), José Valim's proposal to support byte ranges directly in binary patterns, measures itself against SWAR guards.

It's a nice reminder of how an idea travels in an open ecosystem: from a blog post about C, to a DNS library, to the standard libraries, and from there to code that most Elixir applications run on every request.

## See also

- [BEAM Binary Hot Path Optimization: Accumulator, Match Context, Chunk Matching, Cheap Map Keys](beam-binary-hot-path-optimization.md)
- [Micro-Optimization Locality: Amdahl's Law in Practice on the BEAM](../observations/beam-micro-optimization-locality.md)

> Source: inbox/articles/Making dns_erlang Fast Binary Tricks for the BEAM.md · processed 2026-10-21
