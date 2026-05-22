import Anthropic from "@anthropic-ai/sdk";
import type { FormData, GuideSection } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateGuide(data: FormData): Promise<GuideSection[]> {
  const { pet, personality, owner } = data;

  const weightKg =
    pet.weightUnit === "lbs"
      ? (pet.weight * 0.453592).toFixed(1)
      : pet.weight;

  const ageStr =
    pet.ageYears > 0
      ? `${pet.ageYears} year${pet.ageYears > 1 ? "s" : ""}${pet.ageMonths > 0 ? ` ${pet.ageMonths} months` : ""}`
      : `${pet.ageMonths} months`;

  const activityLabels = ["very low", "low", "moderate", "high", "very high"];

  const prompt = `You are an expert veterinary nutritionist and animal behaviorist. Create a deeply personalized pet care guide based on the following profile.

PET PROFILE:
- Name: ${pet.name}
- Type: ${pet.type}
- Breed: ${pet.breed}
- Age: ${ageStr}
- Weight: ${pet.weight} ${pet.weightUnit} (${weightKg} kg)
- Gender: ${pet.gender}${pet.neutered ? " (neutered/spayed)" : " (intact)"}
- Environment: ${personality.environment}
- Activity level: ${activityLabels[personality.activityLevel - 1]}
- Personality traits: ${personality.traits.join(", ") || "not specified"}
- Current feeding schedule: ${personality.feedingSchedule || "not specified"}
- Health conditions: ${personality.healthConditions || "none reported"}

OWNER PROFILE:
- Experience: ${owner.experience} pet owner
- Living situation: ${owner.livingSituation.replace(/-/g, " ")}
- Hours at home per day: ${owner.hoursHome}
- Main goals: ${owner.goals.join(", ")}

Generate a comprehensive, personalized guide with EXACTLY 6 sections. Each section must be detailed, practical, and tailored to this specific pet and owner.

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "sections": [
    {
      "icon": "🍽️",
      "title": "Personalized Feeding Plan",
      "summary": "One sentence teaser about the feeding plan (shown free)",
      "content": "3-4 detailed paragraphs covering exact portions, meal timing, food type recommendations, hydration. Cite specific amounts based on the pet's weight and activity level. Include what to avoid for this breed.",
      "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
    },
    {
      "icon": "🏃",
      "title": "Exercise & Activity Guide",
      "summary": "One sentence teaser about exercise needs",
      "content": "3-4 paragraphs on daily exercise requirements, types of activities, how to adjust for weather/age, signs of over/under-exercise for this specific breed and activity level.",
      "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
    },
    {
      "icon": "🧠",
      "title": "Mental Stimulation & Enrichment",
      "summary": "One sentence teaser about mental enrichment",
      "content": "3-4 paragraphs on breed-specific mental needs, recommended toys and puzzles, enrichment activities suited to their personality traits and environment, boredom prevention strategies.",
      "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
    },
    {
      "icon": "💞",
      "title": "Bonding & Relationship Building",
      "summary": "One sentence teaser about bonding",
      "content": "3-4 paragraphs on how to build trust based on their specific personality traits, daily bonding rituals, how to read their body language, relationship-strengthening activities tailored to the owner's schedule.",
      "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
    },
    {
      "icon": "🏥",
      "title": "Health Monitoring & Wellness",
      "summary": "One sentence teaser about health care",
      "content": "3-4 paragraphs on breed-specific health risks to watch for, monthly health checks the owner can do at home, vaccination schedule reminders, dental care, grooming needs specific to this breed.",
      "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
    },
    {
      "icon": "🎓",
      "title": "Training & Behavior Guide",
      "summary": "One sentence teaser about training",
      "content": "3-4 paragraphs on training approach suited to their personality (shy/energetic/stubborn etc.), specific commands to prioritize, how to address common behavior issues for this breed, positive reinforcement techniques tailored to their motivation style.",
      "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
    }
  ]
}`;

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("AI returned invalid format");

  const parsed = JSON.parse(jsonMatch[0]);
  return parsed.sections as GuideSection[];
}
