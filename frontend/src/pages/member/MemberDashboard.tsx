// @ts-nocheck
import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, MapPin, Check, X, BookOpen, CheckCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "Accepted" | "Pending" | "Declined";
  roleRequired: string;
  directorNotes: string;
}

const initialEvents: Event[] = [
  {
    id: "e1",
    title: "Macbeth Act III Rehearsal",
    date: "July 04, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Rehearsal Hall B",
    status: "Accepted",
    roleRequired: "Macbeth (Jayesh Dave)",
    directorNotes: "Focus on high tension during the ghost encounter. The lighting contrast will follow your movements.",
  },
  {
    id: "e2",
    title: "Technical Dress Dress Run & Lighting Sync",
    date: "July 07, 2026",
    time: "4:00 PM - 8:00 PM",
    location: "Main Stage",
    status: "Pending",
    roleRequired: "All Cast & Production Crew",
    directorNotes: "Full dress and makeup. Arrive 30 minutes early for microphone calibration and stage blocking check.",
  },
  {
    id: "e3",
    title: "Sponsor Gala Pre-Performance Read",
    date: "July 10, 2026",
    time: "6:00 PM - 7:30 PM",
    location: "Online (Zoom Meeting)",
    status: "Pending",
    roleRequired: "Lead Roles Only",
    directorNotes: "Formal dress code required. Prepare to read through the banquet scenes and mingle with patrons.",
  },
];

export default function MemberDashboard() {
  const { activeUser } = useOutletContext<{ activeUser: any }>();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scriptOpen, setScriptOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const attendanceLog = [
    { date: "June 15, 2026", event: "Macbeth Table Read (Acts I & II)", status: "Present" },
    { date: "June 20, 2026", event: "Blocking & Staging (Act I)", status: "Present" },
    { date: "June 25, 2026", event: "Staging & Choreography (Act II)", status: "Present" },
    { date: "July 01, 2026", event: "Macbeth Table Read (Act III)", status: "Present" },
    { date: "July 04, 2026", event: "Macbeth Act III Rehearsal", status: "Present" },
    { date: "July 07, 2026", event: "Technical Dress Run & Lighting Sync", status: "Present" },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      if (!activeUser?.email) return;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/my-schedule?email=${activeUser.email}`);
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

  useEffect(() => {
    const accepted = events.filter(e => e.status === "Accepted");
    if (accepted.length > 0) {
      const earliest = [...accepted].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
      const d = new Date(earliest.date);
      if (!isNaN(d.getTime())) setCalendarDate(new Date(d.getFullYear(), d.getMonth(), 1));
    }

    const upcomingEvents = accepted
      .map(e => ({ ...e, parsedDate: new Date(e.date + (e.time ? " " + e.time.split('-')[0] : "")) }))
      .filter(e => e.parsedDate.getTime() > Date.now())
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
      
    const targetDate = upcomingEvents.length > 0 ? upcomingEvents[0].parsedDate : new Date("2026-07-12T14:00:00");

    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [events]);

  const pendingCount = events.filter(e => e.status === "Pending").length;
  const displayMonth = calendarDate.getMonth();
  const displayYear = calendarDate.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
  const calendarEmptyDays = Array(firstDayOfMonth).fill(null);
  const calendarDays = Array.from({length: daysInMonth}, (_, i) => new Date(displayYear, displayMonth, i + 1));

  return (
    <div className="space-y-[32px] font-sans text-[#666361]">
      {/* Header and Welcome Banner */}
      <div className="relative border border-[#DDD8CE] rounded-[16px] overflow-hidden p-[24px] md:p-[36px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] shadow-sm">
        {/* Background Production Banner Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/aayam_assets/tamashbin_user_1.jpg"
            alt="Production Banner"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C2A28]/95 via-[#2C2A28]/85 to-[#2C2A28]/50 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 space-y-[12px] flex-1 text-white">
          <div className="space-y-[8px]">
            <Badge className="bg-[#E85F57] text-[#001e2c] font-bold border-0 rounded-[4px] uppercase tracking-wider text-[10px]">Active Production Member</Badge>
            <h2 className="text-[32px] font-bold font-serif text-white tracking-tight">Welcome Back, {activeUser?.name?.split(' ')[0] || "Member"}</h2>
            <p className="text-[14px] text-white/90 font-light">
              You have <span className="font-semibold text-[#E85F57]">{pendingCount} pending rehearsal invites</span> for Tamashbin Kathputliya & Macbeth this week.
            </p>
          </div>
          
          {/* Elegant countdown container */}
          <div className="inline-flex items-center gap-[12px] bg-black/40 border border-white/20 backdrop-blur-md rounded-[8px] px-[16px] py-[8px] text-xs shadow-sm">
            <div className="flex items-center gap-1.5 text-[#E85F57] font-bold uppercase tracking-wider text-[10px]">
              <Clock className="w-3.5 h-3.5 text-[#E85F57]" />
              <span>Next Performance:</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-white font-bold text-sm">
              <span>{String(timeLeft.days).padStart(2, '0')}d</span>
              <span>:</span>
              <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span>:</span>
              <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span>:</span>
              <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap gap-[12px] flex-shrink-0">
          <Button 
            onClick={() => navigate("/ai-rehearsal")}
            className="bg-[#353535] hover:bg-[#4d4a32] text-white font-bold rounded-[8px] py-[10px] px-[20px] gap-2 shadow-sm transition-all active:scale-95 flex items-center"
          >
            <Mic className="w-4 h-4" /> Rehearsal Studio
          </Button>
          <Button 
            onClick={() => setCalendarOpen(true)}
            className="bg-[#E85F57] hover:bg-[#E85F57]/90 text-[#001e2c] font-bold rounded-[8px] py-[10px] px-[20px] gap-2 shadow-sm transition-all active:scale-95"
          >
            <CalendarIcon className="w-4 h-4" /> View Calendar
          </Button>
        </div>
      </div>


      {/* Script & Role Resources */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        {/* Dedicated AI Rehearsal Card */}
        <div className="bg-[#EFE8E1] border border-[#DDD8CE] rounded-[8px] p-[24px] flex flex-col justify-between space-y-[16px]">
          <div className="space-y-[8px]">
            <span className="w-[32px] h-[32px] rounded-full bg-[#353535]/10 flex items-center justify-center text-[#353535]">
              <Mic className="w-4 h-4 text-[#353535]" />
            </span>
            <h4 className="font-bold text-base text-[#353535] font-serif">Script Voice Rehearsals</h4>
            <p className="text-xs text-[#666361]/80 leading-relaxed">
              Practice lines live with interactive audio readers, run memory recall tests, and track your scores.
            </p>
          </div>
          <Button
            onClick={() => navigate("/ai-rehearsal")}
            className="w-full bg-[#353535] hover:bg-[#4d4a32] text-white font-semibold rounded-[8px] py-[10px] shadow-2xs"
          >
            Open Rehearsal Studio →
          </Button>
        </div>

        <div className="bg-[#EFE8E1] border border-[#DDD8CE] rounded-[8px] p-[24px] flex flex-col justify-between space-y-[16px]">
          <div className="space-y-[8px]">
            <span className="w-[32px] h-[32px] rounded-full bg-[#353535]/10 flex items-center justify-center text-[#353535]">
              <BookOpen className="w-4 h-4 text-[#353535]" />
            </span>
            <h4 className="font-bold text-base text-[#353535] font-serif">Macbeth Script</h4>
            <p className="text-xs text-[#666361]/80 leading-relaxed">
              Read and review the modified script passages for the banquet scene and the apparition prophecies.
            </p>
          </div>
          <Dialog open={scriptOpen} onOpenChange={setScriptOpen}>
            <DialogTrigger render={<Button variant="outline" className="w-full border-2 border-[#E85F57] text-[#E85F57] bg-white/50 hover:bg-white font-semibold rounded-[8px] py-[10px]" />}>
              Open Script Material
            </DialogTrigger>
            <DialogContent className="bg-[#E7DDD3] border border-[#DDD8CE] text-[#666361] max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif text-[#353535] text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#E85F57]" /> Macbeth - Act III, Scene 4
                </DialogTitle>
                <DialogDescription className="text-xs text-[#666361]/85">
                  Banquet Scene. Rehearsal Draft (Aayam Matinee Edition)
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4 font-serif text-[14px] leading-relaxed text-black/85 bg-white border border-[#DDD8CE] rounded-[8px] p-6 max-h-[50vh] overflow-y-auto">
                <p className="font-bold text-center border-b border-[#DDD8CE] pb-2 mb-4 text-[#353535]">SCENE IV. The same. Hall in the palace.</p>
                <p className="italic text-gray-500 mb-2">A banquet prepared. Enter MACBETH, LADY MACBETH, ROSS, LENNOX, Lords, and Attendants.</p>
                
                <p className="font-semibold text-[#353535] mt-3">MACBETH</p>
                <p className="pl-4">You know your own degrees; sit down: at first</p>
                <p className="pl-4">And last the hearty welcome.</p>
                
                <p className="font-semibold text-[#353535] mt-3">LORDS</p>
                <p className="pl-4">Thanks to your majesty.</p>
                
                <p className="font-semibold text-[#353535] mt-3">MACBETH</p>
                <p className="pl-4">Ourself will mingle with society,</p>
                <p className="pl-4">And play the humble host.</p>
                <p className="pl-4">Our hostess keeps her state, but in best time</p>
                <p className="pl-4">We will require her welcome.</p>
                
                <p className="font-semibold text-[#353535] mt-3">LADY MACBETH</p>
                <p className="pl-4">Pronounce it for me, sir, to all our friends;</p>
                <p className="pl-4">For my heart speaks they are welcome.</p>
                
                <p className="italic text-gray-500 my-2">First Murderer appears at the door.</p>
                
                <p className="font-semibold text-[#353535] mt-3">MACBETH</p>
                <p className="pl-4">See, they encounter thee with their hearts' thanks.</p>
                <p className="pl-4">Both sides are even: here I'll sit i' the midst:</p>
                <p className="pl-4">Be large in mirth; anon we'll drink a measure</p>
              </div>
              <DialogFooter className="flex sm:justify-between items-center gap-4">
                <span className="text-[10px] text-[#666361]/60">Format: Standard Matinee Playbook</span>
                <Button onClick={() => setScriptOpen(false)} className="bg-[#E85F57] text-[#2C2A28] hover:bg-[#E85F57]/90 rounded-[8px]">
                  Close Reader
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-[#EFE8E1] border border-[#DDD8CE] rounded-[8px] p-[24px] flex flex-col justify-between space-y-[16px]">
          <div className="space-y-[8px]">
            <span className="w-[32px] h-[32px] rounded-full bg-[#353535]/10 flex items-center justify-center text-[#353535]">
              <CalendarIcon className="w-4 h-4 text-[#353535]" />
            </span>
            <h4 className="font-bold text-base text-[#353535] font-serif">Attendance Records</h4>
            <p className="text-xs text-[#666361]/80 leading-relaxed">
              You have completed 95% of scheduled rehearsal attendances in the current Macbeth cycle. Keep it up!
            </p>
          </div>
          <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
            <DialogTrigger render={<Button variant="outline" className="w-full border-2 border-[#E85F57] text-[#E85F57] bg-white/50 hover:bg-white font-semibold rounded-[8px] py-[10px]" />}>
              Open Log Report
            </DialogTrigger>
            <DialogContent className="bg-[#E7DDD3] border border-[#DDD8CE] text-[#666361] max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif text-[#353535] text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" /> Attendance History
                </DialogTitle>
                <DialogDescription className="text-xs text-[#666361]/85">
                  Macbeth cycle attendance log for Jayesh Dave.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="border border-[#DDD8CE] rounded-[8px] bg-white overflow-hidden shadow-xs">
                  <Table>
                    <TableHeader className="bg-[#EFE8E1]/50">
                      <TableRow className="border-b border-[#DDD8CE] hover:bg-transparent">
                        <TableHead className="text-xs font-bold text-[#353535]">Date</TableHead>
                        <TableHead className="text-xs font-bold text-[#353535]">Production Session</TableHead>
                        <TableHead className="text-xs font-bold text-[#353535] text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceLog.map((log, index) => (
                        <TableRow key={index} className="border-b border-[#DDD8CE]/60 text-xs hover:bg-[#E7DDD3]/45">
                          <TableCell className="font-medium">{log.date}</TableCell>
                          <TableCell>{log.event}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-emerald-600/10 text-emerald-700 border-emerald-600/20 rounded-[4px] font-normal">
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setAttendanceOpen(false)} className="bg-[#E85F57] text-[#2C2A28] hover:bg-[#E85F57]/90 rounded-[8px]">
                  Dismiss
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Upcoming Rehearsals and Invites Schedule */}
      <section className="bg-white border border-[#D5C9BE]/30 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#D5C9BE]/20 bg-[#EFE8E1]/30 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[18px] text-[#353535] font-serif">My Upcoming Rehearsals &amp; Schedule</h3>
            <p className="text-xs text-[#666361]/70">Accept pending invitations or view your rehearsal roadmap</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-[#DDD8CE] hover:bg-transparent">
                <TableHead className="text-[#353535] font-semibold w-[250px] md:w-[30%]">Event Detail</TableHead>
                <TableHead className="text-[#353535] font-semibold">Date &amp; Time</TableHead>
                <TableHead className="text-[#353535] font-semibold">Location</TableHead>
                <TableHead className="text-[#353535] font-semibold">Attendance State</TableHead>
                <TableHead className="text-[#353535] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                [...events]
                  .sort((a, b) => {
                    if (a.status === "Pending" && b.status !== "Pending") return -1;
                    if (a.status !== "Pending" && b.status === "Pending") return 1;
                    return 0;
                  })
                  .map((event) => (
                    <TableRow key={event.id} className="border-b border-[#DDD8CE]/60 hover:bg-[#E7DDD3]/45 transition-colors">
                      <TableCell className="font-medium text-[#353535] py-4 w-[250px] md:w-[30%] align-top">
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm whitespace-normal break-words">{event.title}</span>
                          <span className="text-xs text-[#666361]/60 mt-0.5">{event.roleRequired}</span>
                          {event.directorNotes && (
                            <div className="text-xs text-[#666361]/75 mt-2 bg-[#EFE8E1]/40 border-l-2 border-[#E85F57] pl-2 italic whitespace-normal break-words">
                              <strong>Director Notes:</strong> "{event.directorNotes}"
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <div className="flex flex-col text-xs text-[#666361]">
                          <span className="font-semibold">{event.date}</span>
                          <span className="text-[#666361]/70 flex items-center gap-1 mt-1">
                            <Clock className="w-3.5 h-3.5 text-[#E85F57]" /> {event.time}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <div className="flex items-center gap-1.5 text-xs text-[#666361]">
                          <MapPin className="w-3.5 h-3.5 text-[#E85F57]" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 align-top">
                        <Badge className={`rounded px-2.5 py-0.5 text-[11px] font-semibold border ${
                          event.status === "Accepted" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                          event.status === "Declined" ? "bg-red-50 text-red-700 border-red-200" :
                          "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-right align-top">
                        {event.status === "Pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 w-8 p-0 rounded-md transition-all active:scale-95"
                              onClick={() => handleStatusChange(event.id, "Accepted")}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0 rounded-md transition-all active:scale-95"
                              onClick={() => handleStatusChange(event.id, "Declined")}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#666361]/50 italic">Decision Made</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-sm text-[#666361]/50 italic bg-[#fcfbfa]">
                    No rehearsals or events scheduled at the moment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Production Calendar Dialog */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="bg-[#E7DDD3] border border-[#DDD8CE] text-[#666361] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-[#353535] text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#E85F57]" /> Production Calendar
            </DialogTitle>
            <DialogDescription className="text-xs text-[#666361]/85">
              Scheduled events for {monthNames[displayMonth]} {displayYear}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Dynamic Calendar Grid */}
            <div className="border border-[#DDD8CE] rounded-[8px] bg-white shadow-xs">
              <div className="grid grid-cols-7 gap-[1px] border-l border-[#DDD8CE] bg-[#DDD8CE]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-[#353535] py-2 bg-[#EFE8E1]/50">{d}</div>
                ))}
                {calendarEmptyDays.map((_, i) => <div key={`empty-${i}`} className="p-2 bg-[#fcfbfa]" />)}
                {calendarDays.map(day => {
                  const dayEvents = events.filter(e => {
                    if (e.status !== "Accepted") return false;
                    const d = new Date(e.date);
                    return !isNaN(d.getTime()) && d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
                  });
                  
                  return (
                    <div key={day.toISOString()} className="min-h-[80px] p-1 bg-white relative flex flex-col">
                      <div className="text-right text-[#353535] text-xs font-medium mb-1 pr-1">{day.getDate()}</div>
                      <div className="space-y-1 flex-1 overflow-y-auto max-h-[100px]">
                        {dayEvents.map(e => (
                          <div key={e.id} className="bg-[#E85F57]/20 hover:bg-[#E85F57]/40 text-[#666361] text-[10px] px-1 py-0.5 rounded truncate border border-[#E85F57]/30 transition-colors" title={`${e.time} - ${e.title}`}>
                            {e.time.split(' ')[0]} {e.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setCalendarOpen(false)} className="bg-[#E85F57] text-[#2C2A28] hover:bg-[#E85F57]/90 rounded-[8px] w-full">
              Close Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
