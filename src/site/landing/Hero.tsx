import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { PhoneDashboard } from './PhoneDashboard';
import { Download, Play, Heart, Trophy, TrendingUp } from 'lucide-react';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

const callouts = [
  { icon: Heart, label: 'Build healthy habits', color: '#4FC3F7', position: 'top-8 -right-4 lg:-right-10' },
  { icon: Trophy, label: 'Earn rewards', color: '#FFB74D', position: 'bottom-40 -left-6 lg:-left-14' },
  { icon: TrendingUp, label: 'Grow every day', color: '#81C784', position: 'bottom-6 -right-2 lg:-right-8' },
];

export function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden bg-kiddo-warm">
      {/* Subtle brand glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-[8%] w-[520px] h-[520px] rounded-full opacity-[0.13] bg-kiddo-blue blur-[110px]" />
        <div className="absolute top-24 -left-32 w-[460px] h-[460px] rounded-full opacity-[0.11] bg-kiddo-orange blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[35%] w-[420px] h-[420px] rounded-full opacity-[0.10] bg-kiddo-mint blur-[110px]" />
      </div>

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[48%_52%] gap-10 lg:gap-4 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge variant="sky" className="px-4 py-1.5 text-xs">
                Built for growing minds
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-[42px] sm:text-5xl lg:text-[64px] lg:leading-[1.04] xl:text-[68px] font-extrabold tracking-tight text-kiddo-navy max-w-[650px] mx-auto lg:mx-0"
            >
              Good Habits Today.
              <span className="block text-kiddo-blue">Great Kids Tomorrow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-[17px] sm:text-lg text-kiddo-muted leading-[1.6] max-w-[580px] mx-auto lg:mx-0 font-body"
            >
              KidDo helps children build healthy habits, complete daily responsibilities,
              stay on top of schoolwork, and grow through meaningful rewards — with parents
              and teachers right there with them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5"
            >
              <Button asChild size="xl" className="w-full sm:w-auto">
                <Link href="/download">
                  Download the App
                  <Download />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="w-full sm:w-auto bg-white"
              >
                <a href="#how-it-works">
                  <span className="w-7 h-7 rounded-full bg-kiddo-sky/25 flex items-center justify-center shrink-0">
                    <Play className="h-3.5 w-3.5 fill-kiddo-blue text-kiddo-blue" />
                  </span>
                  See how it works
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Right: phone */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-end lg:pr-8 pt-6 lg:pt-0"
          >
            {/* Soft glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[520px] rounded-full opacity-25 bg-kiddo-blue blur-[80px]" />

            <div className="relative animate-float-slow">
              <PhoneDashboard />

              {/* Subtle callouts — never cover the dashboard */}
              {callouts.map((callout) => (
                <div
                  key={callout.label}
                  className={`hidden sm:flex absolute ${callout.position} items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white shadow-[0_8px_24px_rgba(27,58,75,0.10)] border border-slate-100 z-10`}
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${callout.color}1F`, color: callout.color }}
                  >
                    <callout.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[13px] font-bold text-kiddo-navy whitespace-nowrap">
                    {callout.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-14 md:mt-20 text-center"
        >
          <p className="text-[15px] md:text-base font-semibold text-kiddo-muted">
            One place for <span className="text-kiddo-navy">habits</span>,{' '}
            <span className="text-kiddo-navy">school</span>,{' '}
            <span className="text-kiddo-navy">rewards</span> and{' '}
            <span className="text-kiddo-navy">growth</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
