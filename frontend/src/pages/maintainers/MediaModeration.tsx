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
    CheckCircle2
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
        imageUrl: "",
        caption: "",
        uploaderName: "Core Maintainer"
    });

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
                    setItems(fallbackMediaItems);
                }
            })
            .catch(() => setItems(fallbackMediaItems))
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
        if (!newMedia.imageUrl || !newMedia.title) return;

        setSubmitting(true);
        const baseUrl = import.meta.env.VITE_API_URL || "";
        try {
            const res = await fetch(`${baseUrl}/api/gallery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newMedia.title,
                    category: newMedia.category,
                    imageUrl: newMedia.imageUrl,
                    caption: newMedia.caption,
                    uploaderName: newMedia.uploaderName,
                    status: "approved"
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.item) {
                    setItems((prev) => [data.item, ...prev]);
                } else {
                    fetchGalleryItems();
                }
                setIsAddModalOpen(false);
                setNewMedia({
                    title: "",
                    category: "Tamashbin Kathputliya",
                    imageUrl: "",
                    caption: "",
                    uploaderName: "Core Maintainer"
                });
            }
        } catch (err) {
            console.error("Failed to add media:", err);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle item deletion from database
    const handleDeleteItem = async (e: React.MouseEvent, id: number) => {
        e.stopPropagation(); // prevent lightbox trigger
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
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#fdf9f4] min-h-screen text-[#1c1b19]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#cac6b9]/40 pb-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#635f41]/10 text-[#635f41] text-xs font-bold uppercase tracking-wider mb-2">
                        <Cloud className="w-3.5 h-3.5" />
                        <span>Maintainer Media Management</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1c1b19]">
                        Media Moderation & Gallery Database
                    </h1>
                    <p className="text-sm text-[#49473d] mt-1 font-light">
                        Select play folders to manage photos, open full window previews, or delete media from the database.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        onClick={fetchGalleryItems}
                        variant="outline"
                        className="border-[#cac6b9] text-[#49473d] hover:bg-[#635f41]/10 flex items-center gap-2 rounded-xl text-xs font-bold"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Refresh</span>
                    </Button>

                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#635f41] hover:bg-[#524e35] text-white flex items-center gap-2 shadow-xs rounded-xl text-xs font-bold"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Media to Database</span>
                    </Button>
                </div>
            </div>

            {/* Play Category Filter Bar matching Website Screenshot */}
            <div className="bg-white p-4 rounded-2xl border border-[#cac6b9]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                    <span className="text-xs font-bold text-[#635f41] uppercase tracking-wider mr-2 flex items-center gap-1.5 flex-shrink-0">
                        <Folder className="w-4 h-4 text-[#635f41]" />
                        <span>Play Folders:</span>
                    </span>
                    {PLAY_CATEGORIES.map((cat) => {
                        const count = items.filter((i) => {
                            if (cat === "All") return true;
                            const itemCat = (i.category || "").toLowerCase();
                            const target = cat.toLowerCase();
                            return itemCat.includes(target) || (target === "kky" && itemCat.includes("karn"));
                        }).length;

                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all uppercase flex-shrink-0 ${
                                    selectedCategory === cat
                                        ? "bg-[#635f41] text-white shadow-xs"
                                        : "bg-[#fdf9f4] text-[#49473d] hover:bg-[#635f41]/10 border border-[#cac6b9]/30"
                                }`}
                            >
                                {cat} <span className="opacity-70 ml-1">({count})</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Media Grid View */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <div key={n} className="h-60 bg-white/60 animate-pulse rounded-2xl border border-[#cac6b9]/20"></div>
                    ))}
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-[#cac6b9]/30 p-8">
                    <ImageIcon className="w-12 h-12 text-[#635f41]/40 mx-auto mb-3" />
                    <h3 className="font-serif text-xl font-bold text-[#1c1b19]">No media photos in this folder</h3>
                    <p className="text-xs text-[#49473d] mt-1">Select another play folder or click "Add Media to Database" above.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setActiveLightboxItem(item)}
                            className="group relative bg-white rounded-2xl overflow-hidden border border-[#cac6b9]/30 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                        >
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop";
                                    }}
                                />

                                {/* Hover Dark Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <div className="bg-white/90 text-[#1c1b19] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
                                        <Maximize2 className="w-3.5 h-3.5" /> Full View
                                    </div>
                                </div>

                                {/* Category Tag */}
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/95 backdrop-blur-md text-[#635f41] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs border border-[#cac6b9]/20">
                                        {item.category}
                                    </span>
                                </div>

                                {/* Hover Delete Button Icon */}
                                <button
                                    onClick={(e) => handleDeleteItem(e, item.id)}
                                    className="absolute top-3 right-3 bg-rose-600 hover:bg-rose-700 text-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                    title="Delete from database"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Card Details */}
                            <div className="p-4 bg-white border-t border-[#cac6b9]/15 flex flex-col justify-between space-y-2">
                                <div>
                                    <h3 className="font-serif font-bold text-sm text-[#1c1b19] group-hover:text-[#635f41] transition-colors truncate">
                                        {item.title}
                                    </h3>
                                    {item.caption && (
                                        <p className="text-[11px] text-[#49473d] line-clamp-1 font-light mt-0.5">
                                            {item.caption}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-[#cac6b9]/15">
                                    <span className="truncate">By {item.uploaderName}</span>
                                    <span>{item.uploadedAt}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Full-Window Lightbox Preview Modal */}
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
                                className="w-full h-full max-h-[75vh] object-contain rounded-xl"
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

                                <h2 className="font-serif text-2xl font-bold leading-tight">
                                    {activeLightboxItem.title}
                                </h2>

                                <p className="text-sm text-gray-300 font-light leading-relaxed">
                                    {activeLightboxItem.caption || "No additional description provided."}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="space-y-2 text-xs text-gray-400">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 uppercase tracking-wider">Uploader</span>
                                        <span className="text-white font-medium">{activeLightboxItem.uploaderName}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-500 uppercase tracking-wider">Date</span>
                                        <span className="text-white font-medium">{activeLightboxItem.uploadedAt}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={(e) => handleDeleteItem(e, activeLightboxItem.id)}
                                    className="w-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl text-xs"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Photo from Database</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Media Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="sm:max-w-lg bg-[#fdf9f4] border-[#cac6b9]">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-2xl text-[#1c1b19] flex items-center gap-2">
                            <Plus className="w-5 h-5 text-[#635f41]" />
                            <span>Add New Media to Database</span>
                        </DialogTitle>
                        <DialogDescription className="text-xs text-[#49473d]">
                            Upload photo into specific play folder in Aayam database.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleAddMediaSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#635f41] uppercase tracking-wider">Photo Title</label>
                            <Input
                                required
                                placeholder="e.g. Tamashbin Kathputliya Stage Performance"
                                value={newMedia.title}
                                onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
                                className="bg-white border-[#cac6b9]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#635f41] uppercase tracking-wider">Play Folder Category</label>
                            <select
                                value={newMedia.category}
                                onChange={(e) => setNewMedia({ ...newMedia, category: e.target.value })}
                                className="w-full h-10 px-3 rounded-md bg-white border border-[#cac6b9] text-sm focus:outline-none focus:ring-2 focus:ring-[#635f41]"
                            >
                                {["Tamashbin Kathputliya", "DDDJ", "KKY", "Samatvam", "Speak Up Tara"].map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#635f41] uppercase tracking-wider">Image URL or Path</label>
                            <Input
                                required
                                placeholder="/aayam_assets/tamashbin_kathputliya_1.jpg or https://..."
                                value={newMedia.imageUrl}
                                onChange={(e) => setNewMedia({ ...newMedia, imageUrl: e.target.value })}
                                className="bg-white border-[#cac6b9]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#635f41] uppercase tracking-wider">Caption / Description</label>
                            <textarea
                                rows={3}
                                placeholder="Description of scene or performance photo..."
                                value={newMedia.caption}
                                onChange={(e) => setNewMedia({ ...newMedia, caption: e.target.value })}
                                className="w-full p-3 rounded-md bg-white border border-[#cac6b9] text-sm focus:outline-none focus:ring-2 focus:ring-[#635f41]"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#635f41] uppercase tracking-wider">Uploader Name</label>
                            <Input
                                placeholder="Maintainer Name"
                                value={newMedia.uploaderName}
                                onChange={(e) => setNewMedia({ ...newMedia, uploaderName: e.target.value })}
                                className="bg-white border-[#cac6b9]"
                            />
                        </div>

                        <DialogFooter className="pt-4 border-t border-[#cac6b9]/30">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddModalOpen(false)}
                                className="border-[#cac6b9]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#635f41] hover:bg-[#524e35] text-white"
                            >
                                {submitting ? "Saving to DB..." : "Add to Database"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
