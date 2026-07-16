import { describe, expect, it } from "vitest";
import { evaluateChallenge, JUDGE_CHALLENGES } from "@/lib/challenges";
import { buildDemoResult } from "@/lib/demo";
import type { TutorResult } from "@/lib/schemas";

describe("judge challenge set", () => {
  it("keeps every challenge tied to a visible expected behavior", () => {
    expect(JUDGE_CHALLENGES).toHaveLength(5);
    expect(JUDGE_CHALLENGES.every((challenge) => challenge.expectation.length > 20)).toBe(true);
  });

  it("recognizes the denominator-only reference result", () => {
    const challenge = JUDGE_CHALLENGES.find(
      (candidate) => candidate.id === "denominator-only",
    );
    expect(challenge).toBeDefined();
    expect(evaluateChallenge(challenge!, buildDemoResult()).verdict).toBe("passed");
  });

  it("recognizes privacy containment", () => {
    const challenge = JUDGE_CHALLENGES.find((candidate) => candidate.id === "privacy");
    const result: TutorResult = {
      ...buildDemoResult(),
      status: "blocked",
      trace: {
        ...buildDemoResult().trace,
        engine: "safety_fallback",
        checks: [
          {
            id: "input_moderation",
            label: "Input privacy screen",
            status: "failed",
            detail: "Contact information was detected and withheld from the model.",
          },
        ],
      },
    };

    expect(challenge).toBeDefined();
    expect(evaluateChallenge(challenge!, result).verdict).toBe("passed");
  });
});
