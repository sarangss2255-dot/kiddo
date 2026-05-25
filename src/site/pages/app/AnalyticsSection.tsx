import React from 'react';
import { useKiddoApp } from './KiddoApp';
import { motion } from 'motion/react';
import { 
  BarChart3, TrendingUp, Calendar, Target, 
  Award, Star, Flame, Zap, PieChart, LineChart,
  ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, 
  Cell, Line, LineChart as ReLineChart, CartesianGrid, Area, AreaChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

export function AnalyticsSection() {
  const { tasks, stars, streak, level, childName } = useKiddoApp();

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const completionRate = Math.round((completedCount / totalCount) * 100);

  // Mock data for charts
  const weeklyStars = [
    { day: 'Mon', stars: 25 },
    { day: 'Tue', stars: 40 },
    { day: 'Wed', stars: 15 },
    { day: 'Thu', stars: 55 },
    { day: 'Fri', stars: 30 },
    { day: 'Sat', stars: 70 },
    { day: 'Sun', stars: 45 },
  ];

  const categoryData = [
    { name: 'Morning', value: 35, color: '#519FFF' },
    { name: 'Homework', value: 25, color: '#FF7A59' },
    { name: 'Chores', value: 30, color: '#3BBA9C' },
    { name: 'Learning', value: 10, color: '#FFC436' },
  ];

  return (
    <div className="space-y-10 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Badge variant="info" className="px-3 py-1 mb-3">Performance Insights</Badge>
          <h1 className="text-4xl md:text-5xl font-kids font-bold">Growth Reports</h1>
          <p className="text-lg text-brand-muted mt-2 font-medium">Tracking {childName}'s consistency and habit formation.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <Badge variant="default" className="bg-white border-brand-navy/5 px-4 py-2 text-brand-muted font-bold normal-case tracking-normal">
            Last 30 Days
          </Badge>
        </motion.div>
      </div>

      {/* TOP METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Completion Rate', value: `${completionRate}%`, icon: <Target />, color: 'text-brand-blue', bg: 'bg-brand-blue/10', trend: '+5%', up: true },
          { label: 'Total Stars', value: stars, icon: <Star />, color: 'text-brand-yellow', bg: 'bg-brand-yellow/10', trend: '+120', up: true },
          { label: 'Active Streak', value: `${streak}d`, icon: <Flame />, color: 'text-brand-orange', bg: 'bg-brand-orange/10', trend: 'Steady', up: true },
          { label: 'Level Progress', value: `${level}`, icon: <TrendingUp />, color: 'text-brand-mint', bg: 'bg-brand-mint/10', trend: 'Level Up soon', up: true },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            whileHover={{ translateY: -5 }}
          >
            <Card className="p-6 border-brand-navy/5 shadow-sm h-full">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm", metric.bg, metric.color)}>
                  {metric.icon}
                </div>
                <Badge variant="default" className="bg-brand-bg text-[9px] font-black tracking-widest border-none">
                  {metric.trend} {metric.up ? <ArrowUpRight size={10} className="ml-1" /> : <ArrowDownRight size={10} className="ml-1" />}
                </Badge>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">{metric.label}</span>
                <div className="text-3xl font-kids font-bold">{metric.value}</div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* MAIN CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Star Momentum Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-8 border-brand-navy/5 shadow-sm h-full">
            <CardHeader className="p-0 mb-10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Star Momentum</CardTitle>
                <CardDescription>Daily star accumulation throughout the week.</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-brand-blue" />
                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Stars</span>
                </div>
              </div>
            </CardHeader>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyStars}>
                  <defs>
                    <linearGradient id="colorStars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#519FFF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#519FFF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9EA4BC' }} 
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 700, fill: '#9EA4BC' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="stars" 
                    stroke="#519FFF" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorStars)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 border-brand-navy/5 shadow-sm flex flex-col h-full">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="text-2xl">Activity Mix</CardTitle>
              <CardDescription>Distribution of completed tasks.</CardDescription>
            </CardHeader>
            
            <div className="flex-1 space-y-6">
              {categoryData.map((cat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-brand-navy">{cat.name}</span>
                    </div>
                    <span className="text-brand-muted">{cat.value}%</span>
                  </div>
                  <div className="w-full bg-brand-bg h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.value}%` }}
                      transition={{ duration: 1, delay: 0.6 + (i * 0.1) }}
                      className="h-full rounded-full" 
                      style={{ backgroundColor: cat.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <CardFooter className="p-0 pt-8 mt-8 border-t border-brand-navy/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-muted">
                <Info size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Most active: Morning</span>
              </div>
              <PieChart size={18} className="text-brand-blue" />
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {/* HEATMAP SIMULATION / CONSISTENCY GRID */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="bg-white border border-brand-navy/5 rounded-[3rem] p-8 md:p-12 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h3 className="text-2xl font-kids font-bold">Consistency Heatmap</h3>
            <p className="text-sm text-brand-muted font-medium mt-1">Visualization of daily mission completion over time.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-brand-navy/5" />
              <span className="text-[9px] font-black uppercase text-brand-muted">Less</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn("w-3 h-3 rounded-sm", i === 1 ? "bg-brand-mint/20" : i === 2 ? "bg-brand-mint/50" : i === 3 ? "bg-brand-mint/80" : "bg-brand-mint")} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase text-brand-muted">More</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-21 lg:grid-cols-30 gap-2">
          {Array.from({ length: 90 }).map((_, i) => {
            const intensity = Math.random();
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 30) * 0.01 + Math.floor(i / 30) * 0.1 }}
                className={cn(
                  "w-4 h-4 rounded-sm transition-all cursor-help",
                  intensity > 0.8 ? "bg-brand-mint" :
                  intensity > 0.5 ? "bg-brand-mint/60" :
                  intensity > 0.2 ? "bg-brand-mint/20" : "bg-brand-navy/5"
                )}
                whileHover={{ scale: 1.5, zIndex: 10 }}
                title={`Day ${i + 1}: ${Math.floor(intensity * 10)} tasks completed`}
              />
            );
          })}
        </div>
      </motion.section>

    </div>
  );
}
