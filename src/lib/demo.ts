import { LESSON, retrieveCurriculum } from "@/lib/curriculum";
import { detectAnswerLeak, makeCheck } from "@/lib/safety";
import type { AnalyzeRequest, TutorDiagnosis, TutorResult } from "@/lib/schemas";

export const DEMO_STUDENT_TEXT =
  "I wrote 1/2 = 1/4 because I changed the bottom number from 2 to 4.";

export const DEMO_FOLLOW_UP_TEXT =
  "I drew equal bars. One half covers the same length as two of the four smaller parts.";

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

export const DEMO_FOLLOW_UP_DIAGNOSIS: TutorDiagnosis = {
  observation:
    "The learner now compares equal wholes and recognizes that repartitioning changes the piece count, not the represented amount.",
  misconception: {
    code: "EQ-RATIO-RESTORED",
    label: "Repartitioning now preserves the same amount",
    evidence:
      "The follow-up explicitly compares equal-length bars and matches one larger part with two smaller parts.",
    confidence: 0.94,
  },
  isCorrect: true,
  nextMove: {
    kind: "clarifying_question",
    prompt:
      "Try the same idea with thirds and sixths. What must stay unchanged when you split the whole into more equal pieces?",
    difficulty: "step_up",
    rationale:
      "A transfer question checks whether the learner can generalize the visual relationship without receiving an answer.",
  },
  teacherAction:
    "Ask the learner to explain the rule in their own words, then test it with a new pair of fraction bars.",
};

export function buildDemoResult(
  startedAt = Date.now(),
  request?: Pick<AnalyzeRequest, "previousTurn">,
): TutorResult {
  const diagnosis = request?.previousTurn ? DEMO_FOLLOW_UP_DIAGNOSIS : DEMO_DIAGNOSIS;
  const sources = retrieveCurriculum(
    `${LESSON.question} denominator equivalent visual fraction misconception`,
  );
  const leak = detectAnswerLeak(diagnosis.nextMove.prompt, LESSON.expectedAnswerVariants);

  return {
    id: crypto.randomUUID(),
    status: "ready",
    createdAt: new Date().toISOString(),
    lesson: {
      id: LESSON.id,
      standard: LESSON.standard,
      question: LESSON.question,
    },
    diagnosis,
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
