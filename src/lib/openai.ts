import OpenAI from "openai";

let client: OpenAI | null = null;

export const PRIMARY_MODEL = process.env.OPENAI_PRIMARY_MODEL?.trim() || "gpt-5.6";
export const VERIFIER_MODEL = process.env.OPENAI_VERIFIER_MODEL?.trim() || "gpt-5.6-terra";

export function hasOpenAIKey(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAI(): OpenAI {
  if (!hasOpenAIKey()) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

export function demoFallbackEnabled(): boolean {
  return process.env.ENABLE_DEMO_FALLBACK !== "false";
}

