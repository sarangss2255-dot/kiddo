import React from 'react';
import { Reveal } from './Reveal';

export function TestimonialsPlaceholder() {
  return (
    <section className="py-16 md:py-24 bg-kiddo-mint/30">
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight text-kiddo-navy">
            What families are saying
          </h2>
          <div className="mt-10 p-10 md:p-14 rounded-3xl border border-dashed border-kiddo-green/40 bg-white">
            <p className="text-kiddo-muted font-medium text-[15px]">
              Real testimonial will be added here.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
