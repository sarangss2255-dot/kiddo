import type { Metadata, Viewport } from "next";
import "../index.css";
import { Providers } from "./providers";
import { BRAND_ASSETS, SITE_NAME, SITE_URL } from "@/src/lib/site-config";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Good Habits Today. Great Kids Tomorrow.`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "KidDo helps children build positive habits, complete daily tasks, stay on top of schoolwork, earn meaningful rewards, and grow with support from parents and teachers.",
  keywords: [
    "KidDo",
    "child development",
    "habits",
    "tasks",
    "rewards",
    "parenting",
    "education",
    "kids app",
  ],
  authors: [{ name: "KidDo" }],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: BRAND_ASSETS.favicon32, sizes: "32x32", type: "image/png" },
      { url: BRAND_ASSETS.favicon192, sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: BRAND_ASSETS.appleTouchIcon, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "KidDo — Good Habits Today. Great Kids Tomorrow.",
    description:
      "KidDo helps children build positive habits, complete daily tasks, stay on top of schoolwork, earn meaningful rewards, and grow with support from parents and teachers.",
    images: [BRAND_ASSETS.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "KidDo — Good Habits Today. Great Kids Tomorrow.",
    description:
      "KidDo helps children build positive habits, complete daily tasks, stay on top of schoolwork, earn meaningful rewards, and grow with support from parents and teachers.",
    images: [BRAND_ASSETS.ogImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1020" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
