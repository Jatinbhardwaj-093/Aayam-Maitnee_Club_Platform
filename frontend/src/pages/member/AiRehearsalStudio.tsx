// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Headphones,
  Layers,
  Loader2,
  Mic,
  Pin,
  Play,
  Radio,
  RotateCcw,
  Search,
  Sparkles,
  Square,
  Users,
  Volume2,
  Wand2,
  FileText,
  Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface ScriptItem {
  id: number;
  title: string;
  playwright: string;
  genre: string;
  language: string;
  acts: string;
  pages: number;
  rolesCount: string;
  rehearsalFocus: string;
  excerpt: string;
  content: string;
  author_email: string;
  author_name: string;
  status: string;
  created_at: string;
  charactersCount?: number;
  dialogueLines?: number;
  rehearsalReady?: boolean;
}

type Assignment = "human" | "ai";
type VoicePreference = "female" | "male";

const demoScript = `John: Hello Mary, how are you?

Mary: I'm doing well, John.

John: Are you ready for the performance?

Mary: Yes, I'm completely ready.`;

const normalize = (word: string) => word.toLowerCase().replace(/[^a-z0-9']/g, "");

const wordSpans = (text: string) => text.match(/[\w']+|[^\s\w]/g) || [];

const localMatchSpokenWords = (expectedWords: string[], transcriptText: string) => {
  const expected = expectedWords.map(normalize);
  const spoken = (transcriptText.toLowerCase().match(/[\w']+/g) || []).map(normalize).filter(Boolean);
  const matched = new Set<number>();
  let cursor = 0;

  spoken.forEach((spokenWord) => {
    for (let idx = cursor; idx < Math.min(expected.length, cursor + 5); idx += 1) {
      if (expected[idx] && expected[idx] === spokenWord) {
        matched.add(idx);
        cursor = idx + 1;
        return;
      }
    }
  });

  return {
    matchedIndices: Array.from(matched).sort((a, b) => a - b),
    currentWordIndex: matched.size ? Math.max(...matched) : -1,
  };
};

const voiceHints: Record<VoicePreference, string[]> = {
  female: ["female", "woman", "zira", "samantha", "susan", "victoria", "karen", "moira", "tessa"],
  male: ["male", "man", "david", "mark", "alex", "daniel", "fred", "rishi", "george"],
};

const selectBrowserVoice = (voices: SpeechSynthesisVoice[], preference?: VoicePreference) => {
  const englishVoices = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("en"));
  const candidates = englishVoices.length ? englishVoices : voices;
  if (!preference) return candidates[0] || null;
  const hints = voiceHints[preference];
  return candidates.find((voice) => hints.some((hint) => voice.name.toLowerCase().includes(hint))) || candidates[0] || null;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const ttsControlsFromPerformance = (performance?: any) => {
  const pace = performance?.pace || "moderate";
  const tone = `${performance?.tone || ""} ${performance?.emotion || ""}`.toLowerCase();
  const intensity = typeof performance?.intensity === "number" ? performance.intensity : 0.5;

  let rate = pace === "slow" ? 0.82 : pace === "brisk" ? 1.12 : 0.95;
  let pitch = 1;
  let volume = 0.9;

  if (tone.includes("warm") || tone.includes("gentle") || tone.includes("calm")) pitch -= 0.04;
  if (tone.includes("angry") || tone.includes("frustrated") || tone.includes("confront")) pitch += 0.06;
  if (tone.includes("sad") || tone.includes("somber")) {
    pitch -= 0.08;
    rate -= 0.05;
  }
  if (tone.includes("excited") || tone.includes("urgent")) {
    pitch += 0.08;
    rate += 0.06;
  }

  volume += (intensity - 0.5) * 0.28;
  rate += (intensity - 0.5) * 0.08;

  return {
    rate: clamp(rate, 0.65, 1.35),
    pitch: clamp(pitch, 0.7, 1.35),
    volume: clamp(volume, 0.55, 1),
  };
};

export default function AiRehearsalStudio() {
  const { activeUser } = useOutletContext<any>() || {};
  const { scriptId } = useParams<{ scriptId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";

  const [allScripts, setAllScripts] = useState<ScriptItem[]>([]);
  const [activeScript, setActiveScript] = useState<ScriptItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedScriptIds, setPinnedScriptIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("aayam_pinned_scripts");
    return saved ? JSON.parse(saved) : [1, 2, 3];
  });

  const [inlineTitle, setInlineTitle] = useState("Original Scene Rehearsal");
  const [inlineScript, setInlineScript] = useState(demoScript);
  const [scene, setScene] = useState<any | null>(null);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [voicePreferences, setVoicePreferences] = useState<Record<string, VoicePreference>>({});
  const [session, setSession] = useState<any | null>(null);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [aiWordIndex, setAiWordIndex] = useState(-1);
  const [humanWordIndex, setHumanWordIndex] = useState(-1);
  const [spokenIndices, setSpokenIndices] = useState<number[]>([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [audioStatus, setAudioStatus] = useState("Stage Idle");
  const [parsing, setParsing] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const aiTimerRef = useRef<number | null>(null);
  const aiPreparingRef = useRef(false);
  const lastTranscriptRef = useRef("");
  const lastSentTranscriptRef = useRef("");
  const lastSentAtRef = useRef(0);
  const finalSentTurnRef = useRef<string | null>(null);
  const transcriptRequestCountRef = useRef<Record<string, number>>({});
  const sessionRef = useRef<any | null>(null);
  const activeTurnRef = useRef<any | null>(null);
  const micBlockedRef = useRef(false);

  const trace = (message: string, payload?: Record<string, unknown>) => {
    console.debug(`[DramaRehearsal] ${message}`, payload || "");
  };

  const applySessionState = (nextSession: any) => {
    sessionRef.current = nextSession;
    activeTurnRef.current = nextSession?.currentTurn || null;
    setSession((previous: any) => {
      const isNewSession = previous?.session_id && nextSession?.session_id && previous.session_id !== nextSession.session_id;
      if (previous?.session_id === nextSession?.session_id && nextSession?.current_turn < previous.current_turn) {
        trace("IGNORED STALE SESSION RESPONSE", {
          previousTurn: previous.current_turn,
          nextTurn: nextSession.current_turn,
        });
        return previous;
      }
      if (!isNewSession && previous?.scene_status === "complete" && nextSession?.scene_status !== "complete") {
        return previous;
      }
      return nextSession;
    });
  };

  const clearRehearsalState = () => {
    stopListening();
    window.speechSynthesis?.cancel();
    if (aiTimerRef.current) {
      window.clearInterval(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    aiPreparingRef.current = false;
    lastTranscriptRef.current = "";
    lastSentTranscriptRef.current = "";
    lastSentAtRef.current = 0;
    finalSentTurnRef.current = null;
    transcriptRequestCountRef.current = {};
    sessionRef.current = null;
    activeTurnRef.current = null;
    micBlockedRef.current = false;
    setSession(null);
    setScene(null);
    setActiveScript(null);
    setTranscript("");
    setHumanWordIndex(-1);
    setSpokenIndices([]);
    setAiWordIndex(-1);
    setError("");
    setAudioStatus("Stage Idle");
  };

  const returnToStudio = () => {
    clearRehearsalState();
    navigate("/ai-rehearsal", { replace: false });
  };

  useEffect(() => {
    localStorage.setItem("aayam_pinned_scripts", JSON.stringify(pinnedScriptIds));
  }, [pinnedScriptIds]);

  useEffect(() => {
    const email = activeUser?.email || "";
    if (!email) {
      setAllScripts([]);
      if (!scriptId) {
        setActiveScript(null);
      }
      return;
    }
    if (!scriptId) {
      if (activeScript && location.pathname === "/ai-rehearsal") {
        clearRehearsalState();
      } else {
        setActiveScript(null);
      }
    }
    fetch(`${baseUrl}/api/rehearsal/scripts?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        const list: ScriptItem[] = data.scripts || [];
        setAllScripts(list);
        if (scriptId) {
          const match = list.find((item) => String(item.id) === String(scriptId));
          if (match) {
            setActiveScript(match);
            parseScript(match);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load scripts for rehearsal", err);
      });
  }, [activeUser?.email, scriptId, location.pathname]);

  const pinnedScripts = useMemo(() => {
    return allScripts.filter((s) => pinnedScriptIds.includes(s.id));
  }, [allScripts, pinnedScriptIds]);

  const filteredScripts = useMemo(() => {
    if (!searchQuery.trim()) return allScripts;
    const q = searchQuery.toLowerCase();
    return allScripts.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.playwright.toLowerCase().includes(q) ||
        (s.genre && s.genre.toLowerCase().includes(q))
    );
  }, [allScripts, searchQuery]);

  const parseScript = async (targetScript?: ScriptItem) => {
    setParsing(true);
    setError("");
    try {
      const payload = targetScript
        ? {
            script_id: targetScript.id,
            user_email: activeUser?.email || "",
          }
        : {
            title: inlineTitle,
            script: inlineScript,
            user_email: activeUser?.email || "",
          };
      const res = await fetch(`${baseUrl}/api/rehearsal/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to parse script.");
        setParsing(false);
        return;
      }
      setScene(data.scene);
      const defaultAssignments: Record<string, Assignment> = {};
      const defaultVoices: Record<string, VoicePreference> = {};
      (data.scene.characters || []).forEach((c: any, index: number) => {
        defaultAssignments[c.name] = index === 0 ? "human" : "ai";
        defaultVoices[c.name] = index % 2 === 0 ? "female" : "male";
      });
      setAssignments(defaultAssignments);
      setVoicePreferences(defaultVoices);
    } catch (err: any) {
      setError(err.message || "Network error while parsing script.");
    } finally {
      setParsing(false);
    }
  };

  const parseDemoScript = () => {
    setInlineTitle("John and Mary Rehearsal");
    setInlineScript(demoScript);
    parseScript();
  };

  const startSession = async () => {
    if (!scene) return;
    setError("");
    setSessionStartedAt(Date.now());
    setAudioStatus("Initializing Roleplay");
    try {
      const res = await fetch(`${baseUrl}/api/rehearsal/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scene,
          assignments,
          voicePreferences,
          user_email: activeUser?.email || "anonymous@aayam.iitm",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start rehearsal session.");
        return;
      }
      applySessionState(data.session);
    } catch (err: any) {
      setError(err.message || "Failed to connect to rehearsal server.");
    }
  };

  const stopSession = async () => {
    if (!session?.session_id) return;
    stopListening();
    window.speechSynthesis?.cancel();
    try {
      await fetch(`${baseUrl}/api/rehearsal/roleplay/${session.session_id}/stop`, { method: "POST" });
    } catch (e) {
      console.warn(e);
    }
    setAudioStatus("Rehearsal Paused");
  };

  useEffect(() => {
    if (!session) return;
    if (session.scene_status === "complete") {
      stopListening();
      window.speechSynthesis?.cancel();
      setAudioStatus("Scene Complete");
      return;
    }

    if (session.status === "HUMAN_TURN" && session.speaker_type === "human") {
      setAudioStatus("Awaiting Actor Speech");
      startListening();
    } else if (session.status === "PLAYING_AI_AUDIO" || session.speaker_type === "ai") {
      stopListening();
      prepareAiTurn();
    }
  }, [session?.current_turn, session?.status, session?.scene_status]);

  const sendTranscript = async (text: string, isFinal: boolean, silenceMs = 0) => {
    const activeSession = sessionRef.current;
    if (!activeSession?.session_id) return;
    const activeTurn = activeTurnRef.current;
    const turnKey = `${activeSession.current_turn}-${activeTurn?.id || "turn"}`;
    const now = Date.now();

    if (isFinal && finalSentTurnRef.current === turnKey) {
      return;
    }
    if (isFinal) {
      finalSentTurnRef.current = turnKey;
    }

    const currentCount = transcriptRequestCountRef.current[turnKey] || 0;
    if (currentCount >= 20 && !isFinal) return;

    if (!isFinal && text === lastSentTranscriptRef.current && now - lastSentAtRef.current < 250) {
      return;
    }

    transcriptRequestCountRef.current[turnKey] = currentCount + 1;
    lastSentTranscriptRef.current = text;
    lastSentAtRef.current = now;

    try {
      const res = await fetch(`${baseUrl}/api/rehearsal/roleplay/${activeSession.session_id}/transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text, is_final: isFinal, silence_ms: silenceMs }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Speech processing error.");
        return;
      }
      const progressTurnId = data.session.last_human_turn_id || activeTurn?.id;
      const progress = data.session.human_progress?.[progressTurnId];
      if (progress) {
        setSpokenIndices(progress.matched_indices || []);
        setHumanWordIndex(progress.current_word_index ?? -1);
      }
      applySessionState(data.session);
    } catch (e) {
      console.warn("Transcript send warning:", e);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      micBlockedRef.current = true;
      setError("This browser does not support live speech recognition. Use Chrome or Edge for voice recognition.");
      setAudioStatus("Microphone unavailable");
      return;
    }
    if (recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      setAudioStatus("Listening for speech");
    };
    recognition.onerror = (event: any) => {
      setListening(false);
      if (event.error === "no-speech") {
        setAudioStatus("Awaiting Actor Speech");
        return;
      }
      const message = event.error === "not-allowed" ? "Microphone permission denied." : "Speech recognition interrupted.";
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        micBlockedRef.current = true;
      }
      setAudioStatus(message);
      setError(message);
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
      const activeSession = sessionRef.current;
      if (activeSession?.status === "HUMAN_TURN" && activeSession?.speaker_type === "human" && !micBlockedRef.current) {
        window.setTimeout(() => {
          if (!recognitionRef.current && sessionRef.current?.status === "HUMAN_TURN" && !micBlockedRef.current) {
            startListening();
          }
        }, 250);
      }
    };
    recognition.onresult = (event: any) => {
      let interim = "";
      let finalText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const phrase = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += phrase;
        else interim += phrase;
      }
      const combined = `${lastTranscriptRef.current} ${finalText || interim}`.trim();
      setTranscript(combined);
      if (sessionRef.current?.speaker_type === "human" && activeTurnRef.current?.words) {
        const localMatch = localMatchSpokenWords(activeTurnRef.current.words, combined);
        setSpokenIndices(localMatch.matchedIndices);
        setHumanWordIndex(localMatch.currentWordIndex);
      }
      if (!finalText) {
        sendTranscript(combined, false);
      }
      if (finalText) {
        lastTranscriptRef.current = `${lastTranscriptRef.current} ${finalText}`.trim();
        if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = window.setTimeout(() => {
          const finalTranscript = lastTranscriptRef.current;
          sendTranscript(finalTranscript, true, 1100);
          lastTranscriptRef.current = "";
        }, 1100);
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setAudioStatus("Microphone could not start");
      recognitionRef.current = null;
    }
  };

  const stopListening = () => {
    if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const prepareAiTurn = async () => {
    if (!session?.session_id || aiPreparingRef.current) return;
    aiPreparingRef.current = true;
    try {
      const res = await fetch(`${baseUrl}/api/rehearsal/roleplay/${session.session_id}/ai-turn`, { method: "POST" });
      const data = await res.json();
      aiPreparingRef.current = false;
      if (!res.ok) {
        setError(data.error || "AI turn generation failed.");
        return;
      }
      applySessionState(data.session);
      speakAiTurn(data.session);
    } catch (e) {
      aiPreparingRef.current = false;
      console.warn("AI Turn error:", e);
    }
  };

  const speakAiTurn = (nextSession: any) => {
    const payload = nextSession.ai_payload;
    if (!payload?.text) {
      completeAiTurn(nextSession.session_id);
      return;
    }
    if (!("speechSynthesis" in window)) {
      setError("Browser audio synthesis unavailable. Advancing line automatically.");
      window.setTimeout(() => completeAiTurn(nextSession.session_id), 1400);
      return;
    }

    window.speechSynthesis.cancel();
    setAiWordIndex(-1);
    setAudioStatus("AI Partner Speaking");
    const utterance = new SpeechSynthesisUtterance(payload.text);
    const ttsControls = ttsControlsFromPerformance(payload.performance);
    utterance.rate = ttsControls.rate;
    utterance.pitch = ttsControls.pitch;
    utterance.volume = ttsControls.volume;

    const voices = window.speechSynthesis.getVoices();
    const voicePreference = (payload.voice as VoicePreference) || voicePreferences[nextSession.current_speaker] || voicePreferences[payload.character];
    const voice = selectBrowserVoice(voices, voicePreference);
    if (voice) utterance.voice = voice;

    const words = payload.words || [];
    const startedAt = performance.now();
    if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
    aiTimerRef.current = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) / 1000;
      const idx = words.findIndex((word: any) => elapsed >= word.start && elapsed <= word.end);
      if (idx >= 0) {
        setAiWordIndex(idx);
      } else {
        const lastSpoken = words.findLastIndex((word: any) => elapsed > word.end);
        if (lastSpoken >= 0) setAiWordIndex(lastSpoken);
      }
    }, 60);

    utterance.onboundary = (event: any) => {
      if (event.name !== "word") return;
      const spokenPrefix = payload.text.slice(0, event.charIndex);
      const idx = wordSpans(spokenPrefix).filter((word) => normalize(word)).length;
      setAiWordIndex(idx);
    };
    utterance.onend = () => {
      if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
      setAiWordIndex(-1);
      setAudioStatus("AI Turn Complete");
      completeAiTurn(nextSession.session_id);
    };
    utterance.onerror = () => {
      if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
      setAudioStatus("AI Audio Advance");
      completeAiTurn(nextSession.session_id);
    };
    window.speechSynthesis.speak(utterance);
  };

  const completeAiTurn = async (sessionId: string) => {
    const res = await fetch(`${baseUrl}/api/rehearsal/roleplay/${sessionId}/ai-complete`, { method: "POST" });
    const data = await res.json();
    if (res.ok) applySessionState(data.session);
  };

  const togglePinScript = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setPinnedScriptIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]));
  };

  const activeTurn = session?.currentTurn;
  const displayScene = session?.scene || scene;
  const currentTitle = activeScript?.title || displayScene?.title || inlineTitle;
  const progressPercent = session?.scene?.turns?.length
    ? Math.round(((session.current_turn + 1) / session.scene.turns.length) * 100)
    : 0;
  const elapsedMins = sessionStartedAt ? Math.max(1, Math.round((Date.now() - sessionStartedAt) / 60000)) : 0;

  // ==========================================
  // VIEW 1: ACTIVE REHEARSAL PROSCENIUM ROOM
  // ==========================================
  if (((scriptId && activeScript) || session) && displayScene) {
    return (
      <div className="space-y-6 w-full max-w-5xl mx-auto pb-20 font-sans text-[#5C3B37]">
        
        <header className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-2xl px-5 py-4 shadow-xs w-full flex items-center gap-4">
          <button
            onClick={returnToStudio}
            className="w-9 h-9 rounded-xl border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Return to Rehearsal Library"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <span className="block text-[9px] font-mono uppercase font-bold tracking-widest text-[#8C5A54]">Rehearsal</span>
            <h1 className="font-serif text-xl md:text-2xl font-normal text-[#2A1816] tracking-tight truncate">
              {currentTitle}
            </h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-5 w-full items-start">
          
          {/* LEFT COLUMN: DIRECTOR'S CONSOLE & ROSTER */}
          <aside className="space-y-4">
            
            {/* Character Cast & Role Toggle */}
            <section className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DCBAB2]/70 pb-3">
                <h2 className="font-serif text-lg font-normal text-[#2A1816]">Cast</h2>
                <span className="text-[10px] font-mono font-bold uppercase text-[#8C5A54] tracking-wider">
                  {displayScene.characters.length} Roles
                </span>
              </div>

              <div className="space-y-2">
                {displayScene.characters.map((character: any) => {
                  const isHuman = assignments[character.name] === "human";
                  const isAi = assignments[character.name] === "ai";
                  const currentVoice = voicePreferences[character.name] || "female";
                  const isTurnActive = activeTurn?.character === character.name;

                  return (
                    <div
                      key={character.name}
                      className={`p-3 rounded-xl border transition-colors space-y-2 ${
                        isTurnActive
                          ? "bg-[#F5EAE6] border-[#8C241E]"
                          : "bg-[#FAF2EE] border-[#DCBAB2]/80"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-serif font-bold text-[#2A1816] truncate">
                          {character.name}
                        </p>
                        {isTurnActive && (
                          <span className="text-[9px] font-mono uppercase font-bold text-[#8C241E] bg-[#EEDBD5] px-1.5 py-0.5 rounded border border-[#D5AAA2]">
                            Speaking
                          </span>
                        )}
                      </div>

                      {/* Segmented control */}
                      <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#E8D6CF]/70 rounded-lg border border-[#D5AAA2]/60">
                        <button
                          type="button"
                          disabled={!!session && session.scene_status === "active"}
                          onClick={() => setAssignments({ ...assignments, [character.name]: "human" })}
                          className={`py-1 px-1.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            isHuman
                              ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs"
                              : "text-[#5C3B37] hover:text-[#2A1816]"
                          }`}
                        >
                          Actor
                        </button>
                        <button
                          type="button"
                          disabled={!!session && session.scene_status === "active"}
                          onClick={() => setAssignments({ ...assignments, [character.name]: "ai" })}
                          className={`py-1 px-1.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                            isAi
                              ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs"
                              : "text-[#5C3B37] hover:text-[#2A1816]"
                          }`}
                        >
                          AI
                        </button>
                      </div>

                      {/* Voice Voice Toggle if AI */}
                      {isAi && (
                        <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#FAF2EE] rounded-lg border border-[#DCBAB2]/80">
                          <button
                            type="button"
                            disabled={!!session && session.scene_status === "active"}
                            onClick={() => setVoicePreferences({ ...voicePreferences, [character.name]: "female" })}
                            className={`py-0.5 px-1.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              currentVoice === "female"
                                ? "bg-[#5C3B37] text-[#FAF2EE]"
                                : "text-[#8C5A54] hover:text-[#2A1816]"
                            }`}
                          >
                            Female
                          </button>
                          <button
                            type="button"
                            disabled={!!session && session.scene_status === "active"}
                            onClick={() => setVoicePreferences({ ...voicePreferences, [character.name]: "male" })}
                            className={`py-0.5 px-1.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              currentVoice === "male"
                                ? "bg-[#5C3B37] text-[#FAF2EE]"
                                : "text-[#8C5A54] hover:text-[#2A1816]"
                            }`}
                          >
                            Male
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Stage Progress & Control Card */}
            <section className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-4 space-y-4 shadow-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono text-[#8C5A54]">
                  <span className="uppercase tracking-wider font-bold">Progress</span>
                  <span className="font-bold text-[#2A1816]">{progressPercent}%</span>
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full rounded-full bg-[#EEDBD5] overflow-hidden border border-[#D5AAA2]/60">
                  <div
                    className="h-full bg-[#8C241E] transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#6E4742] pt-1">
                  <span>
                    {session?.scene?.turns?.length ? `Line ${session.current_turn + 1} of ${session.scene.turns.length}` : "Ready"}
                  </span>
                  <span>{elapsedMins}m elapsed</span>
                </div>
              </div>

              {/* Primary Session Controls */}
              <div className="space-y-2 pt-1 border-t border-[#DCBAB2]/70">
                {!session || session.scene_status !== "active" ? (
                  <button
                    onClick={startSession}
                    className="w-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-[#A6352F] shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-[#FFD0CC]" />
                    <span>Start Rehearsal</span>
                  </button>
                ) : (
                  <button
                    onClick={stopSession}
                    className="w-full bg-rose-900 hover:bg-rose-950 text-[#FDF8F7] py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-rose-950 shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Rehearsal</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setSession(null);
                    if (activeScript) parseScript(activeScript);
                    else parseScript();
                  }}
                  className="w-full bg-[#FAF2EE] hover:bg-[#EEDBD5] border border-[#D5AAA2] text-[#5C3B37] hover:text-[#2A1816] py-2 px-3 rounded-xl font-mono text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-[#8C241E]" />
                  <span>Reset Setup</span>
                </button>
              </div>

              {/* Telemetry Status Bar */}
              <div className="p-2.5 rounded-xl bg-[#F5EAE6] border border-[#DCBAB2] flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#8C5A54] uppercase tracking-wider">Audio:</span>
                <span className="text-[#2A1816] font-bold flex items-center gap-1.5 truncate">
                  <Radio className="w-3 h-3 text-[#8C241E] animate-pulse shrink-0" />
                  <span className="truncate">{audioStatus}</span>
                </span>
              </div>

              {error && (
                <div className="bg-rose-100 border border-rose-300 text-rose-900 rounded-xl p-3 text-[11px] font-mono flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </section>
          </aside>

          {/* RIGHT COLUMN: PROSCENIUM STAGE & TELEPROMPTER */}
          <main className="space-y-4">
            
            {/* MAIN TELEPROMPTER SCREEN */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-6 md:p-7 shadow-sm space-y-5 relative">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCBAB2]/70 pb-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider font-bold">
                    Current Speaker
                  </span>
                  <h2 className="text-xl md:text-2xl font-serif text-[#2A1816] font-normal">
                    {activeTurn?.character || "Awaiting Start"}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {session?.status === "HUMAN_TURN" && (
                    <span className="inline-flex items-center gap-1.5 text-amber-950 bg-amber-100 border border-amber-300 rounded-full px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider">
                      <Mic className="w-3 h-3 text-amber-900 animate-bounce" />
                      <span>{listening ? "Speaking" : "Listening"}</span>
                    </span>
                  )}

                  {session?.status === "PLAYING_AI_AUDIO" && (
                    <span className="inline-flex items-center gap-1.5 text-[#FDF8F7] bg-[#8C241E] border border-[#A6352F] rounded-full px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider">
                      <Volume2 className="w-3 h-3 text-[#FFD0CC] animate-pulse" />
                      <span>AI Speaking</span>
                    </span>
                  )}
                </div>
              </div>

              {/* SPOKEN SCRIPT TELEPROMPTER DISPLAY */}
              {activeTurn ? (
                <div className="space-y-5">
                  
                  <div className="py-6 md:py-8 min-h-[150px] flex items-center justify-center text-center">
                    <div className="font-serif text-2xl sm:text-3xl leading-relaxed text-[#2A1816] max-w-3xl mx-auto">
                      {activeTurn.words.map((word: string, index: number) => {
                        const isHuman = session.speaker_type === "human";
                        const activeIndex = isHuman ? humanWordIndex : aiWordIndex;
                        const spoken = isHuman ? spokenIndices.includes(index) : index < aiWordIndex;
                        const active = index === activeIndex;

                        return (
                          <span
                            key={`${word}-${index}`}
                            className={`inline-block mx-0.5 transition-colors duration-150 ${
                              active
                                ? "text-[#8C241E] font-bold underline decoration-2 underline-offset-4"
                                : spoken
                                  ? "text-[#8C241E] font-semibold underline decoration-[#8C241E]/40"
                                  : "text-[#2A1816]/80 font-normal"
                            }`}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {session.speaker_type === "human" && (
                    <div className="border-t border-[#DCBAB2]/70 pt-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-amber-900" />
                          <span>Microphone</span>
                        </p>
                        {!speechSupported && (
                          <span className="text-[10px] font-mono font-bold uppercase text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300">
                            Voice API Unavailable
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-serif italic text-[#5C3B37] bg-[#F5EAE6] px-3.5 py-3 rounded-xl min-h-[44px] flex items-center">
                        "{transcript || "Speak your line clearly into the microphone..."}"
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <button
                          onClick={startListening}
                          className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs border border-[#A6352F]"
                        >
                          <Mic className="w-3.5 h-3.5 text-[#FFD0CC]" />
                          <span>Listen again</span>
                        </button>

                        <button
                          onClick={() => sendTranscript(activeTurn.text, true, 1200)}
                          className="px-4 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] hover:text-[#2A1816] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                          title="Confirm line read manually if speech recognition struggles"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                          <span>Advance cue</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="font-serif text-3xl font-normal text-[#2A1816]">Scene Successfully Concluded</h2>
                    <p className="text-xs sm:text-sm font-mono text-[#6E4742]">
                      Rehearsal session duration: ~{elapsedMins} minute(s). All cues completed!
                    </p>
                  </div>
                  <button
                    onClick={returnToStudio}
                    className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 border border-[#A6352F] cursor-pointer shadow-md shadow-[#8C241E]/20"
                  >
                    <BookOpen className="w-4 h-4 text-[#FFD0CC]" /> Return to Rehearsal Library
                  </button>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: REHEARSAL STUDIO CATALOG & SETUP
  // ==========================================
  return (
    <div className="space-y-5 w-full max-w-5xl mx-auto pb-20 font-sans text-[#5C3B37]">
      
      {/* THEATRICAL STUDIO BANNER */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-5 w-full">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
            Studio
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#2A1816] font-normal tracking-tight">
            Rehearsal Studio
          </h1>
          <p className="font-sans text-xs text-[#5C3B37] leading-relaxed">
            Select a play from the repertoire or import a custom scene to rehearse with live AI roleplay.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={parseDemoScript}
            disabled={parsing}
            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border border-[#A6352F] shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#FFD0CC]" />
            <span>{parsing ? "Parsing..." : "Quick Demo Scene"}</span>
          </button>

          <button
            onClick={() => navigate("/member/scripts")}
            className="px-4 py-2 rounded-xl border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8C241E]" />
            <span>Script Vault</span>
          </button>
        </div>
      </section>

      {/* PINNED REHEARSAL PLAYBOOKS */}
      {pinnedScripts.length > 0 && (
        <section className="space-y-2.5 w-full">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C5A54]">
              Featured Playbooks
            </span>
            <span className="text-[10px] font-mono uppercase text-[#8C5A54]">
              {pinnedScripts.length} Pinned
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
            {pinnedScripts.map((script) => (
              <div
                key={script.id}
                onClick={() => navigate(`/ai-rehearsal/${script.id}`)}
                className="bg-[#FAF2EE] border border-[#DCBAB2] hover:border-[#8C241E]/60 rounded-2xl p-4 hover:shadow-sm transition-all flex flex-col justify-between space-y-3 group cursor-pointer text-left"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase text-[#8C241E] bg-[#EEDBD5] px-2 py-0.5 rounded-full border border-[#D5AAA2]">
                      {script.genre || "Drama"}
                    </span>
                    <button
                      onClick={(e) => togglePinScript(script.id, e)}
                      className="text-[#8C241E] p-0.5"
                      title="Unpin Script"
                    >
                      <Pin className="w-3.5 h-3.5 fill-[#8C241E]" />
                    </button>
                  </div>

                  <h3 className="font-serif text-[15px] text-[#2A1816] group-hover:text-[#8C241E] transition-colors leading-snug font-normal">
                    {script.title}
                  </h3>
                  <p className="text-[11px] font-serif italic text-[#6E4742]">
                    by {script.playwright}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#DCBAB2]/70 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#8C5A54]">
                    {script.rolesCount || `${script.charactersCount || 6} Roles`}
                  </span>
                  <span className="font-bold uppercase text-[#8C241E] flex items-center gap-1">
                    <span>Rehearse</span>
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAIN 2-COLUMN STUDIO LAYOUT: VAULT ROSTER (LEFT) & CUSTOM PARSER (RIGHT) */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 w-full items-start">
        
        {/* LEFT: SCRIPT VAULT SELECTION ROSTER */}
        <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-5 space-y-4 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DCBAB2]/70 pb-3">
            <div className="space-y-0.5">
              <h2 className="font-serif text-lg text-[#2A1816] font-normal flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8C241E]" />
                <span>Script Repertoire</span>
              </h2>
              <p className="text-[11px] font-mono text-[#8C5A54]">
                {filteredScripts.length} verified scripts · ready for live rehearsal
              </p>
            </div>

            {/* Themed Search Bar */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#8C5A54]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter scripts..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#E8D6CF]/70 border border-[#D5AAA2] text-xs font-mono text-[#2A1816] placeholder:text-[#8C5A54] focus:outline-none focus:border-[#8C241E]"
              />
            </div>
          </div>

          {/* SCRIPT LISTING */}
          <div className="space-y-2">
            {filteredScripts.map((script) => {
              const isPinned = pinnedScriptIds.includes(script.id);

              return (
                <div
                  key={script.id}
                  className="rounded-xl border border-[#DCBAB2] bg-[#FAF2EE] hover:bg-[#F5EAE6] hover:border-[#8C241E]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3.5 py-2.5 shadow-2xs group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={(e) => togglePinScript(script.id, e)}
                      className="p-1 rounded-full text-[#8C5A54] hover:text-[#8C241E] transition-colors cursor-pointer shrink-0"
                      title={isPinned ? "Unpin script" : "Pin script to top"}
                    >
                      <Pin className={`w-4 h-4 ${isPinned ? "fill-[#8C241E] text-[#8C241E]" : ""}`} />
                    </button>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0 leading-none">
                        <span className="text-[9px] font-mono font-bold uppercase text-[#8C241E] bg-[#EEDBD5] px-2 py-0.5 rounded-full border border-[#D5AAA2] whitespace-nowrap">
                          {script.genre || "Drama"}
                        </span>
                        {script.language && (
                          <span className="text-[9px] font-mono text-[#8C5A54] truncate">
                            {script.language}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-1.5 min-w-0 leading-tight">
                        <h3 className="font-serif text-[15px] md:text-base text-[#2A1816] group-hover:text-[#8C241E] transition-colors font-normal truncate">
                          {script.title}
                        </h3>
                        <span className="font-serif text-[11px] italic text-[#6E4742] truncate shrink">
                          · {script.playwright}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <div className="font-mono text-[9px] text-[#8C5A54] hidden md:flex flex-col items-end gap-0.5 leading-tight whitespace-nowrap border-r border-[#DCBAB2]/80 pr-2.5">
                      <span className="font-bold text-[#2A1816]">{script.rolesCount || `${script.charactersCount || 6} Roles`}</span>
                      <span>{script.pages ? `${script.pages} Pages` : "3 Acts"}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/ai-rehearsal/${script.id}`)}
                      className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-3 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs border border-[#A6352F]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-[#FFD0CC]" />
                      <span>Rehearse</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredScripts.length === 0 && (
              <div className="text-center py-12 text-xs font-mono text-[#6E4742] bg-[#F5EAE6] rounded-2xl border border-dashed border-[#DCBAB2]">
                No scripts found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: CUSTOM MANUSCRIPT PARSER STUDIO (SELF-CONTAINED) */}
        <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-5 space-y-4 shadow-xs">
          {scene && !activeScript ? (
            /* PARSED SETUP VIEW INSIDE THE SAME CARD */
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-[#DCBAB2]/70 pb-3">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[9px] font-mono uppercase font-bold tracking-widest text-[#8C5A54]">
                    Scene Parsed & Ready
                  </span>
                  <h2 className="font-serif text-lg text-[#2A1816] tracking-tight truncate font-normal">
                    {scene.title}
                  </h2>
                  <p className="text-[11px] font-mono text-[#6E4742]">
                    {scene.characters.length} Roles • {scene.turns.length} Lines
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setScene(null)}
                  className="px-2.5 py-1 rounded-lg border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-[10px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  title="Edit script text"
                >
                  Edit Text
                </button>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto custom-scrollbar pr-1">
                {scene.characters.map((character: any) => {
                  const isHuman = assignments[character.name] === "human";
                  const currentVoice = voicePreferences[character.name] || "female";

                  return (
                    <div
                      key={character.name}
                      className="p-3 rounded-xl border border-[#DCBAB2] bg-[#F5EAE6] space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-serif font-bold text-[#2A1816] truncate">
                          {character.name}
                        </span>
                        <span className="text-[9px] font-mono uppercase text-[#8C5A54] font-semibold">
                          {isHuman ? "Actor (You)" : `AI (${currentVoice})`}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#E8D6CF]/70 rounded-lg border border-[#D5AAA2]/70">
                        <button
                          type="button"
                          onClick={() => setAssignments({ ...assignments, [character.name]: "human" })}
                          className={`py-1 px-1.5 rounded-md text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                            isHuman ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs" : "text-[#5C3B37] hover:text-[#2A1816]"
                          }`}
                        >
                          Actor (You)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAssignments({ ...assignments, [character.name]: "ai" })}
                          className={`py-1 px-1.5 rounded-md text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                            !isHuman ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs" : "text-[#5C3B37] hover:text-[#2A1816]"
                          }`}
                        >
                          AI Voice
                        </button>
                      </div>

                      {!isHuman && (
                        <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#FAF2EE] rounded-lg border border-[#DCBAB2]/60">
                          <button
                            type="button"
                            onClick={() => setVoicePreferences({ ...voicePreferences, [character.name]: "female" })}
                            className={`py-0.5 px-1.5 rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                              currentVoice === "female" ? "bg-[#5C3B37] text-[#FAF2EE]" : "text-[#8C5A54] hover:text-[#2A1816]"
                            }`}
                          >
                            Female
                          </button>
                          <button
                            type="button"
                            onClick={() => setVoicePreferences({ ...voicePreferences, [character.name]: "male" })}
                            className={`py-0.5 px-1.5 rounded text-[9px] font-mono font-bold uppercase transition-all cursor-pointer ${
                              currentVoice === "male" ? "bg-[#5C3B37] text-[#FAF2EE]" : "text-[#8C5A54] hover:text-[#2A1816]"
                            }`}
                          >
                            Male
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={startSession}
                className="w-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest border border-[#A6352F] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current text-[#FFD0CC]" />
                <span>Start Rehearsal</span>
              </button>
            </div>
          ) : (
            /* INPUT FORM VIEW INSIDE THE CARD */
            <div className="space-y-3.5">
              <div className="space-y-0.5 border-b border-[#DCBAB2]/70 pb-3">
                <h2 className="font-serif text-lg font-normal text-[#2A1816] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#8C241E]" />
                  <span>Custom Scene Importer</span>
                </h2>
                <p className="text-[11px] font-mono text-[#8C5A54]">
                  Paste custom dialogue or scene draft
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-[#8C5A54] block mb-1">
                    Scene Title
                  </label>
                  <input
                    value={inlineTitle}
                    onChange={(e) => setInlineTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E8D6CF]/70 border border-[#D5AAA2] text-xs font-mono text-[#2A1816] focus:outline-none focus:border-[#8C241E]"
                    placeholder="e.g. Midnight Act II Duel"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase font-bold text-[#8C5A54] block mb-1">
                    Dialogue Lines (Format: Character: Line)
                  </label>
                  <textarea
                    value={inlineScript}
                    onChange={(e) => setInlineScript(e.target.value)}
                    rows={8}
                    className="w-full rounded-xl border border-[#DCBAB2] bg-[#F5EAE6] p-3 font-mono text-xs text-[#2A1816] leading-relaxed resize-none focus:outline-none focus:border-[#8C241E] custom-scrollbar"
                    placeholder="John: Hello Mary&#10;Mary: Good day John..."
                  />
                </div>

                <button
                  onClick={() => parseScript()}
                  disabled={parsing}
                  className="w-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border border-[#A6352F] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {parsing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FFD0CC]" />
                      <span>Extracting Characters...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5 text-[#FFD0CC]" />
                      <span>Parse & Setup Rehearsal</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="bg-rose-100 border border-rose-300 text-rose-900 rounded-xl p-2.5 text-xs font-mono flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </section>

    </div>
  );
}
