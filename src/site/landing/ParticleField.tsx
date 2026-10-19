'use client';

import React, { useEffect, useRef } from 'react';

type ParticleFieldProps = {
  className?: string;
  /** Colour scheme for the section that hosts it. */
  variant?: 'light' | 'dark';
  /** Upper bound on the number of particles (density is area-based). */
  count?: number;
  /** Radius (px) around the cursor where particles react. */
  hoverRadius?: number;
  /** Draw soft links between nearby particles. */
  connect?: boolean;
  /** Max distance (px) for particle-to-particle links. */
  linkDistance?: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  alpha: number;
  phase: number;
};

const PALETTES = {
  light: {
    dots: ['#4FC3F7', '#FFB74D', '#81C784', '#1B3A4B'],
    dotAlpha: [0.45, 0.85] as const,
    link: 'rgba(27,58,75,0.16)',
    hoverLink: 'rgba(79,195,247,0.75)',
    halo: 'rgba(79,195,247,0.22)',
  },
  dark: {
    dots: ['#87CEEB', '#FFB74D', '#81C784', '#FFFFFF'],
    dotAlpha: [0.4, 0.9] as const,
    link: 'rgba(255,255,255,0.2)',
    hoverLink: 'rgba(135,206,235,0.85)',
    halo: 'rgba(135,206,235,0.26)',
  },
} as const;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/**
 * Animated particle backdrop. Dots drift slowly and react to the pointer: they
 * are gently pushed away from the cursor, nearby dots link back to it and a
 * soft brand-coloured halo follows the mouse.
 *
 * The canvas is `pointer-events-none` (it never eats clicks) — pointer input is
 * read from the window and mapped into canvas space. Respects
 * `prefers-reduced-motion` (static field) and pauses when off-screen.
 */
export function ParticleField({
  className = '',
  variant = 'light',
  count = 64,
  hoverRadius = 150,
  connect = true,
  linkDistance = 130,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = PALETTES[variant];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let raf = 0;
    let lastTime = 0;
    let clock = 0;
    let inView = true;
    let visible = !document.hidden;

    // Pointer position in canvas space; `active` is false when the mouse is
    // outside the section (or on touch devices).
    const pointer = { x: -9999, y: -9999, active: false };
    const halo = { x: -9999, y: -9999 };

    const spawn = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: rand(-0.22, 0.22),
      vy: rand(-0.22, 0.22),
      r: rand(1.7, 4.2),
      color: palette.dots[Math.floor(Math.random() * palette.dots.length)],
      alpha: rand(palette.dotAlpha[0], palette.dotAlpha[1]),
      phase: Math.random() * Math.PI * 2,
    });

    const seed = () => {
      const target = Math.max(16, Math.min(count, Math.round((width * height) / 15000)));
      particles = Array.from({ length: target }, spawn);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      paint(0);
    };

    /** Draws one frame and advances the simulation by `dt` ms. */
    const paint = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      const step = Math.min(dt, 50) / 16.67;
      clock += dt;

      // Eased cursor halo.
      if (pointer.active) {
        if (halo.x < -9000) {
          halo.x = pointer.x;
          halo.y = pointer.y;
        } else {
          halo.x += (pointer.x - halo.x) * 0.14 * step;
          halo.y += (pointer.y - halo.y) * 0.14 * step;
        }

        const gradient = ctx.createRadialGradient(halo.x, halo.y, 0, halo.x, halo.y, hoverRadius);
        gradient.addColorStop(0, palette.halo);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(halo.x - hoverRadius, halo.y - hoverRadius, hoverRadius * 2, hoverRadius * 2);
      } else {
        halo.x = -9999;
        halo.y = -9999;
      }

      // Drift + hover repulsion.
      if (!reduceMotion) {
        for (const p of particles) {
          p.x += p.vx * step;
          p.y += p.vy * step;

          if (pointer.active) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < hoverRadius && dist > 0.5) {
              const force = (1 - dist / hoverRadius) * 0.9 * step;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }

          if (p.x < -12) p.x = width + 12;
          else if (p.x > width + 12) p.x = -12;
          if (p.y < -12) p.y = height + 12;
          else if (p.y > height + 12) p.y = -12;
        }
      }

      // Particle-to-particle constellation links.
      if (connect) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = palette.link;
        for (let i = 0; i < particles.length; i += 1) {
          const a = particles[i];
          for (let j = i + 1; j < particles.length; j += 1) {
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            if (Math.abs(dx) > linkDistance || Math.abs(dy) > linkDistance) continue;
            const dist = Math.hypot(dx, dy);
            if (dist > linkDistance) continue;
            ctx.globalAlpha = 1 - dist / linkDistance;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      }

      // Hover links from the cursor to nearby particles.
      if (pointer.active) {
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = palette.hoverLink;
        for (const p of particles) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist > hoverRadius) continue;
          ctx.globalAlpha = (1 - dist / hoverRadius) * 0.8;
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // Dots (drawn last so they stay crisp above the links).
      for (const p of particles) {
        const twinkle = reduceMotion ? 1 : 0.72 + 0.28 * Math.sin(clock * 0.0016 + p.phase);
        ctx.globalAlpha = Math.min(1, p.alpha * twinkle);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      raf = window.requestAnimationFrame(loop);
      if (!inView || !visible) {
        lastTime = time;
        return;
      }
      const dt = lastTime ? time - lastTime : 16.67;
      lastTime = time;
      paint(dt);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

      pointer.x = x;
      pointer.y = y;
      pointer.active = inside;
      if (!inside) {
        halo.x = -9999;
        halo.y = -9999;
      }
    };

    const onPointerLeave = () => {
      pointer.active = false;
      halo.x = -9999;
      halo.y = -9999;
    };

    const onVisibilityChange = () => {
      visible = !document.hidden;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
      },
      { rootMargin: '80px' },
    );
    intersectionObserver.observe(canvas);

    resize();

    if (!reduceMotion) {
      raf = window.requestAnimationFrame(loop);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onPointerMove, { passive: true });
      document.addEventListener('pointerleave', onPointerLeave);
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [variant, count, hoverRadius, connect, linkDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none h-full w-full ${className}`}
    />
  );
}
