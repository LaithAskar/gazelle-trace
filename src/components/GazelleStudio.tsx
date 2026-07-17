"use client";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  Download,
  Eye,
  FileImage,
  Gauge,
  GraduationCap,
  ImageUp,
  LockKeyhole,
  MessageSquareReply,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  evaluateChallenge,
  JUDGE_CHALLENGES,
  type JudgeChallenge,
} from "@/lib/challenges";
import { DEMO_FOLLOW_UP_TEXT, DEMO_STUDENT_TEXT } from "@/lib/demo";
import type { PreviousTurn, TutorResult } from "@/lib/schemas";

type Health = {
  ok: boolean;
  liveModelConfigured: boolean;
  primaryModel: string;
  verifierModel: string;
};

type TeacherDecision = "pending" | "approved" | "held";

type CompletedTurn = {
  learnerText: string;
  result: TutorResult;
};

const CHECK_ICONS = {
  input_moderation: ShieldCheck,
  curriculum_grounding: BookOpen,
  answer_leakage: LockKeyhole,
  output_moderation: Eye,
  independent_verification: BrainCircuit,
};

function shortModelName(value: string) {
  return value.replace("deterministic reference pipeline", "Reference engine");
}

export function GazelleStudio() {
  const [health, setHealth] = useState<Health | null>(null);
  const [studentText, setStudentText] = useState(DEMO_STUDENT_TEXT);
  const [imageDataUrl, setImageDataUrl] = useState<string>();
  const [imageName, setImageName] = useState<string>();
  const [forceDemo, setForceDemo] = useState(false);
  const [turns, setTurns] = useState<CompletedTurn[]>([]);
  const [followUpText, setFollowUpText] = useState(DEMO_FOLLOW_UP_TEXT);
  const [teacherDecision, setTeacherDecision] = useState<TeacherDecision>("pending");
  const [selectedChallengeId, setSelectedChallengeId] =
    useState<JudgeChallenge["id"]>("denominator-only");
  const [loadingStage, setLoadingStage] = useState<"initial" | "follow_up">();
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const result = turns[turns.length - 1]?.result;
  const selectedChallenge = JUDGE_CHALLENGES.find(
    (challenge) => challenge.id === selectedChallengeId,
  );
  const challengeVerdict = result && selectedChallenge
    ? evaluateChallenge(selectedChallenge, result)
    : undefined;

  useEffect(() => {
    fetch("/api/health")
      .then((response) => response.json())
      .then((data: Health) => setHealth(data))
      .catch(() => setHealth(null));
  }, []);

  async function onImage(file?: File) {
    setError(undefined);
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setError("Use a PNG, JPEG, or WebP image.");
      return;
    }
    if (file.size > 4_000_000) {
      setError("Keep the image under 4 MB so the analysis stays fast.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result);
        setImageName(file.name);
      }
    };
    reader.readAsDataURL(file);
  }

  async function useSampleImage() {
    setError(undefined);

    try {
      const response = await fetch("/sample-fraction-work.png");
      if (!response.ok) throw new Error("The sample image could not be loaded.");

      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") return;
        setImageDataUrl(reader.result);
        setImageName("Built-in judge sample · no student data");
        setStudentText("");
        setSelectedChallengeId("denominator-only");
        setTurns([]);
        setTeacherDecision("pending");
        setFollowUpText(DEMO_FOLLOW_UP_TEXT);
      };
      reader.onerror = () => setError("The sample image could not be loaded.");
      reader.readAsDataURL(blob);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The sample image could not be loaded.");
    }
  }

  async function requestAnalysis(
    text: string,
    stage: "initial" | "follow_up",
    previousTurn?: PreviousTurn,
  ) {
    setLoadingStage(stage);
    setError(undefined);

    try {
      const response = await fetch("/api/tutor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "fraction-equivalence-4nf1",
          studentText: text,
          imageDataUrl: stage === "initial" ? imageDataUrl : undefined,
          forceDemo,
          previousTurn,
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof data === "object" && data && "error" in data && typeof data.error === "string"
            ? data.error
            : "The attempt could not be analyzed.";
        throw new Error(message);
      }
      return data as TutorResult;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The attempt could not be analyzed.");
      return undefined;
    } finally {
      setLoadingStage(undefined);
    }
  }

  async function analyze() {
    setTurns([]);
    setTeacherDecision("pending");
    const nextResult = await requestAnalysis(studentText, "initial");
    if (nextResult) {
      setTurns([{ learnerText: studentText, result: nextResult }]);
      setFollowUpText(
        selectedChallengeId === "denominator-only" ? DEMO_FOLLOW_UP_TEXT : "",
      );
    }
  }

  async function continueLesson() {
    const firstTurn = turns[0];
    if (!firstTurn || !followUpText.trim() || turns.length > 1) return;

    const previousTurn: PreviousTurn = {
      learnerText: firstTurn.learnerText,
      tutorPrompt: firstTurn.result.diagnosis.nextMove.prompt,
      misconceptionCode: firstTurn.result.diagnosis.misconception.code,
    };
    const nextResult = await requestAnalysis(followUpText, "follow_up", previousTurn);
    if (nextResult) {
      setTurns((current) => [
        ...current,
        { learnerText: followUpText, result: nextResult },
      ]);
      setTeacherDecision("pending");
    }
  }

  function chooseChallenge(challenge: JudgeChallenge) {
    setSelectedChallengeId(challenge.id);
    setStudentText(challenge.studentText);
    setImageDataUrl(undefined);
    setImageName(undefined);
    setTurns([]);
    setTeacherDecision("pending");
    setFollowUpText(challenge.id === "denominator-only" ? DEMO_FOLLOW_UP_TEXT : "");
    setError(undefined);
  }

  function downloadAudit() {
    if (!result) return;
    const audit = {
      product: "Gazelle Trace",
      exportedAt: new Date().toISOString(),
      lesson: result.lesson,
      teacherDecision,
      challenge: selectedChallenge
        ? { id: selectedChallenge.id, expectation: selectedChallenge.expectation }
        : null,
      turns: turns.map((turn, index) => ({
        turn: index + 1,
        status: turn.result.status,
        diagnosis: turn.result.diagnosis,
        trace: turn.result.trace,
      })),
      privacyNote: "Uploaded images and raw learner text are intentionally excluded.",
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(audit, null, 2)], { type: "application/json" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `gazelle-trace-${result.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    setStudentText(DEMO_STUDENT_TEXT);
    setImageDataUrl(undefined);
    setImageName(undefined);
    setForceDemo(false);
    setTurns([]);
    setFollowUpText(DEMO_FOLLOW_UP_TEXT);
    setTeacherDecision("pending");
    setSelectedChallengeId("denominator-only");
    setError(undefined);
  }

  const engineLabel = result
    ? result.trace.engine === "live"
      ? "Live GPT-5.6"
      : result.trace.engine === "safety_fallback"
        ? "Response held"
        : "Reference run"
    : health?.liveModelConfigured
      ? "GPT-5.6 ready"
      : "Reference mode";

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Gazelle Trace home">
          <span className="brand-mark" aria-hidden="true">
            G
          </span>
          <span>
            <strong>Gazelle</strong>
            <small>Trace</small>
          </span>
        </a>

        <div className="topbar-center" aria-label="Demo progress">
          <span className="step complete">
            <Check size={13} strokeWidth={3} /> Bound
          </span>
          <span className="step-line" />
          <span className={`step ${result ? "complete" : "active"}`}>
            {result ? <Check size={13} strokeWidth={3} /> : "2"} Diagnose
          </span>
          <span className="step-line" />
          <span className={`step ${turns.length > 1 ? "complete" : result ? "active" : ""}`}>
            {turns.length > 1 ? <Check size={13} strokeWidth={3} /> : "3"} Adapt
          </span>
        </div>

        <div className={`engine-pill ${result?.status === "blocked" ? "held" : ""}`}>
          <span className="status-dot" />
          {engineLabel}
        </div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">
          <span>OpenAI Build Week</span>
          <span className="eyebrow-dot" />
          <span>Education</span>
        </div>
        <div className="hero-copy">
          <h1>
            Don’t just give a hint.
            <span>Prove it was the right one.</span>
          </h1>
          <p>
            Gazelle reads a learner’s work, identifies the misconception, and adapts one step at a
            time—inside boundaries the teacher can actually inspect.
          </p>
        </div>
        <div className="hero-proof" aria-label="Product principles">
          <div>
            <ShieldCheck size={19} />
            <span>
              <strong>Fail closed</strong>
              Unverified output never reaches a learner
            </span>
          </div>
          <div>
            <Target size={19} />
            <span>
              <strong>One next move</strong>
              No answer dumps or generic chat
            </span>
          </div>
        </div>
      </section>

      <section className="studio" aria-label="Gazelle Trace lesson studio">
        <aside className="lesson-rail">
          <div className="rail-label">
            <GraduationCap size={15} /> Teacher boundary
          </div>
          <div className="standard-pill">GRADE 4 · FRACTIONS</div>
          <h2>Equivalent fractions keep the same value</h2>
          <p className="objective-label">TODAY’S OBJECTIVE</p>
          <p className="objective">
            Explain why both parts of a fraction must scale together for its value to stay the same.
          </p>

          <div className="standard-card">
            <span>BOUND STANDARD</span>
            <strong>CCSS 4.NF.A.1</strong>
            <p>Generate and explain equivalent fractions with visual models.</p>
            <div className="approved-row">
              <CheckCircle2 size={15} /> Teacher approved
            </div>
          </div>

          <div className="boundary-list">
            <div>
              <Check size={14} /> 4 curated sources
            </div>
            <div>
              <Check size={14} /> Visual-first tutoring
            </div>
            <div>
              <Check size={14} /> Stored answer never exposed
            </div>
          </div>
        </aside>

        <section className="workbench">
          <div className="panel-heading">
            <div>
              <span className="panel-kicker">LEARNER ATTEMPT</span>
              <h2>Show what you were thinking</h2>
            </div>
            <span className="attempt-chip">
              {turns.length > 1 ? "2 turns traced" : "Turn 1 of 2"}
            </span>
          </div>

          <div className="question-card">
            <div className="question-number">Q</div>
            <div>
              <span>QUICK CHECK</span>
              <p>Is <strong>½</strong> equivalent to <strong>¼</strong>? Show or explain your reasoning.</p>
            </div>
          </div>

          <div className="challenge-set" aria-label="Judge challenge set">
            <div className="challenge-heading">
              <div>
                <ClipboardCheck size={16} />
                <span>
                  <strong>Judge challenge set</strong>
                  Stress-test the exact claim
                </span>
              </div>
              <span>5 live cases</span>
            </div>
            <div className="challenge-options">
              {JUDGE_CHALLENGES.map((challenge) => (
                <button
                  className={challenge.id === selectedChallengeId ? "selected" : ""}
                  type="button"
                  onClick={() => chooseChallenge(challenge)}
                  key={challenge.id}
                >
                  {challenge.shortLabel}
                </button>
              ))}
            </div>
            {selectedChallenge && (
              <div className="challenge-expectation">
                <span>EXPECTED</span>
                <p>{selectedChallenge.expectation}</p>
              </div>
            )}
          </div>

          <label className="work-label" htmlFor="student-work">
            Learner explanation
            <span>Optional when a work image is attached</span>
          </label>
          <div className="paper-field">
            <textarea
              id="student-work"
              value={studentText}
              onChange={(event) => setStudentText(event.target.value)}
              placeholder="Type what the learner wrote…"
              maxLength={1200}
            />
            <span className="character-count">{studentText.length}/1200</span>
          </div>

          <div className="upload-row">
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => onImage(event.target.files?.[0])}
              hidden
            />
            {imageDataUrl ? (
              <div className="image-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageDataUrl} alt="Learner work preview" />
                <div>
                  <FileImage size={16} />
                  <span>{imageName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setImageDataUrl(undefined);
                    setImageName(undefined);
                  }}
                  aria-label="Remove work image"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div className="upload-options">
                <button className="upload-button" type="button" onClick={() => inputRef.current?.click()}>
                  <ImageUp size={18} />
                  <span>
                    <strong>Add handwritten work</strong>
                    PNG, JPG, or WebP · 4 MB max
                  </span>
                </button>
                <button className="sample-image-button" type="button" onClick={useSampleImage}>
                  <FileImage size={16} />
                  Use safe sample
                </button>
              </div>
            )}

            <label className="reference-toggle">
              <input
                type="checkbox"
                checked={forceDemo}
                onChange={(event) => setForceDemo(event.target.checked)}
              />
              <span className="toggle-track"><span /></span>
              Guaranteed reference run
            </label>
          </div>

          {error && (
            <div className="error-banner" role="alert">
              <CircleAlert size={17} />
              {error}
            </div>
          )}

          <div className="action-row">
            <button className="reset-button" type="button" onClick={reset}>
              <RefreshCw size={15} /> Reset
            </button>
            <button
              className="analyze-button"
              type="button"
              onClick={analyze}
              disabled={Boolean(loadingStage) || (!studentText.trim() && !imageDataUrl)}
            >
              {loadingStage === "initial" ? (
                <>
                  <span className="spinner" /> Running safety pipeline…
                </>
              ) : (
                <>
                  <Sparkles size={17} /> Diagnose the misconception <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>

          {challengeVerdict && selectedChallenge && (
            <div className={`challenge-result ${challengeVerdict.verdict}`}>
              <span>{challengeVerdict.verdict === "passed" ? <Check size={15} /> : <CircleAlert size={15} />}</span>
              <div>
                <strong>
                  {challengeVerdict.verdict === "passed" ? "Expected behavior observed" : "Teacher review required"}
                </strong>
                <p>{challengeVerdict.observed}</p>
              </div>
              <small>{selectedChallenge.shortLabel}</small>
            </div>
          )}

          {turns.length > 1 && (
            <div className="adaptation-strip" aria-label="Two-turn adaptation trace">
              <div>
                <span>TURN 1 · STEP BACK</span>
                <strong>{turns[0].result.diagnosis.misconception.label}</strong>
              </div>
              <ArrowRight size={18} />
              <div>
                <span>TURN 2 · {result?.diagnosis.nextMove.difficulty.replace("_", " ")}</span>
                <strong>{result?.diagnosis.misconception.label}</strong>
              </div>
            </div>
          )}

          {result && (
            <div className={`diagnosis-card ${result.status === "blocked" ? "blocked" : ""}`}>
              <div className="diagnosis-topline">
                <span>
                  {result.status === "blocked" ? <ShieldCheck size={16} /> : <BrainCircuit size={16} />}
                  {result.status === "blocked" ? "AUTOMATION HELD" : "MISCONCEPTION FOUND"}
                </span>
                <span>{Math.round(result.diagnosis.misconception.confidence * 100)}% confidence</span>
              </div>
              <h3>{result.diagnosis.misconception.label}</h3>
              <p>{result.diagnosis.misconception.evidence}</p>
              <div className="next-move">
                <span className="next-icon"><ChevronRight size={18} /></span>
                <div>
                  <span>NEXT MOVE FOR THE LEARNER</span>
                  <p>“{result.diagnosis.nextMove.prompt}”</p>
                </div>
              </div>
              <div className="teacher-action">
                <strong>Teacher action</strong>
                <span>{result.diagnosis.teacherAction}</span>
              </div>
            </div>
          )}

          {result && (
            <div className={`teacher-checkpoint ${teacherDecision}`}>
              <div className="checkpoint-heading">
                <div>
                  <GraduationCap size={17} />
                  <span>
                    <strong>Teacher checkpoint</strong>
                    Automation proposes. The teacher decides.
                  </span>
                </div>
                <button type="button" onClick={downloadAudit}>
                  <Download size={15} /> Export trace
                </button>
              </div>

              <div className="decision-buttons">
                <button
                  className="approve-decision"
                  type="button"
                  onClick={() => setTeacherDecision("approved")}
                  disabled={result.status === "blocked"}
                >
                  <Play size={15} /> Approve next move
                </button>
                <button
                  className="hold-decision"
                  type="button"
                  onClick={() => setTeacherDecision("held")}
                >
                  <Pause size={15} /> Hold for review
                </button>
              </div>

              {teacherDecision !== "pending" && (
                <div className="decision-status" role="status">
                  {teacherDecision === "approved" ? <CheckCircle2 size={16} /> : <ShieldCheck size={16} />}
                  <span>
                    <strong>{teacherDecision === "approved" ? "Teacher approved" : "Teacher hold recorded"}</strong>
                    {teacherDecision === "approved"
                      ? "The learner may receive this one bounded move."
                      : "Nothing advances until a teacher reviews the evidence."}
                  </span>
                </div>
              )}
            </div>
          )}

          {result &&
            result.status === "ready" &&
            turns.length === 1 &&
            teacherDecision === "approved" && (
              <div className="follow-up-card">
                <div className="follow-up-heading">
                  <MessageSquareReply size={18} />
                  <span>
                    <strong>Continue the learning loop</strong>
                    Did the reasoning change after the hint?
                  </span>
                  <small>TURN 2 OF 2</small>
                </div>
                <label htmlFor="follow-up-response">Learner response to the approved move</label>
                <textarea
                  id="follow-up-response"
                  value={followUpText}
                  onChange={(event) => setFollowUpText(event.target.value)}
                  maxLength={1200}
                  placeholder="Type what the learner tried next…"
                />
                <button
                  type="button"
                  onClick={continueLesson}
                  disabled={Boolean(loadingStage) || !followUpText.trim()}
                >
                  {loadingStage === "follow_up" ? (
                    <><span className="spinner" /> Re-running all five gates…</>
                  ) : (
                    <><Sparkles size={16} /> Trace the adaptation <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            )}

          {turns.length > 1 && teacherDecision === "approved" && (
            <div className="loop-complete">
              <CheckCircle2 size={18} />
              <span>
                <strong>Adaptive loop proven</strong>
                Two learner states, two independently verified moves, one inspectable trace.
              </span>
            </div>
          )}
        </section>

        <aside className="trace-rail">
          <div className="trace-header">
            <div>
              <span className="panel-kicker">TRUST TRACE</span>
              <h2>Why this move?</h2>
            </div>
            <ShieldCheck size={25} />
          </div>

          {!result ? (
            <div className="trace-empty">
              <div className="trace-orbit">
                <ShieldCheck size={27} />
              </div>
              <h3>Waiting for an attempt</h3>
              <p>Every proposed hint must clear five gates before it appears here.</p>
              <div className="empty-gates">
                {["Moderate input", "Ground in curriculum", "Check answer leakage", "Moderate output", "Verify independently"].map(
                  (label, index) => (
                    <div key={label}>
                      <span>{index + 1}</span>
                      {label}
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <>
              <div className={`trace-summary ${result.status === "blocked" ? "held" : ""}`}>
                {result.status === "blocked" ? <ShieldCheck size={18} /> : <CheckCircle2 size={18} />}
                <div>
                  <strong>{result.status === "blocked" ? "Response safely held" : "Cleared for the learner"}</strong>
                  <span>{result.trace.checks.filter((check) => check.status === "passed").length} of {result.trace.checks.length} gates passed</span>
                </div>
              </div>

              <div className="trace-list">
                {result.trace.checks.map((check) => {
                  const Icon = CHECK_ICONS[check.id];
                  return (
                    <div className={`trace-item ${check.status}`} key={check.id}>
                      <span className="trace-icon"><Icon size={17} /></span>
                      <div>
                        <div>
                          <strong>{check.label}</strong>
                          <span>{check.status === "passed" ? <Check size={13} /> : <X size={13} />}</span>
                        </div>
                        <p>{check.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="source-block">
                <span>RETRIEVED EVIDENCE</span>
                {result.trace.sources.map((source) => (
                  <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
                    <BookOpen size={14} />
                    <span>
                      <strong>{source.title}</strong>
                      {source.standard}
                    </span>
                    <ChevronRight size={14} />
                  </a>
                ))}
              </div>

              <div className="trace-metrics">
                <div>
                  <Gauge size={14} />
                  <span><strong>{result.trace.durationMs.toLocaleString()} ms</strong> pipeline</span>
                </div>
                <div>
                  <Sparkles size={14} />
                  <span><strong>{shortModelName(result.trace.primaryModel)}</strong> primary</span>
                </div>
              </div>
            </>
          )}
        </aside>
      </section>

      <footer>
        <span>Gazelle Trace · Built with Codex + GPT-5.6</span>
        <span>Teacher-bounded · No student data stored · Every move auditable</span>
      </footer>
    </main>
  );
}
