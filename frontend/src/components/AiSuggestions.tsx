import React, { useState } from "react";
import { Sparkles, Loader2, Save, Wand2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import type { CharacterItem } from "./CharacterDirectory";

interface AiSuggestionsProps {
    onSaveCharacter: (char: CharacterItem) => void;
    storyContext: string;
}

export const AiSuggestions: React.FC<AiSuggestionsProps> = ({ onSaveCharacter, storyContext }) => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [suggested, setSuggested] = useState<CharacterItem | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setSuggested(null);
        setSaved(false);

        const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5005";

        try {
            const response = await fetch(`${BACKEND_URL}/api/suggest-character`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt,
                    context: storyContext,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to generate character outline: ${response.statusText}`);
            }

            const data = await response.json();
            setSuggested(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred during suggestion generation.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        if (!suggested) return;
        onSaveCharacter(suggested);
        setSaved(true);
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

    return (
        <div className="flex flex-col h-full space-y-4 select-text">
            {/* Search Prompt Form */}
            <form onSubmit={handleGenerate} className="space-y-3 select-none">
                <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                        What kind of character are you looking for?
                    </label>
                    <div className="flex gap-2.5">
                        <Input
                            type="text"
                            placeholder="e.g. Suggest a rival wizard"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="h-9"
                        />
                        <Button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className="rounded-xl px-5 h-9 shrink-0"
                        >
                            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Wand2 className="w-3.5 h-3.5 mr-1.5" />}
                            <span>Suggest</span>
                        </Button>
                    </div>
                </div>
            </form>

            {/* Suggestion Results Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3.5 select-none animate-pulse">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border border-primary/25 border-t-2 border-t-primary animate-spin" />
                            <Loader2 className="w-5 h-5 text-primary absolute top-3.5 left-3.5 animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xs font-semibold text-foreground">Consulting the AI assistant...</p>
                            <p className="text-[10px] text-muted-foreground">Drafting traits, motivation, and roles</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl text-xs select-none">
                        {error}
                    </div>
                )}

                {suggested && !loading && (
                    <div className="group/card border border-primary/25 hover:border-primary/45 relative bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-t-xl" />

                        <div className="flex flex-row items-center justify-between pb-3 border-b border-border/40 space-y-0">
                            <div className="text-sm font-bold flex items-center space-x-2">
                                <span className="text-foreground">{suggested.name}</span>
                                <Badge variant="outline" className={`text-[10px] leading-none py-0.5 rounded-full ${getRoleBadgeClass(suggested.role)}`}>
                                    {suggested.role}
                                </Badge>
                            </div>
                        </div>

                        <div className="pt-3">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {suggested.description}
                            </p>

                            {/* Traits & Motivation */}
                            <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-2 gap-3 text-[11px]">
                                <div>
                                    <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[9px] mb-1">Traits</span>
                                    <div className="flex flex-wrap gap-1">
                                        {suggested.traits.map((t, idx) => (
                                            <Badge key={idx} variant="outline" className="border-border py-0.5 px-1.5 lowercase text-muted-foreground bg-muted font-normal text-[10px] rounded-full">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[9px] mb-1">Motivation</span>
                                    <span className="text-foreground block leading-normal italic font-medium">
                                        {suggested.motivation || "None declared"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="mt-5 pt-3 border-t border-border/40 flex justify-end">
                                {saved ? (
                                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-100 text-emerald-800 font-bold tracking-wide rounded-xl py-1 px-2.5">
                                        ✓ Saved in Directory
                                    </Badge>
                                ) : (
                                    <Button
                                        onClick={handleSave}
                                        className="h-9 px-5 font-semibold text-xs rounded-xl"
                                    >
                                        <Save className="w-3.5 h-3.5 mr-1" />
                                        Save to Roster
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!suggested && !loading && !error && (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-xl p-6 text-center select-none bg-card">
                        <Sparkles className="w-8 h-8 text-muted-foreground mr-1.5 mb-2.5" />
                        <p className="text-sm font-semibold text-foreground">AI Suggestions Ready</p>
                        <p className="text-xs text-muted-foreground mt-1.5 max-w-[280px] leading-relaxed">
                            Provide a prompt above to generate a new character concept fitting your current manuscript.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiSuggestions;
