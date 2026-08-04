import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Calendar, Clock, BookOpen, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/app-context';

type Entry = {
  id: string;
  subject: string;
  type: 'Exam' | 'Assignment' | 'Reading';
  date: string;
};

export default function Planner() {
  const { profile } = useAppContext();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [newType, setNewType] = useState<Entry['type']>('Exam');
  const [newDate, setNewDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);

  const addEntry = () => {
    if (!newSubject || !newDate) return;
    setEntries([
      ...entries,
      { id: Math.random().toString(), subject: newSubject, type: newType, date: newDate }
    ]);
    setNewSubject('');
    setNewDate('');
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleGenerate = () => {
    if (entries.length === 0) return;
    setIsGenerating(true);
    // Simulate AI delay
    setTimeout(() => {
      setIsGenerating(false);
      setPlanGenerated(true);
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Study Planner</h1>
        <p className="text-muted-foreground mt-2">Enter your upcoming deadlines and exams, and let AI build your optimal study schedule.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" /> Add Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Subject / Topic</label>
                <Input 
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Calculus III" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Type</label>
                <div className="flex gap-2">
                  {(['Exam', 'Assignment', 'Reading'] as const).map(t => (
                    <Badge 
                      key={t}
                      variant={newType === t ? 'default' : 'outline'}
                      className="cursor-pointer px-3 py-1"
                      onClick={() => setNewType(t)}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date / Deadline</label>
                <Input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <Button onClick={addEntry} className="w-full" disabled={!newSubject || !newDate}>
                <Plus className="w-4 h-4 mr-2" /> Add to List
              </Button>
            </CardContent>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Available Daily Hours</span>
                <span className="font-bold">{profile.dailyHoursTarget}h</span>
              </div>
              <Button 
                onClick={handleGenerate} 
                disabled={entries.length === 0 || isGenerating}
                className="w-full h-12 text-md shadow-lg shadow-primary/25 relative overflow-hidden group"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sparkles className="w-5 h-5 mr-2 relative z-10" /> 
                    <span className="relative z-10">Generate AI Plan</span>
                  </>
                )}
              </Button>
            </CardContent>
          </GlassCard>
        </div>

        {/* Display Section */}
        <div className="lg:col-span-2 space-y-6">
          {!planGenerated && !isGenerating && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-muted-foreground" /> Pending Items ({entries.length})
              </h3>
              <AnimatePresence>
                {entries.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-8 border border-dashed border-border rounded-xl text-muted-foreground">
                    Add some exams or assignments to get started.
                  </motion.div>
                ) : (
                  entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50"
                    >
                      <div>
                        <div className="font-semibold">{entry.subject}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Calendar className="w-3 h-3" /> {entry.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{entry.type}</Badge>
                        <button onClick={() => removeEntry(entry.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          )}

          {isGenerating && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-6">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
              />
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                className="text-lg font-medium text-primary"
              >
                Synthesizing optimal study paths...
              </motion.p>
            </div>
          )}

          {planGenerated && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" /> Your AI Study Plan
                </h3>
                <Button variant="outline" size="sm" onClick={() => setPlanGenerated(false)}>Reset</Button>
              </div>

              <div className="space-y-4">
                {entries.map((entry, idx) => {
                  const urgency = idx === 0 ? 'Urgent' : idx === 1 ? 'High' : 'Normal';
                  const colorClass = urgency === 'Urgent' ? 'bg-destructive/10 border-destructive/30 text-destructive' :
                                     urgency === 'High' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' :
                                     'bg-primary/10 border-primary/30 text-primary';
                  
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <GlassCard className={`border-l-4 ${urgency === 'Urgent' ? 'border-l-destructive' : urgency === 'High' ? 'border-l-orange-500' : 'border-l-primary'}`}>
                        <CardContent className="p-5 flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${colorClass}`}>
                            <Clock className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-lg">{entry.subject} <span className="text-sm font-normal text-muted-foreground ml-2">({entry.type})</span></h4>
                              <Badge variant="outline" className={colorClass}>{urgency}</Badge>
                            </div>
                            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                              {urgency === 'Urgent' 
                                ? `Focus entirely on ${entry.subject}. Break it down into 4 pomodoro sessions today. Prioritize past papers.` 
                                : `Allocate 1.5 hours to review core concepts of ${entry.subject}. Read chapter 3 and summarize.`}
                            </p>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" variant="secondary" className="h-8 text-xs">
                                <Plus className="w-3 h-3 mr-1" /> Add to Tasks
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </div>

              <Button variant="outline" className="w-full h-12 border-primary/30 text-primary hover:bg-primary/10">
                <Sparkles className="w-4 h-4 mr-2" /> Suggest Spaced Revision Schedule
              </Button>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
