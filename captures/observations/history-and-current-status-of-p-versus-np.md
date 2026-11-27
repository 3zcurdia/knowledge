# Why P versus NP remains open

P versus NP is unsolved in the article's 2026 snapshot. Its history, community evidence, and proof barriers explain both its importance and the difficulty of resolving it.

## Historical trajectory

In 1955, John Nash wrote to the National Security Agency that cracking a sufficiently complex code should take time exponential in key length; proving that claim would imply `P ≠ NP`, because a proposed key is polynomial-time verifiable. Nash also expressed skepticism that the conjecture could be proved.

In 1956, Kurt Gödel asked John von Neumann whether theorem proving—now known to be co-NP-complete—could be done in quadratic or linear time, which would automate proof discovery. Stephen Cook introduced the precise statement in 1971; Leonid Levin did so independently in 1973.

The Clay Mathematics Institute selected it as one of seven Millennium Prize Problems, with a US$1,000,000 prize for the first correct solution.

## Community evidence

Most surveyed researchers believe `P ≠ NP`. Reasons include decades without a polynomial-time algorithm for any of more than 3,000 important known NP-complete problems, and the fact that `P = NP` would imply startling consequences such as `NP = co-NP` and `P = PH`. These are evidence and intuitions, not proofs. Gasarch's exact poll results are preserved separately.

## Proof barriers

- **Relativizing proofs:** Baker, Gill, and Solovay showed in 1975 that some oracles give `P = NP` and others give `P ≠ NP`. Proofs that remain valid for every oracle cannot settle the unrelativized question.
- **Natural proofs:** Razborov and Rudich defined this circuit-lower-bound approach in 1993. If one-way functions exist, natural proofs cannot distinguish P from NP; proving one-way functions exist would be stronger than proving `P ≠ NP`.
- **Algebrizing proofs:** Aaronson and Wigderson showed in 2008 that arithmetization, the main tool behind `IP = PSPACE`, cannot resolve P versus NP.

These barriers help explain why an explicit polynomial-time algorithm for an NP-complete problem would be decisive: it would bypass the excluded proof routes.

## Independence

Some researchers suggest P versus NP could be independent of ZFC. But under the belief that some NP problems lack efficient algorithms, current independence techniques cannot succeed: independence from PA or ZFC appears no easier than proving that every NP problem has efficient algorithms.

## Claimed solutions and analogous problems

Gerhard J. Woeginger compiled 116 purported proofs from 1986–2016; none is accepted as a resolution. Exact direction counts are preserved separately. Source page: https://wscor.win.tue.nl/woeginger/P-versus-NP.htm

Other open questions include `VP vs. VNP` in algebraic complexity and `FPT vs. W[1]` in parameterized complexity. `R vs. RE` is already settled as unequal because undecidable but verifiable problems exist, such as Hilbert's tenth problem.

As of 2026, the article reports `VP ≠ VNP` as unverified. In November 2026, OpenAI and Anthropic published AI-aided proposed proofs; neither had been independently verified:

- Anthropic: https://github.com/anthropics/formal-math/tree/main/vp-vnp
- OpenAI: https://github.com/openai/math
- Report: https://www.heise.de/en/news/Math-race-Anthropic-andOpenAI-offer-near-simultaneous-proofs-of-VP-VNP-11536759.html

## See also

- [P and NP definitions](../concepts/p-versus-np-definitions.md)
- [NP-completeness and reductions](../concepts/np-completeness-and-reductions.md)
- [P versus NP researcher-poll results](../numbers/p-versus-np-researcher-polls.md)
- [P versus NP proof-claim counts](../numbers/p-versus-np-proof-claim-counts.md)

> Source: inbox/articles/P_versus_NP_problem.md · processed 2026-11-26
