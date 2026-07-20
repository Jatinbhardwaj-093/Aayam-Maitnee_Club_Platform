// @ts-nocheck
import { useState, useEffect } from "react";
import { Image as ImageIcon, Filter, Maximize2, X, Upload, Sparkles, Tag, Calendar, User, CheckCircle2 } from "lucide-react";

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

const CATEGORIES = ["All", "DDDJ", "KKY", "Samatvam", "Speak Up Tara", "Tamashbin Kathputliya"];

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>(fallbackGalleryData);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);
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

  return (
    <div className="min-h-screen bg-[#fdf9f4] text-[#1c1b19] font-sans pt-8 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#cac6b9]/40 pb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635f41]/10 border border-[#635f41]/20 text-[#635f41] text-xs font-bold uppercase tracking-wider mb-3">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Glimpses of Aayam</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-[#1c1b19]">
              Production Gallery
            </h1>
            <p className="text-[#49473d] text-base mt-2 max-w-xl font-light">
              Visual archives of stage plays, street nataks, masterclasses, and backstage moments from the official drama society of IIT Madras BS.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#cac6b9]/30 shadow-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all tracking-wider ${
                  selectedCategory === cat
                    ? "bg-[#635f41] text-white shadow-xs"
                    : "text-[#49473d] hover:bg-black/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-72 bg-white/60 animate-pulse rounded-2xl border border-[#cac6b9]/20"></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#cac6b9]/30 p-12">
            <ImageIcon className="w-12 h-12 text-[#635f41]/40 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#1c1b19]">No media photos found</h3>
            <p className="text-sm text-[#49473d] mt-2">Try selecting another category or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxItem(item)}
                className="group relative bg-white rounded-2xl overflow-hidden border border-[#cac6b9]/25 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300"></div>
                   
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#635f41] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs border border-[#cac6b9]/30">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-[#cac6b9]/15 flex items-center justify-between text-xs text-[#49473d]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#635f41]" />
                    <span className="font-medium">{item.uploaderName}</span>
                  </div>
                  {item.uploadedAt && (
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.uploadedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeLightboxItem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
            <button
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="max-w-4xl w-full bg-[#1c1b19] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
              <div className="md:w-3/5 bg-black flex items-center justify-center p-2 relative overflow-hidden">
                <img
                  src={activeLightboxItem.imageUrl}
                  alt={activeLightboxItem.title}
                  className="w-full h-full max-h-[70vh] object-contain rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop";
                  }}
                />
              </div>

              <div className="md:w-2/5 p-8 flex flex-col justify-between text-white bg-[#262422]">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#8CC0EB]">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{activeLightboxItem.category}</span>
                  </div>

                  <h2 className="font-serif text-3xl font-bold leading-tight">
                    {activeLightboxItem.title}
                  </h2>

                  <p className="text-sm text-gray-300 font-light leading-relaxed">
                    {activeLightboxItem.caption || "No additional description provided."}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3 text-xs text-gray-400">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 uppercase tracking-wider">Uploaded By</span>
                    <span className="text-white font-medium">{activeLightboxItem.uploaderName}</span>
                  </div>
                  {activeLightboxItem.uploadedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 uppercase tracking-wider">Date</span>
                      <span className="text-white font-medium">{activeLightboxItem.uploadedAt}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 uppercase tracking-wider">Status</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
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
