# Micro-Optimization Locality: Amdahl's Law in Practice on the BEAM

A function can get dramatically faster in isolation and change nothing at all in production. The `dns_erlang` team saw exactly this: the spring releases made `to_lower/1` and the first SWAR work up to 30% faster in isolation, yet end-to-end they were flat — because those functions simply were not where a nameserver spends its time. **A 2x speedup on 1% of the work is still 0.5%.** The BEAM is often smarter than you'd expect, and the only way to know is to measure.

## Benchmarks: Benchee, two machines, OTP 29 with the JIT

Every number below comes from [Benchee](https://github.com/bencheeorg/benchee) on two very different machines (an Apple M4 Pro and an AMD Ryzen 9 9950X3D), on OTP 29 with the JIT, measuring time, memory and reductions.

## The BEAM is often smarter than you'd expect

Some of our favourite ideas lost, and the numbers were very clear about it.

The lesson: the BEAM is often smarter than you'd expect, and the only way to know is to measure.

## Amdahl's law in practice: a 2x speedup on 1% of the work is still 0.5%

Just as interesting is what *didn't* move: the spring releases, with the faster `to_lower/1` and the first SWAR work, made those functions up to 30% faster in isolation, but end-to-end they're flat. Those functions simply weren't where a nameserver spends its time. A 2x speedup on 1% of the work is still 0.5%.

## Parity harness: byte-for-byte identical behaviour

Every change also went through a *parity harness* proving the new code byte-for-byte identical to the old, down to the errors raised on malformed input: 26,434 cases for name decoding alone. And we kept the experiments that lost, with their numbers; we'll get to them.

## Micro-benchmarks are nice, but what we care about is the nameserver

Micro-benchmarks are nice, but what we care about is the nameserver. So we built a test that looks like production:

- 20,000 synthetic zones, 10% of them DNSSEC-signed, with the record mix our customers actually use.
- About 19 million queries matching the shape of our real traffic over a week: the same mix of query types and response codes, the same name lengths and label counts, the same skew towards popular names, and the same share of queries asking for DNSSEC (83%).
- `erldns` built three times, changing nothing but the `dns_erlang` version, pinned to dedicated cores on the same OTP version we run in production, five interleaved rounds each.

## See also

- [BEAM Binary Hot Path Optimization: Accumulator, Match Context, Chunk Matching, Cheap Map Keys](../patterns/beam-binary-hot-path-optimization.md)
- [SWAR String Scanning on the BEAM with 56-bit Words](../patterns/beam-swar-string-scanning.md)

> Source: inbox/articles/Making dns_erlang Fast Binary Tricks for the BEAM.md · processed 2026-10-21
