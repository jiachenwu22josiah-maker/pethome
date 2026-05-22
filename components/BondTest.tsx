"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import type { BondResult } from "@/app/api/analyze-bond/route";

// ── Stage config ──────────────────────────────────────────────────────────────
const STAGES = [
  { pct: 8,  emoji: "🔍", msg: "Scanning for your furry friend…" },
  { pct: 22, emoji: "🐾", msg: "Detecting paw prints of love…" },
  { pct: 38, emoji: "👀", msg: "Analyzing eye contact & gazes…" },
  { pct: 52, emoji: "💫", msg: "Counting tail wags & purrs…" },
  { pct: 66, emoji: "🤗", msg: "Measuring cuddle coefficient…" },
  { pct: 80, emoji: "💕", msg: "Computing bond frequency…" },
  { pct: 92, emoji: "✨", msg: "Almost there! Finalizing score…" },
  { pct: 99, emoji: "🎯", msg: "Preparing your results…" },
];

// ── Score tier config ─────────────────────────────────────────────────────────
function getTier(score: number) {
  if (score >= 96) return { color: "#f59e0b", bg: "from-yellow-50 to-amber-50", label: "⭐", ring: "#fbbf24" };
  if (score >= 86) return { color: "#ec4899", bg: "from-pink-50 to-rose-50",   label: "❤️", ring: "#f472b6" };
  if (score >= 71) return { color: "#f97316", bg: "from-orange-50 to-red-50",  label: "🧡", ring: "#fb923c" };
  if (score >= 51) return { color: "#22c55e", bg: "from-green-50 to-teal-50",  label: "💚", ring: "#4ade80" };
  if (score >= 31) return { color: "#3b82f6", bg: "from-blue-50 to-sky-50",    label: "💙", ring: "#60a5fa" };
  return              { color: "#94a3b8", bg: "from-gray-50 to-slate-50",      label: "🌱", ring: "#94a3b8" };
}

// ── Floating hearts animation ─────────────────────────────────────────────────
function FloatingHearts({ score }: { score: number }) {
  if (score < 70) return null;
  const count = score >= 96 ? 12 : score >= 86 ? 8 : 5;
  const emojis = score >= 96 ? ["❤️","💖","✨","🌟","💫"] : score >= 86 ? ["❤️","💕","💗"] : ["💕","🧡"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {Array.from({ length: count }).map((_, i) => {
        const emoji = emojis[i % emojis.length];
        const left  = 5 + (i * 83) % 90;
        const delay = (i * 0.4) % 3;
        const dur   = 2.5 + (i * 0.3) % 1.5;
        return (
          <span key={i} className="absolute text-lg" style={{
            left: `${left}%`, bottom: "-10px", animationName: "floatUp",
            animationDuration: `${dur}s`, animationDelay: `${delay}s`,
            animationIterationCount: "infinite", animationTimingFunction: "ease-in-out",
          }}>{emoji}</span>
        );
      })}
    </div>
  );
}

// ── Circular score dial ───────────────────────────────────────────────────────
function ScoreDial({ score, color, ring }: { score: number; color: string; ring: string }) {
  const [displayed, setDisplayed] = useState(0);
  const r = 58;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1600;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      // Ease out quart
      const ease = 1 - Math.pow(1 - p, 4);
      setDisplayed(Math.round(ease * score));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative w-44 h-44 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={ring} strokeWidth="12"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.05s linear" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold" style={{ color }}>{displayed}</span>
        <span className="text-xs font-semibold text-gray-400 tracking-widest">/ 100</span>
      </div>
    </div>
  );
}

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen({ progress, stage }: { progress: number; stage: typeof STAGES[0] }) {
  return (
    <div className="py-8 text-center select-none">
      {/* Bouncing emoji */}
      <div className="text-6xl mb-6" style={{ animation: "petBounce 0.6s ease-in-out infinite alternate" }}>
        {stage.emoji}
      </div>

      {/* Stage message */}
      <p className="text-base font-semibold text-gray-700 mb-6 min-h-[1.5rem] transition-all">
        {stage.msg}
      </p>

      {/* Progress bar */}
      <div className="relative mx-auto max-w-xs">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #fb923c, #f97316, #ec4899)",
              transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            {/* Shimmer */}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              animation: "shimmer 1.2s infinite",
            }} />
          </div>
        </div>
        <p className="text-right text-xs text-gray-400 mt-1.5 font-mono">{progress}%</p>
      </div>

      {/* Paw prints trail */}
      <div className="flex justify-center gap-2 mt-6">
        {[0, 1, 2, 3, 4].map(i => (
          <span key={i} className="text-xl" style={{
            opacity: i / 4 <= progress / 100 ? 1 : 0.15,
            animation: i / 4 <= progress / 100 ? `pawPop 0.3s ease ${i * 0.08}s backwards` : "none",
            transition: "opacity 0.3s",
          }}>🐾</span>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-4">Powered by AI vision • Takes ~15 seconds</p>
    </div>
  );
}

// ── Upload area ───────────────────────────────────────────────────────────────
function UploadArea({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) onFile(file);
  }, [onFile]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
        dragging ? "border-pink-400 bg-pink-50 scale-[1.02]" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
      }`}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <div className="text-5xl mb-3" style={{ animation: "petBounce 1.8s ease-in-out infinite alternate" }}>📸</div>
      <p className="font-bold text-gray-700 mb-1">Drop your photo here</p>
      <p className="text-sm text-gray-400">or click to browse</p>
      <p className="text-xs text-gray-300 mt-3">JPG, PNG, WEBP · Best with both of you in the frame</p>
    </div>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────
function ResultCard({ result, preview, onReset }: { result: BondResult; preview: string; onReset: () => void }) {
  const tier = getTier(result.score);

  return (
    <div className={`relative rounded-3xl bg-gradient-to-b ${tier.bg} p-6 overflow-hidden`}>
      <FloatingHearts score={result.score} />

      {/* Photo + score side by side on wider screens */}
      <div className="flex flex-col sm:flex-row gap-6 items-center mb-6">
        <div className="relative flex-shrink-0">
          <img src={preview} alt="Your pet photo" className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-lg" />
          <div className="absolute -bottom-2 -right-2 text-3xl">{tier.label}</div>
        </div>
        <div className="flex flex-col items-center sm:items-start gap-2">
          <ScoreDial score={result.score} color={tier.color} ring={tier.ring} />
          <h3 className="text-xl font-extrabold text-gray-900 text-center sm:text-left">{result.title}</h3>
        </div>
      </div>

      {/* Analysis */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">{result.analysis}</p>
      </div>

      {/* Highlights */}
      <div className="space-y-2 mb-4">
        {result.highlights.map((h, i) => (
          <div key={i} className="flex gap-2 items-start">
            <span className="text-base flex-shrink-0">{"✨💕🐾"[i]}</span>
            <span className="text-sm text-gray-700">{h}</span>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="bg-white/80 rounded-xl p-3 border border-orange-100 mb-5">
        <p className="text-xs font-bold text-orange-600 mb-1">💡 Pro Tip to Level Up Your Bond</p>
        <p className="text-sm text-gray-700">{result.tip}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onReset}
          className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm text-gray-600 hover:border-orange-300 hover:bg-orange-50 transition-all">
          Try Another Photo
        </button>
        <button
          onClick={() => {
            navigator.share?.({
              title: `Our bond score: ${result.score}/100 – ${result.title}`,
              text: result.analysis,
              url: window.location.href,
            }).catch(() => {});
          }}
          className="flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${tier.color}, #ec4899)` }}
        >
          Share Result 🔗
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
type Phase = "upload" | "loading" | "result";

export default function BondTest() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [preview, setPreview] = useState("");
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState<BondResult | null>(null);
  const [error, setError] = useState("");

  const handleFile = useCallback(async (file: File) => {
    setError("");
    setPhase("loading");
    setProgress(0);
    setStageIdx(0);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // ── Progress simulation (runs independently from API call) ──
    let currentStage = 0;
    const stageTimer = setInterval(() => {
      currentStage = Math.min(currentStage + 1, STAGES.length - 1);
      setStageIdx(currentStage);
      setProgress(STAGES[currentStage].pct);
    }, 1100);

    // ── API call ──
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          res(dataUrl.split(",")[1]); // strip data URL prefix
        };
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });

      const resp = await fetch("/api/analyze-bond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          mediaType: file.type as "image/jpeg" | "image/png" | "image/webp",
        }),
      });

      clearInterval(stageTimer);

      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data: BondResult = await resp.json();

      // Snap to 100% then show result after a short pause
      setProgress(100);
      setStageIdx(STAGES.length - 1);
      setTimeout(() => {
        setResult(data);
        setPhase("result");
      }, 600);
    } catch (e: unknown) {
      clearInterval(stageTimer);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setPhase("upload");
    }
  }, []);

  const handleReset = useCallback(() => {
    setPhase("upload");
    setResult(null);
    setProgress(0);
    setStageIdx(0);
    setPreview("");
    setError("");
  }, []);

  return (
    <>
      <style>{`
        @keyframes petBounce {
          from { transform: translateY(0) scale(1); }
          to   { transform: translateY(-10px) scale(1.12); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0) scale(0.8); opacity: 0.9; }
          100% { transform: translateY(-120px) scale(1.1); opacity: 0; }
        }
        @keyframes pawPop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes resultSlideIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {phase === "upload" && (
        <div>
          <UploadArea onFile={handleFile} />
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
              {error}
            </div>
          )}
        </div>
      )}

      {phase === "loading" && (
        <LoadingScreen progress={progress} stage={STAGES[stageIdx]} />
      )}

      {phase === "result" && result && (
        <div style={{ animation: "resultSlideIn 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) forwards" }}>
          <ResultCard result={result} preview={preview} onReset={handleReset} />
        </div>
      )}
    </>
  );
}
