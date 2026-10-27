# A Philosophy of Software Design – Key Insights and Action Checklist

Actionable synthesis of John Ousterhout's *A Philosophy of Software Design* (first edition, 2018), distilled from 21 chapter study summaries. It keeps only what changes behavior: core principles plus the review checklists. Invented chapter examples, provenance footers, and saved-note IDs are dropped. Exact values (e.g. 10–20% investment guidance, RAMCloud project results) are preserved as stated and flagged as non-guarantees.

## 1. Complexity is the constraint

Software is limited by what people can understand. Complexity is anything that makes code hard to understand or change — not size. Judge simplicity from the reader's view, never the author's.

Symptoms: change amplification (one change, many edits), cognitive load (knowledge a task demands), unknown unknowns (hidden facts that make a change look done while wrong). Causes: unnecessary dependencies and obscurity (important facts not obvious). Frequency matters: complexity in rarely-touched stable code costs less than in hot paths. Accumulation happens through many small shortcuts; shorter code alone does not fix it.

- [ ] Count edit locations for one recent policy change (amplification check).
- [ ] Ask a newcomer what knowledge a task required; note surprises.
- [ ] Name one undocumented assumption, unit, or boundary and document it.
- [ ] Find one repeated rule or special case to remove.

## 2. Invest strategically, improve while changing

Working code is not enough: a fast feature can tax everyone who touches it later. Prefer strategic programming (design quality as a goal alongside delivery) over tactical programming (immediate completion at design's expense). Ousterhout suggests spending about 10–20% of development time on design investment — guidance, not a measured guarantee. Make many small continuous improvements; do not design the whole future system in advance. Do not reward visible output alone; fast code that leaves cleanup for colleagues is expensive.

Treat every change as a design decision, not just a diff that works. Small patches can add special cases and dependencies; prefer the structure the system would have if the new requirement had been known. Keep explanations in the code (one main location plus short references), not only in commit messages. Check the full diff for stale comments and temporary code before committing.

- [ ] Name the shortcut in the current task that raises future modification cost.
- [ ] Compare two designs before accepting the first working solution.
- [ ] Fold one small structural repair into the current work plan.
- [ ] Check whether the change adds an avoidable special case; update nearby comments.

## 3. Build deep modules with honest boundaries

A good module hides substantial work behind a simple interface. Depth is capability versus interface cost, not lines of code. Count behavioral requirements (restrictions, errors, call order, crash guarantees) as interface complexity, not just signatures. Prefer depth over classitis (splitting into tiny classes with no benefit). Keep common use simple; rare options must not burden every caller. Never hide guarantees callers genuinely need (e.g. when data is safe after a crash).

Give each important design decision one clear owner (information hiding); spreading it across modules is leakage — even without public exposure, e.g. two modules encoding the same file format. Group by shared knowledge, not execution order (temporal decomposition misleads). Expose meaningful operations and sensible defaults instead of internal collections. Make modules somewhat general-purpose: cover current needs through broadly useful operations (e.g. delete-range over backspace/delete-selection variants), keeping caller-specific workflow out — without building speculative generality or piling on confusing arguments.

Each layer must provide a different useful view that justifies its learning cost. Watch pass-through methods, decorators, and pass-through variables as warning signs (not automatic errors); repair by exposing the lower component, moving responsibility, or merging. Selection (dispatchers) and real translation add value even when signatures match. Prefer reducing total system complexity over minimizing one class: combine code that shares knowledge, separate unrelated responsibilities, and split methods only when the extracted piece is independently understandable — never by length alone. When shared difficulty fits a module's purpose, pull it downward into that module (one `save(settings)` owning temp-file replacement beats three callers repeating it); prefer automatic behavior over settings callers cannot choose better.

- [ ] List everything needed to use an interface, including informal rules; weigh it against capability provided.
- [ ] Find one decision represented in two modules and give it a single owner.
- [ ] Trace one operation through layers; state each layer's distinct value.
- [ ] For each setting, justify why callers choose it better than the module.
- [ ] Read each extracted method without its caller; confirm it stands alone.

## 4. Simplify errors, then compare two designs

Reduce error-handling burden by design: first ask whether an operation can be defined so the error case becomes normal behavior (e.g. ensure-absent instead of remove-must-exist). Recover inside the module (masking) only when callers need nothing hidden, or aggregate handling at one shared boundary — rarely-executed handlers are hard to test, so fewer mechanisms can mean more reliability. Never conceal failures that change a caller's decision; deliberate termination with diagnostics suits only contexts where recovery is not the point.

Never commit to the first plausible design for an important decision. Sketch at least two substantially different approaches (interface and implementation judged separately: interfaces by caller ease on real tasks, implementations by simplicity and performance), compare on the same caller tasks, and record trade-offs. An unattractive alternative still exposes assumptions; comparison may reveal a third option. Scale effort to the decision: a short sketch for a class, deeper work for a system boundary.

- [ ] Check whether one error case can become useful normal behavior.
- [ ] Merge repeated handlers into one recovery path; confirm hidden failures cannot mislead callers.
- [ ] Sketch two meaningfully different approaches before detailed implementation.
- [ ] Evaluate both against identical caller tasks; record why the winner won.

## 5. Document intent: comments that add, names that predict

Comments preserve design knowledge code cannot express: intent, boundaries, valid use, reasons. Readable code and good names do not replace them. Good documentation lowers cognitive load and exposes unknown unknowns. Answer the four excuses: readable code still leaves questions; documentation is investment, not postponement; keep comments near code, avoid duplication, review them; the fix for worthless comments is better comments.

Write comments that add information at a different level than the code: precise details (units, range boundaries, absent values, ownership, side effects, preconditions, exceptions, invariants, performance characteristics callers can rely on) and larger purpose/reasons internals need. Separate interface documentation from implementation detail. Centralize cross-module rules with references instead of copies. Treat reader confusion as evidence: improve the comment or the code. Write interface comments and signatures before method bodies — comments-first designs the abstraction early, and an interface that is hard to describe clearly signals a design worth rethinking. Difficulty naming a thing likewise exposes confused design (a value hiding two concepts that should split).

Choose names that make the reader's first guess correct: precise but not overspecialized, one term per meaning, Boolean names stating what true means (e.g. `isPlaying`), units in names (e.g. `playbackTimeMs` vs `markerPixelX`), wider scope earning more description. Reader understanding is the test, not author brevity.

- [ ] Have a new reader explain rules from documentation alone; fix gaps.
- [ ] Delete comments that merely repeat names or statements.
- [ ] Verify units, boundaries, ownership, side effects, preconditions on every public operation.
- [ ] Show each name without its implementation; check the first interpretation.
- [ ] Write the interface comment before the body; if the explanation stays confusing, redesign.

## 6. Keep code obvious and consistent

Obvious means a reader grasps meaning on first reading — the reader decides, not the author. Familiarity blinds authors; review feedback reveals obscurity. Help with precise names, consistent conventions, scannable whitespace, and comments for what code cannot clarify. Document indirect execution (event handlers: when each runs, under what conditions) and surprising behavior (e.g. background work outliving its creator). Prefer named result structures over generic pairs when element names hide meaning.

Do similar things in similar ways; make genuinely different things look different. Consistency (names, formatting, interfaces, data rules like one unit convention converted at boundaries) lets readers reuse knowledge — but forced uniformity that equates different concepts causes bugs. Write conventions down, check automatically where possible, review the rest, study a file before changing it, and never introduce a competing convention on preference; a replacement needs team agreement plus migration of existing uses.

- [ ] Ask a reviewer to explain code after one quick read; fix what they miss.
- [ ] Compare new names/structures against neighboring code before committing.
- [ ] Confirm conventions are documented and checked; flag similar-looking values with different meanings.

## 7. Judge practices and performance by evidence

Evaluate every practice by its effect on complexity; popularity proves nothing (author's judgments below, not universal facts). Favor incremental development with feedback, but ensure iterations build coherent abstractions, not just isolated features via quick patches. Strongly support unit tests (they make structural change safe) while distinguishing them from TDD, which the author criticizes as letting one-test-at-a-time pass displace broader design — yet still write a failing test before fixing a bug to prove it detects the problem. Prefer composition over implementation inheritance when reuse would couple children to parent internals; use patterns, getters/setters only where they fit rather than by habit.

Aim for clean design and adequate speed together. Prefer equally-clear efficient alternatives and learn relative costs (network, storage, allocation, cache misses), but tune only from measurement: record a representative baseline, locate the specific dominating cost, seek a fundamental fix (better algorithm) first, then shape a clean common-path structure with uncommon handling moved aside. Keep added complexity only when the measured benefit justifies it; remove tuning that fails that test. Reported illustration: the book's RAMCloud Buffer redesign made operations about twice as fast while code size fell about 20% — project-specific results, not guarantees.

- [ ] State the complexity each adopted practice removes or adds.
- [ ] Confirm iterations improve a coherent abstraction, not just pass feature tests.
- [ ] Record a baseline before tuning; re-measure the same workload after each change.
- [ ] Compare speed, correctness, and complexity together before keeping an optimization.

## Limits and caveats

- A deep module is not simply a long class; fewer methods do not always simplify.
- Information hiding must not conceal guarantees callers need.
- Combining code helps only when the resulting boundary is coherent; splitting is not automatically cleaner.
- Defining an error away is not swallowing an exception.
- Consistency must not make different concepts look equivalent.
- Unit tests, TDD, and design quality are distinct topics; the author's pro-unit-test / anti-TDD stance is his position.
- Numerical guidance (10–20%) and project results (RAMCloud) are not transferable guarantees.
- Design principles are judgment aids, not absolute rules; no single rule guarantees a good result.

> Source: inbox/articles/psd/shared_00_README.md.md + shared_01–21 chapter summaries · processed 2026-10-27
