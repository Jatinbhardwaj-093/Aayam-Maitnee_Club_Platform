import React, { useEffect, useState } from "react";
import { Sparkles, Activity, FileText, Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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

    const getRoleBadgeClass = (role: string) => {
        switch (role.toLowerCase()) {
            case "protagonist":
                return "bg-amber-100 text-amber-800 border-amber-250";
            case "antagonist":
                return "bg-rose-100 text-rose-800 border-rose-250";
            case "rival":
                return "bg-purple-100 text-purple-805 border-purple-250";
            case "supporting":
                return "bg-emerald-100 text-emerald-800 border-emerald-250";
            default:
                return "bg-slate-100 text-slate-800 border-slate-250";
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4 select-text">
            {/* SSE Connection Status Indicator */}
            <div className="flex items-center justify-between bg-muted border border-border px-4 py-2.5 rounded-xl text-xs select-none">
                <div className="flex items-center space-x-2 text-muted-foreground font-medium">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    <span>Real-time Analyzer:</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${status === "connected" ? "bg-emerald-500 animate-pulse" :
                        status === "connecting" ? "bg-amber-500 animate-pulse" : "bg-red-500"
                        }`} />
                    <span className={`font-mono uppercase tracking-wider font-extrabold ${status === "connected" ? "text-emerald-600" :
                        status === "connecting" ? "text-amber-600" : "text-red-550"
                        }`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Extracted Character Cards */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {!hasContent ? (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-xl p-6 text-center select-none bg-card">
                        <FileText className="w-8 h-8 text-muted-foreground mr-1.5 mb-2.5" />
                        <p className="text-sm font-semibold text-foreground">No characters analyzed yet</p>
                        <p className="text-xs text-muted-foreground mt-1.5 max-w-[280px] leading-relaxed">
                            Start writing in the editor, and characters will appear here automatically.
                        </p>
                    </div>
                ) : !hasReceivedData ? (
                    <div className="flex flex-col items-center justify-center py-16 space-y-3.5 select-none animate-pulse">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border border-primary/25 border-t-2 border-t-primary animate-spin" />
                            <Loader2 className="w-5 h-5 text-primary absolute top-3.5 left-3.5 animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-xs font-semibold text-foreground">Analyzing storyline content...</p>
                            <p className="text-[10px] text-muted-foreground">Extracting character concepts, traits, and roles via live stream</p>
                        </div>
                    </div>
                ) : extracted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 border border-dashed border-border rounded-xl p-6 text-center select-none bg-card">
                        <FileText className="w-8 h-8 text-muted-foreground mr-1.5 mb-2.5" />
                        <p className="text-sm font-semibold text-foreground">No characters found</p>
                        <p className="text-xs text-muted-foreground mt-1.5 max-w-[280px] leading-relaxed">
                            We analyzed the text, but couldn't identify any distinct characters yet. Try adding more descriptiveness!
                        </p>
                    </div>
                ) : (
                    extracted.map((char, index) => {
                        const saved = isAlreadySaved(char.name);
                        return (
                            <div key={index} className="group/card border border-border relative bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                                <div className="flex flex-row items-center justify-between pb-3 border-b border-border/40 space-y-0">
                                    <div className="text-sm font-bold flex items-center space-x-2">
                                        <span className="text-foreground">{char.name}</span>
                                        <Badge variant="outline" className={`text-[10px] leading-none py-0.5 rounded-full ${getRoleBadgeClass(char.role)}`}>
                                            {char.role}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="pt-3">
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {char.description}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-2 gap-3 text-[11px]">
                                        <div>
                                            <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[9px] mb-1">Traits</span>
                                            <div className="flex flex-wrap gap-1">
                                                {char.traits.map((t, idx) => (
                                                    <Badge key={idx} variant="outline" className="border-border py-0.5 px-1.5 lowercase text-muted-foreground bg-muted font-normal text-[10px] rounded-full">
                                                        {t}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block font-bold uppercase tracking-wider text-[9px] mb-1">Motivation</span>
                                            <span className="text-foreground block leading-normal italic font-medium">
                                                {char.motivation || "No clear goal yet"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-border/40 flex justify-end">
                                        {saved ? (
                                            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-100 text-emerald-800 font-bold tracking-wide rounded-xl py-1 px-2.5">
                                                ✓ Saved in Directory
                                            </Badge>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => onAddToDirectory(char)}
                                                className="text-xs h-7 px-3 py-1 font-semibold rounded-xl"
                                            >
                                                <Sparkles className="w-3.5 h-3.5 mr-1" />
                                                Add to Directory
                                            </Button>
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
