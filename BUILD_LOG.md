# Build log

## 2026-07-15 — Scope and architecture

- Rejected a six-day rebuild of the full K–6 monorepo, iOS surface, parent portal, and pgvector migration.
- Chose a single Next.js application so judges can run and inspect one coherent product.
- Narrowed the demo to fourth-grade fraction reasoning and handwritten-work diagnosis.
- Chose GPT-5.6 Sol for primary multimodal diagnosis and GPT-5.6 Terra for independent verification.
- Added deterministic demo behavior because a prize submission must remain testable during API or quota failures.
- Defined the trust trace as a product surface, not an internal log: sources, model decision, moderation, answer-leakage check, grounding, and verification are visible.

