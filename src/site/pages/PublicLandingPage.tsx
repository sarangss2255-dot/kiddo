import React from 'react';
import { Navbar } from '../landing/Navbar';
import { Hero } from '../landing/Hero';
import { TrustStatement } from '../landing/TrustStatement';
import { Features } from '../landing/Features';
import { HowItWorks } from '../landing/HowItWorks';
import { AppPreview } from '../landing/AppPreview';
import { ParentSection } from '../landing/ParentSection';
import { TeacherSection } from '../landing/TeacherSection';
import { ChildSection } from '../landing/ChildSection';
import { SafetySection } from '../landing/SafetySection';
import { GrowthModel } from '../landing/GrowthModel';
import { TestimonialsPlaceholder } from '../landing/TestimonialsPlaceholder';
import { FAQ } from '../landing/FAQ';
import { FinalCTA } from '../landing/FinalCTA';
import { Footer } from '../landing/Footer';

export function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-kiddo-warm text-slate-900 font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TrustStatement />
        <Features />
        <HowItWorks />
        <AppPreview />
        <ParentSection />
        <TeacherSection />
        <ChildSection />
        <SafetySection />
        <GrowthModel />
        <TestimonialsPlaceholder />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
