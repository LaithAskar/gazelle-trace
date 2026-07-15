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
