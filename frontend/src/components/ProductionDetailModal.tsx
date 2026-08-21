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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Outer Card with controlled border radius and hidden overflow for clean scrollbar containment */}
      <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-3xl max-w-5xl w-full shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top-Right Rotating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
          title="Close Dossier"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Scrollable Inner Container with Custom Thin Scrollbar */}
        <div className="overflow-y-auto custom-scrollbar p-6 sm:p-8 md:p-10 space-y-7 pr-4 sm:pr-6 md:pr-8">
          
          {/* Header & Lineage */}
          <div className="space-y-3 pr-8 border-b border-[#DCBAB2]/70 pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
                {production.category || "Stage Play"}
              </span>

              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                isPast
                  ? "bg-[#E4D9D2]/80 text-[#6B5550] border-[#CBB3AC]"
                  : "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
              }`}>
                {production.status || (isPast ? "Archived Production" : "Upcoming Premiere")}
              </span>

              <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider font-semibold">
                • {isPast ? "Archive Lineage" : "Season 2026-2027"} • {production.season || "Autumn Season"}
              </span>
            </div>

            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2A1816] tracking-tight font-normal leading-tight">
                {production.title}
              </h1>
              <p className="text-sm sm:text-base text-[#6E4742] font-serif italic">
                Written by <span className="font-normal text-[#2A1816]">{production.playwright || playbook?.playwright || "Classical Ensemble Adaptation"}</span> • Directed by <span className="font-normal text-[#2A1816]">{production.director || "Aayam Directorial Council"}</span>
              </p>
            </div>

            {production.tagline && (
              <p className="text-xs font-mono text-[#8C241E] font-medium uppercase tracking-wider pt-0.5">
                "{production.tagline}"
              </p>
            )}
          </div>

          {/* Main Dossier Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-7 items-start">
            
            {/* Left Column: Artwork Poster & Script CTA (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#DCBAB2] shadow-md bg-[#2A1816]">
                <img
                  src={production.image || "/aayam_assets/tamashbin_user_1.jpg"}
                  alt={production.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).src = "/aayam_assets/tamashbin_user_1.jpg";
                  }}
                />
              </div>

              {/* Read Script Playbook Button */}
              {onOpenScript && (
                <button
                  type="button"
                  onClick={() => onOpenScript(production.title)}
                  className="w-full px-4 py-3 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md border border-[#A6352F]"
                >
                  <FileText className="w-4 h-4 text-[#FFD0CC]" />
                  <span>Read Script Playbook</span>
                </button>
              )}
            </div>

            {/* Right Column: Unified Specifications & Theatrical Dossier (8 cols) */}
            <div className="md:col-span-8 space-y-6">
              
              {/* UNIFIED THEATRICAL SPECIFICATION PANEL (Single cohesive panel instead of 6 separate bento boxes) */}
              <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
                  <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider font-bold">
                    Production Specifications & Format
                  </span>
                  <span className="text-[10px] font-mono text-[#8C241E] font-semibold">
                    {production.runtime || "90-110 Mins"}
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

              {/* Synopsis & Directorial Note */}
              <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-6 shadow-xs space-y-2.5">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Production Synopsis & Directorial Note</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#5C3B37] font-sans font-light leading-relaxed">
                  {production.description || playbook?.abstract || "Official society stage production exploring timeless dramatic conflicts, emotional subtexts, and intense choral choreography."}
                </p>
              </div>

              {/* Cast & Character Ensemble */}
              <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-6 shadow-xs space-y-3.5">
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

              {/* Scenography & Atmosphere */}
              {playbook?.settingInfo && (
                <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-6 shadow-xs space-y-2 text-xs">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#8C241E]" />
                    <span>Scenography & Staging Atmosphere</span>
                  </span>
                  <p className="text-[#6E4742] font-serif italic leading-relaxed text-xs sm:text-sm">
                    {playbook.settingInfo}
                  </p>
                </div>
              )}

            </div>
          </div>

          {/* Footer Bar */}
          <div className="pt-4 border-t border-[#DCBAB2]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#8C5A54]">
            <span className="flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-[#8C241E]" />
              <span>{production.price || "Free Society Access / Registered Pass"}</span>
            </span>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              Close Dossier
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
