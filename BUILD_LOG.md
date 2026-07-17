# Build log

## 2026-07-15 — Scope and architecture

- Rejected a six-day rebuild of the full K–6 monorepo, iOS surface, parent portal, and pgvector migration.
- Chose a single Next.js application so judges can run and inspect one coherent product.
- Narrowed the demo to fourth-grade fraction reasoning and handwritten-work diagnosis.
- Chose GPT-5.6 Sol for primary multimodal diagnosis and GPT-5.6 Terra for independent verification.
- Added deterministic demo behavior because a prize submission must remain testable during API or quota failures.
- Defined the trust trace as a product surface, not an internal log: sources, model decision, moderation, answer-leakage check, grounding, and verification are visible.
- The first hosted build correctly rejected a plain Next.js server bundle. An OpenNext attempt then exposed missing runtime chunks in its Windows output, so it was not shipped.
- Switched the deployment compiler to Vinext, which is explicitly supported by the hosting target. The compatibility scan reports 94% support with zero blocking issues; both the static page and API routes run from the production `dist/` bundle.
- Added a post-build packaging step that copies the checked-in Sites manifest into `dist/.openai/`, as required by the hosted artifact contract.
- Wrapped Vinext's bare request handler in a standard module Worker `fetch()` export and kept non-handler metadata private; Cloudflare otherwise treats the function as a `WorkerEntrypoint` class and named metadata values as RPC entrypoints during isolate startup.
- Verified the packaged artifact inside Wrangler's local Workers runtime: page, health endpoint, and tutor analysis all returned HTTP 200.
- Forwarded Cloudflare's execution context into Vinext's request handler so dynamic routes receive `waitUntil()` and request-lifecycle semantics in the hosted runtime.
- Bundled the OpenAI and Zod runtime dependencies into `dist/`; hosted Sites artifacts do not ship the repository's `node_modules`, even though local Wrangler can resolve them.
- Expanded the release evidence with a live-case eval matrix and a timed three-minute demo script.

## 2026-07-16 — Adaptive proof and judge controls

- Added a bounded second learner turn instead of expanding curriculum breadth. The follow-up carries only prior learner evidence, the approved tutor prompt, and a misconception code; all context is treated as untrusted and re-runs the complete safety pipeline.
- Added a visible five-case judge challenge set with explicit expected-versus-observed outcomes for misconception diagnosis, weak evidence, privacy, and prompt injection.
- Added teacher approve/hold controls and a local audit export that excludes uploaded images and raw learner text.
- Added a reproducible live-eval runner that fails any model-backed case using demo fallback. The first run exposed two conservative verifier holds; prompts were clarified without weakening verification, and the final live slice passed 5/5.
- Added the missing MIT license required for a judgeable public repository.

## 2026-07-17 — Submission hardening

- Changed the hosted access policy from owner-only to public so judges can test without credentials.
- Added a bundled, non-identifying handwritten worksheet and a one-click `Use safe sample` path to make the multimodal claim directly testable.
- Expanded the live release matrix from five text-oriented cases to twelve text-and-image cases, including unreadable work and prompt injection inside an image.
- Corrected the prompt-injection rubric to count any visible fail-closed verification hold, not only a deterministic leakage-gate rejection.
- Tightened the primary and verifier instructions after the expanded matrix showed an unrelated science request being redirected into a fraction exercise instead of handed to a teacher.
- Rewrote the README around a 60-second judge path, explicit Codex collaboration, honest limitations, and public testing instructions.
- Prepared final Devpost copy and a timed 2:55 recording script; public YouTube publication remains an entrant-owned submission step.
- A first production run exposed nondeterministic false-positive leakage holds on the weak-evidence and second-turn cases. Tightened both generation and verification rubrics around neutral justification and transfer questions, and raised verifier reasoning effort rather than adding retries or silently counting safe holds as pedagogical passes.
