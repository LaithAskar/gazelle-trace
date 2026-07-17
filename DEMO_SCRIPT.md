# Final demo video — 2:55 maximum

Record the deployed public URL at 1440p or higher with browser zoom near 90%. Hide bookmarks and notifications. Wait until the top-right pill says **GPT-5.6 ready**. Do not record in reference mode.

## 0:00–0:15 — Hook

**Say:** “Most AI tutors optimize for producing an answer. With a nine-year-old, the harder problem is proving the next hint is grounded, age-appropriate, and still makes the learner think. Gazelle Trace makes that decision inspectable.”

**Show:** Product title and complete studio. Do not begin with slides.

## 0:15–0:32 — Teacher boundary

**Say:** “This session is bounded to one teacher-approved Grade 4 objective and four curated sources. The tutor cannot browse for a curriculum or improvise a lesson.”

**Show:** Objective, standard, and approved-source indicators in the left rail.

## 0:32–1:05 — Real handwritten diagnosis

Click **Use safe sample**, then **Diagnose the misconception**.

**Say:** “This is a bundled, non-identifying handwritten sample. GPT-5.6 reads the image, recognizes that the learner changed only the denominator, and proposes one visual step instead of revealing the answer.”

Read only the short learner-facing next move. Let the live call finish on screen; a clean cut over dead waiting time is acceptable.

## 1:05–1:35 — Trust trace

**Say:** “Before that move appears, the input is moderated, the response is grounded in approved curriculum, deterministic code checks for stored-answer leakage, the output is moderated, and a separate GPT-5.6 pass independently verifies the evidence and age level. Generation and approval have different authority.”

**Show:** Five passed gates, retrieved evidence, model label, and duration.

## 1:35–2:00 — Prove adaptation

Click **Approve next move**, then **Trace the adaptation** using the prefilled follow-up.

**Say:** “The teacher decides whether the move advances. The learner’s second response is treated as new untrusted evidence and runs through every gate again. Only after the reasoning changes does Gazelle step up to a transfer question.”

**Show:** Turn-one to turn-two adaptation strip and second verified trace.

## 2:00–2:20 — Fail closed

Select **Privacy trap** and run it.

**Say:** “A contact detail is blocked locally before any learner text reaches a model. Every failure becomes a visible teacher handoff—not partially validated model output.”

**Show:** Held status and failed privacy gate.

## 2:20–2:43 — Codex build story

**Say:** “Codex drove the event-period implementation, tests, hosting diagnosis, adversarial evals, and submission packaging. I rejected its first broad LMS rebuild plan, enforced the repository safety contract, and required live evidence. The final release runs a twelve-case text-and-image matrix and never counts reference fallback as a live pass.”

**Show:** Brief cuts of `AGENTS.md`, `BUILD_LOG.md`, tests, and `docs/live-eval-results.json`.

## 2:43–2:55 — Close

**Say:** “Gazelle does not replace teachers. It gives them a bounded adaptive tutor whose decisions can be inspected, challenged, and improved. The learner still does the thinking; the teacher stays in control.”

End on the successful trust trace and product title.

## Upload checklist

- Public YouTube visibility—not unlisted if the form requires publicly visible.
- Runtime under 3:00; target 2:45–2:55.
- Spoken audio explicitly covers both Codex and GPT-5.6.
- No copyrighted music, student identity, notifications, API keys, or third-party marks.
- Title: `Gazelle Trace — OpenAI Build Week 2026 Demo`
- Suggested description: `Gazelle Trace is a teacher-bounded GPT-5.6 tutor that diagnoses handwritten reasoning, proposes one verified Socratic move, and exposes an auditable trust trace. Built with Codex for OpenAI Build Week.`
