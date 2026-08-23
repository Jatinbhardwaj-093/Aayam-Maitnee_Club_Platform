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
import ScriptPreviewModal from "@/components/ScriptPreviewModal";
import ProductionDetailModal from "@/components/ProductionDetailModal";
import type { ProductionDetailData } from "@/components/ProductionDetailModal";
import TicketPassModal from "@/components/TicketPassModal";
import { getPlaybookForTitle } from "@/data/playbooksData";
import type { Playbook } from "@/data/playbooksData";
import { 
  Info, Plus, Gift, CreditCard, ChevronDown, 
  QrCode, Copy, Heart, ShieldCheck, Printer, Download, Award, Loader2
} from "lucide-react";

const CustomSelect = ({ value, onChange, options, placeholder = "Select..." }: { value: string, onChange: (val: string) => void, options: {value: string, label: string}[], placeholder?: string }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] font-semibold flex items-center justify-between focus:outline-none"
      >
        <span className="truncate">{options.find(o => o.value === value)?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-full bg-[#F5EAE6] border border-[#DEBEB7] rounded-2xl p-2 shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left rounded-xl p-2.5 text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
                  value === opt.value
                    ? "bg-[#8C241E] text-[#FDF8F7] font-bold shadow-xs"
                    : "hover:bg-[#EEDBD5] text-[#2A1816]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

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
  const activeUser = JSON.parse(sessionStorage.getItem("aayam_active_user") || "null");
  const isMaintainer = Boolean(
    activeUser?.is_maintainer || 
    activeUser?.role === "Maintainer" ||
    (activeUser?.roles && Array.isArray(activeUser.roles) && activeUser.roles.some((r: any) => typeof r === "string" ? r.toLowerCase().includes("maintainer") || r.toLowerCase().includes("admin") || r.toLowerCase().includes("director") : (r.name || "").toLowerCase().includes("maintainer") || (r.name || "").toLowerCase().includes("admin")))
  );

  const [plays, setPlays] = useState<PlayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  
  // Production Detail Modal State
  const [selectedDetailPlay, setSelectedDetailPlay] = useState<ProductionDetailData | null>(null);

  // Donation Modal State
  const [donationOpen, setDonationOpen] = useState(false);
  const [selectedPlayForDonation, setSelectedPlayForDonation] = useState<PlayItem | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | string>(500);
  const [customAmount, setCustomAmount] = useState("");
  const [donationName, setDonationName] = useState("");
  const [donationEmail, setDonationEmail] = useState("");
  const [donationNumber, setDonationNumber] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi_qr" | "card_instant">("upi_qr");
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [receiptId, setReceiptId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [processingStep, setProcessingStep] = useState(1);

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
  const [selectedPlayForPass, setSelectedPlayForPass] = useState<PlayItem | null>(null);
  const [reserveSuccess, setReserveSuccess] = useState<string | null>(null);

  // Script Preview Modal State
  const [previewScript, setPreviewScript] = useState<Playbook | null>(null);
  const [scriptModalOpen, setScriptModalOpen] = useState<boolean>(false);

  const handleOpenScriptPreview = (play: PlayItem) => {
    const playbook = getPlaybookForTitle(play.title);
    setPreviewScript(playbook);
    setScriptModalOpen(true);
  };

  const handleOpenDetails = (play: PlayItem) => {
    const past = Boolean(play.is_past) ||
      ["archive", "concluded", "past", "completed", "closed", "historical"].some(
        (kw) => (play.status || "").toLowerCase().includes(kw)
      );
    setSelectedDetailPlay({
      id: play.id,
      title: play.title,
      playwright: play.playwright,
      director: play.director,
      genre: play.genre,
      language: play.language,
      status: play.status || (past ? "Archived Production" : "Upcoming Premiere"),
      is_past: past,
      tagline: play.tagline,
      acts: play.acts,
      description: play.description,
      cast: play.cast,
      season: play.season,
      image: play.image,
      venue: play.venue,
      dates: play.dates,
      runtime: play.runtime,
      price: play.price,
      category: "Stage Play"
    });
  };

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

  const isPastPlay = (p: PlayItem) =>
    Boolean(p.is_past) ||
    ["archive", "concluded", "past", "completed", "closed", "historical"].some(
      (kw) => (p.status || "").toLowerCase().includes(kw)
    );

  const upcomingPlays = plays.filter(p => !isPastPlay(p));
  const pastPlays = plays.filter(p => isPastPlay(p));
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
              {displayedPlays.map((play, idx) => (
                <div
                  key={play.id || idx}
                  className="bg-[#2C2A28] text-white rounded-[2rem] border border-[#353535] overflow-hidden shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Card Image Header */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-[#353535]">
                      {play.image ? (
                        <img
                          src={play.image}
                          alt={play.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#353535] text-white/50 font-serif italic text-sm">
                          Aayam Repertory
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-transparent to-transparent" />
                      
                      <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider shadow-md backdrop-blur-md border ${
                          !isPastPlay(play)
                            ? "bg-[#2C2A28]/90 text-emerald-300 border-emerald-500/40"
                            : "bg-[#2C2A28]/90 text-white/60 border-white/20"
                        }`}>
                          {!isPastPlay(play)
                            ? (play.status || "Upcoming Premiere")
                            : "Repertory Archive"}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-5 text-xs font-mono font-bold text-white/60 drop-shadow-sm">
                        0{idx + 1} // {play.genre || "Drama"}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 sm:p-7 space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-serif text-2xl font-normal text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                          {play.title}
                        </h3>
                        {play.playwright && (
                          <p className="text-xs text-white/70 font-serif italic">
                            by <span className="font-normal text-white">{play.playwright}</span>
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-2">
                        {play.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs font-mono text-white/70">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-[#E85F57] shrink-0" />
                          <span className="truncate">{play.venue || "CLT Main Stage"}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Clock className="w-3.5 h-3.5 text-[#E85F57] shrink-0" />
                          <span className="truncate">{play.runtime || "90 Mins"}</span>
                        </div>
                      </div>

                      <div className="bg-[#353535]/50 p-3.5 rounded-xl border border-white/5 text-xs text-white/80 space-y-1">
                        <div className="truncate"><strong className="text-white">Director:</strong> {play.director}</div>
                        {play.cast && <div className="truncate text-white/60"><strong>Cast:</strong> {play.cast}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-white/10 pt-3.5 flex flex-col gap-2 w-full">
                    {!isPastPlay(play) ? (
                      <>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => setSelectedPlayForPass(play)}
                            className="flex-1 py-2.5 px-3 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span className="truncate">Reserve Pass</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPlayForDonation(play);
                              setDonationOpen(true);
                              setPaymentStatus("idle");
                            }}
                            className="flex-1 py-2.5 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                          >
                            <Gift className="w-3.5 h-3.5" />
                            <span className="truncate">Donate</span>
                          </button>
                        </div>
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleOpenDetails(play)}
                            className="flex-1 py-2 px-2 rounded-full border border-white/20 hover:bg-[#FAF2EE]/10 text-white text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer truncate"
                            title="View full production dossier"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleOpenScriptPreview(play)}
                            className="flex-1 py-2 px-2 rounded-full border border-white/20 hover:bg-[#FAF2EE]/10 text-[#E85F57] text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer truncate"
                            title="Preview Script & Playbook"
                          >
                            Script
                          </button>
                          <button
                            onClick={() => handleOpenVolunteer(play)}
                            className="flex-1 py-2 px-2 rounded-full border border-white/20 hover:bg-[#FAF2EE]/10 text-white text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer truncate"
                            title="Volunteer for Backstage Crew"
                          >
                            Volunteer
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => handleOpenDetails(play)}
                          className="flex-1 py-2 px-2 rounded-full border border-white/20 hover:bg-[#FAF2EE]/10 text-white text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer truncate"
                          title="View full production dossier"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleOpenScriptPreview(play)}
                          className="flex-1 py-2 px-2 rounded-full border border-white/20 hover:bg-[#FAF2EE]/10 text-[#E85F57] text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer truncate"
                          title="Preview Script & Playbook"
                        >
                          Script
                        </button>
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
                        <CustomSelect
                          value={volDepartment}
                          onChange={(val) => setVolDepartment(val)}
                          options={[
                            { value: "Stage Management & Props", label: "Stage Management & Props" },
                            { value: "Lighting Console & DMX Cues", label: "Lighting Console & DMX Cues" },
                            { value: "Prosthetics, Mask Craft & SFX", label: "Prosthetics, Mask Craft & SFX" },
                            { value: "Wardrobe & Period Costumes", label: "Wardrobe & Period Costumes" },
                            { value: "Live Soundscape & Acoustic Audio", label: "Live Soundscape & Acoustic Audio" },
                            { value: "Front of House & Ticketing", label: "Front of House & Ticketing" }
                          ]}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Weekly Availability
                      </label>
                      <CustomSelect
                        value={volAvailability}
                        onChange={(val) => setVolAvailability(val)}
                        options={[
                          { value: "2-4 Hours / Week (Light Support)", label: "2-4 Hours / Week (Light Support)" },
                          { value: "4-6 Hours / Week (Regular Rehearsals)", label: "4-6 Hours / Week (Regular Rehearsals)" },
                          { value: "8+ Hours / Week (Intensive Production Crew)", label: "8+ Hours / Week (Intensive Production Crew)" },
                          { value: "Weekends Only", label: "Weekends Only" }
                        ]}
                      />
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
                        className="px-5 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                      >
                        <X className="w-4 h-4 text-[#8C241E]" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="submit"
                        disabled={volSubmitting}
                        className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F] disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4 text-[#FFD0CC]" />
                        <span>{volSubmitting ? "Submitting..." : "Submit Request"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DONATION & PATRONAGE CHECKOUT MODAL */}
        {donationOpen && selectedPlayForDonation && (
          <>
            {/* FULL-PAGE MOVING THEATRICAL PROCESSING ANIMATION */}
            {paymentStatus === "processing" && (
              <div className="fixed inset-0 z-[100] bg-[#140808]/95 backdrop-blur-md flex items-center justify-center overflow-hidden animate-in fade-in duration-300">
                {/* Dynamic Moving Spotlight Beams */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-[#E85F57]/20 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none animate-stage-beam" />
                <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-tl from-[#8C241E]/30 via-[#E85F57]/15 to-transparent rounded-full blur-3xl pointer-events-none animate-stage-beam" style={{ animationDirection: "reverse", animationDuration: "8s" }} />

                {/* Central Stage Wave Pulse & Stepper */}
                <div className="relative z-10 max-w-lg w-full mx-4 p-8 sm:p-10 rounded-[2.5rem] bg-[#221312]/90 border-2 border-[#E85F57] shadow-2xl text-center space-y-6 text-white">
                  
                  {/* Glowing Pulsing Aura Icon */}
                  <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#E85F57]/30 blur-xl animate-stage-pulse" />
                    <div className="w-20 h-20 rounded-full bg-[#2C1817] border-2 border-[#E85F57] flex items-center justify-center relative z-10 shadow-lg shadow-[#E85F57]/30">
                      <Heart className="w-10 h-10 text-[#E85F57] animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E85F57] bg-[#E85F57]/15 px-3.5 py-1 rounded-full border border-[#E85F57]/30 inline-block">
                      Theatrical Patronage Authorisation
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] font-normal">
                      Authorising ₹{customAmount || donationAmount}
                    </h3>
                    <p className="text-xs text-white/70 font-mono">
                      Allocating to <strong className="text-white">{selectedPlayForDonation.title}</strong>
                    </p>
                  </div>

                  {/* 3-Step Theatrical Stepper */}
                  <div className="space-y-2.5 text-left bg-[#170B0B] p-4 rounded-2xl border border-white/10 text-xs font-mono">
                    <div className={`flex items-center gap-3 transition-colors ${processingStep >= 1 ? "text-emerald-400 font-bold" : "text-white/40"}`}>
                      {processingStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin text-[#E85F57] shrink-0" />}
                      <span>1. Connecting Secure Patronage Gateway...</span>
                    </div>
                    <div className={`flex items-center gap-3 transition-colors ${processingStep >= 2 ? "text-emerald-400 font-bold" : "text-white/40"}`}>
                      {processingStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : processingStep === 2 ? <Loader2 className="w-4 h-4 animate-spin text-[#E85F57] shrink-0" /> : <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />}
                      <span>2. Authorising Non-Profit Trust Transfer...</span>
                    </div>
                    <div className={`flex items-center gap-3 transition-colors ${processingStep >= 3 ? "text-emerald-400 font-bold" : "text-white/40"}`}>
                      {processingStep === 3 ? <Loader2 className="w-4 h-4 animate-spin text-[#E85F57] shrink-0" /> : <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />}
                      <span>3. Issuing Official 80G Society Certificate...</span>
                    </div>
                  </div>

                  {/* Animated Progress Line */}
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#E85F57] to-amber-400 h-full transition-all duration-700 ease-out" 
                      style={{ width: processingStep === 1 ? "35%" : processingStep === 2 ? "70%" : "95%" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FULL-PAGE STAGE CONFETTI CELEBRATION OVERLAY ON SUCCESS */}
            {paymentStatus === "success" && (
              <div className="fixed inset-0 z-[90] pointer-events-none overflow-hidden">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-confetti"
                    style={{
                      left: `${(i * 2.8) % 100}%`,
                      top: `-${Math.random() * 20}px`,
                      animationDuration: `${3 + (i % 4) * 0.8}s`,
                      animationDelay: `${(i % 12) * 0.15}s`,
                      width: `${8 + (i % 6) * 2}px`,
                      height: `${12 + (i % 8) * 2}px`,
                      backgroundColor: ["#E85F57", "#F59E0B", "#10B981", "#FCD34D", "#FFFFFF", "#E11D48"][i % 6],
                      transform: `rotate(${i * 45}deg)`,
                      borderRadius: i % 2 === 0 ? "2px" : "9999px"
                    }}
                  />
                ))}
              </div>
            )}

            {/* MAIN WIDE PATRONAGE DIALOG */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-[#2C2A28] border-2 border-[#E85F57] text-[#F7F5F0] rounded-[2.5rem] p-7 sm:p-9 max-w-3xl lg:max-w-4xl w-full shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
                
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => {
                    setPaymentStatus("idle");
                    setDonationOpen(false);
                  }}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#353535] hover:bg-[#404040] text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 shadow-xs group z-20"
                  title="Close"
                >
                  <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                </button>

                {/* MODAL HEADER */}
                <div className="border-b border-white/10 pb-5 pr-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#E85F57] bg-[#E85F57]/15 px-3 py-1 rounded-full border border-[#E85F57]/30 inline-flex items-center gap-1.5">
                      <Heart className="w-3 h-3 text-[#E85F57]" />
                      <span>Theatre Patronage & Support</span>
                    </span>
                    <span className="text-xs font-mono text-white/50">
                      IIT Madras BS Drama Society
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif text-[#F7F5F0] tracking-tight font-normal pt-1.5">
                    Contribute to {selectedPlayForDonation.title}
                  </h2>
                </div>

                {/* MODAL BODY */}
                <div className="overflow-y-auto flex-1 custom-scrollbar pt-6 pr-1">
                  {paymentStatus === "success" ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* OFFICIAL PATRON CERTIFICATE */}
                      <div className="bg-[#1A1817] border-2 border-[#E85F57] rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E85F57]/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                              <Award className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                              <h4 className="font-serif text-lg text-white font-normal">Official Society Patron Certificate</h4>
                              <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Section 80G Tax Exempt Eligible</p>
                            </div>
                          </div>
                          <span className="font-mono text-xs font-bold text-[#E85F57] bg-[#2C2A28] px-3 py-1 rounded-md border border-white/10 self-start sm:self-auto">
                            {receiptId || "AYM-DON-8842"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-[#242220] p-4 rounded-2xl border border-white/10 space-y-1">
                            <span className="text-[10px] font-mono text-white/50 uppercase block font-semibold">Total Patronage Contributed</span>
                            <h3 className="text-3xl sm:text-4xl font-serif text-white font-normal text-emerald-400">
                              ₹{customAmount || donationAmount}
                            </h3>
                            <p className="text-[10px] font-mono text-white/60">Fully Transferred to Production Fund</p>
                          </div>

                          <div className="bg-[#242220] p-4 rounded-2xl border border-white/10 space-y-1.5 text-xs font-mono">
                            <span className="text-[10px] font-mono text-white/50 uppercase block font-semibold">Allocated Production</span>
                            <p className="font-bold text-white text-sm">{selectedPlayForDonation.title}</p>
                            <p className="text-[11px] text-white/70">Patron: <strong className="text-white">{isAnonymous ? "Anonymous Patron" : (donationName || "Patron of the Arts")}</strong></p>
                            {donationEmail && <p className="text-[10px] text-white/50">Receipt Sent To: {donationEmail}</p>}
                          </div>
                        </div>

                        <div className="text-[11px] text-white/70 font-light border-t border-white/10 pt-3 flex items-center justify-between flex-wrap gap-2">
                          <span>Aayam Repertory • IIT Madras Drama Society Trust</span>
                          <span className="font-mono text-[10px] text-emerald-400 font-bold">VERIFIED PATRON RECORD</span>
                        </div>
                      </div>

                      {/* Action Suite */}
                      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print Receipt</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentStatus("idle");
                            setDonationOpen(false);
                          }}
                          className="px-7 py-2.5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
                        >
                          Done & Return
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setPaymentStatus("processing");
                        setProcessingStep(1);
                        const generatedId = `AYM-DON-${Math.floor(1000 + Math.random() * 9000)}`;
                        setReceiptId(generatedId);
                        setTimeout(() => setProcessingStep(2), 900);
                        setTimeout(() => setProcessingStep(3), 1800);
                        setTimeout(() => setPaymentStatus("success"), 2700);
                      }}
                      className="space-y-6"
                    >
                      {/* 2-COLUMN SPACIOUS CLEAN GRID */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* LEFT COLUMN: AMOUNT PRESETS & TIER SELECTION (7 cols) */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="space-y-2">
                            <label className="text-xs font-mono text-[#E85F57] uppercase font-bold block">
                              1. Select Patronage Amount (INR) *
                            </label>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                              {[
                                { amt: 250, label: "Student Supporter", desc: "Script & Print" },
                                { amt: 500, label: "Rehearsal Patron", desc: "Studio Space" },
                                { amt: 1000, label: "Costume Sponsor", desc: "Stage Outfits" },
                                { amt: 2500, label: "Lighting Patron", desc: "Spotlights & Cues" },
                                { amt: 5000, label: "Executive Patron", desc: "VIP Front Row" },
                              ].map(({ amt, label, desc }) => {
                                const isSelected = !customAmount && Number(donationAmount) === amt;
                                return (
                                  <button
                                    key={amt}
                                    type="button"
                                    onClick={() => {
                                      setDonationAmount(amt);
                                      setCustomAmount("");
                                    }}
                                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                                      isSelected
                                        ? "bg-[#E85F57] text-white border-[#E85F57] shadow-lg scale-102"
                                        : "bg-[#353535]/80 hover:bg-[#404040] text-white/80 border-white/15 hover:border-white/30"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-mono text-sm font-bold">₹{amt.toLocaleString("en-IN")}</span>
                                      {isSelected && <Check className="w-3.5 h-3.5" />}
                                    </div>
                                    <span className="text-[10px] font-mono opacity-80 mt-1 block">{label}</span>
                                  </button>
                                );
                              })}

                              {/* Custom input card */}
                              <div className="relative col-span-2 sm:col-span-1 bg-[#353535]/80 border border-white/15 rounded-2xl p-2.5 flex flex-col justify-center">
                                <span className="text-[9px] font-mono text-white/50 uppercase block mb-1">Custom (₹)</span>
                                <input
                                  type="number"
                                  min="50"
                                  value={customAmount}
                                  onChange={(e) => {
                                    setCustomAmount(e.target.value);
                                    setDonationAmount(e.target.value);
                                  }}
                                  placeholder="e.g. 750"
                                  className="w-full bg-[#2C2A28] border border-white/15 rounded-lg px-2.5 py-1 text-xs text-white placeholder:text-white/40 focus:outline-hidden focus:border-[#E85F57] font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Impact Note */}
                          <div className="bg-[#1F1E1D] p-4 rounded-2xl border border-white/10 space-y-1 text-xs font-light text-white/70">
                            <span className="font-mono text-[10px] text-[#E85F57] uppercase font-bold block">
                              Production Fund Impact
                            </span>
                            <p className="leading-relaxed">
                              100% of your contribution directly funds stage props, live acoustics, lighting consoles, and rights for student drama productions at IIT Madras.
                            </p>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: PATRON DETAILS & PAYMENT MODE (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                          
                          {/* Patron Information Box */}
                          <div className="space-y-3 bg-[#353535]/50 p-4 rounded-2xl border border-white/10">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-mono text-white/80 uppercase font-bold">
                                2. Patron Information
                              </span>
                              <label className="flex items-center gap-1.5 text-[11px] font-mono text-white/70 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={isAnonymous}
                                  onChange={(e) => setIsAnonymous(e.target.checked)}
                                  className="rounded accent-[#E85F57]"
                                />
                                <span>Anonymous</span>
                              </label>
                            </div>

                            {!isAnonymous && (
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-[#E85F57] uppercase font-bold block">
                                  Full Name / Playbill Credit
                                </label>
                                <input
                                  type="text"
                                  value={donationName}
                                  onChange={(e) => setDonationName(e.target.value)}
                                  placeholder="e.g. Jatin Bhardwaj"
                                  className="w-full bg-[#2C2A28] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-[#E85F57]"
                                />
                              </div>
                            )}

                            <div className="space-y-2">
                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-white/60 uppercase block">
                                  Email (Optional for 80G Receipt)
                                </label>
                                <input
                                  type="email"
                                  value={donationEmail}
                                  onChange={(e) => setDonationEmail(e.target.value)}
                                  placeholder="your.email@example.com"
                                  className="w-full bg-[#2C2A28] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-[#E85F57]"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-mono text-white/60 uppercase block">
                                  Phone (Optional)
                                </label>
                                <input
                                  type="tel"
                                  value={donationNumber}
                                  onChange={(e) => setDonationNumber(e.target.value)}
                                  placeholder="+91 98402 12345"
                                  className="w-full bg-[#2C2A28] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-[#E85F57]"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Payment Mode Selector */}
                          <div className="space-y-2">
                            <label className="text-xs font-mono text-[#E85F57] uppercase font-bold block">
                              3. Payment Mode
                            </label>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setPaymentMethod("upi_qr")}
                                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                                  paymentMethod === "upi_qr"
                                    ? "bg-[#353535] border-[#E85F57] text-white shadow-md"
                                    : "bg-[#353535]/40 border-white/10 text-white/60 hover:text-white"
                                }`}
                              >
                                <QrCode className="w-4 h-4 text-[#E85F57]" />
                                <span className="font-mono text-[11px] font-bold">UPI QR & Apps</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setPaymentMethod("card_instant")}
                                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                                  paymentMethod === "card_instant"
                                    ? "bg-[#353535] border-[#E85F57] text-white shadow-md"
                                    : "bg-[#353535]/40 border-white/10 text-white/60 hover:text-white"
                                }`}
                              >
                                <CreditCard className="w-4 h-4 text-[#E85F57]" />
                                <span className="font-mono text-[11px] font-bold">Instant Gateway</span>
                              </button>
                            </div>

                            {paymentMethod === "upi_qr" ? (
                              <div className="bg-[#1F1E1D] p-3 rounded-xl border border-white/10 space-y-2 text-xs font-mono">
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-white/60">UPI VPA:</span>
                                  <div className="flex items-center gap-1">
                                    <code className="text-[#E85F57] font-bold bg-[#2C2A28] px-1.5 py-0.5 rounded text-[10px]">
                                      aayam.drama@iitm
                                    </code>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard?.writeText("aayam.drama@iitm");
                                        setCopiedVpa(true);
                                        setTimeout(() => setCopiedVpa(false), 2000);
                                      }}
                                      className="p-0.5 hover:text-[#E85F57]"
                                      title="Copy VPA"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <div className="w-12 h-12 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
                                    <QrCode className="w-10 h-10 text-black" />
                                  </div>
                                  <p className="text-[10px] text-white/70 font-sans leading-tight">
                                    Scan with GPay, PhonePe, or Paytm to transfer ₹{customAmount || donationAmount}.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-[#1F1E1D] p-3 rounded-xl border border-white/10 text-[11px] text-white/70 space-y-1 font-light">
                                <div className="flex items-center gap-1.5 text-white font-mono font-bold text-[10px]">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>256-Bit Encrypted Instant Checkout</span>
                                </div>
                                <p className="text-[10px]">Cards, NetBanking, and Wallets authorized immediately.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* SUBMIT ACTION BAR */}
                      <div className="pt-4 flex items-center justify-between gap-3 border-t border-white/10">
                        <span className="text-xs font-mono text-white/60">
                          Amount: <strong className="text-white font-bold text-sm">₹{customAmount || donationAmount}</strong>
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setDonationOpen(false)}
                            className="px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!(Number(customAmount || donationAmount) > 0)}
                            className="bg-[#E85F57] hover:bg-[#D94538] text-white px-7 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#E85F57]/30 flex items-center gap-2 transition-all cursor-pointer border border-[#E85F57] disabled:opacity-50 active:scale-95"
                          >
                            <Heart className="w-4 h-4" />
                            <span>Complete ₹{customAmount || donationAmount} Contribution</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* SCRIPT PREVIEW MODAL */}
        <ScriptPreviewModal
          open={scriptModalOpen}
          onClose={() => setScriptModalOpen(false)}
          script={previewScript}
        />

        {/* PRODUCTION FULL DOSSIER DETAIL MODAL */}
        <ProductionDetailModal
          open={Boolean(selectedDetailPlay)}
          onClose={() => setSelectedDetailPlay(null)}
          production={selectedDetailPlay}
          onOpenScript={(title) => {
            const pb = getPlaybookForTitle(title);
            setPreviewScript(pb);
            setScriptModalOpen(true);
          }}
        />

        {/* COMPLIMENTARY TICKET PASS RESERVATION & PRINTING MODAL */}
        {selectedPlayForPass && (
          <TicketPassModal
            isOpen={Boolean(selectedPlayForPass)}
            onClose={() => setSelectedPlayForPass(null)}
            play={selectedPlayForPass}
          />
        )}
      </main>
    </div>
  );
}

