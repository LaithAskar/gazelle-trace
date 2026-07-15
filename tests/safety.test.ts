import { describe, expect, it } from "vitest";
import { detectAnswerLeak, detectLikelyPii } from "@/lib/safety";

describe("answer leakage", () => {
  const answers = ["2/4", "two fourths"];

  it("catches symbolic and prose answers", () => {
    expect(detectAnswerLeak("The answer is 2 / 4.", answers)).toBe("2/4");
    expect(detectAnswerLeak("Shade two fourths", answers)).toBe("two fourths");
  });

  it("allows a Socratic prompt that requires the learner to derive the answer", () => {
    expect(
      detectAnswerLeak(
        "Split the second bar into four equal parts. How many cover the same length?",
        answers,
      ),
    ).toBeNull();
  });
});

describe("PII detection", () => {
  it("detects common contact details", () => {
    expect(detectLikelyPii("email me at learner@example.com")).toBe(true);
    expect(detectLikelyPii("call 850-555-1212")).toBe(true);
  });

  it("does not flag ordinary fraction work", () => {
    expect(detectLikelyPii("I changed the 2 to a 4")).toBe(false);
  });
});

