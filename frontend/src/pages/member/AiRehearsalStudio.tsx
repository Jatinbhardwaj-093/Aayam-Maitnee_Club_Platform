// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Loader2,
  Mic,
  Pin,
  Play,
  RotateCcw,
  Search,
  Square,
  Volume2,
  Wand2,
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
}

type Assignment = "human" | "ai";

const demoScript = `John: Hello Mary, how are you?

Mary: I'm doing well, John.

John: Are you ready for the performance?

Mary: Yes, I'm completely ready.`;

const normalize = (word: string) => word.toLowerCase().replace(/[^a-z0-9']/g, "");

const wordSpans = (text: string) => text.match(/[\w']+|[^\s\w]/g) || [];

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
    return saved ? JSON.parse(saved) : [1, 2, 6];
  });

  const [inlineTitle, setInlineTitle] = useState("John and Mary Rehearsal");
  const [inlineScript, setInlineScript] = useState(demoScript);
  const [scene, setScene] = useState<any | null>(null);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>({});
  const [session, setSession] = useState<any | null>(null);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [error, setError] = useState("");
  const [aiWordIndex, setAiWordIndex] = useState(-1);
  const [humanWordIndex, setHumanWordIndex] = useState(-1);
  const [spokenIndices, setSpokenIndices] = useState<number[]>([]);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [audioStatus, setAudioStatus] = useState("Idle");
  const [parsing, setParsing] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const aiTimerRef = useRef<number | null>(null);
  const aiPreparingRef = useRef(false);
  const lastTranscriptRef = useRef("");
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
    setAudioStatus("Idle");
  };

  const returnToStudio = () => {
    clearRehearsalState();
    navigate("/ai-rehearsal", { replace: false });
  };

  useEffect(() => {
    localStorage.setItem("aayam_pinned_scripts", JSON.stringify(pinnedScriptIds));
  }, [pinnedScriptIds]);

  useEffect(() => {
    if (!scriptId) {
      if (activeScript && location.pathname === "/ai-rehearsal") {
        clearRehearsalState();
      } else {
        setActiveScript(null);
      }
      return;
    }
    const email = activeUser?.email || "";
    fetch(`${baseUrl}/api/scripts?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        const combined = [...(data.public || []), ...(data.drafts || [])];
        const unique = Array.from(new Map(combined.map((item: ScriptItem) => [item.id, item])).values());
        setAllScripts(unique);
        if (scriptId) {
          const found = unique.find((script: ScriptItem) => script.id.toString() === scriptId);
          if (found) {
            setActiveScript(found);
            parseScript(found);
          }
        }
      })
      .catch(() => setError("Could not load scripts from the rehearsal vault."));
  }, [scriptId, activeUser, location.pathname]);

  useEffect(() => {
    sessionRef.current = session;
    activeTurnRef.current = session?.currentTurn || null;
  }, [session]);

  useEffect(() => {
    if (!session?.currentTurn) return;
    setTranscript("");
    setHumanWordIndex(-1);
    setSpokenIndices([]);
    setAiWordIndex(-1);

    if (session.status === "HUMAN_TURN") {
      trace("MIC START REQUESTED", {
        turn: session.currentTurn.id,
        speaker: session.current_speaker,
      });
      if (!micBlockedRef.current) {
        startListening();
      } else {
        setAudioStatus("Microphone unavailable; use fallback complete");
      }
    } else {
      stopListening();
    }

    if (session.status === "AI_TURN") {
      prepareAiTurn();
    }
  }, [session?.current_turn, session?.status]);

  useEffect(() => {
    if (session?.scene_status === "complete" || session?.scene_status === "stopped") {
      stopListening();
      window.speechSynthesis?.cancel();
      setAudioStatus(session.scene_status === "complete" ? "Scene complete" : "Stopped");
    }
  }, [session?.scene_status]);

  useEffect(() => {
    return () => {
      stopListening();
      window.speechSynthesis?.cancel();
      if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
    };
  }, []);

  const filteredScripts = useMemo(() => {
    return allScripts.filter((script) => {
      const haystack = `${script.title} ${script.playwright} ${script.genre}`.toLowerCase();
      return haystack.includes(searchQuery.toLowerCase());
    });
  }, [allScripts, searchQuery]);

  const pinnedScripts = useMemo(
    () => allScripts.filter((script) => pinnedScriptIds.includes(script.id)),
    [allScripts, pinnedScriptIds],
  );

  const parseScript = async (script?: ScriptItem, inlineOverride?: { title: string; script: string }) => {
    setError("");
    setParsing(true);
    stopListening();
    window.speechSynthesis?.cancel();
    setSession(null);
    sessionRef.current = null;
    activeTurnRef.current = null;
    aiPreparingRef.current = false;
    micBlockedRef.current = false;
    setAudioStatus("Parsing script");
    const payload = script
      ? { script_id: script.id }
      : { title: inlineOverride?.title || inlineTitle, script: inlineOverride?.script || inlineScript };

    try {
      const res = await fetch(`${baseUrl}/api/rehearsal/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not parse script.");
        setAudioStatus("Parse failed");
        return;
      }
      setScene(data.scene);
      setAssignments(
        Object.fromEntries(
          data.scene.characters.map((character: any, index: number) => [
            character.name,
            index === 0 ? "human" : "ai",
          ]),
        ),
      );
      setAudioStatus("Script parsed");
    } catch {
      setError("Could not reach the rehearsal parser. Make sure the Flask backend is running.");
      setAudioStatus("Backend unavailable");
    } finally {
      setParsing(false);
    }
  };

  const parseDemoScript = () => {
    const title = "John and Mary Rehearsal";
    setInlineTitle(title);
    setInlineScript(demoScript);
    parseScript(undefined, { title, script: demoScript });
  };

  const startSession = async () => {
    setError("");
    stopListening();
    window.speechSynthesis?.cancel();
    if (aiTimerRef.current) {
      window.clearInterval(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    aiPreparingRef.current = false;
    lastTranscriptRef.current = "";
    sessionRef.current = null;
    activeTurnRef.current = null;
    micBlockedRef.current = false;
    setSession(null);
    setTranscript("");
    setHumanWordIndex(-1);
    setSpokenIndices([]);
    setAiWordIndex(-1);
    setAudioStatus("Starting rehearsal");
    setSessionStartedAt(Date.now());
    const payload = activeScript
      ? { script_id: activeScript.id, assignments }
      : { title: inlineTitle, script: inlineScript, assignments };
    try {
      const res = await fetch(`${baseUrl}/api/rehearsal/roleplay/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start rehearsal.");
        setAudioStatus("Start failed");
        return;
      }
      applySessionState(data.session);
    } catch {
      setError("Could not start rehearsal. Make sure the Flask backend is running.");
      setAudioStatus("Backend unavailable");
    }
  };

  const stopSession = async () => {
    stopListening();
    window.speechSynthesis?.cancel();
    if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
    if (!session?.session_id) {
      setSession(null);
      return;
    }
    const res = await fetch(`${baseUrl}/api/rehearsal/roleplay/${session.session_id}/stop`, { method: "POST" });
    const data = await res.json();
    applySessionState(data.session);
  };

  const sendTranscript = async (text: string, isFinal: boolean, silenceMs = 0) => {
    const activeSession = sessionRef.current;
    const activeTurn = activeTurnRef.current;
    if (!activeSession?.session_id || !text.trim()) return;
    if (activeSession.speaker_type !== "human") {
      trace("IGNORED TRANSCRIPT OUTSIDE HUMAN TURN", {
        transcript: text,
        status: activeSession.status,
        speakerType: activeSession.speaker_type,
      });
      return;
    }
    trace("TRANSCRIPT SENT", {
      transcript: text,
      isFinal,
      silenceMs,
      turn: activeTurn?.id,
    });
    const res = await fetch(`${baseUrl}/api/rehearsal/roleplay/${activeSession.session_id}/transcript`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: text, is_final: isFinal, silence_ms: silenceMs }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Speech processing failed.");
      return;
    }
    const progressTurnId = data.session.last_human_turn_id || activeTurn?.id;
    const progress = data.session.human_progress?.[progressTurnId];
    if (progress) {
      setSpokenIndices(progress.matched_indices || []);
      setHumanWordIndex(progress.current_word_index ?? -1);
      trace("MATCHED WORD INDEX", {
        turn: progressTurnId,
        currentWordIndex: progress.current_word_index,
        progress: progress.progress,
        complete: progress.is_complete,
      });
    }
    if (data.session.status !== activeSession.status || data.session.current_turn !== activeSession.current_turn) {
      trace("TURN STATE UPDATED", {
        fromStatus: activeSession.status,
        toStatus: data.session.status,
        fromTurn: activeSession.current_turn,
        toTurn: data.session.current_turn,
      });
    }
    applySessionState(data.session);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      micBlockedRef.current = true;
      setError("This browser does not support live speech recognition. Use Chrome or Edge for microphone rehearsal.");
      setAudioStatus("Speech recognition unavailable");
      return;
    }
    if (recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      trace("MIC STARTED", {
        turn: activeTurnRef.current?.id,
        speaker: sessionRef.current?.current_speaker,
      });
      setListening(true);
      setAudioStatus("Listening for speech");
    };
    recognition.onerror = (event: any) => {
      trace("MIC ERROR", { error: event.error });
      setListening(false);
      if (event.error === "no-speech") {
        setAudioStatus("Waiting for speech");
        return;
      }
      const message = event.error === "not-allowed" ? "Microphone permission was denied." : "Speech recognition interrupted.";
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        micBlockedRef.current = true;
      }
      setAudioStatus(message);
      setError(message);
    };
    recognition.onend = () => {
      trace("MIC ENDED", {
        status: sessionRef.current?.status,
        speakerType: sessionRef.current?.speaker_type,
      });
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
      trace("AUDIO/SPEECH EVENT RECEIVED", {
        interim,
        finalText,
        combined,
      });
      setTranscript(combined);
      sendTranscript(combined, false);
      if (finalText) {
        lastTranscriptRef.current = `${lastTranscriptRef.current} ${finalText}`.trim();
        if (silenceTimerRef.current) window.clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = window.setTimeout(() => {
          sendTranscript(lastTranscriptRef.current, true, 1100);
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
    const res = await fetch(`${baseUrl}/api/rehearsal/roleplay/${session.session_id}/ai-turn`, { method: "POST" });
    const data = await res.json();
    aiPreparingRef.current = false;
    if (!res.ok) {
      setError(data.error || "AI turn generation failed.");
      return;
    }
    applySessionState(data.session);
    trace("AI AUDIO READY", {
      turn: data.session.ai_payload?.turn_id,
      text: data.session.ai_payload?.text,
      words: data.session.ai_payload?.words?.length,
    });
    speakAiTurn(data.session);
  };

  const speakAiTurn = (nextSession: any) => {
    const payload = nextSession.ai_payload;
    if (!payload?.text) {
      completeAiTurn(nextSession.session_id);
      return;
    }
    if (!("speechSynthesis" in window)) {
      setError("Browser audio playback is unavailable. Advancing after showing the AI line.");
      window.setTimeout(() => completeAiTurn(nextSession.session_id), 1200);
      return;
    }

    window.speechSynthesis.cancel();
    setAiWordIndex(-1);
    setAudioStatus("AI speaking");
    const utterance = new SpeechSynthesisUtterance(payload.text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((item) => item.lang.startsWith("en") || item.lang.startsWith("hi")) || voices[0];
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
      trace("AI WORD INDEX", { index: idx, charIndex: event.charIndex });
      setAiWordIndex(idx);
    };
    utterance.onend = () => {
      trace("AI AUDIO COMPLETE", { turn: payload.turn_id });
      if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
      setAiWordIndex(-1);
      setAudioStatus("AI finished");
      completeAiTurn(nextSession.session_id);
    };
    utterance.onerror = () => {
      trace("AI AUDIO ERROR", { turn: payload.turn_id });
      if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
      setError("AI audio playback failed. The session advanced to keep rehearsal moving.");
      setAudioStatus("AI audio failed");
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

  if (((scriptId && activeScript) || session) && displayScene) {
    return (
      <div className="min-h-screen bg-[#fbf8f2] text-[#466272] pb-16">
        <header className="sticky top-0 z-30 bg-white/95 border-b border-[#e6e2dd] px-4 py-3">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={returnToStudio}
                className="h-9 w-9 rounded-[8px] border border-[#cac6b9] flex items-center justify-center hover:bg-[#f7f3ee]"
                title="Back to rehearsal studio"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#635f41]">AI Drama Roleplay</p>
                <h1 className="font-serif text-xl font-bold text-[#1c1b19]">{currentTitle}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-[#8CC0EB]/25 text-[#001e2c] border border-[#8CC0EB]/50">
                {session?.status || "ASSIGN ROLES"}
              </Badge>
              {session?.scene_status === "complete" && (
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Scene complete
                </Badge>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-4">
            <section className="bg-white border border-[#e6e2dd] rounded-[8px] p-4 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#635f41]">Characters</h2>
              {displayScene.characters.map((character: any) => (
                <div key={character.name} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#1c1b19] truncate">{character.name}</p>
                    <p className="text-[11px] text-[#466272]/70 truncate">{character.description || "Scene partner"}</p>
                  </div>
                  <select
                    disabled={!!session && session.scene_status === "active"}
                    value={assignments[character.name] || "ai"}
                    onChange={(event) => setAssignments({ ...assignments, [character.name]: event.target.value as Assignment })}
                    className="h-8 rounded-[8px] border border-[#cac6b9] bg-[#fdf9f4] px-2 text-xs font-bold"
                  >
                    <option value="human">Human</option>
                    <option value="ai">AI</option>
                  </select>
                </div>
              ))}
            </section>

            <section className="bg-white border border-[#e6e2dd] rounded-[8px] p-4 space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#635f41]">Turn State</p>
                <h3 className="text-2xl font-serif font-bold text-[#1c1b19]">{activeTurn?.character || "Ready"}</h3>
                <p className="text-xs text-[#466272]/75">
                    {activeTurn ? `${session.speaker_type === "human" ? "Human speaker" : "AI scene partner"} - line ${session.current_turn + 1} of ${session.scene.turns.length}` : "Assign roles and start."}
                </p>
                <p className="text-[11px] text-[#466272]/70 mt-1">Audio: {audioStatus}</p>
              </div>
              <div className="h-2 rounded-full bg-[#e6e2dd] overflow-hidden">
                <div className="h-full bg-[#635f41]" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="flex gap-2">
                {!session || session.scene_status !== "active" ? (
                  <Button onClick={startSession} className="flex-1 bg-[#635f41] text-white hover:bg-[#4d4a32]">
                    <Play className="h-4 w-4 mr-1" /> Start
                  </Button>
                ) : (
                  <Button onClick={stopSession} variant="outline" className="flex-1 border-red-200 text-red-700 hover:bg-red-50">
                    <Square className="h-4 w-4 mr-1" /> Stop
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setSession(null);
                    if (activeScript) parseScript(activeScript);
                    else parseScript();
                  }}
                  variant="outline"
                  className="border-[#cac6b9]"
                  title="Restart setup"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </section>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-[8px] p-3 text-xs text-red-700 flex gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </aside>

          <section className="space-y-4">
            <div className="bg-white border border-[#e6e2dd] rounded-[8px] p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e2dd] pb-4 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#635f41]">Current Dialogue</p>
                  <h2 className="font-serif text-2xl font-bold text-[#1c1b19]">{activeTurn?.character || "Scene setup"}</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  {session?.status === "HUMAN_TURN" && (
                    <span className="inline-flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                      <Mic className="h-3.5 w-3.5" /> {listening ? "Listening" : "Mic ready"}
                    </span>
                  )}
                  {session?.status === "PLAYING_AI_AUDIO" && (
                    <span className="inline-flex items-center gap-2 text-[#001e2c] bg-[#8CC0EB]/20 border border-[#8CC0EB]/50 rounded-full px-3 py-1">
                      <Volume2 className="h-3.5 w-3.5" /> AI speaking
                    </span>
                  )}
                </div>
              </div>

              {activeTurn ? (
                <div className="space-y-5">
                  <div className="font-serif text-3xl sm:text-4xl leading-relaxed text-[#1c1b19]">
                    {activeTurn.words.map((word: string, index: number) => {
                      const isHuman = session.speaker_type === "human";
                      const activeIndex = isHuman ? humanWordIndex : aiWordIndex;
                      const spoken = isHuman ? spokenIndices.includes(index) : index < aiWordIndex;
                      const active = index === activeIndex;
                      return (
                        <span
                          key={`${word}-${index}`}
                          className={`inline-block mr-2 rounded-[6px] px-1 transition-colors ${
                            active
                              ? "bg-[#8CC0EB] text-[#001e2c]"
                              : spoken
                                ? "bg-emerald-50 text-emerald-800"
                                : "text-[#1c1b19]"
                          }`}
                        >
                          {word}
                        </span>
                      );
                    })}
                  </div>

                  {session.speaker_type === "human" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-4 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Live transcript</p>
                        {!speechSupported && <Badge className="bg-red-100 text-red-700">Unsupported browser</Badge>}
                      </div>
                      <p className="text-sm text-[#1c1b19] min-h-6">{transcript || "Speak the line when the mic indicator is active."}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={startListening} variant="outline" className="border-amber-300 text-amber-900">
                          <Mic className="h-4 w-4 mr-1" /> Listen
                        </Button>
                        <Button
                          onClick={() => sendTranscript(activeTurn.text, true, 1200)}
                          variant="outline"
                          className="border-amber-300 text-amber-900"
                          title="Fallback if speech recognition is unavailable"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Fallback complete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16 space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                  <h2 className="font-serif text-3xl font-bold text-[#1c1b19]">Scene Complete</h2>
                  <p className="text-sm text-[#466272]">Session ran for about {elapsedMins} minute(s).</p>
                </div>
              )}
            </div>

            <div className="bg-white border border-[#e6e2dd] rounded-[8px] p-5 space-y-3">
              <h2 className="font-serif text-lg font-bold text-[#635f41]">Parsed Script</h2>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {displayScene.turns.map((turn: any, index: number) => {
                  const current = session?.current_turn === index;
                  return (
                    <button
                      key={turn.id}
                      type="button"
                      className={`w-full text-left rounded-[8px] border p-3 transition-colors ${
                        current ? "border-[#635f41] bg-[#f4efe8]" : "border-[#e6e2dd] bg-white hover:bg-[#fdf9f4]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#635f41]">{turn.character}</span>
                        <span className="text-[10px] text-[#466272]/60">{assignments[turn.character] || turn.type}</span>
                      </div>
                      <p className="font-serif text-sm text-[#1c1b19] mt-1">{turn.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf9f4] text-[#466272] pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 space-y-6">
        <section className="bg-white border border-[#e6e2dd] rounded-[8px] p-6 sm:p-8 flex flex-col lg:flex-row justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <Badge className="bg-[#8CC0EB]/25 text-[#001e2c] border border-[#8CC0EB]/50">
              GenAI Rehearsal MVP
            </Badge>
            <h1 className="font-serif text-3xl font-bold text-[#1c1b19]">AI Drama Roleplay Studio</h1>
            <p className="text-sm leading-relaxed">
              Assign roles, rehearse against AI scene partners, and follow word-level highlighting for human and AI turns.
            </p>
          </div>
          <Button onClick={parseDemoScript} disabled={parsing} className="bg-[#635f41] text-white hover:bg-[#4d4a32] self-start">
            <Wand2 className="h-4 w-4 mr-1" /> {parsing ? "Parsing..." : "Parse Demo Script"}
          </Button>
        </section>

        {scene && !activeScript && (
          <section className="bg-white border border-[#e6e2dd] rounded-[8px] p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#635f41]">{scene.title}</h2>
                <p className="text-xs">Characters parsed: {scene.characters.map((item: any) => item.name).join(", ")}</p>
              </div>
              <Button onClick={startSession} className="bg-[#635f41] text-white hover:bg-[#4d4a32]">
                <Play className="h-4 w-4 mr-1" /> Start Demo
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {scene.characters.map((character: any) => (
                <div key={character.name} className="flex items-center justify-between border border-[#e6e2dd] rounded-[8px] p-3">
                  <span className="font-bold text-[#1c1b19]">{character.name}</span>
                  <select
                    value={assignments[character.name] || "ai"}
                    onChange={(event) => setAssignments({ ...assignments, [character.name]: event.target.value as Assignment })}
                    className="h-8 rounded-[8px] border border-[#cac6b9] bg-[#fdf9f4] px-2 text-xs font-bold"
                  >
                    <option value="human">Human</option>
                    <option value="ai">AI</option>
                  </select>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="bg-white border border-[#e6e2dd] rounded-[8px] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e6e2dd] pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#635f41] flex items-center gap-2">
                  <BookOpen className="h-5 w-5" /> Script Directory
                </h2>
                <p className="text-xs">Open a saved script or rehearse the demo scene.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#466272]/50" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Filter scripts"
                  className="pl-8 h-9 rounded-[8px] border-[#e6e2dd]"
                />
              </div>
            </div>

            {pinnedScripts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {pinnedScripts.map((script) => (
                  <button
                    key={script.id}
                    onClick={() => navigate(`/ai-rehearsal/${script.id}`)}
                    className="text-left border border-[#e6e2dd] rounded-[8px] p-4 bg-[#fdf9f4] hover:border-[#635f41]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif font-bold text-[#1c1b19]">{script.title}</h3>
                      <Pin className="h-4 w-4 text-[#635f41] fill-[#635f41]" />
                    </div>
                    <p className="text-xs text-[#466272] mt-1">{script.playwright}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e6e2dd] text-[10px] uppercase tracking-wider text-[#635f41]">
                    <th className="py-3 px-3">Pin</th>
                    <th className="py-3 px-3">Title</th>
                    <th className="py-3 px-3">Genre</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e6e2dd]/70">
                  {filteredScripts.map((script) => (
                    <tr key={script.id} className="hover:bg-[#fdf9f4]">
                      <td className="py-3 px-3">
                        <button onClick={(event) => togglePinScript(script.id, event)} title="Pin script">
                          <Pin className={`h-4 w-4 ${pinnedScriptIds.includes(script.id) ? "fill-[#635f41] text-[#635f41]" : "text-[#466272]/35"}`} />
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-serif font-bold text-[#1c1b19]">{script.title}</p>
                        <p className="text-[#466272]/70">{script.playwright}</p>
                      </td>
                      <td className="py-3 px-3">{script.genre}</td>
                      <td className="py-3 px-3 text-right">
                        <Button onClick={() => navigate(`/ai-rehearsal/${script.id}`)} className="bg-[#635f41] text-white hover:bg-[#4d4a32]">
                          Rehearse
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-[#e6e2dd] rounded-[8px] p-5 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#635f41]">Upload / Paste Script</h2>
            <Input
              value={inlineTitle}
              onChange={(event) => setInlineTitle(event.target.value)}
              className="rounded-[8px] border-[#e6e2dd]"
              placeholder="Scene title"
            />
            <textarea
              value={inlineScript}
              onChange={(event) => setInlineScript(event.target.value)}
              rows={12}
              className="w-full resize-none rounded-[8px] border border-[#e6e2dd] bg-[#fdf9f4] p-3 font-serif text-sm text-[#1c1b19] focus:outline-none focus:ring-2 focus:ring-[#635f41]/30"
            />
            <Button onClick={() => parseScript()} disabled={parsing} className="w-full bg-[#635f41] text-white hover:bg-[#4d4a32]">
              <Loader2 className={`${parsing ? "animate-spin" : "hidden"} h-4 w-4 mr-1`} /> {parsing ? "Parsing..." : "Parse Characters"}
            </Button>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-[8px] p-3 text-xs text-red-700 flex gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
