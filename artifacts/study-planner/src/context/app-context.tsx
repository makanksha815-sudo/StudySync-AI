import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useLocation } from 'wouter';

export type Profile = {
  name: string;
  avatar: string;
  studyGoal: string;
  dailyHoursTarget: number;
  accentColor: string;
  theme: 'dark' | 'light';
};

export type Task = {
  id: string;
  title: string;
  subject: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
  dueDate: string;
  createdAt: number;
};

export type Streak = {
  currentStreak: number;
  lastStudyDate: string;
  longestStreak: number;
};

type AppContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  tasks: Task[];
  setTasks: (tasks: Task[] | ((t: Task[]) => Task[])) => void;
  streak: Streak;
  setStreak: (streak: Streak) => void;
  isFirstVisit: boolean;
  completeOnboarding: () => void;
};

const defaultProfile: Profile = {
  name: '',
  avatar: '',
  studyGoal: '',
  dailyHoursTarget: 4,
  accentColor: 'purple',
  theme: 'dark'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// HSL values for themes
const ACCENT_COLORS: Record<string, { primary: string, ring: string }> = {
  purple: { primary: '263 70% 60%', ring: '263 70% 60%' },
  blue: { primary: '217 91% 60%', ring: '217 91% 60%' },
  cyan: { primary: '190 80% 55%', ring: '190 80% 55%' },
  emerald: { primary: '160 84% 39%', ring: '160 84% 39%' },
  orange: { primary: '24 95% 53%', ring: '24 95% 53%' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useLocalStorage<Profile>('study_planner_profile', defaultProfile);
  const [tasks, setTasks] = useLocalStorage<Task[]>('study_planner_tasks', []);
  const [streak, setStreak] = useLocalStorage<Streak>('study_planner_streak', {
    currentStreak: 0,
    lastStudyDate: '',
    longestStreak: 0
  });
  const [isFirstVisit, setIsFirstVisit] = useLocalStorage<boolean>('study_planner_first_visit', true);

  useEffect(() => {
    const root = window.document.documentElement;
    // Apply dark/light mode
    root.classList.remove('light', 'dark');
    root.classList.add(profile.theme);
    
    // Apply accent color by modifying CSS variables dynamically
    const colors = ACCENT_COLORS[profile.accentColor] || ACCENT_COLORS.purple;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--ring', colors.ring);
    
  }, [profile.theme, profile.accentColor]);

  const completeOnboarding = () => {
    setIsFirstVisit(false);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        setProfile,
        tasks,
        setTasks,
        streak,
        setStreak,
        isFirstVisit,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
