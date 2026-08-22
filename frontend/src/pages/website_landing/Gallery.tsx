// @ts-nocheck
import { useState, useEffect } from "react";
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Camera,
  Flame,
  ArrowUpRight,
  Eye,
  Tag,
  Download,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";
import { fallbackGalleryData } from "../maintainers/galleryFallbackData";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  uploadedAt: string;
  status: string;
  uploaderName: string;
}

const CATEGORIES = ["All", "Tamashbin Kathputliya", "KKY", "DDDJ", "Samatvam", "Speak Up Tara"];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(fallbackGalleryData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5005";
    fetch(`${baseUrl}/api/gallery`)
      .then((res) => {
        const cType = res.headers.get("content-type") || "";
        if (!res.ok || !cType.includes("application/json")) {
          throw new Error("HTTP Error");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          setItems(fallbackGalleryData);
        }
      })
      .catch(() => {
        setItems(fallbackGalleryData);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const activeLightboxItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeLightboxIndex !== null && activeLightboxIndex > 0) {
      setActiveLightboxIndex(activeLightboxIndex - 1);
    } else if (activeLightboxIndex === 0) {
      setActiveLightboxIndex(filteredItems.length - 1);
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeLightboxIndex !== null && activeLightboxIndex < filteredItems.length - 1) {
      setActiveLightboxIndex(activeLightboxIndex + 1);
    } else if (activeLightboxIndex === filteredItems.length - 1) {
      setActiveLightboxIndex(0);
    }
  };

  const handleDownloadImage = async (e: React.MouseEvent, imageUrl: string, title: string, itemId: number) => {
    e.stopPropagation();
    setDownloadingId(itemId);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const cleanName = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      link.download = `aayam-${cleanName || "frame"}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.target = "_blank";
      link.download = `aayam-${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloadingId(null), 1200);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") setActiveLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  return (
    <div className="min-h-screen bg-[#E7DDD3] text-[#2C2A28] font-sans pt-8 pb-24 selection:bg-[#F8E8E4]">
      <main className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
        
        {/* Editorial Header Section */}
        <section className="pb-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57]">
                <Flame className="w-3.5 h-3.5" />
                <span>STAGE ARCHIVE // PRODUCTION GALLERY</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#2C2A28] font-normal tracking-tight leading-none">
                Visual Chronicles of Aayam
              </h1>
              <p className="text-sm md:text-base text-[#666361] max-w-2xl leading-relaxed font-light mt-1">
                Archival photography from live proscenium plays, courtyard Nukkad Nataks, masterclasses, and backstage rehearsals.
              </p>
            </div>

            <div className="flex items-center gap-2.5 bg-[#2C2A28] text-white px-4 py-2 rounded-full border border-[#353535] shrink-0 text-xs font-mono">
              <Camera className="w-3.5 h-3.5 text-[#E85F57]" />
              <span>{filteredItems.length} Archived Frames</span>
            </div>
          </div>
        </section>

        {/* Filter Controls Bar (Centered between subtle dividers) */}
        <section className="sticky top-20 z-40 bg-[#E7DDD3]/95 backdrop-blur-md py-4 border-y border-[#D5C9BE]/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E85F57] uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>PRODUCTION ARCHIVE</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 text-xs font-mono font-bold rounded-full transition-all uppercase tracking-wider ${
                    selectedCategory === cat
                      ? "bg-[#2C2A28] text-white shadow-md"
                      : "bg-[#FAF2EE]/70 text-[#666361] hover:bg-[#FAF2EE] border border-[#D5C9BE]/60"
                  }`}
                >
                  {cat === "KKY" ? "Karn Ki Yachika" : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Asymmetric / Organic Editorial Masonry Grid */}
        {loading ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 bg-[#2C2A28]/20 animate-pulse rounded-[2rem] border border-[#D5C9BE]/40" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#2C2A28] text-white rounded-[2.5rem] p-12 border border-[#353535] shadow-2xl">
            <Camera className="w-12 h-12 text-[#E85F57] mx-auto mb-4" />
            <h3 className="font-serif text-3xl font-normal text-[#F7F5F0]">No archival frames in this collection</h3>
            <p className="text-xs text-white/70 mt-2 font-mono">Select another production filter above to explore the gallery.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, idx) => {
              const isDownloading = downloadingId === (item.id || idx);

              return (
                <div
                  key={item.id || idx}
                  onClick={() => setActiveLightboxIndex(idx)}
                  className="break-inside-avoid group cursor-pointer relative bg-[#2C2A28] text-white rounded-[2rem] overflow-hidden border border-[#353535] hover:border-[#E85F57]/60 shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  {/* Photo Canvas */}
                  <div className="relative overflow-hidden bg-[#353535]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-auto object-cover object-center filter brightness-95 contrast-105 group-hover:scale-105 group-hover:filter group-hover:brightness-105 transition-all duration-700"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2C2A28] via-[#2C2A28]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Top Pill Badges & Download Button */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="bg-[#2C2A28]/85 backdrop-blur-md text-white/90 text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 shadow-sm">
                        {item.category}
                      </span>
                      
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          title="Download Frame"
                          onClick={(e) => handleDownloadImage(e, item.imageUrl, item.title, item.id || idx)}
                          className="w-8 h-8 rounded-full bg-[#2C2A28]/85 backdrop-blur-md border border-white/10 hover:border-[#E85F57] hover:bg-[#E85F57] flex items-center justify-center text-white/90 transition-all shadow-sm"
                        >
                          {isDownloading ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                        </button>
                        <div className="w-8 h-8 rounded-full bg-[#2C2A28]/85 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 group-hover:text-[#E85F57] transition-all">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption & Metadata Container */}
                  <div className="p-6 space-y-2">
                    <h3 className="font-serif text-xl md:text-2xl text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/70 font-light leading-relaxed line-clamp-2">
                      {item.caption || "Archival performance capture from seasonal production."}
                    </p>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
                      <span>Curated by {item.uploaderName || "Aayam"}</span>
                      <span className="text-[#E85F57] font-semibold flex items-center gap-1">
                        View Frame <Eye className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* LIGHTBOX DIALOG POPUP */}
      {activeLightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in-50 duration-200"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Close Trigger */}
          <button 
            type="button" 
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 text-white/70 hover:text-white bg-[#FAF2EE]/10 hover:bg-[#E85F57] w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Arrow */}
          <button 
            type="button" 
            onClick={handlePrev}
            className="absolute left-4 md:left-8 z-50 text-white/70 hover:text-white bg-[#FAF2EE]/10 hover:bg-[#E85F57] w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow */}
          <button 
            type="button" 
            onClick={handleNext}
            className="absolute right-4 md:right-8 z-50 text-white/70 hover:text-white bg-[#FAF2EE]/10 hover:bg-[#E85F57] w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all shadow-xl"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div 
            className="max-w-5xl w-full bg-[#2C2A28] border border-[#353535] rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Canvas */}
            <div className="md:w-3/5 bg-black/40 flex items-center justify-center p-4 relative min-h-[350px] md:min-h-[500px]">
              <img 
                src={activeLightboxItem.imageUrl} 
                alt={activeLightboxItem.title} 
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
              />
            </div>

            {/* Editorial Metadata Sidebar */}
            <div className="md:w-2/5 p-8 md:p-10 flex flex-col justify-between space-y-6 bg-[#2C2A28]">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-[#E85F57] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    {activeLightboxItem.category}
                  </span>
                  <span className="text-[10px] font-mono text-white/50">
                    FRAME {(activeLightboxIndex ?? 0) + 1} OF {filteredItems.length}
                  </span>
                </div>

                <h2 className="font-serif text-2xl md:text-3xl text-[#F7F5F0] leading-snug">
                  {activeLightboxItem.title}
                </h2>

                <p className="text-xs text-white/70 font-light leading-relaxed">
                  {activeLightboxItem.caption || "Archival documentation of live ensemble performance and stagecraft."}
                </p>

                <div className="pt-3 border-t border-white/10 space-y-2 text-xs font-mono text-white/60">
                  <div className="flex justify-between">
                    <span className="text-white/40">Curator:</span>
                    <span className="text-white">{activeLightboxItem.uploaderName || "Aayam Dramaturgy"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Archive Date:</span>
                    <span className="text-white">{activeLightboxItem.uploadedAt || "Season 2026"}</span>
                  </div>
                </div>

                {/* Lightbox Download CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => handleDownloadImage(e, activeLightboxItem.imageUrl, activeLightboxItem.title, activeLightboxItem.id || (activeLightboxIndex ?? 0))}
                    className="w-full py-3 px-5 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Archival Frame</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                <Link to="/plays" className="text-[#E85F57] hover:underline flex items-center gap-1 font-bold">
                  Explore Repertoire <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button 
                  onClick={() => setActiveLightboxIndex(null)}
                  className="text-white/50 hover:text-white"
                >
                  Close [ESC]
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
