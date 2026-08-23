// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import {
    Cloud,
    Trash2,
    Check,
    X,
    Plus,
    Image as ImageIcon,
    Maximize2,
    Calendar,
    User,
    RefreshCw,
    Folder,
    Tag,
    CheckCircle2,
    Sparkles,
    Shield
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { fallbackGalleryData } from "./galleryFallbackData";

interface GalleryMediaItem {
    id: number;
    title: string;
    category: string;
    imageUrl: string;
    caption: string;
    uploadedAt: string;
    status: "approved" | "pending" | "rejected";
    uploaderName: string;
}

const PLAY_CATEGORIES = ["All", "DDDJ", "KKY", "Samatvam", "Speak Up Tara", "Tamashbin Kathputliya"];


const CustomDropdown = ({ value, options, onChange }: { value: string, options: string[], onChange: (v: string) => void }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] font-bold text-left flex justify-between items-center hover:bg-[#FAF2EE] transition-colors focus:outline-none focus:ring-2 focus:ring-[#B32D25]/30"
            >
                {value}
                <svg className={`w-4 h-4 text-[#8C5A54] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {open && (
                <div className="absolute top-full mt-1.5 left-0 w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl shadow-xl z-50 overflow-hidden">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#FAF2EE] transition-colors ${value === opt ? 'bg-[#EEDBD5] text-[#8C241E]' : 'text-[#5C3B37]'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default function MediaModeration() {
    const [items, setItems] = useState<GalleryMediaItem[]>(fallbackGalleryData);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryMediaItem | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state for adding new gallery media to DB
    const [newMedia, setNewMedia] = useState({
        title: "",
        category: "Tamashbin Kathputliya",
        caption: "",
        uploaderName: "Core Maintainer"
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const fetchGalleryItems = () => {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || "";
        fetch(`${baseUrl}/api/gallery?status=all`)
            .then((res) => {
                const cType = res.headers.get("content-type") || "";
                if (!res.ok || !cType.includes("application/json")) {
                    throw new Error("Invalid response format");
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
            .catch(() => setItems(fallbackGalleryData))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchGalleryItems();
    }, []);

    // Filter items based on selected play category
    const filteredItems = useMemo(() => {
        if (selectedCategory === "All") return items;
        return items.filter((item) => {
            const cat = (item.category || "").toLowerCase();
            const target = selectedCategory.toLowerCase();
            return cat.includes(target) || (target === "kky" && cat.includes("karn"));
        });
    }, [items, selectedCategory]);

    // Handle adding new media item to backend database
    const handleAddMediaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMedia.title?.trim()) {
            alert("Please enter a photo title.");
            return;
        }
        if (!selectedFile && !newMedia.imageUrl) {
            alert("Please select or drop an image file to upload.");
            return;
        }

        setSubmitting(true);
        const baseUrl = import.meta.env.VITE_API_URL || "";
        try {
            let res;
            if (selectedFile) {
                const fd = new FormData();
                fd.append("file", selectedFile);
                fd.append("title", newMedia.title.trim());
                fd.append("category", newMedia.category);
                fd.append("caption", newMedia.caption.trim());
                fd.append("uploaderName", newMedia.uploaderName || "Core Maintainer");
                fd.append("status", "approved");

                res = await fetch(`${baseUrl}/api/gallery`, {
                    method: "POST",
                    body: fd
                });
            } else {
                res = await fetch(`${baseUrl}/api/gallery`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newMedia)
                });
            }

            if (res && res.ok) {
                const added = await res.json();
                setItems((prev) => [added, ...prev]);
            } else {
                const mockNewItem: GalleryMediaItem = {
                    id: Date.now(),
                    title: newMedia.title,
                    category: newMedia.category,
                    imageUrl: newMedia.imageUrl || "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop",
                    caption: newMedia.caption,
                    uploaderName: newMedia.uploaderName || "Core Maintainer",
                    uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                    status: "approved"
                };
                setItems((prev) => [mockNewItem, ...prev]);
            }

            setIsAddModalOpen(false);
            setSelectedFile(null);
            setNewMedia({
                title: "",
                category: "Tamashbin Kathputliya",
                imageUrl: "",
                caption: "",
                uploaderName: "Core Maintainer"
            });
        } catch (err) {
            console.error("Failed to add media:", err);
            const mockNewItem: GalleryMediaItem = {
                id: Date.now(),
                title: newMedia.title,
                category: newMedia.category,
                imageUrl: newMedia.imageUrl || "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop",
                caption: newMedia.caption,
                uploaderName: newMedia.uploaderName || "Core Maintainer",
                uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                status: "approved"
            };
            setItems((prev) => [mockNewItem, ...prev]);
            setIsAddModalOpen(false);
            setSelectedFile(null);
            setNewMedia({
                title: "",
                category: "Tamashbin Kathputliya",
                imageUrl: "",
                caption: "",
                uploaderName: "Core Maintainer"
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Handle deletion
    const handleDeleteItem = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        const confirmDelete = window.confirm("Are you sure you want to delete this media image?");
        if (!confirmDelete) return;

        const baseUrl = import.meta.env.VITE_API_URL || "";
        try {
            const res = await fetch(`${baseUrl}/api/gallery/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setItems((prev) => prev.filter((item) => item.id !== id));
                if (activeLightboxItem?.id === id) {
                    setActiveLightboxItem(null);
                }
            }
        } catch (err) {
            console.error("Failed to delete media:", err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 pt-8 pb-24 px-4 md:px-8 font-sans text-[#2C2A28]">
            
            {/* Editorial Header */}
            <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8B4AE]/60">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] bg-[#E85F57]/15 px-3 py-1 rounded-full border border-[#E85F57]/30">
                        <Shield className="w-3.5 h-3.5 text-[#B32D25]" />
                        <span>MAINTAINER MEDIA MODERATION</span>
                    </div>
                    <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
                        Media & Gallery Moderation
                    </h1>
                    <p className="text-sm text-[#5C3B37] max-w-2xl font-light">
                        Curate production stagecraft photos, manage high-resolution assets, and approve public showcase media.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchGalleryItems}
                        className="px-5 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                        <RefreshCw className="w-4 h-4 text-[#8C241E]" />
                        <span>Refresh Assets</span>
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F]"
                    >
                        <Plus className="w-4 h-4 text-[#FFD0CC]" />
                        <span>Add Media</span>
                    </button>
                </div>
            </section>

            {/* Play Category Filter Bar - Theatrical Crimson Theme */}
            <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2rem] p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-5">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#2A1816] uppercase tracking-wider mr-1 flex items-center gap-1.5 shrink-0">
                        <Folder className="w-4 h-4 text-[#8C241E]" />
                        <span>Productions:</span>
                    </span>
                    {PLAY_CATEGORIES.map((cat) => {
                        const count = items.filter((i) => {
                            if (cat === "All") return true;
                            const itemCat = (i.category || "").toLowerCase();
                            const target = cat.toLowerCase();
                            return itemCat.includes(target) || (target === "kky" && itemCat.includes("karn"));
                        }).length;

                        const isActive = selectedCategory === cat;

                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all uppercase cursor-pointer flex items-center gap-1.5 ${
                                    isActive
                                        ? "bg-[#8C241E] text-[#FDF8F7] shadow-md shadow-[#8C241E]/20 border border-[#A6352F]"
                                        : "bg-[#FAF2EE] text-[#5C3B37] hover:bg-[#EEDBD5] hover:text-[#2A1816] border border-[#D5AAA2]"
                                }`}
                            >
                                <span>{cat}</span>
                                <span className={`text-[10px] ${isActive ? "text-[#FFD0CC]" : "text-[#8C5A54]"}`}>
                                    ({count})
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3 shrink-0 self-start xl:self-auto">
                    <span className="text-xs font-mono text-[#6E4742] bg-[#FAF2EE] px-4 py-2 rounded-full border border-[#D5AAA2] shadow-xs">
                        Showing <strong className="text-[#2A1816]">{filteredItems.length}</strong> photo assets
                    </span>
                </div>
            </section>

            {/* Media Grid View */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="h-64 bg-[#E8D6CF]/40 animate-pulse rounded-2xl border border-[#D5C9BE]"></div>
                    ))}
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-[#E7DDD3] rounded-3xl border border-dashed border-[#D5C9BE] p-8 space-y-3">
                    <ImageIcon className="w-12 h-12 text-[#8C5A54]/60 mx-auto" />
                    <h3 className="font-serif text-2xl font-bold text-[#2A1816]">No media photos in this production</h3>
                    <p className="text-xs text-[#6E4742] max-w-md mx-auto font-light">
                        Select another production category or click "Add Media" to upload stage photography.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveLightboxItem(item)}
                            className="group relative bg-[#FAF2EE] rounded-2xl overflow-hidden border border-[#DCBAB2] shadow-xs hover:border-[#B32D25]/60 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                        >
                            <div className="relative h-56 overflow-hidden bg-[#E2D4C8]">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop";
                                    }}
                                />

                                {/* Hover Dark Overlay */}
                                <div className="absolute inset-0 bg-[#2A1816]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <div className="bg-[#FAF2EE]/95 backdrop-blur-xs text-[#2A1816] px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md border border-[#D5AAA2]">
                                        <Maximize2 className="w-3.5 h-3.5 text-[#8C241E]" /> Full View
                                    </div>
                                </div>

                                {/* Category Tag */}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-[#FAF2EE]/95 backdrop-blur-md text-[#8C241E] text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs border border-[#D5AAA2]">
                                        {item.category}
                                    </span>
                                </div>

                                {/* Hover Delete Button Icon */}
                                <button
                                    onClick={(e) => handleDeleteItem(e, item.id)}
                                    className="absolute top-3 right-3 bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer border border-[#A6352F]"
                                    title="Delete from database"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Card Details */}
                            <div className="p-4 bg-[#FAF2EE] border-t border-[#D5C9BE]/50 flex flex-col justify-between space-y-2">
                                <div>
                                    <h3 className="font-serif font-bold text-base text-[#2A1816] group-hover:text-[#8C241E] transition-colors truncate">
                                        {item.title}
                                    </h3>
                                    {item.caption && (
                                        <p className="text-xs text-[#5C3B37] line-clamp-1 font-light mt-0.5">
                                            {item.caption}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-[10px] font-mono text-[#6E4742] pt-2 border-t border-[#D5C9BE]/40">
                                    <span className="truncate">By {item.uploaderName}</span>
                                    <span>{item.uploadedAt}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Full-Window Lightbox Preview Modal - Theatrical Crimson */}
            <Dialog open={!!activeLightboxItem} onOpenChange={(open) => !open && setActiveLightboxItem(null)}>
                <DialogContent showCloseButton={false} className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] max-w-4xl rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative">
                    
                    <button
                        type="button"
                        onClick={() => setActiveLightboxItem(null)}
                        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
                        title="Close preview"
                    >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    </button>

                    {activeLightboxItem && (
                        <div className="space-y-6">
                            <DialogHeader className="border-b border-[#D8B4AE]/70 pb-3 pr-10">
                                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] mb-1">
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>STAGE PHOTOGRAPHY PREVIEW</span>
                                </div>
                                <DialogTitle className="font-serif text-2xl font-bold text-[#2A1816]">
                                    {activeLightboxItem.title}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#5C3B37] font-mono">
                                    Production: {activeLightboxItem.category} • Uploaded by {activeLightboxItem.uploaderName} on {activeLightboxItem.uploadedAt}
                                </DialogDescription>
                            </DialogHeader>

                            {/* Full Image Container */}
                            <div className="rounded-2xl overflow-hidden bg-[#2A1816] flex items-center justify-center max-h-[60vh] border border-[#D5AAA2]">
                                <img
                                    src={activeLightboxItem.imageUrl}
                                    alt={activeLightboxItem.title}
                                    className="max-h-[60vh] w-auto object-contain"
                                />
                            </div>

                            {/* Metadata & Caption */}
                            {activeLightboxItem.caption && (
                                <p className="text-xs text-[#5C3B37] font-serif italic bg-[#E8D6CF]/70 p-4 rounded-xl border border-[#D5AAA2]">
                                    "{activeLightboxItem.caption}"
                                </p>
                            )}

                            <DialogFooter className="pt-3 border-t border-[#D8B4AE]/70 flex items-center justify-between">
                                <span className="text-xs font-mono font-bold text-[#8C241E] bg-[#EEDBD5] px-3 py-1 rounded-full border border-[#D5AAA2]">
                                    {activeLightboxItem.category}
                                </span>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setActiveLightboxItem(null)}
                                        className="border-[#D5AAA2] text-[#5C3B37] hover:bg-[#EEDBD5] rounded-full text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        onClick={(e) => handleDeleteItem(e, activeLightboxItem.id)}
                                        className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] rounded-full text-xs font-mono font-bold uppercase tracking-wider cursor-pointer border border-[#A6352F] shadow-sm"
                                    >
                                        Delete Asset
                                    </Button>
                                </div>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Media Modal - Theatrical Crimson */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent showCloseButton={false} className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] sm:max-w-md max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
                    
                    <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group"
                        title="Close dialog"
                    >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    </button>

                    <DialogHeader className="border-b border-[#D8B4AE]/70 pb-3 pr-10">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] mb-1">
                            <Plus className="w-3.5 h-3.5" />
                            <span>GALLERY REGISTRATION</span>
                        </div>
                        <DialogTitle className="font-serif text-2xl text-[#2A1816] font-bold">
                            Add Production Media
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#5C3B37]">
                            Register photo URL and metadata for the public and member gallery.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddMediaSubmit} className="py-4 space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                                Photo Title *
                            </label>
                            <Input
                                type="text"
                                required
                                placeholder="e.g. Climax Monologue Stage Lighting"
                                value={newMedia.title}
                                onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                                className="border-[#DCBAB2] bg-[#FAF2EE] h-10 text-xs rounded-xl font-semibold text-[#2A1816] focus:border-[#B32D25] shadow-sm hover:bg-[#FAF2EE] transition-colors"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                                Production Play *
                            </label>
                            <CustomDropdown 
                                value={newMedia.category} 
                                options={PLAY_CATEGORIES.filter((c) => c !== "All")} 
                                onChange={(val) => setNewMedia({ ...newMedia, category: val })} 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                                Upload Photo *
                            </label>
                            <div 
                                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${dragActive ? 'border-[#B32D25] bg-[#B32D25]/10' : 'border-[#D5AAA2] bg-[#E8D6CF]/40 hover:bg-[#E8D6CF]/70'}`}
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
                                                setNewMedia((prev) => ({ ...prev, imageUrl: event.target!.result as string }));
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                onClick={() => document.getElementById('gallery-file-upload')?.click()}
                            >
                                <input 
                                    id="gallery-file-upload" 
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
                                                    setNewMedia((prev) => ({ ...prev, imageUrl: event.target!.result as string }));
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }} 
                                />
                                {selectedFile || newMedia.imageUrl ? (
                                    <div className="flex flex-col items-center gap-2">
                                        {newMedia.imageUrl ? (
                                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#D5AAA2] shadow-sm">
                                                <img src={newMedia.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-[#B32D25]/20 flex items-center justify-center">
                                                <CheckCircle2 className="w-6 h-6 text-[#B32D25]" />
                                            </div>
                                        )}
                                        <span className="text-xs font-bold text-[#2A1816]">{selectedFile?.name || "Photo Ready"}</span>
                                        <span className="text-[10px] text-[#5C3B37]">Click to change photo</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-[#D5AAA2]/40 flex items-center justify-center">
                                            <Cloud className="w-6 h-6 text-[#8C5A54]" />
                                        </div>
                                        <span className="text-xs font-bold text-[#2A1816]">Drag & drop an image here</span>
                                        <span className="text-[10px] text-[#5C3B37]">or click to browse files (PNG, JPG, WEBP)</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                                Scene Caption
                            </label>
                            <Input
                                type="text"
                                placeholder="e.g. Backstage dress run before opening night"
                                value={newMedia.caption}
                                onChange={(e) => setNewMedia({ ...newMedia, caption: e.target.value })}
                                className="border-[#DCBAB2] bg-[#FAF2EE] h-10 text-xs rounded-xl font-semibold text-[#2A1816] focus:border-[#B32D25] shadow-sm hover:bg-[#FAF2EE] transition-colors"
                            />
                        </div>

                        <DialogFooter className="pt-5 border-t border-[#D8B4AE]/70 flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="border border-[#DCBAB2] text-[#6E4742] bg-[#FAF2EE] hover:bg-[#FAF2EE] hover:text-[#2A1816] rounded-full text-xs font-mono font-bold uppercase tracking-wider flex-1 py-3 transition-colors cursor-pointer text-center"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] rounded-full text-xs font-mono font-bold uppercase tracking-widest flex-1 py-3 transition-colors cursor-pointer border border-[#A6352F] shadow-lg shadow-[#8C241E]/20 text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Cloud className="w-3.5 h-3.5" />
                                        <span>Upload Photo</span>
                                    </>
                                )}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
