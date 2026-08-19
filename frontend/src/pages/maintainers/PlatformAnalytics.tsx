import { useState, useEffect } from "react";
import {
  TrendingUp,
  Activity,
  DollarSign,
  ShieldCheck
} from "lucide-react";

export default function PlatformAnalytics() {
  const [summary, setSummary] = useState<any>({
    total_revenue: 413000,
    total_expenses: 119500,
    net_surplus: 293500,
    sponsorship_revenue: 225000,
    ticket_revenue: 88000,
    grants_revenue: 100000
  });

  const [financialRecords, setFinancialRecords] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"financials" | "events" | "auditions" | "system">("financials");

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
    fetch(`${baseUrl}/api/financials/summary`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.total_revenue !== undefined) {
          setSummary(data);
        }
      })
      .catch((err) => console.error("Error loading financial summary:", err));

    fetch(`${baseUrl}/api/financials`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFinancialRecords(data);
        }
      })
      .catch((err) => console.error("Error loading financial records:", err));
  }, []);

  return (
    <div className="bg-[#E7DDD3] min-h-screen text-[#2C2A28] p-6 md:p-10 font-sans space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#DDD8CE] pb-6">
        <div>
          <span className="text-[10px] font-bold text-[#353535] uppercase tracking-[0.25em] block mb-1">
            Maintainer Analytics & Ledger
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2C2A28] tracking-tight">
            Platform Analytics & Financial Status
          </h1>
          <p className="text-xs md:text-sm text-[#666361] mt-1 font-light">
            Comprehensive graphical analytics covering financial cash flow, event proposal metrics, audition casting rates, and system pulse.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-[#D5C9BE]">
            {(["financials", "events", "auditions", "system"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-[#353535] text-white shadow-xs"
                    : "text-[#666361] hover:text-[#2C2A28]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Status Summary Cards (Maintainer Only) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#DDD8CE] p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#353535]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Revenue / Income</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-800">
            ₹{summary.total_revenue.toLocaleString()}
          </div>
          <p className="text-xs text-[#666361] font-light">
            Sponsorships (₹{summary.sponsorship_revenue.toLocaleString()}), Tickets & Grants
          </p>
        </div>

        <div className="bg-white border border-[#DDD8CE] p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-rose-700">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Season Expenses</span>
            <Activity className="w-4 h-4" />
          </div>
          <div className="text-3xl font-serif font-bold text-rose-800">
            ₹{summary.total_expenses.toLocaleString()}
          </div>
          <p className="text-xs text-[#666361] font-light">
            Venue Rentals, Stage Props, SFX Makeup & Audio Equipment
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#FFF9D2] to-[#f5eeaf] border border-[#D5C9BE] p-6 rounded-3xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#353535]">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Net Profit Surplus
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#2C2A28]">
            ₹{summary.net_surplus.toLocaleString()}
          </div>
          <p className="text-xs text-[#666361] font-light">
            Restricted maintainer access ledger balance
          </p>
        </div>
      </div>

      {/* GRAPHICAL ANALYTICS SECTION */}
      {activeTab === "financials" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Financial Trend Visualizer */}
            <div className="lg:col-span-8 bg-white border border-[#DDD8CE] p-6 rounded-3xl shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CE]">
                <div>
                  <span className="text-[10px] font-bold text-[#353535] uppercase tracking-wider">
                    Financial Cash Flow Graph
                  </span>
                  <h2 className="font-serif text-xl font-bold text-[#2C2A28]">
                    Revenue vs Expense Distribution
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#666361]">July - August 2026</span>
              </div>

              {/* Graphical Bar Chart representation */}
              <div className="space-y-5 pt-2">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-[#2C2A28]">
                    <span>Corporate Sponsorships (Red Bull, FabIndia)</span>
                    <span>₹{summary.sponsorship_revenue.toLocaleString()} (54.5%)</span>
                  </div>
                  <div className="w-full bg-[#E7DDD3] border border-[#D5C9BE]/40 h-4 rounded-full overflow-hidden p-0.5">
                    <div className="bg-[#353535] h-full rounded-full transition-all duration-500" style={{ width: "54.5%" }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-[#2C2A28]">
                    <span>Cultural Ministry Development Grants</span>
                    <span>₹{summary.grants_revenue.toLocaleString()} (24.2%)</span>
                  </div>
                  <div className="w-full bg-[#E7DDD3] border border-[#D5C9BE]/40 h-4 rounded-full overflow-hidden p-0.5">
                    <div className="bg-[#666361] h-full rounded-full transition-all duration-500" style={{ width: "24.2%" }}></div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-[#2C2A28]">
                    <span>Mainstage Ticket Presales</span>
                    <span>₹{summary.ticket_revenue.toLocaleString()} (21.3%)</span>
                  </div>
                  <div className="w-full bg-[#E7DDD3] border border-[#D5C9BE]/40 h-4 rounded-full overflow-hidden p-0.5">
                    <div className="bg-[#E85F57] h-full rounded-full transition-all duration-500" style={{ width: "21.3%" }}></div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-[#DDD8CE]">
                  <div className="flex justify-between text-xs font-bold text-rose-800">
                    <span>Operating Expenses (Venue Deposit, Stage Props, Audio)</span>
                    <span>₹{summary.total_expenses.toLocaleString()} (28.9% of Revenue)</span>
                  </div>
                  <div className="w-full bg-[#E7DDD3] border border-[#D5C9BE]/40 h-4 rounded-full overflow-hidden p-0.5">
                    <div className="bg-rose-600 h-full rounded-full transition-all duration-500" style={{ width: "28.9%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Revenue Category Breakdown */}
            <div className="lg:col-span-4 bg-white border border-[#DDD8CE] p-6 rounded-3xl shadow-xs space-y-4">
              <div className="pb-3 border-b border-[#DDD8CE]">
                <span className="text-[10px] font-bold text-[#353535] uppercase tracking-wider">
                  Category Mix
                </span>
                <h3 className="font-serif text-lg font-bold text-[#2C2A28]">
                  Revenue Stream Share
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#E7DDD3] rounded-2xl border border-[#D5C9BE]/40 space-y-1">
                  <span className="font-bold text-[#2C2A28]">Corporate Brands</span>
                  <p className="text-[#666361]">Mainstage title banners & playbill placements.</p>
                  <span className="text-emerald-700 font-bold block pt-1">₹2,25,000 Total</span>
                </div>

                <div className="p-3 bg-[#E7DDD3] rounded-2xl border border-[#D5C9BE]/40 space-y-1">
                  <span className="font-bold text-[#2C2A28]">Public Arts Grants</span>
                  <p className="text-[#666361]">State theatre development funds.</p>
                  <span className="text-blue-700 font-bold block pt-1">₹1,00,000 Total</span>
                </div>
              </div>
            </div>
          </div>

          {/* RESTRICTED MAINTAINER FINANCIAL TRANSACTIONS LEDGER */}
          <div className="bg-white border border-[#DDD8CE] p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CE]">
              <div>
                <span className="text-[10px] font-bold text-[#353535] uppercase tracking-wider">
                  Backend Secured Ledger
                </span>
                <h3 className="font-serif text-xl font-bold text-[#2C2A28]">
                  Maintainer Financial Transactions
                </h3>
              </div>

              <span className="text-xs font-bold text-[#353535] bg-[#353535]/10 px-3 py-1 rounded-xl">
                {financialRecords.length} Verified Entries
              </span>
            </div>

            <div className="space-y-2.5">
              {financialRecords.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#E7DDD3] border border-[#D5C9BE]/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2C2A28]">{item.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.record_type === "Income" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}>
                        {item.record_type}
                      </span>
                    </div>
                    <p className="text-[#666361] text-[11px]">{item.notes}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-gray-400 font-mono text-[11px]">{item.date}</span>
                    <span className={`font-mono font-bold text-sm ${
                      item.record_type === "Income" ? "text-emerald-700" : "text-rose-700"
                    }`}>
                      {item.record_type === "Income" ? "+" : "-"}₹{item.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "events" && (
        <div className="bg-white border border-[#DDD8CE] p-8 rounded-3xl shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#2C2A28]">Events & Production Proposals Graph</h2>
          <div className="space-y-4 text-xs text-[#666361]">
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[#2C2A28]">
                <span>Member Production Pitches (62.5%)</span>
                <span>5 Proposals</span>
              </div>
              <div className="w-full bg-[#E7DDD3] h-3 rounded-full overflow-hidden border border-[#D5C9BE]/40">
                <div className="bg-[#353535] h-full" style={{ width: "62.5%" }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[#2C2A28]">
                <span>Sponsor Ad Deals (37.5%)</span>
                <span>3 Deals</span>
              </div>
              <div className="w-full bg-[#E7DDD3] h-3 rounded-full overflow-hidden border border-[#D5C9BE]/40">
                <div className="bg-[#666361] h-full" style={{ width: "37.5%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "auditions" && (
        <div className="bg-white border border-[#DDD8CE] p-8 rounded-3xl shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#2C2A28]">Audition Casting Rate Graph</h2>
          <div className="space-y-4 text-xs text-[#666361]">
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[#2C2A28]">
                <span>Shortlisted Performers (37.5%)</span>
                <span>3 Candidates</span>
              </div>
              <div className="w-full bg-[#E7DDD3] h-3 rounded-full overflow-hidden border border-[#D5C9BE]/40">
                <div className="bg-amber-600 h-full" style={{ width: "37.5%" }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[#2C2A28]">
                <span>Confirmed Castings (37.5%)</span>
                <span>3 Performers</span>
              </div>
              <div className="w-full bg-[#E7DDD3] h-3 rounded-full overflow-hidden border border-[#D5C9BE]/40">
                <div className="bg-emerald-600 h-full" style={{ width: "37.5%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "system" && (
        <div className="bg-white border border-[#DDD8CE] p-8 rounded-3xl shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#2C2A28]">System Pulse & API Uptime</h2>
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800">
            <span>Core API Gateway Operational</span>
            <span>99.98% Uptime</span>
          </div>
        </div>
      )}
    </div>
  );
}
