// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Clock, MapPin, Users, Plus, CheckCircle2, Clock3, XCircle,
  Search, Filter, Sparkles, Trash2, ChevronRight, UserCheck, AlertCircle,
  Megaphone, Shield, User, ArrowUpRight, Check, X, UserX, ChevronDown, Drama, Wrench, BookOpen, Theater
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Participant {
  participation_id: number;
  user_id: number;
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
  status: "Accepted" | "Pending" | "Declined";
  remarks?: string;
}

interface RehearsalEvent {
  id: number;
  title: string;
  description: string;
  category: string;
  venue: string;
  event_date: string;
  formatted_date: string;
  start_time: string;
  end_time: string;
  time_range: string;
  status: string;
  participants: Participant[];
  stats: {
    total_called: number;
    accepted: number;
    pending: number;
    declined: number;
  };
}

const fallbackEnsembleMembers = [
  { id: 1, name: "Abay Nandhiga", email: "23f2000668@ds.study.iitm.ac.in", role: "Secretary & Director", avatarUrl: "/aayam_assets/profiles/utkarsh_yuuhi.jpg" },
  { id: 2, name: "Yuuhi (Utkarsh)", email: "21f1005042@ds.study.iitm.ac.in", role: "Deputy Secretary & Actor", avatarUrl: "/aayam_assets/profiles/abay_nandhiga.jpg" },
  { id: 3, name: "Samarth Shrivastava", email: "21f1002840@ds.study.iitm.ac.in", role: "Chief Production Coordinator", avatarUrl: "/aayam_assets/profiles/samarth_shrivastava.jpg" },
  { id: 4, name: "Krishna Subramanian", email: "23f1000655@ds.study.iitm.ac.in", role: "Technical Crew & Stage Lighting", avatarUrl: "/aayam_assets/profiles/krishna_subramanian.jpg" },
  { id: 5, name: "Kaushal Raj", email: "22f3003301@ds.study.iitm.ac.in", role: "Sponsorship & Outreach Lead", avatarUrl: "/aayam_assets/profiles/sneha_das.jpg" },
  { id: 6, name: "Sneha Das", email: "23f1000100@ds.study.iitm.ac.in", role: "Design Head & Backdrops", avatarUrl: "/aayam_assets/profiles/sylene_bansal.jpg" },
  { id: 7, name: "Harsh Aryan", email: "22f1000888@ds.study.iitm.ac.in", role: "Script Supervisor & Lead Actor", avatarUrl: "/aayam_assets/profiles/harsh_aryan.jpg" },
  { id: 8, name: "Swati Singh", email: "23f2000999@ds.study.iitm.ac.in", role: "Costumes & Stagecraft Coordinator", avatarUrl: "/aayam_assets/profiles/swati_singh.jpg" },
  { id: 9, name: "Tanu Kurade", email: "22f1000222@ds.study.iitm.ac.in", role: "Music Director & Voice Coach", avatarUrl: "/aayam_assets/profiles/tanu_kurade.jpg" },
  { id: 10, name: "S. Sri Vaishnavi", email: "23f1000777@ds.study.iitm.ac.in", role: "Auditions Lead & Lead Actress", avatarUrl: "/aayam_assets/profiles/vaishnavi_srivastava.jpg" },
  { id: 11, name: "Chirag Kumar", email: "21f1001111@ds.study.iitm.ac.in", role: "Sound & Live Acoustic FX", avatarUrl: "/aayam_assets/profiles/chirag_kumar.jpg" },
  { id: 12, name: "Kanishk Mishra", email: "23f3000555@ds.study.iitm.ac.in", role: "Stage Blocking Assistant", avatarUrl: "/aayam_assets/profiles/kanishk_mishra.jpg" },
  { id: 13, name: "Anshi Jain", email: "22f2000444@ds.study.iitm.ac.in", role: "Props Master & Stage Logistics", avatarUrl: "/aayam_assets/profiles/chirag_kumar.jpg" },
  { id: 14, name: "Aditi", email: "23f1000888@ds.study.iitm.ac.in", role: "Lead Artist & Ensemble Performer", avatarUrl: "/aayam_assets/profiles/aditi_drama.jpg" }
];

const avatarFallbackMap: Record<string, string> = {
  "Abay Nandhiga": "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
  "Utkarsh (Yuuhi)": "/aayam_assets/profiles/abay_nandhiga.jpg",
  "Utkarsh / Yuuhi": "/aayam_assets/profiles/abay_nandhiga.jpg",
  "Yuuhi": "/aayam_assets/profiles/abay_nandhiga.jpg",
  "Yuuhi (Utkarsh)": "/aayam_assets/profiles/abay_nandhiga.jpg",
  "Samarth Shrivastava": "/aayam_assets/profiles/samarth_shrivastava.jpg",
  "Krishna Subramanian": "/aayam_assets/profiles/krishna_subramanian.jpg",
  "Harsh Aryan": "/aayam_assets/profiles/harsh_aryan.jpg",
  "Swati Singh": "/aayam_assets/profiles/swati_singh.jpg",
  "Sneha Das": "/aayam_assets/profiles/sylene_bansal.jpg",
  "Tanu Kurade": "/aayam_assets/profiles/tanu_kurade.jpg",
  "S. Sri Vaishnavi": "/aayam_assets/profiles/vaishnavi_srivastava.jpg",
  "Vaishnavi Srivastava": "/aayam_assets/profiles/vaishnavi_srivastava.jpg",
  "Akanksha Kadam": "/aayam_assets/profiles/akanksha_kadam.jpg",
  "Anshi Jain": "/aayam_assets/profiles/chirag_kumar.jpg",
  "Kaushal Raj": "/aayam_assets/profiles/sneha_das.jpg",
  "Gaurav": "/aayam_assets/profiles/chirag_kumar.jpg",
  "Shrit": "/aayam_assets/profiles/harsh_aryan.jpg",
  "Dipanshu Bist": "/aayam_assets/profiles/utkarsh_yuuhi.jpg",
  "Neelotpala": "/aayam_assets/profiles/tanu_kurade.jpg",
  "Kanishk Mishra": "/aayam_assets/profiles/kanishk_mishra.jpg",
  "Chirag Kumar": "/aayam_assets/profiles/chirag_kumar.jpg",
  "Sylene Bansal": "/aayam_assets/profiles/sylene_bansal.jpg",
  "Esha Hinde": "/aayam_assets/profiles/esha_hinde.jpg",
  "Aditi": "/aayam_assets/profiles/aditi_drama.jpg"
};

const resolveAvatar = (name: string, url?: string) => {
  if (name && avatarFallbackMap[name]) return avatarFallbackMap[name];
  if (url) return url;
  return "/aayam_assets/profiles/abay_nandhiga.jpg";
};

const CATEGORIES = [
  { id: "Rehearsals", label: "Rehearsals", subtitle: "Acting & Blocking", icon: Drama },
  { id: "Workshops", label: "Workshops", subtitle: "Technical & Stagecraft", icon: Wrench },
  { id: "Meetups", label: "Meetups", subtitle: "Table-Read & Directorial", icon: BookOpen },
  { id: "Plays", label: "Plays & Showcases", subtitle: "Dress Run & Live Staging", icon: Theater }
];

export default function MaintainerSchedule() {
  const [events, setEvents] = useState<RehearsalEvent[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>(fallbackEnsembleMembers);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedRosterEvent, setSelectedRosterEvent] = useState<RehearsalEvent | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Rehearsals");
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formVenue, setFormVenue] = useState("CLT Main Auditorium, IIT Madras");
  const [formDate, setFormDate] = useState("2026-08-28");
  const [formStartTime, setFormStartTime] = useState("17:30");
  const [formEndTime, setFormEndTime] = useState("20:30");
  const [formNotes, setFormNotes] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [memberSearch, setMemberSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/maintainer/schedule`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch maintainer schedule", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/members`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAllMembers(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch members", err);
    }
  };

  useEffect(() => {
    fetchSchedule();
    fetchMembers();
  }, []);

  const referenceToday = new Date(2026, 7, 20);

  const upcomingEvents = events.filter((ev) => {
    if (!ev.event_date) return true;
    const d = new Date(ev.event_date);
    return d.getTime() >= referenceToday.getTime();
  });

  const pastEvents = events.filter((ev) => {
    if (!ev.event_date) return false;
    const d = new Date(ev.event_date);
    return d.getTime() < referenceToday.getTime();
  });

  const displayList = (activeTab === "upcoming" ? upcomingEvents : pastEvents).filter((ev) => {
    const haystack = `${ev.title} ${ev.category} ${ev.venue} ${ev.description}`.toLowerCase();
    return haystack.includes(searchQuery.toLowerCase());
  });

  // Calculate totals
  const totalUpcomingCalls = upcomingEvents.reduce((acc, ev) => acc + ev.stats.total_called, 0);
  const totalUpcomingAccepted = upcomingEvents.reduce((acc, ev) => acc + ev.stats.accepted, 0);
  const totalUpcomingPending = upcomingEvents.reduce((acc, ev) => acc + ev.stats.pending, 0);
  const confirmationRate = totalUpcomingCalls > 0 ? Math.round((totalUpcomingAccepted / totalUpcomingCalls) * 100) : 100;

  // Past metrics
  const totalPastRegistered = pastEvents.reduce((acc, ev) => acc + ev.stats.total_called, 0);
  const totalPastAttended = pastEvents.reduce((acc, ev) => acc + ev.stats.accepted, 0);
  const pastAttendanceRate = totalPastRegistered > 0 ? Math.round((totalPastAttended / totalPastRegistered) * 100) : 100;

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const selectAllMembers = () => {
    setSelectedUserIds(allMembers.map((m) => m.id));
  };

  const clearSelectedMembers = () => {
    setSelectedUserIds([]);
  };

  const handleCreateCallSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDate) return;
    try {
      setSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/maintainer/schedule/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          category: formCategory,
          venue: formVenue,
          event_date: formDate,
          start_time: formStartTime,
          end_time: formEndTime,
          description: formNotes,
          invited_user_ids: selectedUserIds
        })
      });
      if (res.ok) {
        setCreateModalOpen(false);
        setFormTitle("");
        setFormNotes("");
        setSelectedUserIds([]);
        fetchSchedule();
      }
    } catch (err) {
      console.error("Failed to create call sheet", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to cancel and remove this call sheet?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/maintainer/schedule/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId })
      });
      if (res.ok) {
        fetchSchedule();
        if (selectedRosterEvent?.id === eventId) {
          setSelectedRosterEvent(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const filteredMembersForModal = allMembers.filter((m) => {
    const haystack = `${m.name} ${m.email} ${m.role || ""}`.toLowerCase();
    return haystack.includes(memberSearch.toLowerCase());
  });

  const selectedCategoryObj = CATEGORIES.find(c => c.id === formCategory) || CATEGORIES[0];
  const CategoryIcon = selectedCategoryObj.icon;

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 md:px-8 font-sans text-[#2C2A28] pb-24">
      
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8B4AE]/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] bg-[#E85F57]/15 px-3 py-1 rounded-full border border-[#E85F57]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#B32D25]" />
            <span>STAGE MANAGEMENT & CALLBOARD</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
            Production Schedule & Callboard
          </h1>
          <p className="text-sm text-[#5C3B37] max-w-2xl font-light">
            Issue rehearsal call sheets, dispatch actor notifications, and track live attendance registers.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/schedule"
            className="px-5 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Calendar className="w-4 h-4 text-[#8C241E]" />
            <span>My Personal Schedule</span>
          </Link>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F]"
          >
            <Plus className="w-4 h-4 text-[#FFD0CC]" /> Issue New Call Sheet
          </button>
        </div>
      </section>

      {/* Metrics Dashboard - Theatrical Crimson Theme */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#784A45] mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Upcoming Calls</span>
            <div className="w-8 h-8 rounded-full bg-[#E85F57]/15 flex items-center justify-center text-[#B32D25]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#2A1816]">{upcomingEvents.length}</div>
          <p className="text-xs text-[#6E4742] mt-1 font-light">Active rehearsals & showcases</p>
        </div>

        <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#784A45] mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Dispatched Calls</span>
            <div className="w-8 h-8 rounded-full bg-[#E85F57]/15 flex items-center justify-center text-[#B32D25]">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#2A1816]">{totalUpcomingCalls}</div>
          <p className="text-xs text-[#6E4742] mt-1 font-light">Total member invitations</p>
        </div>

        <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#784A45] mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Confirmation Rate</span>
            <div className="w-8 h-8 rounded-full bg-emerald-700/15 flex items-center justify-center text-emerald-800">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#1B4D3E]">{confirmationRate}%</div>
          <p className="text-xs text-[#6E4742] mt-1 font-light">{totalUpcomingAccepted} confirmed / {totalUpcomingPending} pending</p>
        </div>

        <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#784A45] mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Past Attendance</span>
            <div className="w-8 h-8 rounded-full bg-[#E85F57]/15 flex items-center justify-center text-[#784A45]">
              <Clock3 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#2A1816]">{pastAttendanceRate}%</div>
          <p className="text-xs text-[#6E4742] mt-1 font-light">{totalPastAttended} attended of {totalPastRegistered} logged</p>
        </div>
      </section>

      {/* Main Schedule Roster Table - Theatrical Crimson Container */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2rem] p-8 shadow-sm space-y-6">
        
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D8B4AE]/70">
          {/* Tab Switcher */}
          <div className="flex items-center bg-[#E5D2CB] p-1 rounded-full border border-[#D2A59D]">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "upcoming"
                  ? "bg-[#8C241E] text-[#FDF8F7] shadow-md shadow-[#8C241E]/20"
                  : "text-[#6E4742] hover:text-[#2A1816]"
              }`}
            >
              Upcoming Calls ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "past"
                  ? "bg-[#8C241E] text-[#FDF8F7] shadow-md shadow-[#8C241E]/20"
                  : "text-[#6E4742] hover:text-[#2A1816]"
              }`}
            >
              Past Archive ({pastEvents.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C5A54]" />
            <input
              type="text"
              placeholder="Search call sheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-full border border-[#D5AAA2] bg-[#E8D6CF]/60 text-xs text-[#2A1816] focus:outline-none focus:border-[#B32D25] focus:bg-[#E8D6CF] transition-all placeholder:text-[#8C5A54]/70"
            />
          </div>
        </div>

        {/* Call Sheet Grid */}
        <div className="space-y-4">
          {displayList.map((ev) => {
            const isPast = activeTab === "past";
            const attendedCount = ev.stats.accepted;
            const nonAttendedCount = ev.stats.total_called - ev.stats.accepted;
            const attendancePct = ev.stats.total_called > 0 ? Math.round((attendedCount / ev.stats.total_called) * 100) : 0;

            return (
              <div
                key={ev.id}
                className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-6 hover:border-[#B32D25]/60 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xs"
              >
                {/* Left Details */}
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-[#8C241E] text-[#FDF8F7] rounded-full text-[9px] font-mono font-bold uppercase tracking-widest border border-[#A6352F]">
                      {ev.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#B32D25] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {ev.formatted_date}
                    </span>
                    <span className="text-xs font-mono text-[#6E4742] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {ev.time_range}
                    </span>
                    {isPast && (
                      <span className="px-2.5 py-0.5 bg-[#E8D5CE] text-[#5C3B37] rounded-md text-[9px] font-mono font-bold uppercase tracking-wider border border-[#D5AAA2]">
                        Concluded Session
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#2A1816] leading-tight">{ev.title}</h3>
                  
                  <p className="text-xs text-[#5C3B37] flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#B32D25]" /> {ev.venue}
                  </p>

                  {ev.description && (
                    <p className="text-xs text-[#6E4742] pt-1 leading-relaxed">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] mr-1.5">Note:</span>
                      {ev.description}
                    </p>
                  )}
                </div>

                {/* Right Attendance Roster Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 self-start lg:self-center">
                  
                  {/* Attendance Stats */}
                  <div className="space-y-2 min-w-[220px]">
                    {isPast ? (
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                          <span className="text-emerald-800">{attendedCount} Attended ({attendancePct}%)</span>
                          <span className="text-[#6E4742]">{nonAttendedCount} Absent</span>
                        </div>
                        <div className="h-2.5 w-full bg-[#E3CEC6] rounded-full overflow-hidden flex shadow-inner">
                          <div
                            style={{ width: `${attendancePct}%` }}
                            className="bg-emerald-600 h-full transition-all"
                          />
                          <div
                            style={{ width: `${100 - attendancePct}%` }}
                            className="bg-[#C8AFA7] h-full transition-all"
                          />
                        </div>
                        <div className="text-[10px] font-mono text-[#6E4742] mt-1.5">
                          {ev.stats.total_called} total members registered
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
                          <span className="text-[#2A1816]">{ev.stats.total_called} Members Called</span>
                          <span className="text-emerald-800">{ev.stats.accepted} Confirmed</span>
                        </div>
                        
                        {/* Visual Progress Bar */}
                        <div className="h-2.5 w-full bg-[#D5C9BE] rounded-full overflow-hidden flex shadow-inner">
                          <div
                            style={{ width: `${ev.stats.total_called > 0 ? (ev.stats.accepted / ev.stats.total_called) * 100 : 0}%` }}
                            className="bg-emerald-600 h-full"
                          />
                          <div
                            style={{ width: `${ev.stats.total_called > 0 ? (ev.stats.pending / ev.stats.total_called) * 100 : 0}%` }}
                            className="bg-amber-600 h-full"
                          />
                          <div
                            style={{ width: `${ev.stats.total_called > 0 ? (ev.stats.declined / ev.stats.total_called) * 100 : 0}%` }}
                            className="bg-[#B32D25] h-full"
                          />
                        </div>

                        <div className="flex items-center gap-3 text-[10px] font-mono text-[#6E4742] mt-1.5">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> {ev.stats.accepted} Yes</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600 inline-block" /> {ev.stats.pending} Pend</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B32D25] inline-block" /> {ev.stats.declined} No</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions in Theatrical Crimson */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedRosterEvent(ev)}
                      className="h-10 px-5 rounded-xl bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-[#A6352F]"
                    >
                      {isPast ? <UserCheck className="w-3.5 h-3.5 text-[#FFD0CC]" /> : <Users className="w-3.5 h-3.5 text-[#FFD0CC]" />}
                      <span>{isPast ? "Attendance Register" : "Call Roster"}</span>
                    </button>
                    {!isPast && (
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="h-10 w-10 rounded-xl border border-[#D5AAA2] text-[#8C241E] hover:bg-[#EEDBD5] flex items-center justify-center transition-all cursor-pointer"
                        title="Cancel Call Sheet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {displayList.length === 0 && (
            <div className="py-16 text-center text-[#6E4742]">
              <Calendar className="w-10 h-10 text-[#C8AFA7] mx-auto mb-3 opacity-70" />
              <p className="font-serif text-lg font-bold text-[#2A1816]">No call sheets found</p>
              <p className="text-xs text-[#6E4742] mt-1">
                {activeTab === "upcoming" ? "Issue a new call sheet to schedule rehearsals and call actors." : "No concluded rehearsal archives found."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* MODAL: Issue New Call Sheet (Theatrical Crimson Themed with Custom Dropdown & Aligned Close Button) */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-4xl max-w-4xl w-full bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-0 max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
          
          {/* Custom Elegantly Positioned Close Button */}
          <button
            type="button"
            onClick={() => setCreateModalOpen(false)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
            title="Close dialog"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 text-left">
            <DialogHeader className="pb-4 border-b border-[#D8B4AE]/70 pr-10">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] mb-1">
                <Megaphone className="w-3.5 h-3.5" />
                <span>DIRECTOR DISPATCH</span>
              </div>
              <DialogTitle className="font-serif text-3xl font-bold text-[#2A1816]">
              Issue Rehearsal Call Sheet
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5C3B37]">
              Schedule a production session, set directorial requirements, and select cast & crew members to notify.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCallSheet} className="space-y-6 mt-4">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Directorial Directives & Timings (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">
                    Call Sheet Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Act 1 Blocking & Technical Cue Sync"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full h-11 rounded-xl border border-[#D5AAA2] bg-[#E8D6CF]/70 px-4 text-sm font-semibold text-[#2A1816] focus:outline-none focus:border-[#B32D25] focus:bg-[#E8D6CF] transition-all placeholder:text-[#8C5A54]/60 shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Styled Custom Category Dropdown */}
                  <div className="space-y-1.5 relative" ref={dropdownRef}>
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">
                      Category
                    </label>
                    <button
                      type="button"
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      className="w-full h-11 rounded-xl border border-[#D5AAA2] bg-[#E8D6CF]/70 px-3.5 flex items-center justify-between text-xs font-bold text-[#2A1816] focus:outline-none focus:border-[#B32D25] shadow-inner hover:bg-[#E8D6CF] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CategoryIcon className="w-3.5 h-3.5 text-[#B32D25] shrink-0" />
                        <span className="truncate">{selectedCategoryObj.label}</span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#784A45] transition-transform duration-200 shrink-0 ${categoryDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Popover Menu */}
                    {categoryDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
                        {CATEGORIES.map((cat) => {
                          const ItemIcon = cat.icon;
                          const isSelected = formCategory === cat.id;

                          return (
                            <div
                              key={cat.id}
                              onClick={() => {
                                setFormCategory(cat.id);
                                setCategoryDropdownOpen(false);
                              }}
                              className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-[#EEDBD5] text-[#2A1816] font-bold"
                                  : "hover:bg-[#F2E5E0] text-[#5C3B37]"
                              }`}
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <ItemIcon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#B32D25]" : "text-[#784A45]"}`} />
                                <div className="truncate">
                                  <p className="text-xs leading-tight">{cat.label}</p>
                                  <p className="text-[10px] text-[#8C5A54]/80 font-normal">{cat.subtitle}</p>
                                </div>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-[#B32D25] stroke-[2.5]" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">
                      Venue / Stage *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., CLT Auditorium, IITM"
                      value={formVenue}
                      onChange={(e) => setFormVenue(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#D5AAA2] bg-[#E8D6CF]/70 px-4 text-xs font-medium text-[#2A1816] focus:outline-none focus:border-[#B32D25] shadow-inner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#D5AAA2] bg-[#E8D6CF]/70 px-3 text-xs font-bold text-[#2A1816] focus:outline-none focus:border-[#B32D25] shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">
                        Start
                      </label>
                      <input
                        type="time"
                        value={formStartTime}
                        onChange={(e) => setFormStartTime(e.target.value)}
                        className="w-full h-11 rounded-xl border border-[#D5AAA2] bg-[#E8D6CF]/70 px-2 text-xs font-bold text-[#2A1816] focus:outline-none focus:border-[#B32D25] text-center shadow-inner"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">
                        End
                      </label>
                      <input
                        type="time"
                        value={formEndTime}
                        onChange={(e) => setFormEndTime(e.target.value)}
                        className="w-full h-11 rounded-xl border border-[#D5AAA2] bg-[#E8D6CF]/70 px-2 text-xs font-bold text-[#2A1816] focus:outline-none focus:border-[#B32D25] text-center shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">
                    Director Instructions & Rehearsal Notes
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g., Scene 3 blocking run. Full wardrobe & props mandatory. Technical lighting console cues will be timed."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full rounded-xl border border-[#D5AAA2] bg-[#E8D6CF]/70 p-3 text-xs font-medium text-[#2A1816] focus:outline-none focus:border-[#B32D25] resize-none shadow-inner"
                  />
                </div>
              </div>

              {/* Right Column: Cast & Crew Dispatch Selector (5 cols) */}
              <div className="lg:col-span-5 bg-[#FDFBF7] border border-[#DDD0C8] rounded-2xl p-5 flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">
                        Call Cast & Crew ({selectedUserIds.length})
                      </h4>
                      <p className="text-[10px] text-[#6E4742]">Select ensemble members to dispatch calls.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={selectAllMembers}
                        className="text-[10px] font-mono font-bold text-[#B32D25] hover:underline uppercase cursor-pointer"
                      >
                        All
                      </button>
                      <span className="text-[#D5AAA2]">|</span>
                      <button
                        type="button"
                        onClick={clearSelectedMembers}
                        className="text-[10px] font-mono font-bold text-[#6E4742] hover:underline uppercase cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C5A54]" />
                    <input
                      type="text"
                      placeholder="Filter ensemble..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 rounded-lg border border-[#D5AAA2] bg-[#E8D6CF]/50 text-xs text-[#2A1816] focus:outline-none focus:border-[#B32D25]"
                    />
                  </div>

                  {/* Scrollable Member Cards */}
                  <div className="space-y-1.5 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredMembersForModal.map((member) => {
                      const isSelected = selectedUserIds.includes(member.id);
                      const memberAvatar = resolveAvatar(member.name, member.avatarUrl);

                      return (
                        <div
                          key={member.id}
                          onClick={() => toggleUserSelection(member.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            isSelected
                              ? "bg-[#8C241E] text-[#FDF8F7] border-[#8C241E] shadow-xs"
                              : "bg-[#F5EAE6] border-[#DCBAB2] text-[#2A1816] hover:bg-[#EEDBD5]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <img
                              src={memberAvatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover border border-[#D5AAA2] shrink-0"
                            />
                            <div className="truncate">
                              <p className="text-xs font-bold truncate leading-tight">{member.name}</p>
                              <p className={`text-[9px] truncate ${isSelected ? "text-[#FFD0CC]" : "text-[#6E4742]"}`}>
                                {member.role || "Ensemble Member"}
                              </p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${
                            isSelected ? "bg-[#B32D25] border-[#FFD0CC] text-[#FDF8F7]" : "border-[#D5AAA2] bg-[#E8D6CF]"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}

                    {filteredMembersForModal.length === 0 && (
                      <div className="py-6 text-center text-xs text-[#6E4742]">
                        No members found matching "{memberSearch}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D8B4AE]/70 text-[10px] font-mono text-[#6E4742] flex items-center justify-between">
                  <span>Selected for call:</span>
                  <span className="font-bold text-[#2A1816]">{selectedUserIds.length} members</span>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#D8B4AE]/70">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#6E4742] hover:bg-[#EEDBD5] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || selectedUserIds.length === 0}
                className="px-7 py-3 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2 border border-[#A6352F]"
              >
                <Megaphone className="w-3.5 h-3.5 text-[#FFD0CC]" />
                <span>{submitting ? "Dispatching..." : `Dispatch Call Sheet (${selectedUserIds.length} Members)`}</span>
              </button>
            </div>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: View Call Roster & Live Attendance (Theatrical Crimson Themed with Aligned Close Button) */}
      <Dialog open={!!selectedRosterEvent} onOpenChange={(open) => !open && setSelectedRosterEvent(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-3xl max-w-3xl w-full bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-0 max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative">
          
          {/* Custom Elegantly Positioned Close Button */}
          <button
            type="button"
            onClick={() => setSelectedRosterEvent(null)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
            title="Close register"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {selectedRosterEvent && (() => {
            const isPast = activeTab === "past";
            const attendedCount = selectedRosterEvent.stats.accepted;
            const nonAttendedCount = selectedRosterEvent.stats.total_called - selectedRosterEvent.stats.accepted;

            return (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-10 space-y-6 text-left">
                <DialogHeader className="pb-4 border-b border-[#D8B4AE]/70 pr-10">
                  <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] mb-1">
                    {isPast ? <UserCheck className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                    <span>{isPast ? "PAST REPERTOIRE ATTENDANCE REGISTER" : "LIVE CALL SHEET ROSTER"}</span>
                  </div>
                  <DialogTitle className="font-serif text-3xl font-bold text-[#2A1816]">
                    {selectedRosterEvent.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#5C3B37] flex items-center gap-2 mt-1">
                    <span>{selectedRosterEvent.formatted_date} • {selectedRosterEvent.time_range}</span>
                    <span>•</span>
                    <span className="font-medium text-[#2A1816]">{selectedRosterEvent.venue}</span>
                  </DialogDescription>
                </DialogHeader>

                {/* Breakdown Summary Stats */}
                {isPast ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#FDFBF7] border border-emerald-400/80 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900">Confirmed Attended</div>
                        <div className="text-2xl font-bold font-serif text-emerald-950 mt-0.5">{attendedCount} Members</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-4 bg-[#FDFBF7] border border-[#DDD0C8] rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E4742]">Did Not Attend / Absent</div>
                        <div className="text-2xl font-bold font-serif text-[#2A1816] mt-0.5">{nonAttendedCount} Members</div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-[#EEDBD5] flex items-center justify-center text-[#6E4742]">
                        <UserX className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 bg-[#FDFBF7] border border-emerald-400/80 rounded-2xl text-center">
                      <div className="text-2xl font-bold font-serif text-emerald-950">{selectedRosterEvent.stats.accepted}</div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 mt-0.5">Attending</div>
                    </div>
                    <div className="p-3.5 bg-[#FDFBF7] border border-amber-400/80 rounded-2xl text-center">
                      <div className="text-2xl font-bold font-serif text-amber-950">{selectedRosterEvent.stats.pending}</div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900 mt-0.5">Pending Reply</div>
                    </div>
                    <div className="p-3.5 bg-[#FDFBF7] border border-[#DDD0C8] rounded-2xl text-center">
                      <div className="text-2xl font-bold font-serif text-[#8C241E]">{selectedRosterEvent.stats.declined}</div>
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C241E] mt-0.5">Declined</div>
                    </div>
                  </div>
                )}

                {/* Member Roster List */}
                <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                  {selectedRosterEvent.participants.map((p) => {
                    const memberAvatar = resolveAvatar(p.name, p.avatar_url);
                    const isAttended = p.status === "Accepted";

                    return (
                      <div
                        key={p.participation_id}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#DDD0C8] hover:border-[#B32D25]/50 transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={memberAvatar}
                            alt={p.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#D5AAA2] shadow-xs"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#2A1816] leading-tight">{p.name}</p>
                            <p className="text-xs text-[#6E4742] mt-0.5">{p.role}</p>
                            <p className="text-[10px] text-[#8C5A54]/80 font-mono mt-0.5">{p.email}</p>
                          </div>
                        </div>

                        <div>
                          {isPast ? (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                              isAttended
                                ? "bg-emerald-700/15 text-emerald-900 border-emerald-700/30"
                                : "bg-[#E8D5CE] text-[#5C3B37] border-[#D5AAA2]"
                            }`}>
                              {isAttended ? "Attended" : "Did Not Attend"}
                            </span>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                              p.status === "Accepted"
                                ? "bg-emerald-700/15 text-emerald-900 border-emerald-700/30"
                                : p.status === "Declined"
                                ? "bg-[#8C241E]/15 text-[#8C241E] border-[#8C241E]/30"
                                : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                            }`}>
                              {p.status === "Accepted" ? "Confirmed" : p.status === "Declined" ? "Declined" : "Pending Call"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {selectedRosterEvent.participants.length === 0 && (
                    <div className="py-8 text-center text-xs text-[#6E4742]">
                      No ensemble members called for this session.
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t border-[#D8B4AE]/70">
                  <button
                    onClick={() => setSelectedRosterEvent(null)}
                    className="px-6 py-2 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer border border-[#A6352F]"
                  >
                    Close Register
                  </button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
