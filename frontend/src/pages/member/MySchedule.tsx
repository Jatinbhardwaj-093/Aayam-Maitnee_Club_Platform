import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Clock, MapPin, Check, X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
}

export default function MySchedule() {
  const { activeUser } = useOutletContext<{ activeUser: any }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchEvents = async () => {
      if (!activeUser?.email) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001"}/api/my-schedule?email=${activeUser.email}`);
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map((e: any) => ({
            id: e.id,
            participation_id: e.participation_id,
            title: e.title,
            date: e.date,
            time: e.timeRange || e.time,
            location: e.venue || e.location,
            status: e.status,
            roleRequired: e.category,
            directorNotes: e.description
          }));
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
      const earliest = [...accepted].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      const d = new Date(earliest.date);
      if (!isNaN(d.getTime())) setCalendarDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }
  }, [events.length]);

  const handleStatusChange = async (id: string, newStatus: "Accepted" | "Declined") => {
    const event = events.find(e => e.id === id);
    if (!event) return;
    
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001"}/api/my-schedule/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participation_id: event.participation_id, status: newStatus })
      });
    } catch(e) {}
  };

  const acceptedEvents = events.filter(e => e.status === "Accepted");

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

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Calendar View for Accepted Events */}
      <section className="bg-white border border-[#e6e2dd] rounded-[8px] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#635f41]" />
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif">Accepted Schedule</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-semibold text-[#466272] w-[140px] text-right">
              {monthNames[displayMonth]} {displayYear}
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0 border-[#e6e2dd] text-[#466272] hover:bg-[#f7f3ee]">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0 border-[#e6e2dd] text-[#466272] hover:bg-[#f7f3ee]">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 border-t border-l border-[#e6e2dd]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-[#635f41] py-2 bg-[#f7f3ee]/50 border-r border-b border-[#e6e2dd]">{d}</div>
          ))}
          {calendarEmptyDays.map((_, i) => <div key={`empty-${i}`} className="p-2 border-r border-b border-[#e6e2dd] bg-[#fcfbfa]" />)}
          {calendarDays.map(day => {
            const dayEvents = acceptedEvents.filter(e => {
              const d = new Date(e.date);
              return !isNaN(d.getTime()) && d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
            });
            
            return (
              <div key={day.toISOString()} className="min-h-[100px] p-1 border-r border-b border-[#e6e2dd] bg-white relative">
                <div className="text-right text-[#635f41] text-xs font-medium mb-1 pr-1">{day.getDate()}</div>
                <div className="space-y-1">
                  {dayEvents.map(e => (
                    <div key={e.id} className="relative group">
                      <div className="bg-[#8CC0EB]/20 hover:bg-[#8CC0EB]/40 text-[#466272] text-[10px] px-1.5 py-1 rounded truncate cursor-help border border-[#8CC0EB]/30 transition-colors">
                        {e.time} - {e.title}
                      </div>
                      {/* Hover Popover */}
                      <div className="absolute z-50 hidden group-hover:block bottom-full mb-1 left-1/2 -translate-x-1/2 w-[260px] bg-white border border-[#e6e2dd] rounded-[8px] p-4 shadow-xl pointer-events-none">
                        <div className="font-semibold text-[#635f41] mb-1 truncate">{e.title}</div>
                        <div className="text-xs text-[#466272] mb-3 truncate">{e.roleRequired}</div>
                        <div className="flex items-center gap-1.5 text-xs text-[#466272] mb-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#8CC0EB]" /> {e.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#466272] mb-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#8CC0EB]" /> {e.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#466272]">
                          <MapPin className="w-3.5 h-3.5 text-[#8CC0EB]" /> <span className="truncate">{e.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Main Schedule Panel */}
      <section className="bg-white border border-[#e6e2dd] rounded-[8px] overflow-hidden shadow-sm">
        <div className="px-[24px] py-[20px] border-b border-[#e6e2dd] bg-[#f7f3ee]/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif">My Production Schedule</h3>
            <p className="text-xs text-[#466272]/70">Confirm your attendance for upcoming acts, rehearsals, and scenes</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e6e2dd] hover:bg-transparent">
                <TableHead className="text-[#635f41] font-semibold w-[250px] md:w-[30%]">Event Detail</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Date &amp; Time</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Location</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Attendance State</TableHead>
                <TableHead className="text-[#635f41] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...events]
                .sort((a, b) => {
                  if (a.status === "Pending" && b.status !== "Pending") return -1;
                  if (a.status !== "Pending" && b.status === "Pending") return 1;
                  return 0;
                })
                .map((event) => (
                <TableRow key={event.id} className="border-b border-[#e6e2dd]/60 hover:bg-[#fdf9f4]/45">
                  <TableCell className="font-medium text-[#635f41] py-[16px] w-[250px] md:w-[30%] align-top">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[14px] whitespace-normal break-words">{event.title}</span>
                      <span className="text-xs text-[#466272]/60 mt-0.5">{event.roleRequired}</span>
                      <div className="text-[12px] text-[#466272]/70 mt-2 bg-[#f7f3ee]/40 border-l-2 border-[#8CC0EB] pl-2 italic whitespace-normal break-words">
                        <strong>Director Notes:</strong> "{event.directorNotes}"
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-[16px]">
                    <div className="flex flex-col text-xs text-[#466272]">
                      <span className="font-medium">{event.date}</span>
                      <span className="text-[#466272]/70 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-[#8CC0EB]" /> {event.time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-[16px]">
                    <div className="flex items-center gap-1.5 text-xs text-[#466272]">
                      <MapPin className="w-3.5 h-3.5 text-[#8CC0EB]" />
                      <span>{event.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-[16px]">
                    <Badge className={`rounded-[4px] ${
                      event.status === "Accepted" ? "bg-emerald-600/10 text-emerald-700 border-emerald-600/20" :
                      event.status === "Declined" ? "bg-red-600/10 text-red-700 border-red-600/20" :
                      "bg-amber-600/10 text-amber-700 border-amber-600/20"
                    }`}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-[16px] text-right">
                    {event.status === "Pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-[32px] w-[32px] p-0 rounded-[4px]"
                          onClick={() => handleStatusChange(event.id, "Accepted")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-[32px] w-[32px] p-0 rounded-[4px]"
                          onClick={() => handleStatusChange(event.id, "Declined")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-[#466272]/50 italic">Decision Made</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
