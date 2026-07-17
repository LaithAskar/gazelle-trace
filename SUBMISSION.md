# Devpost submission copy

## Project name

Gazelle Trace

## Tagline

Diagnose the misconception. Give one bounded next move. Prove why the tutor was allowed to show it.

## Category

Education

## What it does

Gazelle Trace is a teacher-bounded adaptive math tutor for elementary learners. A student submits typed or handwritten work. GPT-5.6 identifies the observable misconception and proposes one short Socratic next step without revealing the stored answer. A separate verification pass and deterministic policy gates decide whether that move may reach the learner.

The product exposes that decision as a human-readable trust trace: input moderation, teacher-approved curriculum evidence, answer-leakage detection, output moderation, and independent verification. The teacher may approve or hold the move, and a second learner response re-runs the complete pipeline before the tutor adapts difficulty.

## The problem

The risk in elementary tutoring is not merely that a model can be wrong. A fluent hint can be ungrounded, too advanced, privacy-invasive, or so complete that it removes the learning. Teachers need to inspect why a tutor chose its next move and retain control over whether it advances.

Gazelle addresses that narrow problem instead of pretending to replace a teacher or build an entire LMS in one week.

## How it works

1. A deterministic PII screen prevents contact information from reaching any model.
2. `omni-moderation-latest` screens learner text and images.
3. The app retrieves only teacher-approved lesson evidence.
4. GPT-5.6 produces a Zod-validated structured diagnosis and one learner move through the Responses API.
5. Deterministic code rejects stored-answer variants in the learner-facing prompt.
6. The proposed prompt is moderated again.
7. A separate GPT-5.6 verification pass approves or rejects evidence support, grounding, age level, and non-leakage.
8. Only the fully validated candidate reaches the learner; every other path becomes a teacher handoff.

## How Codex was used

Codex drove the submission-period implementation: product scoping, Next.js/Vinext UI, typed OpenAI integration, safety policies, tests, live-eval automation, Worker packaging, deployment debugging, and judge materials.

The most important collaboration was corrective rather than generative. I rejected the initial broad rebuild of the pre-existing K–6 concept and enforced a repository contract that kept Codex on one judgeable workflow. When hosted Next.js and OpenNext artifacts failed, Codex isolated the runtime problem and moved to Vinext only after reproducing the Worker locally. When live evals exposed conservative verifier holds and an out-of-scope routing miss, prompts were tightened without weakening the approval boundary. Reference fallback is never counted as live GPT-5.6 evidence.

## What makes it different

Most tutor demos end when the model generates a plausible answer. Gazelle treats generation as the beginning of the decision. The visible trust trace, separate verifier authority, deterministic answer-leak policy, teacher checkpoint, two-turn adaptation, and runnable judge challenge set make the core claim directly testable.

## Accomplishments

- Built a coherent, public two-turn product instead of a technical chat prototype.
- Shipped real multimodal GPT-5.6 diagnosis and independent verification.
- Added a bundled non-identifying handwritten sample for one-click judge testing.
- Created a twelve-case live text-and-image release matrix covering diagnosis, weak evidence, adaptation, unreadable work, privacy, prompt injection, threatening content, answer containment, grounding, and age level.
- Packaged the Next.js application as a self-contained Cloudflare Worker-compatible artifact.
- Preserved an explicit boundary between pre-existing product ideas and submission-period work.

## Challenges and lessons

The hardest engineering problem was not the happy-path model call. It was maintaining one consistent authority boundary across structured generation, deterministic rejection, independent verification, and the hosted edge runtime. The live evaluation also showed why a passing unit suite is insufficient: model behavior can be safe but fail an over-specific rubric, or remain grounded while choosing the wrong product action. We repaired both the evaluator and the product prompt based on observed evidence.

The product lesson was scope. The broad concept was weaker as a competition entry because judges could not falsify its claims. One lesson, two learner turns, five visible gates, and a challenge set are more credible than a week of superficial LMS features.

## What is next

The next step is not adding more grades. It is educator validation: measure teacher agreement on diagnosis and next-move quality, study false holds, define provider-retention and deletion controls, and only then expand curriculum breadth. Gazelle does not claim COPPA compliance or measured learning gains from this prototype.

## Links

- Live demo: https://gazelle-trace.laith-askar.chatgpt.site
- Source: https://github.com/LaithAskar/gazelle-trace
- Demo video: **ADD PUBLIC YOUTUBE URL**
- Codex `/feedback` session ID: **ADD BEFORE SUBMISSION**

## Testing instructions

Open the live demo, wait for `GPT-5.6 ready`, click `Use safe sample`, and run the diagnosis. Inspect all five gates, approve the move, and trace turn two. Then select `Privacy trap` and confirm that the attempt is held before model invocation. No API key or test account is required.
