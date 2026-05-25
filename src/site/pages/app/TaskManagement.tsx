import React, { useState } from 'react';
import { useKiddoApp, Task } from './KiddoApp';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, Filter, Calendar, Clock, CheckCircle2, 
  Trash2, Edit2, Star, Sparkles, Zap, ListChecks,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { cn } from '../../../lib/utils';

export function TaskManagement() {
  const { tasks, addTask, childName } = useKiddoApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    category: 'morning',
    stars: 10,
    recurring: 'daily'
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    addTask(newTask as Omit<Task, 'id' | 'status'>);
    setShowAddModal(false);
    setNewTask({ title: '', description: '', category: 'morning', stars: 10, recurring: 'daily' });
  };

  return (
    <div className="space-y-10 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Badge variant="accent" className="px-3 py-1 mb-3">Task Management</Badge>
          <h1 className="text-4xl md:text-5xl font-kids font-bold">Mission Board</h1>
          <p className="text-lg text-brand-muted mt-2 font-medium">Design daily adventures and chores for {childName}.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button size="lg" onClick={() => setShowAddModal(true)} className="h-14 px-8 rounded-2xl shadow-xl">
            <Plus size={20} className="mr-2" /> Create New Mission
          </Button>
        </motion.div>
      </div>

      {/* SEARCH & FILTERS */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
          <Input placeholder="Search missions..." className="pl-12 h-12" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-12 border-brand-navy/10 px-4">
            <Filter size={18} className="mr-2" /> Category
          </Button>
          <Button variant="outline" className="h-12 border-brand-navy/10 px-4 text-brand-muted">
            Sort by Stars
          </Button>
        </div>
      </motion.div>

      {/* TASK LIST */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task, idx) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="p-0 overflow-hidden border-brand-navy/5 shadow-sm hover:shadow-xl transition-all group h-full flex flex-col">
                <div className={cn(
                  "p-6 border-b flex items-start justify-between",
                  task.status === 'completed' ? "bg-brand-mint/5 border-brand-mint/10" : "bg-white border-brand-navy/5"
                )}>
                  <div className="flex items-center gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm",
                        task.category === 'morning' ? "bg-brand-blue/10 text-brand-blue" :
                        task.category === 'homework' ? "bg-brand-mint/10 text-brand-mint" : "bg-brand-orange/10 text-brand-orange"
                      )}
                    >
                      {task.category === 'morning' ? '🌅' : task.category === 'homework' ? '📚' : '🧹'}
                    </motion.div>
                    <div>
                      <h4 className={cn("font-bold text-sm", task.status === 'completed' && "text-brand-mint")}>{task.title}</h4>
                      <Badge variant="default" className="mt-1 bg-brand-bg text-[9px] font-black uppercase tracking-widest border-none">
                        {task.recurring}
                      </Badge>
                    </div>
                  </div>
                  {task.status === 'completed' && <CheckCircle2 className="text-brand-mint" size={20} />}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <p className="text-xs text-brand-muted line-clamp-2 min-h-[2.5rem] flex-1">
                    {task.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-kids font-bold text-brand-yellow">
                      <Star size={16} fill="currentColor" />
                      {task.stars} Stars
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg hover:bg-brand-bg">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg hover:bg-brand-orange/10 hover:text-brand-orange">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ADD MISSION MODAL */}
      <AnimatePresence>
        {showAddModal && (
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
              className="max-w-md w-full"
            >
              <Card className="p-8 border-none shadow-2xl">
                <h3 className="text-2xl font-kids font-bold mb-6">Create Mission</h3>
                <form onSubmit={handleAddTask} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted ml-1">Mission Title</label>
                    <Input 
                      required
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      placeholder="e.g. Clean the play area"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted ml-1">Short Description</label>
                    <textarea 
                      className="w-full min-h-[100px] rounded-2xl border border-brand-navy/10 bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                      placeholder="Details for the explorer..."
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted ml-1">Category</label>
                      <select 
                        className="w-full h-12 rounded-2xl border border-brand-navy/10 bg-white px-4 text-sm focus:outline-none"
                        value={newTask.category}
                        onChange={e => setNewTask({...newTask, category: e.target.value as any})}
                      >
                        <option value="morning">Morning</option>
                        <option value="bedtime">Bedtime</option>
                        <option value="chores">Chores</option>
                        <option value="homework">Homework</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-muted ml-1">Star Value</label>
                      <Input 
                        type="number"
                        value={newTask.stars}
                        onChange={e => setNewTask({...newTask, stars: parseInt(e.target.value)})}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 h-12 border-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-brand-navy shadow-xl shadow-brand-navy/10"
                    >
                      Create Mission
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
