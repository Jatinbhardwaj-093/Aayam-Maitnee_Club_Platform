// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { 
  FileText, 
  Users, 
  MapPin, 
  Calendar, 
  Clock, 
  Award, 
  Layers, 
  Tag, 
  HeartHandshake, 
  CheckCircle2, 
  X, 
  Sparkles,
  ClipboardList
} from "lucide-react";
import ScriptPreviewModal from "@/components/ScriptPreviewModal";
import ProductionDetailModal from "@/components/ProductionDetailModal";
import type { ProductionDetailData } from "@/components/ProductionDetailModal";
import ProductionEditModal from "@/components/ProductionEditModal";
import { getPlaybookForTitle } from "@/data/playbooksData";
import type { Playbook } from "@/data/playbooksData";
import { Info, Edit3 } from "lucide-react";

interface Play {
  id: number;
  title: string;
  playwright?: string;
  genre?: string;
  language?: string;
  status: string;
  statusColor?: string;
  is_past?: boolean;
  tagline?: string;
  acts?: string;
  description: string;
  director: string;
  cast?: string;
  season?: string;
  image?: string;
  venue?: string;
  dates?: string;
  runtime?: string;
  price?: string;
  volunteer_count?: number;
}

export default function MemberPlays() {
  const contextData = useOutletContext<{ activeUser: any }>() || {};
  const activeUser = contextData.activeUser || JSON.parse(sessionStorage.getItem("aayam_active_user") || "null");

  const isMaintainer = Boolean(
    activeUser?.is_maintainer || 
    activeUser?.role === "Maintainer" ||
    (activeUser?.roles && Array.isArray(activeUser.roles) && activeUser.roles.some((r: any) => typeof r === "string" ? r.toLowerCase().includes("maintainer") || r.toLowerCase().includes("admin") || r.toLowerCase().includes("director") : (r.name || "").toLowerCase().includes("maintainer") || (r.name || "").toLowerCase().includes("admin")))
  );

  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  // Production Detail & Edit Modal States
  const [selectedDetailPlay, setSelectedDetailPlay] = useState<ProductionDetailData | null>(null);
  const [selectedEditPlay, setSelectedEditPlay] = useState<ProductionDetailData | null>(null);

  // Volunteer Modal State
  const [volunteerOpen, setVolunteerOpen] = useState(false);
  const [selectedPlay, setSelectedPlay] = useState<Play | null>(null);
  const [volName, setVolName] = useState(activeUser?.name || "");
  const [volEmail, setVolEmail] = useState(activeUser?.email || "");
  const [volPhone, setVolPhone] = useState(activeUser?.phone || "+91 98110 44321");
  const [volDept, setVolDept] = useState("Stage Management & Blocking");
  const [volAvailability, setVolAvailability] = useState("5-8 Hours / Week");
  const [volNotes, setVolNotes] = useState("");
  const [submittingVol, setSubmittingVol] = useState(false);
  const [volSuccessMsg, setVolSuccessMsg] = useState("");

  // Script Preview Modal State
  const [previewScript, setPreviewScript] = useState<Playbook | null>(null);
  const [scriptModalOpen, setScriptModalOpen] = useState<boolean>(false);

  const handleOpenScriptPreview = (play: Play) => {
    const playbook = getPlaybookForTitle(play.title);
    setPreviewScript(playbook);
    setScriptModalOpen(true);
  };

  const handleOpenDetails = (play: Play) => {
    setSelectedDetailPlay({
      id: play.id,
      title: play.title,
      playwright: play.playwright,
      director: play.director,
      genre: play.genre,
      language: play.language,
      status: play.status,
      is_past: play.is_past,
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

  const handleOpenEdit = (play: Play) => {
    setSelectedEditPlay({
      id: play.id,
      title: play.title,
      playwright: play.playwright,
      director: play.director,
      genre: play.genre,
      language: play.language,
      status: play.status,
      is_past: play.is_past,
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

  const handlePlayEditSuccess = (updated: ProductionDetailData) => {
    setPlays(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p));
  };

  const fetchPlays = () => {
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/plays`)
      .then(res => res.json())
      .then(data => {
        setPlays(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load plays:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlays();
  }, []);

  useEffect(() => {
    if (activeUser) {
      if (!volName) setVolName(activeUser.name || "");
      if (!volEmail) setVolEmail(activeUser.email || "");
      if (!volPhone && activeUser.phone) setVolPhone(activeUser.phone);
    }
  }, [activeUser]);

  const openVolunteerModal = (play: Play) => {
    setSelectedPlay(play);
    setVolSuccessMsg("");
    setVolNotes("");
    setVolunteerOpen(true);
  };

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlay) return;
    setSubmittingVol(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005"}/api/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          play_id: selectedPlay.id,
          applicant_name: volName || activeUser?.name || "Ensemble Member",
          applicant_email: volEmail || activeUser?.email || "",
          applicant_phone: volPhone || "+91 98110 44321",
          department: volDept,
          availability: volAvailability,
          notes: volNotes
        })
      });

      if (res.ok) {
        setVolSuccessMsg(`Thank you! Your volunteer application for ${selectedPlay.title} (${volDept}) has been recorded for the Directorial Council.`);
        setTimeout(() => {
          setVolunteerOpen(false);
          setVolSuccessMsg("");
          fetchPlays();
        }, 2000);
      } else {
        alert("Failed to submit volunteer application. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again.");
    } finally {
      setSubmittingVol(false);
    }
  };

  const upcomingPlays = plays.filter(p => !p.is_past && !p.status?.toLowerCase().includes("archive"));
  const pastPlays = plays.filter(p => p.is_past || p.status?.toLowerCase().includes("archive"));

  const displayedPlays = activeTab === "upcoming" ? upcomingPlays : pastPlays;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8C5A54] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2]">
              Theatrical Repertoire & Production Lineup
            </span>
            <span className="font-mono text-xs text-[#8C5A54]">• Season 2025–2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2A1816] tracking-tight font-normal">
            Plays & Productions
          </h1>
          <p className="text-xs sm:text-sm text-[#5C3B37] leading-relaxed max-w-3xl font-light">
            Comprehensive production guides, staging specifications, directorial notes, cast rosters, and backstage crew calls for Aayam’s upcoming Indian premieres and historical repertoire.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/auditions"
            className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-xs"
          >
            <ClipboardList className="w-3.5 h-3.5 text-[#8C241E]" />
            <span>Audition Calls</span>
          </Link>
          <Link
            to="/member-scripts"
            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm flex items-center gap-2 transition-all border border-[#A6352F]"
          >
            <FileText className="w-3.5 h-3.5 text-[#FFD0CC]" />
            <span>Script Vault</span>
          </Link>
        </div>
      </div>

      {/* Production Tabs Filter */}
      <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "upcoming"
                ? "bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]"
                : "bg-[#FAF2EE] text-[#6E4742] hover:bg-[#EEDBD5] border border-[#DCBAB2]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upcoming Premieres ({upcomingPlays.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("past")}
            className={`px-5 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "past"
                ? "bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]"
                : "bg-[#FAF2EE] text-[#6E4742] hover:bg-[#EEDBD5] border border-[#DCBAB2]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Past Repertory & Archive ({pastPlays.length})</span>
          </button>
        </div>

        <span className="hidden sm:inline font-mono text-[11px] text-[#8C5A54] uppercase tracking-wider">
          Showing {displayedPlays.length} Productions
        </span>
      </div>

      {/* Plays Cards Grid */}
      {loading ? (
        <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm">
          Loading production archives & specifications...
        </div>
      ) : displayedPlays.length === 0 ? (
        <div className="text-center py-20 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] text-[#8C5A54] font-serif italic text-sm">
          No productions listed in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPlays.map((play, idx) => {
            const isUpcoming = !play.is_past && !play.status?.toLowerCase().includes("archive");

            return (
              <div
                key={play.id || idx}
                className="bg-[#FAF2EE] text-[#2A1816] rounded-[2rem] border border-[#DCBAB2] overflow-hidden shadow-md hover:border-[#B32D25]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Visual Card Image Header */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#E8D6CF]">
                    {play.image ? (
                      <img
                        src={play.image}
                        alt={play.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#EEDBD5] text-[#8C5A54] font-serif italic text-sm">
                        Aayam Repertory
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A1816]/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 right-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-[9px] font-mono font-bold rounded-full uppercase tracking-wider shadow-sm backdrop-blur-md border ${
                        isUpcoming
                          ? "bg-[#FAF2EE]/90 text-emerald-950 border-emerald-700/30"
                          : "bg-[#FAF2EE]/90 text-[#8C5A54] border-[#D5AAA2]"
                      }`}>
                        {play.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-5 text-xs font-mono font-bold text-[#FAF2EE] drop-shadow-sm">
                      0{idx + 1} // {play.genre || "Drama"}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-serif text-2xl font-normal text-[#2A1816] group-hover:text-[#8C241E] transition-colors leading-snug">
                        {play.title}
                      </h3>
                      {play.playwright && (
                        <p className="text-xs text-[#6E4742] font-serif italic">
                          by <span className="font-normal text-[#2A1816]">{play.playwright}</span>
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#5C3B37] leading-relaxed font-light line-clamp-2">
                      {play.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#DCBAB2]/60 text-xs font-mono text-[#5C3B37]">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                        <span className="truncate">{play.venue || "IIT Madras"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                        <span className="truncate">{play.runtime || "90 Mins"}</span>
                      </div>
                    </div>

                    <div className="bg-[#F5EAE6] p-3.5 rounded-xl border border-[#DEBEB7] text-xs text-[#5C3B37] space-y-1">
                      <div className="truncate"><strong>Director:</strong> {play.director}</div>
                      {play.cast && <div className="truncate text-[#6E4742]"><strong>Cast:</strong> {play.cast}</div>}
                    </div>
                  </div>
                </div>

                {/* Card Actions - CLEAN SINGLE LINE WITHOUT ICONS */}
                <div className="p-4 sm:p-5 pt-0 border-t border-[#DCBAB2]/60 pt-3.5 flex items-center gap-2 w-full flex-nowrap">
                  <button
                    type="button"
                    onClick={() => handleOpenDetails(play)}
                    className="flex-1 py-2 px-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs truncate"
                    title="View full production dossier"
                  >
                    Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenScriptPreview(play)}
                    className="flex-1 py-2 px-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#8C241E] hover:text-[#731B16] text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-xs truncate"
                    title="Read Playbook Script"
                  >
                    Script
                  </button>

                  {isUpcoming ? (
                    <button
                      type="button"
                      onClick={() => openVolunteerModal(play)}
                      className="flex-1 py-2 px-2 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider text-center transition-all cursor-pointer shadow-sm border border-[#A6352F] truncate"
                      title="Volunteer for Backstage Crew"
                    >
                      Volunteer
                    </button>
                  ) : (
                    <span className="flex-1 py-2 px-2 rounded-full bg-[#E4D9D2]/70 border border-[#CBB3AC] text-[#6B5550] text-[11px] font-mono font-bold uppercase tracking-wider text-center truncate">
                      Archived
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VOLUNTEER MODAL DIALOG */}
      {volunteerOpen && selectedPlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Close Button */}
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
                  Production Crew Volunteer Call
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
                  Volunteer for {selectedPlay.title}
                </h2>
                <p className="text-xs text-[#5C3B37] font-light leading-relaxed">
                  Join the directorial team, backstage crew, lighting console, or front-of-house operations for this upcoming production.
                </p>
              </div>

              {volSuccessMsg ? (
                <div className="p-5 rounded-2xl bg-emerald-700/15 border border-emerald-700/30 text-emerald-950 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold font-mono uppercase tracking-wider">Application Dispatched</p>
                    <p>{volSuccessMsg}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={volName}
                        onChange={e => setVolName(e.target.value)}
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Institutional Email
                      </label>
                      <input
                        type="email"
                        required
                        value={volEmail}
                        onChange={e => setVolEmail(e.target.value)}
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                        placeholder="email@ds.study.iitm.ac.in"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                        Preferred Department
                      </label>
                      <select
                        value={volDept}
                        onChange={e => setVolDept(e.target.value)}
                        className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-3.5 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                      >
                        <option value="Stage Management & Blocking">Stage Management & Blocking</option>
                        <option value="Lighting & FX (Light Man)">Lighting & FX (Light Man & DMX)</option>
                        <option value="Sound & Live Foley">Sound & Live Foley / Percussion</option>
                        <option value="Costumes & Makeup">Costumes & SFX Makeup</option>
                        <option value="Props Crafting & Set Logistics">Props Crafting & Set Logistics</option>
                        <option value="Marketing & Audience Relations">Marketing & Front of House</option>
                        <option value="General Backstage Crew">General Backstage Crew</option>
                      </select>
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
                        <option value="3-5 Hours / Week">3-5 Hours / Week</option>
                        <option value="5-8 Hours / Week">5-8 Hours / Week</option>
                        <option value="8-12 Hours / Week">8-12 Hours / Week</option>
                        <option value="Full Tech Week Only">Full Tech Week & Staging Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A54] block">
                      Why do you want to join this crew? (Brief Note)
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={volNotes}
                      onChange={e => setVolNotes(e.target.value)}
                      className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl p-3 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] leading-relaxed"
                      placeholder="Mention your prior experience or why you are passionate about working on this Indian production..."
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
                      disabled={submittingVol}
                      className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F] disabled:opacity-50"
                    >
                      <HeartHandshake className="w-4 h-4 text-[#FFD0CC]" />
                      <span>{submittingVol ? "Submitting..." : "Confirm Volunteering"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
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

      {/* PRODUCTION MAINTAINER EDIT MODAL (PAST IMAGE LOCK RULE) */}
      <ProductionEditModal
        open={Boolean(selectedEditPlay)}
        onClose={() => setSelectedEditPlay(null)}
        production={selectedEditPlay}
        onSuccess={handlePlayEditSuccess}
      />
    </div>
  );
}

