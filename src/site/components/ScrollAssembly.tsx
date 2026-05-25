import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { BarChart3, Gift, MessageCircleMore, Puzzle, ShieldCheck, Star } from 'lucide-react';
import { Reveal } from './Reveal';

type NodeItem = {
  id: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  x: number;
  y: number;
};

const nodes: NodeItem[] = [
  { id: 'routines', title: 'Routine Logic', detail: 'Timed loops for mornings and evenings', icon: Star, x: -270, y: -150 },
  { id: 'learning', title: 'Learning Pulse', detail: 'Challenges inside daily behavior', icon: Puzzle, x: 270, y: -145 },
  { id: 'rewards', title: 'Reward Engine', detail: 'Incentives linked to visible progress', icon: Gift, x: -282, y: 150 },
  { id: 'insights', title: 'Parent Signals', detail: 'Approval and consistency intelligence', icon: BarChart3, x: 286, y: 150 },
  { id: 'support', title: 'Encouragement Layer', detail: 'Soft prompts and feedback loops', icon: MessageCircleMore, x: 0, y: 254 },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const mix = (start: number, end: number, amount: number) => start + (end - start) * amount;
const easeOut = (value: number) => 1 - Math.pow(1 - value, 3);

export function ScrollAssembly() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const travel = Math.max(sectionRef.current.offsetHeight - window.innerHeight, 1);
      const next = clamp(-rect.top / travel, 0, 1);
      setProgress((current) => (Math.abs(current - next) > 0.001 ? next : current));
    };

    const requestTick = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    requestTick();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);

    return () => {
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  const motion = easeOut(progress);
  const centerScale = mix(0.88, 1.26, motion);
  const connectorOpacity = mix(0.05, 0.92, motion);

  return (
    <section ref={sectionRef} className="relative min-h-[220vh] px-4 py-16 md:px-8" aria-labelledby="assembly-title">
      <div className="sticky top-0 flex min-h-screen items-center overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(129,140,248,0.16),_rgba(196,181,253,0.12),_transparent_70%)] blur-3xl" />

        <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal className="space-y-6">
            <div className="font-label text-[11px] text-[#171717]/48">WAVE CONNECTOR / SYSTEM MAP</div>
            <h2 id="assembly-title" className="max-w-xl font-display text-5xl leading-[0.95] md:text-7xl">
              One center,
              <span className="italic text-[#4338ca]"> many intelligent edges</span>.
            </h2>
            <p className="max-w-xl text-lg leading-[1.5] text-[#171717]/68">
              The core system expands as the user scrolls, then connects to every smaller capability through curved signal paths and soft indigo depth.
            </p>
          </Reveal>

          <div className="relative h-[680px]">
            <div className="absolute left-1/2 top-1/2 h-[620px] w-full max-w-[760px] -translate-x-1/2 -translate-y-1/2">
              <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="-380 -310 760 620" aria-hidden="true">
                {nodes.map((node) => {
                  const x = mix(0, node.x, motion);
                  const y = mix(0, node.y, motion);
                  const distance = Math.hypot(x, y);
                  const startGap = mix(82, 118, motion);
                  const endGap = 54;
                  const startX = distance ? (x / distance) * startGap : 0;
                  const startY = distance ? (y / distance) * startGap : 0;
                  const endX = distance ? x - (x / distance) * endGap : 0;
                  const endY = distance ? y - (y / distance) * endGap : 0;
                  const controlX = x * 0.54;
                  const controlY = y * 0.54 - (y > 0 ? -22 : 22);

                  return (
                    <path
                      key={node.id}
                      d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
                      fill="none"
                      stroke="#4338ca"
                      strokeLinecap="round"
                      strokeWidth={2.2}
                      strokeDasharray="10 12"
                      style={{ opacity: connectorOpacity, filter: 'drop-shadow(0 0 18px rgba(67,56,202,0.16))' }}
                    />
                  );
                })}
              </svg>

              <div
                className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e5e5e5] bg-[#171717] text-white"
                style={{
                  transform: `translate3d(-50%, -50%, 0) scale(${centerScale})`,
                  boxShadow: '0 0 40px rgba(67,56,202,0.15)',
                }}
              >
                <div className="absolute inset-[-20px] rounded-full bg-[radial-gradient(circle,_rgba(129,140,248,0.2),_transparent_72%)]" />
                <div className="relative flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="rounded-full border border-white/12 bg-white/8 p-4">
                    <ShieldCheck size={30} />
                  </div>
                  <div className="font-label text-[10px] text-white/52">Core Signal</div>
                  <div className="font-display text-4xl">KidDo</div>
                  <p className="max-w-[150px] text-sm leading-relaxed text-white/72">Behavior, trust, and motivation in one fluid loop.</p>
                </div>
              </div>

              {nodes.map((node) => {
                const x = mix(0, node.x, motion);
                const y = mix(0, node.y, motion);
                const scale = mix(0.46, 1, motion);
                const opacity = mix(0.12, 1, motion);
                const Icon = node.icon;

                return (
                  <div
                    key={node.id}
                    className="absolute left-1/2 top-1/2 w-[188px] rounded-2xl border border-[#e5e5e5] bg-white/88 p-5 backdrop-blur-sm md:w-[210px]"
                    style={{
                      opacity,
                      transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`,
                      boxShadow: '0 18px 40px rgba(67,56,202,0.06)',
                    }}
                  >
                    <div className="inline-flex rounded-full border border-[#e5e5e5] bg-[#f5f3ff] p-3 text-[#4338ca]">
                      <Icon size={18} />
                    </div>
                    <div className="mt-4 font-display text-2xl leading-none text-[#171717]">{node.title}</div>
                    <div className="mt-2 font-label text-[10px] text-[#171717]/48">{node.id}</div>
                    <p className="mt-3 text-sm leading-relaxed text-[#171717]/64">{node.detail}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
