"use client";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Eye,
  FileImage,
  Gauge,
  GraduationCap,
  ImageUp,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEMO_STUDENT_TEXT } from "@/lib/demo";
import type { TutorResult } from "@/lib/schemas";

type Health = {
  ok: boolean;
  liveModelConfigured: boolean;
  primaryModel: string;
  verifierModel: string;
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
  const [result, setResult] = useState<TutorResult>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

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

  async function analyze() {
    setLoading(true);
    setError(undefined);
    setResult(undefined);

    try {
      const response = await fetch("/api/tutor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: "fraction-equivalence-4nf1",
          studentText,
          imageDataUrl,
          forceDemo,
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
      setResult(data as TutorResult);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The attempt could not be analyzed.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStudentText(DEMO_STUDENT_TEXT);
    setImageDataUrl(undefined);
    setImageName(undefined);
    setForceDemo(false);
    setResult(undefined);
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
          <span className={`step ${result ? "active" : ""}`}>3 Act</span>
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
            <span className="attempt-chip">Attempt 01</span>
          </div>

          <div className="question-card">
            <div className="question-number">Q</div>
            <div>
              <span>QUICK CHECK</span>
              <p>Is <strong>½</strong> equivalent to <strong>¼</strong>? Show or explain your reasoning.</p>
            </div>
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
              <button className="upload-button" type="button" onClick={() => inputRef.current?.click()}>
                <ImageUp size={18} />
                <span>
                  <strong>Add handwritten work</strong>
                  PNG, JPG, or WebP · 4 MB max
                </span>
              </button>
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
              disabled={loading || (!studentText.trim() && !imageDataUrl)}
            >
              {loading ? (
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

