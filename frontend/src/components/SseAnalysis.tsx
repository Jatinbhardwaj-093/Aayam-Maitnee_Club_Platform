import React, { useEffect, useState } from "react";
import { Sparkles, Activity, FileText, Loader2, Check } from "lucide-react";
import type { CharacterItem } from "./CharacterDirectory";

interface SseAnalysisProps {
    onAddToDirectory: (char: CharacterItem) => void;
    savedCharacters: CharacterItem[];
    scriptId?: string;
    hasContent?: boolean;
}

export const SseAnalysis: React.FC<SseAnalysisProps> = ({ onAddToDirectory, savedCharacters, scriptId, hasContent = true }) => {
    const [extracted, setExtracted] = useState<CharacterItem[]>([]);
    const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected");
    const [hasReceivedData, setHasReceivedData] = useState(false);

    useEffect(() => {
        setStatus("connecting");
        const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5005";
        const url = `${BACKEND_URL}/api/stream${scriptId ? `?script_id=${scriptId}` : ""}`;

        console.log(`[SSE] Connecting to ${url}...`);
        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
            console.log("[SSE] Connected to event source.");
            setStatus("connected");
        };

        eventSource.onerror = (e) => {
            console.error("[SSE] Connection error/disconnected.", e);
            setStatus("disconnected");
            setHasReceivedData(true);
        };

        eventSource.addEventListener("analysis", (event: any) => {
            try {
                const parsed = JSON.parse(event.data);
                console.log("[SSE] Message received (analysis):", parsed);
                if (parsed.characters && Array.isArray(parsed.characters)) {
                    setExtracted(parsed.characters);
                }
                setHasReceivedData(true);
            } catch (err) {
                console.error("[SSE] Failed to parse event content:", err);
                setHasReceivedData(true);
            }
        });

        return () => {
            console.log("[SSE] Closing connection...");
            eventSource.close();
        };
    }, []);

    const isAlreadySaved = (name: string) => {
        return savedCharacters.some(c => c.name.toLowerCase() === name.toLowerCase());
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
            {/* SSE Connection Status Indicator */}
            <div className="flex items-center justify-between bg-[#F5EAE6] border border-[#DCBAB2] px-4 py-2.5 rounded-xl text-xs select-none">
                <div className="flex items-center space-x-2 text-[#5C3B37] font-mono text-[11px] font-bold uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5 text-[#8C241E]" />
                    <span>Live Script Stream:</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                        status === "connected" ? "bg-emerald-600 animate-pulse" :
                        status === "connecting" ? "bg-amber-600 animate-pulse" : "bg-[#8C241E]"
                    }`} />
                    <span className={`font-mono text-[10px] uppercase tracking-wider font-bold ${
                        status === "connected" ? "text-emerald-800" :
                        status === "connecting" ? "text-amber-800" : "text-[#8C241E]"
                    }`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Extracted Character Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {!hasContent ? (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[#DCBAB2] rounded-2xl p-6 text-center select-none bg-[#F5EAE6]/50">
                        <FileText className="w-8 h-8 text-[#8C5A54] mb-2" />
                        <p className="text-xs font-mono uppercase font-bold text-[#2A1816]">No characters analyzed yet</p>
                        <p className="text-xs text-[#6E4742] font-serif mt-1 max-w-[280px] leading-relaxed">
                            Draft scenes in the Storyline canvas, and character voices will be analyzed here in real time.
                        </p>
                    </div>
                ) : !hasReceivedData ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3.5 select-none">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border border-[#8C241E]/25 border-t-2 border-t-[#8C241E] animate-spin" />
                            <Loader2 className="w-4 h-4 text-[#8C241E] absolute top-3 left-3 animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#2A1816]">Analyzing storyline content...</p>
                            <p className="text-[10px] font-serif text-[#6E4742]">Extracting character concepts, traits, and dramatic roles</p>
                        </div>
                    </div>
                ) : extracted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[#DCBAB2] rounded-2xl p-6 text-center select-none bg-[#F5EAE6]/50">
                        <FileText className="w-8 h-8 text-[#8C5A54] mb-2" />
                        <p className="text-xs font-mono uppercase font-bold text-[#2A1816]">No distinct characters found</p>
                        <p className="text-xs text-[#6E4742] font-serif mt-1 max-w-[280px] leading-relaxed">
                            Add more descriptive dialogue lines with character name prefixes to trigger extraction.
                        </p>
                    </div>
                ) : (
                    extracted.map((char, index) => {
                        const saved = isAlreadySaved(char.name);
                        return (
                            <div key={index} className="group/card border border-[#DCBAB2] bg-[#FAF2EE] rounded-2xl p-4 shadow-xs hover:border-[#B32D25]/50 transition-all duration-200">
                                <div className="flex flex-row items-center justify-between pb-2.5 border-b border-[#DCBAB2]/40">
                                    <div className="text-sm font-serif font-bold flex items-center space-x-2 text-[#2A1816]">
                                        <span>{char.name}</span>
                                        <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeClass(char.role)}`}>
                                            {char.role || "Role"}
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-2.5">
                                    <p className="text-xs text-[#6E4742] font-serif leading-relaxed">
                                        {char.description}
                                    </p>

                                    <div className="mt-3 pt-2.5 border-t border-[#DCBAB2]/40 grid grid-cols-2 gap-3 text-[11px]">
                                        <div>
                                            <span className="text-[#8C5A54] block font-mono font-bold uppercase tracking-wider text-[9px] mb-1">Traits</span>
                                            <div className="flex flex-wrap gap-1">
                                                {(Array.isArray(char.traits)
                                                    ? char.traits
                                                    : typeof char.traits === "string"
                                                    ? char.traits.split(",").map(t => t.trim()).filter(Boolean)
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
                                                {char.motivation || "Artistic conflict"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-3.5 pt-2.5 border-t border-[#DCBAB2]/40 flex justify-end">
                                        {saved ? (
                                            <span className="text-[10px] font-mono uppercase font-bold px-3 py-1 rounded-full border border-emerald-700/30 bg-emerald-700/15 text-emerald-900 flex items-center gap-1">
                                                <Check className="w-3 h-3 text-emerald-800" /> Saved in Roster
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => onAddToDirectory(char)}
                                                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1 border border-[#A6352F] cursor-pointer transition-all"
                                            >
                                                <Sparkles className="w-3 h-3 text-[#FFD0CC]" />
                                                Add to Roster
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SseAnalysis;
