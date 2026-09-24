import React from 'react';
import { ClipboardList, GraduationCap, Gift, BarChart3, Users2, Shield } from 'lucide-react';
import { Card } from '@/src/components/ui/Card';
import { Separator } from '@/src/components/ui/Separator';

const items = [
  { icon: ClipboardList, label: 'Smart Tasks', color: '#4FC3F7' },
  { icon: GraduationCap, label: 'School & Homework', color: '#81C784' },
  { icon: Gift, label: 'Rewards', color: '#FFB74D' },
  { icon: BarChart3, label: 'Growth Insights', color: '#87CEEB' },
  { icon: Users2, label: 'Parent–Teacher', color: '#1B3A4B' },
  { icon: Shield, label: 'Safe by Design', color: '#81C784' },
];

export function TrustStatement() {
  return (
    <section className="bg-kiddo-warm pb-10">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-slate-200/70 bg-white/80 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-slate-100">
            {items.map((item, index) => (
              <div
                key={item.label}
                className={`flex items-center justify-center gap-2.5 px-3 py-4 ${
                  index >= 4 ? 'col-span-1' : ''
                }`}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${item.color}14`, color: item.color }}
                >
                  <item.icon className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <span className="text-[13px] font-bold text-kiddo-navy leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <Separator className="opacity-60" />
          <div className="text-center py-3">
            <p className="text-[13px] font-semibold text-kiddo-muted">
              Everything they need to grow.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}
