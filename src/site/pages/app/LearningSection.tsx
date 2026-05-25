import React, { useState } from 'react';
import { useKiddoApp } from './KiddoApp';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Brain, Calculator, Languages, 
  Lightbulb, Play, Star, Trophy, ArrowRight,
  ChevronLeft, Sparkles, Zap, Lock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

export function LearningSection() {
  const { addStars, stars, level } = useKiddoApp();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameFeedback, setGameFeedback] = useState<{ show: boolean; stars: number } | null>(null);

  const puzzles = [
    { 
      id: 'math', 
      title: 'Math Blitz', 
      icon: <Calculator size={32} />, 
      color: 'bg-brand-blue/10 text-brand-blue', 
      desc: 'Solve 10 quick additions to earn stars.',
      reward: 15,
      difficulty: 'Easy',
      minLevel: 1
    },
    { 
      id: 'words', 
      title: 'Spelling Bee', 
      icon: <Languages size={32} />, 
      color: 'bg-brand-orange/10 text-brand-orange', 
      desc: 'Unscramble these 5 secret words.',
      reward: 20,
      difficulty: 'Medium',
      minLevel: 2
    },
    { 
      id: 'logic', 
      title: 'Pattern Tap', 
      icon: <Brain size={32} />, 
      color: 'bg-brand-mint/10 text-brand-mint', 
      desc: 'Remember the sequence of lights.',
      reward: 25,
      difficulty: 'Hard',
      minLevel: 3
    },
    { 
      id: 'science', 
      title: 'Galaxy Quiz', 
      icon: <Lightbulb size={32} />, 
      color: 'bg-brand-yellow/10 text-brand-yellow', 
      desc: 'Learn about planets and stars.',
      reward: 30,
      difficulty: 'Expert',
      minLevel: 5
    }
  ];

  const handlePlayGame = (id: string, reward: number) => {
    setActiveGame(id);
    // Simulate game completion
    setTimeout(() => {
      setGameFeedback({ show: true, stars: reward });
      addStars(reward);
    }, 2000);
  };

  const closeGame = () => {
    setActiveGame(null);
    setGameFeedback(null);
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Badge variant="info" className="px-3 py-1 mb-3">Learning Academy</Badge>
          <h1 className="text-4xl md:text-5xl font-kids font-bold">Puzzle Academy</h1>
          <p className="text-lg text-brand-muted mt-2 font-medium">Train your brain and earn bonus stars for your bank!</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-white border-brand-navy/5 flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center">
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Global Rank</div>
              <div className="text-lg font-bold">Top 15%</div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* PUZZLE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {puzzles.map((puzzle, idx) => {
          const isLocked = level < puzzle.minLevel;
          return (
            <motion.div
              key={puzzle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Card 
                className={cn(
                  "p-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 h-full flex flex-col",
                  isLocked ? "opacity-60 grayscale cursor-not-allowed" : "hover:-translate-y-2"
                )}
              >
                <div className={cn("p-8 flex flex-col items-center text-center space-y-4", puzzle.color)}>
                  <motion.div 
                    whileHover={!isLocked ? { scale: 1.1, rotate: 5 } : {}}
                    className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border-2 border-white transition-transform"
                  >
                    {isLocked ? <Lock size={32} className="text-brand-muted" /> : puzzle.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-kids font-bold">{puzzle.title}</h3>
                    <Badge variant="default" className="mt-1 bg-white/50 border-none font-bold opacity-70 uppercase tracking-widest text-[9px]">
                      {puzzle.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                  <p className="text-xs text-brand-muted text-center font-medium leading-relaxed flex-1">
                    {puzzle.desc}
                  </p>
                  <div className="flex items-center justify-center gap-2 font-kids font-bold text-brand-mint text-lg">
                    <Star size={20} fill="currentColor" className="text-brand-yellow" />
                    +{puzzle.reward} Reward
                  </div>
                  <Button 
                    className={cn(
                      "w-full h-12 rounded-2xl font-bold",
                      isLocked ? "bg-slate-100 text-slate-400" : "bg-brand-navy text-white"
                    )}
                    disabled={isLocked}
                    onClick={() => handlePlayGame(puzzle.id, puzzle.reward)}
                  >
                    {isLocked ? `Unlocks at Lvl ${puzzle.minLevel}` : 'Start Playing'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* PROGRESS TRACKER */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-brand-navy/5 rounded-[3rem] p-8 md:p-12 shadow-sm"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-kids font-bold">Daily Study Goal</h3>
            <p className="text-sm text-brand-muted font-medium">Complete 3 puzzles every day to keep your brain sharp and earn a massive 50 star bonus!</p>
            <div className="flex gap-2 pt-2">
              <Badge variant="success" className="w-8 h-8 p-0 flex items-center justify-center rounded-lg"><Zap size={14} /></Badge>
              <Badge variant="success" className="w-8 h-8 p-0 flex items-center justify-center rounded-lg"><Zap size={14} /></Badge>
              <Badge variant="default" className="w-8 h-8 p-0 flex items-center justify-center rounded-lg bg-brand-bg opacity-30"><Zap size={14} /></Badge>
            </div>
          </div>
          
          <div className="lg:col-span-2 bg-brand-bg rounded-[2rem] p-8 flex items-center gap-8 border border-brand-navy/5">
            <div className="flex-1 space-y-4">
              <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-brand-muted">
                <span>Memory Score</span>
                <span className="text-brand-navy">850 Points</span>
              </div>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '85%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-brand-blue h-full rounded-full" 
                />
              </div>
              <div className="flex justify-between font-bold text-xs uppercase tracking-widest text-brand-muted">
                <span>Logic & Math</span>
                <span className="text-brand-navy">620 Points</span>
              </div>
              <div className="w-full bg-white h-3 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '62%' }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                  className="bg-brand-orange h-full rounded-full" 
                />
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-sm border border-brand-navy/5">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-2xl font-kids font-bold text-brand-navy">12</div>
              <div className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Brain Streak</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* GAME MODAL (SIMULATED) */}
      <AnimatePresence>
        {activeGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-navy/90 backdrop-blur-md flex items-center justify-center z-[100] p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="max-w-2xl w-full"
            >
              <Card className="p-0 overflow-hidden border-none shadow-2xl">
                {!gameFeedback ? (
                  <div className="p-12 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-24 h-24 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center"
                    >
                      <Sparkles size={48} />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-kids font-bold text-brand-navy">Loading Adventure...</h3>
                      <p className="text-brand-muted font-medium mt-2">Get ready to test your skills!</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 12, stiffness: 200 }}
                      className="w-32 h-32 rounded-[2.5rem] bg-brand-mint text-white flex items-center justify-center text-6xl shadow-xl shadow-brand-mint/20"
                    >
                      🏆
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-4xl font-kids font-bold text-brand-navy">Victory!</h3>
                      <p className="text-xl text-brand-muted font-medium">You solved the puzzle like a pro!</p>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3 text-3xl font-kids font-bold text-brand-yellow py-4 px-8 bg-brand-bg rounded-3xl border border-brand-navy/5 shadow-inner"
                    >
                      <Star size={32} fill="currentColor" />
                      +{gameFeedback.stars} Stars Earned
                    </motion.div>
                    <Button className="w-full h-16 text-xl rounded-[2rem] shadow-xl" onClick={closeGame}>
                      Back to Academy <ArrowRight size={24} className="ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
