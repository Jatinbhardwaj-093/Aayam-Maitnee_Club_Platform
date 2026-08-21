// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Headphones,
  Layers,
  Loader2,
  Mic,
  Pin,
  Play,
  Radio,
  RotateCcw,
  Search,
  Settings2,
  Sparkles,
  Square,
  Users,
  Volume2,
  Wand2,
  FileText,
  Edit3
} from "lucide-react";

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

Mary: I'm doing well, John. Ready for our opening scene?

John: The stage is set. Let's deliver our best performance tonight.

Mary: Every line is memorized. Let the drama begin.`;

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

// Premium voice scorer to select natural human voices across browsers as fallback
const rankVoice = (voice: SpeechSynthesisVoice, preference: VoicePreference): number => {
  const name = voice.name.toLowerCase();
  const lang = (voice.lang || "").toLowerCase();
  let score = 0;

  if (lang.startsWith("en")) score += 40;
  if (lang.includes("en-us") || lang.includes("en-gb") || lang.includes("en-in") || lang.includes("en-au")) score += 20;

  if (name.includes("natural") || name.includes("online (natural)")) score += 150;
  if (name.includes("premium") || name.includes("enhanced")) score += 120;
  if (name.includes("neural") || name.includes("google")) score += 90;

  if (
    name.includes("compact") ||
    name.includes("espeak") ||
    name.includes("whisper") ||
    name.includes("zarvox") ||
    name.includes("trinoids") ||
    name.includes("cellos")
  ) {
    score -= 200;
  }

  if (preference === "female") {
    if (
      name.includes("female") ||
      name.includes("woman") ||
      name.includes("aria") ||
      name.includes("jenny") ||
      name.includes("samantha") ||
      name.includes("serena") ||
      name.includes("karen") ||
      name.includes("moira") ||
      name.includes("tessa") ||
      name.includes("victoria") ||
      name.includes("ava")
    ) {
      score += 70;
    }
    if (name.includes("male") && !name.includes("female")) {
      score -= 100;
    }
  }

  if (preference === "male") {
    if (
      (name.includes("male") && !name.includes("female")) ||
      name.includes("man") ||
      name.includes("guy") ||
      name.includes("ryan") ||
      name.includes("daniel") ||
      name.includes("oliver") ||
      name.includes("alex") ||
      name.includes("david") ||
      name.includes("mark")
    ) {
      score += 70;
    }
    if (name.includes("female") || name.includes("woman")) {
      score -= 100;
    }
  }

  return score;
};

const selectBrowserVoice = (voices: SpeechSynthesisVoice[], preference: VoicePreference = "female") => {
  if (!voices || voices.length === 0) return null;
  const sorted = [...voices].sort((a, b) => rankVoice(b, preference) - rankVoice(a, preference));
  return sorted[0] || voices[0] || null;
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
  const [showCastConfig, setShowCastConfig] = useState(false);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const aiTimerRef = useRef<number | null>(null);
  const aiPreparingRef = useRef(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
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
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
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

  const parseScript = async (targetScript?: ScriptItem, customTitle?: string, customText?: string) => {
    setParsing(true);
    setError("");
    try {
      const payload = targetScript
        ? {
            script_id: targetScript.id,
            user_email: activeUser?.email || "",
          }
        : {
            title: customTitle ?? inlineTitle,
            script: customText ?? inlineScript,
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
      if (data.scene) {
        setScene(data.scene);
        const defaultAssignments: Record<string, Assignment> = {};
        const defaultVoices: Record<string, VoicePreference> = {};
        (data.scene.characters || []).forEach((c: any, index: number) => {
          defaultAssignments[c.name] = index === 0 ? "human" : "ai";
          defaultVoices[c.name] = index % 2 === 0 ? "female" : "male";
        });
        setAssignments(defaultAssignments);
        setVoicePreferences(defaultVoices);
      }
    } catch (err: any) {
      setError(err.message || "Network error while parsing script.");
    } finally {
      setParsing(false);
    }
  };

  const parseDemoScript = () => {
    setInlineTitle("John & Mary Rehearsal Scene");
    setInlineScript(demoScript);
    parseScript(undefined, "John & Mary Rehearsal Scene", demoScript);
  };

  const startSession = async () => {
    setError("");
    setSessionStartedAt(Date.now());
    setAudioStatus("Initializing Roleplay");
    try {
      const payload = activeScript
        ? {
            script_id: activeScript.id,
            assignments,
            voice_preferences: voicePreferences,
            user_email: activeUser?.email || "anonymous@aayam.iitm",
          }
        : {
            title: inlineTitle,
            script: inlineScript,
            assignments,
            voice_preferences: voicePreferences,
            user_email: activeUser?.email || "anonymous@aayam.iitm",
          };

      const res = await fetch(`${baseUrl}/api/rehearsal/roleplay/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start rehearsal session.");
        return;
      }
      if (data.session) {
        applySessionState(data.session);
        if (data.session.scene) {
          setScene(data.session.scene);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to rehearsal server.");
    }
  };

  const stopSession = async () => {
    if (!session?.session_id) return;
    stopListening();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
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
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
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
      setError("Browser speech recognition unavailable. Use Chrome, Edge, or click 'Advance Cue'.");
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

  const fallbackBrowserSpeak = (nextSession: any, payload: any, words: any[]) => {
    if (!("speechSynthesis" in window)) {
      setError("Audio synthesis unavailable. Advancing cue automatically.");
      window.setTimeout(() => completeAiTurn(nextSession.session_id), 1400);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(payload.text);
    const pref: VoicePreference =
      (payload.voice_preference as VoicePreference) ||
      voicePreferences[nextSession.current_speaker] ||
      voicePreferences[payload.character] ||
      "female";

    if (pref === "female") {
      utterance.rate = 0.94;
      utterance.pitch = 1.0;
    } else {
      utterance.rate = 0.92;
      utterance.pitch = 0.96;
    }
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = selectBrowserVoice(voices, pref);
    if (voice) {
      utterance.voice = voice;
    }

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

  // High-fidelity neural voice synthesizer with Edge-TTS studio audio stream
  const speakAiTurn = (nextSession: any) => {
    const payload = nextSession.ai_payload;
    if (!payload?.text) {
      completeAiTurn(nextSession.session_id);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setAiWordIndex(-1);
    setAudioStatus("AI Partner Speaking");

    const words = payload.words || [];

    // 1. Play Studio-Grade Edge-TTS Neural Audio Stream
    if (payload.audio_url) {
      try {
        const audio = new Audio(payload.audio_url);
        audioPlayerRef.current = audio;

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

        audio.onended = () => {
          if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
          setAiWordIndex(-1);
          setAudioStatus("AI Turn Complete");
          audioPlayerRef.current = null;
          completeAiTurn(nextSession.session_id);
        };

        audio.onerror = (e) => {
          console.warn("Edge-TTS audio stream error, falling back to browser speech", e);
          if (aiTimerRef.current) window.clearInterval(aiTimerRef.current);
          fallbackBrowserSpeak(nextSession, payload, words);
        };

        audio.play().catch((err) => {
          console.warn("Audio autoplay prevented, falling back:", err);
          fallbackBrowserSpeak(nextSession, payload, words);
        });
        return;
      } catch (err) {
        console.warn("Audio initialization error:", err);
      }
    }

    // 2. Fallback to Browser Speech Synthesis if edge-tts not returned
    fallbackBrowserSpeak(nextSession, payload, words);
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

  const displayScene = session?.scene || scene;
  const activeTurn = session?.currentTurn || displayScene?.turns?.[0] || null;
  const currentTitle = activeScript?.title || displayScene?.title || inlineTitle;
  const isHumanTurn = session?.speaker_type === "human";
  const isAiTurn = session?.speaker_type === "ai";
  const progressPercent = session?.scene?.turns?.length
    ? Math.round(((session.current_turn + 1) / session.scene.turns.length) * 100)
    : 0;

  // =========================================================================
  // VIEW 1: MINIMALIST POETIC THEATRE REHEARSAL STAGE
  // =========================================================================
  if (((scriptId && activeScript) || session) && displayScene) {
    return (
      <div className="space-y-6 w-full max-w-4xl mx-auto pb-24 font-sans text-[#5C3B37] transition-all">
        
        {/* MINIMALIST TOP NAV & SCENE HEADER */}
        <header className="flex items-center justify-between gap-4 px-2">
          <button
            onClick={returnToStudio}
            className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#8C5A54] hover:text-[#8C241E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Repertoire</span>
          </button>

          <div className="text-right">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
              {session?.scene?.turns?.length
                ? `Cue ${session.current_turn + 1} of ${session.scene.turns.length}`
                : `${displayScene?.turns?.length || 0} Dialogue Cues`}
            </span>
          </div>
        </header>

        {/* PROGRESS HAIRLINE */}
        <div className="h-1 w-full rounded-full bg-[#DCBAB2]/40 overflow-hidden">
          <div
            className="h-full bg-[#8C241E] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* MAIN PROSCENIUM STAGE CARD */}
        <section className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[3rem] p-8 sm:p-12 md:p-14 shadow-xs relative text-center space-y-8">
          
          {/* SCENE & SPEAKER BANNER */}
          <div className="space-y-2">
            <h1 className="font-serif text-xl sm:text-2xl text-[#2A1816] font-normal tracking-tight">
              {currentTitle}
            </h1>
            
            {activeTurn && (
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EEDBD5] border border-[#D5AAA2] text-xs font-mono font-bold uppercase tracking-widest text-[#8C241E] shadow-2xs">
                  <span>{activeTurn.character}</span>
                  <span className="text-[#8C5A54]/60">•</span>
                  <span className="text-[#8C5A54]">
                    {assignments[activeTurn.character] === "human" ? "Your Cue (Actor)" : "AI Partner"}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* SPOKEN SCRIPT TELEPROMPTER */}
          {activeTurn ? (
            <div className="space-y-6">
              <div className="py-4 md:py-6 min-h-[140px] flex items-center justify-center">
                <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2A1816] leading-relaxed md:leading-[1.7] max-w-2xl mx-auto font-normal">
                  {(activeTurn.words || activeTurn.text?.split(/\s+/) || []).map((word: string, index: number) => {
                    const activeIndex = isHumanTurn ? humanWordIndex : aiWordIndex;
                    const spoken = isHumanTurn ? spokenIndices.includes(index) : index < aiWordIndex;
                    const active = session && index === activeIndex;

                    return (
                      <span
                        key={`${word}-${index}`}
                        className={`inline-block mx-1 transition-all duration-150 ${
                          active
                            ? "text-[#8C241E] font-medium underline decoration-2 underline-offset-6 decoration-[#8C241E]"
                            : spoken
                              ? "text-[#8C241E] underline decoration-1 underline-offset-4 decoration-[#8C241E]/40"
                              : "text-[#2A1816]/90"
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </p>
              </div>

              {/* VOICE FEEDBACK PILL (HUMAN / AI) */}
              <div className="pt-2">
                {isHumanTurn ? (
                  <div className="space-y-3 max-w-md mx-auto">
                    <p className="font-serif italic text-sm text-[#5C3B37] bg-[#F5EAE6] px-4 py-2.5 rounded-2xl border border-[#DCBAB2]/70 min-h-[42px] flex items-center justify-center">
                      "{transcript || "Speak line into microphone..."}"
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={startListening}
                        className="px-3.5 py-1.5 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#8C241E] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-[#D5AAA2]"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Listen Again</span>
                      </button>

                      <button
                        onClick={() => sendTranscript(activeTurn.text, true, 1200)}
                        className="px-3.5 py-1.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-[#A6352F] shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-[#FFD0CC]" />
                        <span>Advance Cue</span>
                      </button>
                    </div>
                  </div>
                ) : isAiTurn ? (
                  <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#8C241E] bg-[#EEDBD5]/60 px-4 py-1.5 rounded-full border border-[#D5AAA2]">
                    <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#8C241E]" />
                    <span>AI Studio Neural Voice Speaking...</span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-normal text-[#2A1816]">Scene Concluded</h2>
              <button
                onClick={returnToStudio}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 border border-[#A6352F] cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#FFD0CC]" /> Return to Repertoire
              </button>
            </div>
          )}

          {error && (
            <div className="bg-rose-100 border border-rose-300 text-rose-900 rounded-2xl p-3 text-xs font-mono max-w-md mx-auto flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* FLOATING THEATRE CONTROLS DOCK */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {!session || session.scene_status !== "active" ? (
            <button
              onClick={startSession}
              className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-8 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest border border-[#A6352F] shadow-md shadow-[#8C241E]/20 flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
            >
              <Play className="w-4 h-4 fill-current text-[#FFD0CC]" />
              <span>Start Live Rehearsal</span>
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="bg-rose-900 hover:bg-rose-950 text-[#FDF8F7] px-8 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest border border-rose-950 shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Pause Rehearsal</span>
            </button>
          )}

          <button
            onClick={() => setShowCastConfig(!showCastConfig)}
            className="px-5 py-3.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Users className="w-3.5 h-3.5 text-[#8C241E]" />
            <span>Cast Roles</span>
            {showCastConfig ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setSession(null);
              if (activeScript) parseScript(activeScript);
              else parseScript();
            }}
            className="w-10 h-10 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
            title="Reset scene to beginning"
          >
            <RotateCcw className="w-4 h-4 text-[#8C241E]" />
          </button>
        </div>

        {/* COLLAPSIBLE MINIMAL CAST & VOICE SETTINGS */}
        {showCastConfig && (
          <section className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-3xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DCBAB2]/70 pb-3">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8C5A54]">
                Character Role Assignments & Voice Preference
              </span>
              <span className="text-[10px] font-mono text-[#8C5A54]">
                {displayScene.characters?.length || 0} Roles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(displayScene.characters || []).map((character: any) => {
                const isHuman = assignments[character.name] === "human";
                const isAi = assignments[character.name] === "ai";
                const currentVoice = voicePreferences[character.name] || "female";

                return (
                  <div
                    key={character.name}
                    className="p-3 rounded-2xl bg-[#F5EAE6] border border-[#DCBAB2] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#2A1816] truncate">
                        {character.name}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-[#8C5A54]">
                        {isHuman ? "Actor" : `AI (${currentVoice})`}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#E8D6CF]/70 rounded-xl border border-[#D5AAA2]/60">
                      <button
                        type="button"
                        onClick={() => setAssignments({ ...assignments, [character.name]: "human" })}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                          isHuman ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs" : "text-[#5C3B37] hover:text-[#2A1816]"
                        }`}
                      >
                        Actor (You)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAssignments({ ...assignments, [character.name]: "ai" })}
                        className={`py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                          isAi ? "bg-[#8C241E] text-[#FDF8F7] shadow-xs" : "text-[#5C3B37] hover:text-[#2A1816]"
                        }`}
                      >
                        AI Voice
                      </button>
                    </div>

                    {isAi && (
                      <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#FAF2EE] rounded-lg border border-[#DCBAB2]/70">
                        <button
                          type="button"
                          onClick={() => setVoicePreferences({ ...voicePreferences, [character.name]: "female" })}
                          className={`py-0.5 px-1.5 rounded text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer ${
                            currentVoice === "female" ? "bg-[#5C3B37] text-[#FAF2EE]" : "text-[#8C5A54] hover:text-[#2A1816]"
                          }`}
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() => setVoicePreferences({ ...voicePreferences, [character.name]: "male" })}
                          className={`py-0.5 px-1.5 rounded text-[9px] font-mono font-bold uppercase transition-colors cursor-pointer ${
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
          </section>
        )}

        {/* CLEAN DIALOGUE TIMELINE QUEUE */}
        {displayScene?.turns && displayScene.turns.length > 0 && (
          <section className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#DCBAB2]/70 pb-3">
              <h3 className="font-serif text-base font-normal text-[#2A1816]">Script Dialogue Flow</h3>
              <span className="text-[10px] font-mono uppercase text-[#8C5A54]">
                {displayScene.turns.length} Lines
              </span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
              {displayScene.turns.map((turn: any, index: number) => {
                const isCurrent = session ? session.current_turn === index : index === 0;
                const isPast = session ? session.current_turn > index : false;
                const isHuman = assignments[turn.character] === "human";

                return (
                  <div
                    key={turn.id || index}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? "bg-[#F5EAE6] border-[#8C241E] shadow-2xs"
                        : isPast
                          ? "bg-[#FAF2EE]/50 border-[#DCBAB2]/40 opacity-50"
                          : "bg-[#FAF2EE] border-[#DCBAB2]/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-xs text-[#2A1816]">
                          {turn.character}
                        </span>
                        <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.2 rounded-full border ${
                          isHuman ? "bg-amber-100 text-amber-950 border-amber-300" : "bg-[#EEDBD5] text-[#8C241E] border-[#D5AAA2]"
                        }`}>
                          {isHuman ? "Actor" : "AI"}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-[#8C5A54]">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="font-serif text-xs text-[#5C3B37] leading-relaxed">
                      "{turn.text}"
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: REHEARSAL STUDIO CATALOG & SETUP
  // =========================================================================
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
            Select a play from the repertoire or import a custom scene to rehearse with natural Edge-TTS AI roleplay.
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
                    {scene.characters?.length || 0} Roles • {scene.turns?.length || 0} Lines
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
                {(scene.characters || []).map((character: any) => {
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
