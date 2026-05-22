import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { generateGuide } from "@/lib/ai";
import { saveGuide } from "@/lib/store";
import type { FormData, Guide } from "@/types";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "sk-ant-...") {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to .env.local and restart the dev server." },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!formData.pet?.name || !formData.pet?.type) {
    return NextResponse.json({ error: "Pet name and type are required" }, { status: 400 });
  }

  try {
    const sections = await generateGuide(formData);

    const guide: Guide = {
      id: uuidv4(),
      petName: formData.pet.name,
      petType: formData.pet.type,
      sections,
      isPaid: false,
      createdAt: Date.now(),
    };

    await saveGuide(guide);

    return NextResponse.json({
      id: guide.id,
      petName: guide.petName,
      petType: guide.petType,
      sections: guide.sections.map((s, i) => ({
        icon: s.icon,
        title: s.title,
        summary: s.summary,
        content: i < 3 ? s.content : null,
        tips: i < 3 ? s.tips : null,
        locked: i >= 3,
      })),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[generate]", msg);
    return NextResponse.json(
      { error: `Guide generation failed: ${msg}` },
      { status: 500 }
    );
  }
}
