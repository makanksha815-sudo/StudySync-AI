import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Calendar, CheckSquare, Clock, BarChart2, 
  Target, FileText, Settings, Search, Menu, X, Command
} from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/planner', label: 'Study Planner', icon: Target },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/pomodoro', label: 'Pomodoro', icon: Clock },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/notes', label: 'Notes', icon: FileText },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { profile } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cmd+K shortcut and ? shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdKOpen(false);
        setIsShortcutsOpen(false);
      }
      if (e.key === '?' && e.shiftKey && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if we are on landing page
  if (location === '/') {
    return <>{children}</>;
  }

  const filteredNavItems = navItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-sidebar h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">StudySync</span>
        </div>

        <div className="px-4 pb-4">
          <button 
            onClick={() => setIsCmdKOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-background border border-border text-sm text-muted-foreground hover:border-primary/50 transition-colors"
          >
            <span className="flex items-center gap-2"><Search className="w-4 h-4" /> Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium font-mono text-muted-foreground">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            return (
              <Link key={item.path} href={item.path}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group relative overflow-hidden",
                  isActive 
                    ? "text-primary-foreground bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-primary/10 rounded-lg -z-10"
                    />
                  )}
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/settings">
            <div className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer",
              location === '/settings' 
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}>
              <Settings className="w-5 h-5" />
              Settings
            </div>
          </Link>
        </div>
      </aside>

      {/* Mobile Topbar & Nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
            S
          </div>
          <span className="font-bold text-lg">StudySync</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -mr-2 text-foreground">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-16 bg-background z-20 flex flex-col p-4 overflow-y-auto"
          >
            <nav className="flex-1 space-y-2">
              {[...navItems, { path: '/settings', label: 'Settings', icon: Settings }].map((item) => {
                const isActive = location === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <div 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-xl text-base font-medium transition-all",
                        isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-[100dvh] pt-16 md:pt-0 overflow-y-auto overflow-x-hidden">
        <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Cmd+K Palette */}
      <AnimatePresence>
        {isCmdKOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsCmdKOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Type a command or search..." 
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                {filteredNavItems.length > 0 ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</div>
                    {filteredNavItems.map(item => (
                      <div 
                        key={item.path}
                        onClick={() => {
                          setLocation(item.path);
                          setIsCmdKOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary cursor-pointer text-sm"
                      >
                        <item.icon className="w-4 h-4 text-muted-foreground" />
                        <span>Go to {item.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shortcuts Hint Panel */}
      <AnimatePresence>
        {isShortcutsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsShortcutsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-card border border-border rounded-xl shadow-2xl z-50 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Keyboard Shortcuts</h3>
                <button onClick={() => setIsShortcutsOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'Cmd/Ctrl + K', desc: 'Command Palette / Navigation' },
                  { key: '?', desc: 'Show Keyboard Shortcuts' },
                  { key: 'Esc', desc: 'Close Modals' },
                ].map((sc, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-border pb-2 last:border-0 last:pb-0">
                    <span className="text-sm text-muted-foreground">{sc.desc}</span>
                    <kbd className="bg-secondary px-2 py-1 rounded text-xs font-mono font-bold text-foreground">{sc.key}</kbd>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
