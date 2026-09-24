import React from 'react';
import {
  Star,
  GraduationCap,
  Gamepad2,
  ShoppingBag,
  User,
  Home,
  BookOpen,
  Zap,
  Calendar,
  Flag,
  Gift,
  Check,
  Trophy,
} from 'lucide-react';

const colors = {
  sky: '#4FC3F7',
  skyLight: '#87CEEB',
  mint: '#E8F5E9',
  orange: '#FFB74D',
  green: '#81C784',
  navy: '#1B3A4B',
  muted: '#5A7A8A',
  white80: 'rgba(255,255,255,0.80)',
  white65: 'rgba(255,255,255,0.65)',
  white25: 'rgba(255,255,255,0.25)',
  white30: 'rgba(255,255,255,0.30)',
  white40: 'rgba(255,255,255,0.40)',
};

const tasks = [
  {
    id: '1',
    title: 'Read your book',
    description: 'Read 10 pages of your favorite story',
    category: 'School',
    icon: BookOpen,
    color: colors.green,
    points: 30,
    xp: 30,
  },
  {
    id: '2',
    title: 'Math Homework',
    description: 'Finish today worksheet',
    category: 'School',
    icon: BookOpen,
    color: colors.green,
    points: 25,
    xp: 25,
  },
  {
    id: '3',
    title: 'Drink Water',
    description: 'Finish 2 glasses of water',
    category: 'Chores',
    icon: Home,
    color: colors.sky,
    points: 10,
    xp: 10,
  },
];

const rewards = [
  { id: '1', title: 'Extra Playtime', points: 150 },
  { id: '2', title: 'Weekend Movie', points: 300 },
];

function Cloud({ className = '', size = 80 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 100 60"
      fill="none"
      className={className}
      style={{ opacity: 0.3 }}
    >
      <path
        d="M85 50H15C6.716 50 0 43.284 0 35c0-7.928 6.38-14.39 14.254-14.496C15.832 10.698 26.31 2 38.5 2c9.74 0 18.27 5.78 22.69 14.304C64.062 14.104 67.04 13 70.5 13c10.77 0 19.5 8.73 19.5 19.5 0 .84-.054 1.666-.158 2.476C95.57 36.42 100 41.46 100 47.5 100 49.1 98.1 50 85 50z"
        fill="white"
      />
    </svg>
  );
}

function KidCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/25 bg-white/80 shadow-lg ${className}`}
      style={{ backdropFilter: 'blur(16px)' }}
    >
      {children}
    </div>
  );
}

function TaskCard({ task }: { task: typeof tasks[0] }) {
  const Icon = task.icon;
  return (
    <KidCard className="mb-3 p-3">
      <div className="flex items-start gap-3">
        <div
          className="rounded-xl p-2.5"
          style={{ backgroundColor: `${task.color}1A`, color: task.color }}
        >
          <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded"
              style={{ backgroundColor: `${task.color}1F`, color: task.color }}
            >
              {task.category}
            </span>
            <span className="ml-auto flex items-center gap-0.5 text-[10px] font-black" style={{ color: colors.orange }}>
              <Zap size={12} />+{task.xp}
            </span>
          </div>
          <p className="mt-1 text-sm font-bold truncate" style={{ color: colors.navy }}>
            {task.title}
          </p>
          <p className="text-xs font-medium leading-tight line-clamp-2" style={{ color: colors.muted }}>
            {task.description}
          </p>
        </div>
        <button
          className="shrink-0 h-10 px-3 rounded-xl text-xs font-black"
          style={{
            backgroundColor: `${task.color}2E`,
            color: task.color,
            border: `1px solid ${task.color}66`,
          }}
        >
          DO IT!
        </button>
      </div>
    </KidCard>
  );
}

function RewardCard({ reward }: { reward: typeof rewards[0] }) {
  return (
    <KidCard className="mb-3 p-3">
      <div className="flex items-center gap-3">
        <div
          className="rounded-xl p-2.5"
          style={{ backgroundColor: `${colors.orange}1A`, color: colors.orange }}
        >
          <Gift size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: colors.navy }}>
            {reward.title}
          </p>
          <p className="text-xs font-extrabold" style={{ color: colors.orange }}>
            {reward.points} Points
          </p>
        </div>
        <button
          className="shrink-0 h-9 px-3 rounded-xl text-xs font-black"
          style={{
            backgroundColor: `${colors.orange}2E`,
            color: colors.orange,
            border: `1px solid ${colors.orange}66`,
          }}
        >
          Redeem
        </button>
      </div>
    </KidCard>
  );
}

export function PhoneDashboard({ variant = 'full' }: { variant?: 'full' | 'screen' }) {
  if (variant === 'screen') {
    return <DashboardScreen />;
  }

  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px] md:w-[320px]">
      {/* Phone frame */}
      <div
        className="relative rounded-[42px] p-3 shadow-2xl"
        style={{
          background: 'linear-gradient(145deg, #2a2a2a, #0f0f0f)',
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.35), 0 30px 60px -30px rgba(0,0,0,0.25), inset 0 0 0 2px rgba(255,255,255,0.08)',
        }}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
          <div className="h-6 w-24 rounded-full bg-black" />
        </div>

        {/* Screen */}
        <DashboardScreen />

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div
      className="relative overflow-hidden rounded-[34px]"
      style={{
        background: `linear-gradient(135deg, ${colors.skyLight}, ${colors.sky}, ${colors.mint})`,
        aspectRatio: '9/19.5',
      }}
    >
          {/* Decorative clouds */}
          <Cloud className="absolute -top-4 -left-8" size={120} />
          <Cloud className="absolute top-8 -right-6" size={90} />
          <Cloud className="absolute bottom-[18%] -left-10" size={100} />

          {/* Status bar placeholder */}
          <div className="h-8 w-full" />

          {/* Scrollable content */}
          <div className="h-[calc(100%-2rem-4.5rem)] overflow-y-auto px-4 pb-6 scrollbar-hide">
            {/* Header */}
            <div className="flex items-center gap-3 pt-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-black text-white border-2"
                style={{
                  backgroundColor: colors.white25,
                  borderColor: colors.white40,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                E
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-white leading-tight truncate">
                  Hey there, Emma!
                </h2>
                <p className="text-xs font-semibold text-white/70">
                  Ready for today's adventure?
                </p>
              </div>
            </div>

            {/* Stats */}
            <KidCard className="mt-4 p-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-black" style={{ color: colors.sky }}>
                    650
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: colors.muted }}>
                    XP
                  </p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: colors.orange }}>
                    1,250
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: colors.muted }}>
                    Points
                  </p>
                </div>
                <div>
                  <p className="text-xl font-black" style={{ color: colors.green }}>
                    12
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: colors.muted }}>
                    Level
                  </p>
                </div>
              </div>
            </KidCard>

            {/* Daily Mission */}
            <KidCard className="mt-4 p-4">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${colors.orange}33`, color: colors.orange }}
                >
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: colors.navy }}>
                    Daily Mission
                  </p>
                  <p className="text-xs font-medium" style={{ color: colors.muted }}>
                    Complete tasks to earn rewards!
                  </p>
                </div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '60%', backgroundColor: colors.orange }} />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] font-bold" style={{ color: colors.muted }}>
                <span>3 / 5 completed today</span>
                <span className="flex items-center gap-0.5" style={{ color: colors.sky }}>
                  <Zap size={12} />+50 XP
                </span>
              </div>
            </KidCard>

            {/* My Missions */}
            <div className="mt-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">My Missions</h3>
              <span
                className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md"
                style={{ backgroundColor: `${colors.orange}26`, color: colors.orange }}
              >
                <Flag size={12} /> 3 left
              </span>
            </div>
            <div className="mt-2">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>

            {/* Rewards Shop */}
            <div className="mt-5 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Rewards Shop</h3>
              <span
                className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md"
                style={{ backgroundColor: `${colors.orange}26`, color: colors.orange }}
              >
                <Gift size={12} /> 2 items
              </span>
            </div>
            <div className="mt-2">
              {rewards.map((reward) => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
            </div>

            {/* Gamification hub teaser */}
            <KidCard className="mt-4 p-4">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${colors.green}33`, color: colors.green }}
                >
                  <Trophy size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: colors.navy }}>
                    Keep the streak alive
                  </p>
                  <p className="text-xs font-medium" style={{ color: colors.muted }}>
                    5 day streak · Level 12
                  </p>
                </div>
              </div>
            </KidCard>

            <div className="h-6" />
          </div>

          {/* Bottom nav */}
          <div
            className="absolute bottom-0 left-0 right-0 px-2 pb-4 pt-2 flex items-end justify-around"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.35), transparent)',
            }}
          >
            {[
              { icon: Star, label: 'Missions', active: true },
              { icon: GraduationCap, label: 'School', active: false },
              { icon: Gamepad2, label: 'Games', active: false },
              { icon: ShoppingBag, label: 'Shop', active: false },
              { icon: User, label: 'Profile', active: false },
            ].map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl min-w-[44px]"
                style={{
                  backgroundColor: item.active ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}
              >
                <item.icon
                  size={22}
                  className="transition-colors"
                  style={{ color: item.active ? 'white' : 'rgba(255,255,255,0.55)' }}
                />
                <span
                  className="text-[9px] font-bold mt-0.5"
                  style={{ color: item.active ? 'white' : 'rgba(255,255,255,0.55)' }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    }
