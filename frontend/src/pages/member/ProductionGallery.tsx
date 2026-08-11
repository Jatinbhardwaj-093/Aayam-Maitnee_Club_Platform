import { useState } from "react";
import { Heart, Upload, Filter, Download, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const presetImages = [
  { label: "Banquet Scene", url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" },
  { label: "Stage Spotlight", url: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80" },
  { label: "Cauldron Fog Test", url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80" },
  { label: "Sword Staging", url: "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80" },
  { label: "Dressing Room Setup", url: "https://images.unsplash.com/photo-1503095391758-11200cf53674?auto=format&fit=crop&w=800&q=80" },
];

export default function ProductionGallery() {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [categoryFilter, setCategoryFilter] = useState<"All" | "Rehearsals" | "Live Show" | "Backstage">("All");
  
  // Upload dialog state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"Rehearsals" | "Live Show" | "Backstage">("Rehearsals");
  const [photographer, setPhotographer] = useState("Jayesh Dave");
  const [imageUrl, setImageUrl] = useState(presetImages[0].url);
  const sanitizeImageUrl = (value: string) => {
    try {
      const parsedUrl = new URL(value, window.location.origin);
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:" ? parsedUrl.toString() : presetImages[0].url;
    } catch {
      return presetImages[0].url;
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
    // Open image or simulate download
    const link = document.createElement("a");
    link.href = sanitizeImageUrl(url);
    link.target = "_blank";
    link.download = `${filename.toLowerCase().replace(/ /g, "_")}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newItem: MediaItem = {
      id: `m${media.length + 1}`,
      title,
      category,
      imageUrl: imageUrl || presetImages[0].url,
      likes: 0,
      liked: false,
      photographer: photographer || "Aayam Member",
    };

    setMedia([newItem, ...media]);
    setTitle("");
    setUploadOpen(false);
  };

  const filteredMedia = categoryFilter === "All"
    ? media
    : media.filter(item => item.category === categoryFilter);

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Gallery Title Block */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] mb-[32px] md:mb-[48px]">
        <div className="space-y-[8px]">
          <span className="text-xs uppercase tracking-widest text-[#466272]/70 font-semibold">Media Center</span>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Gallery</h2>
          <p className="text-[14px] text-[#466272]">
            Visual archive of live stage snapshots, backstage wardrobe fittings, and active scene rehearsals.
          </p>
        </div>
        
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogTrigger render={<Button className="bg-[#8CC0EB] hover:bg-[#8CC0EB]/90 text-[#1c1b19] font-semibold rounded-[8px] py-[10px] px-[20px] gap-2 shadow-sm transition-all active:scale-95" />}>
            <Upload className="w-4 h-4" /> Upload Stage Photo
          </DialogTrigger>
          <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272] max-w-md">
            <form onSubmit={handleUploadSubmit}>
              <DialogHeader>
                <DialogTitle className="font-serif text-[#635f41] text-lg font-bold flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#8CC0EB]" /> Upload Stage Photo
                </DialogTitle>
                <DialogDescription className="text-xs text-[#466272]/85">
                  Share behind-the-scenes memories or workspace progress with the club.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Photo Title</label>
                  <Input 
                    placeholder="e.g., Apparition Makeup Fitting" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-xs h-9 bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41] block mb-1">Category / Area</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-[#e6e2dd] rounded-[8px] bg-white text-xs p-2 h-9 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8CC0EB]"
                  >
                    <option value="Rehearsals">Rehearsals</option>
                    <option value="Live Show">Live Show</option>
                    <option value="Backstage">Backstage</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Photographer / Contributor</label>
                  <Input 
                    value={photographer}
                    onChange={(e) => setPhotographer(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB] text-xs h-9 bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41] block mb-1">Select Stage Memory Template</label>
                  <select 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full border border-[#e6e2dd] rounded-[8px] bg-white text-xs p-2 h-9 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8CC0EB]"
                  >
                    {presetImages.map((img, i) => (
                      <option key={i} value={img.url}>{img.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setUploadOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px] text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px] font-semibold text-xs">
                  Upload Photo
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Filtering */}
      <div className="flex flex-wrap gap-[12px] items-center border-b border-[#e6e2dd]/80 pb-4 mb-[24px]">
        <Filter className="w-4 h-4 text-[#635f41]" />
        {(["All", "Rehearsals", "Live Show", "Backstage"] as const).map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-[8px] font-semibold text-xs py-1.5 px-4 transition-all ${
              categoryFilter === cat
                ? "bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90"
                : "border-2 border-[#e6e2dd] text-[#466272] hover:bg-[#f7f3ee]"
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px]">
        {filteredMedia.map((item) => (
          <div key={item.id} className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-[#8CC0EB]/40 group">
            {/* Image Wrapper */}
            <div className="relative aspect-video overflow-hidden bg-gray-100">
              <img
                src={sanitizeImageUrl(item.imageUrl)}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <Badge className="absolute top-3 left-3 bg-[#fdf9f4] border border-[#e6e2dd] text-[#635f41] hover:bg-[#fdf9f4]/90 rounded-[4px]">
                {item.category}
              </Badge>
            </div>

            {/* Info Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-[16px] text-[#635f41] font-serif group-hover:text-[#8CC0EB] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#466272]/70">Photo by {item.photographer}</p>
              </div>

              <div className="flex justify-between items-center border-t border-[#e6e2dd]/60 pt-3">
                <span className="text-xs text-[#466272]/70 font-semibold">{item.likes} Likes</span>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLike(item.id)}
                    className={`h-8 px-2.5 rounded-[4px] gap-1.5 transition-colors ${
                      item.liked ? "text-red-500 hover:text-red-600 bg-red-50" : "text-[#466272]/70 hover:text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${item.liked ? "fill-current" : ""}`} />
                    <span className="text-xs font-semibold">{item.liked ? "Liked" : "Like"}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDownload(item.imageUrl, item.title)}
                    className="h-8 px-2.5 rounded-[4px] gap-1.5 text-[#466272]/70 hover:text-[#8CC0EB] hover:bg-[#8CC0EB]/10 transition-colors"
                    title="Download high-resolution image"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-xs font-semibold">Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
