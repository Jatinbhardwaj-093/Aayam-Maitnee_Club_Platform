import { useState, useEffect } from "react";
import { Heart, Upload, Filter, Download, Image as ImageIcon, Cloud, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CustomSelect } from "@/components/CustomSelect";

interface MediaItem {
  id: string;
  title: string;
  category: "Rehearsals" | "Live Show" | "Backstage";
  imageUrl: string;
  likes: number;
  liked: boolean;
  photographer: string;
}

const initialMedia: MediaItem[] = [
  {
    id: "m1",
    title: "Macbeth Banquet Scene Rehearsal",
    category: "Rehearsals",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    likes: 24,
    liked: false,
    photographer: "Siddharth Verma",
  },
  {
    id: "m2",
    title: "Witches Prop Cauldron Steam Test",
    category: "Backstage",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    likes: 42,
    liked: true,
    photographer: "Esha Vyas",
  },
  {
    id: "m3",
    title: "Macbeth & Banquo Sword Blocking",
    category: "Rehearsals",
    imageUrl: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80",
    likes: 18,
    liked: false,
    photographer: "Siddharth Verma",
  },
];

export default function ProductionGallery() {
  const [media, setMedia] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem("aayam_member_gallery");
      return saved ? JSON.parse(saved) : initialMedia;
    } catch {
      return initialMedia;
    }
  });

  const [categoryFilter, setCategoryFilter] = useState<"All" | "Rehearsals" | "Live Show" | "Backstage">("All");
  
  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Rehearsals" | "Live Show" | "Backstage">("Rehearsals");
  const [photographer, setPhotographer] = useState("Aayam Member");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("aayam_member_gallery", JSON.stringify(media));
    } catch (e) {
      console.error(e);
    }
  }, [media]);

  const sanitizeImageUrl = (value: string) => {
    if (!value) return initialMedia[0].imageUrl;
    if (value.startsWith("data:image/") || value.startsWith("blob:") || value.startsWith("/")) return value;
    try {
      const parsedUrl = new URL(value, window.location.origin);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" ? parsedUrl.toString() : initialMedia[0].imageUrl;
    } catch {
      return initialMedia[0].imageUrl;
    }
  };

  const handleLike = (id: string) => {
    setMedia(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: item.liked ? item.likes - 1 : item.likes + 1,
          liked: !item.liked,
        };
      }
      return item;
    }));
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = sanitizeImageUrl(url);
    link.target = "_blank";
    link.download = `${filename.toLowerCase().replace(/ /g, "_")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a photo title.");
      return;
    }

    if (!selectedFile && !imageUrl) {
      alert("Please select or drop an image file to upload.");
      return;
    }

    setIsSubmitting(true);
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

    try {
      let finalUrl = imageUrl;

      if (selectedFile) {
        const fd = new FormData();
        fd.append("file", selectedFile);
        fd.append("title", title.trim());
        fd.append("category", category);
        fd.append("uploaderName", photographer || "Aayam Member");
        fd.append("status", "approved");

        const res = await fetch(`${baseUrl}/api/gallery`, {
          method: "POST",
          body: fd
        });

        if (res.ok) {
          const data = await res.json();
          if (data.imageUrl || data.image_url) {
            finalUrl = data.imageUrl || data.image_url;
          }
        }
      }

      const newItem: MediaItem = {
        id: `m${Date.now()}`,
        title: title.trim(),
        category,
        imageUrl: finalUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        likes: 0,
        liked: false,
        photographer: photographer.trim() || "Aayam Member",
      };

      setMedia([newItem, ...media]);
      setTitle("");
      setImageUrl("");
      setSelectedFile(null);
      setUploadOpen(false);
    } catch (err) {
      console.error("Gallery upload error:", err);
      const newItem: MediaItem = {
        id: `m${Date.now()}`,
        title: title.trim(),
        category,
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        likes: 0,
        liked: false,
        photographer: photographer.trim() || "Aayam Member",
      };

      setMedia([newItem, ...media]);
      setTitle("");
      setImageUrl("");
      setSelectedFile(null);
      setUploadOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMedia = categoryFilter === "All"
    ? media
    : media.filter(item => item.category === categoryFilter);

  return (
    <div className="space-y-8 font-sans text-[#5C3B37]">
      {/* Gallery Title Block */}
      <div className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2rem] p-7 md:p-9 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-[#8C5A54] font-bold">Media Center</span>
          <h2 className="text-3xl sm:text-4xl font-normal font-serif text-[#2A1816] tracking-tight">Production Gallery</h2>
          <p className="text-xs sm:text-sm text-[#6E4742] font-light max-w-xl leading-relaxed">
            Visual archive of live stage snapshots, backstage wardrobe fittings, and active scene rehearsals.
          </p>
        </div>
        
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger render={<button className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-xs font-bold uppercase tracking-wider rounded-full py-3 px-6 gap-2 shadow-md transition-all active:scale-95 flex items-center cursor-pointer border border-[#A6352F]" />}>
            <Upload className="w-4 h-4 text-[#FFD0CC]" />
            <span>Upload Stage Photo</span>
          </DialogTrigger>

          <DialogContent className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] max-w-lg rounded-[2.5rem] p-8 shadow-2xl">
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <DialogHeader className="space-y-1 text-left pb-3 border-b border-[#DCBAB2]">
                <DialogTitle className="font-serif text-[#2A1816] text-2xl font-normal flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#8C241E]" /> 
                  <span>Upload Stage Photo</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-[#6E4742]">
                  Share behind-the-scenes memories or workspace progress with the club.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3.5 text-left pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-[#8C5A54]">Photo Title *</label>
                  <Input 
                    placeholder="e.g. Apparition Makeup & Costume Fitting" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-[#DCBAB2] focus-visible:ring-[#8C241E] text-xs h-10 bg-[#FAF2EE] rounded-xl text-[#2A1816]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-[#8C5A54] block">Category / Area</label>
                  <CustomSelect
                    value={category}
                    onChange={(val) => setCategory(val as any)}
                    options={[
                      { value: "Rehearsals", label: "Rehearsals & Blocking" },
                      { value: "Live Show", label: "Live Stage Performance" },
                      { value: "Backstage", label: "Backstage & Wardrobe" }
                    ]}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-[#8C5A54]">Photographer / Contributor</label>
                  <Input 
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                    placeholder="e.g. Jayesh Dave"
                    className="border-[#DCBAB2] focus-visible:ring-[#8C241E] text-xs h-10 bg-[#FAF2EE] rounded-xl text-[#2A1816]"
                    required
                  />
                </div>

                {/* Dropzone for Photo File */}
                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold uppercase text-[#8C5A54] block">
                    Select Image File *
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                      dragActive ? 'border-[#8C241E] bg-[#8C241E]/10' : 'border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5]/60'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        setSelectedFile(file);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setImageUrl(event.target!.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    onClick={() => document.getElementById('member-gallery-upload')?.click()}
                  >
                    <input 
                      id="member-gallery-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setSelectedFile(file);
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setImageUrl(event.target!.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                    />
                    {selectedFile || imageUrl ? (
                      <div className="flex flex-col items-center gap-2">
                        {imageUrl ? (
                          <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#D5AAA2] shadow-sm">
                            <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-[#2A1816]">{selectedFile?.name || "Photo Loaded"}</span>
                        <span className="text-[10px] text-[#8C5A54] font-mono">Click to choose another photo</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-[#EEDBD5] flex items-center justify-center border border-[#D5AAA2]">
                          <Cloud className="w-6 h-6 text-[#8C241E]" />
                        </div>
                        <span className="text-xs font-bold text-[#2A1816]">Drag & drop stage photo here</span>
                        <span className="text-[10px] text-[#6E4742] font-mono">or click to browse local files (PNG, JPG, WEBP)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2 pt-4 border-t border-[#DCBAB2] flex items-center justify-end">
                <button 
                  type="button" 
                  onClick={() => setUploadOpen(false)} 
                  className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-md flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F] disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Uploading..." : "Upload Photo"}</span>
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Filtering */}
      <div className="flex flex-wrap gap-2.5 items-center border-b border-[#DCBAB2] pb-4">
        <Filter className="w-4 h-4 text-[#8C5A54] mr-1" />
        {(["All", "Rehearsals", "Live Show", "Backstage"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full font-mono font-bold text-xs py-2 px-4.5 uppercase tracking-wider transition-all cursor-pointer border ${
              categoryFilter === cat
                ? "bg-[#8C241E] text-[#FDF8F7] border-[#A6352F] shadow-sm"
                : "bg-[#FAF2EE] border-[#D5AAA2] text-[#5C3B37] hover:bg-[#EEDBD5] hover:text-[#2A1816]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedia.map((item) => (
          <div key={item.id} className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-[#8C241E]/40 group shadow-xs">
            {/* Image Wrapper */}
            <div className="relative aspect-video overflow-hidden bg-[#E2D4C8]">
              <img
                src={sanitizeImageUrl(item.imageUrl)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = initialMedia[0].imageUrl;
                }}
              />
              <span className="absolute top-3 left-3 bg-[#FAF2EE]/95 backdrop-blur-xs border border-[#DCBAB2] text-[#2A1816] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
                {item.category}
              </span>
            </div>

            {/* Content Details */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-[#2A1816] tracking-tight line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6E4742] font-mono">
                  Captured by <strong className="text-[#2A1816]">{item.photographer}</strong>
                </p>
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-[#DCBAB2]/60 text-xs">
                <button
                  type="button"
                  onClick={() => handleLike(item.id)}
                  className={`flex items-center gap-1.5 font-mono font-bold transition-colors cursor-pointer ${
                    item.liked ? "text-[#8C241E]" : "text-[#6E4742] hover:text-[#8C241E]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${item.liked ? "fill-[#8C241E]" : ""}`} />
                  <span>{item.likes}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(item.imageUrl, item.title)}
                  className="flex items-center gap-1.5 font-mono text-[11px] uppercase font-bold text-[#5C3B37] hover:text-[#2A1816] transition-colors cursor-pointer bg-[#F2E5E0] hover:bg-[#EEDBD5] px-3 py-1.5 rounded-full border border-[#DCBAB2]"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
