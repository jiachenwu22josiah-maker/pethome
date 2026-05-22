import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface BondResult {
  score: number;
  title: string;
  analysis: string;
  highlights: string[];
  tip: string;
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "sk-ant-...") {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const { image, mediaType } = await req.json() as {
    image: string; // base64
    mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
  };

  if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: image },
          },
          {
            type: "text",
            text: `You are an expert animal behaviorist analyzing the bond between a pet and their owner in this photo.

Analyze the emotional connection, body language, physical proximity, mutual attention, and signs of trust/comfort between the pet and human.

Score the bond from 0–100, where:
- 0–30: Strangers / very new relationship
- 31–50: Getting to know each other
- 51–70: Good companions
- 71–85: Strong bond
- 86–95: Deeply connected
- 96–100: Inseparable soul mates

Be warm, fun, and encouraging. Even lower scores should be framed positively.

Respond ONLY with valid JSON:
{
  "score": <number 0-100>,
  "title": "<fun 2-4 word title for this bond level, e.g. 'Paw-fect Partners'>",
  "analysis": "<2-3 warm, specific sentences about what you observe in the photo — reference actual things you see>",
  "highlights": ["<specific positive observation>", "<another positive thing>", "<third thing>"],
  "tip": "<one actionable, fun tip to strengthen their bond even more>"
}`,
          },
        ],
      },
    ],
  });

  const text = msg.content[0].type === "text" ? msg.content[0].text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return NextResponse.json({ error: "Analysis failed" }, { status: 500 });

  const result: BondResult = JSON.parse(match[0]);
  result.score = Math.max(0, Math.min(100, Math.round(result.score)));

  return NextResponse.json(result);
}
