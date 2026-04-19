"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_SOURCES = [
  "https://api.yimian.xyz/img?type=moe",
  "https://www.dmoe.cc/random.php",
  "https://api.vvhan.com/api/acgimg",
];

function parseSourceList() {
  const raw = process.env.NEXT_PUBLIC_ANIME_BACKGROUND_SOURCES;
  if (!raw) return DEFAULT_SOURCES;

  const parsed = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => /^https?:\/\//i.test(item));

  return parsed.length > 0 ? parsed : DEFAULT_SOURCES;
}

function loadImageWithTimeout(src: string, timeoutMs = 4000): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = window.setTimeout(() => {
      img.src = "";
      reject(new Error("timeout"));
    }, timeoutMs);

    img.onload = () => {
      window.clearTimeout(timer);
      resolve(src);
    };

    img.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("load_error"));
    };

    const separator = src.includes("?") ? "&" : "?";
    img.src = `${src}${separator}t=${Date.now()}`;
  });
}

export function AnimeBackgroundLayer() {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const sources = useMemo(() => parseSourceList(), []);

  useEffect(() => {
    let cancelled = false;

    const tryLoad = async () => {
      for (const source of sources) {
        try {
          const usableUrl = await loadImageWithTimeout(source);
          if (!cancelled) {
            setActiveUrl(usableUrl);
          }
          return;
        } catch {
          // Try next source
        }
      }
    };

    void tryLoad();

    return () => {
      cancelled = true;
    };
  }, [sources]);

  if (!activeUrl) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
      style={{ backgroundImage: `url(${activeUrl})` }}
      aria-hidden="true"
    />
  );
}
