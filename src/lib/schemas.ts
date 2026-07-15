import { z } from "zod";

export const CurriculumSourceSchema = z.object({
  id: z.string(),
  standard: z.string(),
  title: z.string(),
  excerpt: z.string(),
  url: z.string().url(),
});

export const CheckStatusSchema = z.enum(["passed", "failed", "not_run"]);

export const TraceCheckSchema = z.object({
  id: z.enum([
    "input_moderation",
    "curriculum_grounding",
    "answer_leakage",
    "output_moderation",
    "independent_verification",
  ]),
  label: z.string(),
  status: CheckStatusSchema,
  detail: z.string(),
});

export const TutorDiagnosisSchema = z.object({
  observation: z
    .string()
    .describe("A concise description of what the learner's work shows."),
  misconception: z.object({
    code: z.string().describe("A short stable misconception identifier."),
    label: z.string().describe("A teacher-readable misconception label."),
    evidence: z
      .string()
      .describe("Specific evidence from the submitted work, without inventing details."),
    confidence: z.number().min(0).max(1),
  }),
  isCorrect: z.boolean(),
  nextMove: z.object({
    kind: z.enum(["visual_model", "clarifying_question", "worked_step", "teacher_handoff"]),
    prompt: z
      .string()
      .describe("One short, age-appropriate Socratic prompt that does not reveal the answer."),
    difficulty: z.enum(["step_back", "hold", "step_up"]),
    rationale: z.string().describe("Why this is the right next pedagogical move."),
  }),
  teacherAction: z.string().describe("One concrete action the teacher can take next."),
});

export const VerificationSchema = z.object({
  approved: z.boolean(),
  grounded: z.boolean(),
  ageAppropriate: z.boolean(),
  answerLeakDetected: z.boolean(),
  diagnosisSupported: z.boolean(),
  notes: z.string(),
});

export const AnalyzeRequestSchema = z
  .object({
    lessonId: z.literal("fraction-equivalence-4nf1"),
    studentText: z.string().trim().max(1200).optional().default(""),
    imageDataUrl: z
      .string()
      .max(5_500_000)
      .refine(
        (value) => /^data:image\/(png|jpe?g|webp);base64,/i.test(value),
        "Image must be a PNG, JPEG, or WebP data URL.",
      )
      .optional(),
    forceDemo: z.boolean().optional().default(false),
  })
  .refine((value) => value.studentText.length > 0 || Boolean(value.imageDataUrl), {
    message: "Submit typed work or an image.",
    path: ["studentText"],
  });

export const TutorResultSchema = z.object({
  id: z.string(),
  status: z.enum(["ready", "blocked"]),
  createdAt: z.string(),
  lesson: z.object({
    id: z.string(),
    standard: z.string(),
    question: z.string(),
  }),
  diagnosis: TutorDiagnosisSchema,
  trace: z.object({
    engine: z.enum(["live", "demo", "safety_fallback"]),
    primaryModel: z.string(),
    verifierModel: z.string(),
    durationMs: z.number().int().nonnegative(),
    sources: z.array(CurriculumSourceSchema),
    checks: z.array(TraceCheckSchema),
  }),
});

export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type CurriculumSource = z.infer<typeof CurriculumSourceSchema>;
export type TraceCheck = z.infer<typeof TraceCheckSchema>;
export type TutorDiagnosis = z.infer<typeof TutorDiagnosisSchema>;
export type TutorResult = z.infer<typeof TutorResultSchema>;
export type Verification = z.infer<typeof VerificationSchema>;

