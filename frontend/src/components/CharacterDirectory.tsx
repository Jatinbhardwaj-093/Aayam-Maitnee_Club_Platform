import React, { useState } from "react";
import { Search, User, Trash2, AlertTriangle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "./ui/dialog";

export interface CharacterItem {
    id?: string;
    name: string;
    description: string;
    traits: string[];
    motivation: string;
    role: string;
}

interface CharacterDirectoryProps {
    characters: CharacterItem[];
    onDeleteCharacter: (id: string) => void;
}

export const CharacterDirectory: React.FC<CharacterDirectoryProps> = ({ characters, onDeleteCharacter }) => {
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [deletingChar, setDeletingChar] = useState<CharacterItem | null>(null);

    const filtered = characters.filter((c) => {
        const matchesSearch =
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.description.toLowerCase().includes(search.toLowerCase()) ||
            c.traits.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
            c.motivation.toLowerCase().includes(search.toLowerCase());

        const matchesRole = roleFilter === "All" || c.role.toLowerCase() === roleFilter.toLowerCase();

        return matchesSearch && matchesRole;
    });

    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role.toLowerCase()) {
            case "protagonist":
                return "bg-amber-100 text-amber-800 border-amber-250";
            case "antagonist":
                return "bg-rose-100 text-rose-800 border-rose-250";
            case "rival":
                return "bg-purple-100 text-purple-800 border-purple-250";
            case "supporting":
                return "bg-emerald-100 text-emerald-800 border-emerald-250";
            default:
                return "bg-slate-100 text-slate-800 border-slate-250";
        }
    };

    const confirmDelete = () => {
        if (deletingChar && deletingChar.id) {
            onDeleteCharacter(deletingChar.id);
            setDeletingChar(null);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Search & Filter Controls */}
            <div className="space-y-3 select-none">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search roster, traits, motivations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 h-9"
                    />
                </div>

                {/* Role Filters */}
                <div className="flex flex-wrap gap-1">
                    {["All", "Protagonist", "Antagonist", "Supporting", "Rival"].map((role) => (
                        <Button
                            key={role}
                            size="sm"
                            variant={roleFilter === role ? "default" : "outline"}
                            onClick={() => setRoleFilter(role)}
                            className="text-xs h-7.5 px-3 py-1 font-medium"
                        >
                            {role}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Directory List Container */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 select-text">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-xl p-6 text-center select-none bg-card">
                        <User className="w-8 h-8 text-muted-foreground mr-1.5 mb-2.5" />
                        <p className="text-sm font-semibold text-foreground">No matches found</p>
                        <p className="text-xs text-muted-foreground mt-1.5">Try resetting search or adding new profiles.</p>
                    </div>
                ) : (
                    filtered.map((char) => (
                        <div
                            key={char.id}
                            className="group/card bg-card border border-border hover:border-primary/30 relative shadow-sm rounded-xl p-4 transition-all duration-200"
                        >
                            <div className="flex flex-row items-center justify-between pb-3 border-b border-border/40 space-y-0">
                                <div className="flex items-center space-x-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-xs text-foreground shadow-sm select-none">
                                        {char.name ? getInitials(char.name) : <User className="w-3.5 h-3.5 text-primary" />}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="text-sm font-bold text-foreground flex items-center space-x-2">
                                            <span className="truncate">{char.name}</span>
                                            <Badge variant="outline" className={`shrink-0 text-[10px] leading-none py-0.5 rounded-full ${getRoleBadgeClass(char.role)}`}>
                                                {char.role}
                                            </Badge>
                                        </div>
                                        <span className="text-[10px] font-mono text-muted-foreground">ID: {char.id}</span>
                                    </div>
                                </div>

                                <Button
                                    size="icon-xs"
                                    variant="ghost"
                                    onClick={() => setDeletingChar(char)}
                                    title="Delete Character Profile"
                                    className="opacity-0 group-hover/card:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 cursor-pointer shrink-0"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                            </div>

                            <div className="pt-3">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {char.description}
                                </p>

                                <div className="mt-3.5 pt-3 border-t border-border/40 grid grid-cols-2 gap-3 text-[11px]">
                                    <div>
                                        <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[9px] mb-1">Traits</span>
                                        <div className="flex flex-wrap gap-1">
                                            {char.traits && char.traits.map((t, idx) => (
                                                <Badge key={idx} variant="outline" className="border-border py-0.5 px-1.5 lowercase text-muted-foreground bg-muted font-normal text-[10px] rounded-full">
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[9px] mb-1">Motivation</span>
                                        <span className="text-foreground block leading-normal italic truncate font-medium" title={char.motivation}>
                                            {char.motivation || "Not declared"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Confirm Delete Dialog modal */}
            <Dialog open={deletingChar !== null} onOpenChange={(open) => !open && setDeletingChar(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="w-10 h-10 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-3">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <DialogTitle>Delete Character Profile</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove <strong className="text-foreground">"{deletingChar?.name}"</strong> from your novel directory? This action will permanently delete their records and traits.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" size="sm">Cancel</Button>} />
                        <Button variant="destructive" size="sm" onClick={confirmDelete}>
                            Delete permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CharacterDirectory;
