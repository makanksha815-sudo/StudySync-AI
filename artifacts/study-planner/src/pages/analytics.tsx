import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, CheckCircle2, CircleDashed, Flame, Target } from 'lucide-react';
import { GlassCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/context/app-context';

export default function Analytics() {
  const { tasks, streak, profile } = useAppContext();

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  
  // Mock data for graphs
  const weeklyData = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 3.8 },
    { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 4.2 },
    { name: 'Fri', hours: 3.0 },
    { name: 'Sat', hours: 5.5 },
    { name: 'Sun', hours: 2.0 },
  ];

  const subjectData = [
    { subject: 'Computer Science', progress: 75, color: 'bg-primary' },
    { subject: 'Mathematics', progress: 45, color: 'bg-blue-500' },
    { subject: 'Physics', progress: 90, color: 'bg-emerald-500' },
    { subject: 'Literature', progress: 30, color: 'bg-accent' },
  ];

  const totalHoursThisWeek = weeklyData.reduce((acc, curr) => acc + curr.hours, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">Track your progress and study patterns.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="bg-primary/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Hours this week</p>
                <h3 className="text-3xl font-bold">{totalHoursThisWeek.toFixed(1)}h</h3>
              </div>
              <div className="p-3 bg-primary/20 rounded-xl text-primary"><Activity className="w-5 h-5" /></div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
              <span className="text-emerald-500 font-medium">+12%</span> from last week
            </p>
          </CardContent>
        </GlassCard>
        
        <GlassCard className="bg-emerald-500/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Tasks Done</p>
                <h3 className="text-3xl font-bold">{completedCount}</h3>
              </div>
              <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-500"><CheckCircle2 className="w-5 h-5" /></div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Total completed tasks</p>
          </CardContent>
        </GlassCard>

        <GlassCard className="bg-orange-500/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Pending Tasks</p>
                <h3 className="text-3xl font-bold">{pendingCount}</h3>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl text-orange-500"><CircleDashed className="w-5 h-5" /></div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Needs your attention</p>
          </CardContent>
        </GlassCard>

        <GlassCard className="bg-accent/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Current Streak</p>
                <h3 className="text-3xl font-bold">{streak.currentStreak}</h3>
              </div>
              <div className="p-3 bg-accent/20 rounded-xl text-accent"><Flame className="w-5 h-5" /></div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">Consecutive study days</p>
          </CardContent>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart */}
        <div className="lg:col-span-2">
          <GlassCard className="h-full">
            <CardHeader>
              <CardTitle>Study Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorHours)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </GlassCard>
        </div>

        {/* Subject Progress */}
        <div className="lg:col-span-1">
          <GlassCard className="h-full">
            <CardHeader>
              <CardTitle>Subject Mastery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subjectData.map((sub, i) => (
                <div key={sub.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{sub.subject}</span>
                    <span className="text-muted-foreground">{sub.progress}%</span>
                  </div>
                  <Progress value={sub.progress} className="h-2" indicatorClassName={sub.color} />
                </div>
              ))}
            </CardContent>
          </GlassCard>
        </div>

        {/* Activity Heatmap Mock */}
        <div className="lg:col-span-3">
          <GlassCard>
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex overflow-x-auto pb-4">
                <div className="grid grid-rows-7 gap-1.5 min-w-max">
                  {Array.from({ length: 7 }).map((_, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1.5">
                      {Array.from({ length: 52 }).map((_, colIndex) => {
                        const intensity = Math.random();
                        const opacity = intensity > 0.8 ? 1 : intensity > 0.5 ? 0.6 : intensity > 0.2 ? 0.3 : 0.1;
                        return (
                          <div 
                            key={`${rowIndex}-${colIndex}`} 
                            className="w-3 h-3 rounded-[2px]"
                            style={{ backgroundColor: `hsla(var(--primary), ${opacity})` }}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-[2px] bg-primary/10"></div>
                  <div className="w-3 h-3 rounded-[2px] bg-primary/30"></div>
                  <div className="w-3 h-3 rounded-[2px] bg-primary/60"></div>
                  <div className="w-3 h-3 rounded-[2px] bg-primary"></div>
                </div>
                <span>More</span>
              </div>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
