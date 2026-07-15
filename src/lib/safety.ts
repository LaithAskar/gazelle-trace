import type { TraceCheck } from "@/lib/schemas";

function normalizeMath(value: string): string {
  return value
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, "")
    .replace(/[.,!?;:()[\]{}]/g, "");
}

export function detectAnswerLeak(text: string, forbiddenAnswers: string[]): string | null {
  const normalizedText = normalizeMath(text);

  for (const answer of forbiddenAnswers) {
    const normalizedAnswer = normalizeMath(answer);
    if (normalizedAnswer.length > 1 && normalizedText.includes(normalizedAnswer)) {
      return answer;
    }
  }

  return null;
}

export function detectLikelyPii(text: string): boolean {
  const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phone = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/;
  return email.test(text) || phone.test(text);
}

export function makeCheck(
  id: TraceCheck["id"],
  label: string,
  passed: boolean,
  detail: string,
): TraceCheck {
  return {
    id,
    label,
    status: passed ? "passed" : "failed",
    detail,
  };
}

