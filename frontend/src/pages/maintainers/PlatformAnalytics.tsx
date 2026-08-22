import { useState, useEffect } from "react";
import {
  TrendingUp,
  Activity,
  DollarSign,
  ShieldCheck,
  FileText,
  Users,
  Server
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

// Mock data generators for charts
const monthlyFinancials = [
  { name: "Jan", revenue: 45000, expenses: 32000 },
  { name: "Feb", revenue: 52000, expenses: 28000 },
  { name: "Mar", revenue: 38000, expenses: 41000 },
  { name: "Apr", revenue: 65000, expenses: 35000 },
  { name: "May", revenue: 78000, expenses: 42000 },
  { name: "Jun", revenue: 85000, expenses: 39000 },
  { name: "Jul", revenue: 110000, expenses: 45000 },
  { name: "Aug", revenue: 135000, expenses: 51000 },
  { name: "Sep", revenue: 95000, expenses: 48000 },
  { name: "Oct", revenue: 88000, expenses: 40000 },
  { name: "Nov", revenue: 75000, expenses: 35000 },
  { name: "Dec", revenue: 92000, expenses: 38000 }
];

const playBudgets = [
  { name: "Macbeth", budget: 150000, actual: 165000 },
  { name: "Ashadh Ka Ek Din", budget: 120000, actual: 115000 },
  { name: "Tughlaq", budget: 200000, actual: 190000 },
  { name: "Waiting for Godot", budget: 80000, actual: 95000 },
  { name: "Aadhe Adhure", budget: 110000, actual: 105000 }
];

const auditionFunnel = [
  { stage: "Registered", count: 324 },
  { stage: "Auditioned", count: 256 },
  { stage: "Callbacks", count: 82 },
  { stage: "Cast", count: 35 }
];

const auditionRoles = [
  { name: "Lead Actor", applicants: 85 },
  { name: "Supporting", applicants: 112 },
  { name: "Ensemble", applicants: 95 },
  { name: "Stage Crew", applicants: 45 },
  { name: "Light/Sound", applicants: 28 }
];

const rehearsalAttendance = [
  { week: "Week 1", actors: 34, crew: 12 },
  { week: "Week 2", actors: 33, crew: 14 },
  { week: "Week 3", actors: 30, crew: 15 },
  { week: "Week 4", actors: 35, crew: 16 },
  { week: "Week 5", actors: 32, crew: 18 },
  { week: "Week 6", actors: 35, crew: 25 },
  { week: "Week 7", actors: 35, crew: 28 }
];

const eventAttendance = [
  { name: "Opening Night", expected: 300, actual: 340 },
  { name: "Matinee 1", expected: 250, actual: 210 },
  { name: "Evening Gala", expected: 400, actual: 450 },
  { name: "Matinee 2", expected: 250, actual: 280 },
  { name: "Closing Night", expected: 450, actual: 490 }
];

const systemUptime = [
  { time: "00:00", pings: 120, latency: 45 },
  { time: "04:00", pings: 80, latency: 42 },
  { time: "08:00", pings: 450, latency: 55 },
  { time: "12:00", pings: 850, latency: 68 },
  { time: "16:00", pings: 720, latency: 60 },
  { time: "20:00", pings: 910, latency: 75 },
  { time: "23:59", pings: 340, latency: 50 },
];

const COLORS = ["#8C241E", "#B32D25", "#E85F57", "#6E4742", "#8C5A54"];

export default function PlatformAnalytics() {
  const [summary, setSummary] = useState<any>({
    total_revenue: 413000,
    total_expenses: 119500,
    net_surplus: 293500,
    sponsorship_revenue: 225000,
    ticket_revenue: 88000,
    grants_revenue: 100000
  });

  const [financialRecords, setFinancialRecords] = useState<any[]>([
    { id: "TX-1", title: "FabIndia Title Sponsorship", record_type: "Income", amount: 150000, date: "Aug 15, 2026", notes: "Q3 Title Sponsor Placement" },
    { id: "TX-2", title: "Cultural Ministry Grant", record_type: "Income", amount: 100000, date: "Aug 12, 2026", notes: "Theatre Development Fund" },
    { id: "TX-3", title: "Mainstage Venue Deposit", record_type: "Expense", amount: 45000, date: "Aug 10, 2026", notes: "Advance payment for 3 nights" },
    { id: "TX-4", title: "Audio & Lighting Rig", record_type: "Expense", amount: 32000, date: "Aug 05, 2026", notes: "Rental from SoundWorks" },
    { id: "TX-5", title: "Early Bird Ticket Sales", record_type: "Income", amount: 42000, date: "Aug 01, 2026", notes: "Batch 1 presales cleared" }
  ]);
  
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
        if (Array.isArray(data) && data.length > 0) {
          setFinancialRecords(data);
        }
      })
      .catch((err) => console.error("Error loading financial records:", err));
  }, []);

  const revenueBreakdown = [
    { name: "Sponsorships", value: summary.sponsorship_revenue },
    { name: "Tickets", value: summary.ticket_revenue },
    { name: "Grants", value: summary.grants_revenue }
  ];

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FAF2EE] border border-[#DCBAB2] p-4 rounded-xl shadow-xl min-w-[160px] z-[100] relative">
          <p className="font-mono text-xs font-bold text-[#8C5A54] uppercase mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const isMoney = ['revenue', 'expenses', 'budget', 'actual'].includes(entry.dataKey);
              const isLatency = entry.name === 'latency' || entry.name === 'Latency (ms)';
              
              let formattedValue = entry.value.toLocaleString();
              if (isMoney) formattedValue = `₹${formattedValue}`;
              if (isLatency) formattedValue = `${formattedValue}ms`;

              return (
                <div key={index} className="flex items-center justify-between gap-4 text-sm text-[#2A1816]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.payload.fill }}></div>
                    <span className="font-sans font-medium">{entry.name}:</span>
                  </div>
                  <span className="font-mono font-bold">{formattedValue}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0];
      const isMoney = entry.name === "Sponsorships" || entry.name === "Tickets" || entry.name === "Grants";
      return (
        <div className="bg-[#FAF2EE] border border-[#DCBAB2] p-3 rounded-xl shadow-xl z-[100] relative">
          <div className="flex items-center gap-2 text-sm text-[#2A1816]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.payload.fill }}></div>
            <span className="font-sans font-semibold">{entry.name}:</span>
            <span className="font-mono font-bold">
              {isMoney ? `₹${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#E7DDD3] min-h-screen text-[#5C3B37] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 border-b border-[#DCBAB2] pb-8">
          <div className="space-y-3">
            <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C241E]" />
              <span>Maintainer Operations</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Platform Analytics
            </h1>
            <p className="text-sm text-[#6E4742] max-w-2xl font-light leading-relaxed">
              Executive overview of financial cash flow, production proposals, casting metrics, and system integrity. Strictly restricted to administrative ledger personnel.
            </p>
          </div>

          <div className="w-full flex bg-[#FAF2EE] p-1.5 rounded-2xl sm:rounded-full border border-[#DCBAB2] shadow-inner overflow-x-auto custom-scrollbar mt-4">
            {(["financials", "events", "auditions", "system"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] px-5 py-3 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-[#8C241E] text-[#FDF8F7] shadow-lg shadow-[#8C241E]/20 border border-[#A6352F]"
                    : "text-[#6E4742] hover:text-[#2A1816] hover:bg-[#FAF2EE]/50 border border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Financial Status Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Gross Revenue</span>
              <DollarSign className="w-4 h-4 text-[#8C241E] opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-6">
              <div className="font-serif text-4xl text-[#2A1816] tracking-tight">₹{summary.total_revenue.toLocaleString()}</div>
              <p className="text-xs text-[#6E4742] font-medium mt-2 leading-relaxed">
                Sponsorships (₹{summary.sponsorship_revenue.toLocaleString()}), Tickets & Grants
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-7 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Season Expenses</span>
              <Activity className="w-4 h-4 text-[#8C241E] opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-6">
              <div className="font-serif text-4xl text-[#2A1816] tracking-tight">₹{summary.total_expenses.toLocaleString()}</div>
              <p className="text-xs text-[#6E4742] font-medium mt-2 leading-relaxed">
                Venue Rentals, Stage Props, SFX Makeup & Audio Equipment
              </p>
            </div>
          </div>

          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-7 shadow-sm flex flex-col justify-between hover:border-[#B32D25]/40 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E85F57]/10 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C241E] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Net Profit Surplus
              </span>
            </div>
            <div className="mt-6 relative z-10">
              <div className="font-serif text-4xl text-[#2A1816] tracking-tight">₹{summary.net_surplus.toLocaleString()}</div>
              <p className="text-xs text-[#6E4742] font-medium mt-2 leading-relaxed">
                Restricted maintainer access ledger balance
              </p>
            </div>
          </div>
        </div>

        {/* GRAPHICAL ANALYTICS SECTION */}
        {activeTab === "financials" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
              
              {/* Main Graph - Revenue vs Expense */}
              <div className="lg:col-span-2 xl:col-span-2 bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#DCBAB2]/60">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Cash Flow Analysis</span>
                    <h2 className="font-serif text-2xl text-[#2A1816] tracking-tight">Revenue vs Expense</h2>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C241E] bg-[#EEDBD5] px-3 py-1.5 rounded-full border border-[#D5AAA2]">
                    Yearly Overview
                  </span>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8C241E" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8C241E" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6E4742" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6E4742" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="name" stroke="#8C5A54" fontSize={10} tickLine={false} axisLine={false} tickMargin={5} angle={-35} textAnchor="end" height={60} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '15px' }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8C241E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#6E4742" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Side Column: Donut Breakdown */}
              <div className="lg:col-span-1 xl:col-span-1 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]/60 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Sources</span>
                  <h3 className="font-serif text-xl text-[#2A1816] tracking-tight">Revenue Breakdown</h3>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {revenueBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} wrapperStyle={{ zIndex: 100 }} />
                      <Legend iconType="circle" layout="vertical" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Budget vs Actual for Plays */}
              <div className="lg:col-span-2 xl:col-span-2 bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#DCBAB2]/60">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Production Financing</span>
                    <h2 className="font-serif text-2xl text-[#2A1816] tracking-tight">Budget vs Actual Spend</h2>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] bg-[#EEDBD5] px-3 py-1.5 rounded-full border border-[#D5AAA2]">
                    Recent Plays
                  </span>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={playBudgets} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="name" stroke="#8C5A54" fontSize={10} tickLine={false} axisLine={false} tickMargin={5} angle={-35} textAnchor="end" height={60} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} cursor={{fill: '#EEDBD5', opacity: 0.4}} wrapperStyle={{ zIndex: 100 }} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '15px' }} />
                      <Bar dataKey="budget" name="Allocated Budget" fill="#E85F57" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="actual" name="Actual Spend" fill="#8C241E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ledger Column */}
              <div className="lg:col-span-1 xl:col-span-1 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-8 shadow-sm space-y-6 flex flex-col">
                <div className="pb-4 border-b border-[#DCBAB2]/60 space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Ledger</span>
                  <h3 className="font-serif text-xl text-[#2A1816] tracking-tight">Recent Transactions</h3>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 flex-1">
                  {financialRecords.slice(0, 4).map((item, idx) => (
                    <div key={item.id || idx} className="p-4 bg-[#F5EAE6] rounded-[1.5rem] border border-[#DEBEB7] space-y-2 hover:border-[#B32D25]/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-sans text-sm font-semibold text-[#2A1816] leading-snug">{item.title}</span>
                        <span className={`font-mono text-xs font-bold shrink-0 ${
                          item.record_type === "Income" ? "text-emerald-700" : "text-[#B32D25]"
                        }`}>
                          {item.record_type === "Income" ? "+" : "-"}₹{item.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#6E4742] font-medium truncate max-w-[130px]">{item.notes}</p>
                        <span className="font-mono text-[10px] font-bold uppercase text-[#8C5A54]">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {/* Event Attendance */}
            <div className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#DCBAB2]/60">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Performance Analytics
                </span>
                <h2 className="font-serif text-2xl text-[#2A1816] tracking-tight">Event Attendance</h2>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventAttendance} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                    <XAxis dataKey="name" stroke="#8C5A54" fontSize={10} tickLine={false} axisLine={false} tickMargin={5} angle={-35} textAnchor="end" height={60} fontFamily="monospace" />
                    <YAxis stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} fontFamily="monospace" />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#EEDBD5', opacity: 0.4}} wrapperStyle={{ zIndex: 100 }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '15px' }} />
                    <Bar dataKey="expected" name="Expected" fill="#E85F57" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="actual" name="Actual" fill="#8C241E" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rehearsal Attendance */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#DCBAB2]/60">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Core Team Dynamics
                </span>
                <h2 className="font-serif text-2xl text-[#2A1816] tracking-tight">Rehearsal Attendance</h2>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rehearsalAttendance} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                    <XAxis dataKey="week" stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} fontFamily="monospace" />
                    <YAxis stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} fontFamily="monospace" />
                    <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '15px' }} />
                    <Line type="monotone" dataKey="actors" name="Actors Present" stroke="#8C241E" strokeWidth={3} dot={{ fill: '#8C241E', r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="crew" name="Crew Present" stroke="#6E4742" strokeWidth={3} dot={{ fill: '#6E4742', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "auditions" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-500">
            {/* Audition Funnel */}
            <div className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#DCBAB2]/60">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Casting Process
                </span>
                <h2 className="font-serif text-2xl text-[#2A1816] tracking-tight">Audition Funnel</h2>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={auditionFunnel} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" horizontal={false} />
                    <XAxis type="number" stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} fontFamily="monospace" />
                    <YAxis dataKey="stage" type="category" stroke="#2A1816" fontSize={12} fontWeight="bold" tickLine={false} axisLine={false} tickMargin={10} fontFamily="sans-serif" />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#EEDBD5', opacity: 0.4}} wrapperStyle={{ zIndex: 100 }} />
                    <Bar dataKey="count" name="Count" fill="#8C241E" radius={[0, 8, 8, 0]} barSize={35}>
                      {
                        auditionFunnel.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Role Breakdown */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-8 shadow-sm space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#DCBAB2]/60">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> Applicant Interests
                </span>
                <h2 className="font-serif text-2xl text-[#2A1816] tracking-tight">Roles Breakdown</h2>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={auditionRoles}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="applicants"
                      stroke="none"
                    >
                      {auditionRoles.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} wrapperStyle={{ zIndex: 100 }} />
                    <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-10 shadow-sm space-y-8 animate-in fade-in duration-500">
            <div className="space-y-1 pb-6 border-b border-[#DCBAB2]/60">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
                <Server className="w-3.5 h-3.5" /> Technical Infrastructure
              </span>
              <h2 className="font-serif text-3xl text-[#2A1816] tracking-tight">System Telemetry</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[1.5rem] gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="font-sans text-sm font-semibold text-[#2A1816]">Core API Gateway</span>
                  </div>
                  <p className="text-xs text-[#6E4742] font-medium">All microservices responding normally</p>
                </div>
                <span className="font-mono text-2xl text-emerald-700 font-bold tracking-tight">99.98% <span className="text-[10px] uppercase text-[#8C5A54] tracking-widest">Uptime</span></span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[1.5rem] gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#B32D25]"></div>
                    <span className="font-sans text-sm font-semibold text-[#2A1816]">Database Cluster</span>
                  </div>
                  <p className="text-xs text-[#6E4742] font-medium">Secondary read replica lag detected</p>
                </div>
                <span className="font-mono text-2xl text-[#B32D25] font-bold tracking-tight">142ms <span className="text-[10px] uppercase text-[#8C5A54] tracking-widest">Latency</span></span>
              </div>
            </div>

            <div className="h-[300px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={systemUptime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6E4742" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6E4742" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                  <XAxis dataKey="time" stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} fontFamily="monospace" />
                  <YAxis stroke="#8C5A54" fontSize={12} tickLine={false} axisLine={false} fontFamily="monospace" />
                  <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace', paddingTop: '15px' }} />
                  <Area type="monotone" dataKey="latency" name="Latency (ms)" stroke="#6E4742" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
