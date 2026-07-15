import { NextResponse } from "next/server";
import { hasOpenAIKey, PRIMARY_MODEL, VERIFIER_MODEL } from "@/lib/openai";

export function GET() {
  return NextResponse.json({
    ok: true,
    liveModelConfigured: hasOpenAIKey(),
    primaryModel: PRIMARY_MODEL,
    verifierModel: VERIFIER_MODEL,
  });
}

