// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Search, Plus, MapPin, Clock, Users, Shield, FileText, ArrowRight,
  CheckCircle2, DollarSign, Building, Tag, ExternalLink, Activity, PlayCircle,
  Sparkles, X, HeartHandshake, ClipboardList, Check, AlertCircle, Video, Star,
  SlidersHorizontal, ChevronRight, RefreshCw, UserCheck, UserX, MessageSquare
} from "lucide-react";

interface EventItem {
  id: string | number;
  title: string;
  category: string;
  date: string;
  venue: string;
  timeRange?: string;
  status: string;
  description?: string;
  play_id?: number;
  auditionCount?: number;
  applicantCount?: number;
  volunteerCount?: number;
}

export default function EventsManagement() {
  const [activeTab, setActiveTab] = useState<"calendar" | "proposals" | "sponsors">("calendar");
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Auditions & Volunteer Data
  const [allPositions, setAllPositions] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [allVolunteers, setAllVolunteers] = useState<any[]>([]);

  // Modals
  const [selectedEventForAuditions, setSelectedEventForAuditions] = useState<EventItem | null>(null);
  const [selectedEventForVolunteers, setSelectedEventForVolunteers] = useState<EventItem | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Proposals & Sponsors
  const [proposals, setProposals] = useState([
    { id: 101, name: "Acoustic Folk Jam & Vocal Modulations", submitter: "Sneha Das (22f3000456)", type: "Member Workshop Pitch", budget: "₹25,000", status: "Reviewing", submittedDate: "Aug 18, 2026" },
    { id: 102, name: "Physical Movement & Navarasa Mime", submitter: "Samarth Shrivastava (21f1002840)", type: "Society Pitch", budget: "₹35,000", status: "Approved", submittedDate: "Aug 14, 2026" },
    { id: 103, name: "Street Play Rhythms & Dholak Masterclass", submitter: "Utkarsh Yuuhi (21f1005042)", type: "Society Pitch", budget: "₹18,000", status: "Approved", submittedDate: "Aug 10, 2026" }
  ]);

  const [sponsors, setSponsors] = useState([
    { id: 1, sponsor: "Red Bull India", ad_title: "Campus Drama Lounge", category: "Playbill Banner", budget: "₹1,50,000", status: "Approved", contact: "partnerships@redbull.in" },
    { id: 2, sponsor: "FabIndia Ethnic", ad_title: "Period Drama Costumes", category: "Stage Wardrobe Sponsor", budget: "₹85,000", status: "Approved", contact: "campus@fabindia.net" },
    { id: 3, sponsor: "AudioCraft Consoles", ad_title: "Proscenium Sound Sponsor", category: "Hardware Partner", budget: "₹1,20,000", status: "Reviewing", contact: "support@audiocraft.in" }
  ]);

  // Load backend data
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Plays & Events
      const [playsRes, eventsRes, posRes, appsRes, volsRes] = await Promise.all([
        fetch("/api/plays").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/events").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/audition-positions").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/audition-applications").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/volunteers").then(r => r.ok ? r.json() : []).catch(() => [])
      ]);

      setAllPositions(posRes);
      setAllApplications(appsRes);
      setAllVolunteers(volsRes);

      // Consolidate into unified events list
      const unifiedEvents: EventItem[] = [];

      // Add Upcoming & Current Plays
      if (Array.isArray(playsRes) && playsRes.length > 0) {
        playsRes.forEach((p: any) => {
          const playPositions = posRes.filter((pos: any) => 
            (pos.production_name || "").toLowerCase().includes(p.title.toLowerCase()) ||
            p.title.toLowerCase().includes((pos.production_name || "").toLowerCase())
          );
          const playApps = appsRes.filter((app: any) => 
            (app.production_name || "").toLowerCase().includes(p.title.toLowerCase()) ||
            p.title.toLowerCase().includes((app.production_name || "").toLowerCase())
          );
          const playVols = volsRes.filter((v: any) => 
            String(v.play_id) === String(p.id) ||
            (v.play_title || "").toLowerCase().includes(p.title.toLowerCase()) ||
            p.title.toLowerCase().includes((v.play_title || "").toLowerCase())
          );

          unifiedEvents.push({
            id: `play-${p.id}`,
            play_id: p.id,
            title: p.title,
            category: "Plays",
            date: p.dates || "Autumn Season 2026",
            venue: p.venue || "CLT Main Stage",
            timeRange: p.runtime || "110 Mins",
            status: !p.is_past ? "Open Production" : "Repertory Archive",
            description: p.description || p.tagline,
            auditionCount: playPositions.length,
            applicantCount: playApps.length,
            volunteerCount: playVols.length
          });
        });
      }

      // Add Workshops & Meetups from Events API or defaults
      const workshopMeetupItems = [
        {
          id: "evt-101",
          title: "Musimprov (with Akord) - Musical Improv Session",
          category: "Workshops",
          date: "Aug 15, 2026",
          venue: "Student Activity Centre (SAC), IIT Madras",
          timeRange: "17:00 - 19:30",
          status: "Concluded",
          description: "Joint session with Akord music club blending spontaneous theatrical improv with live vocal rhythms.",
          auditionCount: 0,
          applicantCount: 0,
          volunteerCount: 4
        },
        {
          id: "evt-102",
          title: "Stage Lighting & DMX Rigging Masterclass",
          category: "Workshops",
          date: "Aug 12, 2026",
          venue: "Tech Booth CLT, IIT Madras",
          timeRange: "16:00 - 18:30",
          status: "Concluded",
          description: "Technical crew masterclass covering DMX lighting consoles, spot gels, and cue timing for live plays.",
          auditionCount: 1,
          applicantCount: 2,
          volunteerCount: 3
        },
        {
          id: "evt-103",
          title: "August Script Reading Circle - Autumn Plays",
          category: "Meetups",
          date: "Aug 23, 2026",
          venue: "Aayam Rehearsal Hall, SAC",
          timeRange: "18:00 - 20:30",
          status: "Confirmed",
          description: "Full table-read session covering Hayavadana Act I and Ashadh Ka Ek Din with live character allocations.",
          auditionCount: 0,
          applicantCount: 0,
          volunteerCount: 2
        }
      ];

      // Merge avoiding duplicate titles
      workshopMeetupItems.forEach(item => {
        if (!unifiedEvents.some(e => e.title === item.title)) {
          unifiedEvents.push(item);
        }
      });

      setEventsList(unifiedEvents);
    } catch (err) {
      console.error("Error loading events management data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update volunteer status
  const handleUpdateVolunteerStatus = async (volId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/volunteer/${volId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAllVolunteers(prev => prev.map(v => v.id === volId ? { ...v, status: newStatus } : v));
        setActionSuccessMsg(`Volunteer request updated to '${newStatus}'.`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error("Error updating volunteer status:", err);
    }
  };

  // Update audition application status
  const handleUpdateAppStatus = async (appId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/audition-application/${appId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setAllApplications(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
        setActionSuccessMsg(`Audition candidate status updated to '${newStatus}'.`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error("Error updating application status:", err);
    }
  };

  // Filtering
  const filteredEvents = eventsList.filter(ev => {
    const matchesSearch = (ev.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ev.venue || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || ev.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Get specific event auditions & volunteers
  const getEventPositions = (eventTitle: string) => {
    return allPositions.filter(p => 
      (p.production_name || "").toLowerCase().includes(eventTitle.toLowerCase()) ||
      eventTitle.toLowerCase().includes((p.production_name || "").toLowerCase())
    );
  };

  const getEventApplications = (eventTitle: string) => {
    return allApplications.filter(a => 
      (a.production_name || "").toLowerCase().includes(eventTitle.toLowerCase()) ||
      eventTitle.toLowerCase().includes((a.production_name || "").toLowerCase())
    );
  };

  const getEventVolunteers = (eventTitle: string, playId?: number) => {
    return allVolunteers.filter(v => 
      (playId && String(v.play_id) === String(playId)) ||
      (v.play_title || "").toLowerCase().includes(eventTitle.toLowerCase()) ||
      eventTitle.toLowerCase().includes((v.play_title || "").toLowerCase())
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 md:px-8 font-sans text-[#5C3B37] selection:bg-[#8C241E]/20">
      
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FAF2EE] text-[#2A1816] px-5 py-3.5 rounded-2xl border border-emerald-700/30 shadow-2xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
          <span className="text-xs font-mono font-bold">{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg(null)} className="text-[#8C5A54] hover:text-[#2A1816]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Editorial Header */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
              <Calendar className="w-3.5 h-3.5 text-[#8C241E]" />
              <span>SOCIETY REPERTOIRE & OPERATIONAL DESK</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Events & Season Management
            </h1>
            <p className="text-xs sm:text-sm text-[#6E4742] max-w-2xl font-serif italic">
              Coordinate production premieres, manage open audition callboards, and review backstage crew volunteer requests.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#FAF2EE] p-1.5 rounded-full border border-[#DCBAB2] shadow-xs shrink-0 self-start md:self-auto">
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'calendar' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Event Roster ({eventsList.length})
            </button>
            <button 
              onClick={() => setActiveTab("proposals")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'proposals' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Pitches ({proposals.length})
            </button>
            <button 
              onClick={() => setActiveTab("sponsors")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'sponsors' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Sponsors ({sponsors.length})
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Tab Content */}
      {activeTab === "calendar" && (
        <section className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#DCBAB2]/60 pb-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8C5A54] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events, plays, workshops, venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl text-xs text-[#2A1816] placeholder-[#8C5A54] focus:outline-none focus:border-[#8C241E]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
              {["All", "Plays", "Workshops", "Meetups"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    categoryFilter === cat
                      ? "bg-[#8C241E] text-[#FDF8F7] border border-[#A6352F] shadow-xs"
                      : "bg-[#FAF2EE] text-[#5C3B37] hover:bg-[#EEDBD5] border border-[#DCBAB2]"
                  }`}
                >
                  {cat}
                </button>
              ))}
              
              <button
                onClick={fetchData}
                className="p-2 rounded-full border border-[#DCBAB2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] transition-all cursor-pointer shrink-0"
                title="Refresh events and requests"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Events & Productions Grid */}
          {loading ? (
            <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm">
              Loading society productions, auditions, and volunteer calls...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm space-y-3">
              <p>No events or productions match your search criteria.</p>
              <button
                onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }}
                className="text-xs font-mono text-[#8C241E] font-bold uppercase tracking-wider underline cursor-pointer"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map(ev => {
                const eventPositions = getEventPositions(ev.title);
                const eventApps = getEventApplications(ev.title);
                const eventVols = getEventVolunteers(ev.title, ev.play_id);

                return (
                  <div 
                    key={ev.id} 
                    className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-7 hover:border-[#B32D25]/50 hover:shadow-md transition-all flex flex-col justify-between group space-y-6 shadow-xs"
                  >
                    <div className="space-y-4">
                      {/* Top Category & Status Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-[#DCBAB2]/50 pb-3">
                        <span className="inline-block px-3 py-0.5 bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2] rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                          {ev.category}
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          ev.status.includes("Open") || ev.status === "Scheduled" || ev.status === "Confirmed"
                            ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                            : "bg-[#EEDBD5] text-[#5C3B37] border-[#D5AAA2]"
                        }`}>
                          {ev.status}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="font-serif text-2xl text-[#2A1816] leading-snug font-normal group-hover:text-[#8C241E] transition-colors">
                        {ev.title}
                      </h3>

                      {/* Description */}
                      {ev.description && (
                        <p className="text-xs text-[#5C3B37] font-light leading-relaxed line-clamp-2">
                          {ev.description}
                        </p>
                      )}

                      {/* Schedule & Venue Metadata */}
                      <div className="space-y-1.5 pt-2 border-t border-[#DCBAB2]/40 text-xs font-mono text-[#5C3B37]">
                        <p className="flex items-center gap-1.5 truncate">
                          <Calendar className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                          <span className="truncate">{ev.date}</span>
                        </p>
                        <p className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                          <span className="truncate">{ev.venue}</span>
                        </p>
                      </div>

                      {/* Live Counter Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#F5EAE6] border border-[#DEBEB7] text-[#5C3B37]">
                          🎭 {eventPositions.length} Audition Roles ({eventApps.length} Candidates)
                        </span>
                        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#F5EAE6] border border-[#DEBEB7] text-[#5C3B37]">
                          🤝 {eventVols.length} Volunteer Requests
                        </span>
                      </div>
                    </div>

                    {/* TWO DEDICATED ACTION BUTTONS */}
                    <div className="pt-4 border-t border-[#DCBAB2]/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      {/* Button 1: Auditions & Casting Calls */}
                      <button
                        onClick={() => setSelectedEventForAuditions(ev)}
                        className="flex-1 px-4 py-2.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 border border-[#A6352F]"
                        title="View open auditions & review candidate applications"
                      >
                        <ClipboardList className="w-3.5 h-3.5 text-[#FFD0CC]" />
                        <span>Auditions ({eventApps.length})</span>
                      </button>

                      {/* Button 2: Crew Volunteer Requests */}
                      <button
                        onClick={() => setSelectedEventForVolunteers(ev)}
                        className="flex-1 px-4 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        title="View and approve backstage crew volunteer applications"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#8C241E]" />
                        <span>Volunteers ({eventVols.length})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* AUDITIONS & CANDIDATES MODAL */}
      {selectedEventForAuditions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEventForAuditions(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8 border-b border-[#DCBAB2]/70 pb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                Audition & Casting Calls
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
                {selectedEventForAuditions.title}
              </h2>
              <p className="text-xs text-[#5C3B37]">
                Review open role quotas and evaluate submitted actor/crew audition reels.
              </p>
            </div>

            {/* Sub-section 1: Open Calling Roles */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>Open Audition Roles ({getEventPositions(selectedEventForAuditions.title).length})</span>
              </h3>

              {getEventPositions(selectedEventForAuditions.title).length === 0 ? (
                <div className="p-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl text-xs font-serif italic text-[#8C5A54]">
                  No specific calling positions logged for this event. You can create roles in the Auditions Management portal.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getEventPositions(selectedEventForAuditions.title).map(pos => (
                    <div key={pos.id} className="p-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-mono uppercase font-bold text-[#8C241E] block">
                            {pos.role_category}
                          </span>
                          <h4 className="font-serif text-base text-[#2A1816] font-normal leading-tight">
                            {pos.role_name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-[#EEDBD5] px-2 py-0.5 rounded-full text-[#8C241E] shrink-0">
                          {pos.slots_available} Slots
                        </span>
                      </div>
                      {pos.requirements && (
                        <p className="text-[11px] text-[#6E4742] line-clamp-2">
                          <strong>Req:</strong> {pos.requirements}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-section 2: Candidate Applications */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Submitted Candidate Applications ({getEventApplications(selectedEventForAuditions.title).length})</span>
                </h3>
                <Link
                  to="/maintainer-auditions"
                  className="text-xs font-mono font-bold text-[#8C241E] hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>Open Full Casting Desk</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {getEventApplications(selectedEventForAuditions.title).length === 0 ? (
                <div className="p-6 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl text-center text-xs font-serif italic text-[#8C5A54]">
                  No audition reels submitted yet for this production.
                </div>
              ) : (
                <div className="space-y-3">
                  {getEventApplications(selectedEventForAuditions.title).map(app => (
                    <div key={app.id} className="p-4 sm:p-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCBAB2]/40 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-lg text-[#2A1816] font-normal">{app.candidate_name}</span>
                            <span className="text-[10px] font-mono text-[#8C5A54]">({app.applicant_email || app.roll_number})</span>
                          </div>
                          <span className="text-xs font-mono text-[#8C241E] font-semibold">Applying for: {app.role_name}</span>
                        </div>

                        {/* Status update controls */}
                        <div className="flex items-center gap-2">
                          <select
                            value={app.status || "Under Review"}
                            onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                            className="bg-[#F5EAE6] border border-[#D5AAA2] rounded-xl px-3 py-1.5 text-xs font-mono text-[#2A1816] font-semibold focus:outline-none focus:border-[#8C241E] cursor-pointer"
                          >
                            <option value="Under Review">Under Review</option>
                            <option value="Audition Scheduled">Audition Scheduled</option>
                            <option value="Selected">Selected</option>
                            <option value="Waitlisted">Waitlisted</option>
                            <option value="Declined">Declined</option>
                          </select>
                        </div>
                      </div>

                      {/* Statement / Video */}
                      <div className="space-y-1 text-xs text-[#5C3B37]">
                        {app.audition_statement && (
                          <p className="font-light italic text-[#6E4742]">"{app.audition_statement}"</p>
                        )}
                        {app.video_url && (
                          <p className="flex items-center gap-1.5 text-[#8C241E] font-mono text-[11px] pt-1">
                            <Video className="w-3.5 h-3.5" />
                            <a href={app.video_url} target="_blank" rel="noreferrer" className="underline font-bold">
                              View Audition Reel / Slate
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VOLUNTEER REQUESTS MODAL */}
      {selectedEventForVolunteers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedEventForVolunteers(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8 border-b border-[#DCBAB2]/70 pb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                Production Crew Volunteers
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
                Volunteer Calls for {selectedEventForVolunteers.title}
              </h2>
              <p className="text-xs text-[#5C3B37]">
                Review student crew applications for backstage lighting, stagehands, makeup, and front-of-house management.
              </p>
            </div>

            {/* Volunteer List */}
            {getEventVolunteers(selectedEventForVolunteers.title, selectedEventForVolunteers.play_id).length === 0 ? (
              <div className="p-8 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl text-center text-xs font-serif italic text-[#8C5A54] space-y-2">
                <p>No volunteer applications submitted yet for this event.</p>
                <p className="text-[11px] font-mono text-[#8C5A54]">Member applications through the portal will appear here immediately.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {getEventVolunteers(selectedEventForVolunteers.title, selectedEventForVolunteers.play_id).map(vol => (
                  <div 
                    key={vol.id}
                    className="p-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-3 hover:border-[#B32D25]/40 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DCBAB2]/40 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-lg text-[#2A1816] font-normal">{vol.applicant_name}</h4>
                          <span className="text-[10px] font-mono text-[#8C5A54]">({vol.applicant_email})</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono pt-0.5">
                          <span className="text-[#8C241E] font-bold uppercase">{vol.department}</span>
                          <span className="text-[#8C5A54]">•</span>
                          <span className="text-[#5C3B37]">{vol.phone || "No phone provided"}</span>
                        </div>
                      </div>

                      {/* Status pill & quick decision buttons */}
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                          vol.status === "Approved"
                            ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                            : vol.status === "Declined"
                            ? "bg-stone-200 text-stone-600 border-stone-300"
                            : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                        }`}>
                          {vol.status || "Pending Review"}
                        </span>

                        {vol.status !== "Approved" && (
                          <button
                            onClick={() => handleUpdateVolunteerStatus(vol.id, "Approved")}
                            className="px-3 py-1 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer border border-[#A6352F]"
                            title="Approve volunteer for this crew department"
                          >
                            <UserCheck className="w-3 h-3 text-[#FFD0CC]" />
                            <span>Approve</span>
                          </button>
                        )}

                        {vol.status !== "Declined" && (
                          <button
                            onClick={() => handleUpdateVolunteerStatus(vol.id, "Declined")}
                            className="px-3 py-1 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#6E4742] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            title="Decline volunteer application"
                          >
                            <UserX className="w-3 h-3 text-[#8C241E]" />
                            <span>Decline</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Statement & Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {vol.availability && (
                        <div className="bg-[#F5EAE6] p-2.5 rounded-xl border border-[#DEBEB7]">
                          <span className="font-mono text-[10px] uppercase font-bold text-[#8C5A54] block">Availability</span>
                          <span className="text-[#5C3B37]">{vol.availability}</span>
                        </div>
                      )}
                      {vol.experience && (
                        <div className="bg-[#F5EAE6] p-2.5 rounded-xl border border-[#DEBEB7]">
                          <span className="font-mono text-[10px] uppercase font-bold text-[#8C5A54] block">Past Experience</span>
                          <span className="text-[#5C3B37]">{vol.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proposals Tab */}
      {activeTab === "proposals" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
            <div className="space-y-0.5">
              <h2 className="font-serif text-2xl text-[#2A1816] font-normal">Member Pitches & Workshop Ideas</h2>
              <p className="text-xs text-[#6E4742]">Community proposals under directorial review</p>
            </div>
          </div>
          
          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DCBAB2] bg-[#F5EAE6]">
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Proposal Title</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Submitter</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Estimated Budget</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCBAB2]/50">
                {proposals.map(prop => (
                  <tr key={prop.id} className="hover:bg-[#F5EAE6]/60 transition-colors">
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-serif text-base font-normal text-[#2A1816] block leading-tight">{prop.name}</span>
                      <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider inline-block mt-0.5">{prop.type}</span>
                    </td>
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-sans text-xs text-[#2A1816] font-medium">{prop.submitter}</span>
                    </td>
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-700/15 px-3 py-1 rounded-full border border-emerald-700/30">
                        {prop.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 align-top text-right">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        prop.status === "Approved"
                          ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                          : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                      }`}>
                        {prop.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Sponsors Tab */}
      {activeTab === "sponsors" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
            <div className="space-y-0.5">
              <h2 className="font-serif text-2xl text-[#2A1816] font-normal">Sponsor & Brand Partnerships</h2>
              <p className="text-xs text-[#6E4742]">Production festival sponsors, playbill ads, and equipment partners</p>
            </div>
          </div>
          
          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DCBAB2] bg-[#F5EAE6]">
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Brand Partner</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Placement Category</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Contract Revenue</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCBAB2]/50">
                {sponsors.map(sp => (
                  <tr key={sp.id} className="hover:bg-[#F5EAE6]/60 transition-colors">
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-serif text-base font-normal text-[#2A1816] block leading-tight">{sp.sponsor}</span>
                      <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider inline-block mt-0.5">{sp.ad_title}</span>
                    </td>
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-sans text-xs text-[#5C3B37]">{sp.category}</span>
                    </td>
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-700/15 px-3 py-1 rounded-full border border-emerald-700/30">
                        {sp.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 align-top text-right">
                      <span className="text-[10px] font-mono text-emerald-950 font-bold uppercase tracking-wider px-3 py-1 bg-emerald-700/15 rounded-full border border-emerald-700/30">
                        {sp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

