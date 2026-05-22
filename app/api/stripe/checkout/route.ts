import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export async function POST(req: NextRequest) {
  const { guideId, petName } = await req.json();

  if (!guideId) {
    return NextResponse.json({ error: "Missing guide ID" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 499, // $4.99
          product_data: {
            name: `PawGuide – ${petName}'s Personalized Care Guide`,
            description: "Full 6-section personalized pet care guide with feeding plan, exercise, bonding, health monitoring & training.",
            images: [`${BASE_URL}/og-product.png`],
          },
        },
        quantity: 1,
      },
    ],
    metadata: { guide_id: guideId },
    success_url: `${BASE_URL}/guide/${guideId}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/guide/${guideId}`,
  });

  return NextResponse.json({ url: session.url });
}
