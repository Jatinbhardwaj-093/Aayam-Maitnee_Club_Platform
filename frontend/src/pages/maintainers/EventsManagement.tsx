// @ts-nocheck
import { useState, useEffect } from "react";
import {
  Calendar, Search, Plus, MapPin, Clock, Users, Shield, FileText, ArrowRight,
  CheckCircle2, DollarSign, Building, Tag, ExternalLink, Activity, PlayCircle
} from "lucide-react";

export default function EventsManagement() {
  const [activeTab, setActiveTab] = useState<"calendar" | "proposals" | "sponsors">("calendar");

  const events = [
    { id: 1, title: "Musimprov (with Akord)", category: "Meetups", date: "Jul 25, 2026", venue: "Royal Stage", status: "upcoming" },
    { id: 2, title: "Theatre Masterclass", category: "Masterclass", date: "Aug 02, 2026", venue: "Aayam Stage 2", status: "upcoming" },
    { id: 3, title: "Darpan Drama Festival", category: "Plays", date: "Aug 15, 2026", venue: "Main Auditorium", status: "upcoming" }
  ];

  const proposals = [
    { id: 101, name: "Acoustic Folk Jam", submitter: "Sneha Das", type: "Member Pitch", budget: "₹25,000", status: "Reviewing" },
    { id: 102, name: "Physical Movement Mime", submitter: "Samarth Shrivastava", type: "Member Pitch", budget: "₹35,000", status: "Reviewing" }
  ];

  const sponsors = [
    { id: 1, sponsor: "Red Bull India", ad_title: "Energy Lounge", category: "Playbill Banner", budget: "₹1,50,000", status: "Pending" },
    { id: 2, sponsor: "FabIndia Ethnic", ad_title: "Traditional Costume", category: "Stage Sidecar", budget: "₹85,000", status: "Approved" }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 md:px-8 font-sans text-[#2C2A28]">
      
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D5C9BE]/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#E85F57]">
            <Calendar className="w-3.5 h-3.5" />
            <span>OPERATIONAL MANAGEMENT</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C2A28] font-normal tracking-tight">
            Events & Proposals
          </h1>
          <p className="text-sm text-[#666361] max-w-2xl font-light">
            Manage the official calendar, review member pitches, and curate incoming sponsor deals.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setActiveTab("calendar")}
            className={`px-5 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${activeTab === 'calendar' ? 'bg-[#2C2A28] text-white shadow-md' : 'border border-[#2C2A28] text-[#2C2A28] hover:bg-[#2C2A28]/10'}`}
          >
            Calendar
          </button>
          <button 
            onClick={() => setActiveTab("proposals")}
            className={`px-5 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${activeTab === 'proposals' ? 'bg-[#2C2A28] text-white shadow-md' : 'border border-[#2C2A28] text-[#2C2A28] hover:bg-[#2C2A28]/10'}`}
          >
            Pitches
          </button>
          <button 
            onClick={() => setActiveTab("sponsors")}
            className={`px-5 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest transition-all ${activeTab === 'sponsors' ? 'bg-[#2C2A28] text-white shadow-md' : 'border border-[#2C2A28] text-[#2C2A28] hover:bg-[#2C2A28]/10'}`}
          >
            Sponsors
          </button>
        </div>
      </section>

      {/* Dynamic Tab Content */}
      {activeTab === "calendar" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl text-[#2C2A28]">Official Roster</h2>
            <button className="bg-[#E85F57] hover:bg-[#D94538] text-white px-5 py-2.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5 transition-all">
              <Plus className="w-3.5 h-3.5" /> Book Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map(ev => (
              <div key={ev.id} className="bg-white/60 border border-[#D5C9BE] rounded-[2rem] p-7 hover:bg-white hover:border-[#E85F57]/40 hover:shadow-xl transition-all flex flex-col justify-between group space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-block px-3 py-1 bg-[#2C2A28] text-white border border-[#353535] rounded-full text-[9px] font-mono font-bold uppercase tracking-widest">
                      {ev.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                      {ev.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#2C2A28] leading-tight group-hover:text-[#E85F57] transition-colors">{ev.title}</h3>
                  <p className="text-xs text-[#666361] font-mono uppercase tracking-widest flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#E85F57]"/> {ev.date}</p>
                  <p className="text-xs text-[#666361] font-mono uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#E85F57]"/> {ev.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "proposals" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl text-[#2C2A28]">Member Pitches</h2>
          </div>
          
          <div className="bg-white/60 border border-[#D5C9BE] rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D5C9BE]/60 bg-white/40">
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">Proposal</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">Submitter</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">Budget</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map(prop => (
                  <tr key={prop.id} className="border-b border-[#D5C9BE]/40 hover:bg-white transition-colors">
                    <td className="px-6 py-5 align-top">
                      <span className="font-serif text-lg text-[#2C2A28] block leading-tight">{prop.name}</span>
                      <span className="text-[10px] font-mono text-[#E85F57] uppercase tracking-widest inline-block mt-1">{prop.type}</span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="font-sans text-[#2C2A28]">{prop.submitter}</span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">{prop.budget}</span>
                    </td>
                    <td className="px-6 py-5 align-top text-right">
                      <button className="px-5 py-2 rounded-full border border-[#2C2A28] text-[#2C2A28] hover:bg-[#2C2A28] hover:text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "sponsors" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-3xl text-[#2C2A28]">Sponsor Deals</h2>
          </div>
          
          <div className="bg-[#2C2A28] border border-[#353535] rounded-[2rem] overflow-hidden shadow-xl text-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">Deal Brand</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">Category</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-white/50">Revenue</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-widest text-white/50 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map(sp => (
                  <tr key={sp.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 align-top">
                      <span className="font-serif text-lg text-[#F7F5F0] block leading-tight">{sp.sponsor}</span>
                      <span className="text-[10px] font-mono text-[#E85F57] uppercase tracking-widest inline-block mt-1">{sp.ad_title}</span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="font-sans text-white/80">{sp.category}</span>
                    </td>
                    <td className="px-6 py-5 align-top">
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-900">{sp.budget}</span>
                    </td>
                    <td className="px-6 py-5 align-top text-right">
                      {sp.status === "Pending" ? (
                        <button className="px-5 py-2 rounded-full bg-[#E85F57] hover:bg-[#D94538] text-white text-[10px] font-mono font-bold uppercase tracking-widest transition-all">
                          Curate
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-900/30 rounded-full border border-emerald-800">
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
