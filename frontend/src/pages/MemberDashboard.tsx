import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Check,
  X,
  Plus,
  Grid3X3,
  List,
  MoreVertical,
  CheckCircle,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "Accepted" | "Pending" | "Declined";
  roleRequired: string;
  month: string;
  day: string;
}

const initialEvents: Event[] = [
  {
    id: "e2",
    title: "Technical Dress Dress Run & Lighting Sync",
    date: "Tuesday, Oct 27",
    time: "4:00 PM - 8:00 PM",
    location: "Main Stage",
    status: "Pending",
    roleRequired: "All Cast & Production Crew",
    month: "Oct",
    day: "27"
  },
  {
    id: "e3",
    title: "Sponsor Gala Pre-Performance Read",
    date: "Friday, Oct 30",
    time: "6:00 PM - 7:30 PM",
    location: "VIP Lounge",
    status: "Pending",
    roleRequired: "Lead Roles Only",
    month: "Oct",
    day: "30"
  },
  {
    id: "e4",
    title: "Gala Night Rehearsal",
    date: "Wednesday, Oct 28",
    time: "6:00 PM",
    location: "Stage A",
    status: "Accepted",
    roleRequired: "Full Ensemble Sync",
    month: "Oct",
    day: "28"
  },
  {
    id: "e5",
    title: "Costume Fitting",
    date: "Monday, Nov 02",
    time: "10:00 AM",
    location: "Studio 4",
    status: "Accepted",
    roleRequired: "Main Cast - Matinee Wardrobe",
    month: "Nov",
    day: "02"
  }
];

export default function MemberDashboard() {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [activeTab, setActiveTab] = useState<"accepted" | "pending" | "all">("accepted");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleStatusChange = (id: string, newStatus: "Accepted" | "Declined") => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  // Filter events based on active tab
  const filteredEvents = events.filter((event) => {
    if (activeTab === "accepted") return event.status === "Accepted";
    if (activeTab === "pending") return event.status === "Pending";
    return true; // "all"
  });

  // Tilt effect for cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = "";
  };

  return (
    <div className="space-y-8 font-sans text-on-surface">
      {/* Header Welcome */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2 select-none tracking-tight">
          Welcome Back, Julian
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Your matinee performance is approaching. Review your scripts and upcoming rehearsals to ensure a flawless show.
        </p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Rehearsal Schedule Card (Left Column) */}
        <section className="lg:col-span-4 flex flex-col h-full">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-primary-container p-8 rounded-xl border border-outline-variant/30 flex flex-col h-full transition-transform duration-300 ease-out shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="bg-azure-blue/20 text-on-secondary-container px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Coming Up
              </span>
              <Clock className="w-5 h-5 text-secondary" />
            </div>

            <h3 className="text-2xl font-serif font-semibold text-on-primary-container mb-4">
              Main Stage Rehearsal
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span className="text-sm text-on-surface-variant font-medium">Thursday, Oct 24</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm text-on-surface-variant font-medium">2:00 PM – 5:30 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-on-surface-variant font-medium">The Atrium Wing</span>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-primary/10">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">
                Cast Notes
              </p>
              <p className="text-sm text-on-surface-variant italic leading-relaxed">
                "Focusing on the third act transitions today. Bring full costume pieces for Act II scene 1."
              </p>
            </div>
          </div>
        </section>

        {/* Outer container for Progress Tracker & Events (Right Column) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Progress Tracker Section */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/30 transition-transform duration-300 ease-out shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif font-semibold text-primary">Script Progress</h3>
              <Sliders className="w-5 h-5 text-secondary" />
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-on-surface-variant">The Glass Menagerie</span>
                  <span className="text-xs font-bold text-primary">82% Memorized</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-azure-blue transition-all duration-1000" style={{ width: "82%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-on-surface-variant">Waiting for Godot</span>
                  <span className="text-xs font-bold text-primary">45% Rehearsed</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-soft-peach transition-all duration-1000" style={{ width: "45%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-on-surface-variant">A Midsummer Night's Dream</span>
                  <span className="text-xs font-bold text-primary">12% Memorized</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-sky-blue transition-all duration-1000" style={{ width: "12%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Events Filter Section */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="bg-white p-8 rounded-xl border border-outline-variant/30 transition-transform duration-300 ease-out shadow-sm flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-serif font-semibold text-primary">Events</h3>
              <button className="text-azure-blue hover:text-azure-blue/90 text-xs font-bold uppercase tracking-wider transition-colors">
                View Calendar
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-6 border-b border-outline-variant/20 pb-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("accepted")}
                className={`text-xs font-bold uppercase tracking-wider pb-1 whitespace-nowrap border-b-2 transition-all ${activeTab === "accepted"
                  ? "text-primary border-azure-blue"
                  : "text-on-surface-variant hover:text-primary border-transparent"
                  }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`text-xs font-bold uppercase tracking-wider pb-1 whitespace-nowrap border-b-2 transition-all ${activeTab === "pending"
                  ? "text-primary border-azure-blue"
                  : "text-on-surface-variant hover:text-primary border-transparent"
                  }`}
              >
                Plan to Attend
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`text-xs font-bold uppercase tracking-wider pb-1 whitespace-nowrap border-b-2 transition-all ${activeTab === "all"
                  ? "text-primary border-azure-blue"
                  : "text-on-surface-variant hover:text-primary border-transparent"
                  }`}
              >
                All Events
              </button>
            </div>

            {/* Events List */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[220px] custom-scrollbar pr-2">
              {filteredEvents.length === 0 ? (
                <div className="h-full flex flex-col justify-center items-center py-6 text-center">
                  <p className="text-xs text-on-surface-variant/60 italic">No events found in this category.</p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/10 flex items-center gap-4 transition-all">
                    <div className={`w-12 h-12 rounded flex flex-col items-center justify-center border font-serif ${event.id === "e2" || event.id === "e3"
                      ? "bg-soft-peach/10 border-soft-peach/30 text-[#e09f3e]"
                      : "bg-sky-blue/10 border-sky-blue/30 text-primary"
                      }`}>
                      <span className="text-[10px] font-bold uppercase leading-none">{event.month}</span>
                      <span className="text-lg font-bold leading-none mt-0.5">{event.day}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-primary leading-tight truncate">{event.title}</p>
                      <p className="text-[11px] text-on-surface-variant/80 mt-0.5 truncate">{event.location} • {event.time}</p>
                    </div>

                    <div>
                      {event.status === "Pending" ? (
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleStatusChange(event.id, "Accepted")}
                            className="p-1 rounded-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 transition-colors"
                            title="Accept Invite"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(event.id, "Declined")}
                            className="p-1 rounded-full bg-red-600/10 hover:bg-red-600/20 text-red-700 transition-colors"
                            title="Decline Invite"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <CheckCircle className="w-4 h-4 text-azure-blue" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Script Library Grid */}
      <section className="mt-8 border-t border-outline-variant/20 pt-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-primary">Script Library</h3>
            <p className="text-sm text-on-surface-variant">Access your current scripts and archival performances.</p>
          </div>
          <div className="flex gap-2 border border-outline-variant/30 rounded p-1 bg-surface-container-low">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors rounded ${viewMode === "grid" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors rounded ${viewMode === "list" ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-primary"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Script Card 1 */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col transition-transform duration-300 ease-out shadow-sm group"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Cover for The Glass Menagerie"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4sqkPltFhm0AYAPEI_m-bzA3-gRs-aNbqTCr0jsht0rRRXgArArVzs_6lEBLWgm6YesbXdig2Hz5tt1zu20Ub70iCxnBiO0WHyFkbt4GQh2druzvFBfcSbmEYtoWXT7VsiI_ugsqS_rMyjZRlWSfM8c-gnU_-fvjA2JJ2OdiWtaO5pOLsrM-f0T4Es__aV4lCf9kB4AJwPBmAkmJ9xca1RhOZIfNdV0z_48r9N2b-xwVnGoI09RQP7aVO9XCvtIIxW0Uw9QHbyxY"
                />
                <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button className="bg-white hover:bg-surface-container-low text-primary px-6 py-2 text-xs font-semibold uppercase tracking-widest shadow-lg rounded transition-colors">
                    Read Script
                  </button>
                </div>
              </div>
              <div className="p-5">
                <span className="bg-sky-blue/30 text-on-secondary-fixed-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 inline-block">
                  Active Production
                </span>
                <h4 className="text-sm font-bold text-primary mb-1">The Glass Menagerie</h4>
                <p className="text-xs text-on-surface-variant">Tennessee Williams</p>
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant/60 uppercase">Modified 2d ago</span>
                  <button className="text-on-surface-variant/40 hover:text-primary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Script Card 2 */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col transition-transform duration-300 ease-out shadow-sm group"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Cover for Waiting for Godot"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5DSzJKqmTOmxKN3Z7IF3WnTzqcSDlgxkOlBPsodp3SZ7orCUbfEwwCMMIUFiBSZDGQAEzMK3YbQ65-QQSOvcDUjDKgzoDgmruAkUlPbFtNuUwZFDpqYyIkfiiKEu6iZ0lDckvHj1VZa0Aa8KL9Oc_Y7mspluC0d5NWvz7xso3vn-fLc3Dj-Dv-qWfaqtnVUlbRyqdzMBXjkmOUm0Zs4uRgtn_qK8YbjkF5kaxna6QnYr7aYWKk17Cr2CPsB40V_vjqMxXDyKGHVQ"
                />
                <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button className="bg-white hover:bg-surface-container-low text-primary px-6 py-2 text-xs font-semibold uppercase tracking-widest shadow-lg rounded transition-colors">
                    Read Script
                  </button>
                </div>
              </div>
              <div className="p-5">
                <span className="bg-soft-peach/30 text-on-secondary-fixed-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 inline-block">
                  Workshopping
                </span>
                <h4 className="text-sm font-bold text-primary mb-1">Waiting for Godot</h4>
                <p className="text-xs text-on-surface-variant">Samuel Beckett</p>
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant/60 uppercase">Modified 5d ago</span>
                  <button className="text-on-surface-variant/40 hover:text-primary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Script Card 3 */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl overflow-hidden flex flex-col transition-transform duration-300 ease-out shadow-sm group"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Cover for A Midsummer Night's Dream"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy-T7RHXTSFMekwwjjsefa00T3JEYuFHtQcz3J22fDiZavU7pytIDARwuxMUy_Hfj3VZErE8GE6IrXvQ6csoF8_gFKyxjkB3qTDAQnqug6pfVcQP626iKUjsMHu7gZZI40bgjgK3j76xFTvqgDUQpeM_bDmNh_Bi75vdv7jQDnWyCHcxynE861DzxjfQh-OV3C1pHebmLag6KrMj3yelKF-SUSMKhmjEcoM4rs0ffcXL8M9Oc-buJxEfFpM5SoaXVPszVcmHcxciU"
                />
                <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <button className="bg-white hover:bg-surface-container-low text-primary px-6 py-2 text-xs font-semibold uppercase tracking-widest shadow-lg rounded transition-colors">
                    Read Script
                  </button>
                </div>
              </div>
              <div className="p-5">
                <span className="bg-outline-variant/30 text-on-surface-variant px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 inline-block">
                  Archived
                </span>
                <h4 className="text-sm font-bold text-primary mb-1">A Midsummer Night's Dream</h4>
                <p className="text-xs text-on-surface-variant">William Shakespeare</p>
                <div className="mt-4 flex justify-between items-center pt-3 border-t border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant/60 uppercase">Modified 3m ago</span>
                  <button className="text-on-surface-variant/40 hover:text-primary">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Script Card 4 (Add New) */}
            <button className="bg-transparent border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-4 hover:bg-surface-container-low transition-colors min-h-[320px] group shadow-none">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-6 h-6 text-outline" />
              </div>
              <span className="text-xs font-bold text-outline uppercase tracking-widest">
                Add New Script
              </span>
            </button>

          </div>
        ) : (
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl divide-y divide-outline-variant/20 overflow-hidden shadow-sm">
            <div className="p-4 flex items-center gap-4 hover:bg-white transition-colors group">
              <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4sqkPltFhm0AYAPEI_m-bzA3-gRs-aNbqTCr0jsht0rRRXgArArVzs_6lEBLWgm6YesbXdig2Hz5tt1zu20Ub70iCxnBiO0WHyFkbt4GQh2druzvFBfcSbmEYtoWXT7VsiI_ugsqS_rMyjZRlWSfM8c-gnU_-fvjA2JJ2OdiWtaO5pOLsrM-f0T4Es__aV4lCf9kB4AJwPBmAkmJ9xca1RhOZIfNdV0z_48r9N2b-xwVnGoI09RQP7aVO9XCvtIIxW0Uw9QHbyxY" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-primary">The Glass Menagerie</h4>
                <p className="text-xs text-on-surface-variant">Tennessee Williams • Active Production</p>
              </div>
              <Button size="sm" variant="outline" className="border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5">Read Script</Button>
            </div>

            <div className="p-4 flex items-center gap-4 hover:bg-white transition-colors group">
              <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5DSzJKqmTOmxKN3Z7IF3WnTzqcSDlgxkOlBPsodp3SZ7orCUbfEwwCMMIUFiBSZDGQAEzMK3YbQ65-QQSOvcDUjDKgzoDgmruAkUlPbFtNuUwZFDpqYyIkfiiKEu6iZ0lDckvHj1VZa0Aa8KL9Oc_Y7mspluC0d5NWvz7xso3vn-fLc3Dj-Dv-qWfaqtnVUlbRyqdzMBXjkmOUm0Zs4uRgtn_qK8YbjkF5kaxna6QnYr7aYWKk17Cr2CPsB40V_vjqMxXDyKGHVQ" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-primary">Waiting for Godot</h4>
                <p className="text-xs text-on-surface-variant">Samuel Beckett • Workshopping</p>
              </div>
              <Button size="sm" variant="outline" className="border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5">Read Script</Button>
            </div>

            <div className="p-4 flex items-center gap-4 hover:bg-white transition-colors group">
              <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy-T7RHXTSFMekwwjjsefa00T3JEYuFHtQcz3J22fDiZavU7pytIDARwuxMUy_Hfj3VZErE8GE6IrXvQ6csoF8_gFKyxjkB3qTDAQnqug6pfVcQP626iKUjsMHu7gZZI40bgjgK3j76xFTvqgDUQpeM_bDmNh_Bi75vdv7jQDnWyCHcxynE861DzxjfQh-OV3C1pHebmLag6KrMj3yelKF-SUSMKhmjEcoM4rs0ffcXL8M9Oc-buJxEfFpM5SoaXVPszVcmHcxciU" alt="" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-primary">A Midsummer Night's Dream</h4>
                <p className="text-xs text-on-surface-variant">William Shakespeare • Archived</p>
              </div>
              <Button size="sm" variant="outline" className="border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5">Read Script</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
