import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Check, X, BookOpen, CheckCircle } from "lucide-react";
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
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [scriptOpen, setScriptOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const attendanceLog = [
    { date: "June 15, 2026", event: "Macbeth Table Read (Acts I & II)", status: "Present" },
    { date: "June 20, 2026", event: "Blocking & Staging (Act I)", status: "Present" },
    { date: "June 25, 2026", event: "Staging & Choreography (Act II)", status: "Present" },
    { date: "July 01, 2026", event: "Macbeth Table Read (Act III)", status: "Present" },
    { date: "July 04, 2026", event: "Macbeth Act III Rehearsal", status: "Present" },
    { date: "July 07, 2026", event: "Technical Dress Run & Lighting Sync", status: "Present" },
  ];

  useEffect(() => {
    const targetDate = new Date("2026-07-12T14:00:00");
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStatusChange = (id: string, newStatus: "Accepted" | "Declined") => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Header and Welcome */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] mb-[32px] md:mb-[48px]">
        <div className="space-y-[12px] flex-1">
          <div className="space-y-[8px]">
            <Badge className="bg-[#635f41]/10 text-[#635f41] border-[#e6e2dd] rounded-[4px]">Active Production Member</Badge>
            <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Welcome Back, Jayesh</h2>
            <p className="text-[14px] text-[#466272]">
              You have <span className="font-semibold text-[#635f41]">2 pending rehearsal invites</span> for Macbeth this week.
            </p>
          </div>
          
          {/* Elegant countdown container */}
          <div className="inline-flex items-center gap-[12px] bg-white/80 border border-[#e6e2dd] rounded-[6px] px-[16px] py-[8px] text-xs shadow-sm">
            <div className="flex items-center gap-1.5 text-[#635f41] font-semibold uppercase tracking-wider text-[10px]">
              <Clock className="w-3.5 h-3.5 text-[#8CC0EB]" />
              <span>Next Performance:</span>
            </div>
            <div className="flex items-center gap-1 font-mono text-[#635f41] font-bold text-sm">
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
        <div className="flex gap-[12px] flex-shrink-0">
          <Button 
            onClick={() => setCalendarOpen(true)}
            className="bg-[#8CC0EB] hover:bg-[#8CC0EB]/90 text-[#1c1b19] font-semibold rounded-[8px] py-[10px] px-[20px] gap-2 shadow-sm transition-all active:scale-95"
          >
            <CalendarIcon className="w-4 h-4" /> View Calendar
          </Button>
        </div>
      </div>

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
                <TableHead className="text-[#635f41] font-semibold">Event Detail</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Date &amp; Time</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Location</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Attendance State</TableHead>
                <TableHead className="text-[#635f41] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} className="border-b border-[#e6e2dd]/60 hover:bg-[#fdf9f4]/45">
                  <TableCell className="font-medium text-[#635f41] py-[16px]">
                    <div className="flex flex-col">
                      <span className="font-semibold text-[14px]">{event.title}</span>
                      <span className="text-xs text-[#466272]/60 mt-0.5">{event.roleRequired}</span>
                      <div className="text-[12px] text-[#466272]/70 mt-2 bg-[#f7f3ee]/40 border-l-2 border-[#8CC0EB] pl-2 italic">
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

      {/* Script & Role Resources */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
        <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] flex flex-col justify-between space-y-[16px]">
          <div className="space-y-[8px]">
            <span className="w-[32px] h-[32px] rounded-full bg-[#635f41]/10 flex items-center justify-center text-[#635f41]">
              <BookOpen className="w-4 h-4 text-[#635f41]" />
            </span>
            <h4 className="font-bold text-base text-[#635f41] font-serif">Macbeth Script</h4>
            <p className="text-xs text-[#466272]/80 leading-relaxed">
              Read and review the modified script passages for the banquet scene and the apparition prophecies.
            </p>
          </div>
          <Dialog open={scriptOpen} onOpenChange={setScriptOpen}>
            <DialogTrigger render={<Button variant="outline" className="w-full border-2 border-[#8CC0EB] text-[#8CC0EB] bg-white/50 hover:bg-white font-semibold rounded-[8px] py-[10px]" />}>
              Open Script Material
            </DialogTrigger>
            <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif text-[#635f41] text-xl font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#8CC0EB]" /> Macbeth - Act III, Scene 4
                </DialogTitle>
                <DialogDescription className="text-xs text-[#466272]/85">
                  Banquet Scene. Rehearsal Draft (Aayam Matinee Edition)
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4 font-serif text-[14px] leading-relaxed text-black/85 bg-white border border-[#e6e2dd] rounded-[8px] p-6 max-h-[50vh] overflow-y-auto">
                <p className="font-bold text-center border-b border-[#e6e2dd] pb-2 mb-4 text-[#635f41]">SCENE IV. The same. Hall in the palace.</p>
                <p className="italic text-gray-500 mb-2">A banquet prepared. Enter MACBETH, LADY MACBETH, ROSS, LENNOX, Lords, and Attendants.</p>
                
                <p className="font-semibold text-[#635f41] mt-3">MACBETH</p>
                <p className="pl-4">You know your own degrees; sit down: at first</p>
                <p className="pl-4">And last the hearty welcome.</p>
                
                <p className="font-semibold text-[#635f41] mt-3">LORDS</p>
                <p className="pl-4">Thanks to your majesty.</p>
                
                <p className="font-semibold text-[#635f41] mt-3">MACBETH</p>
                <p className="pl-4">Ourself will mingle with society,</p>
                <p className="pl-4">And play the humble host.</p>
                <p className="pl-4">Our hostess keeps her state, but in best time</p>
                <p className="pl-4">We will require her welcome.</p>
                
                <p className="font-semibold text-[#635f41] mt-3">LADY MACBETH</p>
                <p className="pl-4">Pronounce it for me, sir, to all our friends;</p>
                <p className="pl-4">For my heart speaks they are welcome.</p>
                
                <p className="italic text-gray-500 my-2">First Murderer appears at the door.</p>
                
                <p className="font-semibold text-[#635f41] mt-3">MACBETH</p>
                <p className="pl-4">See, they encounter thee with their hearts' thanks.</p>
                <p className="pl-4">Both sides are even: here I'll sit i' the midst:</p>
                <p className="pl-4">Be large in mirth; anon we'll drink a measure</p>
              </div>
              <DialogFooter className="flex sm:justify-between items-center gap-4">
                <span className="text-[10px] text-[#466272]/60">Format: Standard Matinee Playbook</span>
                <Button onClick={() => setScriptOpen(false)} className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                  Close Reader
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] flex flex-col justify-between space-y-[16px]">
          <div className="space-y-[8px]">
            <span className="w-[32px] h-[32px] rounded-full bg-[#635f41]/10 flex items-center justify-center text-[#635f41]">
              <CalendarIcon className="w-4 h-4 text-[#635f41]" />
            </span>
            <h4 className="font-bold text-base text-[#635f41] font-serif">Attendance Records</h4>
            <p className="text-xs text-[#466272]/80 leading-relaxed">
              You have completed 95% of scheduled rehearsal attendances in the current Macbeth cycle. Keep it up!
            </p>
          </div>
          <Dialog open={attendanceOpen} onOpenChange={setAttendanceOpen}>
            <DialogTrigger render={<Button variant="outline" className="w-full border-2 border-[#8CC0EB] text-[#8CC0EB] bg-white/50 hover:bg-white font-semibold rounded-[8px] py-[10px]" />}>
              Open Log Report
            </DialogTrigger>
            <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif text-[#635f41] text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" /> Attendance History
                </DialogTitle>
                <DialogDescription className="text-xs text-[#466272]/85">
                  Macbeth cycle attendance log for Jayesh Dave.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="border border-[#e6e2dd] rounded-[8px] bg-white overflow-hidden shadow-xs">
                  <Table>
                    <TableHeader className="bg-[#f7f3ee]/50">
                      <TableRow className="border-b border-[#e6e2dd] hover:bg-transparent">
                        <TableHead className="text-xs font-bold text-[#635f41]">Date</TableHead>
                        <TableHead className="text-xs font-bold text-[#635f41]">Production Session</TableHead>
                        <TableHead className="text-xs font-bold text-[#635f41] text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceLog.map((log, index) => (
                        <TableRow key={index} className="border-b border-[#e6e2dd]/60 text-xs hover:bg-[#fdf9f4]/45">
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
                <Button onClick={() => setAttendanceOpen(false)} className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                  Dismiss
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Production Calendar Dialog */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-[#635f41] text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#8CC0EB]" /> Production Calendar
            </DialogTitle>
            <DialogDescription className="text-xs text-[#466272]/85">
              Matinee schedule & events for July 2026.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Calendar Grid */}
            <div className="border border-[#e6e2dd] rounded-[8px] bg-white p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#e6e2dd] pb-2 mb-3">
                <span className="font-serif text-[#635f41] font-bold text-sm">July 2026</span>
                <span className="text-[10px] uppercase font-semibold text-[#8CC0EB]">Macbeth Season</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#635f41] mb-2">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#466272]">
                {/* Offset for July 2026 starting on Wednesday (Offset: 3 empty cells) */}
                <div /> <div /> <div />
                
                {/* Days */}
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span className="bg-[#8CC0EB]/20 text-[#635f41] rounded-full font-bold relative group cursor-pointer p-1" title="Macbeth Act III Rehearsal">
                  4
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8CC0EB] rounded-full" />
                </span>
                <span>5</span>
                <span>6</span>
                <span className="bg-[#8CC0EB]/20 text-[#635f41] rounded-full font-bold relative group cursor-pointer p-1" title="Technical Dress Run">
                  7
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8CC0EB] rounded-full" />
                </span>
                <span>8</span>
                <span>9</span>
                <span className="bg-amber-100 text-amber-800 rounded-full font-bold relative group cursor-pointer p-1" title="Sponsor Gala Pre-Performance Read">
                  10
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
                </span>
                <span>11</span>
                <span className="bg-[#635f41] text-white rounded-full font-bold relative group cursor-pointer p-1" title="Macbeth Opening Night Gala">
                  12
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                </span>
                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-1.5 text-xs text-[#466272]/95 border border-[#e6e2dd] rounded-[8px] bg-white p-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8CC0EB]/40 flex-shrink-0" />
                <span>Rehearsal Session (July 4, July 7)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-200 flex-shrink-0" />
                <span>Sponsor Gala / Online Read (July 10)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#635f41] flex-shrink-0" />
                <span>Opening Matinee Performance (July 12)</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setCalendarOpen(false)} className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px] w-full">
              Close Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
