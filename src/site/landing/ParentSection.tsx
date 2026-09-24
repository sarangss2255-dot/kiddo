import React from 'react';
import { ClipboardList, TrendingUp, Lock, Check } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Reveal } from './Reveal';

const benefits = [
  {
    icon: ClipboardList,
    title: 'Daily routines & school progress',
    text: 'Home tasks and school activities in one clear view.',
  },
  {
    icon: TrendingUp,
    title: 'Rewards & growth insights',
    text: 'See habits forming and know what motivates your child.',
  },
  {
    icon: Lock,
    title: 'Parent controls you set',
    text: 'Approve tasks, manage rewards and set limits your way.',
  },
];

const benefitPoints = [
  'Daily routines',
  'School progress',
  'Rewards',
  'Growth insights',
  'Parent controls',
];

export function ParentSection() {
  return (
    <section id="parents" className="py-16 md:py-24 bg-kiddo-sky/10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full opacity-20 bg-kiddo-blue blur-3xl" />
              <Card className="relative p-3 border-white shadow-[0_30px_60px_-15px_rgba(27,58,75,0.20)] overflow-hidden">
                <div className="rounded-xl bg-gradient-to-br from-kiddo-sky/25 to-kiddo-mint/40 aspect-[4/3] flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-white text-kiddo-blue flex items-center justify-center shadow-sm mb-4">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <p className="text-kiddo-navy text-[15px] font-bold">Parent App</p>
                    <p className="text-kiddo-muted text-[13px] mt-1 font-medium">
                      Preview from the running KidDo app
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <Badge variant="sky" className="px-3.5 py-1.5 text-xs">
                For Parents
              </Badge>
              <h2 className="mt-5 text-[32px] md:text-[42px] font-bold tracking-tight text-kiddo-navy leading-tight">
                Know what matters.
                <br />
                <span className="text-kiddo-blue">Without hovering over every task.</span>
              </h2>
              <div className="mt-8 space-y-5">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-kiddo-blue shadow-sm">
                      <benefit.icon className="h-[18px] w-[18px]" />
                    </div>
                    <div>
                      <p className="font-bold text-kiddo-navy">{benefit.title}</p>
                      <p className="mt-1 text-[15px] text-kiddo-muted leading-relaxed">
                        {benefit.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {benefitPoints.map((point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200/80 px-3 py-1.5 text-[13px] font-semibold text-kiddo-navy"
                  >
                    <Check className="h-3.5 w-3.5 text-kiddo-green" />
                    {point}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
