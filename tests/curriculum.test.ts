import { describe, expect, it } from "vitest";
import { LESSON, retrieveCurriculum } from "@/lib/curriculum";

describe("curriculum retrieval", () => {
  it("prioritizes the governing standard for fraction equivalence", () => {
    const results = retrieveCurriculum("equivalent fraction numerator denominator visual", 3);

    expect(results).toHaveLength(3);
    expect(results[0]?.standard).toBe(LESSON.standard);
    expect(results.map((result) => result.id)).toContain("gazelle-misconception-denominator");
  });

  it("does not expose internal retrieval tags", () => {
    const [result] = retrieveCurriculum("fraction");
    expect(result).not.toHaveProperty("tags");
  });
});

