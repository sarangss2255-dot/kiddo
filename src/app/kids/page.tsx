"use client";

import { Navbar } from "@/src/site/landing/Navbar";
import { ChildSection } from "@/src/site/landing/ChildSection";
import { AppPreview } from "@/src/site/landing/AppPreview";
import { SafetySection } from "@/src/site/landing/SafetySection";
import { FinalCTA } from "@/src/site/landing/FinalCTA";
import { Footer } from "@/src/site/landing/Footer";

export default function KidsPage() {
  return (
    <div className="min-h-screen bg-kiddo-warm text-slate-900 font-sans overflow-x-hidden">
      <Navbar />
      <main className="pt-16 md:pt-[68px]">
        <ChildSection />
        <AppPreview />
        <SafetySection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
