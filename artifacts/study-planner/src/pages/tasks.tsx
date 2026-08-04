import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Calendar, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppContext, Task } from '@/context/app-context';
import { format } from 'date-fns';

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ['#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#ec4899'];
  const pieces = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * -20 - 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    scale: Math.random() * 0.5 + 0.5,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ top: '50%', left: '50%', scale: 0 }}
          animate={{
            top: [`50%`, `${Math.random() * 100}%`],
            left: [`50%`, `${p.x}%`],
            scale: [0, p.scale, 0],
            rotate: [0, p.rotation + 360]
          }}
          transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
          style={{ position: 'absolute', width: 10, height: 10, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

export default function Tasks() {
  const { tasks, setTasks } = useAppContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: Math.random().toString(),
      title: newTaskTitle,
      subject: newTaskSubject || 'General',
      priority: 'medium',
      completed: false,
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      createdAt: Date.now()
    };
    
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskSubject('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      // Check if all are completed now
      if (updated.length > 0 && updated.every(t => t.completed)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      return updated;
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto relative">
      <Confetti active={showConfetti} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Tasks</h1>
          <p className="text-muted-foreground mt-2">Manage your daily goals and assignments.</p>
        </div>
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Daily Progress</span>
            <span className="text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      <GlassCard className="p-2 border-primary/20">
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-2">
          <Input 
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?" 
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-lg"
          />
          <div className="flex gap-2 p-1 border-t sm:border-t-0 sm:border-l border-border/50">
            <Input 
              value={newTaskSubject}
              onChange={e => setNewTaskSubject(e.target.value)}
              placeholder="Subject (opt)" 
              className="w-32 bg-transparent border-none focus-visible:ring-0 text-sm"
            />
            <Button type="submit" size="icon" className="shrink-0 h-10 w-10 rounded-lg">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </GlassCard>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-12 border border-dashed border-border rounded-xl">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">You're all caught up!</h3>
            <p className="text-muted-foreground mt-1">Add a new task above to get started.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {tasks.map(task => (
              <motion.div
                layout
                key={task.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                whileHover={{ scale: 1.01 }}
                className={`group flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  task.completed ? 'bg-secondary/20 border-border/50 opacity-60' : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    task.completed ? 'bg-primary border-primary text-white' : 'border-muted-foreground hover:border-primary'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate transition-all ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {task.subject}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {task.dueDate}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
