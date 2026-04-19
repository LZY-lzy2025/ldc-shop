"use client";

import { useEffect } from "react";

const DEFAULT_SOURCES = [
  "https://www.loliapi.com/acg/",
  "https://api.yimian.xyz/img?type=moe",
  "https://api.vvhan.com/api/acgimg",
  "/api/anime-background",
];
const LOCAL_FALLBACK = "/anime-bg-fallback.svg";

function parseSourceList() {
  const raw = process.env.NEXT_PUBLIC_ANIME_BACKGROUND_SOURCES;
  if (!raw) return DEFAULT_SOURCES;

  const parsed = raw
    .split(",")
    .map((item) => item.trim())
    .filter((item) => /^(https?:\/\/|\/)/i.test(item));

  return parsed.length > 0 ? parsed : DEFAULT_SOURCES;
}

function loadImageWithTimeout(src: string, timeoutMs = 3000): Promise<string> {
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
  useEffect(() => {
    let cancelled = false;
    const body = document.body;
    const sources = parseSourceList();

    body.classList.add("has-anime-bg");
    body.style.setProperty("--anime-bg-image", `url("${LOCAL_FALLBACK}")`);

    const applyBackground = async () => {
      for (const source of sources) {
        try {
          const usableUrl = await loadImageWithTimeout(source);
          if (cancelled) return;

          body.style.setProperty("--anime-bg-image", `url("${usableUrl}")`);
          return;
        } catch {
          // continue trying fallback sources
        }
      }
    };

    void applyBackground();

    return () => {
      cancelled = true;
      body.classList.remove("has-anime-bg");
      body.style.removeProperty("--anime-bg-image");
    };
  }, []);

  return null;
}
