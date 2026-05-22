import type { Guide } from "@/types";

// In-memory fallback for local development (no Upstash needed)
const memStore = new Map<string, string>();

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_URL !== "https://xxx.upstash.io";

const TTL = 60 * 60 * 24 * 7; // 7 days

async function redisCmd(command: unknown[]) {
  const res = await fetch(process.env.UPSTASH_REDIS_REST_URL!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  const json = await res.json();
  return json.result;
}

export async function saveGuide(guide: Guide): Promise<void> {
  const key = `guide:${guide.id}`;
  const val = JSON.stringify(guide);
  if (hasUpstash) {
    await redisCmd(["SET", key, val, "EX", TTL]);
  } else {
    memStore.set(key, val);
    // Auto-expire from memory after TTL (best-effort)
    setTimeout(() => memStore.delete(key), TTL * 1000);
  }
}

export async function getGuide(id: string): Promise<Guide | null> {
  const key = `guide:${id}`;
  if (hasUpstash) {
    const raw = await redisCmd(["GET", key]);
    return raw ? (JSON.parse(raw) as Guide) : null;
  }
  const raw = memStore.get(key);
  return raw ? (JSON.parse(raw) as Guide) : null;
}

export async function markPaid(id: string): Promise<void> {
  const guide = await getGuide(id);
  if (!guide) return;
  guide.isPaid = true;
  await saveGuide(guide);
}
