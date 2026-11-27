# P versus NP

P versus NP asks whether every problem whose solution can be checked quickly can also be solved quickly. It is one of the most important open questions in computer science.

## Core idea

- **P** problems are decision problems that a computer can solve in a reasonable amount of time as the input grows.
- **NP** problems are decision problems where, if the answer is "yes," there is a solution or proof that a computer can check quickly.
- Every P problem is also in NP, because a problem you can solve quickly can also be checked quickly. The open question is the reverse: are there NP problems that can be checked quickly but cannot be solved quickly?

A useful analogy is Sudoku. Checking a completed grid is easy; finding the solution from scratch can be much harder. The question is whether that gap is real for all such problems, or whether a fast general solving method exists but has not been found.

## NP-complete problems

Some NP problems are special because they capture the full difficulty of NP. These are called **NP-complete** problems.

- A problem is **NP-complete** if it is in NP and every other NP problem can be translated into it efficiently.
- A problem is **NP-hard** if every NP problem can be translated into it efficiently, even if it is not itself in NP.
- **Reduction** means converting one problem into another so that solving the second solves the first. If any NP-complete problem ever gets a fast general solution, then every NP problem gets one.

Boolean satisfiability (SAT) was the first problem proved NP-complete. Many familiar problems, including generalized Sudoku, traveling salesman decision variants, and scheduling problems, are connected through reductions.

## Why it matters

- **If P equals NP:** A fast general method for NP-complete problems would transform optimization, logistics, protein structure prediction, and automated proof discovery. It would also break most widely used cryptography, because many security systems rely on problems being easy to verify but hard to solve.
- **If P does not equal NP:** It would confirm that some problems have no fast general solution, reinforcing the need for approximation, heuristics, special cases, and alternative problem formulations. Most modern cryptography would remain on firm theoretical ground.
- **Practical caveat:** Even a proof that P equals NP might not help in practice if the method is too complex, nonconstructive, or only fast in theory.

## Current status

P versus NP remains unsolved. It is one of the Clay Mathematics Institute Millennium Prize Problems, with a one-million-dollar prize for a correct solution.

Most researchers believe P does not equal NP. William Gasarch's polls showed belief in P not equal to NP rising from 61% in 2001 to 88% in 2018; among experts in 2018, 99% believed P does not equal NP. Decades of work have produced no fast general algorithm for any NP-complete problem, but belief and lack of counterexamples are not proof.

Many claimed proofs have been published, but none has been accepted. Gerhard Woeginger cataloged 116 purported proofs from 1986 to 2016: 61 claiming P equals NP, 49 claiming P does not equal NP, and 6 claiming other results.

## Concepts worth remembering

- **Easy to check is not the same as easy to solve.** Verification and discovery are different tasks.
- **NP-complete problems are the pressure points.** One fast breakthrough there would change everything in NP.
- **Reductions connect problems.** They show that many hard problems are different faces of the same computational difficulty.
- **The answer changes more than theory.** Cryptography, optimization, and mathematical discovery all depend on the outcome.
- **Open means open.** Strong community belief is evidence of difficulty, not a proof.

## See also

- [Conway's Law](conways-law.md)
- [Occam's razor](occams-razor.md)

> Source: inbox/articles/P_versus_NP_problem.md · processed 2026-11-26 · merged captures/concepts/p-versus-np-definitions.md, captures/concepts/np-completeness-and-reductions.md, captures/concepts/consequences-of-resolving-p-versus-np.md, captures/observations/p-versus-np-complexity-landscape-status.md, captures/observations/history-and-current-status-of-p-versus-np.md, captures/numbers/p-versus-np-researcher-polls.md, captures/numbers/p-versus-np-proof-claim-counts.md · 2026-11-27
