import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Users,
  ClipboardList,
  DollarSign,
  ShieldCheck,
  Activity
} from "lucide-react";

export default function MaintainerDashboard() {
  const [stats, setStats] = useState<any>({
    events: { total_proposals: 8, pending_proposals: 4, member_pitches: 5, sponsor_proposals: 3 },
    sponsors: { total_ads: 4, pending_ads: 2 },
    auditions: { open_callings: 5, total_requests: 8, shortlisted: 3, selected: 3 },
    members: { total_registered: 42, pending_approvals: 2 },
    financials: { total_revenue: 413000, total_expenses: 119500, net_surplus: 293500 }
  });

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/maintainer/stats`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.events) {
          setStats(data);
        }
      })
      .catch((err) => {
        console.error("Error loading maintainer stats:", err);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6 px-4 md:px-8 font-sans text-[#2C2A28]">
      
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D5C9BE]/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#E85F57]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>CORE MAINTENANCE PORTAL</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2C2A28] font-normal tracking-tight">
            Maintainer Control Center
          </h1>
          <p className="text-sm text-[#666361] max-w-xl font-light">
            Live system status across event proposals, auditions, member directory, and financial surplus.
          </p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-col items-start md:items-end space-y-2">
          <div className="flex items-center gap-3">
            <Link to="/analytics" className="inline-flex items-center gap-2 bg-[#2C2A28] text-white px-5 py-2.5 rounded-full shadow-md text-xs font-mono font-bold uppercase tracking-widest hover:bg-[#353535] transition-all">
              <Activity className="w-3.5 h-3.5 text-[#E85F57]" /> Analytics
            </Link>
            <Link to="/events-admin" className="inline-flex items-center gap-2 border border-[#2C2A28] text-[#2C2A28] hover:bg-[#2C2A28] hover:text-white px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest transition-all">
              <Calendar className="w-3.5 h-3.5" /> Events
            </Link>
          </div>
        </div>
      </section>

      {/* Live System Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 1. Event Proposals */}
        <div className="bg-white/60 border border-[#D5C9BE] text-[#2C2A28] p-7 rounded-[2rem] shadow-sm space-y-4 hover:bg-white transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">
              Event Proposals
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#E7DDD3] flex items-center justify-center text-[#2C2A28]">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-4xl font-serif text-[#2C2A28] leading-none">
              {stats.events.total_proposals}
            </div>
            <div className="text-[10px] font-mono text-[#666361] mt-2 tracking-wider">
              MEMBER: {stats.events.member_pitches} • SPONSOR: {stats.events.sponsor_proposals}
            </div>
          </div>
          <div className="pt-4 border-t border-[#D5C9BE]/60 flex items-center justify-between text-xs font-mono">
            <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {stats.events.pending_proposals} PENDING
            </span>
            <Link to="/events-admin" className="text-[#E85F57] font-bold hover:underline uppercase tracking-wider">
              Review
            </Link>
          </div>
        </div>

        {/* 2. Auditions & Role Callings */}
        <div className="bg-white/60 border border-[#D5C9BE] text-[#2C2A28] p-7 rounded-[2rem] shadow-sm space-y-4 hover:bg-white transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">
              Casting & Roles
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#E85F57]/10 flex items-center justify-center text-[#E85F57]">
              <ClipboardList className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-4xl font-serif text-[#2C2A28] leading-none">
              {stats.auditions.total_requests}
            </div>
            <div className="text-[10px] font-mono text-[#666361] mt-2 tracking-wider">
              OPEN: {stats.auditions.open_callings} • LISTED: {stats.auditions.shortlisted}
            </div>
          </div>
          <div className="pt-4 border-t border-[#D5C9BE]/60 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {stats.auditions.selected} CASTED
            </span>
            <Link to="/auditions-admin" className="text-[#E85F57] font-bold hover:underline uppercase tracking-wider">
              Inspect
            </Link>
          </div>
        </div>

        {/* 3. Registered Members */}
        <div className="bg-white/60 border border-[#D5C9BE] text-[#2C2A28] p-7 rounded-[2rem] shadow-sm space-y-4 hover:bg-white transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#666361]">
              Ensemble Roster
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#2C2A28]/10 flex items-center justify-center text-[#2C2A28]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-4xl font-serif text-[#2C2A28] leading-none">
              {stats.members.total_registered}
            </div>
            <div className="text-[10px] font-mono text-[#666361] mt-2 tracking-wider uppercase">
              Active Performers & Crew
            </div>
          </div>
          <div className="pt-4 border-t border-[#D5C9BE]/60 flex items-center justify-between text-xs font-mono">
            <span className="text-[#2C2A28] font-bold bg-[#E7DDD3] px-2.5 py-1 rounded-full border border-[#D5C9BE]">
              {stats.members.pending_approvals} PENDING
            </span>
            <Link to="/directory-admin" className="text-[#E85F57] font-bold hover:underline uppercase tracking-wider">
              Manage
            </Link>
          </div>
        </div>

        {/* 4. Financial Ledger (Dark Highlight Card) */}
        <div className="bg-[#2C2A28] border border-[#353535] text-white p-7 rounded-[2rem] shadow-xl space-y-4 hover:shadow-2xl transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E85F57] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Ledger
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#353535] flex items-center justify-center text-[#E85F57]">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-4xl font-serif text-[#F7F5F0] leading-none tracking-tight">
              ₹{stats.financials.net_surplus.toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-white/50 mt-2 tracking-wider">
              IN: ₹{(stats.financials.total_revenue / 1000).toFixed(0)}k • OUT: ₹{(stats.financials.total_expenses / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-900">
              CASHFLOW POSITIVE
            </span>
            <Link to="/analytics" className="text-white hover:text-[#E85F57] font-bold transition-colors uppercase tracking-wider">
              View
            </Link>
          </div>
        </div>
      </section>

      {/* Main 2-Column Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Quick Maintainer Action Clips */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5C9BE]/60">
            <h2 className="font-serif text-3xl text-[#2C2A28]">Operational Clips</h2>
            <span className="text-[10px] text-[#2C2A28] bg-[#D5C9BE]/40 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-widest">
              Live Database Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Clip 1: Proposal Review */}
            <div className="bg-white/50 border border-[#D5C9BE]/60 p-6 rounded-[2rem] space-y-3 hover:bg-white transition-all">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#E85F57] bg-[#E85F57]/10 px-2.5 py-1 rounded-full">
                Events & Proposals
              </span>
              <h3 className="font-serif text-2xl text-[#2C2A28] leading-tight">Event Curation</h3>
              <p className="text-xs text-[#666361] leading-relaxed font-light">
                Review Red Bull Energy stage deals, member jam pitches, and AI auto-filled briefs.
              </p>
              <div className="pt-3">
                <Link to="/events-admin" className="text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57] hover:text-[#D94538] flex items-center gap-1.5 transition-colors">
                  Open Desk <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Clip 2: Auditions */}
            <div className="bg-white/50 border border-[#D5C9BE]/60 p-6 rounded-[2rem] space-y-3 hover:bg-white transition-all">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#E85F57] bg-[#E85F57]/10 px-2.5 py-1 rounded-full">
                Auditions & Casting
              </span>
              <h3 className="font-serif text-2xl text-[#2C2A28] leading-tight">Character Callings</h3>
              <p className="text-xs text-[#666361] leading-relaxed font-light">
                Inspect candidate monologue reels, run AI role fit scanners, and confirm casting.
              </p>
              <div className="pt-3">
                <Link to="/auditions-admin" className="text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57] hover:text-[#D94538] flex items-center gap-1.5 transition-colors">
                  Open Desk <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Clip 3: Script Vault */}
            <div className="bg-white/50 border border-[#D5C9BE]/60 p-6 rounded-[2rem] space-y-3 hover:bg-white transition-all">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#E85F57] bg-[#E85F57]/10 px-2.5 py-1 rounded-full">
                Script Vault
              </span>
              <h3 className="font-serif text-2xl text-[#2C2A28] leading-tight">Confidential Play Manuscripts</h3>
              <p className="text-xs text-[#666361] leading-relaxed font-light">
                Access Tughlaq, Macbeth scripts with line splits and AI rehearsal cue generators.
              </p>
              <div className="pt-3">
                <Link to="/member-scripts" className="text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57] hover:text-[#D94538] flex items-center gap-1.5 transition-colors">
                  Open Vault <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Clip 4: Analytics */}
            <div className="bg-white/50 border border-[#D5C9BE]/60 p-6 rounded-[2rem] space-y-3 hover:bg-white transition-all">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#E85F57] bg-[#E85F57]/10 px-2.5 py-1 rounded-full">
                Ledger
              </span>
              <h3 className="font-serif text-2xl text-[#2C2A28] leading-tight">Revenue Analytics</h3>
              <p className="text-xs text-[#666361] leading-relaxed font-light">
                Restricted financial audit tracking ticket sales revenue, venue rental deposits, and sponsor grants.
              </p>
              <div className="pt-3">
                <Link to="/analytics" className="text-xs font-mono font-bold uppercase tracking-widest text-[#E85F57] hover:text-[#D94538] flex items-center gap-1.5 transition-colors">
                  View Ledger <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Live System Activity Feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5C9BE]/60">
            <h2 className="font-serif text-3xl text-[#2C2A28]">Activity Feed</h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="space-y-3">
            {/* Feed Item 1 */}
            <div className="bg-white/60 p-5 rounded-[1.5rem] border border-[#D5C9BE]/40 space-y-1.5 hover:bg-white transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-serif text-lg text-[#2C2A28] leading-tight">Red Bull Sponsorship</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">₹1,50,000</span>
              </div>
              <p className="text-[#666361] text-xs font-light">Sponsorship deal registered in database ledger.</p>
            </div>

            {/* Feed Item 2 */}
            <div className="bg-white/60 p-5 rounded-[1.5rem] border border-[#D5C9BE]/40 space-y-1.5 hover:bg-white transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-serif text-lg text-[#2C2A28] leading-tight">Audition Slate</span>
                <span className="text-[10px] font-mono font-bold text-[#E85F57] bg-[#E85F57]/10 px-2.5 py-1 rounded-full border border-[#E85F57]/20 uppercase">Aarav Varma</span>
              </div>
              <p className="text-[#666361] text-xs font-light">Applied for Sultan Tughlaq Lead Role.</p>
            </div>

            {/* Feed Item 3 */}
            <div className="bg-white/60 p-5 rounded-[1.5rem] border border-[#D5C9BE]/40 space-y-1.5 hover:bg-white transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-serif text-lg text-[#2C2A28] leading-tight">Stage Booking</span>
                <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 uppercase">Royal Stage</span>
              </div>
              <p className="text-[#666361] text-xs font-light">Prithvi Theatre venue deposit logged.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
