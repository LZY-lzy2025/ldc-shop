const DEFAULT_ANIME_BG_API = "https://www.dmoe.cc/random.php";

function normalizeBackgroundUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export async function getAnimeBackgroundUrl(): Promise<string | null> {
  const apiUrl = process.env.ANIME_BACKGROUND_API || DEFAULT_ANIME_BG_API;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    const redirectedUrl = normalizeBackgroundUrl(response.url);
    if (redirectedUrl) {
      return redirectedUrl;
    }

    const text = await response.text();
    return normalizeBackgroundUrl(text);
  } catch {
    return null;
  }
}
