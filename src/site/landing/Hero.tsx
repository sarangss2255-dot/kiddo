'use client';

import React from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';
import { PhoneDashboard } from './PhoneDashboard';
import { Download, Play, Heart, Trophy, TrendingUp } from 'lucide-react';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const callouts = [
  {
    icon: Heart,
    label: 'Healthy habits',
    color: '#4FC3F7',
    position: 'top-10 -right-24 md:-right-28 lg:-top-9 lg:right-2',
    from: 18,
    delay: 0.5,
    floatDelay: '0s',
  },
  {
    icon: Trophy,
    label: 'Earn rewards',
    color: '#FFB74D',
    position: 'top-[32%] -left-24 md:-left-32 lg:-left-36',
    from: -18,
    delay: 0.65,
    floatDelay: '-2.5s',
  },
  {
    icon: TrendingUp,
    label: 'Daily growth',
    color: '#81C784',
    position: 'bottom-16 -right-20 md:-right-24 lg:bottom-24 lg:right-auto lg:-left-32',
    from: 18,
    delay: 0.8,
    floatDelay: '-4.5s',
  },
];

const statementWords = ['habits', 'school', 'rewards', 'growth'];

export function Hero() {
  const reduced = useReducedMotion();

  const tiltX = useSpring(0, { stiffness: 170, damping: 18, mass: 0.6 });
  const tiltY = useSpring(0, { stiffness: 170, damping: 18, mass: 0.6 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(40);
  const glare = useMotionTemplate`radial-gradient(340px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.55), transparent 62%)`;

  const handlePhoneMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    tiltY.set((px - 0.5) * 10);
    tiltX.set((0.5 - py) * 8);
    glareX.set(px * 100);
    glareY.set(py * 100);
  };

  const resetPhoneTilt = () => {
    tiltY.set(0);
    tiltX.set(0);
    glareX.set(50);
    glareY.set(40);
  };

  return (
    <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 overflow-hidden bg-kiddo-warm">
      {/* Subtle brand glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 right-[8%] w-[520px] h-[520px] rounded-full opacity-[0.13] bg-kiddo-blue blur-[110px] animate-drift" />
        <div className="absolute top-24 -left-32 w-[460px] h-[460px] rounded-full opacity-[0.11] bg-kiddo-orange blur-[120px] animate-drift-slow" />
        <div
          className="absolute bottom-[-10%] right-[35%] w-[420px] h-[420px] rounded-full opacity-[0.10] bg-kiddo-mint blur-[110px] animate-drift"
          style={{ animationDelay: '-6s' }}
        />
      </div>

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[48%_52%] gap-10 lg:gap-4 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <Badge
                variant="sky"
                className="group relative overflow-hidden px-4 py-1.5 text-xs transition-transform duration-300 hover:scale-105"
              >
                Built for growing minds
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[130%] skew-x-[-14deg] bg-gradient-to-r from-transparent via-white/70 to-transparent group-hover:animate-shine"
                />
              </Badge>
            </motion.div>

            <h1 className="mt-6 text-[42px] sm:text-5xl lg:text-[64px] lg:leading-[1.04] xl:text-[68px] font-extrabold tracking-tight text-kiddo-navy max-w-[650px] mx-auto lg:mx-0">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={reduced ? { opacity: 0 } : { y: '110%' }}
                  animate={reduced ? { opacity: 1 } : { y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                >
                  Good Habits Today.
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block bg-gradient-to-r from-kiddo-blue via-kiddo-sky to-kiddo-blue bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x"
                  initial={reduced ? { opacity: 0 } : { y: '110%' }}
                  animate={reduced ? { opacity: 1 } : { y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                >
                  Great Kids Tomorrow.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="mt-6 text-[17px] sm:text-lg text-kiddo-muted leading-[1.6] max-w-[580px] mx-auto lg:mx-0 font-body"
            >
              KidDo helps children build healthy habits, complete daily responsibilities,
              stay on top of schoolwork, and grow through meaningful rewards — with parents
              and teachers right there with them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5"
            >
              <Button
                asChild
                size="xl"
                className="group relative w-full overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-16px_rgba(79,195,247,0.75)] sm:w-auto"
              >
                <Link href="/download" className="relative">
                  <span className="relative z-10 inline-flex items-center gap-2">
                    Download the App
                    <Download className="transition-transform duration-300 group-hover:translate-y-0.5" />
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[150%] skew-x-[-14deg] bg-gradient-to-r from-transparent via-white/45 to-transparent group-hover:animate-shine"
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="group w-full bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-kiddo-sky/60 hover:bg-white hover:shadow-[0_18px_36px_-18px_rgba(27,58,75,0.45)] sm:w-auto"
              >
                <a href="#how-it-works">
                  <span className="relative flex w-7 h-7 items-center justify-center rounded-full bg-kiddo-sky/25 transition-transform duration-300 group-hover:scale-110 shrink-0">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-kiddo-sky/40 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-ring"
                    />
                    <Play className="h-3.5 w-3.5 fill-kiddo-blue text-kiddo-blue transition-transform duration-300 group-hover:translate-x-0.5" />
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
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="relative flex justify-center lg:justify-end lg:pr-8 pt-6 lg:pt-0"
          >
            <div
              onMouseMove={handlePhoneMove}
              onMouseLeave={resetPhoneTilt}
              className="relative [perspective:1200px]"
            >
              {/* Soft glow behind the phone (anchored to the phone, not the column) */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[520px] rounded-full bg-kiddo-blue blur-[80px] animate-glow" />

              {/* 3D tilt + parallax glare follow the cursor */}
              <motion.div
                style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
                className="relative will-change-transform"
              >
                <div className="animate-float-slow">
                  <PhoneDashboard />
                </div>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[42px]"
                  style={{ background: glare, mixBlendMode: 'soft-light' }}
                />
              </motion.div>

              {/* Floating callouts — kept clear of the dashboard content */}
              {callouts.map((callout) => (
                <motion.div
                  key={callout.label}
                  initial={{ opacity: 0, x: callout.from, y: 8 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.55, delay: callout.delay, ease: EASE }}
                  className={`absolute z-20 hidden sm:block ${callout.position}`}
                >
                  <div className="animate-float" style={{ animationDelay: callout.floatDelay }}>
                    <div className="group flex cursor-default items-center gap-2 rounded-xl bg-white/95 px-3 py-2 border border-slate-100 shadow-[0_8px_24px_rgba(27,58,75,0.10)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_18px_38px_rgba(27,58,75,0.18)]">
                      <span
                        className="flex w-6 h-6 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-8deg]"
                        style={{ backgroundColor: `${callout.color}1F`, color: callout.color }}
                      >
                        <callout.icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold text-kiddo-navy whitespace-nowrap">
                        {callout.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-14 md:mt-20 text-center"
        >
          <p className="text-[15px] md:text-base font-semibold text-kiddo-muted">
            One place for{' '}
            {statementWords.map((word, index) => (
              <React.Fragment key={word}>
                {index > 0 && (index === statementWords.length - 1 ? ' and ' : ', ')}
                <motion.span
                  className="inline-block font-bold text-kiddo-navy transition-colors duration-300 hover:text-kiddo-blue"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: 0.35 + index * 0.12, ease: EASE }}
                >
                  {word}
                </motion.span>
              </React.Fragment>
            ))}
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
