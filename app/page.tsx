import PetForm from "@/components/PetForm";

const HOW_IT_WORKS = [
  { icon: "📋", title: "Tell us about your pet", desc: "Breed, age, weight, personality, and daily habits — takes 2 minutes." },
  { icon: "🤖", title: "AI builds your guide", desc: "Our AI analyzes your pet's unique profile and generates a science-backed plan." },
  { icon: "🎯", title: "Get actionable advice", desc: "Feeding amounts, exercise routines, bonding tips — all tailored to your pet." },
];

const REVIEWS = [
  { name: "Sarah M.", pet: "Golden Retriever, 3yrs", text: "The feeding plan was spot-on for Max's weight. We adjusted his portions and he's already more energetic!", avatar: "👩" },
  { name: "James T.", pet: "Maine Coon, 5yrs", text: "Never knew cats needed this much mental stimulation. The enrichment section was a game changer for Luna.", avatar: "👨" },
  { name: "Emily R.", pet: "French Bulldog, 2yrs", text: "The health monitoring checklist is so practical. My vet was impressed that I caught his weight gain early.", avatar: "👩🦱" },
];

export default function Home() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white py-20 px-4">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none text-9xl flex flex-wrap gap-8 overflow-hidden">
          {Array(20).fill("🐾").map((p, i) => <span key={i}>{p}</span>)}
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🎉 Join 12,000+ happy pet owners
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Your pet deserves a<br />
            <span className="text-orange-500">personalized care plan.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Answer a few questions about your cat or dog, and our AI generates a detailed, science-backed guide — feeding schedules, exercise plans, bonding tips, and more.
          </p>
          <a href="#form" className="btn-primary text-base inline-block">
            Create My Free Guide →
          </a>
          <p className="text-sm text-gray-400 mt-3">No account needed · First 3 sections free</p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-5xl mb-4">{s.icon}</div>
              <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">{i + 1}</div>
              <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What's included ── */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">What's in your guide</h2>
          <p className="text-center text-gray-500 mb-12">6 comprehensive sections, all personalized to your pet</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🍽️", title: "Personalized Feeding Plan", desc: "Exact portions, meal timing, food recommendations by breed and weight", free: true },
              { icon: "🏃", title: "Exercise & Activity Guide", desc: "Daily routines tailored to energy level, age, and living situation", free: true },
              { icon: "🧠", title: "Mental Stimulation", desc: "Toys, puzzles, and enrichment activities for your pet's personality", free: true },
              { icon: "💞", title: "Bonding & Relationship", desc: "How to build trust based on their unique personality traits", free: false },
              { icon: "🏥", title: "Health Monitoring", desc: "Breed-specific risks, home checks, grooming and dental care", free: false },
              { icon: "🎓", title: "Training & Behavior", desc: "Commands, techniques, and fixes tailored to how they learn", free: false },
            ].map((item, i) => (
              <div key={i} className={`card p-5 flex gap-4 ${!item.free ? "border-orange-100" : ""}`}>
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.free ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {item.free ? "FREE" : "$4.99"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section id="form" className="max-w-xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Build your pet's guide</h2>
          <p className="text-gray-500">3 quick steps · Takes about 2 minutes</p>
        </div>
        <div className="card p-6 sm:p-8">
          <PetForm />
        </div>
      </section>

      {/* ── Bond Test CTA ── */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <a href="/bond" className="group block rounded-3xl overflow-hidden relative bg-gradient-to-r from-pink-500 to-orange-400 p-8 sm:p-10 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-8xl opacity-20 group-hover:opacity-30 transition-opacity select-none">💕</div>
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              ✨ New Feature
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Test Your Bond Score</h2>
            <p className="text-white/85 mb-5 max-w-md text-sm sm:text-base">
              Upload a photo with your pet and our AI will analyze your bond — body language, eye contact, and pure love — and give you a score from 0 to 100.
            </p>
            <span className="inline-flex items-center gap-2 bg-white text-pink-600 font-bold px-5 py-2.5 rounded-xl text-sm group-hover:bg-pink-50 transition-colors">
              Try Bond Analyzer →
            </span>
          </div>
        </a>
      </section>

      {/* ── Reviews ── */}
      <section className="bg-orange-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Pet owners love PawGuide</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="card p-6">
                <div className="flex gap-1 mb-3">{"⭐".repeat(5)}</div>
                <p className="text-gray-700 text-sm mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{r.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm text-gray-800">{r.name}</div>
                    <div className="text-xs text-gray-400">{r.pet}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 px-4 text-center">
        <div className="text-5xl mb-4">🐾</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to be the best pet parent?</h2>
        <p className="text-gray-500 mb-8">Join thousands of owners who give their pets a healthier, happier life.</p>
        <a href="#form" className="btn-primary text-base inline-block">Create My Free Guide →</a>
      </section>
    </main>
  );
}
