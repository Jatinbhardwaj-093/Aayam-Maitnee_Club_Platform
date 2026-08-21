// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Calendar, Search, Plus, MapPin, Clock, Users, Shield, FileText, ArrowRight,
  CheckCircle2, DollarSign, Building, Tag, ExternalLink, Activity, PlayCircle, Sparkles, X, HeartHandshake
} from "lucide-react";

export default function EventsManagement() {
  const [activeTab, setActiveTab] = useState<"calendar" | "proposals" | "sponsors">("calendar");
  const [eventsList, setEventsList] = useState([
    { id: 1, title: "Hayavadana - Stage Production (Opening Night)", category: "Plays", date: "Sep 18, 2026", venue: "CLT Main Stage", status: "Scheduled" },
    { id: 2, title: "Ashadh Ka Ek Din - OAT Amphitheatre Premiere", category: "Plays", date: "Sep 25, 2026", venue: "OAT Amphitheatre", status: "Scheduled" },
    { id: 3, title: "Charandas Chor - Folk Satire Proscenium", category: "Plays", date: "Oct 12, 2026", venue: "CLT Auditorium", status: "Scheduled" },
    { id: 4, title: "Musimprov (with Akord) - Musical Improv", category: "Meetups", date: "Aug 15, 2026", venue: "Student Activity Centre", status: "Concluded" },
    { id: 5, title: "Stage Lighting & DMX Rigging Masterclass", category: "Workshops", date: "Aug 12, 2026", venue: "Tech Booth CLT", status: "Concluded" },
    { id: 6, title: "August Script Reading Circle - Autumn Plays", category: "Meetups", date: "Aug 23, 2026", venue: "Aayam Rehearsal Hall", status: "Confirmed" }
  ]);

  const [proposals, setProposals] = useState([
    { id: 101, name: "Acoustic Folk Jam & Vocal Modulations", submitter: "Sneha Das", type: "Member Workshop Pitch", budget: "₹25,000", status: "Reviewing" },
    { id: 102, name: "Physical Movement & Navarasa Mime", submitter: "Samarth Shrivastava", type: "Society Pitch", budget: "₹35,000", status: "Approved" }
  ]);

  const [sponsors, setSponsors] = useState([
    { id: 1, sponsor: "Red Bull India", ad_title: "Campus Drama Lounge", category: "Playbill Banner", budget: "₹1,50,000", status: "Approved" },
    { id: 2, sponsor: "FabIndia Ethnic", ad_title: "Period Drama Costumes", category: "Stage Wardrobe Sponsor", budget: "₹85,000", status: "Approved" }
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 md:px-8 font-sans text-[#5C3B37] selection:bg-[#8C241E]/20">
      
      {/* Editorial Header */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
              <Calendar className="w-3.5 h-3.5 text-[#8C241E]" />
              <span>SOCIETY REPERTOIRE & OPERATIONAL DESK</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Events & Season Schedule
            </h1>
            <p className="text-xs sm:text-sm text-[#6E4742] max-w-2xl font-serif italic">
              Coordinate production premieres, community workshops, script table reads, and campus partner sponsors.
            </p>
          </div>
          
          <div className="flex items-center gap-2 bg-[#FAF2EE] p-1.5 rounded-full border border-[#DCBAB2] shadow-xs shrink-0 self-start md:self-auto">
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'calendar' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Event Roster ({eventsList.length})
            </button>
            <button 
              onClick={() => setActiveTab("proposals")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'proposals' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Pitches ({proposals.length})
            </button>
            <button 
              onClick={() => setActiveTab("sponsors")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'sponsors' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Sponsors ({sponsors.length})
            </button>
          </div>
        </div>
      </section>

      {/* Dynamic Tab Content */}
      {activeTab === "calendar" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
            <div className="space-y-0.5">
              <h2 className="font-serif text-2xl text-[#2A1816] font-normal">Official Events Calendar</h2>
              <p className="text-xs text-[#6E4742]">Autumn Season Premieres, Masterclasses & Reading Circles</p>
            </div>
            <button 
              onClick={() => alert("Event scheduling window open")}
              className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-sm flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F]"
            >
              <Plus className="w-3.5 h-3.5 text-[#FFD0CC]" /> Schedule Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {eventsList.map(ev => (
              <div 
                key={ev.id} 
                className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-7 hover:border-[#B32D25]/50 hover:shadow-md transition-all flex flex-col justify-between group space-y-4 shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2 border-b border-[#DCBAB2]/50 pb-3">
                    <span className="inline-block px-3 py-0.5 bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2] rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      {ev.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      ev.status === "Scheduled" || ev.status === "Confirmed"
                        ? "bg-emerald-700/15 text-emerald-950 border-emerald-700/30"
                        : "bg-[#EEDBD5] text-[#5C3B37] border-[#D5AAA2]"
                    }`}>
                      {ev.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-[#2A1816] leading-tight font-normal">
                    {ev.title}
                  </h3>

                  <div className="space-y-1.5 pt-1 text-xs font-mono text-[#5C3B37]">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                      <span>{ev.date}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#8C241E] shrink-0" />
                      <span>{ev.venue}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DCBAB2]/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8C5A54]">IIT Madras Campus</span>
                  <span className="text-[#8C241E] font-bold">Aayam Repertory</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "proposals" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
            <div className="space-y-0.5">
              <h2 className="font-serif text-2xl text-[#2A1816] font-normal">Member Pitches & Workshop Ideas</h2>
              <p className="text-xs text-[#6E4742]">Community proposals under directorial review</p>
            </div>
          </div>
          
          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DCBAB2] bg-[#F5EAE6]">
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Proposal Title</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Submitter</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Estimated Budget</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCBAB2]/50">
                {proposals.map(prop => (
                  <tr key={prop.id} className="hover:bg-[#F5EAE6]/60 transition-colors">
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-serif text-base font-normal text-[#2A1816] block leading-tight">{prop.name}</span>
                      <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider inline-block mt-0.5">{prop.type}</span>
                    </td>
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-sans text-xs text-[#2A1816] font-medium">{prop.submitter}</span>
                    </td>
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-700/15 px-3 py-1 rounded-full border border-emerald-700/30">
                        {prop.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 align-top text-right">
                      <button 
                        onClick={() => alert(`Reviewing proposal: ${prop.name}`)}
                        className="px-4 py-1.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
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
          <div className="flex items-center justify-between border-b border-[#DCBAB2]/60 pb-3">
            <div className="space-y-0.5">
              <h2 className="font-serif text-2xl text-[#2A1816] font-normal">Sponsor & Brand Partnerships</h2>
              <p className="text-xs text-[#6E4742]">Production festival sponsors, playbill ads, and equipment partners</p>
            </div>
          </div>
          
          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#DCBAB2] bg-[#F5EAE6]">
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Brand Partner</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Placement Category</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">Contract Revenue</th>
                  <th className="px-6 py-4 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCBAB2]/50">
                {sponsors.map(sp => (
                  <tr key={sp.id} className="hover:bg-[#F5EAE6]/60 transition-colors">
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-serif text-base font-normal text-[#2A1816] block leading-tight">{sp.sponsor}</span>
                      <span className="text-[10px] font-mono text-[#8C5A54] uppercase tracking-wider inline-block mt-0.5">{sp.ad_title}</span>
                    </td>
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-sans text-xs text-[#5C3B37]">{sp.category}</span>
                    </td>
                    <td className="px-6 py-4.5 align-top">
                      <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-700/15 px-3 py-1 rounded-full border border-emerald-700/30">
                        {sp.budget}
                      </span>
                    </td>
                    <td className="px-6 py-4.5 align-top text-right">
                      <span className="text-[10px] font-mono text-emerald-950 font-bold uppercase tracking-wider px-3 py-1 bg-emerald-700/15 rounded-full border border-emerald-700/30">
                        {sp.status}
                      </span>
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

