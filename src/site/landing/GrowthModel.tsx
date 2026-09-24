import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Reveal } from './Reveal';

const steps = [
  { label: 'Daily Tasks', color: '#4FC3F7' },
  { label: 'Positive Habits', color: '#87CEEB' },
  { label: 'Progress', color: '#81C784' },
  { label: 'Rewards', color: '#FFB74D' },
  { label: 'Confidence', color: '#FFB74D' },
  { label: 'Growth', color: '#1B3A4B' },
];

export function GrowthModel() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight text-kiddo-navy">
              How kids grow with KidDo
            </h2>
            <p className="mt-4 text-[17px] text-kiddo-muted">
              Small steps that build into lasting confidence.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3 md:gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.label}>
              <Reveal delay={index * 0.08}>
                <div
                  className="px-6 md:px-7 py-3.5 rounded-2xl font-bold text-base md:text-lg text-white shadow-lg text-center"
                  style={{
                    backgroundColor: step.color,
                    boxShadow: `0 12px 28px -10px ${step.color}99`,
                  }}
                >
                  {step.label}
                </div>
              </Reveal>
              {index < steps.length - 1 && (
                <ArrowDown
                  size={18}
                  className="hidden md:block rotate-[-90deg] shrink-0 text-slate-300 mx-1"
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
