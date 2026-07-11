import React, { useState, useMemo } from "react";
import {
    Cloud,
    CheckCircle,
    AlertTriangle,
    Trash2,
    Hourglass,
    Check,
    X,
    HardDrive
} from "lucide-react";

interface MediaItem {
    id: string;
    filename: string;
    size: string;
    subject: string;
    imageUrl: string;
    status: "Pending" | "Approved" | "Quarantined";
}

const MOCK_IMAGE_TEMPLATES = [
    {
        subject: "A B&W photograph of an actor in dramatic makeup rehearsing under a single stark spotlight.",
        url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=400&q=80"
    },
    {
        subject: "A sunlit, wide-angle shot of an airy, minimalist art gallery during a matinee event.",
        url: "https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?auto=format&fit=crop&w=400&q=80"
    },
    {
        subject: "A detailed close-up of an ornate vintage stage prop mirror on a dusty table.",
        url: "https://images.unsplash.com/photo-1583795128727-6ec3642408f8?auto=format&fit=crop&w=400&q=80"
    },
    {
        subject: "A vibrant, backstage snapshot of dancers warming up in soft blue ambient light.",
        url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80"
    },
    {
        subject: "A serene, highly composed photograph of an empty auditorium with deep red seats.",
        url: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=400&q=80"
    }
];

// Initialize 24 mock items
const INITIAL_ITEMS: MediaItem[] = Array.from({ length: 24 }).map((_, idx) => {
    const template = MOCK_IMAGE_TEMPLATES[idx % MOCK_IMAGE_TEMPLATES.length];
    return {
        id: `img-${idx + 1}`,
        filename: `IMG_${1042 + idx}.raw`,
        size: `${(1.2 + (idx * 0.37) % 8.3).toFixed(1)}MB`,
        subject: template.subject,
        imageUrl: template.url,
        status: "Pending"
    };
});

interface ToastMessage {
    id: string;
    text: string;
    type: "success" | "warning" | "error";
}

export default function MediaModeration() {
    const [items, setItems] = useState<MediaItem[]>(INITIAL_ITEMS);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Quarantined" | "All">("Pending");

    // Filter items based on active tab
    const filteredItems = useMemo(() => {
        if (activeTab === "All") return items;
        return items.filter(item => item.status === activeTab);
    }, [items, activeTab]);

    // Derived storage stats
    const storageStats = useMemo(() => {
        const approvedCount = items.filter(i => i.status === "Approved").length;
        const totalPendingCount = items.filter(i => i.status === "Pending").length;
        const totalQuarantined = items.filter(i => i.status === "Quarantined").length;

        // Simulating memory calculation based on sizes
        const parseSize = (sizeStr: string) => parseFloat(sizeStr.replace("MB", ""));
        const totalSize = items.reduce((acc, item) => acc + parseSize(item.size), 0);

        // Storage limit constants
        const baseUsedGB = 15.2;
        const itemsUsedGB = totalSize / 1024; // MB to GB
        const currentUsed = Math.min(20, baseUsedGB + itemsUsedGB);
        const percent = Math.round((currentUsed / 20) * 100);

        return {
            usedGB: currentUsed.toFixed(1),
            percent,
            approvedCount,
            totalPendingCount,
            totalQuarantined
        };
    }, [items]);

    // Handle Toast triggers
    const triggerToast = (text: string, type: "success" | "warning" | "error" = "success") => {
        const newToast = { id: Math.random().toString(), text, type };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 4000);
    };

    // Toggle single card selection
    const toggleSelect = (id: string, e?: React.MouseEvent) => {
        // Prevent click events inside interactive buttons from triggering toggles
        if (e && (e.target as HTMLElement).tagName === "INPUT") return;

        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Select/Unselect All
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const visibleIds = filteredItems.map(item => item.id);
            setSelectedIds(new Set(visibleIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    // Moderation action triggers
    const applyModerationAction = (action: "Approve" | "Quarantine" | "Delete") => {
        if (selectedIds.size === 0) return;

        const count = selectedIds.size;

        setItems(prevItems => {
            if (action === "Delete") {
                // Delete removes them from list
                return prevItems.filter(item => !selectedIds.has(item.id));
            } else if (action === "Approve") {
                // Approve transitions status
                return prevItems.map(item =>
                    selectedIds.has(item.id) ? { ...item, status: "Approved" } : item
                );
            } else {
                // Quarantine transitions status
                return prevItems.map(item =>
                    selectedIds.has(item.id) ? { ...item, status: "Quarantined" } : item
                );
            }
        });

        // Clear Selection
        setSelectedIds(new Set());

        // Toast feedback
        let toastText = "";
        let toastType: "success" | "warning" | "error" = "success";
        if (action === "Approve") {
            toastText = `Approved ${count} media items to the production gallery.`;
        } else if (action === "Quarantine") {
            toastText = `Quarantined ${count} items. Moved to quarantine container.`;
            toastType = "warning";
        } else {
            toastText = `Permanently deleted ${count} media assets from storage.`;
            toastType = "error";
        }
        triggerToast(toastText, toastType);
    };

    // Determine selectAll checkbox state
    const isAllSelected = filteredItems.length > 0 && filteredItems.every(item => selectedIds.has(item.id));
    const isSomeSelected = filteredItems.some(item => selectedIds.has(item.id)) && !isAllSelected;

    return (
        <div className="media-moderation flex-grow bg-[#fdf9f4] text-[#1c1b19] font-sans antialiased flex flex-col h-full overflow-hidden">
            {/* Inner Header Page & Memory Quota Box */}
            <section className="px-6 py-6 md:py-8 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#CAC6B9]/40 relative z-20">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <HardDrive className="text-[#635f41] w-5 h-5" />
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-[#49473d]">Storage System</span>
                    </div>
                    <h2 className="font-serif text-[28px] font-bold text-[#635f41] leading-tight">Media Moderation</h2>
                    <p className="font-medium text-xs text-[#49473d] mt-1">Review and approve uploads before they publish to the public gallery.</p>

                    {/* Category Filtering Tabs */}
                    <div className="flex items-center gap-1.5 mt-4 border-b border-[#e6e2dd] w-max">
                        {(["Pending", "Approved", "Quarantined", "All"] as const).map(tab => {
                            const count = tab === "All"
                                ? items.length
                                : items.filter(i => i.status === tab).length;
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(tab);
                                        setSelectedIds(new Set()); // reset select
                                    }}
                                    className={`px-3 py-1.5 text-xs font-semibold border-b-2 transition-all relative ${isActive
                                        ? "border-[#635f41] text-[#635f41] font-bold"
                                        : "border-transparent text-[#49473d] hover:text-[#635f41]"
                                        }`}
                                >
                                    {tab}
                                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${isActive
                                        ? "bg-[#635f41] text-white"
                                        : "bg-[#e6e2dd] text-[#49473d]"
                                        }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Storage Quota widget */}
                <div className="bg-[#FFF9D2] p-5 rounded-xl border border-[#CAC6B9] w-full md:w-80 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2 text-[#767253]">
                            <Cloud className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Storage Quota</span>
                        </div>
                        <span className="text-lg font-bold text-[#635f41]">{storageStats.percent}%</span>
                    </div>

                    {/* Progress slider bar */}
                    <div className="h-2 w-full bg-[#f1ede9] rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-[#466272] rounded-full transition-all duration-500"
                            style={{ width: `${storageStats.percent}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium text-[#49473d]">
                        <span>{storageStats.usedGB}GB Used</span>
                        <span>20GB Total</span>
                    </div>
                </div>
            </section>

            {/* Sticky Options Bar */}
            <section className="sticky top-0 z-30 bg-[#fdf9f4]/95 backdrop-blur-md border-b border-[#e6e2dd] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            ref={el => {
                                if (el) el.indeterminate = isSomeSelected;
                            }}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="media-checkbox border-[#CAC6B9] text-[#466272] focus:ring-[#466272]"
                        />
                        <span className="text-xs font-semibold text-[#49473d] group-hover:text-[#1c1b19] transition-colors selector-text">
                            {isAllSelected ? "Deselect All" : "Select All"}
                        </span>
                    </label>
                    <div className="h-4 w-px bg-[#CAC6B9]/60 hidden sm:block"></div>
                    <span className="text-xs font-semibold text-[#49473d] bg-[#f1ede9] px-2.5 py-1 rounded-full text-center">
                        <span id="selectedCount" className="font-bold">{selectedIds.size}</span> items selected
                    </span>
                </div>

                {/* Moderation Actions */}
                <div className={`flex items-center gap-2 transition-all duration-300 ${selectedIds.size > 0 ? "opacity-100 pointer-events-auto" : "opacity-45 pointer-events-none"
                    }`}>
                    <button
                        onClick={() => applyModerationAction("Approve")}
                        className="bg-[#466272] text-white text-xs font-bold px-3.5 py-2 rounded-[6px] flex items-center gap-1.5 hover:bg-[#466272]/90 shadow-sm transition-all active:scale-95"
                    >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                    </button>
                    <button
                        onClick={() => applyModerationAction("Quarantine")}
                        className="border border-[#466272] bg-white text-[#466272] text-xs font-bold px-3.5 py-2 rounded-[6px] flex items-center gap-1.5 hover:bg-[#c6e4f7]/20 transition-all active:scale-95"
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Quarantine</span>
                    </button>
                    <button
                        onClick={() => applyModerationAction("Delete")}
                        className="bg-red-50 text-red-600 text-xs font-bold px-3.5 py-2 rounded-[6px] border border-red-200 flex items-center gap-1.5 hover:bg-red-600 hover:text-white transition-all active:scale-95"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                    </button>
                </div>
            </section>

            {/* Scrollable Media Grid Content */}
            <section className="p-6 bg-[#f7f3ee]/60 flex-grow overflow-y-auto min-h-0 border-t border-[#e6e2dd]/40">
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-[#49473d]/70 h-full">
                        <Cloud className="w-12 h-12 text-[#CAC6B9] stroke-[1.5] mb-3 animate-pulse" />
                        <h4 className="font-serif text-lg font-bold text-[#635f41] mb-1">No Assets Found</h4>
                        <p className="text-xs">There are no {activeTab.toLowerCase()} files present in query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                        {filteredItems.map(item => {
                            const isSelected = selectedIds.has(item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={(e) => toggleSelect(item.id, e)}
                                    className={`image-card relative aspect-square bg-[#f1ede9] rounded-lg overflow-hidden border border-[#CAC6B9]/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group select-none ${isSelected ? "ring-2 ring-[#466272] ring-offset-2 ring-offset-[#fdf9f4]" : ""
                                        }`}
                                >
                                    {/* Image background block */}
                                    <div
                                        style={{ backgroundImage: `url(${item.imageUrl})` }}
                                        title={item.subject}
                                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    ></div>

                                    {/* Transparent click selection overlay */}
                                    <div className={`absolute inset-0 bg-[#466272]/15 transition-opacity duration-200 z-10 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        }`}></div>

                                    {/* Status Badge */}
                                    <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm flex items-center gap-1 z-20 backdrop-blur-sm border ${item.status === "Pending" ? "bg-[#c6e4f7]/95 text-[#001e2c] border-[#adcbdd]" :
                                        item.status === "Approved" ? "bg-green-50/95 text-green-700 border-green-200" :
                                            "bg-red-50/95 text-red-700 border-red-200"
                                        }`}>
                                        {item.status === "Pending" && <Hourglass className="w-2.5 h-2.5 animate-spin" />}
                                        {item.status === "Approved" && <Check className="w-2.5 h-2.5" />}
                                        {item.status === "Quarantined" && <AlertTriangle className="w-2.5 h-2.5" />}
                                        {item.status}
                                    </div>

                                    {/* Selection checkbox top-left */}
                                    <div className="absolute top-2.5 left-2.5 z-20" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleSelect(item.id)}
                                            className="media-checkbox hover:scale-105 transition-all text-[#466272] pointer-events-auto"
                                        />
                                    </div>

                                    {/* Details HUD slides up on hover */}
                                    <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-white/90 backdrop-blur-sm border-t border-white/60 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex flex-col gap-0.5">
                                        <div className="flex justify-between items-center text-[11px] font-bold text-[#1c1b19]">
                                            <span className="truncate max-w-[70%]">{item.filename}</span>
                                            <span className="text-[#49473d]">{item.size}</span>
                                        </div>
                                        <p className="text-[9px] leading-tight text-[#49473d] truncate" title={item.subject}>
                                            {item.subject}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Custom Toast Indicator elements */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`p-4 rounded-xl border shadow-lg flex items-start gap-3 backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto animate-fade-in-up ${toast.type === "success" ? "bg-green-50/95 border-green-200 text-green-800" :
                            toast.type === "warning" ? "bg-amber-50/95 border-amber-200 text-amber-800" :
                                "bg-red-50/95 border-red-200 text-red-800"
                            }`}
                    >
                        {toast.type === "success" && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />}
                        {toast.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />}
                        {toast.type === "error" && <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                        <div className="flex-1">
                            <span className="font-semibold text-xs leading-5 block">{toast.text}</span>
                        </div>
                        <button
                            className="text-[#49473d] hover:text-[#1c1b19] p-0.5 rounded-full hover:bg-black/5"
                            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
