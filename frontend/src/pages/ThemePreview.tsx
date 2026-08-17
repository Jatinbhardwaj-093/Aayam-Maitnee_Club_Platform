import React, { useState } from "react";
import { 
  Sparkles, 
  Check, 
  Copy, 
  Palette, 
  Layers, 
  Play, 
  Ticket, 
  Star, 
  Users, 
  Calendar, 
  ArrowRight, 
  Code2, 
  CheckCircle2,
  Tv,
  Drama
} from "lucide-react";

interface ThemeDefinition {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  bg: string;
  surface: string;
  surfaceBorder: string;
  surfaceHover: string;
  textPrimary: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  primaryText: string;
  accent: string;
  accentBg: string;
  accentText: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardShadow: string;
  isDark: boolean;
  tailwindSnippet: string;
  cssSnippet: string;
}

const THEMES: ThemeDefinition[] = [
  {
    id: "broadway",
    name: "1. Grand Broadway",
    subtitle: "Dark Velvet & Spotlight Gold",
    tag: "Recommended for Stage & Immersion",
    bg: "#0B0C11",
    surface: "#141622",
    surfaceBorder: "#25283B",
    surfaceHover: "#1B1E30",
    textPrimary: "#F9FAFB",
    textMuted: "#94A3B8",
    primary: "#E5A93C",
    primaryHover: "#F5BA4E",
    primaryText: "#0F172A",
    accent: "#991B1B",
    accentBg: "rgba(153, 27, 27, 0.2)",
    accentText: "#FCA5A5",
    badgeBg: "rgba(229, 169, 60, 0.15)",
    badgeText: "#FCD34D",
    badgeBorder: "rgba(229, 169, 60, 0.35)",
    cardShadow: "0 10px 30px -10px rgba(0,0,0,0.7), 0 0 20px -5px rgba(229,169,60,0.15)",
    isDark: true,
    tailwindSnippet: `colors: {
  canvas: '#0B0C11',
  surface: '#141622',
  primary: '#E5A93C',
  accent: '#991B1B',
  border: '#25283B',
}`,
    cssSnippet: `:root {
  --bg-canvas: #0B0C11;
  --bg-surface: #141622;
  --primary: #E5A93C;
  --primary-foreground: #0F172A;
  --accent: #991B1B;
  --text-primary: #F9FAFB;
  --text-muted: #94A3B8;
  --border: #25283B;
}`
  },
  {
    id: "heritage",
    name: "2. Heritage Playbill",
    subtitle: "Warm Linen & Editorial Crimson",
    tag: "Literary, Classic & Timeless",
    bg: "#FBF7F0",
    surface: "#FFFFFF",
    surfaceBorder: "#E7DEC9",
    surfaceHover: "#F5EFE3",
    textPrimary: "#1C1917",
    textMuted: "#6B7280",
    primary: "#8B1515",
    primaryHover: "#A51D1D",
    primaryText: "#FFFFFF",
    accent: "#C59B27",
    accentBg: "rgba(197, 155, 39, 0.15)",
    accentText: "#854D0E",
    badgeBg: "rgba(139, 21, 21, 0.08)",
    badgeText: "#8B1515",
    badgeBorder: "rgba(139, 21, 21, 0.2)",
    cardShadow: "0 4px 20px -2px rgba(99, 95, 65, 0.12)",
    isDark: false,
    tailwindSnippet: `colors: {
  canvas: '#FBF7F0',
  surface: '#FFFFFF',
  primary: '#8B1515',
  accent: '#C59B27',
  border: '#E7DEC9',
}`,
    cssSnippet: `:root {
  --bg-canvas: #FBF7F0;
  --bg-surface: #FFFFFF;
  --primary: #8B1515;
  --primary-foreground: #FFFFFF;
  --accent: #C59B27;
  --text-primary: #1C1917;
  --text-muted: #6B7280;
  --border: #E7DEC9;
}`
  },
  {
    id: "opera",
    name: "3. Royal Opera",
    subtitle: "Emerald Velvet & Burnished Brass",
    tag: "Opulent, Classical & Royal",
    bg: "#071311",
    surface: "#0E211E",
    surfaceBorder: "#1B3B36",
    surfaceHover: "#142F2A",
    textPrimary: "#F0FDF9",
    textMuted: "#86A79F",
    primary: "#D4A373",
    primaryHover: "#E5B686",
    primaryText: "#061A17",
    accent: "#14B8A6",
    accentBg: "rgba(20, 184, 166, 0.15)",
    accentText: "#5EEAD4",
    badgeBg: "rgba(212, 163, 115, 0.15)",
    badgeText: "#FCD34D",
    badgeBorder: "rgba(212, 163, 115, 0.3)",
    cardShadow: "0 10px 30px -10px rgba(0,0,0,0.8), 0 0 20px -5px rgba(20,184,166,0.15)",
    isDark: true,
    tailwindSnippet: `colors: {
  canvas: '#071311',
  surface: '#0E211E',
  primary: '#D4A373',
  accent: '#14B8A6',
  border: '#1B3B36',
}`,
    cssSnippet: `:root {
  --bg-canvas: #071311;
  --bg-surface: #0E211E;
  --primary: #D4A373;
  --primary-foreground: #061A17;
  --accent: #14B8A6;
  --text-primary: #F0FDF9;
  --text-muted: #86A79F;
  --border: #1B3B36;
}`
  },
  {
    id: "cyber",
    name: "4. Cyber Stage",
    subtitle: "Slate & Electric Neon Gel",
    tag: "Modern, Indie & High-Energy",
    bg: "#0A0B10",
    surface: "#12141F",
    surfaceBorder: "#202438",
    surfaceHover: "#1A1D2D",
    textPrimary: "#F8FAFC",
    textMuted: "#818CF8",
    primary: "#38BDF8",
    primaryHover: "#60A5FA",
    primaryText: "#030712",
    accent: "#F43F5E",
    accentBg: "rgba(244, 63, 94, 0.15)",
    accentText: "#FDA4AF",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeText: "#7DD3FC",
    badgeBorder: "rgba(56, 189, 248, 0.3)",
    cardShadow: "0 10px 30px -10px rgba(0,0,0,0.8), 0 0 20px -5px rgba(56,189,248,0.2)",
    isDark: true,
    tailwindSnippet: `colors: {
  canvas: '#0A0B10',
  surface: '#12141F',
  primary: '#38BDF8',
  accent: '#F43F5E',
  border: '#202438',
}`,
    cssSnippet: `:root {
  --bg-canvas: #0A0B10;
  --bg-surface: #12141F;
  --primary: #38BDF8;
  --primary-foreground: #030712;
  --accent: #F43F5E;
  --text-primary: #F8FAFC;
  --text-muted: #818CF8;
  --border: #202438;
}`
  }
];

export default function ThemePreview() {
  const [selectedThemeId, setSelectedThemeId] = useState<string>("broadway");
  const [viewMode, setViewMode] = useState<"sandbox" | "grid">("sandbox");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeTheme = THEMES.find((t) => t.id === selectedThemeId) || THEMES[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const renderSampleUI = (t: ThemeDefinition) => (
    <div 
      className="p-6 md:p-8 rounded-2xl transition-all duration-300 flex flex-col gap-6"
      style={{
        backgroundColor: t.bg,
        color: t.textPrimary,
        border: `1px solid ${t.surfaceBorder}`,
        boxShadow: t.cardShadow
      }}
    >
      {/* Top Banner / Spotlight Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: t.surfaceBorder }}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2"
            style={{ backgroundColor: t.badgeBg, color: t.badgeText, border: `1px solid ${t.badgeBorder}` }}>
            <Sparkles className="w-3.5 h-3.5" />
            Season 2026 Production Showcase
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight" style={{ color: t.textPrimary }}>
            The Phantom of the Opera
          </h2>
          <p className="text-sm mt-1" style={{ color: t.textMuted }}>
            Auditorium Stage A • Opening Night Friday • Directed by Elena Vance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-md"
            style={{ backgroundColor: t.primary, color: t.primaryText }}
          >
            <Ticket className="w-4 h-4" />
            Book Tickets
          </button>
          <button 
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors flex items-center gap-2"
            style={{ borderColor: t.surfaceBorder, color: t.textPrimary, backgroundColor: t.surface }}
          >
            <Play className="w-4 h-4" />
            Watch Trailer
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Rehearsal Progress */}
        <div 
          className="p-5 rounded-xl border transition-all"
          style={{ backgroundColor: t.surface, borderColor: t.surfaceBorder }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: t.textMuted }}>
              Script Progress
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: t.badgeBg, color: t.badgeText }}
            >
              Act II Rehearsal
            </span>
          </div>
          <div className="text-2xl font-bold font-serif" style={{ color: t.textPrimary }}>
            Scene 4: The Masquerade
          </div>
          <p className="text-xs mt-2 line-clamp-2" style={{ color: t.textMuted }}>
            "Flash of crimson, silence across the ballroom as the masquerade masked guest arrives..."
          </p>
          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: t.surfaceBorder }}>
            <span style={{ color: t.textMuted }}>Line Accuracy</span>
            <span className="font-semibold" style={{ color: t.primary }}>94.8% AI Score</span>
          </div>
        </div>

        {/* Card 2: Casting & Audition Call */}
        <div 
          className="p-5 rounded-xl border transition-all"
          style={{ backgroundColor: t.surface, borderColor: t.surfaceBorder }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: t.textMuted }}>
              Casting Status
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: t.accentBg, color: t.accentText }}
            >
              Open Call (2 Days Left)
            </span>
          </div>
          <div className="text-2xl font-bold font-serif" style={{ color: t.textPrimary }}>
            Lead Tenor Role
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: t.textMuted }}>
            <Users className="w-3.5 h-3.5" />
            <span>18 Applicants Auditioned</span>
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: t.surfaceBorder }}>
            <span style={{ color: t.textMuted }}>Callbacks</span>
            <span className="font-semibold" style={{ color: t.textPrimary }}>March 14, 6:00 PM</span>
          </div>
        </div>

        {/* Card 3: Backstage & Metrics */}
        <div 
          className="p-5 rounded-xl border transition-all"
          style={{ backgroundColor: t.surface, borderColor: t.surfaceBorder }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: t.textMuted }}>
              Box Office Live
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: t.primary }}>
              <Star className="w-3 h-3 fill-current" />
              <span>4.9 / 5.0</span>
            </span>
          </div>
          <div className="text-2xl font-bold font-serif" style={{ color: t.textPrimary }}>
            842 / 900 Seats
          </div>
          <div className="w-full bg-black/20 rounded-full h-2 mt-3 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "93%", backgroundColor: t.primary }} />
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: t.surfaceBorder }}>
            <span style={{ color: t.textMuted }}>VIP Box Pass</span>
            <span className="font-semibold" style={{ color: t.accentText }}>Almost Sold Out</span>
          </div>
        </div>
      </div>

      {/* Interactive Dialogue / Script Preview Box */}
      <div 
        className="p-4 rounded-xl border flex flex-col gap-2 text-xs font-mono"
        style={{ backgroundColor: t.surface, borderColor: t.surfaceBorder }}
      >
        <div className="flex items-center justify-between text-xs pb-2 border-b" style={{ borderColor: t.surfaceBorder }}>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.primary }} />
            <span className="font-semibold tracking-wide" style={{ color: t.textPrimary }}>STAGE SCRIPT: ACT 1, SCENE 2</span>
          </div>
          <span style={{ color: t.textMuted }}>VOICE REHEARSAL READY</span>
        </div>
        <div className="flex gap-3 pt-2">
          <span className="font-bold shrink-0" style={{ color: t.primary }}>[RAOUL]:</span>
          <span style={{ color: t.textPrimary }}>"No more talk of darkness, forget these wide-eyed fears. I'm here, nothing can harm you."</span>
        </div>
        <div className="flex gap-3">
          <span className="font-bold shrink-0" style={{ color: t.accentText }}>[CHRISTINE]:</span>
          <span style={{ color: t.textMuted }}>"Say you'll share with me one love, one lifetime. Lead me, save me from my solitude."</span>
        </div>
      </div>

      {/* Color Hex Swatches */}
      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold mr-1" style={{ color: t.textMuted }}>Palette:</span>
        {[
          { label: "BG", hex: t.bg },
          { label: "Surface", hex: t.surface },
          { label: "Primary", hex: t.primary },
          { label: "Accent", hex: t.accent },
          { label: "Border", hex: t.surfaceBorder },
        ].map((swatch) => (
          <button
            key={swatch.label}
            onClick={() => handleCopy(swatch.hex, `${t.id}-${swatch.label}`)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-mono transition-opacity hover:opacity-80 active:scale-95"
            style={{ backgroundColor: t.surface, borderColor: t.surfaceBorder, color: t.textPrimary }}
            title="Click to copy hex"
          >
            <div className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: swatch.hex }} />
            <span>{swatch.label}: {swatch.hex}</span>
            {copiedCode === `${t.id}-${swatch.label}` ? (
              <Check className="w-3 h-3 text-green-400 ml-1" />
            ) : (
              <Copy className="w-3 h-3 opacity-50 ml-1" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold tracking-wide uppercase">
              <Drama className="w-5 h-5" />
              <span>Theme Upgrade Explorer</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mt-1">
              Frontend Theme Showcase
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Test and inspect curated color palettes designed for theatre, script vault, and rehearsal studio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("sandbox")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === "sandbox" ? "bg-neutral-800 text-white shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                Live Sandbox
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  viewMode === "grid" ? "bg-neutral-800 text-white shadow" : "text-neutral-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Side-by-Side (4 Grid)
              </button>
            </div>
          </div>
        </div>

        {/* Theme Picker Tabs */}
        {viewMode === "sandbox" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {THEMES.map((theme) => {
              const isSelected = theme.id === selectedThemeId;
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected 
                      ? "border-amber-400 ring-2 ring-amber-400/30 bg-neutral-900" 
                      : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-300">{theme.name}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 font-medium">{theme.subtitle}</p>
                  
                  {/* Swatches Bar */}
                  <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-neutral-800/80">
                    <div className="w-5 h-5 rounded-md border border-neutral-700 shadow-sm" style={{ backgroundColor: theme.bg }} title="BG" />
                    <div className="w-5 h-5 rounded-md border border-neutral-700 shadow-sm" style={{ backgroundColor: theme.surface }} title="Surface" />
                    <div className="w-5 h-5 rounded-md border border-neutral-700 shadow-sm" style={{ backgroundColor: theme.primary }} title="Primary" />
                    <div className="w-5 h-5 rounded-md border border-neutral-700 shadow-sm" style={{ backgroundColor: theme.accent }} title="Accent" />
                    <span className="text-[10px] text-neutral-400 ml-auto">{theme.isDark ? "Dark" : "Light"}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area */}
        {viewMode === "sandbox" ? (
          <div className="space-y-6">
            {/* Active Theme Highlight Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-xl gap-3">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  Active Simulation:
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeTheme.name} — <span className="text-neutral-400 font-normal">{activeTheme.subtitle}</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">{activeTheme.tag}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(activeTheme.tailwindSnippet, "tailwind")}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode === "tailwind" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Code2 className="w-3.5 h-3.5 text-amber-400" />}
                  Copy Tailwind
                </button>
                <button
                  onClick={() => handleCopy(activeTheme.cssSnippet, "css")}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode === "css" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  Copy CSS Root
                </button>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            {renderSampleUI(activeTheme)}

            {/* Code Snippets Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-neutral-300">tailwind.config.js snippet</span>
                  <button 
                    onClick={() => handleCopy(activeTheme.tailwindSnippet, "tailwind-box")}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedCode === "tailwind-box" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 bg-black/60 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto">
                  {activeTheme.tailwindSnippet}
                </pre>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-neutral-300">index.css (:root variables)</span>
                  <button 
                    onClick={() => handleCopy(activeTheme.cssSnippet, "css-box")}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedCode === "css-box" ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
                <pre className="p-3 bg-black/60 rounded-lg text-xs font-mono text-amber-300 overflow-x-auto">
                  {activeTheme.cssSnippet}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          /* Grid Mode: All 4 Themes Rendered Simultaneously */
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {THEMES.map((theme) => (
              <div key={theme.id} className="space-y-2">
                <div className="flex items-center justify-between px-2">
                  <div>
                    <h3 className="font-bold text-white text-sm">{theme.name}</h3>
                    <p className="text-xs text-neutral-400">{theme.subtitle}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedThemeId(theme.id);
                      setViewMode("sandbox");
                    }}
                    className="text-xs px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-md font-medium border border-neutral-700"
                  >
                    Focus & Test
                  </button>
                </div>
                {renderSampleUI(theme)}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
