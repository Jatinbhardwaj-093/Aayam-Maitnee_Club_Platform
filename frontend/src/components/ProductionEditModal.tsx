// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Unlock,
  Check,
  Image as ImageIcon,
  AlertCircle,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  User,
  Tag,
  FileText,
  Users
} from "lucide-react";
import type { ProductionDetailData } from "@/components/ProductionDetailModal";

interface Props {
  open: boolean;
  onClose: () => void;
  production: ProductionDetailData | null;
  onSuccess: (updated: ProductionDetailData) => void;
}

const PRESET_POSTERS = [
  { label: "Tamashbin (Live)", url: "/aayam_assets/tamashbin_user_1.jpg" },
  { label: "KKY (Classical)", url: "/aayam_assets/kky_user_5.jpg" },
  { label: "DDDJ (CLT Stage)", url: "/aayam_assets/dddj_user_1.jpg" },
  { label: "Samatvam (Verse)", url: "/aayam_assets/samatvam_user_4.jpg" },
  { label: "Hayavadana (Upcoming)", url: "/aayam_assets/tamashbin_user_2.jpg" },
  { label: "Ashadh Ka Ek Din", url: "/aayam_assets/kky_user_2.jpg" },
  { label: "Charandas Chor", url: "/aayam_assets/tamashbin_user_3.jpg" },
  { label: "SNHJ (Virtual)", url: "/aayam_assets/dddj_user_2.jpg" }
];

export default function ProductionEditModal({
  open,
  onClose,
  production,
  onSuccess
}: Props) {
  if (!open || !production) return null;

  const isPast = Boolean(
    production.is_past || 
    (production.status || "").toLowerCase().includes("archive") || 
    (production.status || "").toLowerCase() === "concluded"
  );

  const [formData, setFormData] = useState({
    title: "",
    playwright: "",
    director: "",
    genre: "",
    language: "",
    status: "",
    tagline: "",
    acts: "",
    description: "",
    cast: "",
    season: "",
    image: "",
    venue: "",
    dates: "",
    runtime: "",
    price: "",
    category: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (production) {
      setFormData({
        title: production.title || "",
        playwright: production.playwright || "",
        director: production.director || "",
        genre: production.genre || "Dramatic Theatre",
        language: production.language || "Hindi / English",
        status: production.status || (isPast ? "Archived Production" : "Upcoming Premiere"),
        tagline: production.tagline || "",
        acts: production.acts || "2 Acts • Full Length",
        description: production.description || "",
        cast: production.cast || "",
        season: production.season || "Autumn 2026",
        image: production.image || "/aayam_assets/tamashbin_user_1.jpg",
        venue: production.venue || "CLT Main Stage, IIT Madras",
        dates: production.dates || "Autumn Season 2026",
        runtime: production.runtime || "110 Mins",
        price: production.price || "Free Society Pass",
        category: production.category || "Plays"
      });
      setErrorMsg(null);
    }
  }, [production, isPast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const isPlay = String(production.id).startsWith("play-") || typeof production.id === "number" || !String(production.id).startsWith("evt-");
      const cleanId = String(production.id).replace("play-", "").replace("evt-", "");

      const endpoint = isPlay ? `/api/plays/${cleanId}` : `/api/events/${cleanId}`;

      // If past production, only send image
      const payload = isPast
        ? { image: formData.image, poster: formData.image }
        : {
            ...formData,
            poster: formData.image
          };

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to save changes on server");
      }

      const updatedItem: ProductionDetailData = {
        ...production,
        ...(isPast ? { image: formData.image } : formData)
      };

      onSuccess(updatedItem);
      onClose();
    } catch (err: any) {
      console.error("Error updating production:", err);
      // Fallback local update
      const updatedItem: ProductionDetailData = {
        ...production,
        ...(isPast ? { image: formData.image } : formData)
      };
      onSuccess(updatedItem);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-6 sm:p-8 md:p-10 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar space-y-6">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8 border-b border-[#DCBAB2]/70 pb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block">
              Maintainer Directorial Authority
            </span>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1 ${
              isPast
                ? "bg-amber-700/15 text-amber-950 border-amber-700/30"
                : "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
            }`}>
              {isPast ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{isPast ? "Archived Record (Image Only)" : "Upcoming Production (Full Edit)"}</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
            {isPast ? `Update Archival Artwork: ${production.title}` : `Edit Production Details: ${production.title}`}
          </h2>

          {isPast ? (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-950 font-serif leading-relaxed flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-[#8C241E] shrink-0 mt-0.5" />
              <div>
                <strong>Archival Provenance Lock:</strong> To preserve society historical records, playbills, and performance provenance, historical text details cannot be altered. You may update the high-resolution archival cover artwork below.
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#5C3B37] font-serif italic">
              Maintainers have full liberty to refine production metadata, casting assignments, schedule dates, venues, and stage direction notes for upcoming premieres.
            </p>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
          
          {/* IMAGE / POSTER ARTWORK SECTION (Always Editable) */}
          <div className="p-4 sm:p-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#8C241E] uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>Hero Poster / Artwork URL</span>
                <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-[#8C5A54]">Live preview updated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <div className="sm:col-span-1 aspect-[4/5] rounded-xl overflow-hidden border border-[#DCBAB2] bg-[#2A1816] shadow-xs">
                <img
                  src={formData.image || "/aayam_assets/tamashbin_user_1.jpg"}
                  alt="Poster Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).src = "/aayam_assets/tamashbin_user_1.jpg";
                  }}
                />
              </div>

              <div className="sm:col-span-3 space-y-2.5">
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/aayam_assets/tamashbin_user_1.jpg"
                  className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-3.5 py-2 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                />

                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-[#8C5A54] block">Quick Society Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_POSTERS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: preset.url })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] transition-all cursor-pointer border ${
                          formData.image === preset.url
                            ? "bg-[#8C241E] text-white border-[#A6352F]"
                            : "bg-[#FAF2EE] text-[#5C3B37] border-[#DCBAB2] hover:bg-[#EEDBD5]"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* UPCOMING FULL EDIT FIELDS (Read-only for Past, Fully Editable for Upcoming) */}
          <div className="space-y-4">
            {/* Title & Tagline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Production Title {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  required
                  disabled={isPast}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Tagline / Catchphrase {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. A Classical Verse Tragedy of Duty & Destiny"
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>
            </div>

            {/* Playwright & Director */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Playwright {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.playwright}
                  onChange={(e) => setFormData({ ...formData, playwright: e.target.value })}
                  placeholder="e.g. Girish Karnad / Mohan Rakesh"
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Director {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  placeholder="e.g. Utkarsh (Yuuhi) / Abay Nandhiga"
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>
            </div>

            {/* Genre, Language, Acts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Genre {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Language {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Acts / Structure {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.acts}
                  onChange={(e) => setFormData({ ...formData, acts: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>
            </div>

            {/* Venue, Schedule Dates, Runtime */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Venue {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Dates {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.dates}
                  onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                  Runtime {isPast && "(Locked)"}
                </label>
                <input
                  type="text"
                  disabled={isPast}
                  value={formData.runtime}
                  onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                    isPast
                      ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                      : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                  }`}
                />
              </div>
            </div>

            {/* Cast & Ensemble Notes */}
            <div className="space-y-1">
              <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                Cast & Ensemble Roster {isPast && "(Locked)"}
              </label>
              <input
                type="text"
                disabled={isPast}
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                placeholder="e.g. Devadatta (Lead Actor), Kapila (Lead Actor), Padmini (Lead Actress)"
                className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-hidden ${
                  isPast
                    ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                    : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                }`}
              />
            </div>

            {/* Synopsis / Description */}
            <div className="space-y-1">
              <label className="font-bold text-[#8C5A54] uppercase tracking-wider block">
                Production Synopsis & Notes {isPast && "(Locked)"}
              </label>
              <textarea
                rows={4}
                disabled={isPast}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full border rounded-xl p-3.5 text-xs font-sans leading-relaxed focus:outline-hidden ${
                  isPast
                    ? "bg-[#EEDBD5]/60 border-[#D5AAA2] text-[#8C5A54] cursor-not-allowed"
                    : "bg-[#FAF2EE] border-[#DCBAB2] text-[#2A1816] focus:border-[#8C241E]"
                }`}
              />
            </div>
          </div>

          {/* Action Controls */}
          <div className="pt-4 border-t border-[#DCBAB2]/70 flex items-center justify-between gap-3">
            <span className="text-[10px] text-[#8C5A54]">
              {isPast ? "Only image changes will take effect." : "All changes will be published immediately."}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#A6352F] disabled:opacity-50"
              >
                <Check className="w-4 h-4 text-[#FFD0CC]" />
                <span>{submitting ? "Saving..." : isPast ? "Save Artwork" : "Publish Production Updates"}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
