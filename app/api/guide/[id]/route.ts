import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getGuide, markPaid } from "@/lib/store";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const guide = await getGuide(params.id);
  if (!guide) {
    return NextResponse.json({ error: "Guide not found or expired" }, { status: 404 });
  }

  // Check for Stripe session in query params to unlock on first visit
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (sessionId && !guide.isPaid) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (
        session.payment_status === "paid" &&
        session.metadata?.guide_id === params.id
      ) {
        await markPaid(params.id);
        guide.isPaid = true;
      }
    } catch {
      // Invalid session ID — just continue without unlocking
    }
  }

  return NextResponse.json({
    id: guide.id,
    petName: guide.petName,
    petType: guide.petType,
    isPaid: guide.isPaid,
    sections: guide.sections.map((s, i) => ({
      icon: s.icon,
      title: s.title,
      summary: s.summary,
      content: guide.isPaid || i < 3 ? s.content : null,
      tips: guide.isPaid || i < 3 ? s.tips : null,
      locked: !guide.isPaid && i >= 3,
    })),
  });
}
