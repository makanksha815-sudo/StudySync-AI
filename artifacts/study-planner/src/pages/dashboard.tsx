import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/app-context';
import { GlassCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { QUOTES } from '@/lib/quotes';
import { Clock, Flame, CheckCircle2, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { profile, tasks, streak } = useAppContext();
  const [time, setTime] = useState(new Date());
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length || 1; // prevent div by zero
  const completionRate = Math.round((completedTasks / totalTasks) * 100);
  const isAllDone = completedTasks === totalTasks && totalTasks > 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {getGreeting()}, {profile.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4" /> {format(time, 'EEEE, MMMM do, yyyy')}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            {format(time, 'HH:mm')}
          </div>
        </div>
      </motion.div>

      {/* Bento Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {/* Main Goal Card */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-2">
          <GlassCard className="h-full bg-gradient-to-br from-card/40 to-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Target className="w-24 h-24" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Current Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">{profile.studyGoal || 'No goal set'}</div>
              <div className="space-y-2 relative z-10">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Daily Progress</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>

        {/* Streak Card */}
        <motion.div variants={item}>
          <GlassCard className="h-full bg-gradient-to-b from-card/40 to-orange-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-500 flex items-center gap-2">
                <Flame className="w-5 h-5 fill-orange-500" /> Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{streak.currentStreak}</span>
                <span className="text-muted-foreground font-medium">days</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Longest: {streak.longestStreak} days
              </p>
            </CardContent>
          </GlassCard>
        </motion.div>

        {/* Tasks Summary */}
        <motion.div variants={item}>
          <GlassCard className="h-full bg-gradient-to-b from-card/40 to-emerald-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Tasks Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{completedTasks}</span>
                <span className="text-muted-foreground font-medium">/ {tasks.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                {isAllDone && tasks.length > 0 ? 'All done! Amazing work.' : 'Keep going!'}
              </p>
            </CardContent>
          </GlassCard>
        </motion.div>

        {/* Quote of the day */}
        <motion.div variants={item} className="md:col-span-3 lg:col-span-4">
          <GlassCard className="relative overflow-hidden border-primary/20">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent" />
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <blockquote className="text-lg md:text-xl font-medium italic text-foreground mb-4">
                  "{quote.text}"
                </blockquote>
                <cite className="text-sm font-semibold text-primary not-italic">
                  — {quote.author}
                </cite>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
}
