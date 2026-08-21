import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Clock, MapPin, Check, X, Calendar as CalendarIcon, ChevronLeft, ChevronRight, History, BellRing, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Event {
  id: string;
  participation_id?: number;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "Accepted" | "Pending" | "Declined";
  roleRequired: string;
  directorNotes: string;
  rawDate?: Date;
  isPast?: boolean;
}

export default function MySchedule() {
  const { activeUser } = useOutletContext<{ activeUser: any }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date(2026, 7, 1));
  const [scheduleView, setScheduleView] = useState<"upcoming" | "past">("upcoming");

  // Normalized "Today" for drama season reference (August 20, 2026 or current clock)
  const now = new Date();
  const currentSeasonDate = new Date(2026, 7, 20);
  const referenceToday = now.getFullYear() >= 2026 ? new Date(now.getFullYear(), now.getMonth(), now.getDate()) : currentSeasonDate;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!activeUser?.email) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/my-schedule?email=${activeUser.email}`);
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map((e: any) => {
            const parsedDate = new Date(e.date);
            const isInvalidDate = isNaN(parsedDate.getTime());
            const eventDay = isInvalidDate ? new Date() : new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
            const isPast = eventDay.getTime() < referenceToday.getTime();

            return {
              id: String(e.id),
              participation_id: e.participation_id,
              title: e.title,
              date: e.date,
              time: e.timeRange || e.time,
              location: e.venue || e.location,
              status: e.status,
              roleRequired: e.category,
              directorNotes: e.description,
              rawDate: eventDay,
              isPast: isPast
            };
          });
          setEvents(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, [activeUser]);

  useEffect(() => {
    const accepted = events.filter(e => e.status === "Accepted");
    if (accepted.length > 0) {
      const upcomingAccepted = accepted.filter(e => !e.isPast);
      const targetList = upcomingAccepted.length > 0 ? upcomingAccepted : accepted;
      const earliest = [...targetList].sort((a, b) => (a.rawDate?.getTime() || 0) - (b.rawDate?.getTime() || 0))[0];
      if (earliest && earliest.rawDate) {
        setCalendarDate(new Date(earliest.rawDate.getFullYear(), earliest.rawDate.getMonth(), 1));
      }
    }
  }, [events]);

  const handleStatusChange = async (id: string, newStatus: "Accepted" | "Declined") => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/my-schedule/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participation_id: event.participation_id, status: newStatus })
      });
    } catch(e) {}
  };

  const acceptedEvents = events.filter(e => e.status === "Accepted");
  const upcomingEvents = events.filter(e => !e.isPast);
  const pastEvents = events.filter(e => e.isPast);

  // Calendar logic
  const displayMonth = calendarDate.getMonth();
  const displayYear = calendarDate.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const handlePrevMonth = () => setCalendarDate(new Date(displayYear, displayMonth - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(displayYear, displayMonth + 1, 1));

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
  const calendarEmptyDays = Array(firstDayOfMonth).fill(null);
  const calendarDays = Array.from({length: daysInMonth}, (_, i) => new Date(displayYear, displayMonth, i + 1));

  const currentDisplayList = scheduleView === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="space-y-10 font-sans text-[#2C2A28] max-w-7xl mx-auto w-full pb-20">
      
      {/* Calendar View for Accepted Events */}
      <section className="bg-[#F7F5F0] border border-[#D5C9BE]/70 rounded-[2rem] p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E85F57]/10 flex items-center justify-center text-[#E85F57]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-[#2C2A28] font-serif">Accepted Call Calendar</h3>
              <p className="text-xs text-[#666361]">Confirmed rehearsals, stage sessions, and live showcases</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-serif font-bold text-lg text-[#2C2A28]">
              {monthNames[displayMonth]} {displayYear}
            </div>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-9 w-9 p-0 border-[#D5C9BE]/70 text-[#666361] hover:bg-[#E7DDD3]/50 rounded-lg">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-9 w-9 p-0 border-[#D5C9BE]/70 text-[#666361] hover:bg-[#E7DDD3]/50 rounded-lg">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 border-t border-l border-[#D5C9BE]/40 rounded-2xl overflow-hidden shadow-inner">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-mono font-bold uppercase tracking-wider text-[#666361] py-2.5 bg-[#E7DDD3]/40 border-r border-b border-[#D5C9BE]/40">{d}</div>
          ))}
          {calendarEmptyDays.map((_, i) => <div key={`empty-${i}`} className="p-2 border-r border-b border-[#D5C9BE]/40 bg-[#E7DDD3]/10 min-h-[105px]" />)}
          {calendarDays.map(day => {
            const dayEvents = acceptedEvents.filter(e => {
              const d = new Date(e.date);
              return !isNaN(d.getTime()) && d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
            });
            
            const isToday = day.getFullYear() === referenceToday.getFullYear() && day.getMonth() === referenceToday.getMonth() && day.getDate() === referenceToday.getDate();
            
            return (
              <div key={day.toISOString()} className={`min-h-[105px] p-2 border-r border-b border-[#D5C9BE]/40 relative transition-colors ${isToday ? 'bg-[#E85F57]/5' : 'bg-[#F7F5F0]'}`}>
                <div className="flex items-center justify-between mb-1.5">
                  {isToday && (
                    <span className="text-[9px] font-mono font-bold text-[#E85F57] uppercase tracking-wider bg-[#E85F57]/15 px-1.5 py-0.5 rounded">Today</span>
                  )}
                  <span className={`text-xs font-mono font-bold ml-auto ${isToday ? 'text-[#E85F57]' : 'text-[#666361]'}`}>
                    {day.getDate()}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {dayEvents.map(e => (
                    <div key={e.id} className="relative group">
                      <div className="bg-[#E85F57]/15 hover:bg-[#E85F57]/25 text-[#2C2A28] text-[11px] font-medium px-2 py-1 rounded-md truncate cursor-pointer border border-[#E85F57]/30 transition-all shadow-xs">
                        <span className="font-bold text-[#E85F57]">{e.time.split(' - ')[0]}</span> {e.title}
                      </div>
                      {/* Hover Popover */}
                      <div className="absolute z-50 hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 w-[280px] bg-[#F7F5F0] border border-[#D5C9BE]/70 rounded-2xl p-4 shadow-2xl pointer-events-none">
                        <div className="font-serif font-bold text-base text-[#2C2A28] mb-1 leading-snug">{e.title}</div>
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#E85F57] mb-2">{e.roleRequired}</div>
                        <div className="space-y-1 text-xs text-[#666361]">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#E85F57]" /> <span>{e.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#E85F57]" /> <span>{e.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#E85F57]" /> <span className="truncate">{e.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Schedule Panel with Time Awareness */}
      <section className="bg-[#F7F5F0] border border-[#D5C9BE]/70 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-[#D5C9BE]/70 bg-[#F7F5F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#E85F57] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Callboard Action Center</span>
            </div>
            <h3 className="font-bold text-2xl text-[#2C2A28] font-serif">Production Call Attendance</h3>
            <p className="text-xs text-[#666361] mt-0.5">Confirm attendance for upcoming calls. Past dates are automatically archived.</p>
          </div>

          {/* Time View Switcher */}
          <div className="flex items-center bg-[#E7DDD3]/50 p-1 rounded-full border border-[#D5C9BE]/60 self-start md:self-auto">
            <button
              onClick={() => setScheduleView("upcoming")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                scheduleView === "upcoming"
                  ? "bg-[#2C2A28] text-white shadow-md"
                  : "text-[#666361] hover:text-[#2C2A28]"
              }`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Upcoming Calls ({upcomingEvents.length})</span>
            </button>
            <button
              onClick={() => setScheduleView("past")}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                scheduleView === "past"
                  ? "bg-[#2C2A28] text-white shadow-md"
                  : "text-[#666361] hover:text-[#2C2A28]"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Past History ({pastEvents.length})</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#D5C9BE]/70 bg-[#E7DDD3]/20 hover:bg-transparent">
                <TableHead className="text-[#2C2A28] font-mono text-[10px] font-bold uppercase tracking-wider w-[280px] md:w-[32%] py-4 pl-8">Event & Directorial Details</TableHead>
                <TableHead className="text-[#2C2A28] font-mono text-[10px] font-bold uppercase tracking-wider">Date & Time</TableHead>
                <TableHead className="text-[#2C2A28] font-mono text-[10px] font-bold uppercase tracking-wider">Venue / Location</TableHead>
                <TableHead className="text-[#2C2A28] font-mono text-[10px] font-bold uppercase tracking-wider">Call State</TableHead>
                <TableHead className="text-[#2C2A28] font-mono text-[10px] font-bold uppercase tracking-wider text-right pr-8">
                  {scheduleView === "upcoming" ? "Your Confirmation" : "Record Status"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...currentDisplayList]
                .sort((a, b) => {
                  if (scheduleView === "upcoming") {
                    if (a.status === "Pending" && b.status !== "Pending") return -1;
                    if (a.status !== "Pending" && b.status === "Pending") return 1;
                    return (a.rawDate?.getTime() || 0) - (b.rawDate?.getTime() || 0);
                  } else {
                    return (b.rawDate?.getTime() || 0) - (a.rawDate?.getTime() || 0);
                  }
                })
                .map((event) => (
                <TableRow key={event.id} className="border-b border-[#D5C9BE]/40 hover:bg-[#E7DDD3]/30 transition-colors">
                  <TableCell className="font-medium text-[#2C2A28] py-5 pl-8 w-[280px] md:w-[32%] align-top">
                    <div className="flex flex-col">
                      <span className="font-serif font-bold text-base text-[#2C2A28] leading-snug">{event.title}</span>
                      <span className="text-xs font-mono font-bold text-[#E85F57] uppercase tracking-wider mt-1">{event.roleRequired}</span>
                      {event.directorNotes && (
                        <p className="text-xs text-[#666361] mt-1.5 leading-relaxed">
                          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] mr-1.5">Note:</span>
                          {event.directorNotes}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 align-top">
                    <div className="flex flex-col text-xs text-[#2C2A28]">
                      <span className="font-bold">{event.date}</span>
                      <span className="text-[#666361] flex items-center gap-1.5 mt-1 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-[#E85F57]" /> {event.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 align-top">
                    <div className="flex items-center gap-1.5 text-xs text-[#666361]">
                      <MapPin className="w-3.5 h-3.5 text-[#E85F57] shrink-0" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 align-top">
                    <Badge className={`rounded-md text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 ${
                      event.status === "Accepted" ? "bg-emerald-600/10 text-emerald-700 border border-emerald-600/20" :
                      event.status === "Declined" ? "bg-red-600/10 text-red-700 border border-red-600/20" :
                      event.isPast ? "bg-stone-500/10 text-stone-600 border border-stone-400/20" :
                      "bg-amber-600/10 text-amber-700 border border-amber-600/20"
                    }`}>
                      {event.isPast && event.status === "Pending" ? "Unanswered" : event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-5 align-top text-right pr-8">
                    {event.isPast ? (
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666361]/60">
                        {event.status === "Accepted" ? "Attended / Concluded" : event.status === "Declined" ? "Declined Record" : "Call Expired"}
                      </span>
                    ) : event.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <button
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1.5"
                          onClick={() => handleStatusChange(event.id, "Accepted")}
                        >
                          <Check className="w-4 h-4" /> Accept
                        </button>
                        <button
                          className="border border-red-300 text-red-600 hover:bg-red-50 h-9 px-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
                          onClick={() => handleStatusChange(event.id, "Declined")}
                        >
                          <X className="w-4 h-4" /> Decline
                        </button>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2">
                        <span className="text-xs font-mono text-[#666361] italic">
                          {event.status === "Accepted" ? "Confirmed Attending" : "Declined"}
                        </span>
                        <button
                          onClick={() => handleStatusChange(event.id, event.status === "Accepted" ? "Declined" : "Accepted")}
                          className="text-[10px] font-mono text-[#E85F57] hover:underline uppercase tracking-wider font-bold ml-2"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {currentDisplayList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-[#666361] font-sans">
                    <CalendarIcon className="w-8 h-8 text-[#D5C9BE] mx-auto mb-2 opacity-70" />
                    <p className="text-sm font-medium">
                      {scheduleView === "upcoming" ? "No upcoming calls scheduled at this moment." : "No past schedule history found."}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
