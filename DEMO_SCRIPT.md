# Three-minute demo script

## 0:00–0:18 — Hook

“Most AI tutors optimize for producing an answer. With a nine-year-old, the harder problem is knowing whether the next hint is correct, age-appropriate, grounded in what the teacher approved, and still makes the child think. Gazelle Trace makes that decision inspectable.”

Show the complete studio, not slides.

## 0:18–0:45 — Teacher boundary

Point to the Grade 4 fraction objective, bound standard, and approved source count.

“The tutor cannot roam the internet or improvise a curriculum. This session is bounded to one teacher-approved objective and its evidence.”

## 0:45–1:25 — Learner work and adaptation

Use the reference attempt or upload the handwritten sample. Run diagnosis.

“The learner changed only the denominator. GPT-5.6 inspects the work, identifies the specific misconception, and proposes one visual move—not a full solution.”

Read only the short next-move prompt.

## 1:25–2:05 — Trust trace

Move right through the five gates: multimodal moderation, retrieved curriculum, deterministic answer-leakage detection, output moderation, and independent GPT-5.6 verification.

“Generation and approval are separate passes. If any gate fails, the candidate response is discarded and the learner gets a teacher handoff.”

Trigger the PII case by entering `Email me at learner@example.com about 1/4` and run it. Show that the input is held before model invocation.

## 2:05–2:32 — Codex build story

Show `AGENTS.md`, the tests, `BUILD_LOG.md`, and the repository history.

“Codex drove the event-period product narrowing, implementation, safety tests, debugging, and browser verification. I rejected its first broad rebuild plan and used the repository contract to keep every change on the judged loop.”

## 2:32–2:55 — Impact and close

“Gazelle does not claim to replace teachers. It gives them a bounded adaptive tutor whose decisions can be inspected, challenged, and improved. The learner still does the thinking; the teacher stays in control.”

End on the successful trust trace and product title.

## Recording rules

- Keep the final video between 2:35 and 2:55.
- Use the deployed production URL.
- Record at 1440p or higher with browser zoom near 90%.
- No architecture slide before the working product.
- Do not call the product COPPA-compliant or claim measured learning gains without evidence.

