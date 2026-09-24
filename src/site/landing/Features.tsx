import React from 'react';
import { ClipboardList, GraduationCap, Gift, BarChart3, Users2, Shield } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Reveal } from './Reveal';

const features = [
  {
    icon: ClipboardList,
    title: 'Smart Tasks',
    description: 'Build routines without making them feel like chores.',
    color: '#4FC3F7',
  },
  {
    icon: GraduationCap,
    title: 'School & Homework',
    description: 'Keep home responsibilities and school activities together.',
    color: '#81C784',
  },
  {
    icon: Gift,
    title: 'Rewards & Coins',
    description: 'Turn progress into meaningful rewards kids look forward to.',
    color: '#FFB74D',
  },
  {
    icon: BarChart3,
    title: 'Growth Insights',
    description: 'Understand progress instead of simply tracking numbers.',
    color: '#87CEEB',
  },
  {
    icon: Users2,
    title: 'Parent–Teacher Collaboration',
    description: 'Give parents and teachers a shared view of the child\'s journey.',
    color: '#1B3A4B',
  },
  {
    icon: Shield,
    title: 'Safe by Design',
    description: 'Privacy and child safety come first.',
    color: '#81C784',
  },
];

export function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-[700px] mx-auto">
            <h2 className="text-[32px] md:text-[44px] font-bold tracking-tight text-kiddo-navy leading-tight">
              Everything your child needs to grow.
            </h2>
            <p className="mt-4 text-[17px] text-kiddo-muted leading-relaxed">
              Habits, school, rewards and growth — designed for the whole family.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.06}>
              <Card className="p-5 md:p-6 border-slate-100 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(27,58,75,0.08)] hover:border-kiddo-sky/40 transition-all duration-300">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}14`, color: feature.color }}
                >
                  <feature.icon className="h-[22px] w-[22px]" strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-kiddo-navy">{feature.title}</h3>
                <p className="mt-1.5 text-[15px] text-kiddo-muted leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
