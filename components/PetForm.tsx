"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormData, PetInfo, PersonalityInfo, OwnerInfo } from "@/types";

const DOG_BREEDS = ["Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund", "Boxer", "Siberian Husky", "Shih Tzu", "Chihuahua", "Border Collie", "Maltese", "Pomeranian", "Cavalier King Charles Spaniel", "Other / Mixed breed"];
const CAT_BREEDS = ["Domestic Shorthair", "Domestic Longhair", "Maine Coon", "Persian", "Siamese", "Ragdoll", "Bengal", "British Shorthair", "Abyssinian", "Sphynx", "Scottish Fold", "Russian Blue", "American Shorthair", "Other / Mixed breed"];

const PET_TRAITS = ["Playful", "Calm", "Shy", "Affectionate", "Independent", "Anxious", "Energetic", "Stubborn", "Gentle", "Curious", "Aggressive with strangers", "Food-motivated"];
const OWNER_GOALS = ["Improve bonding", "Better nutrition", "Healthy weight", "Behavior training", "Reduce anxiety", "Increase activity", "Better grooming habits"];

const defaultForm: FormData = {
  pet: { type: "dog", name: "", breed: "", ageYears: 1, ageMonths: 0, weight: 20, weightUnit: "lbs", gender: "male", neutered: true },
  personality: { activityLevel: 3, traits: [], feedingSchedule: "", healthConditions: "", environment: "indoor" },
  owner: { experience: "some", livingSituation: "apartment", hoursHome: 8, goals: [] },
};

function StepIndicator({ step }: { step: number }) {
  const steps = ["Your Pet", "Personality & Habits", "About You"];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${i < step ? "bg-orange-500 text-white" : i === step ? "bg-orange-500 text-white ring-4 ring-orange-100" : "bg-gray-100 text-gray-400"}`}>
            {i < step ? "✓" : i + 1}
          </div>
          <span className={`text-sm font-medium hidden sm:block ${i === step ? "text-orange-600" : "text-gray-400"}`}>{label}</span>
          {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-orange-400" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

function Step1({ data, onChange }: { data: PetInfo; onChange: (d: PetInfo) => void }) {
  const breeds = data.type === "dog" ? DOG_BREEDS : CAT_BREEDS;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        {(["dog", "cat"] as const).map((t) => (
          <button key={t} type="button"
            onClick={() => onChange({ ...data, type: t, breed: "" })}
            className={`p-4 rounded-2xl border-2 font-semibold transition-all text-center ${data.type === t ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}>
            <div className="text-4xl mb-1">{t === "dog" ? "🐶" : "🐱"}</div>
            <div className="capitalize">{t}</div>
          </button>
        ))}
      </div>

      <div>
        <label className="label">Pet's Name *</label>
        <input className="input" placeholder="e.g. Buddy" value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} />
      </div>

      <div>
        <label className="label">Breed</label>
        <select className="input" value={data.breed} onChange={e => onChange({ ...data, breed: e.target.value })}>
          <option value="">Select breed…</option>
          {breeds.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Age (years)</label>
          <input className="input" type="number" min={0} max={25} value={data.ageYears} onChange={e => onChange({ ...data, ageYears: +e.target.value })} />
        </div>
        <div>
          <label className="label">Age (months)</label>
          <input className="input" type="number" min={0} max={11} value={data.ageMonths} onChange={e => onChange({ ...data, ageMonths: +e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <label className="label">Weight</label>
          <input className="input" type="number" min={0.5} step={0.5} value={data.weight} onChange={e => onChange({ ...data, weight: +e.target.value })} />
        </div>
        <div>
          <label className="label">Unit</label>
          <select className="input" value={data.weightUnit} onChange={e => onChange({ ...data, weightUnit: e.target.value as "lbs" | "kg" })}>
            <option value="lbs">lbs</option>
            <option value="kg">kg</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Gender</label>
          <select className="input" value={data.gender} onChange={e => onChange({ ...data, gender: e.target.value as "male" | "female" })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="label">Neutered / Spayed?</label>
          <select className="input" value={data.neutered ? "yes" : "no"} onChange={e => onChange({ ...data, neutered: e.target.value === "yes" })}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step2({ data, onChange }: { data: PersonalityInfo; onChange: (d: PersonalityInfo) => void }) {
  const toggleTrait = (t: string) => {
    const traits = data.traits.includes(t) ? data.traits.filter(x => x !== t) : [...data.traits, t];
    onChange({ ...data, traits });
  };

  const activityLabels = ["Very Low 🛋️", "Low 🚶", "Moderate 🏃", "High ⚡", "Very High 🔥"];

  return (
    <div className="space-y-5">
      <div>
        <label className="label">Activity Level</label>
        <div className="flex gap-2 mt-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" onClick={() => onChange({ ...data, activityLevel: n })}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${data.activityLevel === n ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-orange-600 mt-1.5 font-medium">{activityLabels[data.activityLevel - 1]}</p>
      </div>

      <div>
        <label className="label">Personality Traits <span className="text-gray-400 font-normal">(select all that apply)</span></label>
        <div className="flex flex-wrap gap-2 mt-1">
          {PET_TRAITS.map(t => (
            <button key={t} type="button" onClick={() => toggleTrait(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${data.traits.includes(t) ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Living Environment</label>
        <div className="grid grid-cols-3 gap-2">
          {([["indoor", "🏠 Indoor"], ["outdoor", "🌿 Outdoor"], ["mixed", "🔄 Mixed"]] as const).map(([v, l]) => (
            <button key={v} type="button" onClick={() => onChange({ ...data, environment: v })}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${data.environment === v ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Current Feeding Schedule</label>
        <input className="input" placeholder="e.g. Twice a day, 8am and 6pm, dry kibble" value={data.feedingSchedule} onChange={e => onChange({ ...data, feedingSchedule: e.target.value })} />
      </div>

      <div>
        <label className="label">Known Health Conditions <span className="text-gray-400 font-normal">(optional)</span></label>
        <input className="input" placeholder="e.g. Hip dysplasia, allergies to chicken…" value={data.healthConditions} onChange={e => onChange({ ...data, healthConditions: e.target.value })} />
      </div>
    </div>
  );
}

function Step3({ data, onChange }: { data: OwnerInfo; onChange: (d: OwnerInfo) => void }) {
  const toggleGoal = (g: string) => {
    const goals = data.goals.includes(g) ? data.goals.filter(x => x !== g) : [...data.goals, g];
    onChange({ ...data, goals });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="label">Your Experience with Pets</label>
        <div className="grid grid-cols-3 gap-2">
          {([["first-time", "🌱 First-time", "This is my first pet"], ["some", "📚 Some experience", "Had pets before"], ["experienced", "⭐ Experienced", "Multiple pets / years of experience"]] as const).map(([v, l, d]) => (
            <button key={v} type="button" onClick={() => onChange({ ...data, experience: v })}
              className={`p-3 rounded-xl border-2 text-left transition-all ${data.experience === v ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
              <div className={`text-sm font-semibold ${data.experience === v ? "text-orange-700" : "text-gray-700"}`}>{l}</div>
              <div className="text-xs text-gray-400 mt-0.5">{d}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Living Situation</label>
        <div className="grid grid-cols-3 gap-2">
          {([["apartment", "🏢 Apartment"], ["house-yard", "🏡 House + yard"], ["house-no-yard", "🏘️ House, no yard"]] as const).map(([v, l]) => (
            <button key={v} type="button" onClick={() => onChange({ ...data, livingSituation: v })}
              className={`p-3 rounded-xl border-2 text-sm font-semibold text-center transition-all ${data.livingSituation === v ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Hours at Home Per Day: <span className="text-orange-600">{data.hoursHome}h</span></label>
        <input type="range" min={1} max={24} value={data.hoursHome} onChange={e => onChange({ ...data, hoursHome: +e.target.value })}
          className="w-full accent-orange-500 mt-1" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1h (always out)</span><span>24h (always home)</span>
        </div>
      </div>

      <div>
        <label className="label">Your Main Goals <span className="text-gray-400 font-normal">(select all that apply)</span></label>
        <div className="flex flex-wrap gap-2 mt-1">
          {OWNER_GOALS.map(g => (
            <button key={g} type="button" onClick={() => toggleGoal(g)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${data.goals.includes(g) ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PetForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updatePet = (pet: PetInfo) => setForm(f => ({ ...f, pet }));
  const updatePersonality = (personality: PersonalityInfo) => setForm(f => ({ ...f, personality }));
  const updateOwner = (owner: OwnerInfo) => setForm(f => ({ ...f, owner }));

  const canNext = step === 0
    ? !!form.pet.name.trim() && !!form.pet.breed
    : step === 1
    ? form.personality.traits.length > 0
    : form.owner.goals.length > 0;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      router.push(`/guide/${data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-6xl mb-4 animate-bounce">🐾</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Creating {form.pet.name}'s Guide…</h3>
        <p className="text-gray-500 max-w-xs mx-auto">Our AI is analyzing your pet's profile and crafting a personalized plan. This takes 15–30 seconds.</p>
        <div className="mt-6 flex justify-center gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepIndicator step={step} />

      <div className="min-h-[420px]">
        {step === 0 && <Step1 data={form.pet} onChange={updatePet} />}
        {step === 1 && <Step2 data={form.personality} onChange={updatePersonality} />}
        {step === 2 && <Step3 data={form.owner} onChange={updateOwner} />}
      </div>

      {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button type="button" onClick={() => setStep(s => s - 1)} className="btn-outline flex-1">
            ← Back
          </button>
        )}
        {step < 2 ? (
          <button type="button" onClick={() => setStep(s => s + 1)} disabled={!canNext} className="btn-primary flex-1">
            Next →
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={!canNext} className="btn-primary flex-1">
            ✨ Generate My Guide
          </button>
        )}
      </div>
      <p className="text-center text-xs text-gray-400 mt-3">Takes ~20 seconds · First 3 sections free</p>
    </div>
  );
}
