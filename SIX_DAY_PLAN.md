# Six-day competition plan

The deadline is July 21, 2026 at 5:00 PM Pacific. The rule for this sprint is simple: no new surface area unless it improves the three-minute judging story.

## Day 1 — vertical slice and risk removal

- Ship the complete teacher-bound tutoring loop.
- Make the GPT-5.6 diagnosis, deterministic guardrails, verifier, and trust trace inspectable.
- Add a reference mode so judges never see a dead screen.
- Establish tests, eval cases, architecture evidence, and a reproducible hosted bundle.

Exit criterion: the reference scenario runs end to end locally and from a private deployment.

## Day 2 — live-model evidence

- Add the production `OPENAI_API_KEY` to hosting.
- Execute every case in `EVALS.md` against the live GPT-5.6 pipeline.
- Save pass/fail evidence and repair prompt or policy failures.
- Test one real handwritten fraction attempt on desktop and mobile.

Exit criterion: zero answer leaks, PII blocked before model calls, unsupported or ambiguous work held for a teacher, and the happy path passes repeatedly.

## Day 3 — demo-grade UX

- Fix only issues observed in live testing.
- Verify narrow mobile, laptop, keyboard navigation, contrast, loading, and failure states.
- Reduce the trust trace to what a judge can understand in under 20 seconds.

Exit criterion: a first-time viewer understands the teacher boundary, student misconception, guarded hint, and teacher action without narration.

## Day 4 — outside validation

- Put the product in front of at least one elementary teacher or tutor and one neutral technical reviewer.
- Ask them to explain what the product does, what they trust, and what they do not trust.
- Record objections; fix the highest-leverage credibility problem only.

Exit criterion: both reviewers can state the differentiator accurately after a two-minute use.

## Day 5 — submission package

- Record the under-three-minute demo using `DEMO_SCRIPT.md`.
- Prepare the Devpost description, architecture image, repository, attribution, and Codex usage evidence.
- Create the required `/feedback` session and record its session ID.
- Rehearse once with the network disabled to prove reference-mode resilience.

Exit criterion: every submission field is complete and the video is comfortably below the time limit.

## Day 6 — freeze and submit

- Stop feature work.
- Run type checking, tests, lint, both production builds, and the live eval matrix.
- Deploy the exact tested commit and smoke-test the judge URL in a clean browser.
- Submit at least four hours before the deadline; use the remaining time only for submission defects.

Exit criterion: deployed SHA, repository SHA, demo video, and Devpost description all describe the same build.

## Explicit cuts

- No parent portal, general LMS, vector database, voice tutor, multi-grade curriculum, autonomous agent swarm, or native mobile app.
- No claim that reference-mode output is live-model evidence.
- No expansion beyond Grade 4 fraction comparison until the judged loop is proven.
