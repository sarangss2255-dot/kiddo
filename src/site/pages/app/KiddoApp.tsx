import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, BookOpen, BarChart3, Settings, ShieldAlert, 
  Menu, X, LogOut, CheckCircle2, Star, Flame, Sparkles, User, RefreshCw,
  LayoutDashboard, ListChecks, ShoppingBag, PieChart, ShieldCheck, ChevronRight
} from 'lucide-react';
import { DashboardParent } from './DashboardParent';
import { DashboardChild } from './DashboardChild';
import { TaskManagement } from './TaskManagement';
import { RewardsMarketplace } from './RewardsMarketplace';
import { LearningSection } from './LearningSection';
import { AnalyticsSection } from './AnalyticsSection';
import { SettingsSection } from './SettingsSection';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { AUTH_STORAGE_KEYS } from '../../../lib/auth-session';
import { api } from '../../../api';

// Types
export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'morning' | 'bedtime' | 'homework' | 'chores' | 'learning' | 'other';
  stars: number;
  status: 'todo' | 'review' | 'completed';
  recurring: 'daily' | 'weekly' | 'once';
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  status: 'active' | 'claimed' | 'approved';
  category: 'screen' | 'treat' | 'toy' | 'activity';
  claimedCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export interface AppContextType {
  role: 'parent' | 'child';
  setRole: (role: 'parent' | 'child') => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'status'>) => void;
  completeTask: (taskId: string) => void;
  approveTask: (taskId: string) => void;
  rejectTask: (taskId: string) => void;
  rewards: Reward[];
  claimReward: (rewardId: string) => void;
  approveRewardClaim: (rewardId: string) => void;
  stars: number;
  addStars: (amount: number) => void;
  subtractStars: (amount: number) => void;
  streak: number;
  level: number;
  childName: string;
  childAvatar: string;
  achievements: Achievement[];
  notifications: any[];
  resetData: () => void;
  weeklySchedule: WeeklySchedule;
  setWeeklySchedule: (s: WeeklySchedule) => void;
  updateScheduleDay: (day: keyof WeeklySchedule, value: boolean) => void;
  wakeUpSettings: WakeUpSettings;
  setWakeUpTargetTime: (time: string) => void;
  wakeUpCompletedToday: boolean;
  lastWakeUpReward: WakeUpCompletion | null;
  completeWakeUp: () => Promise<WakeUpCompletion | null>;
  isTodaySchoolDay: boolean;
  liveError: string | null;
}

export interface WeeklySchedule {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface WakeUpSettings {
  targetTime: string;
  mandatory: boolean;
}

export interface WakeUpCompletion {
  date: string;
  completedAt: string;
  rewardPoints: number;
  rewardBracket: string;
}

const AppContext = createContext<AppContextType | null>(null);

export const useKiddoApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useKiddoApp must be used within AppProvider');
  return context;
};

// Initial Mock Data
const defaultTasks: Task[] = [
  { id: '1', title: 'Make Your Bed', description: 'Fold your blanket and fluff your pillows.', category: 'morning', stars: 5, status: 'completed', recurring: 'daily' },
  { id: '2', title: 'Brush Teeth & Floss', description: 'Brush for 2 full minutes after breakfast.', category: 'morning', stars: 5, status: 'todo', recurring: 'daily' },
  { id: '3', title: 'Math Homework Challenge', description: 'Complete Chapter 4 and check answers.', category: 'homework', stars: 15, status: 'todo', recurring: 'once' },
  { id: '4', title: 'Load & Empty Dishwasher', description: 'Put clean plates away and dirty cups in.', category: 'chores', stars: 15, status: 'review', recurring: 'daily' },
  { id: '5', title: 'Read a Book for 20 mins', description: 'Read your favorite adventure book.', category: 'learning', stars: 10, status: 'todo', recurring: 'daily' },
  { id: '6', title: 'Clean Up Toys', description: 'Place lego bricks inside the drawer.', category: 'bedtime', stars: 10, status: 'completed', recurring: 'daily' }
];

const defaultRewards: Reward[] = [
  { id: 'r1', title: '30 Mins Extra Screen Time', cost: 30, status: 'active', category: 'screen', claimedCount: 0 },
  { id: 'r2', title: 'Ice Cream Trip', cost: 60, status: 'active', category: 'treat', claimedCount: 0 },
  { id: 'r3', title: 'Stay Up 30 Mins Later', cost: 40, status: 'active', category: 'activity', claimedCount: 0 },
  { id: 'r4', title: 'New Storybook', cost: 80, status: 'active', category: 'toy', claimedCount: 0 }
];

const defaultAchievements: Achievement[] = [
  { id: 'a1', title: 'Early Bird', desc: 'Complete 3 morning tasks in a row', icon: '🌅', unlocked: true },
  { id: 'a2', title: 'Super Helper', desc: 'Complete 10 chore tasks', icon: '🧹', unlocked: false },
  { id: 'a3', title: 'Einstein Kid', desc: 'Complete 5 educational puzzles', icon: '🧩', unlocked: false },
  { id: 'a4', title: 'Streak Master', desc: 'Reach a 7-day streak', icon: '🔥', unlocked: true }
];

const defaultWeeklySchedule: WeeklySchedule = {
  monday: true, tuesday: true, wednesday: true,
  thursday: true, friday: true, saturday: false, sunday: false,
};

const defaultWakeUpSettings: WakeUpSettings = {
  targetTime: '06:30',
  mandatory: true,
};

const TASK_CATEGORIES: Task['category'][] = [
  'morning',
  'bedtime',
  'homework',
  'chores',
  'learning',
  'other',
];

function mapApiTask(raw: any): Task {
  const category = String(raw?.category ?? 'other').toLowerCase();
  return {
    id: String(raw?._id ?? raw?.id ?? ''),
    title: String(raw?.title ?? 'Task'),
    description: String(raw?.description ?? ''),
    category: (TASK_CATEGORIES.includes(category as Task['category'])
      ? category
      : 'other') as Task['category'],
    stars: Number(raw?.points ?? raw?.basePoints ?? 0),
    status:
      raw?.status === 'approved'
        ? 'completed'
        : raw?.status === 'completed'
          ? 'review'
          : 'todo',
    recurring: raw?.isRecurring ? (raw?.recurrenceType === 'weekly' ? 'weekly' : 'daily') : 'once',
  };
}

const REWARD_CATEGORIES = ['screen', 'treat', 'toy', 'activity'] as const;

function mapApiReward(raw: any): Reward {
  const category = String(raw?.category ?? '').toLowerCase();
  return {
    id: String(raw?._id ?? raw?.id ?? ''),
    title: String(raw?.title ?? raw?.name ?? 'Reward'),
    cost: Number(raw?.cost ?? raw?.pointCost ?? raw?.points ?? 0),
    status: raw?.status === 'claimed' ? 'claimed' : 'active',
    category: (REWARD_CATEGORIES.includes(category as (typeof REWARD_CATEGORIES)[number])
      ? category
      : 'activity') as Reward['category'],
    claimedCount: Number(raw?.claimedCount ?? 0),
  };
}

export function KiddoApp() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRoleState] = useState<'parent' | 'child'>('parent');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [stars, setStars] = useState(120);
  const [streak, setStreak] = useState(5);
  const [level, setLevel] = useState(3);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [gateAnswer, setGateAnswer] = useState('');
  const [gateNum1, setGateNum1] = useState(0);
  const [gateNum2, setGateNum2] = useState(0);
  const [weeklySchedule, setWeeklyScheduleState] = useState<WeeklySchedule>(defaultWeeklySchedule);
  const [wakeUpSettings, setWakeUpSettingsState] = useState<WakeUpSettings>(defaultWakeUpSettings);
  const [wakeUpCompletedToday, setWakeUpCompletedToday] = useState(false);
  const [lastWakeUpReward, setLastWakeUpReward] = useState<WakeUpCompletion | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [liveError, setLiveError] = useState<string | null>(null);

  // Child Profile Onboarding Details
  const childName = localStorage.getItem('kiddo_onboarding_child_name') || 'Leo';
  const childAvatar = localStorage.getItem('kiddo_onboarding_child_avatar') || '🦊';

  const daysOfWeek: (keyof WeeklySchedule)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  const isTodaySchoolDay = weeklySchedule[todayName];

  /** Load the signed-in account's real data from the backend. */
  const loadFromApi = async () => {
    try {
      const [profile, taskList, rewardList] = await Promise.all([
        api.get('/auth/me'),
        api.get('/tasks'),
        api.get('/rewards'),
      ]);

      if (profile) {
        setStars(Number(profile.points ?? 0));
        if (typeof profile.streak === 'number') setStreak(Number(profile.streak));
        if (profile.role === 'child') setRoleState('child');
      }
      setTasks(Array.isArray(taskList) ? taskList.map(mapApiTask) : []);
      setRewards(Array.isArray(rewardList) ? rewardList.map(mapApiReward) : []);

      if (profile?.role === 'parent') {
        const family = await api.get('/users/family');
        const children = (Array.isArray(family) ? family : []).filter(
          (user: any) => user.role === 'child',
        );
        if (children[0]) {
          setChildId(String(children[0]._id));
          if (children[0].firstName) {
            localStorage.setItem('kiddo_onboarding_child_name', String(children[0].firstName));
          }
        }
      } else if (profile?._id) {
        setChildId(String(profile._id));
      }

      setLiveError(null);
    } catch (err: any) {
      if (err?.status === 401) {
        router.replace('/auth');
        return;
      }
      setLiveError(err?.message ?? 'Unable to load live data. Showing cached data.');
    }
  };

  // Load / Sync State
  useEffect(() => {
    const token = localStorage.getItem(AUTH_STORAGE_KEYS.token);
    if (!token) {
      router.replace('/auth');
      return;
    }

    void loadFromApi();

    const cachedTasks = localStorage.getItem('k_tasks');
    const cachedRewards = localStorage.getItem('k_rewards');
    const cachedStars = localStorage.getItem('k_stars');
    const cachedStreak = localStorage.getItem('k_streak');
    const cachedLevel = localStorage.getItem('k_level');
    const cachedAchievements = localStorage.getItem('k_achievements');
    const cachedRole = localStorage.getItem(AUTH_STORAGE_KEYS.role) as 'parent' | 'child';

    if (cachedTasks) setTasks(JSON.parse(cachedTasks));
    else setTasks(defaultTasks);

    if (cachedRewards) setRewards(JSON.parse(cachedRewards));
    else setRewards(defaultRewards);

    if (cachedStars) setStars(Number(cachedStars));
    if (cachedStreak) setStreak(Number(cachedStreak));
    if (cachedLevel) setLevel(Number(cachedLevel));

    if (cachedAchievements) setAchievements(JSON.parse(cachedAchievements));
    else setAchievements(defaultAchievements);

    if (cachedRole) {
      setRoleState(cachedRole);
      if (pathname === '/app' || pathname === '/app/') {
        router.push(`/app/${cachedRole}`);
      }
    } else {
      localStorage.setItem(AUTH_STORAGE_KEYS.role, 'parent');
      setRoleState('parent');
      if (pathname === '/app' || pathname === '/app/') {
        router.push('/app/parent');
      }
    }

    const cachedSchedule = localStorage.getItem('k_weekly_schedule');
    if (cachedSchedule) setWeeklyScheduleState(JSON.parse(cachedSchedule));

    const cachedWakeUpSettings = localStorage.getItem('k_wake_up_settings');
    if (cachedWakeUpSettings) setWakeUpSettingsState(JSON.parse(cachedWakeUpSettings));

    const cachedWakeUpCompleted = localStorage.getItem('k_wake_up_completed');
    if (cachedWakeUpCompleted) {
      const completedDate = new Date(cachedWakeUpCompleted);
      const today = new Date();
      if (completedDate.toDateString() === today.toDateString()) {
        setWakeUpCompletedToday(true);
      }
    }

    const cachedWakeUpReward = localStorage.getItem('k_last_wake_up_reward');
    if (cachedWakeUpReward) {
      const reward = JSON.parse(cachedWakeUpReward);
      if (reward.date === new Date().toISOString().split('T')[0]) {
        setLastWakeUpReward(reward);
      }
    }
  }, []);

  const saveToLocal = (updatedTasks?: Task[], updatedRewards?: Reward[], newStars?: number) => {
    if (updatedTasks) localStorage.setItem('k_tasks', JSON.stringify(updatedTasks));
    if (updatedRewards) localStorage.setItem('k_rewards', JSON.stringify(updatedRewards));
    if (newStars !== undefined) localStorage.setItem('k_stars', String(newStars));
  };

  const setRole = (newRole: 'parent' | 'child') => {
    setRoleState(newRole);
    localStorage.setItem(AUTH_STORAGE_KEYS.role, newRole);
    router.push(`/app/${newRole}`);
  };

  const addTask = async (task: Omit<Task, 'id' | 'status'>) => {
    if (!childId) {
      addNotification('Add a child first', 'Create a child profile before assigning missions.');
      return;
    }
    try {
      const created = await api.post('/tasks', {
        assignedTo: childId,
        title: task.title,
        description: task.description,
        category: task.category,
        points: task.stars,
        dueDate: new Date(Date.now() + 86_400_000).toISOString(),
      });
      const updated = [mapApiTask(created), ...tasks];
      setTasks(updated);
      saveToLocal(updated);
      addNotification('Task Assigned', `New task "${task.title}" has been created.`);
    } catch (err: any) {
      addNotification('Could not create task', err?.message ?? 'Please try again.');
    }
  };

  const completeTask = async (taskId: string) => {
    const previous = tasks;
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: 'review' as const } : t);
    setTasks(updated);
    saveToLocal(updated);
    try {
      await api.patch(`/tasks/${taskId}`, { status: 'completed' });
      addNotification('Task Ready for Review', `${childName} completed "${previous.find(t => t.id === taskId)?.title}".`);
    } catch (err: any) {
      setTasks(previous);
      addNotification('Could not complete task', err?.message ?? 'Please try again.');
    }
  };

  const approveTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      await api.patch(`/tasks/${taskId}`, { status: 'approved' });
      const updated = tasks.map(t => t.id === taskId ? { ...t, status: 'completed' as const } : t);
      setTasks(updated);
      saveToLocal(updated);
      const profile = await api.get('/auth/me');
      setStars(Number(profile?.points ?? stars));
      addNotification('Task Approved', `"${task.title}" approved! +${task.stars} ⭐️ rewarded.`);
    } catch (err: any) {
      // Points are only credited server-side; never show a fake success.
      addNotification('Could not approve task', err?.message ?? 'Please try again.');
    }
  };

  const rejectTask = async (taskId: string) => {
    const previous = tasks;
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: 'todo' as const } : t);
    setTasks(updated);
    saveToLocal(updated);
    try {
      await api.patch(`/tasks/${taskId}`, { status: 'todo' });
      addNotification('Task Needs More Work', `"${previous.find(t => t.id === taskId)?.title}" sent back.`);
    } catch (err: any) {
      setTasks(previous);
      addNotification('Could not update task', err?.message ?? 'Please try again.');
    }
  };

  const claimReward = async (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (role !== 'child') {
      addNotification(
        'Child account required',
        'Rewards are redeemed from the child account (coins are spent server-side).',
      );
      return;
    }

    try {
      await api.post(`/rewards/${rewardId}/redeem`, {});
      const updated = rewards.map(r => r.id === rewardId ? { ...r, status: 'claimed' as const, claimedCount: r.claimedCount + 1 } : r);
      setRewards(updated);
      saveToLocal(undefined, updated);
      const profile = await api.get('/auth/me');
      setStars(Number(profile?.points ?? stars));
      addNotification('Reward Claimed', `${childName} redeemed "${reward.title}".`);
    } catch (err: any) {
      addNotification('Could not redeem reward', err?.message ?? 'Please try again.');
    }
  };

  const approveRewardClaim = (_rewardId: string) => {
    addNotification(
      'Approval happens in the parent app',
      'Reward redemptions are approved through the KidDo parent app.',
    );
  };

  const addStars = (_amount: number) => {
    addNotification(
      'Rewards are server-verified',
      'Points are credited by the backend after a verified game session.',
    );
  };

  const subtractStars = (_amount: number) => {
    addNotification(
      'Rewards are server-verified',
      'Points are managed by the backend.',
    );
  };

  const addNotification = (title: string, message: string) => {
    const newNotif = { id: String(Date.now()), title, message, time: 'Just now', read: false };
    setNotifications([newNotif, ...notifications]);
  };

  const resetData = () => {
    void loadFromApi();
    addNotification('Data refreshed', 'Reloaded from the KidDo server.');
  };

  const setWeeklySchedule = (s: WeeklySchedule) => {
    setWeeklyScheduleState(s);
    localStorage.setItem('k_weekly_schedule', JSON.stringify(s));
  };

  const updateScheduleDay = (day: keyof WeeklySchedule, value: boolean) => {
    const updated = { ...weeklySchedule, [day]: value };
    setWeeklyScheduleState(updated);
    localStorage.setItem('k_weekly_schedule', JSON.stringify(updated));
  };

  const setWakeUpTargetTime = (time: string) => {
    const updated = { ...wakeUpSettings, targetTime: time };
    setWakeUpSettingsState(updated);
    localStorage.setItem('k_wake_up_settings', JSON.stringify(updated));
  };

  const completeWakeUp = async (): Promise<WakeUpCompletion | null> => {
    if (!childId) {
      addNotification('Child required', 'Add a child profile before recording a wake-up.');
      return null;
    }

    try {
      // The backend is authoritative for both the bracket and the points.
      const res = await api.post(`/wake-up/${childId}/complete`, {
        completedAt: new Date().toISOString(),
      });

      const completedAt = String(res?.completedAt ?? new Date().toISOString());
      const result: WakeUpCompletion = {
        date: completedAt.slice(0, 10),
        completedAt,
        rewardPoints: Number(res?.rewardPoints ?? 0),
        rewardBracket: String(res?.rewardBracket ?? 'after_630'),
      };

      setLastWakeUpReward(result);
      setWakeUpCompletedToday(true);
      localStorage.setItem('k_wake_up_completed', completedAt);
      localStorage.setItem('k_last_wake_up_reward', JSON.stringify(result));

      const profile = await api.get('/auth/me');
      setStars(Number(profile?.points ?? stars));

      return result;
    } catch (err: any) {
      addNotification('Wake-up not recorded', err?.message ?? 'Please try again.');
      return null;
    }
  };

  const openParentGate = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setGateNum1(n1);
    setGateNum2(n2);
    setGateAnswer('');
    setShowGate(true);
  };

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(gateAnswer) === gateNum1 + gateNum2) {
      setShowGate(false);
      setRole('parent');
    } else {
      alert('Oops, wrong math answer! Try again.');
      openParentGate();
    }
  };

  const sidebarLinks = role === 'parent' ? [
    { to: '/app/parent', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/tasks', label: 'Missions', icon: ListChecks },
    { to: '/app/rewards', label: 'Marketplace', icon: ShoppingBag },
    { to: '/app/analytics', label: 'Growth Reports', icon: PieChart },
    { to: '/app/settings', label: 'Family Profile', icon: Settings },
  ] : [
    { to: '/app/child', label: 'My Missions', icon: ListChecks },
    { to: '/app/learning', label: 'Academy', icon: BookOpen },
    { to: '/app/rewards', label: 'Star Shop', icon: ShoppingBag },
    { to: '/app/settings', label: 'My Profile', icon: User },
  ];

  return (
    <AppContext.Provider value={{
      role, setRole, tasks, addTask, completeTask, approveTask, rejectTask,
      rewards, claimReward, approveRewardClaim, stars, addStars, subtractStars,
      streak, level, childName, childAvatar, achievements, notifications, resetData,
      weeklySchedule, setWeeklySchedule, updateScheduleDay,
      wakeUpSettings, setWakeUpTargetTime,
      wakeUpCompletedToday, lastWakeUpReward, completeWakeUp, liveError,
      isTodaySchoolDay
    }}>
      <div className="flex min-h-screen bg-brand-bg text-brand-navy font-sans antialiased overflow-hidden">
        
        {/* MOBILE SIDEBAR TRIGGER */}
        <div className="md:hidden fixed top-6 left-6 z-50">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-12 h-12 p-0 rounded-2xl bg-white border-brand-navy/5 shadow-xl"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <aside className={cn(
          "fixed md:sticky top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-brand-navy/5 transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="h-full flex flex-col p-8">
            {/* Brand Header */}
            <div className="flex items-center gap-4 mb-12">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-brand-navy/5 flex items-center justify-center overflow-hidden">
                <img src="/kiddo-logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-kids font-bold text-xl block leading-tight">KidDo</span>
                <Badge variant="accent" className="px-1.5 py-0 text-[8px] font-black uppercase tracking-widest mt-0.5">Premium Workspace</Badge>
              </div>
            </div>

            {/* Profile Context Switcher */}
            <Card variant="premium" className={cn(
              "p-4 mb-8 border-none shadow-none",
              role === 'parent' ? "bg-brand-blue/5" : "bg-brand-orange/5"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white/50",
                  role === 'parent' ? "bg-brand-blue text-white" : "bg-white"
                )}>
                  {role === 'parent' ? '👩‍💻' : childAvatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{role === 'parent' ? 'Sarah' : childName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    {role === 'parent' ? (
                      <Badge variant="info" className="text-[9px] px-1.5 py-0 normal-case tracking-normal">Admin</Badge>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-brand-yellow flex items-center gap-0.5">
                          <Star size={10} fill="currentColor" /> {stars}
                        </span>
                        <span className="text-[10px] font-bold text-brand-orange flex items-center gap-0.5">
                          <Flame size={10} fill="currentColor" /> {streak}d
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Nav Menu */}
            <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted px-4 mb-4">Navigation</span>
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-200",
                      isActive 
                        ? "bg-brand-navy text-white shadow-xl shadow-brand-navy/10" 
                        : "text-brand-muted hover:text-brand-navy hover:bg-brand-navy/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={20} className={cn(isActive ? "text-white" : "text-brand-muted group-hover:text-brand-navy")} />
                      <span className="font-bold text-sm">{link.label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="opacity-40" />}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="pt-8 space-y-4 border-t border-brand-navy/5">
              {role === 'parent' ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setRole('child')}
                  className="w-full h-12 rounded-xl bg-brand-orange/5 border-brand-orange/10 text-brand-orange hover:bg-brand-orange/10 border-2"
                >
                  <Sparkles size={16} /> Explorer Mode
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openParentGate}
                  className="w-full h-12 rounded-xl bg-brand-blue/5 border-brand-blue/10 text-brand-blue hover:bg-brand-blue/10 border-2"
                >
                  <ShieldCheck size={16} /> Parent Space
                </Button>
              )}

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/')}
                className="w-full h-10 rounded-xl font-black uppercase tracking-widest text-[10px]"
              >
                <LogOut size={14} /> Exit App
              </Button>
            </div>
          </div>
        </aside>

        {/* MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col min-w-0 relative">
          
          {/* Top Bar */}
          <header className="h-20 bg-white/80 backdrop-blur-md border-b border-brand-navy/5 flex items-center justify-between px-8 md:px-12 sticky top-0 z-30">
            <div>
              <h2 className="text-xl md:text-2xl">
                Workspace
              </h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3">
                <Badge variant="success" className="px-3 py-1 bg-brand-mint/5 normal-case tracking-normal font-bold">
                  <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse mr-2 inline-block" />
                  Family Sync Live
                </Badge>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetData}
                className="w-10 h-10 p-0 rounded-xl hover:bg-brand-bg text-brand-muted"
                title="Reset simulation data"
              >
                <RefreshCw size={18} />
              </Button>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            <div className="max-w-6xl mx-auto w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {pathname === '/app/child' ? (
                    <DashboardChild />
                  ) : pathname === '/app/tasks' ? (
                    <TaskManagement />
                  ) : pathname === '/app/rewards' ? (
                    <RewardsMarketplace />
                  ) : pathname === '/app/learning' ? (
                    <LearningSection />
                  ) : pathname === '/app/analytics' ? (
                    <AnalyticsSection />
                  ) : pathname === '/app/settings' ? (
                    <SettingsSection />
                  ) : (
                    <DashboardParent />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* MATH GATE DIALOGUE */}
        <AnimatePresence>
          {showGate && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <Card variant="premium" className="max-w-sm w-full p-8 md:p-10 border-none shadow-2xl">
                  <div className="w-16 h-16 rounded-[2rem] bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6 shadow-sm">
                    <ShieldAlert size={32} />
                  </div>
                  <h3 className="text-2xl mb-2">Parent Proof</h3>
                  <p className="text-sm text-brand-muted mb-8 font-medium">
                    Solve this quick math problem to unlock the parent controls:
                  </p>

                  <form onSubmit={handleGateSubmit} className="space-y-6">
                    <div className="text-center font-kids text-4xl font-bold py-8 bg-brand-bg rounded-[2rem] border-2 border-brand-navy/5 text-brand-navy">
                      {gateNum1} + {gateNum2} = ?
                    </div>
                    <input
                      type="number"
                      required
                      placeholder="?"
                      value={gateAnswer}
                      onChange={(e) => setGateAnswer(e.target.value)}
                      className="w-full h-16 bg-white border-2 border-brand-navy/5 rounded-[2rem] focus:outline-none focus:border-brand-blue text-center font-kids text-3xl shadow-inner"
                      autoFocus
                    />
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowGate(false)}
                        className="flex-1 h-14 border-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-14 shadow-xl shadow-brand-blue/20 bg-brand-blue"
                      >
                        Unlock
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AppContext.Provider>
  );
}
