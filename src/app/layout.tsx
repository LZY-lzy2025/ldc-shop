import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { getSetting } from "@/lib/db/queries";
import { AnimeBackgroundLayer } from "@/components/anime-background-layer";

const inter = Inter({ subsets: ["latin"] });

const DEFAULT_TITLE = "LDC Virtual Goods Shop";
const DEFAULT_DESCRIPTION = "High-quality virtual goods, instant delivery";

export async function generateMetadata(): Promise<Metadata> {
  let shopName: string | null = null;
  try {
    shopName = await getSetting("shop_name");
  } catch {
    shopName = null;
  }
  return {
    title: shopName?.trim() || DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const backgroundImageUrl = await getAnimeBackgroundUrl();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <Providers>
          <AnimeBackgroundLayer />
          <div className="relative flex min-h-screen flex-col">
            <AnimeBackgroundLayer />
            <div className="relative z-10 flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
