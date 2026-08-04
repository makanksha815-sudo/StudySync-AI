import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Target, Medal, Star, Flame, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge as UIBadge } from '@/components/ui/badge';
import { useAppContext } from '@/context/app-context';
import { useLocalStorage } from '@/hooks/use-local-storage';

type Goal = {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  badgeIcon: string;
};

const BADGE_ICONS = {
  Star, Trophy, Medal, Target, Flame, Zap
};

export default function Goals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('study_planner_goals', [
    { id: '1', title: 'Finish Java Module 2', description: 'Complete all coding assignments', targetValue: 10, currentValue: 7, unit: 'assignments', badgeIcon: 'Trophy' },
    { id: '2', title: 'Study 3 hours daily', description: 'Maintain consistency', targetValue: 21, currentValue: 5, unit: 'days', badgeIcon: 'Flame' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addGoal = () => {
    if (!newTitle || !newTarget || !newUnit) return;
    const icons = Object.keys(BADGE_ICONS);
    setGoals([...goals, {
      id: Math.random().toString(),
      title: newTitle,
      description: '',
      targetValue: Number(newTarget),
      currentValue: 0,
      unit: newUnit,
      badgeIcon: icons[Math.floor(Math.random() * icons.length)]
    }]);
    setNewTitle(''); setNewTarget(''); setNewUnit('');
    setIsAdding(false);
  };

  const updateProgress = (id: string, increment: number) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const next = Math.min(g.targetValue, Math.max(0, g.currentValue + increment));
        return { ...g, currentValue: next };
      }
      return g;
    }));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals & Achievements</h1>
          <p className="text-muted-foreground mt-2">Track long-term milestones and earn badges.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" /> New Goal
        </Button>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="border-primary/50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="space-y-2 flex-1 w-full">
                  <label className="text-sm font-medium">Goal Title</label>
                  <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g. Read 5 Books" />
                </div>
                <div className="space-y-2 w-full md:w-32">
                  <label className="text-sm font-medium">Target</label>
                  <Input type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="5" />
                </div>
                <div className="space-y-2 w-full md:w-48">
                  <label className="text-sm font-medium">Unit</label>
                  <Input value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="books" />
                </div>
                <Button onClick={addGoal} className="w-full md:w-auto h-10">Save Goal</Button>
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = Math.round((goal.currentValue / goal.targetValue) * 100);
          const isComplete = progress >= 100;
          const Icon = BADGE_ICONS[goal.badgeIcon as keyof typeof BADGE_ICONS] || Trophy;

          return (
            <motion.div key={goal.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard className={`relative overflow-hidden transition-all ${isComplete ? 'border-primary/50 bg-primary/5' : ''}`}>
                {isComplete && (
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Trophy className="w-32 h-32 text-primary" />
                  </div>
                )}
                
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className={`p-3 rounded-xl ${isComplete ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-secondary text-muted-foreground'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">{goal.description || `Track your ${goal.unit}`}</p>
                      </div>
                    </div>
                    {isComplete && <UIBadge variant="default" className="bg-primary hover:bg-primary">Completed</UIBadge>}
                  </div>

                  <div className="space-y-2 relative z-10">
                    <div className="flex justify-between text-sm font-medium">
                      <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                      <span className={isComplete ? 'text-primary' : ''}>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-3" indicatorClassName={isComplete ? 'bg-primary' : 'bg-primary/70'} />
                  </div>

                  {!isComplete && (
                    <div className="flex gap-2 mt-6 relative z-10">
                      <Button variant="outline" size="sm" onClick={() => updateProgress(goal.id, 1)} className="flex-1">
                        +1 {goal.unit}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateProgress(goal.id, -1)} disabled={goal.currentValue <= 0}>
                        -1
                      </Button>
                    </div>
                  )}
                </CardContent>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
      
      {/* Achievements Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          <Medal className="w-6 h-6 text-accent" /> Earned Badges
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'First Steps', desc: 'Completed first task', icon: Target, earned: true },
            { name: 'On Fire', desc: '3-day streak', icon: Flame, earned: true },
            { name: 'Focus Master', desc: '10 Pomodoros', icon: Zap, earned: false },
            { name: 'Scholar', desc: '50 hours studied', icon: Star, earned: false },
          ].map((badge, i) => (
            <GlassCard key={i} className={`text-center p-6 ${!badge.earned ? 'opacity-50 grayscale' : 'border-accent/30 bg-accent/5'}`}>
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${badge.earned ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'}`}>
                <badge.icon className="w-8 h-8" />
              </div>
              <h4 className="font-bold">{badge.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
