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
});

