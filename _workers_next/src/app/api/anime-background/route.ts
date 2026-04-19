import { NextResponse } from "next/server";

const DEFAULT_REMOTE_SOURCES = [
  "https://api.yimian.xyz/img?type=moe",
  "https://www.dmoe.cc/random.php",
  "https://api.vvhan.com/api/acgimg",
];

const LOCAL_FALLBACK = "/anime-bg-fallback.svg";

function parseSources() {
  const raw = process.env.ANIME_BACKGROUND_SOURCES;
  if (!raw) return DEFAULT_REMOTE_SOURCES;

  const parsed = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => /^https?:\/\//i.test(item));

  return parsed.length > 0 ? parsed : DEFAULT_REMOTE_SOURCES;
}

async function canReach(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const sources = parseSources();

  for (const source of sources) {
    if (await canReach(source)) {
      const separator = source.includes("?") ? "&" : "?";
      return NextResponse.redirect(`${source}${separator}t=${Date.now()}`);
    }
  }

  return NextResponse.redirect(new URL(LOCAL_FALLBACK, request.url));
}
