import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
// import { fetchAgendaEvents, updateAgendaEvent } from '../services/agendaService'; // REMOVED
import AgendaModal from '../components/AgendaModal';

// --- Mock Data and Functions --- >
const mockEvents = [
  {
    id: '1',
    title: 'Reunião de Alinhamento',
    schedule_time: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    duration: 1,
    category: 'Ritual',
  },
  {
    id: '2',
    title: 'Treino de Peito e Tríceps',
    schedule_time: new Date().toISOString(),
    duration: 1.5,
    category: 'Treino',
  },
    {
    id: '3',
    title: 'Almoço com a Equipe',
    schedule_time: new Date(new Date().setHours(12, 30, 0, 0)).toISOString(),
    duration: 1,
    category: 'Refeição',
  },
];

const fetchAgendaEvents = async (start: Date, end: Date) => {
  console.log(`Fetching mock events between ${start} and ${end}`);
  return new Promise(resolve => setTimeout(() => resolve(mockEvents), 500));
};

const updateAgendaEvent = async (eventId: string, updates: any) => {
  console.log(`Updating event ${eventId} with`, updates);
  return new Promise(resolve => setTimeout(() => resolve({ ...mockEvents.find(e => e.id === eventId), ...updates }), 200));
};
// --- End Mock Data and Functions ---

const HOURS = Array.from({ length: 19 }, (_, i) => i + 5); // 05:00 to 23:00
const DAYS_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const HOUR_HEIGHT = 80;

// Utility to get the start of the week (Monday)
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
};

// Utility to get all days of a week starting from a date
const getWeekDays = (startDate: Date) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });
};

// Utilidade para grade mensal (5-6 semanas)
const getMonthViewDays = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  new Date(year, month + 1, 0).getDate();
  const firstWeekday = firstDay.getDay(); // 0 domingo

  // Queremos começar na segunda-feira (1)
  const startOffset = firstWeekday === 0 ? -6 : 1 - firstWeekday;

  const totalCells = 42; // 6 weeks to cobrir qualquer mês
  return Array.from({ length: totalCells }, (_, i) => {
    const cell = new Date(year, month, 1 + startOffset + i);
    return {
      date: cell,
      inMonth: cell.getMonth() === month,
    };
  });
};

const Agenda = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [activeResize, setActiveResize] = useState<{ id: string; startY: number; baseDuration: number } | null>(null);
  const [resizePreview, setResizePreview] = useState<{ id: string; duration: number } | null>(null);

  const weekStart = useMemo(() => getStartOfWeek(currentDate), [currentDate]);
  const monthDays = useMemo(() => getMonthViewDays(currentDate), [currentDate]);

  const openSlot = (dayIdx: number, hour: number) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIdx);
    const isoDate = date.toISOString().split('T')[0];
    const formattedTime = `${String(hour).padStart(2, '0')}:00`;

    setSelectedSlot({ date: isoDate, time: formattedTime });
    setIsModalOpen(true);
  };

  const shiftView = (delta: number) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      if (viewMode === 'day') {
        d.setDate(d.getDate() + delta);
      } else if (viewMode === 'week') {
        d.setDate(d.getDate() + delta * 7);
      } else {
        d.setMonth(d.getMonth() + delta);
      }
      return d;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    fetchAgenda();
    const interval = setInterval(() => setNow(new Date()), 60000); // Update red line every minute
    return () => clearInterval(interval);
  }, [currentDate, viewMode]);

  const fetchAgenda = async () => {
     try {
        setLoading(true);
        let start = new Date(currentDate);
        let end = new Date(currentDate);

        if (viewMode === 'week') {
          start = new Date(weekStart);
          end = new Date(weekStart);
          end.setDate(end.getDate() + 6);
        } else if (viewMode === 'day') {
          // already currentDate
        } else {
          start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        }

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        const data:any = await fetchAgendaEvents(start, end);

        // Process data for the grid
        const processed = data.map((item: any) => {
           const startDate = new Date(item.schedule_time);
           const duration = item.duration ? Number(item.duration) : 1;
           const endDate = new Date(startDate.getTime() + duration * 60 * 60 * 1000);

           // Calculate dayIdx (0-6 starting from Monday)
           let dayIdx = startDate.getDay() - 1;
           if (dayIdx < 0) dayIdx = 6; // Sunday

           const startHour = startDate.getHours() + startDate.getMinutes() / 60;

           return {
              ...item,
              dayIdx,
              startHour,
              duration,
              endDate,
              formattedTime: `${startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
              category: item.category || 'Geral'
           };
        });

        setAppointments(processed);
     } catch (err) {
        console.error("Error fetching agenda:", err);
     } finally {
        setLoading(false);
     }
  };

  const weekDays = useMemo(() => {
    if (viewMode === 'day') return [currentDate];
    return getWeekDays(weekStart);
  }, [viewMode, currentDate, weekStart]);

  const monthYearLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const dayLabel = currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'short' });

  const redLineVisible = viewMode !== 'month' && ((viewMode === 'day' && now.toDateString() === currentDate.toDateString()) || (viewMode === 'week' && now >= weekDays[0] && now <= weekDays[6]));
  const redLineTop = (now.getHours() - HOURS[0] + now.getMinutes() / 60) * HOUR_HEIGHT;

  const eventsByDate = useMemo(() => {
    const map = new Map<string, any[]>();
    appointments.forEach(app => {
      const key = new Date(app.schedule_time).toDateString();
      const items = map.get(key) || [];
      items.push(app);
      map.set(key, items);
    });
    return map;
  }, [appointments]);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetDate: Date) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    if (!eventId) return;

    const targetRect = e.currentTarget.getBoundingClientRect();
    const yInside = e.clientY - targetRect.top;
    const hourPosition = yInside / HOUR_HEIGHT;
    const hour = Math.max(HOURS[0], Math.min(HOURS[HOURS.length - 1], Math.floor(hourPosition) + HOURS[0]));
    const minute = Math.round(((hourPosition + HOURS[0] - hour) * 60) / 15) * 15;

    const newDate = new Date(targetDate);
    newDate.setHours(hour, minute, 0, 0);

    const result = await updateAgendaEvent(eventId, { schedule_time: newDate.toISOString() });
    if (!result) {
      console.error('Error moving appointment');
      return;
    }
    fetchAgenda();
  };

  const startResize = (app: any, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveResize({ id: app.id, startY: e.clientY, baseDuration: app.duration || 1 });
    setResizePreview({ id: app.id, duration: app.duration || 1 });
  };

  useEffect(() => {
    if (!activeResize) return;

    const onMove = (e: MouseEvent) => {
      const dy = e.clientY - activeResize.startY;
      const deltaHours = dy / HOUR_HEIGHT;
      const newDuration = Math.max(0.5, Math.round((activeResize.baseDuration + deltaHours) * 2) / 2);
      setResizePreview({ id: activeResize.id, duration: newDuration });
    };

    const onUp = async () => {
      if (activeResize && resizePreview) {
        await updateAgendaEvent(activeResize.id, { duration: resizePreview.duration });
        fetchAgenda();
      }
      setActiveResize(null);
      setResizePreview(null);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [activeResize, resizePreview]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Ritual': return 'bg-caverna-accent/20 border-caverna-accent text-caverna-accent';
      case 'Treino': return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'Refeição': return 'bg-green-500/20 border-green-500 text-green-400';
      default: return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-2 text-sm font-medium"
          >
            <ChevronLeft size={16} />
            Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <CalendarIcon className="text-caverna-accent" size={28} />
            Minha Agenda
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-sm font-bold border border-white/5 transition-all shadow-lg active:scale-95"
          >
            Hoje
          </button>

          <div className="bg-zinc-900/80 rounded-xl p-1 flex items-center gap-1">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${viewMode === mode ? 'bg-caverna-accent text-zinc-900' : 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/10'}`}
              >
                {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>

          <div className="bg-caverna-card border border-white/5 rounded-2xl p-1 flex items-center shadow-lg">
            <button 
              onClick={() => shiftView(-1)}
              className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all outline-none"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 font-bold text-sm text-white capitalize">
              {viewMode === 'month' ? monthYearLabel : viewMode === 'day' ? dayLabel : monthYearLabel}
            </span>
            <button 
              onClick={() => shiftView(1)}
              className="p-2 hover:bg-white/5 rounded-xl text-zinc-400 hover:text-white transition-all outline-none"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-caverna-accent hover:bg-caverna-accent-light text-zinc-900 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-caverna-accent/20"
          >
            <Plus size={20} />
            <span>Novo</span>
          </button>
        </div>
      </div>

      <AgendaModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedSlot(null); }} 
        onSuccess={() => { fetchAgenda(); setSelectedSlot(null); }} 
        initialDate={selectedSlot?.date}
        initialTime={selectedSlot?.time}
      />

      {/* Calendar Grid Container */}
      {viewMode === 'month' ? (
        <div className="flex-1 bg-caverna-card/50 backdrop-blur-xl rounded-[32px] border border-white/5 overflow-hidden flex flex-col shadow-2xl">
          <div className="grid grid-cols-7 border-b border-white/10 sticky top-0 bg-caverna-card z-30 shadow-md">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
              <div key={day} className="p-4 text-center border-r border-white/5 last:border-0">
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{day}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="grid grid-cols-7 min-h-full">
              {monthDays.map((day, idx) => {
                const isToday = day.date.toDateString() === new Date().toDateString();
                const dayEvents = eventsByDate.get(day.date.toDateString()) || [];
                return (
                  <div
                    key={idx}
                    className={`min-h-[120px] border-r border-b border-white/5 p-2 ${day.inMonth ? 'bg-transparent' : 'bg-zinc-900/30'} ${isToday ? 'bg-caverna-accent/5' : ''}`}
                    onClick={() => {
                      if (day.inMonth) {
                        setSelectedSlot({ date: day.date.toISOString().split('T')[0], time: '08:00' });
                        setIsModalOpen(true);
                      }
                    }}
                  >
                    <div className={`text-sm font-bold mb-1 ${day.inMonth ? (isToday ? 'text-caverna-accent' : 'text-white') : 'text-zinc-600'}`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div
                          key={i}
                          className={`text-[10px] p-1 rounded truncate ${getCategoryColor(event.category)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsModalOpen(true);
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-zinc-500">+{dayEvents.length - 3} mais</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-caverna-card/50 backdrop-blur-xl rounded-[32px] border border-white/5 overflow-hidden flex flex-col shadow-2xl">

          {/* Days Header (Sticky) */}
          <div className="grid grid-cols-[80px_1fr] border-b border-white/10 sticky top-0 bg-caverna-card z-30 shadow-md">
            <div className="border-r border-white/10 bg-zinc-900/50 flex items-center justify-center">
              <Clock size={16} className="text-zinc-500" />
            </div>
            <div className={`grid ${viewMode === 'day' ? 'grid-cols-1' : 'grid-cols-7'}`}>
              {weekDays.map((date, idx) => {
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <div key={idx} className={`p-4 text-center border-r border-white/5 last:border-0 ${isToday ? 'bg-caverna-accent/5' : ''}`}>
                    <span className={`block text-[10px] uppercase font-bold tracking-widest mb-1 ${isToday ? 'text-caverna-accent' : 'text-zinc-500'}`}>
                      {viewMode === 'day' ? date.toLocaleDateString('pt-BR', { weekday: 'long' }) : DAYS_LABELS[idx]}
                    </span>
                    <div className={`w-10 h-10 flex items-center justify-center mx-auto rounded-full text-xl font-bold transition-colors ${
                      isToday ? 'bg-caverna-accent text-zinc-900 shadow-lg shadow-caverna-accent/20' : 'text-white'
                    }`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-[500px]">
            <div className={`grid ${viewMode === 'day' ? 'grid-cols-[80px_1fr]' : 'grid-cols-[80px_1fr]'} min-h-full`}>

              {/* Time Labels (Sticky Column) */}
              <div className="border-r border-white/10 bg-zinc-900/20 sticky left-0 z-20 backdrop-blur-md">
                {HOURS.map(hour => (
                  <div key={hour} className="h-20 border-b border-white/5 flex items-start justify-center pt-2 relative">
                    <span className="text-[10px] font-bold text-zinc-600">{hour}:00</span>
                  </div>
                ))}
              </div>

              {/* Grid Columns for Days */}
              <div className={`grid ${viewMode === 'day' ? 'grid-cols-1' : 'grid-cols-7'} relative`}>

                {/* Red Line for Current Time */}
                {redLineVisible && redLineTop >= 0 && redLineTop <= HOURS.length * HOUR_HEIGHT && (
                  <div className="absolute left-0 right-0 z-40 pointer-events-none flex items-center" style={{ top: `${redLineTop}px` }}>
                     <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                     <div className="h-[2px] bg-red-500 flex-1 ml-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                  </div>
                )}

                {/* Vertical Lines */}
                {Array.from({ length: viewMode === 'day' ? 0 : 6 }).map((_, idx) => (
                  <div key={idx} className="absolute h-full border-r border-white/5" style={{ left: `${(idx + 1) * (100 / (viewMode === 'day' ? 1 : 7))}%` }} />
                ))}

                {/* Day Columns */}
                {weekDays.map((date, dayIdx) => (
                  <div
                    key={dayIdx}
                    className="relative h-full"
                    onDrop={(e) => handleDrop(e, date)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                     {/* Horizontal Hour Lines (background + click targets) */}
                     {HOURS.map(hour => (
                       <div key={hour} className="h-20 border-b border-white/5 w-full relative">
                         <button
                           type="button"
                           onClick={() => openSlot(dayIdx, hour)}
                           className="absolute inset-0 w-full h-full opacity-0 hover:bg-white/10 focus-visible:outline-none"
                           aria-label={`Adicionar compromisso ${hour}:00`}
                         />
                       </div>
                     ))}

                     {/* Appointments in this day */}
                     {loading && dayIdx === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-caverna-card/30">
                          <Loader2 className="animate-spin text-caverna-accent" size={32} />
                        </div>
                     )}

                     {appointments.filter(app => {
                       const appDate = new Date(app.schedule_time);
                       return appDate.toDateString() === date.toDateString();
                     }).map((app, i) => {
                       const startHour = new Date(app.schedule_time).getHours() + new Date(app.schedule_time).getMinutes() / 60;
                       const duration = (resizePreview && resizePreview.id === app.id) ? resizePreview.duration : (app.duration || 1);
                       return (
                         <div
                            key={i}
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData('text/plain', app.id)}
                            className={`absolute left-1 right-1 rounded-xl border-l-4 p-3 shadow-lg z-20 transition-transform hover:scale-[1.02] cursor-pointer ${getCategoryColor(app.category)}`}
                            style={{
                              top: `${(startHour - HOURS[0]) * HOUR_HEIGHT + 4}px`,
                              height: `${duration * HOUR_HEIGHT - 8}px`
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsModalOpen(true);
                            }}
                         >
                           <span className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">{app.category}</span>
                           <h4 className="text-sm font-bold truncate leading-tight">{app.title}</h4>
                           <span className="text-[10px] font-medium opacity-60">{app.formattedTime}</span>
                           <div
                             className="absolute bottom-0 right-0 w-3 h-3 cursor-ns-resize opacity-0 hover:opacity-100 transition-opacity"
                             onMouseDown={(e) => startResize(app, e)}
                           />
                         </div>
                       );
                     })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
