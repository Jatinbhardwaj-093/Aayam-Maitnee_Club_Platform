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
  Compass
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
  const isPast = production.is_past || (production.status || "").toLowerCase().includes("archive") || (production.status || "").toLowerCase() === "concluded";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 md:p-10 max-w-4xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-7">
        
        {/* Top-Right Rotating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Modal Header & Status */}
        <div className="space-y-4 pr-8 border-b border-[#DCBAB2]/70 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
              {production.category || "Theatrical Production"}
            </span>

            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isPast
                ? "bg-[#E4D9D2]/80 text-[#6B5550] border-[#CBB3AC]"
                : "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
            }`}>
              {production.status || (isPast ? "Archived Repertory" : "Upcoming Premiere")}
            </span>

            {production.season && (
              <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider font-semibold">
                • {production.season}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2A1816] tracking-tight font-normal leading-tight">
              {production.title}
            </h1>
            <p className="text-sm sm:text-base text-[#6E4742] font-serif italic">
              Written by <span className="font-normal text-[#2A1816]">{production.playwright || playbook?.playwright || "Classical Drama"}</span> • Directed by <span className="font-normal text-[#2A1816]">{production.director || "Aayam Directorial Board"}</span>
            </p>
          </div>

          {production.tagline && (
            <p className="text-xs font-mono text-[#8C241E] font-medium uppercase tracking-wider">
              "{production.tagline}"
            </p>
          )}
        </div>

        {/* Hero Artwork Preview & Quick Spec Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Image Artwork Banner */}
          <div className="md:col-span-1 space-y-3">
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

            {/* Quick Action Button for Script */}
            {onOpenScript && (
              <button
                type="button"
                onClick={() => onOpenScript(production.title)}
                className="w-full px-4 py-2.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs border border-[#A6352F]"
              >
                <FileText className="w-3.5 h-3.5 text-[#FFD0CC]" />
                <span>Read Script Playbook</span>
              </button>
            )}
          </div>

          {/* Core Specs Grid */}
          <div className="md:col-span-2 space-y-5">
            {/* Meta Badges Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl space-y-1">
                <span className="font-mono text-[9px] uppercase font-bold text-[#8C5A54] block">Language</span>
                <span className="font-mono text-xs font-semibold text-[#2A1816]">{production.language || playbook?.language || "Hindi / English"}</span>
              </div>

              <div className="p-3 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl space-y-1">
                <span className="font-mono text-[9px] uppercase font-bold text-[#8C5A54] block">Genre & Style</span>
                <span className="font-mono text-xs font-semibold text-[#2A1816]">{production.genre || playbook?.genre || "Dramatic Theatre"}</span>
              </div>

              <div className="p-3 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl space-y-1">
                <span className="font-mono text-[9px] uppercase font-bold text-[#8C5A54] block">Structure</span>
                <span className="font-mono text-xs font-semibold text-[#2A1816]">{production.acts || playbook?.acts || "2 Acts • Full Length"}</span>
              </div>

              <div className="p-3 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl space-y-1">
                <span className="font-mono text-[9px] uppercase font-bold text-[#8C5A54] block">Runtime</span>
                <span className="font-mono text-xs font-semibold text-[#2A1816] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#8C241E]" />
                  {production.runtime || "90-110 Mins"}
                </span>
              </div>

              <div className="p-3 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl space-y-1">
                <span className="font-mono text-[9px] uppercase font-bold text-[#8C5A54] block">Stage Venue</span>
                <span className="font-mono text-xs font-semibold text-[#2A1816] flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-[#8C241E] shrink-0" />
                  <span className="truncate">{production.venue || "CLT Main Stage, IIT Madras"}</span>
                </span>
              </div>

              <div className="p-3 bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl space-y-1">
                <span className="font-mono text-[9px] uppercase font-bold text-[#8C5A54] block">Schedule</span>
                <span className="font-mono text-xs font-semibold text-[#2A1816] flex items-center gap-1 truncate">
                  <Calendar className="w-3 h-3 text-[#8C241E] shrink-0" />
                  <span className="truncate">{production.dates || "Autumn Season 2026"}</span>
                </span>
              </div>
            </div>

            {/* Synopsis & Premise */}
            <div className="space-y-2 p-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>Production Synopsis & Directorial Note</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#5C3B37] font-sans font-light leading-relaxed">
                {production.description || playbook?.abstract || "Official society stage production exploring timeless dramatic conflicts, emotional subtexts, and intense choral choreography."}
              </p>
            </div>

            {/* Cast & Dramatis Personae */}
            <div className="space-y-2.5 p-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl shadow-xs">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>Cast & Character Ensemble</span>
              </h3>

              {playbook?.characters && playbook.characters.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {playbook.characters.map((char) => (
                    <div key={char.id} className="p-2.5 rounded-xl bg-[#F5EAE6] border border-[#DEBEB7] flex items-start gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${char.color || "bg-[#8C241E]"}`} />
                      <div className="min-w-0">
                        <span className="font-serif font-bold text-[#2A1816] block">{char.name}</span>
                        <span className="text-[11px] text-[#6E4742] font-light leading-tight block">{char.traits}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : production.cast ? (
                <p className="text-xs font-mono text-[#5C3B37] leading-relaxed bg-[#F5EAE6] p-3 rounded-xl border border-[#DEBEB7]">
                  {production.cast}
                </p>
              ) : (
                <p className="text-xs font-serif italic text-[#8C5A54]">
                  Ensemble auditions currently in progress. Character assignments updated post-casting call.
                </p>
              )}
            </div>

            {/* Scenography & Stage Notes */}
            {playbook?.settingInfo && (
              <div className="p-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-1.5 text-xs">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Scenography & Staging Atmosphere</span>
                </span>
                <p className="text-[#6E4742] font-serif italic leading-relaxed">
                  {playbook.settingInfo}
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Footer info bar */}
        <div className="pt-4 border-t border-[#DCBAB2]/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#8C5A54]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-[#8C241E]" />
              {production.price || "Free Society Access / Registered Pass"}
            </span>
          </div>

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
  );
}
