import { describe, expect, it } from "vitest";
import { AnalyzeRequestSchema } from "@/lib/schemas";
import { analyzeAttempt } from "@/lib/tutor-pipeline";

describe("tutor pipeline", () => {
  it("returns a schema-compatible reference result without an API key", async () => {
    const request = AnalyzeRequestSchema.parse({
      lessonId: "fraction-equivalence-4nf1",
      studentText: "I changed the bottom number from 2 to 4.",
      forceDemo: true,
    });

    const result = await analyzeAttempt(request);

    expect(result.status).toBe("ready");
    expect(result.trace.engine).toBe("demo");
    expect(result.trace.checks.every((check) => check.status === "passed")).toBe(true);
  });

  it("fails closed on contact details even when reference mode is forced", async () => {
    const request = AnalyzeRequestSchema.parse({
      lessonId: "fraction-equivalence-4nf1",
      studentText: "My answer is 1/4. Email me at learner@example.com",
      forceDemo: true,
    });

    const result = await analyzeAttempt(request);

    expect(result.status).toBe("blocked");
    expect(result.trace.engine).toBe("safety_fallback");
    expect(result.trace.checks[0]?.status).toBe("failed");
  });

  it("adapts a second reference turn after the learner revises their reasoning", async () => {
    const request = AnalyzeRequestSchema.parse({
      lessonId: "fraction-equivalence-4nf1",
      studentText:
        "I drew equal bars. One half covers the same length as two of the four smaller parts.",
      previousTurn: {
        learnerText: "I changed only the bottom number.",
        tutorPrompt: "Draw equal-length fraction bars and compare the shaded lengths.",
        misconceptionCode: "EQ-DENOMINATOR-ONLY",
      },
      forceDemo: true,
    });

    const result = await analyzeAttempt(request);

    expect(result.status).toBe("ready");
    expect(result.diagnosis.isCorrect).toBe(true);
    expect(result.diagnosis.nextMove.difficulty).toBe("step_up");
    expect(result.diagnosis.misconception.code).toBe("EQ-RATIO-RESTORED");
    expect(result.trace.checks.every((check) => check.status === "passed")).toBe(true);
  });

  it("re-runs privacy screening across prior-turn context", async () => {
    const request = AnalyzeRequestSchema.parse({
      lessonId: "fraction-equivalence-4nf1",
      studentText: "I tried the bars.",
      previousTurn: {
        learnerText: "Contact me at learner@example.com",
        tutorPrompt: "Draw equal-length bars.",
        misconceptionCode: "EQ-DENOMINATOR-ONLY",
      },
      forceDemo: true,
    });

    const result = await analyzeAttempt(request);

    expect(result.status).toBe("blocked");
    expect(result.trace.checks[0]?.label).toBe("Input privacy screen");
  });
});
