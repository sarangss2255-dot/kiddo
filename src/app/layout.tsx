import type { Metadata, Viewport } from "next";
import "../index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "KidDo — Good Habits Today. Great Kids Tomorrow.",
    template: "%s | KidDo",
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://kiddoapp.in",
  ),
  alternates: { canonical: "/" },
  icons: {
    icon: "/kiddo-logo-32.png",
    apple: "/kiddo-logo-32.png",
  },
  openGraph: {
    type: "website",
    url: "/",
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
