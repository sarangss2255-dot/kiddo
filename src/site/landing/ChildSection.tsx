import React from 'react';
import { motion } from 'motion/react';
import { PhoneDashboard } from './PhoneDashboard';
import { Compass, UserCircle, Gift, Trophy, Flame, Gamepad2, Download } from 'lucide-react';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';
import { CHILD_APP_APK_URL } from '@/src/lib/site-config';
import { Reveal } from './Reveal';

const childFeatures = [
  { icon: Compass, text: 'Missions', color: '#4FC3F7' },
  { icon: UserCircle, text: 'Avatar', color: '#FFB74D' },
  { icon: Gift, text: 'Rewards', color: '#FFB74D' },
  { icon: Trophy, text: 'Achievements', color: '#81C784' },
  { icon: Flame, text: 'Streaks', color: '#FFB74D' },
  { icon: Gamepad2, text: 'Mini games', color: '#81C784' },
];

export function ChildSection() {
  return (
    <section className="py-16 md:py-24 bg-kiddo-mint/50 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div>
              <Badge variant="sky" className="px-3.5 py-1.5 text-xs">
                For Kids
              </Badge>
              <h2 className="mt-5 text-[32px] md:text-[42px] font-bold tracking-tight text-kiddo-navy leading-tight">
                For kids, it feels like
                <br />
                <span className="text-kiddo-blue">an adventure.</span>
              </h2>
              <p className="mt-5 text-[17px] text-kiddo-muted leading-relaxed max-w-[540px]">
                Every day brings new missions, rewards and discoveries. Progress feels
                like play — because it is.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {childFeatures.map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm hover:-translate-y-0.5 transition-transform"
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}1F`, color: item.color }}
                    >
                      <item.icon className="h-[15px] w-[15px]" />
                    </span>
                    <span className="text-[15px] font-bold text-kiddo-navy">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild size="xl" variant="accent" className="w-full sm:w-auto">
                  <a href={CHILD_APP_APK_URL} download>
                    <Download />
                    Download the Child App
                  </a>
                </Button>
                <p className="mt-3 text-[13px] font-medium text-kiddo-muted">
                  Android APK · Free for KidDo families
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative flex justify-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[480px] rounded-full opacity-20 bg-kiddo-orange blur-[70px]" />
              <div className="relative animate-float-slow">
                <PhoneDashboard />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
