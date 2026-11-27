# NP-completeness and polynomial-time reductions

NP-completeness identifies problems that represent the full difficulty of NP. A polynomial-time algorithm for any NP-complete problem would imply P = NP.

## Definitions

A decision problem is **NP-complete** iff it is in NP and every problem in NP reduces to it in polynomial time. It is **NP-hard** if every NP problem reduces to it; NP-hard problems need not be in NP and need not have polynomial-time-verifiable answers.

If `L ∈ NP`, proving that an already NP-complete problem reduces to `L` is enough to prove `L` NP-complete.

## Why SAT matters

The Cook–Levin theorem establishes that Boolean satisfiability (`SAT`) is NP-complete. Every NP instance can be transformed mechanically into a SAT instance in polynomial time. SAT was the first natural problem proved NP-complete; reductions subsequently made it practical to transfer hardness across many domains.

Stephen Cook stated the precise problem in the 1971 paper “The complexity of theorem proving procedures”; Leonid Levin independently introduced it in 1973.

## Reduction example

The article's generalized Sudoku problem is NP-complete through a chain:

`Sudoku → completing Latin squares → partitioning tri-partite graphs into triangles → 3-SAT → SAT`

A polynomial-time solution at any link yields a polynomial-time solution for the next, and a polynomial-time SAT algorithm yields polynomial-time algorithms for every NP problem. Problems linked by such reductions are computationally “the same problem” up to polynomial-time transformations.

## Completeness test

To classify a new problem:

1. Show it belongs to NP by giving a polynomial-time verifier and polynomial-size certificate.
2. Reduce a known NP-complete problem to it in polynomial time.

No polynomial-time algorithm is known for any NP-complete problem. This is evidence for the prevailing `P ≠ NP` belief, not a proof of separation.

## See also

- [P and NP definitions](p-versus-np-definitions.md)
- [Polynomial time versus practical tractability](p-versus-np-tractability-caveats.md)
- [Consequences of resolving P versus NP](consequences-of-resolving-p-versus-np.md)

> Source: inbox/articles/P_versus_NP_problem.md · processed 2026-11-26
