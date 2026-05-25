import React from 'react';
import { useKiddoApp, Reward } from './KiddoApp';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Star, Zap, Gift, 
  Smartphone, IceCream, Bike, Ticket,
  CheckCircle2, Lock, ArrowRight, Sparkles, Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { cn } from '../../../lib/utils';

export function RewardsMarketplace() {
  const { role, rewards, stars, claimReward, childName } = useKiddoApp();

  const getRewardIcon = (category: string) => {
    switch (category) {
      case 'screen': return <Smartphone size={32} />;
      case 'treat': return <IceCream size={32} />;
      case 'toy': return <Bike size={32} />;
      case 'activity': return <Ticket size={32} />;
      default: return <Gift size={32} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'screen': return 'bg-brand-blue/10 text-brand-blue';
      case 'treat': return 'bg-brand-orange/10 text-brand-orange';
      case 'toy': return 'bg-brand-mint/10 text-brand-mint';
      case 'activity': return 'bg-brand-yellow/10 text-brand-yellow';
      default: return 'bg-brand-navy/10 text-brand-navy';
    }
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Badge variant="accent" className="px-3 py-1 mb-3">Rewards Marketplace</Badge>
          <h1 className="text-4xl md:text-5xl font-kids font-bold">Star Shop</h1>
          <p className="text-lg text-brand-muted mt-2 font-medium">
            {role === 'parent' 
              ? `Manage items ${childName} can redeem with their stars.` 
              : `Spend your hard-earned stars on awesome prizes!`}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Card className="p-4 bg-white border-brand-navy/5 flex items-center gap-4 shadow-xl">
            <motion.div 
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-12 h-12 rounded-2xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center shadow-inner"
            >
              <Star size={24} fill="currentColor" />
            </motion.div>
            <div>
              <div className="text-[10px] font-black text-brand-muted uppercase tracking-widest">Available Balance</div>
              <motion.div 
                key={stars}
                initial={{ scale: 1.2, color: "#FFC436" }}
                animate={{ scale: 1, color: "#1C2340" }}
                className="text-2xl font-kids font-bold"
              >
                {stars} Stars
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* REWARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {rewards.map((reward, idx) => {
            const canAfford = stars >= reward.cost;
            return (
              <motion.div
                key={reward.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card 
                  className={cn(
                    "p-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 h-full flex flex-col",
                    !canAfford && role === 'child' ? "opacity-75" : "hover:-translate-y-2"
                  )}
                >
                  <div className={cn("p-8 flex flex-col items-center text-center space-y-4 transition-colors", getCategoryColor(reward.category))}>
                    <motion.div 
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border-2 border-white transition-transform"
                    >
                      {getRewardIcon(reward.category)}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-kids font-bold text-brand-navy">{reward.title}</h3>
                      <Badge variant="default" className="mt-1 bg-white/50 border-none font-bold opacity-70 uppercase tracking-widest text-[9px]">
                        {reward.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-center gap-2 font-kids font-bold text-brand-yellow text-2xl">
                      <Star size={24} fill="currentColor" />
                      {reward.cost}
                    </div>
                    
                    <div className="mt-auto">
                      {role === 'child' ? (
                        <Button 
                          className={cn(
                            "w-full h-12 rounded-2xl font-bold transition-all",
                            canAfford ? "bg-brand-navy text-white shadow-lg" : "bg-slate-100 text-slate-400"
                          )}
                          disabled={!canAfford}
                          onClick={() => claimReward(reward.id)}
                        >
                          {canAfford ? 'Redeem Item' : 'Need More Stars'}
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 h-12 rounded-2xl border-2">Edit</Button>
                          <Button variant="ghost" className="w-12 h-12 p-0 rounded-2xl bg-brand-orange/5 text-brand-orange">
                            <Lock size={18} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  {reward.claimedCount > 0 && (
                    <CardFooter className="bg-slate-50/50 p-3 flex justify-center border-t border-brand-navy/5">
                      <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest">
                        Claimed {reward.claimedCount} times
                      </span>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            );
          })}

          {role === 'parent' && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(81, 159, 255, 0.05)' }}
              className="border-2 border-dashed border-brand-navy/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center group transition-all min-h-[350px]"
            >
              <div className="w-16 h-16 rounded-[2rem] bg-brand-navy/5 text-brand-muted flex items-center justify-center mb-6 group-hover:bg-brand-blue/10 group-hover:text-brand-blue transition-colors">
                <Plus size={32} />
              </div>
              <h4 className="text-xl font-kids font-bold text-brand-navy">Add New Reward</h4>
              <p className="text-sm text-brand-muted mt-2 max-w-[150px]">Create a new prize for your children.</p>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* REWARD HISTORY / STATUS (FOR KIDS) */}
      {role === 'child' && (
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-brand-navy/5 rounded-[3rem] p-8 md:p-12 shadow-sm"
        >
          <h3 className="text-2xl font-kids font-bold mb-8 flex items-center gap-3">
            <Sparkles className="text-brand-mint" size={24} />
            My Redemption History
          </h3>
          <div className="space-y-4">
            {rewards.filter(r => r.status !== 'active').length > 0 ? (
              <AnimatePresence mode="popLayout">
                {rewards.filter(r => r.status !== 'active').map((r, i) => (
                  <motion.div 
                    key={r.id} 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-brand-bg rounded-2xl border border-brand-navy/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        {getRewardIcon(r.category)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{r.title}</h4>
                        <p className="text-[10px] text-brand-muted font-bold uppercase tracking-widest">{r.cost} Stars spent</p>
                      </div>
                    </div>
                    <Badge variant={r.status === 'approved' ? 'success' : 'warning'}>
                      {r.status === 'approved' ? 'Ready to Use' : 'Waiting for Parent'}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="text-center py-10">
                <p className="text-brand-muted font-medium">You haven't redeemed any rewards yet. Keep earning stars!</p>
              </div>
            )}
          </div>
        </motion.section>
      )}

    </div>
  );
}
