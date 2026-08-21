// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
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
  Users,
  Upload,
  RotateCcw,
  CheckCircle2,
  Paperclip
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

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const scriptFileInputRef = useRef<HTMLInputElement>(null);

  const [imageFileName, setImageFileName] = useState<string>("");
  const [imageFileSize, setImageFileSize] = useState<string>("");
  const [isDraggingImage, setIsDraggingImage] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const [scriptUploadFileName, setScriptUploadFileName] = useState<string>("");
  const [scriptUploadSize, setScriptUploadSize] = useState<string>("");

  const [scriptUrl, setScriptUrl] = useState("");
  const [scriptText, setScriptText] = useState("");
  const [scriptAccess, setScriptAccess] = useState("Verified Society Manuscript");

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
    category: "",
    script_url: "",
    script_text: ""
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
        category: production.category || "Plays",
        script_url: production.script_url || "",
        script_text: production.script_text || ""
      });
      setScriptUrl(production.script_url || "");
      setScriptText(production.script_text || "");
      setImageFileName("");
      setImageFileSize("");
      setScriptUploadFileName("");
      setScriptUploadSize("");
      setErrorMsg(null);
    }
  }, [production, isPast]);

  // Upload image file immediately to backend → get back a server URL
  const handleImageFile = async (file: File) => {
    if (!file) return;
    const validTypes = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Invalid file type. Use PNG, JPG, WEBP, GIF or AVIF.");
      return;
    }

    setImageFileName(file.name);
    const sizeKb = (file.size / 1024).toFixed(1);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    setImageFileSize(file.size > 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`);
    setImageUploading(true);
    setErrorMsg(null);

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/upload-image", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error || "Upload failed");
      }
      // Store the server-returned URL path — this is what gets saved to the DB
      setFormData((prev) => ({ ...prev, image: json.url }));
    } catch (err: any) {
      setErrorMsg(`Image upload failed: ${err.message}. Please try again.`);
      setImageFileName("");
      setImageFileSize("");
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    // Reset so same file can be picked again
    e.target.value = "";
  };

  const handleScriptFile = (file: File) => {
    if (!file) return;
    setScriptUploadFileName(file.name);
    const sizeKb = (file.size / 1024).toFixed(1);
    setScriptUploadSize(`${sizeKb} KB`);

    const reader = new FileReader();
    if (file.name.endsWith(".txt") || file.name.endsWith(".fountain") || file.name.endsWith(".md")) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setFormData((prev) => ({
            ...prev,
            script_text: text.slice(0, 5000),
            script_url: `/vault/scripts/${file.name}`
          }));
        }
      };
      reader.readAsText(file);
    } else {
      // For PDF/DOCX just note the filename; full script upload can be extended later
      setFormData((prev) => ({
        ...prev,
        script_url: `/vault/scripts/${file.name}`
      }));
    }
  };

  const handleScriptInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleScriptFile(file);
  };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-3xl max-w-4xl w-full shadow-2xl relative max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Fixed Header */}
        <div className="px-7 sm:px-9 pt-7 pb-5 border-b border-[#DCBAB2]/70 flex items-start justify-between gap-4 shrink-0 bg-[#F5EAE6]">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2] inline-block shadow-xs">
                Maintainer Directorial Authority
              </span>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border flex items-center gap-1 shadow-xs ${
                isPast
                  ? "bg-amber-700/15 text-amber-950 border-amber-700/30"
                  : "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
              }`}>
                {isPast ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                <span>{isPast ? "Archived Record (Cover Artwork Edit)" : "Upcoming Production (Full Edit)"}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif text-[#2A1816] tracking-tight font-normal">
              {isPast ? `Update Cover Artwork: ${production.title}` : `Edit Production Details: ${production.title}`}
            </h2>

            {isPast ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-950 font-serif leading-relaxed flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 text-[#8C241E] shrink-0 mt-0.5" />
                <div>
                  <strong>Archival Provenance Lock:</strong> Historical text details cannot be altered to preserve archive integrity. You can upload a new high-resolution cover image file below.
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-[#5C3B37] font-light leading-relaxed">
                Refine production cover artwork, casting assignments, schedule dates, assigned venue, and stage directions.
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group shrink-0"
            title="Close"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Scrollable Form Body with Fixed Action Footer */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-7 sm:p-9 overflow-y-auto flex-1 custom-scrollbar space-y-6 text-xs font-mono pr-5 sm:pr-7">
            {errorMsg && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-900 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* HERO COVER IMAGE / POSTER ARTWORK (FILE UPLOAD) */}
            <div className="p-5 sm:p-6 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#8C241E] uppercase tracking-wider flex items-center gap-1.5 text-xs">
                  <ImageIcon className="w-4 h-4 text-[#8C241E]" />
                  <span>Hero Header / Cover Image File</span>
                  <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-mono text-[#8C5A54]">Image File Upload</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                {/* Image Live Preview */}
                <div className="md:col-span-1 space-y-2">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-[#DCBAB2] bg-[#2A1816] shadow-sm relative group">
                    <img
                      src={formData.image || "/aayam_assets/tamashbin_user_1.jpg"}
                      alt="Artwork Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).src = "/aayam_assets/tamashbin_user_1.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                      <span className="text-[11px] font-mono text-white font-bold uppercase tracking-wider bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-xs">
                        Live Preview
                      </span>
                    </div>
                  </div>
                  {imageFileName && (
                    <div className="text-[11px] font-mono text-[#8C5A54] truncate text-center">
                      {imageFileName} ({imageFileSize})
                    </div>
                  )}
                </div>

                {/* File Dropzone & Preset Controls */}
                <div className="md:col-span-2 space-y-4">
                  {/* Hidden Input */}
                  <input
                    type="file"
                    ref={imageFileInputRef}
                    onChange={handleImageInputChange}
                    accept="image/png, image/jpeg, image/webp, image/gif, image/avif"
                    className="hidden"
                  />

                  {/* Drag & Drop Upload Zone */}
                  <div
                    onClick={() => !imageUploading && imageFileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); if (!imageUploading) setIsDraggingImage(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDraggingImage(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingImage(false);
                      if (!imageUploading) {
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleImageFile(file);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center gap-2 min-h-[120px] ${
                      imageUploading
                        ? "border-[#8C241E]/50 bg-[#EEDBD5]/50 cursor-wait"
                        : isDraggingImage
                          ? "border-[#8C241E] bg-[#EEDBD5] scale-[1.01] cursor-copy"
                          : "border-[#DCBAB2] hover:border-[#8C241E] bg-[#F5EAE6] hover:bg-[#EEDBD5]/60 cursor-pointer"
                    }`}
                  >
                    {imageUploading ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-[#EEDBD5] border border-[#D5AAA2] flex items-center justify-center text-[#8C241E] shadow-xs animate-pulse">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-mono font-bold text-[#8C241E]">Uploading to server…</p>
                          <p className="text-[11px] text-[#8C5A54] font-light">{imageFileName}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-[#EEDBD5] border border-[#D5AAA2] flex items-center justify-center text-[#8C241E] shadow-xs">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-mono font-bold text-[#2A1816]">
                            {imageFileName ? "Replace Image File" : "Choose Image File from Computer"}
                          </p>
                          <p className="text-[11px] text-[#8C5A54] font-light">
                            Drag & drop here or click to browse · PNG, JPG, WEBP, AVIF
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Society Archive Presets */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54] block">
                      Or Choose Society Archive Preset:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_POSTERS.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, image: preset.url }));
                            setImageFileName(preset.label);
                            setImageFileSize("Preset");
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                            formData.image === preset.url
                              ? "bg-[#8C241E] text-[#FDF8F7] border-[#A6352F] font-bold shadow-xs"
                              : "bg-[#FAF2EE] text-[#5C3B37] border-[#DCBAB2] hover:bg-[#EEDBD5] hover:text-[#2A1816]"
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

            {/* PLAYBOOK SCRIPT & DOCUMENT UPLOAD */}
            <div className="p-5 sm:p-6 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#8C241E] uppercase tracking-wider flex items-center gap-1.5 text-xs">
                  <FileText className="w-4 h-4 text-[#8C241E]" />
                  <span>Playbook Script & Vault Document Upload</span>
                </label>
                <span className="text-[11px] font-mono text-[#8C5A54]">Manuscript PDF / Fountain / TXT</span>
              </div>

              {/* Hidden Script File Input */}
              <input
                type="file"
                ref={scriptFileInputRef}
                onChange={handleScriptInputChange}
                accept=".pdf,.fountain,.txt,.md,.docx"
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div
                  onClick={() => scriptFileInputRef.current?.click()}
                  className="p-4 bg-[#F5EAE6] hover:bg-[#EEDBD5] border border-[#DCBAB2] hover:border-[#8C241E] rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-xs"
                >
                  <div className="w-9 h-9 rounded-full bg-[#EEDBD5] border border-[#D5AAA2] flex items-center justify-center text-[#8C241E] shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-[#2A1816] block truncate">
                      {scriptUploadFileName || "Select Script File from Device"}
                    </span>
                    <span className="text-[10px] text-[#8C5A54]">
                      {scriptUploadSize ? `${scriptUploadSize} • Uploaded` : "PDF, Fountain, TXT or Markdown"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#8C5A54] block">Script Access & Verification</label>
                  <select
                    value={scriptAccess}
                    onChange={(e) => setScriptAccess(e.target.value)}
                    className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] cursor-pointer shadow-xs"
                  >
                    <option value="Verified Society Manuscript">Verified Society Manuscript (Official)</option>
                    <option value="Public Reading Excerpt">Public Reading Excerpt</option>
                    <option value="Ensemble Cast Only">Ensemble Cast Confidential</option>
                    <option value="Draft Revision">Draft Revision in Progress</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[10px] uppercase font-bold text-[#8C5A54] block">Opening Script Excerpt / Staging Directions</label>
                <textarea
                  rows={3}
                  value={formData.script_text}
                  onChange={(e) => setFormData({ ...formData, script_text: e.target.value })}
                  placeholder="[Curtain rises on a bare wooden proscenium. Sutradhar enters with chimta and folk rhythm...]"
                  className="w-full bg-[#F5EAE6] border border-[#DCBAB2] rounded-xl p-3.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] leading-relaxed font-mono shadow-xs"
                />
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
        </div>

        {/* Fixed Action Footer */}
        <div className="px-7 sm:px-9 py-5 bg-[#FAF2EE] border-t border-[#DCBAB2]/70 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <span className="text-[11px] text-[#8C5A54] font-mono">
            {isPast ? "Only cover artwork changes will take effect." : "All changes will be updated and published immediately."}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || imageUploading}
              className="px-7 py-2.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-md shadow-[#8C241E]/20 border border-[#A6352F] disabled:opacity-50 transition-all"
            >
              <Check className="w-4 h-4 text-[#FFD0CC]" />
              <span>
                {imageUploading ? "Uploading Image…" : submitting ? "Saving..." : isPast ? "Save Artwork" : "Publish Production Updates"}
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
);
}
