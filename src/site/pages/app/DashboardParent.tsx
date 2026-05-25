import React, { useState } from 'react';
import { useKiddoApp, Task, Reward } from './KiddoApp';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, X, AlertCircle, Award, Calendar, CheckSquare, 
  TrendingUp, Star, Flame, Sparkles, ChevronRight, Zap, Target, Bell,
  Clock, ArrowUpRight, MousePointer2, Settings, BarChart3, CheckCircle2, ShoppingBag, Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

export function DashboardParent() {
  const { 
    tasks, approveTask, rejectTask, 
    rewards, approveRewardClaim, stars, 
    streak, level, childName, childAvatar, notifications 
  } = useKiddoApp();

  const [activeTab, setActiveTab] = useState<'approvals' | 'activity' | 'goals'>('approvals');
  const [familyGoals, setFamilyGoals] = useState([
    { id: '1', title: 'Weekend Zoo Trip Adventure', progress: 120, target: 200, category: 'family' },
    { id: '2', title: 'New Lego Castle Set', progress: 85, target: 120, category: 'Leo' }
  ]);

  // Tasks needing review
  const pendingTasks = tasks.filter(t => t.status === 'review');
  // Rewards claimed but not approved
  const pendingRewards = rewards.filter(r => r.status === 'claimed');

  // Daily task completed rates
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalTodayTasks = tasks.length;
  const progressPercent = totalTodayTasks > 0 
    ? Math.round(((completedTasks.length) / totalTodayTasks) * 100) 
    : 0;

  // Mock chart data for weekly completions
  const weeklyData = [
    { day: 'Mon', completed: 4 },
    { day: 'Tue', completed: 6 },
    { day: 'Wed', completed: 5 },
    { day: 'Thu', completed: 7 },
    { day: 'Fri', completed: 3 },
    { day: 'Sat', completed: 8 },
    { day: 'Sun', completed: completedTasks.length + 3 }
  ];

  return (
    <div className="space-y-10 animate-fade-in text-brand-navy">
      
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge variant="accent" className="px-3 py-1 mb-3">Family Dashboard</Badge>
          <h1 className="text-4xl md:text-5xl font-bold">Hello, Sarah!</h1>
          <p className="text-lg text-brand-muted mt-2 font-medium">Here's a snapshot of your family's productivity today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-brand-navy/5 shadow-sm">
          <Badge variant="default" className="bg-brand-bg text-brand-muted border-none normal-case tracking-normal px-4 py-2">
            <Calendar size={14} className="mr-2" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* OVERVIEW STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Child Profile Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2"
        >
          <Card className="p-0 overflow-hidden group h-full">
            <div className="bg-brand-blue/5 p-6 border-b border-brand-navy/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-sm border border-brand-blue/10 transition-transform"
                >
                  {childAvatar}
                </motion.div>
                <div>
                  <CardTitle className="text-2xl">{childName}</CardTitle>
                  <CardDescription className="font-bold text-brand-blue uppercase tracking-widest text-[10px]">Explorer Level {level}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl">
                <Settings size={18} />
              </Button>
            </div>
            <CardContent className="p-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Stars Banked</span>
                <div className="flex items-center gap-2 text-2xl font-kids font-bold text-brand-yellow">
                  <Star size={20} fill="currentColor" /> {stars}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Active Streak</span>
                <div className="flex items-center gap-2 text-2xl font-kids font-bold text-brand-orange">
                  <Flame size={20} fill="currentColor" /> {streak} Days
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 p-4 border-t border-brand-navy/5 mt-auto">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-brand-muted">
                  <span>Daily Momentum</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-white h-2 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-brand-mint h-full rounded-full" 
                  />
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ translateY: -5 }}
        >
          <Card className="p-6 flex flex-col justify-between border-brand-navy/5 h-full">
            <div className="w-12 h-12 bg-brand-mint/10 text-brand-mint rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <CheckSquare size={24} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Tasks Completed</span>
              <div className="text-4xl font-kids font-bold">{completedTasks.length}</div>
            </div>
            <p className="text-[10px] text-brand-mint font-bold mt-4 flex items-center gap-1">
              <TrendingUp size={12} /> +2 from yesterday
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ translateY: -5 }}
        >
          <Card className="p-6 flex flex-col justify-between border-brand-navy/5 h-full">
            <div className="w-12 h-12 bg-brand-orange/10 text-brand-orange rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Bell size={24} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Action Required</span>
              <div className="text-4xl font-kids font-bold">{pendingTasks.length + pendingRewards.length}</div>
            </div>
            <p className="text-[10px] text-brand-orange font-bold mt-4">Approvals pending</p>
          </Card>
        </motion.div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 p-1 bg-brand-navy/5 rounded-2xl w-fit">
        {[
          { id: 'approvals', label: 'Approval Queue', icon: Clock, count: pendingTasks.length + pendingRewards.length },
          { id: 'activity', label: 'Weekly Performance', icon: BarChart3 },
          { id: 'goals', label: 'Family Goals', icon: Target }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
              activeTab === tab.id 
                ? "bg-white text-brand-navy shadow-sm" 
                : "text-brand-muted hover:text-brand-navy"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <Badge variant="accent" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="min-h-[400px]">
        {activeTab === 'approvals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task Approvals */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Mission Reviews
                  <Badge variant="default" className="bg-brand-bg text-brand-muted border-none">{pendingTasks.length}</Badge>
                </h3>
              </div>
              
              <AnimatePresence mode="popLayout">
                {pendingTasks.length > 0 ? (
                  <div className="space-y-3">
                    {pendingTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="p-4 hover:border-brand-blue/20 transition-colors shadow-none border-brand-navy/5 bg-white">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-2xl">
                                {task.category === 'morning' ? '🌅' : task.category === 'homework' ? '📚' : '🧹'}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">{task.title}</h4>
                                <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">{task.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => rejectTask(task.id)}
                                className="w-10 h-10 p-0 rounded-xl hover:bg-brand-orange/10 hover:text-brand-orange border-brand-navy/5"
                              >
                                <X size={18} />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => approveTask(task.id)}
                                className="w-10 h-10 p-0 rounded-xl bg-brand-mint hover:bg-brand-mint/90"
                              >
                                <Check size={18} />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    key="empty-tasks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card variant="outline" className="p-12 border-dashed flex flex-col items-center justify-center text-center bg-brand-bg/30">
                      <div className="w-16 h-16 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-muted mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="font-bold text-brand-navy">All clear!</h4>
                      <p className="text-xs text-brand-muted mt-1">No missions waiting for your review.</p>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* Reward Approvals */}
            <section className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Reward Claims
                  <Badge variant="accent" className="bg-brand-orange/10 text-brand-orange border-none">{pendingRewards.length}</Badge>
                </h3>
              </div>
              
              <AnimatePresence mode="popLayout">
                {pendingRewards.length > 0 ? (
                  <div className="space-y-3">
                    {pendingRewards.map((reward) => (
                      <motion.div
                        key={reward.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="p-4 border-brand-navy/5 shadow-none">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-brand-orange/5 text-brand-orange rounded-xl flex items-center justify-center">
                                <ShoppingBag size={24} />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">{reward.title}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="warning" className="px-1.5 py-0 text-[9px]">Claimed</Badge>
                                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">{reward.cost} Stars Spent</span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => approveRewardClaim(reward.id)}
                              className="px-4 h-10 rounded-xl bg-brand-orange hover:bg-brand-orange/90"
                            >
                              Approve
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    key="empty-rewards"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Card variant="outline" className="p-12 border-dashed flex flex-col items-center justify-center text-center bg-brand-bg/30">
                      <div className="w-16 h-16 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-muted mb-4">
                        <ShoppingBag size={32} />
                      </div>
                      <h4 className="font-bold text-brand-navy">No claims yet</h4>
                      <p className="text-xs text-brand-muted mt-1">Check back when rewards are redeemed.</p>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-8 border-brand-navy/5 shadow-sm">
              <CardHeader className="p-0 mb-8">
                <CardTitle>Mission Velocity</CardTitle>
                <CardDescription>Daily task completion volume over the last 7 days.</CardDescription>
              </CardHeader>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 700, fill: '#9EA4BC' }} 
                      dy={10}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F1F5F9' }}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                      {weeklyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? '#3BBA9C' : '#1C2340'} fillOpacity={index === 6 ? 1 : 0.1} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-8 border-brand-navy/5 shadow-sm">
              <CardHeader className="p-0 mb-6">
                <CardTitle>Recent History</CardTitle>
              </CardHeader>
              <div className="space-y-6">
                {notifications.slice(0, 5).map((notif) => (
                  <div key={notif.id} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-brand-navy">{notif.title}</p>
                      <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">{notif.message}</p>
                      <span className="text-[10px] text-brand-muted font-bold mt-1 block uppercase tracking-wider">{notif.time}</span>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-sm text-brand-muted text-center py-8">No recent activity logs.</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyGoals.map((goal) => (
              <Card key={goal.id} className="p-6 border-brand-navy/5 shadow-sm hover:-translate-y-1 transition-transform">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm",
                    goal.category === 'family' ? "bg-brand-blue/10 text-brand-blue" : "bg-brand-orange/10 text-brand-orange"
                  )}>
                    {goal.category === 'family' ? <Users size={24} /> : <Target size={24} />}
                  </div>
                  <Badge variant={goal.category === 'family' ? 'info' : 'accent'}>{goal.category}</Badge>
                </div>
                <h4 className="font-kids text-lg font-bold mb-1">{goal.title}</h4>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-brand-muted">
                    <span>Progress</span>
                    <span>{Math.round((goal.progress / goal.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-brand-navy/5 h-3 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", goal.category === 'family' ? "bg-brand-blue" : "bg-brand-orange")} 
                      style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-brand-muted">
                    <Star size={10} fill="currentColor" className="text-brand-yellow" />
                    {goal.progress} / {goal.target} Stars Collected
                  </div>
                </div>
              </Card>
            ))}
            
            <button className="border-2 border-dashed border-brand-navy/10 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center group hover:border-brand-blue/30 transition-all hover:bg-brand-blue/5">
              <div className="w-12 h-12 rounded-2xl bg-brand-navy/5 text-brand-muted flex items-center justify-center mb-4 group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-colors">
                <Zap size={24} />
              </div>
              <h4 className="font-bold text-brand-navy">New Reward Goal</h4>
              <p className="text-xs text-brand-muted mt-1">Define a prize to work towards together.</p>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
