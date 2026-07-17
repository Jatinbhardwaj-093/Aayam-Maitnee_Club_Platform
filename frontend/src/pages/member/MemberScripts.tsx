// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Download, FileText, Lock, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Play {
  id: number;
  title: string;
  genre: string;
}

export default function MemberScripts() {
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001"}/api/plays`)
      .then(res => res.json())
      .then(data => {
        setPlays(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDownload = (title: string) => {
    // Simulated download logic for prototype
    alert(`Downloading script for ${title}.pdf`);
  };

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Header */}
      <div className="bg-[#fdf9f4] border border-[#e6e2dd] rounded-[8px] p-[24px] flex flex-col md:flex-row justify-between items-center gap-[24px] shadow-sm">
        <div className="space-y-[8px] flex-1">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#8CC0EB]" />
            <h2 className="text-[28px] font-bold font-serif text-[#635f41]">Production Scripts</h2>
          </div>
          <p className="text-[14px] text-[#466272]">
            Secure vault for official playbooks and annotated rehearsal scripts. Strictly confidential.
          </p>
        </div>
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1 flex items-center gap-1">
          <Lock className="w-3 h-3" /> Internal Use Only
        </Badge>
      </div>

      {/* Scripts List */}
      <div className="bg-white border border-[#e6e2dd] rounded-xl shadow-xs overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#e6e2dd] bg-[#f7f3ee]/50 font-bold text-xs uppercase tracking-wider text-[#635f41]">
          <div className="col-span-6 md:col-span-5">Script Title</div>
          <div className="col-span-3 hidden md:block">Format</div>
          <div className="col-span-3 hidden md:block">Size</div>
          <div className="col-span-6 md:col-span-1 text-right">Action</div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#466272]/70 italic font-semibold">Loading vault...</div>
        ) : (
          <div className="divide-y divide-[#e6e2dd]/60">
            {plays.map((play, index) => (
              <div key={play.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#fdf9f4]/50 transition-colors">
                <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#8CC0EB]/20 flex items-center justify-center flex-shrink-0">
                    <FileArchive className="w-5 h-5 text-[#466272]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#635f41] text-sm md:text-base">{play.title}</h4>
                    <span className="text-xs text-[#466272]/70">Director's Cut</span>
                  </div>
                </div>
                
                <div className="col-span-3 hidden md:flex items-center">
                  <Badge variant="outline" className="text-[10px] font-bold border-[#e6e2dd] text-[#466272] bg-[#fcfbfa]">PDF Document</Badge>
                </div>
                
                <div className="col-span-3 hidden md:flex items-center text-xs font-mono text-[#466272]/80">
                  {((index + 1) * 1.4).toFixed(1)} MB
                </div>
                
                <div className="col-span-6 md:col-span-1 flex justify-end">
                  <Button 
                    onClick={() => handleDownload(play.title)}
                    variant="outline" 
                    size="sm" 
                    className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB] hover:text-white rounded-[8px] transition-all"
                  >
                    <Download className="w-4 h-4 md:mr-1" />
                    <span className="hidden md:inline font-bold">Get</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
