import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, User, Clock, ArrowRight, Zap, Brain, Rocket } from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();
  const { profile, setProfile, isFirstVisit, completeOnboarding } = useAppContext();
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    name: profile.name || '',
    studyGoal: profile.studyGoal || '',
    dailyHoursTarget: profile.dailyHoursTarget || 4,
  });

  // If not first visit, redirect immediately
  if (!isFirstVisit) {
    // Only redirect once rendering is done using a layout effect or standard effect
    // But since this is simple, we can just return null and redirect
    setTimeout(() => setLocation('/dashboard'), 0);
    return null;
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    setProfile({
      ...profile,
      name: formData.name,
      studyGoal: formData.studyGoal,
      dailyHoursTarget: formData.dailyHoursTarget,
    });
    completeOnboarding();
    setLocation('/dashboard');
  };

  const steps = [
    // Step 0: Welcome
    <div key="welcome" className="flex flex-col items-center text-center space-y-6 max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/30"
      >
        <Zap className="w-12 h-12 text-white" />
      </motion.div>
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">StudySync</h1>
        <p className="text-lg text-muted-foreground">The premium cockpit for your academic life.</p>
      </div>
      <Button size="lg" className="w-full text-lg mt-8 rounded-xl h-14 group" onClick={nextStep}>
        Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>,

    // Step 1: Name
    <div key="name" className="flex flex-col space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">What should we call you?</h2>
        <p className="text-muted-foreground">Let's personalize your experience.</p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            autoFocus
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Your name" 
            className="pl-12 h-14 text-lg rounded-xl bg-secondary/50 border-transparent focus:border-primary"
            onKeyDown={(e) => e.key === 'Enter' && formData.name && nextStep()}
          />
        </div>
        <Button 
          size="lg" 
          disabled={!formData.name} 
          className="w-full h-14 rounded-xl text-lg" 
          onClick={nextStep}
        >
          Continue
        </Button>
      </div>
    </div>,

    // Step 2: Goal
    <div key="goal" className="flex flex-col space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">What's your main goal?</h2>
        <p className="text-muted-foreground">e.g., "Pass the Bar Exam", "Learn React"</p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            autoFocus
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, studyGoal: e.target.value })}
            placeholder="Main academic goal" 
            className="pl-12 h-14 text-lg rounded-xl bg-secondary/50 border-transparent focus:border-primary"
            onKeyDown={(e) => e.key === 'Enter' && formData.studyGoal && nextStep()}
          />
        </div>
        <Button 
          size="lg" 
          disabled={!formData.studyGoal} 
          className="w-full h-14 rounded-xl text-lg" 
          onClick={nextStep}
        >
          Continue
        </Button>
      </div>
    </div>,

    // Step 3: Hours
    <div key="hours" className="flex flex-col space-y-6 w-full max-w-sm mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Daily Study Target</h2>
        <p className="text-muted-foreground">How many hours per day can you dedicate?</p>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full border-4 border-primary/20 bg-secondary/30">
            <span className="text-5xl font-bold text-primary">{formData.dailyHoursTarget}</span>
            <span className="absolute bottom-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">Hours</span>
          </div>
        </div>
        
        <input 
          type="range" 
          min="1" max="16" step="1"
          value={formData.dailyHoursTarget}
          onChange={(e) => setFormData({ ...formData, dailyHoursTarget: parseInt(e.target.value) })}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />

        <Button 
          size="lg" 
          className="w-full h-14 rounded-xl text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" 
          onClick={nextStep}
        >
          <Rocket className="mr-2 w-5 h-5" /> Launch StudySync
        </Button>
      </div>
    </div>
  ];

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-background overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full px-4 z-10"
        >
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
