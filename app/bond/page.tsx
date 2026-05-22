import BondTest from "@/components/BondTest";

const SCORE_TIERS = [
  { range: "96–100", emoji: "⭐", label: "Soul Mates",       color: "text-yellow-600" },
  { range: "86–95",  emoji: "❤️",  label: "Deeply Connected", color: "text-pink-600"   },
  { range: "71–85",  emoji: "🧡", label: "Bonded Buddies",   color: "text-orange-600" },
  { range: "51–70",  emoji: "💚", label: "Good Companions",  color: "text-green-600"  },
  { range: "31–50",  emoji: "💙", label: "Warming Up",       color: "text-blue-600"   },
  { range: "0–30",   emoji: "🌱", label: "Just Starting",    color: "text-gray-500"   },
];

export default function BondPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
          💕 AI Bond Analyzer · Powered by Computer Vision
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
          How close are you<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            to your pet?
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Upload a photo together and our AI will score your bond from 0 to 100 — reading body language, eye contact, and pure love.
        </p>
      </div>

      {/* Main card */}
      <div className="card p-6 sm:p-8 mb-10">
        <BondTest />
      </div>

      {/* Score tier legend */}
      <div className="card p-6 mb-8">
        <h3 className="font-bold text-gray-800 mb-4 text-center">What does your score mean?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SCORE_TIERS.map(t => (
            <div key={t.range} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
              <span className="text-xl">{t.emoji}</span>
              <div>
                <div className={`text-xs font-bold ${t.color}`}>{t.range}</div>
                <div className="text-xs text-gray-500">{t.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-3">📸 Get the best results</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          {[
            "Both you and your pet should be clearly visible",
            "Natural lighting works better than flash",
            "Candid moments show more genuine bond than posed shots",
            "Close-up photos work great — full body shots too",
          ].map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-orange-400 font-bold flex-shrink-0">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA to guide */}
      <div className="mt-10 text-center">
        <p className="text-gray-500 mb-3">Want a full personalized care guide for your pet?</p>
        <a href="/" className="btn-primary inline-block">Create Free Care Guide →</a>
      </div>
    </main>
  );
}
