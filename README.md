# Gazelle Trace

**See the mistake. Explain the next move. Prove the tutor stayed in bounds.**

Gazelle Trace is a teacher-bounded adaptive tutor for elementary math. A learner submits handwritten or typed work; GPT-5.6 identifies the misconception and produces a Socratic next step without giving away the answer. The same screen exposes a human-readable trust trace showing the curriculum evidence, adaptation rationale, and safety checks behind the response.

This repository is the OpenAI Build Week implementation. See `PRE_EXISTING_WORK.md` for the honest boundary between the earlier concept and event-period work.

The judged workflow demonstrates two bounded learner turns: a teacher approves or holds the first verified move, the learner responds, and Gazelle re-runs all five gates before adapting. A five-case judge challenge set makes privacy containment, prompt-injection resistance, weak-evidence handling, and misconception diagnosis directly testable from the UI. Teachers can export a trace without exporting the uploaded image or raw learner text.

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

The app is fully demonstrable without a key using its labeled deterministic pipeline. Add `OPENAI_API_KEY` to exercise the live GPT-5.6 vision and verification path.

## Verification

```bash
npm run typecheck
npm test
npm run lint
npm run build
npm run check:vinext
npm run build:next
npm run eval:live
```

`npm run build` produces the Vinext `dist/` artifact used by the hosted judge build. `npm run build:next` is a second compatibility check against stock Next.js.

`npm run eval:live` requires a running app at `http://127.0.0.1:3000` and refuses to count deterministic demo fallback as live evidence. Its bounded report is written to `docs/live-eval-results.json` without raw learner input or images.

For the closest local reproduction of the hosted edge runtime:

```bash
npx wrangler dev dist/server/index.js --assets dist/client --local
```

## How Codex is being used

Codex is driving the event-period implementation from the repository's `AGENTS.md`: product scoping, architecture, UI, OpenAI integration, safety invariants, test generation, debugging, browser verification, and submission preparation. `BUILD_LOG.md` records the major decisions rather than pretending every generated line was automatically correct.

## Current product boundary

The submission focuses on one polished, two-turn workflow for fourth-grade fraction equivalence. It deliberately does not attempt to be a complete LMS, parent portal, or universal K–6 curriculum.

## License

MIT. See `LICENSE`.
