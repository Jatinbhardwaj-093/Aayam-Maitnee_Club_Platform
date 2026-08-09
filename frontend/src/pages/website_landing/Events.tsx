// @ts-nocheck
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Tag,
  Plus,
  Send,
  Sparkles,
  Building2,
  Megaphone,
  Check
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Event {
  id: string | number;
  title: string;
  description: string;
  category: string;
  categoryBg: string;
  categoryColor: string;
  date: string;
  day: number;
  month: string;
  image: string;
  status: "upcoming" | "concluded";
  venue: string;
  timeRange: string;
  host: string;
  priceInfo: string;
  capacity: string;
}

const getCategoryStyles = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("play")) {
    return { bg: "bg-[#BFDDF0] text-[#2e4a5a]", color: "text-[#2e4a5a]" };
  } else if (cat.includes("workshop") || cat.includes("masterclass")) {
    return { bg: "bg-[#FFEBCC] text-[#765d00]", color: "text-[#765d00]" };
  } else if (cat.includes("sponsor") || cat.includes("ad")) {
    return { bg: "bg-amber-100 text-amber-900", color: "text-amber-900" };
  } else {
    return { bg: "bg-[#E2FDFF] text-[#324b4d]", color: "text-[#324b4d]" };
  }
};

const fallbackEvents: Event[] = [
  {
    id: 1,
    title: "Musimprov (with Akord) - Musical Improv Session",
    description: "A vibrant joint session with Akord music club blending spontaneous theatrical improv with live vocal rhythms.",
    category: "Workshops",
    categoryBg: "bg-[#FFEBCC] text-[#765d00]",
    categoryColor: "text-[#765d00]",
    date: "Aug 15, 2026",
    day: 15,
    month: "AUG",
    image: "/aayam_assets/tamashbin_user_3.jpg",
    status: "upcoming",
    venue: "Student Activity Centre (SAC), IIT Madras",
    timeRange: "17:00 - 19:30",
    host: "Abay Nandhiga",
    priceInfo: "Free Entry",
    capacity: "60 seats"
  },
  {
    id: 2,
    title: "Sahitya Sabha - Chit-Chat & Jamming Session",
    description: "Casual script reading, poetry jamming, and creative discussion over hot chai.",
    category: "Meetups",
    categoryBg: "bg-[#E2FDFF] text-[#324b4d]",
    categoryColor: "text-[#324b4d]",
    date: "Aug 22, 2026",
    day: 22,
    month: "AUG",
    image: "/aayam_assets/samatvam_user_4.jpg",
    status: "upcoming",
    venue: "Aayam Lounge, IITM Campus",
    timeRange: "18:00 - 20:00",
    host: "Utkarsh (Yuuhi)",
    priceInfo: "Free Entry",
    capacity: "50 seats"
  },
  {
    id: 3,
    title: "Theatre Masterclass with Gyaneshwar Mishra",
    description: "Exclusive masterclass on voice modulation, spatial awareness, and classical stage blocking.",
    category: "Workshops",
    categoryBg: "bg-[#FFEBCC] text-[#765d00]",
    categoryColor: "text-[#765d00]",
    date: "Sep 10, 2026",
    day: 10,
    month: "SEP",
    image: "/aayam_assets/kky_user_2.jpg",
    status: "upcoming",
    venue: "CLT Seminar Room, IIT Madras",
    timeRange: "10:00 - 14:00",
    host: "Samarth Shrivastava",
    priceInfo: "Registration Required",
    capacity: "40 seats"
  },
  {
    id: 4,
    title: "Darpan 2026 Annual Drama Festival",
    description: "Aayam's signature annual festival featuring Abhinaya Mono-acting, Envisage Directorial, and ScreenKraft Script Writing competitions.",
    category: "Plays",
    categoryBg: "bg-[#BFDDF0] text-[#2e4a5a]",
    categoryColor: "text-[#2e4a5a]",
    date: "Oct 05, 2026",
    day: 5,
    month: "OCT",
    image: "/aayam_assets/dddj_user_3.jpg",
    status: "upcoming",
    venue: "Open Air Theatre & CLT, IIT Madras",
    timeRange: "10:00 - 22:00",
    host: "Abay Nandhiga",
    priceInfo: "Free Festival Pass",
    capacity: "300 seats"
  }
];

export default function Events() {
  const contextData = useOutletContext<{ activeUser?: any }>() || {};
  const activeUser = contextData.activeUser || JSON.parse(sessionStorage.getItem("aayam_active_user") || "null");

  const [events, setEvents] = useState<Event[]>(fallbackEvents);
  const [filter, setFilter] = useState<"All" | "Plays" | "Workshops" | "Meetups">("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Soon to Happen" | "Concluded">("All");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [proposalSubmittedToast, setProposalSubmittedToast] = useState<string | null>(null);
  const [isAiProposalMode, setIsAiProposalMode] = useState(false);
  const [rawAiParagraph, setRawAiParagraph] = useState("");
  const [aiExtractedSuccess, setAiExtractedSuccess] = useState(false);

  const [proposalForm, setProposalForm] = useState({
    title: "",
    proposalType: activeUser ? "Member Pitch" : "Sponsor Ad Proposal",
    submitterName: activeUser ? activeUser.name : "",
    submitterEmail: activeUser ? activeUser.email : "",
    submitterPhone: "",
    sponsorshipTerms: "₹50,000",
    venue: "Main Stage / Lounge",
    description: ""
  });

  const parseAiEventBrief = async (rawText: string) => {
    if (!rawText.trim()) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    try {
      const response = await fetch(`${baseUrl}/api/ai/event-form-helper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText })
      });
      const data = await response.json();
      const form = data?.form || {};

      setProposalForm({
        title: form.title || "Extracted Ensemble Event Proposal",
        proposalType: form.proposal_type || proposalForm.proposalType || "Sponsor Ad Proposal",
        submitterName: form.submitter_name || proposalForm.submitterName || "Partner Patron / Member",
        submitterEmail: form.contact_email || proposalForm.submitterEmail || "partner@domain.com",
        submitterPhone: form.contact_phone || proposalForm.submitterPhone || "+91 98110 44321",
        sponsorshipTerms: form.sponsorship_terms || proposalForm.sponsorshipTerms || "₹75,000",
        venue: form.venue || proposalForm.venue || "Main Stage Auditorium",
        description: form.description || rawText
      });
      setAiExtractedSuccess(true);
    } catch (error) {
      console.error("AI event helper failed", error);
      setAiExtractedSuccess(false);
    }
  };

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/events`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((e: any) => {
            const styles = getCategoryStyles(e.category);
            return {
              id: e.id,
              title: e.title,
              description: e.description,
              category: e.category,
              categoryBg: styles.bg,
              categoryColor: styles.color,
              date: e.date,
              day: e.day,
              month: e.month,
              image: e.image || "/aayam_assets/dddj_user_3.jpg",
              status: e.status || "upcoming",
              venue: e.venue,
              timeRange: e.time_range || e.timeRange || "TBD",
              host: e.host || "Aayam",
              priceInfo: e.price_info || "",
              capacity: e.capacity || ""
            };
          });
          setEvents(mapped);
        }
      })
      .catch((err) => {
        console.error("Could not load events from backend", err);
      });
  }, []);

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.title) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    const payload = {
      title: proposalForm.title,
      proposal_type: proposalForm.proposalType,
      submitter_name: proposalForm.submitterName,
      contact_email: proposalForm.submitterEmail,
      contact_phone: proposalForm.submitterPhone,
      venue: proposalForm.venue,
      budget: proposalForm.sponsorshipTerms,
      description: proposalForm.description
    };

    fetch(`${baseUrl}/api/proposals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        setIsRequestModalOpen(false);
        setProposalSubmittedToast(`Proposal "${proposalForm.title}" submitted to database! Maintainers can now review it.`);
        setTimeout(() => setProposalSubmittedToast(null), 5000);
      })
      .catch((err) => {
        console.error("Proposal submit error:", err);
        setIsRequestModalOpen(false);
        setProposalSubmittedToast(`Proposal "${proposalForm.title}" submitted for maintainer review.`);
        setTimeout(() => setProposalSubmittedToast(null), 5000);
      });
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory = filter === "All" || e.category.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Soon to Happen" && e.status === "upcoming") ||
      (statusFilter === "Concluded" && e.status === "concluded");
    return matchesCategory && matchesStatus;
  });

  const featuredEvent = events.find((e) => e.status === "upcoming") || events[0];

  return (
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] pt-8 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        {isRequestModalOpen ? (
          <section className="bg-white border border-[#e6e2dd] p-6 sm:p-10 md:p-12 rounded-3xl shadow-sm space-y-8 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#e6e2dd]">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#cac6b9] text-[#635f41] hover:text-[#1c1b19] hover:bg-[#fdf9f4] text-xs font-bold transition-all flex items-center gap-2"
              >
                Back to Events
              </button>
              <div className="flex gap-2 bg-[#fdf9f4] p-1 rounded-xl border border-[#cac6b9]/60">
                <button
                  type="button"
                  onClick={() => setIsAiProposalMode(false)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !isAiProposalMode ? "bg-[#635f41] text-white shadow-xs" : "text-[#466272] hover:text-[#1c1b19]"
                  }`}
                >
                  Manual Form
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiProposalMode(true)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isAiProposalMode ? "bg-[#466272] text-white shadow-xs" : "text-[#466272] hover:text-[#1c1b19]"
                  }`}
                >
                  AI Smart Generator
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1c1b19]">
                {isAiProposalMode ? "Propose Event by AI" : "Propose Event to Aayam"}
              </h1>
              <p className="text-xs sm:text-sm text-[#466272]">
                {isAiProposalMode
                  ? "Paste your raw unformatted event brief or email thread below. AI will extract and auto-fill form fields."
                  : "Submit your member production pitch or corporate sponsorship deal for maintainer review."}
              </p>
            </div>

            {isAiProposalMode && (
              <div className="p-6 bg-[#fdf9f4] border border-[#cac6b9]/60 rounded-3xl space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#635f41]">
                      AI Smart Brief Extractor
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1c1b19]">
                      Paste Full Event Description / Paragraph
                    </h3>
                  </div>
                  <span className="text-xs text-[#466272]">
                    AI auto-extracts title, brand name, contact, budget & venue
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={rawAiParagraph}
                  onChange={(e) => {
                    setRawAiParagraph(e.target.value);
                    setAiExtractedSuccess(false);
                  }}
                  placeholder="e.g. FabIndia is presenting a grand ethnic costume showcase at the Royal Stage Auditorium on 24th August with an offered budget of ₹1,50,000. Contact Rohan Sharma at rohan@fabindia.com or +91 98110 44321 to discuss stage sidecar branding..."
                  className="w-full bg-white border border-[#cac6b9]/80 rounded-2xl p-4 text-xs text-[#1c1b19] focus:outline-none focus:border-[#635f41] leading-relaxed shadow-inner"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => parseAiEventBrief(rawAiParagraph)}
                    className="px-6 py-2.5 rounded-xl bg-[#466272] hover:bg-[#314652] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    AI Extract & Auto-Fill Form Fields
                  </button>

                  {aiExtractedSuccess && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
                      Successfully extracted key fields into form below! Review & Submit.
                    </span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="space-y-1.5 min-h-[66px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#635f41] block">
                      Proposal Category
                    </label>
                    <select
                      value={proposalForm.proposalType}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProposalForm({
                          ...proposalForm,
                          proposalType: val,
                          sponsorshipTerms: val.includes("Sponsor") ? (proposalForm.sponsorshipTerms || "₹50,000") : ""
                        });
                      }}
                      className="w-full bg-[#fdf9f4] border border-[#cac6b9]/80 rounded-xl px-4 py-2.5 text-xs text-[#1c1b19] font-medium focus:outline-none focus:border-[#635f41]"
                    >
                      {activeUser ? (
                        <>
                          <option value="Member Pitch">Member Production & Workshop Pitch</option>
                          <option value="Sponsor Ad Proposal">Sponsored Brand Showcase & Ad Event</option>
                        </>
                      ) : (
                        <option value="Sponsor Ad Proposal">Sponsor & Brand Event Proposal</option>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1.5 min-h-[66px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#635f41] block">
                      Proposed Event Title
                    </label>
                    <Input
                      required
                      placeholder="e.g. Vintage Costume Showcase & Mixer"
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                      className="bg-[#fdf9f4] border-[#cac6b9]/80 text-xs h-10 rounded-xl px-4"
                    />
                  </div>

                  <div className="space-y-1.5 min-h-[66px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#635f41] block">
                      Target Venue / Stage
                    </label>
                    <Input
                      required
                      placeholder="e.g. Main Stage Auditorium / Rehearsal Studio B"
                      value={proposalForm.venue}
                      onChange={(e) => setProposalForm({ ...proposalForm, venue: e.target.value })}
                      className="bg-[#fdf9f4] border-[#cac6b9]/80 text-xs h-10 rounded-xl px-4"
                    />
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5 min-h-[66px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#635f41] block">
                      {proposalForm.proposalType.includes("Sponsor") ? "Sponsor / Brand Name" : "Your Full Name"}
                    </label>
                    <Input
                      required
                      placeholder={proposalForm.proposalType.includes("Sponsor") ? "e.g. Red Bull India" : "e.g. Aarav Sharma"}
                      value={proposalForm.submitterName}
                      onChange={(e) => setProposalForm({ ...proposalForm, submitterName: e.target.value })}
                      className="bg-[#fdf9f4] border-[#cac6b9]/80 text-xs h-10 rounded-xl px-4"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[66px]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#635f41] block">
                        Contact Email
                      </label>
                      <Input
                        type="email"
                        required
                        placeholder="e.g. partner@domain.com"
                        value={proposalForm.submitterEmail}
                        onChange={(e) => setProposalForm({ ...proposalForm, submitterEmail: e.target.value })}
                        className="bg-[#fdf9f4] border-[#cac6b9]/80 text-xs h-10 rounded-xl px-4"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#635f41] block">
                        Contact Phone
                      </label>
                      <Input
                        placeholder="e.g. +91 98110 44321"
                        value={proposalForm.submitterPhone}
                        onChange={(e) => setProposalForm({ ...proposalForm, submitterPhone: e.target.value })}
                        className="bg-[#fdf9f4] border-[#cac6b9]/80 text-xs h-10 rounded-xl px-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 min-h-[66px] flex flex-col justify-end">
                    {proposalForm.proposalType.includes("Sponsor") ? (
                      <>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#635f41] block">
                          Offered Sponsorship Budget
                        </label>
                        <Input
                          placeholder="e.g. ₹50,000"
                          value={proposalForm.sponsorshipTerms}
                          onChange={(e) => setProposalForm({ ...proposalForm, sponsorshipTerms: e.target.value })}
                          className="bg-[#fdf9f4] border-[#cac6b9]/80 text-xs h-10 rounded-xl px-4"
                        />
                      </>
                    ) : (
                      <>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                          Budget Requirement
                        </label>
                        <div className="bg-[#fdf9f4]/60 border border-dashed border-[#cac6b9]/60 text-[#466272]/70 text-xs h-10 rounded-xl px-4 flex items-center italic">
                          Member pitches are fully funded by ensemble desk (No budget required)
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#635f41] block">
                  Proposal Description & Deliverables
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the production format, audience scope, rehearsal timeline, and deliverables..."
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  className="w-full bg-[#fdf9f4] border border-[#cac6b9]/80 rounded-xl p-3.5 text-xs text-[#1c1b19] focus:outline-none focus:border-[#635f41]"
                />
              </div>

              <div className="pt-3 border-t border-[#e6e2dd] flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-[#cac6b9] text-[#466272] hover:bg-[#f7f3ee] text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-[#635f41] text-white hover:bg-[#4d4a32] text-xs font-bold shadow-md transition-all"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            <section>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#cac6b9]/25 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-[#635f41] uppercase tracking-[0.25em] mb-1 block">
                    Official Roster & Calendar
                  </span>
                  <h1 className="font-serif text-3xl md:text-5xl text-[#1c1b19] font-bold tracking-tight">
                    Events & Performances
                  </h1>
                  <p className="max-w-xl text-xs md:text-sm text-[#49473d] leading-relaxed font-light mt-1.5">
                    Explore active stage plays, masterclasses, and community meetups at Aayam.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 flex-shrink-0 self-start md:self-auto">
                  <button
                    onClick={() => {
                      setIsAiProposalMode(true);
                      setIsRequestModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#466272] text-white hover:bg-[#314652] text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95"
                  >
                    Propose Event by AI
                  </button>

                  <button
                    onClick={() => {
                      setIsAiProposalMode(false);
                      setIsRequestModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#635f41] text-white hover:bg-[#635f41]/90 text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Propose Event
                  </button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#cac6b9]/30 p-8 shadow-xs">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif text-2xl font-bold text-[#635f41]">Upcoming Production Calendar</h3>
                  <span className="text-xs font-bold text-[#466272] uppercase tracking-wider">
                    {events.length} Scheduled
                  </span>
                </div>

                <div className="grid grid-cols-7 border-l border-t border-[#cac6b9]/20 text-center text-xs font-bold text-[#49473d] uppercase tracking-wider">
                  {['SUN','MON','TUE','WED','THU','FRI','SAT'].map((day) => (
                    <div key={day} className="p-3 border-r border-b border-[#cac6b9]/20">
                      {day}
                    </div>
                  ))}
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 bg-[#f7f3ee]/30"></div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 bg-[#f7f3ee]/30"></div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">1</div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">2</div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold relative text-[#1c1b19]">
                    3
                    <div className="absolute bottom-2 left-2 right-2 bg-[#BFDDF0] p-1 rounded text-[9px] font-bold text-[#2e4a5a] truncate">
                      Rehearsal
                    </div>
                  </div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">4</div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">5</div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">6</div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold bg-[#fff9d2]/40 ring-1 ring-inset ring-[#635f41]/30 text-[#1c1b19]">
                    12
                    <div className="mt-1 bg-[#635f41] text-white p-1 rounded text-[9px] font-bold truncate">
                      Tughlaq Premiere
                    </div>
                  </div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">13</div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">14</div>
                  <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold bg-[#FFEBCC] text-[#765d00]">
                    19
                    <div className="mt-1 bg-[#765d00] text-white p-1 rounded text-[9px] font-bold truncate">
                      Workshop
                    </div>
                  </div>
                </div>
              </div>

              {featuredEvent && (
                <div className="bg-[#635f41] text-white rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xs border border-[#cac6b9]/25">
                  <div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
                      Featured Highlight
                    </span>
                    <h2 className="font-serif text-3xl mt-6 leading-tight font-bold">
                      {featuredEvent.title}
                    </h2>
                    <p className="mt-4 text-xs text-white/90 leading-relaxed font-light line-clamp-3">
                      {featuredEvent.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="flex items-center gap-3 text-xs text-white/90">
                      <Clock className="w-5 h-5 text-white/80" />
                      <div>
                        <span className="font-bold block uppercase tracking-wider text-[10px] text-white/70">
                          Date & Time
                        </span>
                        <span>{featuredEvent.date} ({featuredEvent.timeRange})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/90">
                      <MapPin className="w-5 h-5 text-white/80" />
                      <div>
                        <span className="font-bold block uppercase tracking-wider text-[10px] text-white/70">
                          Venue
                        </span>
                        <span>{featuredEvent.venue}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`RSVP registered for ${featuredEvent.title}`)}
                      className="w-full bg-[#8CC0EB] text-[#001e2c] py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#8CC0EB]/95 active:scale-95 transition-all shadow-xs"
                    >
                      Reserve Seat
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#cac6b9]/30 pb-6">
                <h2 className="font-serif text-3xl font-bold text-[#1c1b19] tracking-tight">
                  Event Schedule & Archive
                </h2>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex gap-1.5 bg-[#f7f3ee] p-1 rounded-full border border-[#cac6b9]/20">
                    {(["All", "Plays", "Workshops", "Meetups"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                          filter === cat ? "bg-[#635f41] text-white shadow-xs" : "hover:bg-black/5 text-[#49473d]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1.5 bg-[#f7f3ee] p-1 rounded-full border border-[#cac6b9]/20">
                    {(["All", "Soon to Happen", "Concluded"] as const).map((statusOpt) => (
                      <button
                        key={statusOpt}
                        onClick={() => setStatusFilter(statusOpt)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                          statusFilter === statusOpt ? "bg-[#466272] text-white shadow-xs" : "hover:bg-black/5 text-[#49473d]"
                        }`}
                      >
                        {statusOpt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((evt, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-white rounded-2xl overflow-hidden border border-[#cac6b9]/25 shadow-xs group hover:border-[#635f41]/20 transition-all duration-300"
                  >
                    <div className="relative h-56 overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        alt={evt.title}
                        src={evt.image}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg text-center shadow-xs border border-[#cac6b9]/20">
                        <p className="text-[10px] font-bold text-[#466272] uppercase leading-none">{evt.month}</p>
                        <p className="text-lg font-bold text-[#635f41] leading-none mt-0.5">{evt.day}</p>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span
                          className={`text-[9px] font-bold px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider ${
                            evt.status === "concluded"
                              ? "bg-gray-100 text-gray-600 border border-gray-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {evt.status === "concluded" ? "Concluded" : "Soon to Happen"}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/60 to-transparent">
                        <span className={`text-[9px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${evt.categoryBg}`}>
                          {evt.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-[#1c1b19] mb-2 group-hover:text-[#635f41] transition-colors">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-[#49473d] leading-relaxed font-light line-clamp-3">
                          {evt.description}
                        </p>

                        <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-4 pt-4 border-t border-[#cac6b9]/15 text-xs text-[#49473d]">
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#635f41] flex-shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <Clock className="w-3.5 h-3.5 text-[#635f41] flex-shrink-0" />
                            <span className="truncate">{evt.timeRange}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#cac6b9]/15">
                        {evt.status === "upcoming" ? (
                          <button
                            onClick={() => alert(`Seat booked for ${evt.title}!`)}
                            className="w-full bg-[#635f41] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#635f41]/95 transition-all shadow-xs flex items-center justify-center gap-2"
                          >
                            <CalendarIcon className="w-4 h-4" /> Book Seat
                          </button>
                        ) : (
                          <button className="w-full bg-gray-100 border border-gray-200 text-gray-400 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-default flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Concluded
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {proposalSubmittedToast && (
        <div className="fixed bottom-6 right-6 bg-[#31302d] text-white border border-[#cac6b9]/30 rounded-xl px-5 py-3.5 shadow-xl z-50 flex items-center gap-3 text-xs font-semibold max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{proposalSubmittedToast}</span>
        </div>
      )}
    </div>
  );
}
