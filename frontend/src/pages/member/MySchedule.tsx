// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Clock,
  MapPin,
  Check,
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  History,
  BellRing,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const referenceToday =
    now.getFullYear() >= 2026 ? new Date(now.getFullYear(), now.getMonth(), now.getDate()) : currentSeasonDate;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!activeUser?.email) return;
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
        const response = await fetch(`${baseUrl}/api/my-schedule?email=${encodeURIComponent(activeUser.email)}`);
        if (response.ok) {
          const data = await response.json();
          const formatted = data.map((e: any) => {
            const parsedDate = new Date(e.date);
            const isInvalidDate = isNaN(parsedDate.getTime());
            const eventDay = isInvalidDate
              ? new Date()
              : new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
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
              isPast: isPast,
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
    const accepted = events.filter((e) => e.status === "Accepted");
    if (accepted.length > 0) {
      const upcomingAccepted = accepted.filter((e) => !e.isPast);
      const targetList = upcomingAccepted.length > 0 ? upcomingAccepted : accepted;
      const earliest = [...targetList].sort(
        (a, b) => (a.rawDate?.getTime() || 0) - (b.rawDate?.getTime() || 0)
      )[0];
      if (earliest && earliest.rawDate) {
        setCalendarDate(new Date(earliest.rawDate.getFullYear(), earliest.rawDate.getMonth(), 1));
      }
    }
  }, [events]);

  const handleStatusChange = async (id: string, newStatus: "Accepted" | "Declined") => {
    const event = events.find((e) => e.id === id);
    if (!event) return;

    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      await fetch(`${baseUrl}/api/my-schedule/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participation_id: event.participation_id, status: newStatus }),
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const acceptedEvents = events.filter((e) => e.status === "Accepted");
  const upcomingEvents = events.filter((e) => !e.isPast);
  const pastEvents = events.filter((e) => e.isPast);

  // Calendar logic
  const displayMonth = calendarDate.getMonth();
  const displayYear = calendarDate.getFullYear();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => setCalendarDate(new Date(displayYear, displayMonth - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(displayYear, displayMonth + 1, 1));

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayYear, displayMonth, 1).getDay();
  const calendarEmptyDays = Array(firstDayOfMonth).fill(null);
  const calendarDays = Array.from(
    { length: daysInMonth },
    (_, i) => new Date(displayYear, displayMonth, i + 1)
  );

  const currentDisplayList = scheduleView === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div className="space-y-8 font-sans text-[#5C3B37] max-w-6xl mx-auto w-full pb-20">
      
      {/* 1. CALENDAR VIEW FOR ACCEPTED EVENTS */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EEDBD5] border border-[#D5AAA2] flex items-center justify-center text-[#8C241E] shadow-2xs">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#8C5A54]">
                Confirmed Production Roster
              </div>
              <h2 className="font-serif text-2xl font-normal text-[#2A1816] tracking-tight">
                Accepted Call Calendar
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-serif text-lg text-[#2A1816]">
              {monthNames[displayMonth]} {displayYear}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Themed Calendar Color Legend */}
        <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E4742] pt-1 border-t border-[#DCBAB2]/60">
          <span className="text-[#8C5A54] mr-1">Roster States:</span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-700/15 text-emerald-950 border border-emerald-700/30 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-700" />
            <span>Confirmed (Accepted)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-amber-700/15 text-amber-950 border border-amber-700/30 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Awaiting Reply (Pending)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-rose-700/15 text-rose-950 border border-rose-700/30 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-rose-700" />
            <span>Declined Call</span>
          </span>
          <span className="inline-flex items-center gap-1.5 bg-[#E4D9D2]/80 text-[#6B5550] border border-[#CBB3AC] px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#8C5A54]" />
            <span>Past Event</span>
          </span>
        </div>

        {/* Themed Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5 bg-[#DCBAB2]/50 p-1.5 rounded-[1.8rem] border border-[#DCBAB2]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54] py-2 bg-[#FAF2EE] rounded-xl"
            >
              {d}
            </div>
          ))}

          {calendarEmptyDays.map((_, i) => (
            <div
              key={`empty-${i}`}
              className="p-2 bg-[#FAF2EE]/40 rounded-xl min-h-[95px] border border-[#DCBAB2]/30"
            />
          ))}

          {calendarDays.map((day) => {
            const dayEvents = events.filter((e) => {
              const d = new Date(e.date);
              return (
                !isNaN(d.getTime()) &&
                d.getFullYear() === day.getFullYear() &&
                d.getMonth() === day.getMonth() &&
                d.getDate() === day.getDate()
              );
            });

            const isToday =
              day.getFullYear() === referenceToday.getFullYear() &&
              day.getMonth() === referenceToday.getMonth() &&
              day.getDate() === referenceToday.getDate();

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[105px] p-2 rounded-xl border transition-all flex flex-col justify-between ${
                  isToday
                    ? "bg-[#F5EAE6] border-[#8C241E] shadow-2xs ring-1 ring-[#8C241E]/40"
                    : "bg-[#FAF2EE] border-[#DCBAB2]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  {isToday ? (
                    <span className="text-[9px] font-mono font-bold text-[#8C241E] uppercase tracking-wider bg-[#EEDBD5] px-1.5 py-0.2 rounded border border-[#D5AAA2]">
                      Today
                    </span>
                  ) : <span />}
                  <span
                    className={`text-xs font-mono font-bold ${
                      isToday ? "text-[#8C241E]" : "text-[#8C5A54]"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>

                <div className="space-y-1 overflow-y-auto max-h-[85px] custom-scrollbar">
                  {dayEvents.map((e) => {
                    const isPast = e.isPast;
                    let styleClass = "";
                    let dotColor = "";

                    if (isPast) {
                      styleClass = "bg-[#E3D7D0]/90 text-[#6B5550] border-[#CBB3AC]";
                      dotColor = "bg-[#8C5A54]";
                    } else if (e.status === "Accepted") {
                      styleClass = "bg-emerald-700/15 hover:bg-emerald-700/25 text-emerald-950 border-emerald-700/30";
                      dotColor = "bg-emerald-700";
                    } else if (e.status === "Declined") {
                      styleClass = "bg-rose-700/15 hover:bg-rose-700/25 text-rose-950 border-rose-700/30";
                      dotColor = "bg-rose-700";
                    } else {
                      // Pending / Undecided
                      styleClass = "bg-amber-700/15 hover:bg-amber-700/25 text-amber-950 border-amber-700/30";
                      dotColor = "bg-amber-600";
                    }

                    return (
                      <div
                        key={e.id}
                        className={`text-[10px] font-mono font-medium px-1.5 py-1 rounded-lg truncate border transition-colors shadow-2xs flex items-center gap-1 ${styleClass}`}
                        title={`${e.title} (${e.time}) - ${e.location} [Status: ${e.status}${isPast ? " (Past)" : ""}]`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                        <span className="font-bold shrink-0">
                          {e.time.split(" - ")[0]}
                        </span>
                        <span className="truncate">{e.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. PRODUCTION CALL ATTENDANCE - NON-SCROLLABLE THEATRICAL ROSTER */}
      <section className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 md:p-8 shadow-xs space-y-6">
        
        {/* Header with Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCBAB2]/70 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C241E] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Callboard Action Center</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-[#2A1816] tracking-tight">
              Production Call Attendance
            </h2>
            <p className="text-xs text-[#6E4742] mt-0.5 font-light">
              Review assigned rehearsal sessions, crew calls, and live showcases.
            </p>
          </div>

          {/* Pill View Switcher */}
          <div className="flex items-center bg-[#E8D6CF]/70 p-1 rounded-full border border-[#D5AAA2] self-start sm:self-auto shadow-2xs">
            <button
              onClick={() => setScheduleView("upcoming")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                scheduleView === "upcoming"
                  ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs"
                  : "text-[#5C3B37] hover:text-[#2A1816]"
              }`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Upcoming Calls ({upcomingEvents.length})</span>
            </button>

            <button
              onClick={() => setScheduleView("past")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                scheduleView === "past"
                  ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs"
                  : "text-[#5C3B37] hover:text-[#2A1816]"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Archive ({pastEvents.length})</span>
            </button>
          </div>
        </div>

        {/* NON-SCROLLABLE ROSTER GRID (100% CONTAINER FIT WITH NO HORIZONTAL SCROLL) */}
        <div className="w-full space-y-3">
          
          {/* Table Header Row */}
          <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_0.8fr_1.1fr] gap-4 px-5 py-2.5 bg-[#F2E5E0] rounded-2xl border border-[#DCBAB2] text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
            <div>Production & Details</div>
            <div>Date & Time</div>
            <div>Venue / Hall</div>
            <div>Call State</div>
            <div className="text-right">
              {scheduleView === "upcoming" ? "Your Confirmation" : "Record State"}
            </div>
          </div>

          {/* Roster Items */}
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
              <div
                key={event.id}
                className="w-full bg-[#FAF2EE] hover:bg-[#F5EAE6] border border-[#DCBAB2] hover:border-[#8C241E]/40 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs flex flex-col lg:grid lg:grid-cols-[1.5fr_1fr_1fr_0.8fr_1.1fr] gap-3 lg:gap-4 lg:items-center"
              >
                {/* 1. Production Details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#8C241E] bg-[#EEDBD5] px-2 py-0.5 rounded-full border border-[#D5AAA2]">
                      {event.roleRequired || "Cast / Crew Call"}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#2A1816] leading-snug">
                    {event.title}
                  </h3>
                  {event.directorNotes && (
                    <p className="text-xs text-[#6E4742] leading-relaxed">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] mr-1">
                        Note:
                      </span>
                      {event.directorNotes}
                    </p>
                  )}
                </div>

                {/* 2. Date & Time */}
                <div className="space-y-0.5 text-xs text-[#2A1816]">
                  <span className="font-serif font-semibold text-sm block">
                    {event.date}
                  </span>
                  <span className="text-[#6E4742] flex items-center gap-1.5 font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#8C241E]" />
                    <span>{event.time}</span>
                  </span>
                </div>

                {/* 3. Venue / Hall */}
                <div className="flex items-center gap-1.5 text-xs text-[#5C3B37] min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                  <span className="font-medium truncate">{event.location}</span>
                </div>

                {/* 4. Call State Badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      event.status === "Accepted"
                        ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                        : event.status === "Declined"
                          ? "bg-rose-700/15 text-rose-950 border-rose-700/30"
                          : event.isPast
                            ? "bg-[#EEDBD5] text-[#8C5A54] border-[#D5AAA2]"
                            : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                    }`}
                  >
                    {event.isPast && event.status === "Pending" ? "Unanswered" : event.status}
                  </span>
                </div>

                {/* 5. Confirmation Action Buttons */}
                <div className="flex items-center justify-start lg:justify-end gap-2 pt-2 lg:pt-0 border-t border-[#DCBAB2]/50 lg:border-t-0">
                  {event.isPast ? (
                    <span className="text-[11px] font-mono font-medium text-[#8C5A54]">
                      {event.status === "Accepted"
                        ? "Attended / Concluded"
                        : event.status === "Declined"
                          ? "Declined Record"
                          : "Call Concluded"}
                    </span>
                  ) : event.status === "Pending" ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(event.id, "Accepted")}
                        className="bg-emerald-800 hover:bg-emerald-900 text-[#FDF8F7] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-xs border border-emerald-900"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-200" />
                        <span>Accept</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange(event.id, "Declined")}
                        className="bg-[#FAF2EE] hover:bg-rose-50 text-rose-800 hover:text-rose-900 px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border border-rose-300 shadow-2xs"
                      >
                        <X className="w-3.5 h-3.5 text-rose-700" />
                        <span>Decline</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#6E4742] italic">
                        {event.status === "Accepted" ? "Confirmed" : "Declined"}
                      </span>
                      <button
                        onClick={() =>
                          handleStatusChange(
                            event.id,
                            event.status === "Accepted" ? "Declined" : "Accepted"
                          )
                        }
                        className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C241E] hover:text-[#731B16] bg-[#EEDBD5] hover:bg-[#E3CEC6] px-2.5 py-1 rounded-full border border-[#D5AAA2] transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {/* Empty State */}
          {currentDisplayList.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-[#8C5A54] bg-[#F5EAE6] rounded-2xl border border-dashed border-[#DCBAB2] space-y-2">
              <CalendarIcon className="w-8 h-8 text-[#8C5A54]/60 mx-auto" />
              <p>
                {scheduleView === "upcoming"
                  ? "No upcoming production calls scheduled at this moment."
                  : "No past call history found in archive."}
              </p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
