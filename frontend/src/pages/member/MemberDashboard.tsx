import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Calendar, CheckCircle2, Clock, Mic, PlayCircle, MapPin, Edit3, Sparkles, MoveRight, X, ArrowUpRight, FileText 
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function MemberDashboard() {
  const context = useOutletContext<{ activeUser: any }>();
  const activeUser = context?.activeUser;
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [scriptOpen, setScriptOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/events/list`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setEvents(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const upcomingEvents = events.filter(e => e.status === "Accepted").slice(0, 3);
  
  const mockRehearsals = [
    { id: 1, play: "Macbeth", time: "18:00 - 20:30", location: "Main Studio", role: "Lady Macbeth", progress: 85 },
    { id: 2, play: "A Midsummer Night's Dream", time: "16:00 - 18:00", location: "Blackbox Theatre", role: "Puck", progress: 40 }
  ];

  const attendanceLog = [
    { date: "Oct 12, 2024", event: "Macbeth Act II Read-through", status: "Present" },
    { date: "Oct 10, 2024", event: "Vocal Warmups & Blocking", status: "Present" },
    { date: "Oct 05, 2024", event: "Midsummer Cast Introduction", status: "Present" },
  ];

  // Calendar logic
  const now = new Date();
  const displayMonth = now.getMonth();
  const displayYear = now.getFullYear();
  const firstDay = new Date(displayYear, displayMonth, 1);
  const lastDay = new Date(displayYear, displayMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => new Date(displayYear, displayMonth, i + 1));
  const calendarEmptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh] bg-[#E7DDD3]">
        <div className="w-8 h-8 border-2 border-[#E85F57] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#E7DDD3] p-6 lg:p-10 font-sans text-[#2C2A28] max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Hero - Dark Editorial */}
      <div className="bg-[#2C2A28] rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-xl border border-[#353535]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E85F57]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <span className="text-[#E85F57] font-mono text-xs font-bold tracking-[0.2em] uppercase mb-4 block flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Cast Member Dashboard
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-[#F7F5F0] leading-tight mb-4 tracking-tight">
              Welcome back, <br/>
              <span className="text-white">{activeUser?.name.split(" ")[0]}</span>
            </h1>
            <p className="text-white/60 font-serif text-lg md:text-xl leading-relaxed max-w-xl">
              You have <strong className="text-white font-semibold">2 rehearsals</strong> scheduled this week. Your script lines for <span className="text-[#F7F5F0] italic">Macbeth</span> are 85% memorized.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <button 
              onClick={() => setCalendarOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-[#F7F5F0] px-6 py-3.5 rounded-full text-xs font-bold font-mono tracking-widest uppercase transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Full Schedule
            </button>
            <button className="bg-[#E85F57] hover:bg-[#D44E46] text-white px-6 py-3.5 rounded-full text-xs font-bold font-mono tracking-widest uppercase transition-all shadow-md flex items-center gap-2">
              <Mic className="w-4 h-4" /> AI Rehearsal
            </button>
          </div>
        </div>
      </div>

      {/* Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Next Rehearsal Card */}
        <div className="col-span-1 lg:col-span-2 bg-[#F7F5F0] rounded-[2rem] p-8 border border-[#D5C9BE]/60 shadow-sm relative overflow-hidden group">
          <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#E7DDD3] flex items-center justify-center text-[#2C2A28] group-hover:scale-110 group-hover:bg-[#E85F57] group-hover:text-white transition-all">
            <PlayCircle className="w-5 h-5" />
          </div>
          <span className="text-[#E85F57] font-mono text-[10px] font-bold tracking-widest uppercase mb-4 block">Up Next</span>
          <h2 className="text-3xl font-serif font-bold text-[#2C2A28] mb-2">{mockRehearsals[0].play}</h2>
          <p className="text-sm font-bold text-[#666361] mb-6 flex items-center gap-2">
            Role: <span className="text-[#E85F57] px-2 py-0.5 bg-[#E85F57]/10 rounded-md">{mockRehearsals[0].role}</span>
          </p>
          
          <div className="flex flex-wrap gap-6 text-sm text-[#353535]">
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-[#D5C9BE]/50 shadow-xs">
              <Clock className="w-4 h-4 text-[#E85F57]" /> <span className="font-semibold">{mockRehearsals[0].time}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-[#D5C9BE]/50 shadow-xs">
              <MapPin className="w-4 h-4 text-[#E85F57]" /> <span className="font-semibold">{mockRehearsals[0].location}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="col-span-1 bg-[#2C2A28] rounded-[2rem] p-8 border border-[#353535] shadow-sm flex flex-col justify-between text-[#F7F5F0]">
          <div>
            <span className="text-[#E85F57] font-mono text-[10px] font-bold tracking-widest uppercase mb-4 block">Performance Stats</span>
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-4xl font-serif font-bold leading-none">95%</h3>
              <button 
                onClick={() => setAttendanceOpen(true)}
                className="text-white/50 hover:text-white pb-1 border-b border-transparent hover:border-white transition-all text-xs font-mono uppercase tracking-widest"
              >
                Log <ArrowUpRight className="inline w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-white/50 font-mono">Attendance Rate</p>
          </div>

          <div className="mt-8 pt-6 border-t border-[#353535]">
            <div className="flex justify-between text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <span className="text-white/70">Line Memory</span>
              <span className="text-[#E85F57]">85%</span>
            </div>
            <div className="w-full bg-[#353535] rounded-full h-2 overflow-hidden">
              <div className="bg-[#E85F57] h-full rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Scripts */}
        <section className="bg-[#F7F5F0] rounded-[2rem] border border-[#D5C9BE]/60 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-[#2C2A28]">Active Scripts</h2>
            <button className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361] hover:text-[#E85F57] flex items-center gap-1 transition-colors">
              View Vault <MoveRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-4">
            {mockRehearsals.map((rehearsal) => (
              <div key={rehearsal.id} className="flex items-center justify-between p-5 bg-white border border-[#D5C9BE]/50 rounded-2xl hover:border-[#E85F57]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F7F5F0] border border-[#D5C9BE] flex items-center justify-center text-[#E85F57] shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-[#2C2A28] text-lg">{rehearsal.play}</h3>
                    <p className="text-xs text-[#666361] font-mono uppercase tracking-widest mt-0.5">{rehearsal.role}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setScriptOpen(true)}
                  className="w-10 h-10 rounded-full bg-[#E7DDD3]/50 text-[#353535] flex items-center justify-center hover:bg-[#E85F57] hover:text-white transition-all shrink-0"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Club Noticeboard / Events */}
        <section className="bg-[#F7F5F0] rounded-[2rem] border border-[#D5C9BE]/60 p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-[#2C2A28]">Upcoming Schedule</h2>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="flex gap-4 p-5 bg-white border border-[#D5C9BE]/50 rounded-2xl">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-[#2C2A28] text-[#F7F5F0] rounded-xl shrink-0 border border-[#353535]">
                    <span className="text-[10px] uppercase font-bold tracking-widest font-mono opacity-60">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-lg font-serif font-bold leading-none mt-1">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="font-serif font-bold text-[#2C2A28] truncate text-base">{event.title}</h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[#666361] font-mono">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white border border-[#D5C9BE]/50 rounded-2xl">
                <p className="text-xs font-mono uppercase tracking-widest text-[#666361]">No events scheduled.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Script Reader Modal */}
      <Dialog open={scriptOpen} onOpenChange={setScriptOpen}>
        <DialogContent className="max-w-2xl bg-[#F7F5F0] border-0 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-[#D5C9BE]/50 bg-[#F7F5F0] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E85F57]">Rehearsal Draft</span>
              <DialogTitle className="font-serif text-3xl text-[#2C2A28] mt-1">Macbeth - Act III, Sc. 4</DialogTitle>
            </div>
            <button onClick={() => setScriptOpen(false)} className="w-10 h-10 rounded-full border border-[#D5C9BE] bg-white flex items-center justify-center text-[#2C2A28] hover:bg-[#E85F57] hover:text-white hover:border-[#E85F57] transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-10 max-h-[60vh] overflow-y-auto space-y-8 font-serif text-[17px] leading-relaxed text-[#2C2A28] bg-white custom-scrollbar">
            <p className="font-bold text-center border-b border-[#D5C9BE]/50 pb-6 text-[#E85F57] uppercase tracking-[0.2em] text-xs font-mono">SCENE IV. The same. Hall in the palace.</p>
            <p className="italic text-[#666361] text-sm text-center font-sans tracking-wide">A banquet prepared. Enter MACBETH, LADY MACBETH, ROSS, LENNOX, Lords, and Attendants.</p>
            
            <div className="space-y-2 mt-8">
              <p className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#666361]">MACBETH</p>
              <p className="pl-6 border-l-2 border-[#E85F57]/30 text-lg">You know your own degrees; sit down: at first<br/>And last the hearty welcome.</p>
            </div>
            
            <div className="space-y-2 mt-6">
              <p className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#666361]">LORDS</p>
              <p className="pl-6 border-l-2 border-[#E85F57]/30 text-lg">Thanks to your majesty.</p>
            </div>
            
            <div className="space-y-2 mt-6">
              <p className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#666361]">MACBETH</p>
              <p className="pl-6 border-l-2 border-[#E85F57]/30 text-lg">Ourself will mingle with society,<br/>And play the humble host.<br/>Our hostess keeps her state, but in best time<br/>We will require her welcome.</p>
            </div>
            
            <div className="space-y-2 mt-6">
              <p className="font-bold text-[10px] font-mono uppercase tracking-widest text-[#666361]">LADY MACBETH</p>
              <p className="pl-6 border-l-2 border-[#E85F57]/30 text-lg">Pronounce it for me, sir, to all our friends;<br/>For my heart speaks they are welcome.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attendance Log Modal */}
      <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
        <DialogContent className="max-w-xl bg-[#F7F5F0] border-0 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-[#D5C9BE] bg-[#F7F5F0] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700">Completion Score: 95%</span>
              <DialogTitle className="font-serif text-3xl text-[#2C2A28] mt-1">Attendance History</DialogTitle>
            </div>
            <button onClick={() => setAttendanceOpen(false)} className="w-10 h-10 rounded-full border border-[#D5C9BE] bg-white flex items-center justify-center text-[#2C2A28] hover:bg-[#E85F57] hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-8 max-h-[60vh] overflow-y-auto bg-white custom-scrollbar">
            <div className="space-y-3">
              {attendanceLog.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-[#F7F5F0] rounded-2xl border border-[#D5C9BE]/50">
                  <div>
                    <p className="font-serif font-bold text-[#2C2A28] text-lg">{log.event}</p>
                    <p className="text-[10px] text-[#666361] font-mono uppercase tracking-widest mt-1">{log.date}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase tracking-widest border border-emerald-200 flex items-center gap-1.5 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar Modal */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-w-3xl bg-[#F7F5F0] border-0 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-[#D5C9BE] bg-[#F7F5F0] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E85F57]">Overview</span>
              <DialogTitle className="font-serif text-3xl text-[#2C2A28] mt-1">
                {monthNames[displayMonth]} {displayYear}
              </DialogTitle>
            </div>
            <button onClick={() => setCalendarOpen(false)} className="w-10 h-10 rounded-full border border-[#D5C9BE] bg-white flex items-center justify-center text-[#2C2A28] hover:bg-[#E85F57] hover:text-white transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-8 bg-white">
            <div className="border border-[#D5C9BE]/80 rounded-[2rem] bg-white overflow-hidden shadow-sm">
              <div className="grid grid-cols-7 gap-px bg-[#D5C9BE]/50">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361] py-4 bg-[#F7F5F0]">{d}</div>
                ))}
                {calendarEmptyDays.map((_, i) => <div key={`empty-${i}`} className="p-2 bg-[#F7F5F0]/50 min-h-[120px]" />)}
                {calendarDays.map(day => {
                  const dayEvents = events.filter(e => {
                    if (e.status !== "Accepted") return false;
                    const d = new Date(e.date);
                    return !isNaN(d.getTime()) && d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate();
                  });
                  
                  return (
                    <div key={day.toISOString()} className="min-h-[120px] p-3 bg-white relative flex flex-col hover:bg-[#F7F5F0] transition-colors border-t border-transparent group">
                      <div className="text-right text-[#2C2A28] text-xs font-mono font-bold mb-2 group-hover:text-[#E85F57] transition-colors">{day.getDate()}</div>
                      <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
                        {dayEvents.map(e => (
                          <div key={e.id} className="bg-[#E85F57] text-white text-[9px] font-mono px-2 py-1.5 rounded-lg leading-tight shadow-sm" title={`${e.time} - ${e.title}`}>
                            <span className="font-bold block mb-0.5 opacity-80">{e.time.split(' ')[0]}</span>
                            <span className="truncate block">{e.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
