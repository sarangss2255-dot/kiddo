import type { Metadata, Viewport } from "next";
import "../index.css";
import { Providers } from "./providers";
import { SITE_NAME, SITE_URL } from "@/src/lib/site-config";

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
    icon: "/kiddo-logo-32.png",
    apple: "/kiddo-logo-32.png",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "KidDo — Good Habits Today. Great Kids Tomorrow.",
    description:
      "KidDo helps children build positive habits, complete daily tasks, stay on top of schoolwork, earn meaningful rewards, and grow with support from parents and teachers.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "KidDo — Good Habits Today. Great Kids Tomorrow.",
    description:
      "KidDo helps children build positive habits, complete daily tasks, stay on top of schoolwork, earn meaningful rewards, and grow with support from parents and teachers.",
    images: ["/og-image.png"],
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
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
