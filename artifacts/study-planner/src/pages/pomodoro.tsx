import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Brain, Coffee, Coffee as CoffeeLarge, Settings, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/app-context';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODES = {
  pomodoro: { time: 25 * 60, label: 'Focus Session', icon: Brain, color: 'text-primary' },
  shortBreak: { time: 5 * 60, label: 'Short Break', icon: Coffee, color: 'text-accent' },
  longBreak: { time: 15 * 60, label: 'Long Break', icon: CoffeeLarge, color: 'text-blue-500' }
};

export default function Pomodoro() {
  const { streak, setStreak } = useAppContext();
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.time);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = ((MODES[mode].time - timeLeft) / MODES[mode].time) * circumference;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      const audio = new Audio('/ding.mp3'); // Mock sound
      audio.play().catch(() => {}); // ignore error if missing

      if (mode === 'pomodoro') {
        setSessionsCompleted(prev => prev + 1);
        
        // Update streak if this is the first pomodoro today
        const today = new Date().toDateString();
        if (streak.lastStudyDate !== today) {
          setStreak({
            ...streak,
            lastStudyDate: today,
            currentStreak: streak.currentStreak + 1,
            longestStreak: Math.max(streak.longestStreak, streak.currentStreak + 1)
          });
        }

        // Auto-switch to break
        if ((sessionsCompleted + 1) % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(MODES.longBreak.time);
        } else {
          setMode('shortBreak');
          setTimeLeft(MODES.shortBreak.time);
        }
      } else {
        setMode('pomodoro');
        setTimeLeft(MODES.pomodoro.time);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, sessionsCompleted, streak, setStreak]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const changeMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const CurrentIcon = MODES[mode].icon;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 relative">
      {/* Background glow matching current mode */}
      <div className={cn(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 pointer-events-none transition-colors duration-1000",
        mode === 'pomodoro' ? 'bg-primary' : mode === 'shortBreak' ? 'bg-accent' : 'bg-blue-500'
      )} />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex justify-center gap-2 bg-secondary/50 p-1.5 rounded-2xl backdrop-blur-md border border-border">
          {(Object.keys(MODES) as TimerMode[]).map(m => (
            <button
              key={m}
              onClick={() => changeMode(m)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                mode === m ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        <GlassCard className="p-8 border-t-4" style={{ borderTopColor: `var(--color-${mode === 'pomodoro' ? 'primary' : mode === 'shortBreak' ? 'accent' : 'blue-500'})` }}>
          <div className="flex flex-col items-center">
            
            <div className="flex items-center gap-2 mb-8">
              <CurrentIcon className={cn("w-5 h-5", MODES[mode].color)} />
              <span className="font-semibold text-lg">{MODES[mode].label}</span>
            </div>

            {/* Circular Timer */}
            <div className="relative flex items-center justify-center w-[300px] h-[300px]">
              {/* Background circle */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 300 300">
                <circle
                  cx="150" cy="150" r={radius}
                  className="stroke-secondary fill-none"
                  strokeWidth="12"
                />
                {/* Animated progress circle */}
                <motion.circle
                  cx="150" cy="150" r={radius}
                  className={cn("fill-none transition-colors duration-500", 
                    mode === 'pomodoro' ? 'stroke-primary' : mode === 'shortBreak' ? 'stroke-accent' : 'stroke-blue-500'
                  )}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  animate={{ strokeDashoffset: progress }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>

              {/* Time display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span 
                  key={timeLeft}
                  initial={{ opacity: 0.8, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-6xl font-black tracking-tighter font-mono"
                >
                  {formatTime(timeLeft)}
                </motion.span>
                <div className="mt-2 text-muted-foreground font-medium uppercase tracking-widest text-xs">
                  {isActive ? 'Session Active' : 'Paused'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-10 w-full">
              <Button 
                variant="outline" 
                size="icon" 
                className="w-12 h-12 rounded-full border-border hover:bg-secondary"
                onClick={resetTimer}
              >
                <RotateCcw className="w-5 h-5 text-muted-foreground" />
              </Button>
              
              <Button 
                size="lg" 
                className={cn(
                  "w-32 h-14 rounded-2xl text-lg font-bold shadow-lg transition-transform active:scale-95",
                  mode === 'pomodoro' ? 'bg-primary hover:bg-primary/90' : 
                  mode === 'shortBreak' ? 'bg-accent hover:bg-accent/90 text-primary-foreground' : 
                  'bg-blue-500 hover:bg-blue-600 text-white'
                )}
                onClick={toggleTimer}
              >
                {isActive ? (
                  <><Pause className="w-6 h-6 mr-2" /> Pause</>
                ) : (
                  <><Play className="w-6 h-6 mr-2" /> Start</>
                )}
              </Button>

              <Button 
                variant="outline" 
                size="icon" 
                className="w-12 h-12 rounded-full border-border hover:bg-secondary"
              >
                <Volume2 className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>

          </div>
        </GlassCard>

        {/* Sessions indicator */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
            Today's Sessions
          </span>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i} 
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-500",
                  i < (sessionsCompleted % 4) ? "bg-primary scale-125" : "bg-secondary"
                )}
              />
            ))}
          </div>
          <span className="text-sm font-medium mt-1">
            Total completed: <span className="text-primary">{sessionsCompleted}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
