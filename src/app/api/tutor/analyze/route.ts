import { NextResponse } from "next/server";
import { AnalyzeRequestSchema, TutorResultSchema } from "@/lib/schemas";
import { analyzeAttempt } from "@/lib/tutor-pipeline";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = AnalyzeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid learner attempt.", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const result = TutorResultSchema.parse(await analyzeAttempt(parsed.data));
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown analysis error";
    return NextResponse.json(
      { error: "Gazelle could not safely analyze this attempt.", detail: message },
      { status: 500 },
    );
  }
}

