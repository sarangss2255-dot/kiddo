import React from 'react';
import { PhoneDashboard } from './PhoneDashboard';
import { Reveal } from './Reveal';

const previews = [
  {
    label: 'Child Dashboard',
    sub: 'Today\'s missions at a glance',
    offset: '0%',
  },
  {
    label: 'Tasks & Rewards',
    sub: 'Complete, earn, and shop',
    offset: '-34%',
  },
  {
    label: 'Progress & Growth',
    sub: 'Streaks, levels and habits',
    offset: '-64%',
  },
];

export function AppPreview() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight text-kiddo-navy">
              See KidDo in action
            </h2>
            <p className="mt-4 text-[17px] text-kiddo-muted max-w-[560px] mx-auto">
              The same app your child uses every day — the real KidDo child experience.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-3 gap-4 md:gap-8 items-start">
          {previews.map((preview, index) => (
            <Reveal key={preview.label} delay={index * 0.1}>
              <div className="text-center">
                {/* Device frame */}
                <div className="mx-auto w-[92%] max-w-[250px] rounded-[36px] p-[7px] shadow-[0_30px_60px_-15px_rgba(27,58,75,0.25)]"
                  style={{ background: 'linear-gradient(145deg, #3a3a3a, #111)' }}
                >
                  <div className="relative overflow-hidden rounded-[30px] aspect-[9/19.5]">
                    {/* Simulated scroll: show a section of the real dashboard */}
                    <div className="absolute left-0 right-0" style={{ transform: `translateY(${preview.offset})` }}>
                      <PhoneDashboard variant="screen" />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[15px] font-bold text-kiddo-navy">{preview.label}</p>
                <p className="mt-1 text-[13px] text-kiddo-muted">{preview.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-12 text-center text-[14px] text-kiddo-muted">
            Real screens from the KidDo Child App · Missions, rewards, streaks and progress
          </p>
        </Reveal>
      </div>
    </section>
  );
}
