# Consequences of resolving P versus NP

Either answer would reshape complexity theory. Practical impact depends on whether a proof also supplies efficient, explicit algorithms.

## If P = NP

A constructive, efficient algorithm for an NP-complete problem such as `3-SAT` would make every NP problem polynomial-time solvable. Potential gains include integer programming, the travelling salesman problem, logistics, some protein structure prediction problems, and automated discovery of mathematical proofs.

A nonconstructive proof, an unknown bounding polynomial, or a very high-order polynomial could have little immediate practical value. The article's cryptographic efficiency note says `O(N^2)` with a reasonable constant would be disastrous, whereas `Ω(N^4)` in almost all cases would not pose an immediate practical danger.

Stephen Cook's conditional vision is a computer that finds a formal proof of any theorem with a proof of reasonable length, because formal proof checking is polynomial-time. Donald Knuth cautioned that an equality proof would almost surely be nonconstructive.

## Cryptography

An efficient SAT solver would undermine public-key cryptography, symmetric ciphers such as AES and 3DES, and cryptographic hashing used by systems such as Bitcoin and software-update authentication. Preimage finding could become polynomial-time through reduction to SAT. Affected systems would need replacement by information-theoretically secure constructions that do not assume `P ≠ NP`.

## If P ≠ NP

A separation proof would establish that many common problems cannot be solved in polynomial time and would guide work toward approximation, partial solutions, special cases, and alternative problems. It would not itself provide faster algorithms. Much of that research focus already exists because `P ≠ NP` is widely believed.

## Average-case complexity remains open

Even `P ≠ NP` would not settle average-case hardness. SAT could require exponential time in the worst case while almost all randomly selected instances remain easy.

Russell Impagliazzo's five hypothetical worlds include:

- **Algorithmica:** `P = NP`; SAT is efficiently solvable on all instances.
- **Heuristica:** `P ≠ NP`, but NP problems are tractable in the average case.
- **Cryptomania:** `P ≠ NP`, and generating hard instances outside P is easy.
- Three intermediate worlds with different distributions of difficulty across NP-hard instances.

A Princeton University workshop in 2009 examined these five worlds.

## See also

- [NP-completeness and reductions](np-completeness-and-reductions.md)
- [Polynomial time versus practical tractability](p-versus-np-tractability-caveats.md)
- [History and current status of P versus NP](../observations/history-and-current-status-of-p-versus-np.md)

> Source: inbox/articles/P_versus_NP_problem.md · processed 2026-11-26
