import React from 'react';
import Link from 'next/link';
import { Download, ArrowUpRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export function FinalCTA() {
  return (
    <section id="download" className="py-20 md:py-28 bg-kiddo-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 right-[15%] w-[420px] h-[420px] rounded-full opacity-15 bg-kiddo-blue blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[10%] w-[380px] h-[380px] rounded-full opacity-10 bg-kiddo-orange blur-[100px]" />
      </div>

      <div className="relative max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-[32px] md:text-5xl font-bold leading-tight tracking-tight">
          Make every day a little more meaningful.
        </h2>
        <p className="mt-5 text-lg text-white/70 max-w-[560px] mx-auto leading-relaxed">
          Help your child build habits, discover progress, and enjoy the journey along the way.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="xl"
            className="w-full sm:w-auto bg-kiddo-blue text-white hover:bg-white hover:text-kiddo-navy shadow-lg shadow-kiddo-blue/30"
          >
            <Link href="/download">
              Download the App
              <Download />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="xl"
            className="w-full sm:w-auto bg-transparent border-white/25 text-white hover:bg-white/10"
          >
            <a href="#how-it-works">
              See how it works
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
