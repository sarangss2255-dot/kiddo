import React from 'react';
import { Shield, UserCog, Link2, UserCheck, MessageSquareLock, UsersRound } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Reveal } from './Reveal';

const safetyItems = [
  {
    icon: UserCog,
    title: 'Parent-controlled experience',
    description: 'Parents decide what children can see and do.',
  },
  {
    icon: Link2,
    title: 'Secure family linking',
    description: 'Children join families through parent-approved codes.',
  },
  {
    icon: UserCheck,
    title: 'Role-based access',
    description: 'Different controls for parents, teachers, and children.',
  },
  {
    icon: UsersRound,
    title: 'Protected child accounts',
    description: 'Child accounts are designed for safety from the ground up.',
  },
  {
    icon: MessageSquareLock,
    title: 'Controlled communication',
    description: 'Communication happens through approved channels.',
  },
  {
    icon: Shield,
    title: 'Privacy-first architecture',
    description: 'No public profiles or open social features.',
  },
];

export function SafetySection() {
  return (
    <section id="safety" className="py-16 md:py-24 bg-kiddo-warm">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-[640px] mx-auto mb-12 md:mb-16">
            <Badge variant="mint" className="px-3.5 py-1.5 text-xs">
              Safety
            </Badge>
            <h2 className="mt-5 text-[32px] md:text-[42px] font-bold tracking-tight text-kiddo-navy leading-tight">
              Built with kids' safety in mind.
            </h2>
            <p className="mt-4 text-[17px] text-kiddo-muted leading-relaxed">
              We take a privacy-first approach and give parents the controls they need.
            </p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {safetyItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <Card className="p-6 border-slate-200/70 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(27,58,75,0.08)] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-kiddo-green/10 text-kiddo-green flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-kiddo-navy">{item.title}</h3>
                <p className="mt-1.5 text-[15px] text-kiddo-muted leading-relaxed">
                  {item.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
