"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface Section {
  icon: string;
  title: string;
  summary: string;
  content: string | null;
  tips: string[] | null;
  locked: boolean;
}

interface GuideData {
  id: string;
  petName: string;
  petType: "cat" | "dog";
  isPaid: boolean;
  sections: Section[];
}

function SectionCard({ section, index }: { section: Section; index: number }) {
  const [open, setOpen] = useState(index < 3);

  if (section.locked) {
    return (
      <div className="card overflow-hidden opacity-75">
        <div className="p-5 sm:p-6 flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <div className="flex-1">
            <h3 className="font-bold text-gray-500">{section.title}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{section.summary}</p>
          </div>
          <div className="text-gray-300 text-xl">🔒</div>
        </div>
        <div className="relative px-6 pb-6">
          <div className="h-16 bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl flex items-center justify-center">
            <span className="text-gray-400 text-sm">Unlock to read full section</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-5 sm:p-6 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-2xl">{section.icon}</span>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{section.title}</h3>
          {!open && <p className="text-sm text-gray-500 mt-0.5">{section.summary}</p>}
        </div>
        <span className="text-gray-400 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }}>▼</span>
      </button>

      {open && section.content && (
        <div className="px-5 sm:px-6 pb-6 border-t border-gray-50">
          <div className="pt-4 prose prose-gray prose-sm max-w-none">
            {section.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-700 leading-relaxed mb-3">{para}</p>
            ))}
          </div>
          {section.tips && section.tips.length > 0 && (
            <div className="mt-4 bg-orange-50 rounded-xl p-4">
              <p className="text-sm font-bold text-orange-700 mb-2">💡 Quick Tips</p>
              <ul className="space-y-1.5">
                {section.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-orange-800">
                    <span className="text-orange-400 flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Paywall({ guideId, petName, onPay }: { guideId: string; petName: string; onPay: () => void }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guideId, petName }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  };

  return (
    <div className="card p-8 text-center border-2 border-orange-200 bg-gradient-to-b from-orange-50 to-white">
      <div className="text-5xl mb-4">🔓</div>
      <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Unlock {petName}'s Full Guide</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">Get the complete care plan including bonding tips, health monitoring, and training strategies.</p>

      <div className="grid grid-cols-3 gap-3 mb-8 text-sm">
        {[["💞", "Bonding Guide"], ["🏥", "Health Checklist"], ["🎓", "Training Plan"]].map(([icon, label]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 border border-orange-100">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="font-medium text-gray-700">{label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <span className="text-4xl font-extrabold text-gray-900">$4.99</span>
        <span className="text-gray-400 ml-2">one-time</span>
      </div>

      <button onClick={handlePay} disabled={loading} className="btn-primary w-full text-base py-4">
        {loading ? "Redirecting to payment…" : "Unlock Full Guide – $4.99"}
      </button>
      <p className="text-xs text-gray-400 mt-3">Secure payment via Stripe · Instant access · Lifetime guide</p>
    </div>
  );
}

export default function GuidePage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const url = `/api/guide/${id}${sessionId ? `?session_id=${sessionId}` : ""}`;
    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setGuide(data);
      })
      .catch(() => setError("Failed to load guide."))
      .finally(() => setLoading(false));
  }, [id, sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-5xl animate-bounce">🐾</div>
        <p className="text-gray-500 font-medium">Loading your guide…</p>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <div className="text-5xl">😿</div>
        <h2 className="text-xl font-bold text-gray-800">Guide not found</h2>
        <p className="text-gray-500">{error || "This guide may have expired."}</p>
        <a href="/" className="btn-primary">Create a New Guide</a>
      </div>
    );
  }

  const freeSections = guide.sections.filter(s => !s.locked);
  const lockedSections = guide.sections.filter(s => s.locked);
  const petEmoji = guide.petType === "dog" ? "🐶" : "🐱";

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        {guide.isPaid && (
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            ✅ Full guide unlocked
          </div>
        )}
        <div className="text-6xl mb-3">{petEmoji}</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          {guide.petName}'s Personalized Care Guide
        </h1>
        <p className="text-gray-500">
          {guide.isPaid ? "All 6 sections unlocked" : "3 of 6 sections available · Unlock the rest for $4.99"}
        </p>
      </div>

      {/* Free sections */}
      <div className="space-y-4 mb-6">
        {freeSections.map((s, i) => (
          <SectionCard key={i} section={s} index={i} />
        ))}
      </div>

      {/* Paywall or locked sections */}
      {!guide.isPaid && lockedSections.length > 0 && (
        <div className="space-y-4">
          <Paywall
            guideId={guide.id}
            petName={guide.petName}
            onPay={() => {}}
          />
          {lockedSections.map((s, i) => (
            <SectionCard key={i} section={s} index={freeSections.length + i} />
          ))}
        </div>
      )}

      {guide.isPaid && lockedSections.map((s, i) => (
        <div key={i} className="space-y-4 mb-4">
          <SectionCard section={s} index={freeSections.length + i} />
        </div>
      ))}

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-gray-400 text-sm mb-4">Want a guide for another pet?</p>
        <a href="/" className="btn-outline">Create Another Guide →</a>
      </div>
    </main>
  );
}
