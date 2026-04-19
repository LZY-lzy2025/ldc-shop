import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import { getSetting } from "@/lib/db/queries";
import { getAnimeBackgroundUrl } from "@/lib/anime-background";

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
          <div className="relative flex min-h-screen flex-col">
            {backgroundImageUrl && (
              <div
                className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                aria-hidden="true"
              />
            )}
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
