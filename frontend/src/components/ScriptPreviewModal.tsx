// @ts-nocheck
import React from "react";
import { BookOpen, Users, Tag, X, FileText, Download, Sparkles, Layers } from "lucide-react";
import type { Playbook } from "@/data/playbooksData";

interface ScriptPreviewModalProps {
  open: boolean;
  onClose: () => void;
  script: Playbook | null;
}

export default function ScriptPreviewModal({ open, onClose, script }: ScriptPreviewModalProps) {
  if (!open || !script) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] w-full max-w-4xl lg:max-w-5xl rounded-[2.5rem] p-0 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
          title="Close script preview"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Modal Scroll Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 space-y-6 text-left">
          
          {/* Header */}
          <div className="border-b border-[#DCBAB2]/70 pb-4 pr-12 text-left space-y-2">
            <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
              <span className="bg-[#EEDBD5] text-[#8C241E] px-2.5 py-0.5 rounded-full border border-[#D5AAA2]">
                {script.genre || "Classical Drama"}
              </span>
              {script.language && (
                <span className="text-[#6E4742] font-medium">
                  • {script.language}
                </span>
              )}
              <span className="text-[#D5AAA2]">•</span>
              <span className="text-[#8C5A54]">{script.pages || "40+"} Pages</span>
              <span className="text-[#D5AAA2]">•</span>
              <span className="text-[#8C5A54]">{script.acts || "3 Acts"}</span>
              <span className="text-[#D5AAA2]">•</span>
              <span className="text-[#8C5A54]">{script.rolesCount || "8 Roles"}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#2A1816] font-normal tracking-tight leading-tight">
              {script.title}
            </h2>

            <p className="text-xs text-[#6E4742] font-serif italic">
              Playwright: <strong className="text-[#2A1816] font-medium not-italic">{script.playwright}</strong>
            </p>
          </div>

          {/* Body Content 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 text-left">
            
            {/* Left Column: Synopsis & Dramatis Personae (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Synopsis Box */}
              <div className="bg-[#FAF2EE] border border-[#DCBAB2] p-5 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C241E]">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Story Synopsis & Premise</span>
                </div>
                <p className="text-xs text-[#5C3B37] font-serif leading-relaxed italic">
                  "{script.abstract || script.excerpt}"
                </p>
              </div>

              {/* Characters Roster */}
              <div className="bg-[#FAF2EE] border border-[#DCBAB2] p-5 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#DCBAB2]/50 pb-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C241E]">
                    <Users className="w-3.5 h-3.5" />
                    <span>Dramatis Personae ({script.characters?.length || 0})</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                  {script.characters && script.characters.length > 0 ? (
                    script.characters.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5EAE6] border border-[#DCBAB2]/70">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: c.color || '#8C241E' }}
                          />
                          <span className="font-serif text-xs font-bold text-[#2A1816] truncate">{c.name}</span>
                        </div>
                        {c.traits && (
                          <span className="text-[9px] font-mono uppercase text-[#8C5A54] bg-[#FAF2EE] px-2 py-0.5 rounded-full border border-[#DCBAB2] shrink-0 truncate max-w-[140px]">
                            {typeof c.traits === "string" ? c.traits.split(",")[0] : c.traits}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-serif italic text-[#8C5A54]">Ensemble cast roles defined in playbook.</p>
                  )}
                </div>
              </div>

              {/* Setting Details */}
              {script.settingInfo && (
                <div className="p-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl text-xs font-serif text-[#6E4742] space-y-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] block">Scenography & Setting</span>
                  <p>{script.settingInfo}</p>
                </div>
              )}
            </div>

            {/* Right Column: Scene Excerpt & Spoken Lines (7 cols) */}
            <div className="lg:col-span-7 bg-[#FAF2EE] border border-[#DCBAB2] p-6 sm:p-7 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C241E]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Performance Excerpt & Stage Directions</span>
                </div>
                <span className="text-[10px] font-mono text-[#8C5A54]">
                  {script.lines?.length || 0} Sequences
                </span>
              </div>

              <div className="space-y-3.5 max-h-[480px] overflow-y-auto custom-scrollbar pr-2">
                {script.lines && script.lines.length > 0 ? (
                  script.lines.map((l, i) => {
                    if (l.characterName === "scene-heading") {
                      return (
                        <div key={i} className="pt-2 pb-1 border-b border-[#DCBAB2]/60">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#8C241E] block">
                            {l.text}
                          </span>
                        </div>
                      );
                    }
                    if (l.characterName === "stage-note") {
                      return (
                        <div key={i} className="p-3 rounded-xl bg-[#F5EAE6] border border-[#DEBEB7] text-xs font-serif italic text-[#6E4742]">
                          <span className="font-mono text-[9px] uppercase font-bold text-[#8C5A54] not-italic mr-1.5">[Stage Note]:</span>
                          {l.text}
                        </div>
                      );
                    }
                    return (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border shadow-2xs"
                            style={{
                              backgroundColor: '#F5EAE6',
                              borderColor: l.color || '#8C241E',
                              color: l.color || '#8C241E'
                            }}
                          >
                            {l.characterName}
                          </span>
                        </div>
                        <p className="font-serif text-[#2A1816] text-xs sm:text-[13px] leading-relaxed pl-2 border-l-2 border-[#DCBAB2]/60">
                          {l.text}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs font-serif italic text-[#8C5A54]">{script.excerpt}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#DCBAB2]/70 flex items-center justify-between">
            <span className="text-xs font-mono text-[#8C5A54]">
              Aayam Theatre Society • Script Vault Archive
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer border border-[#A6352F] shadow-sm transition-all"
            >
              Close Playbook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
