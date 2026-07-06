import { useState } from "react";
import { Calendar as CalendarIcon, Clock, MapPin, Check, X, BookOpen, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "Accepted" | "Pending" | "Declined";
  roleRequired: string;
}

const initialEvents: Event[] = [
  {
    id: "e1",
    title: "Macbeth Act III Rehearsal",
    date: "July 04, 2026",
    time: "10:00 AM - 1:00 PM",
    location: "Rehearsal Hall B",
    status: "Accepted",
    roleRequired: "Macbeth (Julian Devereux)",
  },
  {
    id: "e2",
    title: "Technical Dress Dress Run & Lighting Sync",
    date: "July 07, 2026",
    time: "4:00 PM - 8:00 PM",
    location: "Main Stage",
    status: "Pending",
    roleRequired: "All Cast & Production Crew",
  },
  {
    id: "e3",
    title: "Sponsor Gala Pre-Performance Read",
    date: "July 10, 2026",
    time: "6:00 PM - 7:30 PM",
    location: "VIP Lounge",
    status: "Pending",
    roleRequired: "Lead Roles Only",
  },
];

export default function MemberDashboard() {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const handleStatusChange = (id: string, newStatus: "Accepted" | "Declined") => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Header and Welcome */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] mb-[32px] md:mb-[48px]">
        <div className="space-y-[8px]">
          <Badge className="bg-[#635f41]/10 text-[#635f41] border-[#e6e2dd] rounded-[4px]">Active Cast Member</Badge>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Welcome Back, Julian</h2>
          <p className="text-[14px] text-[#466272]">
            You have <span className="font-semibold text-[#635f41]">2 pending rehearsal invites</span> for Macbeth this week.
          </p>
        </div>
        <div className="flex gap-[12px]">
          <Button className="bg-[#8CC0EB] hover:bg-[#8CC0EB]/90 text-[#1c1b19] font-semibold rounded-[8px] py-[10px] px-[20px] gap-2 shadow-sm transition-all active:scale-95">
            <CalendarIcon className="w-4 h-4" /> View Calendar
          </Button>
          <Button variant="outline" className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 font-semibold rounded-[8px] py-[10px] px-[20px] transition-all active:scale-95">
            Check In
          </Button>
        </div>
      </div>

      {/* Main Schedule Panel */}
      <section className="bg-white border border-[#e6e2dd] rounded-[8px] overflow-hidden shadow-sm">
        <div className="px-[24px] py-[20px] border-b border-[#e6e2dd] bg-[#f7f3ee]/50 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif">My Rehearsal Schedule</h3>
            <p className="text-xs text-[#466272]/70">Confirm your attendance for upcoming scenes and reads</p>
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
      <section className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] flex flex-col justify-between space-y-[16px]">
          <div className="space-y-[8px]">
            <span className="w-[32px] h-[32px] rounded-full bg-[#635f41]/10 flex items-center justify-center text-[#635f41]">
              <BookOpen className="w-4 h-4 text-[#635f41]" />
            </span>
            <h4 className="font-bold text-base text-[#635f41] font-serif">Act III Script Materials</h4>
            <p className="text-xs text-[#466272]/80 leading-relaxed">
              Read and review the modified script passages for the banquet scene and the apparition prophecies.
            </p>
          </div>
          <Button variant="outline" className="w-full border-2 border-[#8CC0EB] text-[#8CC0EB] bg-white/50 hover:bg-white font-semibold rounded-[8px] py-[10px]">
            Read Script File
          </Button>
        </div>

        <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] flex flex-col justify-between space-y-[16px]">
          <div className="space-y-[8px]">
            <span className="w-[32px] h-[32px] rounded-full bg-[#635f41]/10 flex items-center justify-center text-[#635f41]">
              <AlertCircle className="w-4 h-4 text-[#635f41]" />
            </span>
            <h4 className="font-bold text-base text-[#635f41] font-serif">Director Notes</h4>
            <p className="text-xs text-[#466272]/80 leading-relaxed">
              "Focus on high tension during the ghost encounter. The lighting contrast will follow your movements."
            </p>
          </div>
          <Button variant="outline" className="w-full border-2 border-[#8CC0EB] text-[#8CC0EB] bg-white/50 hover:bg-white font-semibold rounded-[8px] py-[10px]">
            View All Notes
          </Button>
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
          <Button variant="outline" className="w-full border-2 border-[#8CC0EB] text-[#8CC0EB] bg-white/50 hover:bg-white font-semibold rounded-[8px] py-[10px]">
            Open Log Report
          </Button>
        </div>
      </section>
    </div>
  );
}
