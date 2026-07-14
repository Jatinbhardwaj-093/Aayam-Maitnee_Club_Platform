import { useState, useEffect } from "react";
import { Clock, MapPin, Check, X } from "lucide-react";
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
  directorNotes: string;
}

export default function MySchedule() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001"}/api/events`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data.events || []);
        }
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };
    fetchEvents();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "Accepted" | "Declined") => {
    // Optimistic UI update
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    // Could also send update to backend here if needed
  };

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
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
    </div>
  );
}
