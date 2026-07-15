# Gazelle Trace — Codex working agreement

This repository is the OpenAI Build Week implementation of Gazelle Trace. The product must remain a narrow, judgeable vertical slice rather than expanding into a general LMS.

## Product invariant

The core demo is: teacher-bounded lesson → student work image/text → misconception diagnosis → Socratic next move → visible trust trace → teacher action.

If a proposed feature does not strengthen that loop or the submission evidence, do not build it before the deadline.

## Safety invariants

- Never expose a stored expected answer in a student-facing hint.
- Treat model output as untrusted until schema validation, moderation, answer-leakage checks, and verification finish.
- Fail closed. A failed live call returns a clearly labeled deterministic demo response, never partially validated model text.
- Do not claim COPPA compliance. Describe concrete privacy and parent/teacher-control mechanisms only.
- Never log images, student free text, or API keys.

## Engineering rules

- Use GPT-5.6 through the OpenAI Responses API for live diagnosis.
- Keep the deterministic pipeline behaviorally aligned with the live schema so the demo stays judgeable.
- Every user-visible model claim must map to a field in the trust trace.
- Prefer focused modules and pure functions for retrieval, leakage detection, and fallback behavior.
- Run `npm run typecheck`, `npm test`, `npm run lint`, and `npm run build` before a handoff.
- Record meaningful product and engineering decisions in `BUILD_LOG.md`.

## Scope exclusions before submission

- No iOS client.
- No parent portal.
- No generalized course authoring.
- No multi-tenant school administration.
- No vector database unless retrieval quality demonstrably requires it.

