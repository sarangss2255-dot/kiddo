import React, { useState, useEffect, createContext, useContext } from 'react';
import { Route, Routes, useNavigate, Link, useLocation } from 'react-router-dom';
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

export function KiddoApp() {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Child Profile Onboarding Details
  const childName = localStorage.getItem('kiddo_onboarding_child_name') || 'Leo';
  const childAvatar = localStorage.getItem('kiddo_onboarding_child_avatar') || '🦊';

  // Load / Sync State
  useEffect(() => {
    const cachedTasks = localStorage.getItem('k_tasks');
    const cachedRewards = localStorage.getItem('k_rewards');
    const cachedStars = localStorage.getItem('k_stars');
    const cachedStreak = localStorage.getItem('k_streak');
    const cachedLevel = localStorage.getItem('k_level');
    const cachedAchievements = localStorage.getItem('k_achievements');
    const cachedRole = localStorage.getItem('kiddo_user_role') as 'parent' | 'child';

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
      if (location.pathname === '/app' || location.pathname === '/app/') {
        navigate(`/app/${cachedRole}`);
      }
    } else {
      localStorage.setItem('kiddo_user_role', 'parent');
      setRoleState('parent');
      if (location.pathname === '/app' || location.pathname === '/app/') {
        navigate('/app/parent');
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
    localStorage.setItem('kiddo_user_role', newRole);
    navigate(`/app/${newRole}`);
  };

  const addTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = { ...task, id: String(Date.now()), status: 'todo' };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveToLocal(updated);
    addNotification('Task Assigned', `New task "${task.title}" has been created.`);
  };

  const completeTask = (taskId: string) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: 'review' as const } : t);
    setTasks(updated);
    saveToLocal(updated);
    addNotification('Task Ready for Review', `${childName} completed "${tasks.find(t => t.id === taskId)?.title}".`);
  };

  const approveTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: 'completed' as const } : t);
    setTasks(updated);
    const newStars = stars + task.stars;
    setStars(newStars);
    const newLevel = Math.floor(newStars / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      localStorage.setItem('k_level', String(newLevel));
      addNotification('Level Up! 🌟', `${childName} reached Level ${newLevel}!`);
    }
    saveToLocal(updated, undefined, newStars);
    addNotification('Task Approved', `"${task.title}" approved! +${task.stars} ⭐️ rewarded.`);
  };

  const rejectTask = (taskId: string) => {
    const updated = tasks.map(t => t.id === taskId ? { ...t, status: 'todo' as const } : t);
    setTasks(updated);
    saveToLocal(updated);
    addNotification('Task Needs More Work', `"${tasks.find(t => t.id === taskId)?.title}" sent back.`);
  };

  const claimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || stars < reward.cost) return;
    const newStars = stars - reward.cost;
    setStars(newStars);
    const updated = rewards.map(r => r.id === rewardId ? { ...r, status: 'claimed' as const, claimedCount: r.claimedCount + 1 } : r);
    setRewards(updated);
    saveToLocal(undefined, updated, newStars);
    addNotification('Reward Claimed', `${childName} redeemed "${reward.title}".`);
  };

  const approveRewardClaim = (rewardId: string) => {
    const updated = rewards.map(r => r.id === rewardId ? { ...r, status: 'approved' as const } : r);
    setRewards(updated);
    saveToLocal(undefined, updated);
    addNotification('Reward Approved', `Claim for "${rewards.find(r => r.id === rewardId)?.title}" is approved!`);
  };

  const addStars = (amount: number) => {
    const newStars = stars + amount;
    setStars(newStars);
    localStorage.setItem('k_stars', String(newStars));
  };

  const subtractStars = (amount: number) => {
    const newStars = Math.max(0, stars - amount);
    setStars(newStars);
    localStorage.setItem('k_stars', String(newStars));
  };

  const addNotification = (title: string, message: string) => {
    const newNotif = { id: String(Date.now()), title, message, time: 'Just now', read: false };
    setNotifications([newNotif, ...notifications]);
  };

  const resetData = () => {
    localStorage.removeItem('k_tasks');
    localStorage.removeItem('k_rewards');
    localStorage.removeItem('k_stars');
    localStorage.removeItem('k_streak');
    localStorage.removeItem('k_level');
    localStorage.removeItem('k_achievements');
    setTasks(defaultTasks);
    setRewards(defaultRewards);
    setStars(120);
    setStreak(5);
    setLevel(3);
    setAchievements(defaultAchievements);
    addNotification('Data Reset', 'Demo environment restored.');
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
      streak, level, childName, childAvatar, achievements, notifications, resetData
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
                const isActive = location.pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
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
                onClick={() => navigate('/')}
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
                  key={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Routes location={location} key={location.pathname}>
                    <Route path="/parent" element={<DashboardParent />} />
                    <Route path="/child" element={<DashboardChild />} />
                    <Route path="/tasks" element={<TaskManagement />} />
                    <Route path="/rewards" element={<RewardsMarketplace />} />
                    <Route path="/learning" element={<LearningSection />} />
                    <Route path="/analytics" element={<AnalyticsSection />} />
                    <Route path="/settings" element={<SettingsSection />} />
                  </Routes>
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
