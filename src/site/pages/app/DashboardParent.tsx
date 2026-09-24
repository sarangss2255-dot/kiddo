import React, { useState } from 'react';
import { useKiddoApp, Task, Reward, WeeklySchedule } from './KiddoApp';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, X, Award, Calendar, CheckSquare, 
  TrendingUp, Star, Flame, Sparkles, Zap, Target, Bell,
  Clock, ArrowUpRight, Settings, BarChart3, CheckCircle2, ShoppingBag, Users
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { cn } from '../../../lib/utils';

export function DashboardParent() {
  const { 
    tasks, approveTask, rejectTask, 
    rewards, approveRewardClaim, stars, 
    streak, level, childName, childAvatar, notifications,
    weeklySchedule, updateScheduleDay, isTodaySchoolDay
  } = useKiddoApp();

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

  // Kids Growth Dimension Radar Data
  const growthData = [
    { subject: 'Chores 🧹', value: 80, fullMark: 100 },
    { subject: 'Study 📚', value: 95, fullMark: 100 },
    { subject: 'Mornings 🌅', value: 70, fullMark: 100 },
    { subject: 'Bedtime 🛌', value: 85, fullMark: 100 },
    { subject: 'Fitness 🧠', value: 90, fullMark: 100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-brand-navy p-1">
      
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Badge variant="accent" className="px-3 py-1 mb-2 font-bold bg-amber-100 text-amber-800 border-none rounded-full">
            Family Portal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800">Hello, Sarah!</h1>
          <p className="text-base text-slate-500 mt-2 font-medium">Here's a snapshot of your family's productivity today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl border border-slate-100 shadow-sm">
          <Calendar size={15} className="text-sky-500" />
          <span className="text-xs font-bold text-slate-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* OVERVIEW STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Child Profile Widget */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2"
        >
          <Card className="p-0 overflow-hidden group h-full border-slate-100 bg-white shadow-sm flex flex-col justify-between">
            <div className="bg-sky-50/20 p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-sky-100 transition-transform shrink-0"
                >
                  {childAvatar}
                </motion.div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">{childName}</CardTitle>
                  <CardDescription className="font-bold text-sky-600 uppercase tracking-widest text-[9px]">Explorer Level {level}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="w-9 h-9 p-0 rounded-xl hover:bg-slate-50">
                <Settings size={16} className="text-slate-500" />
              </Button>
            </div>
            <CardContent className="p-6 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Stars Banked</span>
                <div className="flex items-center gap-2 text-2xl font-bold text-amber-500">
                  <Star size={18} fill="currentColor" /> {stars}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Streak</span>
                <div className="flex items-center gap-2 text-2xl font-bold text-orange-500">
                  <Flame size={18} fill="currentColor" /> {streak} Days
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/30 p-4 border-t border-slate-50 mt-auto">
              <div className="w-full space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <span>Daily Momentum</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="bg-emerald-500 h-full rounded-full" 
                  />
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Quick Metrics Completed */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="p-6 flex flex-col justify-between border-slate-100 h-full bg-white shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm mb-4">
              <CheckSquare size={22} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Missions Done</span>
              <div className="text-4xl font-extrabold text-slate-800">{completedTasks.length}</div>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-4 flex items-center gap-1">
              <TrendingUp size={12} /> +2 from yesterday
            </p>
          </Card>
        </motion.div>

        {/* Quick Metrics Action */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 flex flex-col justify-between border-slate-100 h-full bg-white shadow-sm">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shadow-sm mb-4">
              <Bell size={22} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Action Required</span>
              <div className="text-4xl font-extrabold text-slate-800">{pendingTasks.length + pendingRewards.length}</div>
            </div>
            <p className="text-[10px] text-orange-500 font-bold mt-4">Approvals pending</p>
          </Card>
        </motion.div>
      </div>

      {/* SHADCN TABS PORTAL */}
      <Tabs defaultValue="approvals" className="w-full">
        <TabsList className="bg-slate-100 rounded-2xl p-1 mb-6 flex w-fit gap-1">
          <TabsTrigger value="approvals" className="flex items-center gap-2">
            <Clock size={14} />
            Approval Queue
            {(pendingTasks.length + pendingRewards.length) > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-[20px] p-0 flex items-center justify-center rounded-full text-[10px] bg-rose-500 border-none font-bold text-white">
                {pendingTasks.length + pendingRewards.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 size={14} />
            Weekly Performance
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target size={14} />
            Family Goals
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar size={14} />
            Weekly Schedule
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Approval Queue */}
        <TabsContent value="approvals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Task Reviews */}
            <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  Mission Reviews
                  <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-bold px-2 py-0.5 rounded-full text-xs">
                    {pendingTasks.length} pending
                  </Badge>
                </CardTitle>
                <CardDescription>Approve or reject tasks child has claimed as completed</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AnimatePresence mode="popLayout">
                  {pendingTasks.length > 0 ? (
                    <div className="space-y-4">
                      {pendingTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl shrink-0">
                                {task.category === 'morning' ? '🌅' : task.category === 'homework' ? '📚' : '🧹'}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-slate-800">{task.title}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{task.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => rejectTask(task.id)}
                                className="w-9 h-9 p-0 rounded-xl hover:bg-rose-50 hover:text-rose-600 border-slate-200"
                              >
                                <X size={15} />
                              </Button>
                              <Button 
                                size="icon" 
                                onClick={() => approveTask(task.id)}
                                className="w-9 h-9 p-0 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white"
                              >
                                <Check size={15} />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">No pending task approvals. All clear!</div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Reward Claims */}
            <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  Reward Claims
                  <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 font-bold px-2 py-0.5 rounded-full text-xs">
                    {pendingRewards.length} pending
                  </Badge>
                </CardTitle>
                <CardDescription>Approve store items redeemed by the child</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AnimatePresence mode="popLayout">
                  {pendingRewards.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRewards.map((reward) => (
                        <motion.div
                          key={reward.id}
                          layout
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.15 }}
                        >
                          <div className="flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl shrink-0">
                                🎁
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-slate-800">{reward.title}</h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge className="px-1.5 py-0 text-[8px] bg-amber-100 text-amber-800 border-none font-bold uppercase rounded-full">Claimed</Badge>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{reward.cost} Stars Cost</span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              onClick={() => approveRewardClaim(reward.id)}
                              className="px-3 h-8 text-xs font-bold rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
                            >
                              Approve
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">No pending reward claims waiting.</div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* Tab 2: Performance Weekly charts */}
        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mission Completion Chart */}
            <Card className="lg:col-span-2 border border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" size={18} />
                  Mission velocity
                </CardTitle>
                <CardDescription>Daily task completion rate over the past week</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex items-center justify-center">
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fontWeight: 700, fill: '#64748B' }} 
                        dy={10}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip 
                        cursor={{ fill: '#F8FAFC' }}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                      />
                      <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                        {weeklyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 6 ? '#4FC3F7' : '#1B3A4B'} fillOpacity={index === 6 ? 1 : 0.15} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Growth Dimension Radar Chart */}
            <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Development Index</CardTitle>
                <CardDescription>Category balance analytics</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex items-center justify-center">
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={growthData}>
                      <PolarGrid stroke="#F1F5F9" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 700, fill: '#475569' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                      <Radar name="Leo" dataKey="value" stroke="#4FC3F7" fill="#4FC3F7" fillOpacity={0.25} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Family Goals */}
        <TabsContent value="goals">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {familyGoals.map((goal) => (
              <Card key={goal.id} className="border border-slate-100 shadow-sm bg-white overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0",
                    goal.category === 'family' ? "bg-sky-50 text-sky-600" : "bg-orange-50 text-orange-600"
                  )}>
                    {goal.category === 'family' ? <Users size={18} /> : <Target size={18} />}
                  </div>
                  <Badge variant={goal.category === 'family' ? 'default' : 'secondary'} className="capitalize rounded-full font-bold">
                    {goal.category}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-2">
                  <h4 className="text-base font-bold text-slate-800 mb-1">{goal.title}</h4>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <span>Progress</span>
                      <span>{Math.round((goal.progress / goal.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", goal.category === 'family' ? "bg-sky-400" : "bg-orange-400")} 
                        style={{ width: `${(goal.progress / goal.target) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 pt-2">
                      <Star size={10} fill="currentColor" className="text-amber-500" />
                      {goal.progress} / {goal.target} Stars Accumulated
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <button className="border border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center group hover:border-sky-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center mb-3 group-hover:text-sky-500 transition-colors">
                <Zap size={18} />
              </div>
              <h4 className="font-bold text-sm text-slate-700">New Target Goal</h4>
              <p className="text-xs text-slate-400 mt-1">Specify a group reward milestone to work towards.</p>
            </button>
          </div>
        </TabsContent>

        {/* Tab 4: Schedule */}
        <TabsContent value="schedule">
          <Card className="border border-slate-100 shadow-sm bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
              <div>
                <CardTitle className="text-lg font-bold">Academic & Weekend Settings</CardTitle>
                <CardDescription>Assign schedule parameters to modify task weight distribution</CardDescription>
              </div>
              <Badge variant={isTodaySchoolDay ? 'default' : 'accent'} className={`px-2.5 py-0.5 rounded-full border-none font-bold capitalize ${
                isTodaySchoolDay ? 'bg-sky-100 text-sky-800' : 'bg-orange-100 text-orange-800'
              }`}>
                Today: {isTodaySchoolDay ? 'School Day' : 'Holiday'}
              </Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Toggles determine base multipliers for daily completions. Weekdays default to academic weights, weekends default to holiday bonuses.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {(Object.entries(weeklySchedule) as [keyof WeeklySchedule, boolean][]).map(([day, isSchoolDay]) => (
                  <div key={day} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-slate-700 capitalize min-w-[5rem]">{day}</span>
                      <Badge 
                        className={`px-2 py-0 text-[9px] font-bold rounded-full border-none capitalize ${
                          isSchoolDay ? 'bg-sky-100 text-sky-800' : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {isSchoolDay ? 'School' : 'Holiday'}
                      </Badge>
                    </div>
                    {/* Toggle Button */}
                    <button
                      onClick={() => updateScheduleDay(day, !isSchoolDay)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-all relative p-0.5",
                        isSchoolDay ? "bg-emerald-400" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 bg-white rounded-full transition-all shadow-sm",
                        isSchoolDay ? "translate-x-6" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
