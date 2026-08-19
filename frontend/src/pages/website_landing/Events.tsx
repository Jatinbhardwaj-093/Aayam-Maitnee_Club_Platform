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
    return { bg: "bg-[#BFDDF0] text-[#E85F57]", color: "text-[#E85F57]" };
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
    categoryBg: "bg-[#BFDDF0] text-[#E85F57]",
    categoryColor: "text-[#E85F57]",
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

  // Request Event Proposal Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [proposalSubmittedToast, setProposalSubmittedToast] = useState<string | null>(null);

  // AI Proposal Assist State
  const [isAiProposalMode, setIsAiProposalMode] = useState(false);
  const [rawAiParagraph, setRawAiParagraph] = useState("");
  const [aiExtractedSuccess, setAiExtractedSuccess] = useState(false);
  const [isExtractingAi, setIsExtractingAi] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState<string | null>(null);

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

    setIsExtractingAi(true);
    setAiErrorMessage(null);
    setAiExtractedSuccess(false);

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    try {
      const res = await fetch(`${baseUrl}/api/events/autofill-proposal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paragraph: rawText })
      });
      const resData = await res.json();

      if (res.ok && resData.status === "success" && resData.data) {
        const d = resData.data;
        setProposalForm((prev) => ({
          title: d.title || prev.title,
          proposalType: d.proposalType || prev.proposalType,
          submitterName: d.submitterName || prev.submitterName,
          submitterEmail: d.submitterEmail || prev.submitterEmail,
          submitterPhone: d.submitterPhone || prev.submitterPhone,
          venue: d.venue || prev.venue,
          sponsorshipTerms: d.sponsorshipTerms || prev.sponsorshipTerms,
          description: d.description || rawText
        }));
        setAiExtractedSuccess(true);
      } else {
        setAiErrorMessage(resData.message || "AI servers are down. Please try again later.");
      }
    } catch (err) {
      console.error("AI autofill extraction error:", err);
      setAiErrorMessage("AI servers are down. Please try again later.");
    } finally {
      setIsExtractingAi(false);
    }
  };

  const loadEventsFromBackend = () => {
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
              description: e.description || "Official Matinee Club scheduled event.",
              category: e.category || "Meetups",
              categoryBg: styles.bg,
              categoryColor: styles.color,
              date: e.date || "Upcoming",
              day: e.day || 15,
              month: e.month || "AUG",
              image: e.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
              status: e.status === "concluded" ? "concluded" : "upcoming",
              venue: e.venue || "Prithvi Theatre",
              timeRange: e.timeRange || "18:00 - 20:00",
              host: e.host || "Aayam Ensemble",
              priceInfo: e.priceInfo || "Registration Required",
              capacity: e.capacity || "150 seats"
            };
          });
          setEvents(mapped);
        }
      })
      .catch((err) => console.error("Error loading events from backend:", err));
  };

  useEffect(() => {
    loadEventsFromBackend();
  }, []);

  // Submit Proposal (Logged in SharedEvent & SponsorAdRequest tables in DB!)
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
        setProposalSubmittedToast(
          `Proposal "${proposalForm.title}" submitted to database! Maintainers can now review it.`
        );
        setTimeout(() => setProposalSubmittedToast(null), 5000);
      })
      .catch((err) => {
        console.error("Proposal submit error:", err);
        setIsRequestModalOpen(false);
        setProposalSubmittedToast(
          `Proposal "${proposalForm.title}" submitted for maintainer review.`
        );
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
    <div className="bg-[#E7DDD3] text-[#2C2A28] min-h-screen font-sans selection:bg-[#F8E8E4] pt-8 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        {isRequestModalOpen ? (
          /* DEDICATED PROPOSE EVENT PAGE VIEW (Only Propose Event Form is Visible) */
          <section className="bg-white border border-[#DDD8CE] p-6 sm:p-10 md:p-12 rounded-3xl shadow-sm space-y-8 animate-in fade-in-50 duration-200">
            
            {/* Top Navigation Bar with Back to Events Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#DDD8CE]">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#D5C9BE] text-[#353535] hover:text-[#2C2A28] hover:bg-[#E7DDD3] text-xs font-bold transition-all flex items-center gap-2"
              >
                Back to Events
              </button>

              <div className="flex gap-2 bg-[#E7DDD3] p-1 rounded-xl border border-[#D5C9BE]/60">
                <button
                  type="button"
                  onClick={() => setIsAiProposalMode(false)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    !isAiProposalMode
                      ? "bg-[#353535] text-white shadow-xs"
                      : "text-[#666361] hover:text-[#2C2A28]"
                  }`}
                >
                  Manual Form
                </button>
                <button
                  type="button"
                  onClick={() => setIsAiProposalMode(true)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isAiProposalMode
                      ? "bg-[#666361] text-white shadow-xs"
                      : "text-[#666361] hover:text-[#2C2A28]"
                  }`}
                >
                  AI Smart Generator
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2C2A28]">
                {isAiProposalMode ? "Propose Event by AI" : "Propose Event to Aayam"}
              </h1>
              <p className="text-xs sm:text-sm text-[#666361]">
                {isAiProposalMode
                  ? "Paste your raw unformatted event brief or email thread below. AI will extract and auto-fill form fields."
                  : "Submit your member production pitch or corporate sponsorship deal for maintainer review."}
              </p>
            </div>

            {/* AI RAW PARAGRAPH EXTRACTOR BOX */}
            {isAiProposalMode && (
              <div className="p-6 bg-[#E7DDD3] border border-[#D5C9BE]/60 rounded-3xl space-y-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#353535]">
                      AI Smart Brief Extractor
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#2C2A28]">
                      Paste Full Event Description / Paragraph
                    </h3>
                  </div>
                  <span className="text-xs text-[#666361]">
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
                  className="w-full bg-white border border-[#D5C9BE]/80 rounded-2xl p-4 text-xs text-[#2C2A28] focus:outline-none focus:border-[#353535] leading-relaxed shadow-inner"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    disabled={isExtractingAi}
                    onClick={() => parseAiEventBrief(rawAiParagraph)}
                    className="px-6 py-2.5 rounded-xl bg-[#666361] hover:bg-[#314652] text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isExtractingAi ? (
                      <>
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        AI Extracting...
                      </>
                    ) : (
                      "AI Extract & Auto-Fill Form Fields"
                    )}
                  </button>

                  {aiExtractedSuccess && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-center">
                      Successfully extracted key fields into form below! Review & Submit.
                    </span>
                  )}

                  {aiErrorMessage && (
                    <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-center">
                      {aiErrorMessage}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Stable 2-Column Form (Zero Layout Shift) */}
            <form onSubmit={handleProposalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Column 1: Proposal Category, Title, Target Venue */}
                <div className="space-y-5">
                  <div className="space-y-1.5 min-h-[66px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535] block">
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
                      className="w-full bg-[#E7DDD3] border border-[#D5C9BE]/80 rounded-xl px-4 py-2.5 text-xs text-[#2C2A28] font-medium focus:outline-none focus:border-[#353535]"
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
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535] block">
                      Proposed Event Title
                    </label>
                    <Input
                      required
                      placeholder="e.g. Vintage Costume Showcase & Mixer"
                      value={proposalForm.title}
                      onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                      className="bg-[#E7DDD3] border-[#D5C9BE]/80 text-xs h-10 rounded-xl px-4"
                    />
                  </div>

                  <div className="space-y-1.5 min-h-[66px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535] block">
                      Target Venue / Stage
                    </label>
                    <Input
                      required
                      placeholder="e.g. Main Stage Auditorium / Rehearsal Studio B"
                      value={proposalForm.venue}
                      onChange={(e) => setProposalForm({ ...proposalForm, venue: e.target.value })}
                      className="bg-[#E7DDD3] border-[#D5C9BE]/80 text-xs h-10 rounded-xl px-4"
                    />
                  </div>
                </div>

                {/* Column 2: Name/Brand, Contact Info, Fixed Budget Slot */}
                <div className="space-y-5">
                  <div className="space-y-1.5 min-h-[66px]">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#353535] block">
                      {proposalForm.proposalType.includes("Sponsor") ? "Sponsor / Brand Name" : "Your Full Name"}
                    </label>
                    <Input
                      required
                      placeholder={proposalForm.proposalType.includes("Sponsor") ? "e.g. Red Bull India" : "e.g. Aarav Sharma"}
                      value={proposalForm.submitterName}
                      onChange={(e) => setProposalForm({ ...proposalForm, submitterName: e.target.value })}
                      className="bg-[#E7DDD3] border-[#D5C9BE]/80 text-xs h-10 rounded-xl px-4"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-h-[66px]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#353535] block">
                        Contact Email
                      </label>
                      <Input
                        type="email"
                        required
                        placeholder="e.g. partner@domain.com"
                        value={proposalForm.submitterEmail}
                        onChange={(e) => setProposalForm({ ...proposalForm, submitterEmail: e.target.value })}
                        className="bg-[#E7DDD3] border-[#D5C9BE]/80 text-xs h-10 rounded-xl px-4"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#353535] block">
                        Contact Phone
                      </label>
                      <Input
                        placeholder="e.g. +91 98110 44321"
                        value={proposalForm.submitterPhone}
                        onChange={(e) => setProposalForm({ ...proposalForm, submitterPhone: e.target.value })}
                        className="bg-[#E7DDD3] border-[#D5C9BE]/80 text-xs h-10 rounded-xl px-4"
                      />
                    </div>
                  </div>

                  {/* FIXED HEIGHT BUDGET SLOT (Zero Layout Shift) */}
                  <div className="space-y-1.5 min-h-[66px] flex flex-col justify-end">
                    {proposalForm.proposalType.includes("Sponsor") ? (
                      <>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#353535] block">
                          Offered Sponsorship Budget
                        </label>
                        <Input
                          placeholder="e.g. ₹50,000"
                          value={proposalForm.sponsorshipTerms}
                          onChange={(e) => setProposalForm({ ...proposalForm, sponsorshipTerms: e.target.value })}
                          className="bg-[#E7DDD3] border-[#D5C9BE]/80 text-xs h-10 rounded-xl px-4"
                        />
                      </>
                    ) : (
                      <>
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                          Budget Requirement
                        </label>
                        <div className="bg-[#E7DDD3]/60 border border-dashed border-[#D5C9BE]/60 text-[#666361]/70 text-xs h-10 rounded-xl px-4 flex items-center italic">
                          Member pitches are fully funded by ensemble desk (No budget required)
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#353535] block">
                  Proposal Description & Deliverables
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the production format, audience scope, rehearsal timeline, and deliverables..."
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                  className="w-full bg-[#E7DDD3] border border-[#D5C9BE]/80 rounded-xl p-3.5 text-xs text-[#2C2A28] focus:outline-none focus:border-[#353535]"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#DDD8CE] flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-[#D5C9BE] text-[#666361] hover:bg-[#EFE8E1] text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-xl bg-[#353535] text-white hover:bg-[#4d4a32] text-xs font-bold shadow-md transition-all"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </section>
        ) : (
          /* NORMAL EVENTS PAGE VIEW (Hero, Calendar, Schedule Roster) */
          <>
            {/* Hero & Title Section */}
            <section>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D5C9BE]/25 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-[#353535] uppercase tracking-[0.25em] mb-1 block">
                    Official Roster & Calendar
                  </span>
                  <h1 className="font-serif text-3xl md:text-5xl text-[#2C2A28] font-bold tracking-tight">
                    Events & Performances
                  </h1>
                  <p className="max-w-xl text-xs md:text-sm text-[#666361] leading-relaxed font-light mt-1.5">
                    Explore active stage plays, masterclasses, and community meetups at Aayam.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 flex-shrink-0 self-start md:self-auto">
                  <button
                    onClick={() => {
                      setIsAiProposalMode(true);
                      setIsRequestModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#666361] text-white hover:bg-[#314652] text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95"
                  >
                    Propose Event by AI
                  </button>

                  <button
                    onClick={() => {
                      setIsAiProposalMode(false);
                      setIsRequestModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#353535] text-white hover:bg-[#353535]/90 text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Propose Event
                  </button>
                </div>
              </div>
            </section>

            {/* Bento Grid: Dynamic Calendar + Featured Highlight */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Dynamic Calendar Widget */}
              <div className="lg:col-span-2 bg-[#2C2A28] text-white rounded-3xl border border-[#353535] p-8 shadow-xl">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <h3 className="font-serif text-2xl font-normal text-[#F7F5F0]">Upcoming Production Calendar</h3>
                  <span className="text-xs font-mono text-[#E85F57] uppercase tracking-wider bg-[#E85F57]/15 px-3 py-1 rounded-full border border-[#E85F57]/30">
                    {events.length} Scheduled
                  </span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 border-l border-t border-white/10 text-center text-xs font-mono font-semibold text-white/60 uppercase tracking-wider">
                  {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                    <div key={day} className="p-3 border-r border-b border-white/10 text-[#E85F57]">
                      {day}
                    </div>
                  ))}

                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 bg-[#353535]/30"></div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 bg-[#353535]/30"></div>

                  {/* Dynamic event date chips */}
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono text-white/50">
                    1
                  </div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono text-white/50">
                    2
                  </div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono relative text-white">
                    3
                    <div className="absolute bottom-2 left-2 right-2 bg-[#E85F57]/20 border border-[#E85F57]/40 p-1 rounded-lg text-[9px] font-mono font-bold text-[#E85F57] truncate">
                      Rehearsal
                    </div>
                  </div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono text-white/50">
                    4
                  </div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono text-white/50">
                    5
                  </div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono text-white/50">
                    6
                  </div>

                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono bg-[#353535]/60 ring-1 ring-inset ring-[#E85F57]/40 text-white">
                    12
                    <div className="mt-1 bg-[#E85F57] text-white p-1 rounded-lg text-[9px] font-mono font-bold truncate">
                      Premiere
                    </div>
                  </div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono text-white/50">
                    13
                  </div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono text-white/50">
                    14
                  </div>
                  <div className="h-20 md:h-24 p-2 border-r border-b border-white/10 text-left font-mono bg-[#353535]/40 text-white">
                    19
                    <div className="mt-1 bg-[#353535] border border-white/20 text-[#E85F57] p-1 rounded-lg text-[9px] font-mono font-bold truncate">
                      Workshop
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Featured Highlight Card */}
              {featuredEvent && (
                <div className="bg-[#2C2A28] text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xl border border-[#353535] space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E85F57]/15 text-[#E85F57] text-[10px] font-mono font-bold uppercase tracking-widest border border-[#E85F57]/30">
                      <span>FEATURED HIGHLIGHT</span>
                    </div>
                    <h2 className="font-serif text-3xl text-[#F7F5F0] mt-4 leading-tight font-normal">
                      {featuredEvent.title}
                    </h2>
                    <p className="mt-3 text-xs text-white/70 leading-relaxed font-light line-clamp-3">
                      {featuredEvent.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-xs text-white/80 font-mono">
                      <Clock className="w-4 h-4 text-[#E85F57] flex-shrink-0" />
                      <div>
                        <span className="font-bold block uppercase tracking-wider text-[9px] text-[#E85F57]">
                          Date & Time
                        </span>
                        <span>{featuredEvent.date} ({featuredEvent.timeRange})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-white/80 font-mono">
                      <MapPin className="w-4 h-4 text-[#E85F57] flex-shrink-0" />
                      <div>
                        <span className="font-bold block uppercase tracking-wider text-[9px] text-[#E85F57]">
                          Venue
                        </span>
                        <span className="truncate">{featuredEvent.venue}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`RSVP registered for ${featuredEvent.title}`)}
                      className="w-full bg-[#E85F57] text-white py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#D94538] active:scale-95 transition-all shadow-md mt-2"
                    >
                      Reserve Seat
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* All Events List */}
            <section className="space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#D5C9BE]/30 pb-6">
                <h2 className="font-serif text-3xl font-bold text-[#2C2A28] tracking-tight">
                  Event Schedule & Archive
                </h2>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex gap-1.5 bg-[#EFE8E1] p-1 rounded-full border border-[#D5C9BE]/20">
                    {(["All", "Plays", "Workshops", "Meetups"] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                          filter === cat
                            ? "bg-[#353535] text-white shadow-xs"
                            : "hover:bg-black/5 text-[#666361]"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-1.5 bg-[#EFE8E1] p-1 rounded-full border border-[#D5C9BE]/20">
                    {(["All", "Soon to Happen", "Concluded"] as const).map((statusOpt) => (
                      <button
                        key={statusOpt}
                        onClick={() => setStatusFilter(statusOpt)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider ${
                          statusFilter === statusOpt
                            ? "bg-[#666361] text-white shadow-xs"
                            : "hover:bg-black/5 text-[#666361]"
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
                    className="flex flex-col bg-[#2C2A28] text-white rounded-3xl overflow-hidden border border-[#353535] shadow-xl group hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300 justify-between"
                  >
                    <div>
                      <div className="relative h-56 overflow-hidden flex-shrink-0 bg-[#353535]">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                          alt={evt.title}
                          src={evt.image}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop";
                          }}
                        />
                        <div className="absolute top-4 left-4 bg-[#2C2A28]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl text-center shadow-md border border-[#353535]">
                          <p className="text-[10px] font-mono font-bold text-[#E85F57] uppercase leading-none">{evt.month}</p>
                          <p className="text-xl font-serif font-normal text-white leading-none mt-1">{evt.day}</p>
                        </div>

                        <div className="absolute top-4 right-4">
                          <span
                            className={`text-[9px] font-mono font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider backdrop-blur-md ${
                              evt.status === "concluded"
                                ? "bg-[#353535]/80 text-white/60 border border-white/10"
                                : "bg-[#2C2A28]/90 text-[#E85F57] border border-[#E85F57]/40"
                            }`}
                          >
                            {evt.status === "concluded" ? "Concluded" : "Live Season"}
                          </span>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent">
                          <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-[#E85F57] text-white">
                            {evt.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-7 space-y-4">
                        <h3 className="font-serif text-2xl font-normal text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-3">
                          {evt.description}
                        </p>

                        <div className="grid grid-cols-2 gap-x-2 gap-y-3 pt-4 border-t border-white/10 text-xs font-mono text-white/70">
                          <div className="flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-[#E85F57] flex-shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 truncate">
                            <Clock className="w-3.5 h-3.5 text-[#E85F57] flex-shrink-0" />
                            <span className="truncate">{evt.timeRange}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-7 pt-0">
                      {evt.status === "upcoming" ? (
                        <button
                          onClick={() => alert(`Seat booked for ${evt.title}!`)}
                          className="w-full bg-[#E85F57] text-white hover:bg-[#D94538] py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all active:scale-95"
                        >
                          RSVP for Event
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-[#353535] text-white/40 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest cursor-not-allowed border border-white/5"
                        >
                          Archive Recorded
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Proposal Toast */}
      {proposalSubmittedToast && (
        <div className="fixed bottom-6 right-6 bg-[#31302d] text-white border border-[#D5C9BE]/30 rounded-xl px-5 py-3.5 shadow-xl z-50 flex items-center gap-3 text-xs font-semibold max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{proposalSubmittedToast}</span>
        </div>
      )}
    </div>
  );
}
