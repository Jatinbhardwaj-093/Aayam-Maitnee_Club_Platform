// @ts-nocheck
import React, { useState } from "react";
import { Search, User, Trash2, AlertTriangle, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "./ui/dialog";

export interface CharacterItem {
    id?: string | number;
    name: string;
    description?: string;
    traits?: string[] | string;
    motivation?: string;
    role?: string;
    color?: string;
}

interface CharacterDirectoryProps {
    characters: CharacterItem[];
    onDeleteCharacter: (id: string | number) => void;
}

export const CharacterDirectory: React.FC<CharacterDirectoryProps> = ({ characters, onDeleteCharacter }) => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [deletingChar, setDeletingChar] = useState<CharacterItem | null>(null);

    const helperGetTraits = (traits?: string[] | string): string[] => {
        if (!traits) return [];
        if (Array.isArray(traits)) return traits;
        if (typeof traits === "string") return traits.split(",").map(t => t.trim()).filter(Boolean);
        return [];
    };

    const filtered = characters.filter((c) => {
        const traitsList = helperGetTraits(c.traits);
        const matchesSearch =
            (c.name && c.name.toLowerCase().includes(search.toLowerCase())) ||
            (c.description && c.description.toLowerCase().includes(search.toLowerCase())) ||
            traitsList.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
            (c.motivation && c.motivation.toLowerCase().includes(search.toLowerCase()));

        const matchesRole = roleFilter === "All" || (c.role && c.role.toLowerCase() === roleFilter.toLowerCase());

        return matchesSearch && matchesRole;
    });

    const getInitials = (name: string) => {
        if (!name) return "CH";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const getRoleBadgeClass = (role: string = "Supporting") => {
        switch ((role || "").toLowerCase()) {
            case "protagonist":
                return "bg-[#8C241E] text-[#FDF8F7] border-[#A6352F]";
            case "antagonist":
                return "bg-[#353535] text-[#FDF8F7] border-[#222]";
            case "rival":
                return "bg-purple-900/15 text-purple-950 border-purple-800/30";
            case "supporting":
                return "bg-emerald-800/15 text-emerald-950 border-emerald-800/30";
            default:
                return "bg-[#EEDBD5] text-[#8C241E] border-[#D5AAA2]";
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Search & Filter Header */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C5A54]" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search roster, traits, motivations..."
                        className="w-full bg-[#F5EAE6] border border-[#DCBAB2] pl-8 pr-3 py-2 text-xs rounded-xl text-[#2A1816] placeholder:text-[#8C5A54]/70 focus:outline-none focus:border-[#B32D25]"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[10px] font-mono font-bold uppercase tracking-wider">
                    {["All", "Protagonist", "Antagonist", "Supporting", "Rival"].map((role) => (
                        <button
                            key={role}
                            type="button"
                            onClick={() => setRoleFilter(role)}
                            className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${
                                roleFilter === role
                                    ? "bg-[#8C241E] text-[#FDF8F7] border-[#A6352F] shadow-2xs"
                                    : "bg-[#F5EAE6] text-[#5C3B37] border-[#DCBAB2] hover:bg-[#EEDBD5]"
                            }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Directory List Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 select-text custom-scrollbar">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[#DCBAB2] rounded-2xl p-6 text-center select-none bg-[#F5EAE6]/50">
                        <User className="w-8 h-8 text-[#8C5A54] mb-2" />
                        <p className="text-xs font-mono uppercase font-bold text-[#2A1816]">No character matches found</p>
                        <p className="text-xs text-[#6E4742] font-serif mt-1">Try searching another name or adding new roster profiles below.</p>
                    </div>
                ) : (
                    filtered.map((char) => {
                        const traitsList = helperGetTraits(char.traits);
                        return (
                            <div
                                key={char.id || char.name}
                                className="group/card bg-[#FAF2EE] border border-[#DCBAB2] hover:border-[#B32D25]/50 relative shadow-xs rounded-2xl p-4 transition-all duration-200"
                            >
                                <div className="flex flex-row items-center justify-between pb-3 border-b border-[#DCBAB2]/50">
                                    <div className="flex items-center space-x-3 min-w-0">
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-2xs select-none shrink-0 border"
                                            style={{
                                                backgroundColor: char.color ? `${char.color}20` : "#EEDBD5",
                                                borderColor: char.color || "#D5AAA2",
                                                color: char.color || "#8C241E"
                                            }}
                                        >
                                            {char.name ? getInitials(char.name) : <User className="w-3.5 h-3.5" />}
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-sm font-serif font-bold text-[#2A1816] flex items-center space-x-2">
                                                <span className="truncate">{char.name}</span>
                                                <span className={`shrink-0 text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeClass(char.role)}`}>
                                                    {char.role || "Role"}
                                                </span>
                                            </div>
                                            {char.id && <span className="text-[9px] font-mono text-[#8C5A54]">ID: {char.id}</span>}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setDeletingChar(char)}
                                        title="Delete Character Profile"
                                        className="opacity-0 group-hover/card:opacity-100 text-[#8C5A54] hover:text-[#8C241E] p-1.5 hover:bg-[#EEDBD5] rounded-lg transition-all duration-200 cursor-pointer shrink-0"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="pt-2.5">
                                    <p className="text-xs text-[#6E4742] font-serif leading-relaxed">
                                        {char.description || "Theatrical character profile registered in play directory."}
                                    </p>

                                    <div className="mt-3 pt-2.5 border-t border-[#DCBAB2]/40 grid grid-cols-2 gap-3 text-[11px]">
                                        <div>
                                            <span className="text-[#8C5A54] block font-mono font-bold uppercase tracking-wider text-[9px] mb-1">Traits</span>
                                            <div className="flex flex-wrap gap-1">
                                                {traitsList.length > 0 ? (
                                                    traitsList.map((t, idx) => (
                                                        <span key={idx} className="border border-[#DCBAB2] py-0.5 px-2 font-mono text-[9px] text-[#5C3B37] bg-[#F5EAE6] rounded-full">
                                                            {t}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[9px] font-serif italic text-[#8C5A54]">None specified</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[#8C5A54] block font-mono font-bold uppercase tracking-wider text-[9px] mb-1">Motivation</span>
                                            <span className="text-[#2A1816] font-serif block text-xs leading-normal italic truncate" title={char.motivation}>
                                                {char.motivation || "Artistic dramatic arc"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Confirm Delete Dialog modal */}
            <Dialog open={deletingChar !== null} onOpenChange={(open) => !open && setDeletingChar(null)}>
                <DialogContent showCloseButton={false} className="sm:max-w-md bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-0 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
                    <button
                        type="button"
                        onClick={() => setDeletingChar(null)}
                        className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
                    >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                    </button>

                    <div className="p-8 space-y-6 text-left">
                        <DialogHeader className="space-y-2 text-left pr-10">
                            <div className="flex items-center gap-2 text-[#8C241E]">
                                <AlertTriangle className="w-5 h-5" />
                                <DialogTitle className="font-serif text-2xl text-[#2A1816]">
                                    Remove Character Profile?
                                </DialogTitle>
                            </div>
                            <DialogDescription className="text-xs font-serif text-[#6E4742] leading-relaxed">
                                Are you sure you want to remove <strong>{deletingChar?.name}</strong> from this script's Dramatis Personae?
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="pt-4 border-t border-[#DCBAB2]/70 flex justify-between items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDeletingChar(null)}
                                className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer shadow-xs"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (deletingChar?.id) {
                                        onDeleteCharacter(deletingChar.id);
                                    }
                                    setDeletingChar(null);
                                }}
                                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-[#8C241E]/20 cursor-pointer border border-[#A6352F]"
                            >
                                Delete Profile
                            </button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CharacterDirectory;
