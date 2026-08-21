// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Search, Plus, MapPin, Clock, Users, Shield, FileText, ArrowRight,
  CheckCircle2, DollarSign, Building, Tag, ExternalLink, Activity, PlayCircle,
  Sparkles, X, HeartHandshake, ClipboardList, Check, AlertCircle, Video, Star,
  SlidersHorizontal, ChevronRight, RefreshCw, UserCheck, UserX, MessageSquare,
  BookOpen, Edit3, Send, CheckSquare, XCircle, ArrowUpRight
} from "lucide-react";
import ScriptPreviewModal from "@/components/ScriptPreviewModal";
import { getPlaybookForTitle } from "@/data/playbooksData";
import type { Playbook } from "@/data/playbooksData";

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

interface ProposalItem {
  id: number;
  name: string;
  title?: string;
  description: string;
  date: string;
  event_date?: string;
  venue: string;
  location_or_link?: string;
  budget: string;
  proposalType: string;
  sourceType: "Member" | "Sponsor";
  status: string;
  contact_email: string;
  contact_phone: string;
  submitter: {
    name: string;
    initials: string;
    email: string;
    phone: string;
  };
}

export default function EventsManagement() {
  const [activeTab, setActiveTab] = useState<"calendar" | "pitches">("calendar");
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [proposalsList, setProposalsList] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Pitches Tab Filter
  const [pitchSourceFilter, setPitchSourceFilter] = useState<"all" | "member" | "sponsor">("all");
  const [pitchStatusFilter, setPitchStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Auditions & Volunteer Data
  const [allPositions, setAllPositions] = useState<any[]>([]);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [allVolunteers, setAllVolunteers] = useState<any[]>([]);

  // Modals
  const [selectedEventForAuditions, setSelectedEventForAuditions] = useState<EventItem | null>(null);
  const [selectedEventForVolunteers, setSelectedEventForVolunteers] = useState<EventItem | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Script Preview Modal
  const [previewScript, setPreviewScript] = useState<Playbook | null>(null);
  const [scriptModalOpen, setScriptModalOpen] = useState<boolean>(false);

  // Review & Edit Pitch Modal
  const [editingPitch, setEditingPitch] = useState<ProposalItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    category: "Workshops",
    venue: "",
    event_date: "2026-09-15",
    description: "",
    budget: "",
    max_participants: 60
  });
  const [submittingDecision, setSubmittingDecision] = useState<boolean>(false);

  const handleOpenScriptPreview = (eventItem: EventItem) => {
    const playbook = getPlaybookForTitle(eventItem.title);
    setPreviewScript(playbook);
    setScriptModalOpen(true);
  };

  // Load backend data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [playsRes, eventsRes, posRes, appsRes, volsRes, propsRes] = await Promise.all([
        fetch("/api/plays").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/events").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/audition-positions").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/audition-applications").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/volunteers").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/proposals").then(r => r.ok ? r.json() : []).catch(() => [])
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

      // Add Events from DB
      if (Array.isArray(eventsRes) && eventsRes.length > 0) {
        eventsRes.forEach((ev: any) => {
          if (!unifiedEvents.some(e => e.title.toLowerCase() === ev.title.toLowerCase())) {
            const evPositions = posRes.filter((pos: any) => 
              (pos.production_name || "").toLowerCase().includes(ev.title.toLowerCase()) ||
              ev.title.toLowerCase().includes((pos.production_name || "").toLowerCase())
            );
            const evApps = appsRes.filter((app: any) => 
              (app.production_name || "").toLowerCase().includes(ev.title.toLowerCase()) ||
              ev.title.toLowerCase().includes((app.production_name || "").toLowerCase())
            );
            const evVols = volsRes.filter((v: any) => 
              (v.play_title || "").toLowerCase().includes(ev.title.toLowerCase()) ||
              ev.title.toLowerCase().includes((v.play_title || "").toLowerCase())
            );

            unifiedEvents.push({
              id: `evt-${ev.id}`,
              title: ev.title,
              category: ev.category || "Workshops",
              date: ev.date || "Scheduled 2026",
              venue: ev.venue || "SAC Main Hall",
              timeRange: ev.timeRange || "17:30 - 20:00",
              status: ev.status === "concluded" ? "Concluded" : "Scheduled",
              description: ev.description,
              auditionCount: evPositions.length,
              applicantCount: evApps.length,
              volunteerCount: evVols.length
            });
          }
        });
      }

      setEventsList(unifiedEvents);

      // Map proposals / pitches
      if (Array.isArray(propsRes) && propsRes.length > 0) {
        setProposalsList(propsRes);
      } else {
        // Fallback default rich pitches if DB not yet seeded
        setProposalsList([
          {
            id: 1,
            name: "Navarasa Monologue Intensive & Emotional Subtext Masterclass",
            description: "A 4-day intensive acting laboratory exploring classical Rasa Abhinaya (Bhayanaka, Shringara, Raudra, Karuna) and vocal resonance control for collegiate actors preparing for Autumn 2026 mainstage productions.",
            date: "Sep 15, 2026",
            venue: "Aayam Black Box Studio, SAC",
            budget: "₹20,000",
            proposalType: "Member Workshop Pitch",
            sourceType: "Member",
            status: "Pending",
            contact_email: "aditi.sharma@study.iitm.ac.in",
            contact_phone: "+91 98450 12345",
            submitter: {
              name: "Aditi Sharma",
              initials: "AS",
              email: "aditi.sharma@study.iitm.ac.in",
              phone: "+91 98450 12345"
            }
          },
          {
            id: 2,
            name: "Campus Monologue Competition & Dramatic Open Mic",
            description: "A pan-campus dramatic monologue competition featuring student-written pieces and classical Hindi/English dramatic adaptations evaluated by alumni directors.",
            date: "Sep 22, 2026",
            venue: "OAT Amphitheatre Steps",
            budget: "₹30,000",
            proposalType: "Member Event Pitch",
            sourceType: "Member",
            status: "Pending",
            contact_email: "aditi.sharma@study.iitm.ac.in",
            contact_phone: "+91 98450 12345",
            submitter: {
              name: "Aditi Sharma",
              initials: "AS",
              email: "aditi.sharma@study.iitm.ac.in",
              phone: "+91 98450 12345"
            }
          },
          {
            id: 3,
            name: "Acoustic Folk Jam & Vocal Modulations",
            description: "An intimate evening blending vocal breathing exercises, Hindustani folk chanting, and acoustic musical cues with Akord music society.",
            date: "Sep 10, 2026",
            venue: "SAC Acoustic Room, IIT Madras",
            budget: "₹25,000",
            proposalType: "Member Workshop Pitch",
            sourceType: "Member",
            status: "Pending",
            contact_email: "sneha.das@study.iitm.ac.in",
            contact_phone: "+91 98301 77654",
            submitter: {
              name: "Sneha Das",
              initials: "SD",
              email: "sneha.das@study.iitm.ac.in",
              phone: "+91 98301 77654"
            }
          },
          {
            id: 4,
            name: "Red Bull Campus Drama Lounge & Stage Energy Partner",
            description: "Exclusive Energy Drink & Artist Hospitality Partner for Autumn 2026 providing branded green rooms, foyer sampling kiosks, and playbill back-cover ad placement across all Autumn 2026 productions.",
            date: "Sep 18, 2026",
            venue: "CLT Main Foyer & Green Room",
            budget: "₹1,50,000",
            proposalType: "Sponsor Ad Proposal",
            sourceType: "Sponsor",
            status: "Pending",
            contact_email: "partnerships@redbull.in",
            contact_phone: "+91 98110 44321",
            submitter: {
              name: "Rohan Sharma (Red Bull India)",
              initials: "RB",
              email: "partnerships@redbull.in",
              phone: "+91 98110 44321"
            }
          },
          {
            id: 5,
            name: "FabIndia Ethnic Wardrobe & Stage Handloom Sponsorship",
            description: "Stage Wardrobe Craft & Handloom Partner providing authentic handloom drapes and period costumes for classical productions in exchange for playbill inserts and foyer exhibits.",
            date: "Sep 25, 2026",
            venue: "CLT Main Stage",
            budget: "₹85,000",
            proposalType: "Sponsor Ad Proposal",
            sourceType: "Sponsor",
            status: "Approved",
            contact_email: "campus@fabindia.net",
            contact_phone: "+91 98201 88765",
            submitter: {
              name: "Ananya Deshmukh (FabIndia)",
              initials: "FD",
              email: "campus@fabindia.net",
              phone: "+91 98201 88765"
            }
          }
        ]);
      }
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

  // Open Edit & Review modal for a pitch
  const handleOpenEditPitch = (pitch: ProposalItem) => {
    setEditingPitch(pitch);
    setEditFormData({
      title: pitch.name || pitch.title || "",
      category: (pitch.proposalType || "").toLowerCase().includes("workshop") ? "Workshops" : "Meetups",
      venue: pitch.venue || pitch.location_or_link || "SAC Rehearsal Studio",
      event_date: "2026-09-15",
      description: pitch.description || "",
      budget: pitch.budget || "₹25,000",
      max_participants: 60
    });
  };

  // Approve Pitch & Convert into Public Event
  const handleApproveAndPublishPitch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPitch) return;
    setSubmittingDecision(true);

    try {
      const payload = {
        title: editFormData.title,
        category: editFormData.category,
        venue: editFormData.venue,
        event_date: editFormData.event_date,
        description: editFormData.description,
        budget: editFormData.budget,
        max_participants: editFormData.max_participants
      };

      const res = await fetch(`/api/proposals/${editingPitch.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        // Update local proposal state
        setProposalsList(prev => prev.map(p => p.id === editingPitch.id ? { ...p, status: "Approved", ...payload, name: payload.title } : p));
        
        // Append newly created event to local events list
        const newEvt: EventItem = {
          id: `evt-appr-${editingPitch.id}`,
          title: payload.title,
          category: payload.category,
          date: payload.event_date,
          venue: payload.venue,
          timeRange: "17:30 - 20:00",
          status: "Scheduled",
          description: payload.description,
          auditionCount: 0,
          applicantCount: 0,
          volunteerCount: 0
        };
        setEventsList(prev => [newEvt, ...prev]);

        setActionSuccessMsg(`Pitch approved! Published '${payload.title}' to the Events Roster.`);
        setTimeout(() => setActionSuccessMsg(null), 5000);
        setEditingPitch(null);
      }
    } catch (err) {
      console.error("Error approving proposal:", err);
    } finally {
      setSubmittingDecision(false);
    }
  };

  // Quick Approve Pitch without opening modal
  const handleQuickApprove = async (pitch: ProposalItem) => {
    try {
      const res = await fetch(`/api/proposals/${pitch.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: pitch.name,
          description: pitch.description,
          venue: pitch.venue,
          budget: pitch.budget
        })
      });
      if (res.ok) {
        setProposalsList(prev => prev.map(p => p.id === pitch.id ? { ...p, status: "Approved" } : p));
        const newEvt: EventItem = {
          id: `evt-appr-${pitch.id}`,
          title: pitch.name,
          category: pitch.proposalType.includes("Workshop") ? "Workshops" : "Meetups",
          date: "Autumn 2026",
          venue: pitch.venue,
          timeRange: "17:30 - 20:00",
          status: "Scheduled",
          description: pitch.description,
          auditionCount: 0,
          applicantCount: 0,
          volunteerCount: 0
        };
        setEventsList(prev => [newEvt, ...prev]);
        setActionSuccessMsg(`Pitch '${pitch.name}' approved and added to Events Roster.`);
        setTimeout(() => setActionSuccessMsg(null), 4000);
      }
    } catch (err) {
      console.error("Error quick approving pitch:", err);
    }
  };

  // Reject / Decline Pitch
  const handleRejectPitch = async (pitchId: number) => {
    try {
      const res = await fetch(`/api/proposals/${pitchId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setProposalsList(prev => prev.map(p => p.id === pitchId ? { ...p, status: "Rejected" } : p));
        setActionSuccessMsg("Proposal request declined.");
        setTimeout(() => setActionSuccessMsg(null), 4000);
        if (editingPitch && editingPitch.id === pitchId) {
          setEditingPitch(null);
        }
      }
    } catch (err) {
      console.error("Error rejecting pitch:", err);
    }
  };

  // Filtering Events
  const filteredEvents = eventsList.filter(ev => {
    const matchesSearch = (ev.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ev.venue || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === "All" || ev.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCat;
  });

  // Filtering Pitches
  const filteredPitches = proposalsList.filter(p => {
    const pTitle = (p.name || p.title || "").toLowerCase();
    const pSubmitter = (p.submitter?.name || "").toLowerCase();
    const pDesc = (p.description || "").toLowerCase();
    const matchesSearch = pTitle.includes(searchQuery.toLowerCase()) || 
                          pSubmitter.includes(searchQuery.toLowerCase()) ||
                          pDesc.includes(searchQuery.toLowerCase());

    const isMember = (p.proposalType || "").toLowerCase().includes("member") || p.sourceType === "Member";
    const isSponsor = (p.proposalType || "").toLowerCase().includes("sponsor") || (p.proposalType || "").toLowerCase().includes("ad") || p.sourceType === "Sponsor";

    const matchesSource = 
      pitchSourceFilter === "all" ? true :
      pitchSourceFilter === "member" ? isMember :
      isSponsor;

    const pStatus = (p.status || "pending").toLowerCase();
    const matchesStatus = 
      pitchStatusFilter === "all" ? true :
      pitchStatusFilter === "pending" ? (pStatus === "pending" || pStatus === "reviewing") :
      pitchStatusFilter === "approved" ? (pStatus === "approved") :
      (pStatus === "rejected" || pStatus === "declined");

    return matchesSearch && matchesSource && matchesStatus;
  });

  const memberPitchesCount = proposalsList.filter(p => (p.proposalType || "").toLowerCase().includes("member") || p.sourceType === "Member").length;
  const sponsorPitchesCount = proposalsList.filter(p => (p.proposalType || "").toLowerCase().includes("sponsor") || (p.proposalType || "").toLowerCase().includes("ad") || p.sourceType === "Sponsor").length;

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
          <button onClick={() => setActionSuccessMsg(null)} className="text-[#8C5A54] hover:text-[#2A1816] cursor-pointer">
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
              Coordinate production premieres, evaluate member event pitches, review sponsor partnerships, and manage backstage crew calls.
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
              onClick={() => setActiveTab("pitches")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'pitches' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Pitches & Proposals ({proposalsList.length})
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: EVENT ROSTER */}
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
                className="w-full pl-10 pr-4 py-2 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl text-xs text-[#2A1816] placeholder-[#8C5A54] focus:outline-hidden focus:border-[#8C241E]"
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

          {/* Events Grid (Clean & Structured with No Overflow or Emojis) */}
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
                    className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 sm:p-7 hover:border-[#B32D25]/50 hover:shadow-md transition-all flex flex-col justify-between group space-y-5 shadow-xs overflow-hidden"
                  >
                    <div className="space-y-4">
                      {/* Top Category & Status Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-[#DCBAB2]/50 pb-3">
                        <span className="inline-block px-3 py-0.5 bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2] rounded-full text-[10px] font-mono font-bold uppercase tracking-wider truncate">
                          {ev.category}
                        </span>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${
                          ev.status.includes("Open") || ev.status === "Scheduled" || ev.status === "Confirmed"
                            ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                            : "bg-[#EEDBD5] text-[#5C3B37] border-[#D5AAA2]"
                        }`}>
                          {ev.status}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3 className="font-serif text-xl sm:text-2xl text-[#2A1816] leading-snug font-normal group-hover:text-[#8C241E] transition-colors break-words">
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

                      {/* Clean Stats Counters (No Emojis) */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-1 text-[11px] font-mono">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5EAE6] border border-[#DEBEB7] text-[#5C3B37] truncate">
                          <Users className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                          <span className="truncate">{eventPositions.length} Roles ({eventApps.length} Candidates)</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5EAE6] border border-[#DEBEB7] text-[#5C3B37] truncate">
                          <HeartHandshake className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                          <span className="truncate">{eventVols.length} Volunteers</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pt-4 border-t border-[#DCBAB2]/60 flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      {/* Button 1: Auditions */}
                      <button
                        onClick={() => setSelectedEventForAuditions(ev)}
                        className="flex-1 min-w-[100px] px-3 py-2 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5 border border-[#A6352F]"
                        title="View open auditions & candidate reels"
                      >
                        <ClipboardList className="w-3.5 h-3.5 text-[#FFD0CC]" />
                        <span className="truncate">Auditions ({eventApps.length})</span>
                      </button>

                      {/* Button 2: Volunteers */}
                      <button
                        onClick={() => setSelectedEventForVolunteers(ev)}
                        className="flex-1 min-w-[100px] px-3 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                        title="View backstage crew applications"
                      >
                        <HeartHandshake className="w-3.5 h-3.5 text-[#8C241E]" />
                        <span className="truncate">Volunteers ({eventVols.length})</span>
                      </button>

                      {/* Button 3: Script Preview */}
                      <button
                        onClick={() => handleOpenScriptPreview(ev)}
                        className="px-3.5 py-2 rounded-full border border-[#D5AAA2] bg-[#F5EAE6] hover:bg-[#EEDBD5] text-[#8C241E] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs shrink-0"
                        title="Preview Society Playbook Script"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#8C241E]" />
                        <span>Script</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PITCHES & PROPOSALS (Editorial Cards for Member & Sponsor Requests) */}
      {activeTab === "pitches" && (
        <section className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCBAB2]/60 pb-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#8C5A54] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pitches by title, submitter, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl text-xs text-[#2A1816] placeholder-[#8C5A54] focus:outline-hidden focus:border-[#8C241E]"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Source Tabs */}
              <div className="flex items-center gap-1 bg-[#FAF2EE] p-1 rounded-full border border-[#DCBAB2] shadow-xs">
                <button
                  onClick={() => setPitchSourceFilter("all")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    pitchSourceFilter === "all"
                      ? "bg-[#8C241E] text-[#FDF8F7]"
                      : "text-[#5C3B37] hover:bg-[#EEDBD5]"
                  }`}
                >
                  All ({proposalsList.length})
                </button>
                <button
                  onClick={() => setPitchSourceFilter("member")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    pitchSourceFilter === "member"
                      ? "bg-[#8C241E] text-[#FDF8F7]"
                      : "text-[#5C3B37] hover:bg-[#EEDBD5]"
                  }`}
                >
                  Member Pitches ({memberPitchesCount})
                </button>
                <button
                  onClick={() => setPitchSourceFilter("sponsor")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    pitchSourceFilter === "sponsor"
                      ? "bg-[#8C241E] text-[#FDF8F7]"
                      : "text-[#5C3B37] hover:bg-[#EEDBD5]"
                  }`}
                >
                  Sponsor Ads ({sponsorPitchesCount})
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={pitchStatusFilter}
                onChange={(e) => setPitchStatusFilter(e.target.value as any)}
                className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-full px-3.5 py-1.5 text-xs font-mono text-[#2A1816] font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Declined</option>
              </select>
            </div>
          </div>

          {/* Pitches Cards Grid */}
          {filteredPitches.length === 0 ? (
            <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm space-y-2">
              <p>No proposals match your current filter settings.</p>
              <button
                onClick={() => { setSearchQuery(""); setPitchSourceFilter("all"); setPitchStatusFilter("all"); }}
                className="text-xs font-mono text-[#8C241E] font-bold uppercase underline cursor-pointer"
              >
                Reset Pitch Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPitches.map(pitch => {
                const isMember = (pitch.proposalType || "").toLowerCase().includes("member") || pitch.sourceType === "Member";
                const isApproved = (pitch.status || "").toLowerCase() === "approved";
                const isRejected = (pitch.status || "").toLowerCase() === "rejected" || (pitch.status || "").toLowerCase() === "declined";

                return (
                  <div
                    key={pitch.id}
                    className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-7 hover:border-[#B32D25]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-6 shadow-xs group"
                  >
                    <div className="space-y-4">
                      {/* Top Header: Submitter & Type Tag */}
                      <div className="flex items-start justify-between gap-3 border-b border-[#DCBAB2]/50 pb-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-[#EEDBD5] border border-[#D5AAA2] text-[#8C241E] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            {pitch.submitter?.initials || (isMember ? "M" : "SP")}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-serif text-sm text-[#2A1816] font-normal truncate">
                              {pitch.submitter?.name || "Ensemble Member"}
                            </h4>
                            <p className="text-[10px] font-mono text-[#8C5A54] truncate">
                              {pitch.contact_email || pitch.submitter?.email || ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isMember 
                              ? "bg-[#EEDBD5] text-[#8C241E] border-[#D5AAA2]"
                              : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                          }`}>
                            {isMember ? "Member Pitch" : "Sponsor Ad"}
                          </span>

                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isApproved
                              ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                              : isRejected
                              ? "bg-stone-200 text-stone-600 border-stone-300"
                              : "bg-amber-700/15 text-amber-950 border-amber-700/30"
                          }`}>
                            {pitch.status || "Pending"}
                          </span>
                        </div>
                      </div>

                      {/* Pitch Title */}
                      <h3 className="font-serif text-2xl text-[#2A1816] leading-snug font-normal group-hover:text-[#8C241E] transition-colors">
                        {pitch.name || pitch.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#5C3B37] font-light leading-relaxed">
                        {pitch.description}
                      </p>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#DCBAB2]/40 text-xs font-mono text-[#5C3B37]">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                          <span className="truncate">{pitch.venue || pitch.location_or_link || "SAC Rehearsal Studio"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <DollarSign className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                          <span className="truncate font-bold text-emerald-950">{pitch.budget || "₹25,000"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Controls */}
                    <div className="pt-4 border-t border-[#DCBAB2]/60 flex items-center justify-between gap-3">
                      <div className="text-[10px] font-mono text-[#8C5A54]">
                        Proposed: {pitch.date || "Sep 2026"}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Review & Edit Modal Trigger */}
                        <button
                          onClick={() => handleOpenEditPitch(pitch)}
                          className="px-4 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          title="Review pitch details, adjust date/venue, and approve to events"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#8C241E]" />
                          <span>Review & Edit</span>
                        </button>

                        {/* Quick Approve (if not already approved) */}
                        {!isApproved && (
                          <button
                            onClick={() => handleQuickApprove(pitch)}
                            className="px-4 py-2 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-xs border border-[#A6352F]"
                            title="Quick approve and schedule to public events"
                          >
                            <Check className="w-3.5 h-3.5 text-[#FFD0CC]" />
                            <span>Approve</span>
                          </button>
                        )}

                        {/* Quick Reject (if pending) */}
                        {!isApproved && !isRejected && (
                          <button
                            onClick={() => handleRejectPitch(pitch.id)}
                            className="p-2 rounded-full border border-[#D5AAA2] hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-all cursor-pointer"
                            title="Decline proposal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* MODAL: REVIEW & EDIT PITCH BEFORE PASSING TO EVENTS */}
      {editingPitch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setEditingPitch(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8 border-b border-[#DCBAB2]/70 pb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                Directorial Proposal Review
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
                Review & Edit Pitch Details
              </h2>
              <p className="text-xs text-[#5C3B37]">
                Submitted by <strong className="text-[#2A1816]">{editingPitch.submitter?.name || "Ensemble Member"}</strong> ({editingPitch.contact_email}). You can adjust the scheduled date, venue, and description before publishing to the society events roster.
              </p>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleApproveAndPublishPitch} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Event Title</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] cursor-pointer"
                  >
                    <option value="Workshops">Workshops & Masterclasses</option>
                    <option value="Meetups">Meetups & Script Readings</option>
                    <option value="Plays">Stage Production Preview</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.event_date}
                    onChange={(e) => setEditFormData({ ...editFormData, event_date: e.target.value })}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Assigned Venue</label>
                  <input
                    type="text"
                    required
                    value={editFormData.venue}
                    onChange={(e) => setEditFormData({ ...editFormData, venue: e.target.value })}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Budget / Terms</label>
                  <input
                    type="text"
                    value={editFormData.budget}
                    onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">Description & Agenda</label>
                <textarea
                  rows={4}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl p-3 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] leading-relaxed font-sans font-normal"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#DCBAB2]/70 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleRejectPitch(editingPitch.id)}
                  className="px-4 py-2.5 rounded-full border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Decline Pitch
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPitch(null)}
                    className="px-4 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingDecision}
                    className="px-6 py-2.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#A6352F] disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 text-[#FFD0CC]" />
                    <span>{submittingDecision ? "Publishing..." : "Approve & Publish to Events"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
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
                            className="bg-[#F5EAE6] border border-[#D5AAA2] rounded-xl px-3 py-1.5 text-xs font-mono text-[#2A1816] font-semibold focus:outline-hidden focus:border-[#8C241E] cursor-pointer"
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

      {/* SCRIPT PREVIEW MODAL */}
      <ScriptPreviewModal
        open={scriptModalOpen}
        onClose={() => setScriptModalOpen(false)}
        script={previewScript}
      />
    </div>
  );
}
