# Complexity landscape around P and NP

The P versus NP question sits inside a larger hierarchy of decision, counting, and undecidable problems. Some separations are proved, while several important locations remain unknown.

## Proven separations and harder classes

`EXPTIME` contains decision problems solvable by a deterministic Turing machine in `O(2^{p(n)})` time for some polynomial `p(n)`. An EXPTIME-complete problem is in EXPTIME and receives every EXPTIME problem by polynomial-time many-one reduction. The time hierarchy theorem gives `P ≠ EXPTIME`, so EXPTIME-complete problems are outside P. Examples include finding a perfect strategy for chess on an `N × N` board and analogous board games.

Fischer and Rabin proved in 1974 that deciding truth in Presburger arithmetic requires more than exponential time. Undecidable problems such as the halting problem are harder still: no algorithm can correctly decide every input.

## Counting and NP-intermediate problems

`#P` asks “How many solutions are there?” where NP asks “Are there any solutions?” A count immediately answers existence when it is positive. Some `#P` problems correspond to linear-time P decision problems, so deciding existence can be easy while counting is believed hard. Polynomial-time algorithms for `#P`-complete problems would solve all `#P` problems in polynomial time.

Ladner's theorem (1975) states that if `P ≠ NP`, NP contains problems that are neither in P nor NP-complete. These are **NP-intermediate** problems.

## Unresolved examples

- **Graph isomorphism:** its placement in P, NP-complete, or NP-intermediate is unknown. If NP-complete, the polynomial hierarchy would collapse to its second level. László Babai's best known algorithm runs in quasi-polynomial time.
- **Integer factorization:** in NP and co-NP, and even in UP and co-UP. If NP-complete, the polynomial hierarchy would collapse to its first level (`NP = co-NP`). The general number field sieve is the most efficient known classical algorithm; Shor's algorithm is polynomial-time on a quantum computer, which does not locate factorization within classical classes.
- **Discrete logarithm:** also believed NP-intermediate.

## Linear-time analogue

Replacing polynomial time with linear time on a multitape Turing machine yields `DLIN` and `NLIN`. It is known that `DLIN ≠ NLIN`.

## See also

- [P and NP definitions](../concepts/p-versus-np-definitions.md)
- [NP-completeness and reductions](../concepts/np-completeness-and-reductions.md)
- [Polynomial time versus practical tractability](../concepts/p-versus-np-tractability-caveats.md)

> Source: inbox/articles/P_versus_NP_problem.md · processed 2026-11-26
