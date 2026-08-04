import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Pin, MoreVertical, Sparkles, X, BrainCircuit, MessageSquare, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';

type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: number;
};

const COLORS = [
  'bg-card',
  'bg-red-500/10 border-red-500/30',
  'bg-blue-500/10 border-blue-500/30',
  'bg-emerald-500/10 border-emerald-500/30',
  'bg-amber-500/10 border-amber-500/30',
  'bg-purple-500/10 border-purple-500/30',
];

export default function Notes() {
  const [notes, setNotes] = useLocalStorage<Note[]>('study_planner_notes', [
    { id: '1', title: 'React Hooks Summary', content: 'useState: state management\nuseEffect: side effects\nuseContext: global state\nuseMemo: memoize values', color: 'bg-blue-500/10 border-blue-500/30', pinned: true, createdAt: Date.now() },
    { id: '2', title: 'Physics Formulas', content: 'F = ma\nE = mc^2\nv = u + at', color: 'bg-emerald-500/10 border-emerald-500/30', pinned: false, createdAt: Date.now() - 100000 },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [aiOutput, setAiOutput] = useState<{ type: string, content: string } | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (a.pinned === b.pinned) return b.createdAt - a.createdAt;
        return a.pinned ? -1 : 1;
      });
  }, [notes, searchQuery]);

  const createNote = () => {
    const newNote: Note = {
      id: Math.random().toString(),
      title: 'New Note',
      content: '',
      color: COLORS[0],
      pinned: false,
      createdAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
  };

  const updateActiveNote = (updates: Partial<Note>) => {
    if (!activeNote) return;
    const updated = { ...activeNote, ...updates };
    setActiveNote(updated);
    setNotes(notes.map(n => n.id === updated.id ? updated : n));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (activeNote?.id === id) setActiveNote(null);
  };

  const handleAiAction = (type: string) => {
    if (!activeNote || !activeNote.content) return;
    setIsAiLoading(true);
    setAiOutput(null);
    
    setTimeout(() => {
      let content = '';
      if (type === 'Summarize') content = 'This note discusses key concepts concisely. The main takeaway is ' + activeNote.content.split('\n')[0] + '.';
      if (type === 'Explain') content = 'Let me break this down for you. The concepts mentioned here refer to fundamental principles in this domain. For instance, understanding these basics allows you to build more complex mental models later.';
      if (type === 'Quiz') content = 'Question 1: What is the primary function of the first concept mentioned?\nA) Storage\nB) Computation\nC) Logic\n\nQuestion 2: How does it relate to the secondary concept?';
      
      setAiOutput({ type, content });
      setIsAiLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Notes</h1>
          <p className="text-muted-foreground mt-1">Capture ideas, summarize with AI.</p>
        </div>
        <Button onClick={createNote} className="shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5 mr-2" /> New Note
        </Button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        
        {/* Sidebar / List */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search notes..." 
              className="pl-9 bg-card"
            />
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => { setActiveNote(note); setAiOutput(null); }}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${note.color} ${activeNote?.id === note.id ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:border-primary/50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold truncate pr-4">{note.title || 'Untitled'}</h4>
                    {note.pinned && <Pin className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{note.content || 'No content'}</p>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredNotes.length === 0 && (
              <div className="text-center p-8 text-muted-foreground border border-dashed rounded-xl">
                No notes found.
              </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="w-2/3 flex flex-col">
          {activeNote ? (
            <GlassCard className={`flex-1 flex flex-col ${activeNote.color}`}>
              <div className="p-4 border-b border-border/50 flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => updateActiveNote({ pinned: !activeNote.pinned })}
                    className={activeNote.pinned ? 'text-primary bg-primary/10' : 'text-muted-foreground'}
                  >
                    <Pin className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
                    {COLORS.map(c => (
                      <div 
                        key={c}
                        onClick={() => updateActiveNote({ color: c })}
                        className={`w-6 h-6 rounded-md cursor-pointer ${c} border-2 ${activeNote.color === c ? 'border-primary' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteNote(activeNote.id)} className="text-destructive hover:bg-destructive/10">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 flex-1 flex flex-col min-h-0 overflow-y-auto">
                <input
                  value={activeNote.title}
                  onChange={e => updateActiveNote({ title: e.target.value })}
                  placeholder="Note Title"
                  className="text-2xl font-bold bg-transparent border-none outline-none mb-4 placeholder:text-muted-foreground/50"
                />
                <textarea
                  value={activeNote.content}
                  onChange={e => updateActiveNote({ content: e.target.value })}
                  placeholder="Start typing..."
                  className="flex-1 w-full bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 text-base leading-relaxed"
                />
              </div>

              {/* AI Tools */}
              <div className="p-4 border-t border-border/50 bg-card/50 shrink-0">
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={() => handleAiAction('Summarize')} disabled={!activeNote.content || isAiLoading} className="text-primary border-primary/30 hover:bg-primary/10">
                    <Sparkles className="w-4 h-4 mr-2" /> Summarize
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAiAction('Explain')} disabled={!activeNote.content || isAiLoading} className="text-accent border-accent/30 hover:bg-accent/10">
                    <BrainCircuit className="w-4 h-4 mr-2" /> Explain Topic
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAiAction('Quiz')} disabled={!activeNote.content || isAiLoading} className="text-blue-500 border-blue-500/30 hover:bg-blue-500/10">
                    <BookOpen className="w-4 h-4 mr-2" /> Quiz Me
                  </Button>
                </div>

                <AnimatePresence>
                  {isAiLoading && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-sm text-primary flex items-center gap-2 py-2">
                      <Sparkles className="w-4 h-4 animate-pulse" /> AI is thinking...
                    </motion.div>
                  )}
                  {aiOutput && !isAiLoading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="bg-secondary/50 rounded-xl p-4 border border-primary/20 relative"
                    >
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 w-6 h-6" onClick={() => setAiOutput(null)}>
                        <X className="w-3 h-3" />
                      </Button>
                      <h5 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> AI {aiOutput.type}
                      </h5>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{aiOutput.content}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassCard>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border rounded-xl text-muted-foreground p-8 text-center">
              <BookOpen className="w-16 h-16 mb-4 text-muted-foreground/30" />
              <p className="text-lg font-medium text-foreground">No note selected</p>
              <p>Select a note from the list or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
