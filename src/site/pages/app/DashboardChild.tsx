import React from 'react';
import { useKiddoApp, Task } from './KiddoApp';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Flame, Trophy, CheckCircle2, 
  ArrowRight, Sparkles, Zap, Heart,
  Play, BookOpen, ShoppingBag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';

export function DashboardChild() {
  const { 
    tasks, completeTask, stars, 
    streak, level, childName, childAvatar, achievements 
  } = useKiddoApp();

  // Child's missions for today
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const reviewTasks = tasks.filter(t => t.status === 'review');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // XP Progress calculation (next level at 100 stars intervals)
  const xpCurrent = stars % 100;
  const xpTarget = 100;

  return (
    <div className="space-y-10 pb-12">
      
      {/* HEADER: GREETING & PROGRESS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-6">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-6xl shadow-xl border-4 border-white"
            >
              {childAvatar}
            </motion.div>
            <div className="space-y-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-kids font-bold"
              >
                Hey, {childName}!
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-brand-muted font-bold"
              >
                Ready for today's adventures?
              </motion.p>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-[2rem] border border-brand-navy/5 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-end">
              <div>
                <Badge variant="info" className="mb-2">Level {level} Explorer</Badge>
                <div className="font-kids text-xl font-bold">{xpCurrent} / {xpTarget} XP</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest block mb-1">To Next Level</span>
                <Badge variant="default" className="bg-brand-bg font-bold">{xpTarget - xpCurrent} XP</Badge>
              </div>
            </div>
            <div className="w-full bg-brand-bg h-6 rounded-full p-1.5 shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(xpCurrent / xpTarget) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-brand-blue to-brand-mint rounded-full shadow-sm"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4 h-full">
          <motion.div
            whileHover={{ scale: 1.05, translateY: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="bg-brand-yellow/10 border-brand-yellow/20 flex flex-col items-center justify-center p-6 space-y-2 h-full cursor-default">
              <Star size={40} className="text-brand-yellow" fill="currentColor" />
              <div className="text-3xl font-kids font-bold text-brand-navy">{stars}</div>
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Stars Earned</span>
            </Card>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, translateY: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="bg-brand-orange/10 border-brand-orange/20 flex flex-col items-center justify-center p-6 space-y-2 h-full cursor-default">
              <Flame size={40} className="text-brand-orange" fill="currentColor" />
              <div className="text-3xl font-kids font-bold text-brand-navy">{streak}</div>
              <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Day Streak</span>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* MISSION CONTROL TABS/SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-kids font-bold flex items-center gap-3">
            <Zap className="text-brand-orange fill-brand-orange" size={28} />
            Mission Control
          </h2>
          <Badge variant="default" className="bg-white border-brand-navy/5 text-brand-muted font-bold">
            {todoTasks.length} Available
          </Badge>
        </div>

        {todoTasks.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {todoTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card 
                    className="p-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 border-none shadow-xl h-full flex flex-col"
                  >
                    <div className={cn(
                      "p-6 flex flex-col items-center text-center space-y-4",
                      task.category === 'morning' ? "bg-brand-blue/5" : 
                      task.category === 'homework' ? "bg-brand-mint/5" : "bg-brand-orange/5"
                    )}>
                      <motion.div 
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-sm border-2 border-white transition-transform"
                      >
                        {task.category === 'morning' ? '🌅' : task.category === 'homework' ? '📚' : '🧹'}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-kids font-bold text-brand-navy">{task.title}</h3>
                        <Badge variant="default" className="mt-1 bg-white/50 border-none font-bold opacity-70 uppercase tracking-widest text-[9px]">
                          {task.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-brand-muted line-clamp-2 min-h-[2.5rem]">
                        {task.description}
                      </p>
                    </div>
                    <CardFooter className="bg-white p-4 flex flex-col gap-4 mt-auto">
                      <div className="flex items-center justify-center gap-2 font-kids font-bold text-brand-yellow text-lg">
                        <Star size={20} fill="currentColor" />
                        Worth {task.stars} Stars
                      </div>
                      <Button 
                        className="w-full h-14 rounded-2xl bg-brand-navy text-white text-lg font-bold group-hover:scale-[1.02]"
                        onClick={() => completeTask(task.id)}
                      >
                        Finish Mission
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-16 border-dashed border-2 flex flex-col items-center justify-center text-center bg-brand-mint/5 border-brand-mint/20">
              <div className="w-24 h-24 rounded-full bg-brand-mint/10 flex items-center justify-center text-brand-mint mb-6">
                <Sparkles size={48} />
              </div>
              <h3 className="text-2xl font-kids font-bold text-brand-navy">Missions Complete!</h3>
              <p className="text-brand-muted font-medium mt-2 max-w-sm">
                Great job, explorer! You've finished all your missions for now. Go play some games or check out the star shop!
              </p>
              <div className="flex gap-4 mt-8">
                <Link to="/app/learning">
                  <Button variant="outline" className="border-2 h-12 px-6">
                    <BookOpen size={18} className="mr-2" /> Play Games
                  </Button>
                </Link>
                <Link to="/app/rewards">
                  <Button variant="accent" className="h-12 px-6">
                    <ShoppingBag size={18} className="mr-2" /> Star Shop
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </section>

      {/* ACHIEVEMENTS & MINI GAMES PREVIEW */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-kids font-bold flex items-center gap-3">
            <Trophy className="text-brand-yellow fill-brand-yellow" size={24} />
            Explorer Badges
          </h2>
          <Card className="p-6 border-brand-navy/5 shadow-sm bg-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {achievements.map((ach, idx) => (
                <motion.div 
                  key={ach.id} 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all",
                    ach.unlocked ? "bg-brand-yellow/10 grayscale-0" : "bg-slate-50 grayscale opacity-40"
                  )}
                  title={ach.desc}
                >
                  <div className="text-3xl">{ach.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-center leading-tight">{ach.title}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-kids font-bold flex items-center gap-3">
            <Play className="text-brand-blue fill-brand-blue" size={24} />
            Quick Adventures
          </h2>
          <Link to="/app/learning" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-6 border-brand-navy/5 shadow-sm bg-gradient-to-br from-brand-blue to-brand-blue/80 text-white relative overflow-hidden group">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-kids font-bold">Puzzle Academy</h4>
                    <p className="text-sm text-white/80 font-medium mt-1">Earn bonus stars playing mini-games!</p>
                    <Button size="sm" className="mt-6 bg-white text-brand-blue hover:bg-white/90">
                      Play Now <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </div>
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="text-6xl"
                  >
                    🧩
                  </motion.div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
              </Card>
            </motion.div>
          </Link>
        </div>
      </section>

    </div>
  );
}
