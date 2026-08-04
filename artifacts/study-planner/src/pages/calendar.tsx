import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/use-local-storage';

type Event = {
  id: string;
  title: string;
  type: 'Exam' | 'Assignment' | 'Deadline' | 'Session';
  date: string; // yyyy-MM-dd
  time?: string;
};

const TYPE_COLORS = {
  Exam: 'bg-destructive text-destructive-foreground border-destructive',
  Assignment: 'bg-orange-500 text-white border-orange-500',
  Deadline: 'bg-accent text-accent-foreground border-accent',
  Session: 'bg-primary text-primary-foreground border-primary'
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [events] = useLocalStorage<Event[]>('study_planner_events', [
    { id: '1', title: 'Calculus Midterm', type: 'Exam', date: format(new Date(), 'yyyy-MM-dd'), time: '14:00' },
    { id: '2', title: 'History Essay Draft', type: 'Assignment', date: format(addMonths(new Date(), 0), 'yyyy-MM-dd'), time: '23:59' },
    { id: '3', title: 'Physics Lab Report', type: 'Deadline', date: format(addMonths(new Date(), 0), 'yyyy-MM-05') },
    { id: '4', title: 'Group Study (React)', type: 'Session', date: format(new Date(), 'yyyy-MM-dd'), time: '18:00' }
  ]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Determine offset for first day of month (0 = Sunday, 1 = Monday...)
  const startDay = startOfMonth(currentDate).getDay();
  const emptyDays = Array.from({ length: startDay });

  const getEventsForDate = (date: Date) => {
    return events.filter(e => e.date === format(date, 'yyyy-MM-dd'));
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">{format(currentDate, 'MMMM yyyy')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentDate(new Date())}>Today</Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <GlassCard className="flex-1 p-4 md:p-6 flex flex-col">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider shrink-0">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4 flex-1 auto-rows-fr">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="rounded-xl border border-transparent opacity-20 bg-secondary/20" />
            ))}
            
            {daysInMonth.map(date => {
              const dayEvents = getEventsForDate(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isTodayDate = isToday(date);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              
              return (
                <div
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={`relative p-2 rounded-xl border flex flex-col cursor-pointer transition-all min-h-[80px]
                    ${!isCurrentMonth ? 'opacity-30' : ''}
                    ${isTodayDate ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}
                    ${isSelected ? 'bg-primary/10 border-primary' : 'bg-card/40'}
                  `}
                >
                  <span className={`text-sm font-semibold mb-1 ${isTodayDate ? 'text-primary' : ''}`}>
                    {format(date, 'd')}
                  </span>
                  
                  <div className="flex-1 flex flex-col gap-1 overflow-y-auto mt-1 no-scrollbar">
                    {dayEvents.slice(0, 3).map(e => (
                      <div key={e.id} className={`text-[10px] md:text-xs truncate px-1.5 py-0.5 rounded-sm ${TYPE_COLORS[e.type]}`}>
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] text-muted-foreground pl-1">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Side Panel for Event Details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full lg:w-80 shrink-0"
          >
            <GlassCard className="h-full border-primary/20 sticky top-0">
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{format(selectedDate, 'EEEE')}</h3>
                  <p className="text-primary text-sm font-medium">{format(selectedDate, 'MMMM do, yyyy')}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                {selectedEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                    <CalendarIcon className="w-12 h-12 mb-3 opacity-20" />
                    <p>No events scheduled.</p>
                  </div>
                ) : (
                  selectedEvents.map(event => (
                    <motion.div 
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border flex flex-col gap-3 bg-card ${event.type === 'Exam' ? 'border-destructive/30' : 'border-border'}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold">{event.title}</h4>
                        <Badge variant="outline" className={`${TYPE_COLORS[event.type]} bg-transparent border`}>
                          {event.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        {event.time && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {event.time}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> View Details
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}

                <Button className="w-full mt-4 bg-secondary text-foreground hover:bg-secondary/80">
                  + Add Event
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
