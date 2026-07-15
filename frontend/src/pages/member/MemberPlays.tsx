import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, PlayCircle, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Play {
  id: number;
  title: string;
  description: string;
  director: string;
  genre: string;
}

export default function MemberPlays() {
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

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Header */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px]">
        <div className="space-y-[12px] flex-1">
          <Badge className="bg-[#635f41]/10 text-[#635f41] border-[#e6e2dd] rounded-[4px] uppercase tracking-wider text-[10px]">Repertoire</Badge>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Production Plays</h2>
          <p className="text-[14px] text-[#466272] max-w-2xl">
            Explore the sophisticated collection of theatrical productions staged by Aayam. Dive into the thematic depths of our active and past plays, and access the official scripts for study and rehearsal.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link to="/member-scripts">
            <Button className="bg-[#8CC0EB] hover:bg-[#8CC0EB]/90 text-[#1c1b19] font-bold rounded-[8px] py-[10px] px-[20px] gap-2 shadow-sm transition-all">
              <FileText className="w-4 h-4" /> Script Library
            </Button>
          </Link>
        </div>
      </div>

      {/* Plays Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#466272]/70 font-semibold italic">Loading productions...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[24px]">
          {plays.map((play) => (
            <div key={play.id} className="group bg-white border border-[#e6e2dd] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              {/* Abstract Artwork Placeholder */}
              <div className="h-48 bg-gradient-to-br from-[#8CC0EB]/20 to-[#635f41]/20 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <PlayCircle className="w-16 h-16 text-[#635f41]/40 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <Badge className="bg-white/90 text-[#635f41] shadow-sm backdrop-blur-sm border-0 font-semibold">{play.genre}</Badge>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-2xl font-bold font-serif text-[#635f41] mb-2 group-hover:text-[#8CC0EB] transition-colors">{play.title}</h3>
                <p className="text-sm font-semibold text-[#466272]/80 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-amber-500" /> Directed by {play.director}
                </p>
                <p className="text-sm text-[#466272] leading-relaxed mb-6 line-clamp-3 flex-1">
                  {play.description}
                </p>
                
                <div className="pt-4 border-t border-[#e6e2dd] flex items-center justify-between">
                  <Link to="/member-scripts" className="flex items-center gap-2 text-sm font-bold text-[#8CC0EB] hover:text-[#466272] transition-colors">
                    Download Script <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
