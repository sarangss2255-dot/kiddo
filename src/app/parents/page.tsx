"use client";

import { Navbar } from "@/src/site/landing/Navbar";
import { ParentSection } from "@/src/site/landing/ParentSection";
import { Features } from "@/src/site/landing/Features";
import { HowItWorks } from "@/src/site/landing/HowItWorks";
import { TestimonialsPlaceholder } from "@/src/site/landing/TestimonialsPlaceholder";
import { FinalCTA } from "@/src/site/landing/FinalCTA";
import { Footer } from "@/src/site/landing/Footer";

export default function ParentsPage() {
  return (
    <div className="min-h-screen bg-kiddo-warm text-slate-900 font-sans overflow-x-hidden">
      <Navbar />
      <main className="pt-16 md:pt-[68px]">
        <ParentSection />
        <Features />
        <HowItWorks />
        <TestimonialsPlaceholder />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
