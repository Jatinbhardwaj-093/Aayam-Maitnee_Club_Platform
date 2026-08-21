import React, { useState } from "react";
import { Sparkles, Loader2, Save, Wand2, Check } from "lucide-react";
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

    const getRoleBadgeClass = (role: string = "Supporting") => {
        switch (role.toLowerCase()) {
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
        <div className="flex flex-col h-full space-y-4 select-text">
            {/* Search Prompt Form */}
            <form onSubmit={handleGenerate} className="space-y-3 select-none">
                <div className="flex flex-col space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                        Character Archetype & Concept Prompt
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. Suggest a conflicted court advisor who holds royal secrets"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-[#F5EAE6] border border-[#DCBAB2] h-10 px-3.5 text-xs text-[#2A1816] font-medium rounded-xl focus:border-[#B32D25] focus:outline-none placeholder:text-[#8C5A54]/60"
                        />
                        <button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-xs font-bold uppercase tracking-wider px-5 h-10 rounded-xl shrink-0 flex items-center gap-1.5 shadow-xs border border-[#A6352F] cursor-pointer transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD0CC]" /> : <Wand2 className="w-3.5 h-3.5 text-[#FFD0CC]" />}
                            <span>Suggest</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Suggestion Results Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3.5 select-none">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border border-[#8C241E]/25 border-t-2 border-t-[#8C241E] animate-spin" />
                            <Loader2 className="w-4 h-4 text-[#8C241E] absolute top-3 left-3 animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">Consulting Dramaturgy Assistant...</p>
                            <p className="text-[10px] font-serif text-[#6E4742]">Drafting character psychology, voice cues, and dramatic arcs</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-[#8C241E]/10 border border-[#8C241E]/30 text-[#8C241E] p-4 rounded-2xl text-xs font-serif select-none">
                        {error}
                    </div>
                )}

                {suggested && !loading && (
                    <div className="group/card border border-[#DCBAB2] bg-[#FAF2EE] rounded-2xl p-5 shadow-xs hover:border-[#B32D25]/50 transition-all duration-200">
                        <div className="flex flex-row items-center justify-between pb-3 border-b border-[#DCBAB2]/40">
                            <div className="text-sm font-serif font-bold flex items-center space-x-2 text-[#2A1816]">
                                <span>{suggested.name}</span>
                                <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeClass(suggested.role)}`}>
                                    {suggested.role || "Character"}
                                </span>
                            </div>
                        </div>

                        <div className="pt-3">
                            <p className="text-xs text-[#6E4742] font-serif leading-relaxed">
                                {suggested.description}
                            </p>

                            {/* Traits & Motivation */}
                            <div className="mt-3.5 pt-3 border-t border-[#DCBAB2]/40 grid grid-cols-2 gap-3 text-[11px]">
                                <div>
                                    <span className="text-[#8C5A54] block font-mono font-bold uppercase tracking-wider text-[9px] mb-1">Traits</span>
                                    <div className="flex flex-wrap gap-1">
                                        {(Array.isArray(suggested.traits)
                                            ? suggested.traits
                                            : typeof suggested.traits === "string"
                                            ? suggested.traits.split(",").map(t => t.trim()).filter(Boolean)
                                            : []
                                        ).map((t, idx) => (
                                            <span key={idx} className="border border-[#DCBAB2] py-0.5 px-2 font-mono text-[9px] text-[#5C3B37] bg-[#F5EAE6] rounded-full">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[#8C5A54] block font-mono font-bold uppercase tracking-wider text-[9px] mb-1">Motivation</span>
                                    <span className="text-[#2A1816] font-serif block text-xs leading-normal italic">
                                        {suggested.motivation || "None declared"}
                                    </span>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="mt-4 pt-3 border-t border-[#DCBAB2]/40 flex justify-end">
                                {saved ? (
                                    <span className="text-[10px] font-mono uppercase font-bold px-3 py-1 rounded-full border border-emerald-700/30 bg-emerald-700/15 text-emerald-900 flex items-center gap-1">
                                        <Check className="w-3 h-3 text-emerald-800" /> Saved in Roster
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-xs flex items-center gap-1.5 border border-[#A6352F] cursor-pointer transition-all"
                                    >
                                        <Save className="w-3.5 h-3.5 text-[#FFD0CC]" />
                                        Save to Roster
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!suggested && !loading && !error && (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[#DCBAB2] rounded-2xl p-6 text-center select-none bg-[#F5EAE6]/50">
                        <Sparkles className="w-8 h-8 text-[#8C5A54] mb-2" />
                        <p className="text-xs font-mono uppercase font-bold text-[#2A1816]">AI Suggestions Ready</p>
                        <p className="text-xs text-[#6E4742] font-serif mt-1 max-w-[280px] leading-relaxed">
                            Provide a prompt above to generate a new character archetype and psychological profile fitting your dramatic script.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AiSuggestions;
