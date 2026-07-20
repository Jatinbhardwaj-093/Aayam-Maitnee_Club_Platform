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

  // Request Event Proposal Modal
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [proposalSubmittedToast, setProposalSubmittedToast] = useState<string | null>(null);

  const [proposalForm, setProposalForm] = useState({
    title: "",
    proposalType: activeUser ? "Member Pitch" : "Sponsor Ad Proposal",
    submitterName: activeUser ? activeUser.name : "",
    submitterEmail: activeUser ? activeUser.email : "",
    sponsorshipTerms: activeUser ? "Member Production Pitch" : "$1,500 Sponsored Brand Event",
    venue: "Main Stage / Lounge",
    description: ""
  });

  const loadEventsFromBackend = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
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

  // Submit Proposal (Not immediately created as event; goes to Maintainer queue!)
  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.title) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
    const payload = {
      title: proposalForm.title,
      description: `${proposalForm.proposalType} by ${proposalForm.submitterName || "Guest"}: ${proposalForm.description}`,
      venue: proposalForm.venue,
      sponsorshipDeal: proposalForm.sponsorshipTerms
    };

    fetch(`${baseUrl}/api/proposals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(() => {
        setIsRequestModalOpen(false);
        setProposalSubmittedToast(
          `Proposal "${proposalForm.title}" submitted! Maintainers will review it shortly before scheduling.`
        );
        setTimeout(() => setProposalSubmittedToast(null), 5000);
      })
      .catch((err) => {
        console.error("Proposal submit error:", err);
        setIsRequestModalOpen(false);
        setProposalSubmittedToast(
          `Proposal "${proposalForm.title}" submitted locally for maintainer review.`
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
    <div className="bg-[#fdf9f4] text-[#1c1b19] min-h-screen font-sans selection:bg-[#c6e4f7] pt-8 pb-16">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-10">
        
        {/* Hero & Title Section */}
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
            
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#635f41] text-white hover:bg-[#635f41]/90 text-xs font-bold uppercase tracking-wider shadow-xs transition-all active:scale-95 flex items-center gap-2 flex-shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Propose Event
            </button>
          </div>
        </section>

        {/* Bento Grid: Dynamic Calendar + Featured Highlight */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Dynamic Calendar Widget */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#cac6b9]/30 p-8 shadow-xs">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-bold text-[#635f41]">Upcoming Production Calendar</h3>
              <span className="text-xs font-bold text-[#466272] uppercase tracking-wider">
                {events.length} Scheduled
              </span>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 border-l border-t border-[#cac6b9]/20 text-center text-xs font-bold text-[#49473d] uppercase tracking-wider">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                <div key={day} className="p-3 border-r border-b border-[#cac6b9]/20">
                  {day}
                </div>
              ))}

              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 bg-[#f7f3ee]/30"></div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 bg-[#f7f3ee]/30"></div>

              {/* Dynamic event date chips */}
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">
                1
              </div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">
                2
              </div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold relative text-[#1c1b19]">
                3
                <div className="absolute bottom-2 left-2 right-2 bg-[#BFDDF0] p-1 rounded text-[9px] font-bold text-[#2e4a5a] truncate">
                  Rehearsal
                </div>
              </div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">
                4
              </div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">
                5
              </div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">
                6
              </div>

              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold bg-[#fff9d2]/40 ring-1 ring-inset ring-[#635f41]/30 text-[#1c1b19]">
                12
                <div className="mt-1 bg-[#635f41] text-white p-1 rounded text-[9px] font-bold truncate">
                  Tughlaq Premiere
                </div>
              </div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">
                13
              </div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold text-gray-500">
                14
              </div>
              <div className="h-20 md:h-28 p-2 border-r border-b border-[#cac6b9]/20 text-left font-semibold bg-[#FFEBCC] text-[#765d00]">
                19
                <div className="mt-1 bg-[#765d00] text-white p-1 rounded text-[9px] font-bold truncate">
                  Workshop
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Featured Highlight Card */}
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

        {/* All Events List */}
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
                      filter === cat
                        ? "bg-[#635f41] text-white shadow-xs"
                        : "hover:bg-black/5 text-[#49473d]"
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
                      statusFilter === statusOpt
                        ? "bg-[#466272] text-white shadow-xs"
                        : "hover:bg-black/5 text-[#49473d]"
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
      </main>

      {/* PROPOSE / REQUEST EVENT MODAL (Submits to Maintainer Review Queue!) */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="bg-[#fdf9f4] border border-[#cac6b9] text-[#466272] max-w-lg rounded-2xl shadow-xl p-6">
          <DialogHeader className="border-b border-[#e6e2dd] pb-3">
            <DialogTitle className="font-serif text-2xl text-[#635f41] font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8CC0EB]" /> Propose Event to Aayam
            </DialogTitle>
            <DialogDescription className="text-xs text-[#466272]/85">
              Submit your event pitch or brand sponsorship proposal. Maintainers will review before scheduling.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleProposalSubmit} className="py-4 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#635f41] font-bold">
                Proposal Type
              </label>
              <select
                value={proposalForm.proposalType}
                onChange={(e) => setProposalForm({ ...proposalForm, proposalType: e.target.value })}
                className="w-full bg-white border border-[#e6e2dd] rounded-lg px-3 py-2 text-xs text-[#1c1b19] font-medium focus:outline-none"
              >
                {activeUser ? (
                  <>
                    <option value="Member Pitch">🤝 Member Production / Workshop Pitch</option>
                    <option value="Sponsor Ad Proposal">📢 Sponsored Brand Showcase / Ad Event</option>
                  </>
                ) : (
                  <option value="Sponsor Ad Proposal">📢 Sponsor / Partner Event Proposal</option>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#635f41] font-bold">
                Proposed Event Title
              </label>
              <Input
                required
                placeholder="e.g. Vintage Costume Showcase & Mixer"
                value={proposalForm.title}
                onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                className="bg-white border-[#e6e2dd] text-xs h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#635f41] font-bold">
                  Your Name / Brand
                </label>
                <Input
                  required
                  placeholder="e.g. Aarav / Matinee Patrons"
                  value={proposalForm.submitterName}
                  onChange={(e) => setProposalForm({ ...proposalForm, submitterName: e.target.value })}
                  className="bg-white border-[#e6e2dd] text-xs h-9"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-[#635f41] font-bold">
                  Contact Email
                </label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. partner@brand.com"
                  value={proposalForm.submitterEmail}
                  onChange={(e) => setProposalForm({ ...proposalForm, submitterEmail: e.target.value })}
                  className="bg-white border-[#e6e2dd] text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#635f41] font-bold">
                Target Venue / Stage
              </label>
              <Input
                required
                placeholder="e.g. Main Stage / VIP Lounge"
                value={proposalForm.venue}
                onChange={(e) => setProposalForm({ ...proposalForm, venue: e.target.value })}
                className="bg-white border-[#e6e2dd] text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#635f41] font-bold">
                Proposal Description & Objectives
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe the event format, target audience, and setup requirements..."
                value={proposalForm.description}
                onChange={(e) => setProposalForm({ ...proposalForm, description: e.target.value })}
                className="w-full bg-white border border-[#e6e2dd] rounded-lg p-2.5 text-xs text-[#1c1b19] focus:outline-none focus:ring-1 focus:ring-[#8CC0EB]"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-[#e6e2dd] flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRequestModalOpen(false)}
                className="border-[#cac6b9] text-[#466272] hover:bg-[#f7f3ee] text-xs font-bold flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#635f41] text-white hover:bg-[#635f41]/90 text-xs font-bold flex-1"
              >
                Submit Proposal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Proposal Toast */}
      {proposalSubmittedToast && (
        <div className="fixed bottom-6 right-6 bg-[#31302d] text-white border border-[#cac6b9]/30 rounded-xl px-5 py-3.5 shadow-xl z-50 flex items-center gap-3 text-xs font-semibold max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{proposalSubmittedToast}</span>
        </div>
      )}
    </div>
  );
}
