import type { CurriculumSource } from "@/lib/schemas";

export const LESSON = {
  id: "fraction-equivalence-4nf1" as const,
  grade: 4,
  standard: "CCSS.MATH.CONTENT.4.NF.A.1",
  title: "Equivalent fractions keep the same value",
  objective:
    "Explain why a fraction stays equivalent only when the numerator and denominator are scaled by the same factor.",
  question: "Is 1/2 equivalent to 1/4? Show or explain your reasoning.",
  expectedAnswerVariants: ["no", "2/4", "two fourths"],
  misconceptionTargets: [
    "Changing only the denominator",
    "Treating a larger denominator as a larger fraction",
    "Ignoring the requirement that wholes be the same size",
  ],
};

const CURRICULUM: Array<CurriculumSource & { tags: string[] }> = [
  {
    id: "ccss-4nf-a1",
    standard: "CCSS.MATH.CONTENT.4.NF.A.1",
    title: "Fraction equivalence",
    excerpt:
      "Recognize and generate equivalent fractions by multiplying the numerator and denominator by the same nonzero whole number, using visual fraction models to explain why the value is unchanged.",
    url: "https://www.thecorestandards.org/Math/Content/4/NF/",
    tags: ["equivalent", "fraction", "numerator", "denominator", "visual", "same factor"],
  },
  {
    id: "gazelle-visual-model",
    standard: "Instructional note",
    title: "Use equal wholes before symbolic rules",
    excerpt:
      "Ask the learner to compare equal-length fraction bars. Repartitioning the same whole can change the number of pieces without changing the amount represented.",
    url: "https://www.thecorestandards.org/Math/Content/4/NF/",
    tags: ["bar", "visual", "partition", "same whole", "pieces"],
  },
  {
    id: "gazelle-misconception-denominator",
    standard: "Misconception pattern EQ-02",
    title: "The denominator-only change",
    excerpt:
      "If a learner changes the denominator but not the numerator, test whether they understand that the same amount must occupy a different number of smaller equal parts. Avoid stating the corrected fraction before they model it.",
    url: "https://www.thecorestandards.org/Math/Content/4/NF/",
    tags: ["denominator", "misconception", "same amount", "hint", "answer leakage"],
  },
  {
    id: "gazelle-socratic-move",
    standard: "Tutoring protocol",
    title: "One diagnostic move at a time",
    excerpt:
      "Prefer one observable next step over a full explanation: ask the learner to draw, label, compare, or justify. The next prompt should reveal whether the misconception changed.",
    url: "https://www.thecorestandards.org/Math/Practice/",
    tags: ["socratic", "prompt", "justify", "draw", "next step"],
  },
];

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export function retrieveCurriculum(query: string, limit = 3): CurriculumSource[] {
  const queryTokens = new Set(tokenize(query));

  return CURRICULUM.map((source) => {
    const searchable = tokenize(`${source.title} ${source.excerpt} ${source.tags.join(" ")}`);
    const score = searchable.reduce(
      (total, token) => total + (queryTokens.has(token) ? 1 : 0),
      source.standard === LESSON.standard ? 2 : 0,
    );
    return { source, score };
  })
    .sort((a, b) => b.score - a.score || a.source.id.localeCompare(b.source.id))
    .slice(0, limit)
    .map(({ source, score: _score, ..._rest }) => {
      void _score;
      void _rest;
      const { tags: _tags, ...publicSource } = source;
      void _tags;
      return publicSource;
    });
}

export function curriculumContext(sources: CurriculumSource[]): string {
  return sources
    .map(
      (source, index) =>
        `[Source ${index + 1}: ${source.id} | ${source.standard}]\n${source.excerpt}`,
    )
    .join("\n\n");
}

