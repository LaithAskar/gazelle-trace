import { LESSON, retrieveCurriculum } from "@/lib/curriculum";
import { detectAnswerLeak, makeCheck } from "@/lib/safety";
import type { TutorDiagnosis, TutorResult } from "@/lib/schemas";

export const DEMO_STUDENT_TEXT =
  "I wrote 1/2 = 1/4 because I changed the bottom number from 2 to 4.";

export const DEMO_DIAGNOSIS: TutorDiagnosis = {
  observation:
    "The learner changed the denominator from 2 to 4 while leaving the numerator unchanged.",
  misconception: {
    code: "EQ-DENOMINATOR-ONLY",
    label: "Changed the denominator without preserving the ratio",
    evidence:
      "The explanation treats changing the number of equal parts as sufficient, but does not account for how many of the smaller parts represent the same amount.",
    confidence: 0.96,
  },
  isCorrect: false,
  nextMove: {
    kind: "visual_model",
    prompt:
      "Draw two equal-length bars. Shade one half of the first bar, then split the second bar into four equal parts. How many of those smaller parts cover the same length?",
    difficulty: "step_back",
    rationale:
      "An equal-whole visual makes the unchanged amount visible before the learner returns to symbols.",
  },
  teacherAction:
    "Ask the learner to explain what changed and what stayed the same after repartitioning the bar.",
};

export function buildDemoResult(startedAt = Date.now()): TutorResult {
  const sources = retrieveCurriculum(
    `${LESSON.question} denominator equivalent visual fraction misconception`,
  );
  const leak = detectAnswerLeak(DEMO_DIAGNOSIS.nextMove.prompt, LESSON.expectedAnswerVariants);

  return {
    id: crypto.randomUUID(),
    status: "ready",
    createdAt: new Date().toISOString(),
    lesson: {
      id: LESSON.id,
      standard: LESSON.standard,
      question: LESSON.question,
    },
    diagnosis: DEMO_DIAGNOSIS,
    trace: {
      engine: "demo",
      primaryModel: "deterministic reference pipeline",
      verifierModel: "deterministic policy verifier",
      durationMs: Math.max(1, Date.now() - startedAt),
      sources,
      checks: [
        makeCheck(
          "input_moderation",
          "Input moderation",
          true,
          "Reference attempt contains no harmful-content signal.",
        ),
        makeCheck(
          "curriculum_grounding",
          "Curriculum grounding",
          sources.length > 0,
          `${sources.length} teacher-approved sources retrieved.`,
        ),
        makeCheck(
          "answer_leakage",
          "Answer leakage",
          leak === null,
          leak ? `Blocked answer variant: ${leak}` : "The next move does not reveal a stored answer.",
        ),
        makeCheck(
          "output_moderation",
          "Output moderation",
          true,
          "Reference prompt contains no harmful-content signal.",
        ),
        makeCheck(
          "independent_verification",
          "Independent verification",
          true,
          "Diagnosis is supported, grounded, age-appropriate, and safe to show.",
        ),
      ],
    },
  };
}

