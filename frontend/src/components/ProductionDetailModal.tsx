// @ts-nocheck
import React from "react";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  User,
  Tag,
  FileText,
  Users,
  Award,
  Sparkles,
  Ticket,
  Sliders,
  Theater,
  Music,
  Lightbulb,
  ShieldCheck,
  Compass,
  BookOpen
} from "lucide-react";
import { getPlaybookForTitle } from "@/data/playbooksData";

export interface ProductionDetailData {
  id: string | number;
  title: string;
  playwright?: string;
  director?: string;
  genre?: string;
  language?: string;
  status: string;
  is_past?: boolean;
  tagline?: string;
  acts?: string;
  description?: string;
  cast?: string;
  season?: string;
  image?: string;
  venue?: string;
  dates?: string;
  runtime?: string;
  price?: string;
  category?: string;
  auditionCount?: number;
  volunteerCount?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  production: ProductionDetailData | null;
  onOpenScript?: (title: string) => void;
}

export default function ProductionDetailModal({
  open,
  onClose,
  production,
  onOpenScript
}: Props) {
  if (!open || !production) return null;

  const playbook = getPlaybookForTitle(production.title);
  const isPast = Boolean(
    production.is_past || 
    (production.status || "").toLowerCase().includes("archive") || 
    (production.status || "").toLowerCase() === "concluded"
  );

  const handleOpenScript = () => {
    onClose();
    if (onOpenScript) {
      setTimeout(() => onOpenScript(production.title), 50);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-3xl max-w-3xl w-full shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md group z-30 backdrop-blur-xs"
          title="Close Dossier"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1">

          {/* ── CINEMATIC HERO BANNER ── */}
          <div className="relative w-full aspect-[16/7] bg-[#2A1816] overflow-hidden shrink-0">
            <img
              src={production.image || "/aayam_assets/tamashbin_user_1.jpg"}
              alt={production.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLElement).src = "/aayam_assets/tamashbin_user_1.jpg";
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E0C]/95 via-[#1A0E0C]/40 to-transparent" />

            {/* Hero overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2">
              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#FFD0CC] bg-[#8C241E]/80 px-3 py-1 rounded-full border border-[#A6352F]/50 backdrop-blur-xs shadow-xs">
                  {production.category || "Stage Play"}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-xs ${
                  isPast
                    ? "bg-white/10 text-white/80 border-white/20"
                    : "bg-emerald-600/30 text-emerald-200 border-emerald-500/30"
                }`}>
                  {production.status || (isPast ? "Archived Production" : "Upcoming Premiere")}
                </span>
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider font-semibold">
                  {production.season || "Autumn Season"}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white tracking-tight font-normal leading-tight drop-shadow-lg">
                {production.title}
              </h1>

              {/* Playwright / Director */}
              <p className="text-sm text-white/70 font-serif italic">
                Written by{" "}
                <span className="font-normal text-white/90">
                  {production.playwright || playbook?.playwright || "Classical Ensemble Adaptation"}
                </span>{" "}
                • Directed by{" "}
                <span className="font-normal text-white/90">
                  {production.director || "Aayam Directorial Council"}
                </span>
              </p>

              {/* Tagline */}
              {production.tagline && (
                <p className="text-xs font-mono text-[#FFD0CC] font-medium uppercase tracking-wider opacity-90">
                  "{production.tagline}"
                </p>
              )}
            </div>
          </div>

          {/* ── UNIFIED CONTENT BLOCK ── */}
          <div className="p-6 sm:p-8 space-y-6">

            {/* Specs grid — single full-width panel */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
                <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider font-bold">
                  Production Specifications
                </span>
                <span className="text-[10px] font-mono text-[#8C241E] font-semibold">
                  {production.runtime || "90–110 Mins"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C5A54] uppercase tracking-wider font-bold block">Language</span>
                  <span className="text-[#2A1816] font-medium block">{production.language || playbook?.language || "Classical Hindi & Verse"}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C5A54] uppercase tracking-wider font-bold block">Genre & Style</span>
                  <span className="text-[#2A1816] font-medium block">{production.genre || playbook?.genre || "Dramatic Tragedy"}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C5A54] uppercase tracking-wider font-bold block">Structure</span>
                  <span className="text-[#2A1816] font-medium block">{production.acts || playbook?.acts || "3 Acts • Stage Drama"}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C5A54] uppercase tracking-wider font-bold block">Runtime</span>
                  <span className="text-[#2A1816] font-medium block">{production.runtime || "75 Mins (No Intermission)"}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C5A54] uppercase tracking-wider font-bold block">Stage Venue</span>
                  <span className="text-[#2A1816] font-medium block truncate">{production.venue || playbook?.location || "CLT Main Stage, IIT Madras"}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C5A54] uppercase tracking-wider font-bold block">Schedule</span>
                  <span className="text-[#2A1816] font-medium block truncate">{production.dates || "Scheduled Repertory"}</span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>Production Synopsis & Directorial Note</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C3B37] font-sans font-light leading-relaxed">
                {production.description || playbook?.abstract || "Official society stage production exploring timeless dramatic conflicts, emotional subtexts, and intense choral choreography."}
              </p>
            </div>

            {/* Cast & Ensemble */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-5 sm:p-6 shadow-xs space-y-3.5">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>Cast & Character Ensemble</span>
              </h3>

              {playbook?.characters && playbook.characters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {playbook.characters.map((char) => (
                    <div key={char.id} className="p-3 rounded-xl bg-[#F5EAE6] border border-[#DEBEB7] flex items-start gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${char.color || "bg-[#8C241E]"}`} />
                      <div className="min-w-0">
                        <span className="font-serif font-bold text-[#2A1816] block">{char.name}</span>
                        <span className="text-[11px] text-[#6E4742] font-light leading-snug block">{char.traits}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : production.cast ? (
                <div className="bg-[#F5EAE6] p-3.5 rounded-xl border border-[#DEBEB7] text-xs font-mono text-[#5C3B37] leading-relaxed">
                  {production.cast}
                </div>
              ) : (
                <p className="text-xs font-serif italic text-[#8C5A54]">
                  Ensemble auditions currently in progress. Character assignments updated post-casting call.
                </p>
              )}
            </div>

            {/* Scenography */}
            {playbook?.settingInfo && (
              <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2 text-xs">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Scenography & Staging Atmosphere</span>
                </span>
                <p className="text-[#6E4742] font-serif italic leading-relaxed text-xs sm:text-sm">
                  {playbook.settingInfo}
                </p>
              </div>
            )}

            {/* ── FOOTER BAR ── */}
            <div className="pt-2 border-t border-[#DCBAB2]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#8C5A54]">
              <span className="flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>{production.price || "Free Society Access / Registered Pass"}</span>
              </span>

              <div className="flex items-center gap-2.5">
                {onOpenScript && (
                  <button
                    type="button"
                    onClick={handleOpenScript}
                    className="px-5 py-2.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-[#8C241E]/20 border border-[#A6352F]"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#FFD0CC]" />
                    <span>Read Script Playbook</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
