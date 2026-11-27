# P and NP: definitions and equivalent formulations

The P versus NP problem asks whether every decision problem with polynomial-time-verifiable positive answers also has a polynomial-time algorithm that decides all instances. “Quickly” means polynomial in input length, not necessarily fast in practice.

## The question

- **P** is the class of decision problems solvable by a deterministic polynomial-time Turing machine.
- **NP** (“nondeterministic polynomial time”) is the class whose positive answers have polynomial-size certificates checkable in polynomial time. Equivalently, a nondeterministic polynomial-time Turing machine can find an accepting path; nondeterminism is not randomness.
- Clearly `P ⊆ NP`; the open question is whether the inclusion is strict.

For generalized Sudoku on an `n^2 × n^2` grid, a filled grid is easy to verify row-by-row, column-by-column, and across its `n × n` boxes using integers `1` through `n^2`. No polynomial-time decision algorithm is known. Fixed-size Sudoku is different: finitely many grids make it solvable by table lookup, so it is in P.

## Formal definitions

A deterministic polynomial-time machine `M` must halt on every input and satisfy `T_M(n) ∈ O(n^k)` for some constant `k`, where `T_M(n)` is its maximum running time on inputs of length `n`. Thus:

`P = {L : L = L(M) for some deterministic polynomial-time Turing machine M}`

`L(M) = {w ∈ Σ* : M accepts w}`

A language `L` is in NP iff a polynomial-time decidable relation `R` and polynomial `p` exist such that:

`x ∈ L ⟺ ∃y ( |y| ≤ p(|x|) ∧ R(x,y) )`

The witness `y` is a certificate. The formal problem asks whether polynomial-time decidable predicates are closed under polynomially bounded existential quantification.

## Equivalent formulations

On finite ordered structures, descriptive complexity gives:

- **Fagin's theorem:** NP is exactly existential second-order logic (`ESO`).
- **Immerman–Vardi theorem:** P is exactly first-order logic with a least fixed-point operator (`FO(LFP)`).

Therefore:

`P = NP ⟺ FO(LFP) = ESO`

The polynomial hierarchy (`PH`) also yields `P = NP` iff `P = PH`.

## Boundaries

`COMPOSITE = {x ∈ ℕ | x = pq for integers p, q > 1}` is in NP: a divisor `y` with `1 < y ≤ √x` is a checkable certificate. The AKS primality test also places `COMPOSITE` in P, illustrating that an NP problem need not be hard.

## See also

- [NP-completeness and reductions](np-completeness-and-reductions.md)
- [Polynomial time versus practical tractability](p-versus-np-tractability-caveats.md)
- [History and current status of P versus NP](../observations/history-and-current-status-of-p-versus-np.md)

> Source: inbox/articles/P_versus_NP_problem.md · processed 2026-11-26
