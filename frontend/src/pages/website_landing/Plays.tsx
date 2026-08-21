// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  ArrowRight, 
  Flame, 
  ArrowUpRight, 
  ChevronRight,
  HeartHandshake,
  Check,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  FileText
} from "lucide-react";

interface PlayItem {
  id: number;
  title: string;
  hindi_title?: string;
  playwright?: string;
  director: string;
  genre?: string;
  language?: string;
  is_past?: boolean;
  status?: string;
  tagline?: string;
  description: string;
  cast?: string;
  season?: string;
  image?: string;
  venue?: string;
  dates?: string;
  runtime?: string;
  price?: string;
  acts?: string;
}

export default function Plays() {
  const [plays, setPlays] = useState<PlayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  
  // Volunteer Modal State
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [selectedPlayForVolunteer, setSelectedPlayForVolunteer] = useState<PlayItem | null>(null);
  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volPhone, setVolPhone] = useState("");
  const [volDepartment, setVolDepartment] = useState("Stage Management & Props");
  const [volAvailability, setVolAvailability] = useState("4-6 Hours / Week");
  const [volNotes, setVolNotes] = useState("");
  const [volSubmitting, setVolSubmitting] = useState(false);
  const [volSuccess, setVolSuccess] = useState(false);

  // Reservation Modal State
  const [reserveSuccess, setReserveSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/plays`)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setPlays(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load plays from backend:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const upcomingPlays = plays.filter(p => !p.is_past);
  const pastPlays = plays.filter(p => p.is_past);
  const displayedPlays = activeTab === "upcoming" ? upcomingPlays : pastPlays;

  const handleOpenVolunteer = (play: PlayItem) => {
    setSelectedPlayForVolunteer(play);
    setVolSuccess(false);
    setVolunteerOpen(true);
  };

  const handleSubmitVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayForVolunteer) return;
    setVolSubmitting(true);

    const payload = {
      play_id: selectedPlayForVolunteer.id,
      production_title: selectedPlayForVolunteer.title,
      applicant_name: volName || "Volunteer Candidate",
      applicant_email: volEmail || "volunteer@aayam.org",
      applicant_phone: volPhone || "+91 98110 44321",
      department: volDepartment,
      availability: volAvailability,
      notes: volNotes || "Passionate about theatre production."
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setVolSuccess(true);
        setTimeout(() => {
          setVolunteerOpen(false);
          setVolSuccess(false);
          setVolNotes("");
        }, 2000);
      } else {
        alert("Could not record volunteer request. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setVolSubmitting(false);
    }
  };

  const handleReservePass = (playTitle: string) => {
    setReserveSuccess(`Free Matinee Pass confirmed for "${playTitle}". An entry QR will be dispatched.`);
    setTimeout(() => setReserveSuccess(null), 4000);
  };

  return (
    <div className="bg-[#E7DDD3] text-[#2A1816] min-h-screen font-sans selection:bg-[#8C241E]/20 pt-8 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-12">
        
        {/* Toast */}
        {reserveSuccess && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#F5EAE6] text-[#2A1816] px-5 py-3.5 rounded-2xl border border-[#DEBEB7] shadow-2xl flex items-center gap-3.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
            <span className="text-xs font-mono font-medium">{reserveSuccess}</span>
            <button onClick={() => setReserveSuccess(null)} className="text-[#8C5A54] hover:text-[#2A1816]">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Editorial Header Section */}
        <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-12 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                <Flame className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>SEASON REPERTOIRE // AAYAM THEATRE SOCIETY</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-6xl text-[#2A1816] font-normal tracking-tight leading-none">
                Curated Stage Productions
              </h1>
              <p className="text-xs sm:text-sm text-[#5C3B37] max-w-2xl leading-relaxed font-light">
                Discover the landmark Indian plays, classical dramas, and proscenium experiments defining Aayam's 2026 performance season.
              </p>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 bg-[#FAF2EE] p-1.5 rounded-full border border-[#DCBAB2] shadow-xs shrink-0 self-start md:self-auto">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "upcoming"
                    ? "bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]"
                    : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                }`}
              >
                <span>Upcoming Premieres ({upcomingPlays.length || 3})</span>
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === "past"
                    ? "bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]"
                    : "text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]"
                }`}
              >
                <span>Past Repertory ({pastPlays.length || 6})</span>
              </button>
            </div>
          </div>
        </section>

        {/* Plays Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
            <h2 className="font-serif text-2xl sm:text-3xl text-[#2A1816] font-normal">
              {activeTab === "upcoming" ? "Autumn Season 2026 Premieres" : "Archived Repertory Archive"}
            </h2>
            <span className="font-mono text-xs text-[#8C5A54]">
              {displayedPlays.length} Production{displayedPlays.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm">
              Loading theatrical productions...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPlays.map((play) => (
                <div
                  key={play.id}
                  className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 sm:p-7 hover:border-[#B32D25]/50 hover:shadow-md transition-all flex flex-col justify-between space-y-6 shadow-xs group"
                >
                  <div className="space-y-4">
                    {/* Header meta */}
                    <div className="flex items-start justify-between gap-3 border-b border-[#DCBAB2]/50 pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                          {play.genre || "Classical Drama"} • {play.language || "Hindi / English"}
                        </span>
                        {play.acts && (
                          <span className="text-[10px] font-mono text-[#8C5A54] block">
                            {play.acts}
                          </span>
                        )}
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        !play.is_past
                          ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                          : "bg-[#EEDBD5] text-[#5C3B37] border-[#D5AAA2]"
                      }`}>
                        {!play.is_past ? "Upcoming Premiere" : "Repertory Archive"}
                      </span>
                    </div>

                    {/* Title & Playwright */}
                    <div className="space-y-1">
                      <h3 className="text-2xl font-serif text-[#2A1816] tracking-tight font-normal leading-tight">
                        {play.title}
                      </h3>
                      {play.playwright && (
                        <p className="text-xs text-[#6E4742] font-serif italic">
                          by <span className="font-normal text-[#2A1816]">{play.playwright}</span>
                        </p>
                      )}
                    </div>

                    {/* Production Meta Line */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[#6E4742]">
                      <span><strong className="text-[#2A1816] font-semibold">Dir:</strong> {play.director}</span>
                      <span>•</span>
                      <span><strong className="text-[#2A1816] font-semibold">Venue:</strong> {play.venue || "IIT Madras"}</span>
                      <span>•</span>
                      <span><strong className="text-[#2A1816] font-semibold">Dates:</strong> {play.dates || "Autumn 2026"}</span>
                    </div>

                    {/* Synopsis */}
                    <p className="text-xs text-[#5C3B37] font-light leading-relaxed">
                      {play.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#DCBAB2]/60 flex flex-col gap-2.5">
                    {!play.is_past ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReservePass(play.title)}
                          className="flex-1 bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-[#A6352F]"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>Reserve Free Pass</span>
                        </button>
                        <button
                          onClick={() => handleOpenVolunteer(play)}
                          className="px-4 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          title="Volunteer for Backstage Crew"
                        >
                          <HeartHandshake className="w-3.5 h-3.5 text-[#8C241E]" />
                          <span>Volunteer</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs font-mono text-[#8C5A54]">
                        <span>Archived Repertory</span>
                        <Link
                          to="/member-scripts"
                          className="text-[#8C241E] font-bold hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Read Script</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* VOLUNTEER FOR CREW MODAL */}
        {volunteerOpen && selectedPlayForVolunteer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Close button */}
              <button
                type="button"
                onClick={() => setVolunteerOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              </button>

              <div className="space-y-6">
                <div className="space-y-1.5 pr-8">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                    Production Crew Volunteer
                  </span>
                  <h2 className="text-2xl font-serif text-[#2A1816] tracking-tight font-normal">
                    Volunteer for: {selectedPlayForVolunteer.title}
                  </h2>
                  <p className="text-xs text-[#5C3B37] font-light leading-relaxed">
                    Join the backstage lighting, sound, makeup, wardrobe, or stage management team.
                  </p>
                </div>

                {volSuccess ? (
                  <div className="p-5 rounded-2xl bg-emerald-700/15 border border-emerald-700/30 text-emerald-950 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-bold font-mono uppercase tracking-wider">Application Received!</p>
                      <p>The production maintainer desk has received your crew volunteering request. We will contact you soon.</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitVolunteer} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={volName}
                          onChange={e => setVolName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={volEmail}
                          onChange={e => setVolEmail(e.target.value)}
                          placeholder="your.email@aayam.org"
                          className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={volPhone}
                          onChange={e => setVolPhone(e.target.value)}
                          placeholder="+91 98110 44321"
                          className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                          Preferred Department
                        </label>
                        <select
                          value={volDepartment}
                          onChange={e => setVolDepartment(e.target.value)}
                          className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                        >
                          <option value="Stage Management & Props">Stage Management & Props</option>
                          <option value="Lighting Console & DMX Cues">Lighting Console & DMX Cues</option>
                          <option value="Prosthetics, Mask Craft & SFX">Prosthetics, Mask Craft & SFX</option>
                          <option value="Wardrobe & Period Costumes">Wardrobe & Period Costumes</option>
                          <option value="Live Soundscape & Acoustic Audio">Live Soundscape & Acoustic Audio</option>
                          <option value="Front of House & Ticketing">Front of House & Ticketing</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Weekly Availability
                      </label>
                      <select
                        value={volAvailability}
                        onChange={e => setVolAvailability(e.target.value)}
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                      >
                        <option value="2-4 Hours / Week (Light Support)">2-4 Hours / Week (Light Support)</option>
                        <option value="4-6 Hours / Week (Regular Rehearsals)">4-6 Hours / Week (Regular Rehearsals)</option>
                        <option value="8+ Hours / Week (Intensive Production Crew)">8+ Hours / Week (Intensive Production Crew)</option>
                        <option value="Weekends Only">Weekends Only</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Motivation / Experience Note
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={volNotes}
                        onChange={e => setVolNotes(e.target.value)}
                        placeholder="Tell the director why you'd like to join this crew and any past backstage or creative experience..."
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl p-3 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] leading-relaxed"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setVolunteerOpen(false)}
                        className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={volSubmitting}
                        className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F] disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{volSubmitting ? "Submitting..." : "Submit Volunteer Request"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

