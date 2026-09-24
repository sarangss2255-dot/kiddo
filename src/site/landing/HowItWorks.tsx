import React from 'react';
import { Reveal } from './Reveal';

const steps = [
  {
    number: '01',
    title: 'Set Goals',
    description: 'Parents and teachers create meaningful tasks.',
  },
  {
    number: '02',
    title: 'Kids Take Action',
    description: 'Children complete tasks and school activities.',
  },
  {
    number: '03',
    title: 'Watch Them Grow',
    description: 'Progress, rewards, habits and achievements build over time.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-kiddo-warm">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight text-kiddo-navy">
              How KidDo Works
            </h2>
            <p className="mt-4 text-[17px] text-kiddo-muted">
              A simple loop that builds lasting habits.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 0.12}>
              <div className="relative text-center px-4">
                <div
                  className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-lg font-extrabold text-white shadow-lg"
                  style={{
                    backgroundColor: index === 1 ? '#FFB74D' : index === 2 ? '#81C784' : '#4FC3F7',
                    boxShadow: `0 12px 28px -8px ${index === 1 ? '#FFB74D' : index === 2 ? '#81C784' : '#4FC3F7'}80`,
                  }}
                >
                  {step.number}
                </div>
                <h3 className="mt-5 text-xl font-bold text-kiddo-navy">{step.title}</h3>
                <p className="mt-2 text-[15px] text-kiddo-muted leading-relaxed max-w-[280px] mx-auto">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
