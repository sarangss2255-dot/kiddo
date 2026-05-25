import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SiteHeader } from '../components/SiteHeader';

const proofItems = [
  { quote: 'MORNINGS STOPPED FEELING CHAOTIC.', by: 'PARENT REVIEW' },
  { quote: 'KIDS KNEW WHAT TO DO NEXT.', by: 'FAMILY FEEDBACK' },
  { quote: 'REWARDS FINALLY FELT FAIR.', by: 'HOME ROUTINE TEST' },
  { quote: 'APPROVALS TOOK SECONDS, NOT ARGUMENTS.', by: 'BETA GROUP' },
];

const compareRows = [
  { label: 'THE OLD WAY', title: 'NAG', better: 'GUIDE', detail: 'Parents repeat the same chores every day and kids rely on reminders.' },
  { label: 'THE OLD WAY', title: 'GUESS', better: 'SEE', detail: 'Progress is unclear, streaks disappear, and routines lose momentum.' },
  { label: 'THE OLD WAY', title: 'BARGAIN', better: 'EARN', detail: 'Rewards happen randomly instead of following a consistent family system.' },
];

const steps = [
  {
    tag: 'STEP 01',
    title: 'SET THE ROUTINE',
    body: 'Create chores, morning checklists, bedtime steps, and learning tasks in one place so the family starts from a shared plan.',
  },
  {
    tag: 'STEP 02',
    title: 'TRACK THE DAY',
    body: 'Kids complete visible missions, parents review finished work, and progress updates into streaks, stars, and next actions.',
  },
  {
    tag: 'STEP 03',
    title: 'REWARD THE WIN',
    body: 'Approved work turns into earned rewards so the app reinforces consistency instead of creating another negotiation loop.',
  },
];

const BETA_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

function formatCountdown(targetTime: number) {
  const remaining = Math.max(targetTime - Date.now(), 0);
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const mins = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return [
    { value: String(days).padStart(2, '0'), label: 'DAYS' },
    { value: String(hours).padStart(2, '0'), label: 'HOURS' },
    { value: String(mins).padStart(2, '0'), label: 'MINS' },
  ];
}

export function PublicLandingPage() {
  const [targetTime] = useState(() => Date.now() + BETA_WINDOW_MS);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const countdown = useMemo(() => formatCountdown(targetTime), [now, targetTime]);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <SiteHeader />

      <div className="fixed right-0 top-0 hidden h-screen w-[200px] lg:flex">
        {['DESIGN', 'BUILD', 'SHIP'].map((label) => (
          <div key={label} className="flex-1 border-l-4 border-black bg-white text-black">
            <div className="flex h-full items-center justify-center [writing-mode:vertical-rl]">
              <span className="font-label text-sm font-bold">{label}</span>
            </div>
          </div>
        ))}
      </div>

      <main className="pb-20 lg:pr-[200px]">
        <section className="border-b-8 border-black bg-[#ccff00] px-4 py-16 text-black md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="neo-shadow-black inline-flex rotate-[-2deg] border-4 border-black bg-white px-4 py-2 font-label text-xs font-bold">
              KIDDO FAMILY APP / ROUTINES TASKS REWARDS
            </div>

            <Reveal className="mt-8 max-w-6xl">
              <h1 className="font-display text-[28vw] leading-[0.85] tracking-tight text-black md:text-[180px]">
                MAKE
                <br />
                ROUTINES
                <br />
                STICK
              </h1>
            </Reveal>

            <Reveal className="mt-6 max-w-3xl">
              <p className="text-2xl italic leading-tight md:text-3xl">
                KidDo helps parents assign tasks, track progress, approve completed work, and turn everyday consistency into earned rewards.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <div className="neo-shadow-black flex max-w-3xl flex-col border-4 border-black bg-white text-black sm:flex-row">
                <input
                  type="email"
                  placeholder="ENTER YOUR EMAIL"
                  className="min-w-0 flex-1 bg-white px-5 py-4 font-label text-sm font-bold outline-none"
                />
                <button className="border-t-4 border-black bg-black px-6 py-4 font-display text-2xl leading-none text-white transition-colors hover:bg-white hover:text-black sm:border-l-4 sm:border-t-0">
                  START
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="proof" className="border-b-4 border-t-4 border-black bg-white px-4 py-8 text-black md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-2 xl:grid-cols-4">
            {proofItems.map((item, index) => (
              <Reveal key={item.quote} delayMs={index * 80}>
                <div className={`neo-shadow-black border-4 border-black bg-white p-4 ${index % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]'}`}>
                  <div className="mb-4 h-12 w-12 border-4 border-black bg-[#121212]" />
                  <div className="font-label text-[11px] font-bold text-black">{item.by}</div>
                  <p className="mt-3 font-label text-sm font-bold leading-relaxed text-black">{item.quote}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="compare" className="border-b-8 border-black bg-[#121212]">
          {compareRows.map((row) => (
            <div key={row.title} className="grid border-b-8 border-black last:border-b-0 lg:grid-cols-2">
              <div className="bg-black px-4 py-10 md:px-6 lg:px-8">
                <div className="mx-auto max-w-[560px]">
                  <div className="font-label text-xs font-bold text-[#475569]">{row.label}</div>
                  <div className="mt-4 font-display text-6xl leading-[0.85] text-[#475569] md:text-[80px]">{row.title}</div>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-[#64748b]">{row.detail}</p>
                </div>
              </div>
              <div className="bg-[#ccff00] px-4 py-10 text-black md:px-6 lg:px-8">
                <div className="mx-auto max-w-[560px]">
                  <div className="font-label text-xs font-bold">THE BETTER WAY</div>
                  <div className="mt-4 font-display text-6xl leading-[0.85] md:text-[80px]">{row.better}</div>
                  <p className="mt-4 max-w-md text-base font-medium leading-relaxed">
                    KidDo gives families a clear system for what needs to happen, what is already done, and what reward has actually been earned.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section id="process" className="border-b-8 border-black bg-[#121212] px-4 py-16 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-10 font-label text-xs font-bold text-white">PROCESS BLUEPRINT</div>
            <div className="grid gap-6 lg:grid-cols-3">
              {steps.map((step, index) => (
                <Reveal key={step.tag} delayMs={index * 90}>
                  <div className="neo-shadow-white relative overflow-hidden border-8 border-black bg-white p-6 text-black">
                    <div className="absolute right-4 top-0 font-display text-[180px] leading-none text-black/[0.03]">
                      {index + 1}
                    </div>
                    <div className="inline-flex rotate-[-3deg] border-4 border-black bg-[#ccff00] px-3 py-2 font-label text-xs font-bold">
                      {step.tag}
                    </div>
                    <h3 className="mt-6 max-w-sm font-display text-5xl leading-[0.85]">{step.title}</h3>
                    <p className="relative mt-5 text-base font-medium leading-relaxed">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b-8 border-black bg-white px-4 py-16 text-black md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-8 font-label text-xs font-bold">BETA WINDOW</div>
            <div className="flex flex-wrap gap-4">
              {countdown.map((item) => (
                <div key={item.label} className="neo-shadow-black min-w-[120px] border-4 border-black bg-white px-5 py-4">
                  <div className="text-5xl font-extrabold leading-none">{item.value}</div>
                  <div className="mt-2 font-label text-xs font-bold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#ccff00] px-4 py-16 text-black md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1180px]">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <div className="font-label text-xs font-bold">GET EARLY ACCESS</div>
                <h2 className="mt-4 max-w-4xl font-display text-6xl leading-[0.85] md:text-[110px]">
                  BUILD
                  <br />
                  BETTER
                  <br />
                  FAMILY
                  <br />
                  RHYTHMS
                </h2>
                <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed">
                  Join families using KidDo to turn chores, routines, and rewards into a system children understand and parents can actually manage.
                </p>
              </div>

              <div className="space-y-6">
                <div className="neo-shadow-black flex flex-col border-4 border-black bg-white sm:flex-row">
                  <input
                    type="email"
                    placeholder="ENTER EMAIL"
                    className="min-w-0 flex-1 bg-white px-5 py-4 font-label text-sm font-bold outline-none"
                  />
                  <button className="border-t-4 border-black bg-black px-6 py-4 font-display text-2xl leading-none text-white transition-colors hover:bg-white hover:text-black sm:border-l-4 sm:border-t-0">
                    JOIN
                  </button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/download"
                    className="neo-shadow-black inline-flex items-center gap-3 border-4 border-black bg-white px-5 py-4 font-label text-sm font-bold text-black transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    Download APK <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/signup"
                    className="neo-shadow-black inline-flex items-center gap-3 border-4 border-black bg-black px-5 py-4 font-label text-sm font-bold text-white transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    Create Family Account <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
