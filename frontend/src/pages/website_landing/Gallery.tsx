// @ts-nocheck
import { useState, useEffect } from "react";
import { Image as ImageIcon, Filter, Maximize2, X, ChevronLeft, ChevronRight, Tag, Calendar, User, CheckCircle2, Sparkles, Layers, ArrowRight } from "lucide-react";
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

const CATEGORIES = ["All", "Tamashbin Kathputliya", "DDDJ", "KKY", "Samatvam", "Speak Up Tara"];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(fallbackGalleryData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || "";
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

  // Keyboard navigation for lightbox
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
    <div className="min-h-screen bg-[#E7DDD3] text-[#232323] font-sans pt-8 pb-20 selection:bg-[#F8E8E4]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
        
        {/* Header Section */}
        <section className="border-b border-[#D5C9BE]/40 pb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#E85F57] mb-2">
                <span>STAGE ARCHIVE // PRODUCTION GALLERY</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#232323] font-normal tracking-tight">
                Visual Chronicles of Aayam
              </h1>
              <p className="text-sm md:text-base text-[#666361] max-w-2xl leading-relaxed font-normal mt-3">
                Archival photography from live proscenium plays, courtyard Nukkad Nataks, masterclasses, and unvarnished backstage rehearsals.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <div className="text-xs font-mono text-[#666361] bg-[#EFE8E1] px-4 py-2 rounded-full border border-[#D5C9BE]/50">
                ARCHIVED FRAMES: <strong className="text-[#232323]">{filteredItems.length}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Exhibition Hero Frame */}
        {filteredItems.length > 0 && !loading && (
          <section 
            onClick={() => {
              const targetIdx = filteredItems.findIndex(i => i.imageUrl.includes("samatvam_user_3"));
              setActiveLightboxIndex(targetIdx >= 0 ? targetIdx : 0);
            }}
            className="group relative bg-[#232323] text-white rounded-3xl overflow-hidden border border-[#353535] shadow-2xl cursor-pointer hover:border-[#E85F57]/60 transition-all duration-500"
          >
            <div className="relative aspect-[16/8] sm:aspect-[21/9] overflow-hidden bg-[#353535]">
              <img
                src="/aayam_assets/samatvam_user_3.jpg"
                alt="Samatvam - Intermission Standing Line-up"
                className="w-full h-full object-cover object-[center_40%] group-hover:scale-105 transition-transform duration-1000 filter brightness-95 contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#232323] via-[#232323]/35 to-transparent" />
              
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <span className="bg-[#E85F57] text-white text-[10px] font-mono font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                  FEATURED EXHIBITION FRAME
                </span>
                <span className="bg-[#232323]/90 text-white/80 border border-white/10 text-[10px] font-mono px-3 py-1 rounded-full uppercase">
                  Samatvam Drama
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl sm:text-4xl text-[#F7F5F0] font-normal leading-tight group-hover:text-[#E85F57] transition-colors">
                    Samatvam — Intermission Standing Line-up
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 max-w-2xl font-light line-clamp-2">
                    Authentic live capture of open-air courtyard ensemble drama during Aayam's signature street production season.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/10 hover:bg-[#E85F57] text-white px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all shrink-0">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge Frame</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Filter Controls Bar */}
        <section className="sticky top-20 z-40 bg-[#E7DDD3]/90 backdrop-blur-md py-4 border-b border-[#D5C9BE]/40">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#232323] p-3 md:p-4 rounded-3xl border border-[#353535] shadow-xl">
            <div className="flex items-center gap-2 text-white/60 text-xs font-mono px-3">
              <Layers className="w-4 h-4 text-[#E85F57]" />
              <span className="hidden sm:inline">SELECT PRODUCTION:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-mono font-semibold transition-all uppercase tracking-wider ${
                    selectedCategory === cat
                      ? "bg-[#E85F57] text-white shadow-md"
                      : "bg-[#353535] text-white/70 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-[#232323]/50 animate-pulse rounded-3xl border border-[#353535]"></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-[#232323] text-white rounded-3xl border border-[#353535] p-12 shadow-xl">
            <ImageIcon className="w-12 h-12 text-[#E85F57] mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-normal text-[#F7F5F0]">No media photos found in this category</h3>
            <p className="text-sm text-white/70 mt-2">Try selecting another category or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative bg-[#232323] text-white rounded-3xl overflow-hidden border border-[#353535] shadow-xl hover:border-[#E85F57]/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#353535]">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/aayam_assets/tamashbin_user_1.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#232323] via-transparent to-transparent"></div>
                    
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#232323]/90 backdrop-blur-md text-[#E85F57] text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md border border-[#E85F57]/30">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-6 text-xs font-mono font-bold text-white/50">
                      0{idx + 1}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-xl font-normal text-[#F7F5F0] group-hover:text-[#E85F57] transition-colors leading-snug line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/70 leading-relaxed font-light line-clamp-2">
                      {item.caption}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/70 font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <User className="w-3.5 h-3.5 text-[#E85F57] flex-shrink-0" />
                      <span className="font-medium text-[#F7F5F0] truncate">{item.uploaderName}</span>
                    </div>
                    {item.uploadedAt && (
                      <div className="flex items-center gap-1.5 text-white/50 shrink-0">
                        <Calendar className="w-3.5 h-3.5 text-[#E85F57]" />
                        <span>{item.uploadedAt}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal with Next / Prev Navigation */}
        {activeLightboxItem && activeLightboxIndex !== null && (
          <div 
            onClick={() => setActiveLightboxIndex(null)}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setActiveLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all z-20"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Prev Arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-[#232323]/80 hover:bg-[#E85F57] text-white p-3 md:p-4 rounded-full border border-white/20 transition-all z-20 shadow-2xl active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Next Arrow */}
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-[#232323]/80 hover:bg-[#E85F57] text-white p-3 md:p-4 rounded-full border border-white/20 transition-all z-20 shadow-2xl active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Modal Card */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full bg-[#232323] rounded-3xl overflow-hidden border border-[#353535] shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Photo Area */}
              <div className="md:w-3/5 bg-black flex items-center justify-center p-4 relative overflow-hidden">
                <img
                  src={activeLightboxItem.imageUrl}
                  alt={activeLightboxItem.title}
                  className="w-full h-full max-h-[70vh] object-contain rounded-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/aayam_assets/tamashbin_user_1.jpg";
                  }}
                />
              </div>

              {/* Sidebar Meta */}
              <div className="md:w-2/5 p-8 flex flex-col justify-between text-white bg-[#262422] border-t md:border-t-0 md:border-l border-white/10 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E85F57]/15 text-xs font-mono font-bold uppercase tracking-wider text-[#E85F57] border border-[#E85F57]/30">
                      <Tag className="w-3.5 h-3.5" />
                      <span>{activeLightboxItem.category}</span>
                    </div>
                    <span className="text-xs font-mono text-white/50">
                      {activeLightboxIndex + 1} / {filteredItems.length}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-[#F7F5F0] font-normal leading-tight">
                    {activeLightboxItem.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                    {activeLightboxItem.caption || "Official photography captured during live Aayam theatrical production season."}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3 text-xs font-mono text-white/70">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 uppercase tracking-wider">Archived By</span>
                    <span className="text-white font-medium">{activeLightboxItem.uploaderName}</span>
                  </div>
                  {activeLightboxItem.uploadedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/40 uppercase tracking-wider">Date</span>
                      <span className="text-white font-medium">{activeLightboxItem.uploadedAt}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 uppercase tracking-wider">Status</span>
                    <span className="inline-flex items-center gap-1 text-[#E85F57] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Archive
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
