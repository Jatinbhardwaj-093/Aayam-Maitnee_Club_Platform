import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Activity,
  DollarSign,
  ShieldCheck,
  Users,
  Ticket,
  Plus,
  X,
  Building2
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
  Line,
  ReferenceLine
} from "recharts";
import { CustomSelect } from "@/components/CustomSelect";

// --- INITIAL REALISTIC THEATRICAL DATASETS ---

const initialMonthlyFinancials = [
  { name: "Jan", revenue: 45000, expenses: 32000, patronage: 12000 },
  { name: "Feb", revenue: 52000, expenses: 28000, patronage: 15000 },
  { name: "Mar", revenue: 38000, expenses: 41000, patronage: 10000 },
  { name: "Apr", revenue: 65000, expenses: 35000, patronage: 22000 },
  { name: "May", revenue: 78000, expenses: 42000, patronage: 28000 },
  { name: "Jun", revenue: 85000, expenses: 39000, patronage: 32000 },
  { name: "Jul", revenue: 110000, expenses: 45000, patronage: 45000 },
  { name: "Aug", revenue: 145000, expenses: 54000, patronage: 62000 },
  { name: "Sep", revenue: 98000, expenses: 48000, patronage: 38000 },
  { name: "Oct", revenue: 88000, expenses: 40000, patronage: 34000 },
  { name: "Nov", revenue: 75000, expenses: 35000, patronage: 25000 },
  { name: "Dec", revenue: 105000, expenses: 42000, patronage: 48000 }
];

const initialPlayBudgets = [
  { name: "Macbeth", budget: 150000, actual: 142000, revenue: 185000 },
  { name: "Ashadh Ka Ek Din", budget: 120000, actual: 115000, revenue: 145000 },
  { name: "Hayavadana", budget: 180000, actual: 168000, revenue: 210000 },
  { name: "Tughlaq", budget: 200000, actual: 195000, revenue: 240000 },
  { name: "Andha Yug", budget: 130000, actual: 128000, revenue: 160000 },
  { name: "Aadhe Adhure", budget: 110000, actual: 105000, revenue: 135000 }
];

const departmentExpenses = [
  { department: "Stage Sets & Props", amount: 145000 },
  { department: "Costumes & SFX Makeup", amount: 98000 },
  { department: "Audio & Lighting Rentals", amount: 112000 },
  { department: "Script Royalty & Rights", amount: 65000 },
  { department: "Rehearsal Refreshments", amount: 38000 },
  { department: "Print & Playbill Promo", amount: 42000 }
];

const boxOfficeStagings = [
  { staging: "Opening Night (Thu)", reserved: 440, capacity: 450, fill_rate: 98 },
  { staging: "Matinee 1 (Fri)", reserved: 385, capacity: 450, fill_rate: 86 },
  { staging: "Evening Gala (Fri)", reserved: 450, capacity: 450, fill_rate: 100 },
  { staging: "Matinee 2 (Sat)", reserved: 410, capacity: 450, fill_rate: 91 },
  { staging: "Closing Night (Sat)", reserved: 450, capacity: 450, fill_rate: 100 }
];

const patronGrowthWeekly = [
  { week: "Wk 1", patrons: 14, funds: 18500 },
  { week: "Wk 2", patrons: 28, funds: 42000 },
  { week: "Wk 3", patrons: 45, funds: 68500 },
  { week: "Wk 4", patrons: 72, funds: 115000 },
  { week: "Wk 5", patrons: 98, funds: 164000 },
  { week: "Wk 6", patrons: 135, funds: 228000 },
  { week: "Wk 7", patrons: 178, funds: 310000 }
];

const ticketTiers = [
  { name: "Complimentary Student Pass", count: 1250, value: 58 },
  { name: "Student VIP Reserved Row", count: 540, value: 25 },
  { name: "Society Patron Tier", count: 360, value: 17 }
];

const bookingVelocity = [
  { daysBefore: "14 Days", passes: 85 },
  { daysBefore: "10 Days", passes: 190 },
  { daysBefore: "7 Days", passes: 340 },
  { daysBefore: "4 Days", passes: 680 },
  { daysBefore: "2 Days", passes: 1120 },
  { daysBefore: "Show Day", passes: 1450 }
];

const castingFunnel = [
  { stage: "Applications Received", count: 342, rate: "100%" },
  { stage: "Monologue Auditions", count: 268, rate: "78%" },
  { stage: "Callback Round", count: 94, rate: "27%" },
  { stage: "Final Cast Selected", count: 38, rate: "11%" },
  { stage: "Stage Crew Assigned", count: 52, rate: "15%" }
];

const roleApplicantBreakdown = [
  { role: "Lead Roles", applicants: 96, selected: 8 },
  { role: "Supporting", applicants: 78, selected: 10 },
  { role: "Ensemble", applicants: 94, selected: 20 },
  { role: "Stage Crew", applicants: 38, selected: 14 },
  { role: "Tech / Sound", applicants: 36, selected: 18 }
];

const rehearsalWeeklyAttendance = [
  { week: "Week 1", actors_present: 32, crew_present: 14, rehearsal_hours: 12 },
  { week: "Week 2", actors_present: 34, crew_present: 18, rehearsal_hours: 16 },
  { week: "Week 3", actors_present: 30, crew_present: 20, rehearsal_hours: 18 },
  { week: "Week 4", actors_present: 36, crew_present: 22, rehearsal_hours: 22 },
  { week: "Week 5", actors_present: 35, crew_present: 25, rehearsal_hours: 25 },
  { week: "Week 6", actors_present: 38, crew_present: 28, rehearsal_hours: 30 },
  { week: "Tech Week", actors_present: 38, crew_present: 30, rehearsal_hours: 42 }
];

const propCostumeInventory = [
  { category: "Period Costumes", in_staging: 48, in_rehearsal: 24, archived: 65 },
  { category: "Stage Props & Arms", in_staging: 36, in_rehearsal: 18, archived: 42 },
  { category: "Acoustic Mics & Cues", in_staging: 22, in_rehearsal: 8, archived: 14 },
  { category: "Lighting Spots & Gobos", in_staging: 30, in_rehearsal: 12, archived: 20 }
];

const venueUtilizationHours = [
  { venue: "CLT Main Stage", booked_hours: 128, rehearsals: 85, shows: 43 },
  { venue: "SAC Auditorium", booked_hours: 94, rehearsals: 70, shows: 24 },
  { venue: "OAT Amphitheatre", booked_hours: 56, rehearsals: 46, shows: 10 },
  { venue: "Drama Studio Room 3", booked_hours: 165, rehearsals: 165, shows: 0 }
];

const COLORS = ["#8C241E", "#B32D25", "#E85F57", "#6E4742", "#8C5A54", "#A6352F"];

export default function PlatformAnalytics() {
  const [activeTab, setActiveTab] = useState<"financials" | "boxoffice" | "auditions" | "rehearsals">("financials");
  const [selectedProduction, setSelectedProduction] = useState<string>("All Productions");
  
  // Dynamic State for Financials & Records
  const [summary, setSummary] = useState({
    total_revenue: 545000,
    total_expenses: 168000,
    net_surplus: 377000,
    sponsorship_revenue: 265000,
    ticket_revenue: 145000,
    patron_donations: 135000
  });

  const [financialRecords, setFinancialRecords] = useState([
    { id: "TX-101", title: "FabIndia Title Sponsorship (Hayavadana)", record_type: "Income", amount: 150000, date: "Aug 20, 2026", department: "Sponsorship" },
    { id: "TX-102", title: "IITM Cultural Council Production Grant", record_type: "Income", amount: 115000, date: "Aug 18, 2026", department: "Grants" },
    { id: "TX-103", title: "CLT Mainstage Acoustic Rig Deposit", record_type: "Expense", amount: 48000, date: "Aug 15, 2026", department: "Audio/Visual" },
    { id: "TX-104", title: "Period Royal Costumes & SFX Makeup", record_type: "Expense", amount: 36000, date: "Aug 12, 2026", department: "Wardrobe" },
    { id: "TX-105", title: "Early Bird Reserved Pass Presales", record_type: "Income", amount: 62000, date: "Aug 10, 2026", department: "Box Office" },
    { id: "TX-106", title: "Giradoux Script Performance Royalty", record_type: "Expense", amount: 25000, date: "Aug 05, 2026", department: "Licensing" }
  ]);

  // Modal for Adding / Updating Financial Entries
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Income");
  const [newAmount, setNewAmount] = useState("");
  const [newDepartment, setNewDepartment] = useState("Box Office");

  // Load backend or localStorage fallback
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aayam_analytics_financials");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.summary) setSummary(parsed.summary);
        if (parsed.records) setFinancialRecords(parsed.records);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddFinancialRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(amt) || amt <= 0) return;

    const newRecord = {
      id: `TX-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle.trim(),
      record_type: newType,
      amount: amt,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      department: newDepartment
    };

    const updatedRecords = [newRecord, ...financialRecords];
    const newRev = newType === "Income" ? summary.total_revenue + amt : summary.total_revenue;
    const newExp = newType === "Expense" ? summary.total_expenses + amt : summary.total_expenses;
    const updatedSummary = {
      ...summary,
      total_revenue: newRev,
      total_expenses: newExp,
      net_surplus: newRev - newExp
    };

    setFinancialRecords(updatedRecords);
    setSummary(updatedSummary);
    localStorage.setItem("aayam_analytics_financials", JSON.stringify({ summary: updatedSummary, records: updatedRecords }));

    setNewTitle("");
    setNewAmount("");
    setUpdateModalOpen(false);
  };

  const revenueBreakdown = [
    { name: "Title Sponsorships", value: summary.sponsorship_revenue },
    { name: "Ticket Pass Sales", value: summary.ticket_revenue },
    { name: "Patron Donations", value: summary.patron_donations }
  ];

  // Tooltip Helper
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FAF2EE] border border-[#DCBAB2] p-4 rounded-2xl shadow-xl min-w-[170px] z-[100] relative">
          <p className="font-mono text-xs font-bold text-[#8C5A54] uppercase mb-2">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const isMoney = ["revenue", "expenses", "budget", "actual", "funds", "amount", "patronage"].includes(entry.dataKey);
              let val = entry.value?.toLocaleString();
              if (isMoney) val = `₹${val}`;
              if (entry.dataKey === "fill_rate") val = `${val}%`;

              return (
                <div key={index} className="flex items-center justify-between gap-3 text-xs text-[#2A1816]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color || entry.payload.fill || "#8C241E" }} />
                    <span className="font-medium truncate max-w-[110px]">{entry.name}:</span>
                  </div>
                  <span className="font-mono font-bold">{val}</span>
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
      return (
        <div className="bg-[#FAF2EE] border border-[#DCBAB2] p-3 rounded-xl shadow-xl z-[100] relative">
          <div className="flex items-center gap-2 text-xs text-[#2A1816]">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.payload.fill || "#8C241E" }} />
            <span className="font-semibold">{entry.name}:</span>
            <span className="font-mono font-bold">
              {typeof entry.value === "number" && entry.value > 1000 ? `₹${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCBAB2] pb-8">
          <div className="space-y-2.5">
            <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8C241E]" />
              <span>Maintainer Operations & Ledger</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Platform Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#6E4742] max-w-2xl font-light leading-relaxed">
              Comprehensive telemetry for production budgets, box office passes, casting funnels, rehearsal logistics, and society finances.
            </p>
          </div>

          {/* Action Suite & Production Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="min-w-[190px]">
              <CustomSelect
                value={selectedProduction}
                onChange={(val) => setSelectedProduction(val)}
                options={[
                  { value: "All Productions", label: "All Repertory Plays" },
                  { value: "Macbeth", label: "Macbeth (2026)" },
                  { value: "Hayavadana", label: "Hayavadana (2026)" },
                  { value: "Tughlaq", label: "Tughlaq (2026)" },
                  { value: "Ashadh Ka Ek Din", label: "Ashadh Ka Ek Din" }
                ]}
              />
            </div>

            <button
              type="button"
              onClick={() => setUpdateModalOpen(true)}
              className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F]"
            >
              <Plus className="w-4 h-4 text-[#FFD0CC]" />
              <span>Log Financial Record</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Concise & Clean) */}
        <div className="w-full flex bg-[#FAF2EE] p-1.5 rounded-2xl sm:rounded-full border border-[#DCBAB2] shadow-inner overflow-x-auto custom-scrollbar">
          {[
            { id: "financials", label: "Financials", icon: DollarSign },
            { id: "boxoffice", label: "Box Office", icon: Ticket },
            { id: "auditions", label: "Auditions & Cast", icon: Users },
            { id: "rehearsals", label: "Rehearsals & Venues", icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[130px] px-5 py-2.5 rounded-xl sm:rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${
                  isActive
                    ? "bg-[#8C241E] text-[#FDF8F7] shadow-md border border-[#A6352F]"
                    : "text-[#6E4742] hover:text-[#2A1816] hover:bg-[#F2E5E0] border border-transparent"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#FFD0CC]" : "text-[#8C5A54]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* High-Level Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Gross Revenue</span>
              <DollarSign className="w-4 h-4 text-[#8C241E]" />
            </div>
            <div className="mt-4 space-y-1">
              <div className="font-serif text-3xl text-[#2A1816] tracking-tight">₹{summary.total_revenue.toLocaleString()}</div>
              <p className="text-[11px] text-[#6E4742] font-mono">Sponsorships + Tickets + Grants</p>
            </div>
          </div>

          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Season Expenses</span>
              <Activity className="w-4 h-4 text-[#8C241E]" />
            </div>
            <div className="mt-4 space-y-1">
              <div className="font-serif text-3xl text-[#2A1816] tracking-tight">₹{summary.total_expenses.toLocaleString()}</div>
              <p className="text-[11px] text-[#6E4742] font-mono">Sets, Outfits & Audio Rentals</p>
            </div>
          </div>

          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-emerald-800">Net Surplus</span>
              <TrendingUp className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="mt-4 space-y-1">
              <div className="font-serif text-3xl text-[#2A1816] tracking-tight">₹{summary.net_surplus.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-700 font-mono">Society Treasury Reserve</p>
            </div>
          </div>

          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Box Office Occupancy</span>
              <Ticket className="w-4 h-4 text-[#8C241E]" />
            </div>
            <div className="mt-4 space-y-1">
              <div className="font-serif text-3xl text-[#2A1816] tracking-tight">95.2%</div>
              <p className="text-[11px] text-[#6E4742] font-mono">2,135 Seats Allocated in 2026</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: PRODUCTION FINANCE & CASHFLOW */}
        {/* ========================================================================= */}
        {activeTab === "financials" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Row 1: Monthly Cashflow Dynamics + Sources Pie */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Cash Flow Area Chart (8 cols) */}
              <div className="lg:col-span-8 bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCBAB2]">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Cashflow Dynamics</span>
                    <h2 className="font-serif text-2xl text-[#2A1816]">Monthly Inflow vs Outflow</h2>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-[#8C5A54] bg-[#FAF2EE] px-3 py-1 rounded-full border border-[#DCBAB2]">
                    <span>Fiscal Year 2026</span>
                  </div>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={initialMonthlyFinancials} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8C241E" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#8C241E" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6E4742" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#6E4742" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorPatron" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E85F57" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#E85F57" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="name" stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "12px" }} />
                      <Area type="monotone" dataKey="revenue" name="Total Inflow" stroke="#8C241E" strokeWidth={3} fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="expenses" name="Expenditure" stroke="#6E4742" strokeWidth={2.5} fill="url(#colorExp)" />
                      <Area type="monotone" dataKey="patronage" name="Patron Donations" stroke="#E85F57" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorPatron)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Revenue Sources Breakdown (4 cols) */}
              <div className="lg:col-span-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Inflow Streams</span>
                  <h3 className="font-serif text-xl text-[#2A1816]">Revenue Breakdown</h3>
                </div>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {revenueBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2 border-t border-[#DCBAB2] space-y-2 text-xs font-mono text-[#6E4742]">
                  <div className="flex items-center justify-between">
                    <span>Sponsorship Share:</span>
                    <strong className="text-[#2A1816]">48.6%</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Direct Patronage:</span>
                    <strong className="text-[#2A1816]">24.8%</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Play Budgets vs Actual Spend + Department Expenditure */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Play Budgets (7 cols) */}
              <div className="lg:col-span-7 bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCBAB2]">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Play Ledger</span>
                    <h2 className="font-serif text-2xl text-[#2A1816]">Production Budget vs Actual</h2>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C241E] font-bold bg-[#FAF2EE] px-3 py-1 rounded-full border border-[#DCBAB2]">
                    6 Staged Plays
                  </span>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={initialPlayBudgets} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="name" stroke="#8C5A54" fontSize={10} tickLine={false} axisLine={false} angle={-25} textAnchor="end" height={40} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                      <Bar dataKey="budget" name="Allocated Budget" fill="#E85F57" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="actual" name="Actual Cost" fill="#8C241E" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="revenue" name="Box Office Inflow" fill="#5C3B37" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Departmental Expenses (5 cols) */}
              <div className="lg:col-span-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Expense Breakdown</span>
                  <h3 className="font-serif text-xl text-[#2A1816]">Expenditure by Department</h3>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentExpenses} layout="vertical" margin={{ top: 5, right: 15, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" horizontal={false} />
                      <XAxis type="number" stroke="#8C5A54" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} fontFamily="monospace" />
                      <YAxis dataKey="department" type="category" stroke="#2A1816" fontSize={10} tickLine={false} axisLine={false} width={120} fontFamily="sans-serif" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" name="Expense Amount" fill="#8C241E" radius={[0, 6, 6, 0]} maxBarSize={22}>
                        {departmentExpenses.map((_, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 3: Live Financial Journal Ledger Table */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#DCBAB2]">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Official Society Audit</span>
                  <h3 className="font-serif text-xl text-[#2A1816]">Recent Financial Journal Records</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setUpdateModalOpen(true)}
                  className="px-4 py-2 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#8C241E]" />
                  <span>Add Transaction</span>
                </button>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#DCBAB2] text-[#8C5A54] uppercase tracking-wider">
                      <th className="pb-3 font-bold">Ref ID</th>
                      <th className="pb-3 font-bold">Transaction Title</th>
                      <th className="pb-3 font-bold">Department</th>
                      <th className="pb-3 font-bold">Type</th>
                      <th className="pb-3 font-bold">Date</th>
                      <th className="pb-3 font-bold text-right">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCBAB2]/60 text-[#2A1816]">
                    {financialRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F2E5E0]/60 transition-colors">
                        <td className="py-3 font-bold text-[#8C241E]">{rec.id}</td>
                        <td className="py-3 font-sans font-medium">{rec.title}</td>
                        <td className="py-3 text-[#6E4742]">{rec.department || "General"}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            rec.record_type === "Income" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-rose-100 text-rose-800 border border-rose-300"
                          }`}>
                            {rec.record_type}
                          </span>
                        </td>
                        <td className="py-3 text-[#6E4742]">{rec.date}</td>
                        <td className={`py-3 font-bold text-right ${rec.record_type === "Income" ? "text-emerald-700" : "text-[#8C241E]"}`}>
                          {rec.record_type === "Income" ? "+" : "-"}₹{rec.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BOX OFFICE, PASSES & PATRONAGE */}
        {/* ========================================================================= */}
        {activeTab === "boxoffice" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Row 1: Staging Fill Rate & Capacity Benchmark + Patron Growth */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Staging Fill Rate (7 cols) */}
              <div className="lg:col-span-7 bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCBAB2]">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Show Attendance</span>
                    <h2 className="font-serif text-2xl text-[#2A1816]">Staging Night Pass Fill Rate</h2>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#8C241E] bg-[#FAF2EE] px-3 py-1 rounded-full border border-[#DCBAB2]">
                    450 Hall Capacity
                  </span>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={boxOfficeStagings} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="staging" stroke="#8C5A54" fontSize={10} tickLine={false} axisLine={false} angle={-20} textAnchor="end" height={40} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} domain={[0, 500]} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                      <ReferenceLine y={450} label={{ value: "Max Hall Capacity", fill: "#8C241E", fontSize: 10, position: "top" }} stroke="#8C241E" strokeDasharray="3 3" />
                      <Bar dataKey="reserved" name="Reserved Passes" fill="#8C241E" radius={[4, 4, 0, 0]} maxBarSize={38} />
                      <Bar dataKey="capacity" name="Auditorium Capacity" fill="#DCBAB2" radius={[4, 4, 0, 0]} maxBarSize={38} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cumulative Patron Growth (5 cols) */}
              <div className="lg:col-span-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Theatre Patronage</span>
                  <h3 className="font-serif text-xl text-[#2A1816]">Patrons & Funds Growth</h3>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={patronGrowthWeekly} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFunds" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8C241E" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8C241E" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="week" stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v / 1000}k`} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                      <Area type="monotone" dataKey="funds" name="Total Raised (INR)" stroke="#8C241E" strokeWidth={3} fill="url(#colorFunds)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 2: Admission Tier Distribution + Booking Velocity Surge Curve */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Ticket Tier Pie (4 cols) */}
              <div className="lg:col-span-4 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Pass Categories</span>
                  <h3 className="font-serif text-xl text-[#2A1816]">Admission Tier Distribution</h3>
                </div>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketTiers}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {ticketTiers.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "10px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Booking Surge Velocity (8 cols) */}
              <div className="lg:col-span-8 bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#DCBAB2]">
                  <div>
                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Reservation Dynamics</span>
                    <h2 className="font-serif text-2xl text-[#2A1816]">Ticket Velocity (Surge Curve)</h2>
                  </div>
                  <span className="text-[10px] font-mono text-[#8C241E] font-bold bg-[#FAF2EE] px-3 py-1 rounded-full border border-[#DCBAB2]">
                    Countdown Days
                  </span>
                </div>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={bookingVelocity} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="daysBefore" stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                      <Line type="monotone" dataKey="passes" name="Cumulative Passes Reserved" stroke="#8C241E" strokeWidth={3} dot={{ fill: "#8C241E", r: 4 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: AUDITIONS & CASTING DYNAMICS */}
        {/* ========================================================================= */}
        {activeTab === "auditions" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Funnel Bar Chart (6 cols) */}
              <div className="lg:col-span-6 bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Talent Pipeline</span>
                  <h2 className="font-serif text-2xl text-[#2A1816]">Audition & Casting Funnel</h2>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={castingFunnel} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" horizontal={false} />
                      <XAxis type="number" stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <YAxis dataKey="stage" type="category" stroke="#2A1816" fontSize={11} fontWeight="500" tickLine={false} axisLine={false} width={145} fontFamily="sans-serif" />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Candidates" fill="#8C241E" radius={[0, 8, 8, 0]} maxBarSize={28}>
                        {castingFunnel.map((_, idx) => (
                          <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Roles Breakdown: Applied vs Cast (6 cols) */}
              <div className="lg:col-span-6 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Role Selectivity</span>
                  <h3 className="font-serif text-2xl text-[#2A1816]">Applicants vs Final Cast</h3>
                </div>

                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleApplicantBreakdown} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="role" stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} interval={0} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace", paddingTop: "5px" }} />
                      <Bar dataKey="applicants" name="Total Applied" fill="#E85F57" radius={[4, 4, 0, 0]} maxBarSize={30} />
                      <Bar dataKey="selected" name="Selected & Cast" fill="#8C241E" radius={[4, 4, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REHEARSALS, ASSETS & VENUES */}
        {/* ========================================================================= */}
        {activeTab === "rehearsals" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Row 1: Rehearsal Attendance & Rehearsal Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Rehearsal Attendance Area Chart (7 cols) */}
              <div className="lg:col-span-7 bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Ensemble Dynamics</span>
                  <h2 className="font-serif text-2xl text-[#2A1816]">Weekly Rehearsal Attendance</h2>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={rehearsalWeeklyAttendance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                      <XAxis dataKey="week" stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <YAxis stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                      <Line type="monotone" dataKey="actors_present" name="Actors Present" stroke="#8C241E" strokeWidth={3} dot={{ fill: "#8C241E", r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="crew_present" name="Crew Present" stroke="#6E4742" strokeWidth={2.5} dot={{ fill: "#6E4742", r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="rehearsal_hours" name="Total Hours / Week" stroke="#E85F57" strokeWidth={2} strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Venue Utilization (5 cols) */}
              <div className="lg:col-span-5 bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
                <div className="pb-4 border-b border-[#DCBAB2]">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Stage Booking</span>
                  <h3 className="font-serif text-xl text-[#2A1816]">Venue Hours Utilization</h3>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={venueUtilizationHours} layout="vertical" margin={{ top: 5, right: 15, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" horizontal={false} />
                      <XAxis type="number" stroke="#8C5A54" fontSize={10} tickLine={false} axisLine={false} fontFamily="monospace" />
                      <YAxis dataKey="venue" type="category" stroke="#2A1816" fontSize={10} tickLine={false} axisLine={false} width={120} fontFamily="sans-serif" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: "10px", fontFamily: "monospace" }} />
                      <Bar dataKey="rehearsals" name="Rehearsal Hours" fill="#8C241E" radius={[0, 4, 4, 0]} maxBarSize={20} />
                      <Bar dataKey="shows" name="Live Show Hours" fill="#E85F57" radius={[0, 4, 4, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 2: Props & Costume Inventory Health Stacked Bar */}
            <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-7 sm:p-8 shadow-sm space-y-6">
              <div className="pb-4 border-b border-[#DCBAB2]">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54] block">Asset Management</span>
                <h3 className="font-serif text-2xl text-[#2A1816]">Prop & Costume Inventory Status</h3>
              </div>

              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propCostumeInventory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#DCBAB2" vertical={false} />
                    <XAxis dataKey="category" stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                    <YAxis stroke="#8C5A54" fontSize={11} tickLine={false} axisLine={false} fontFamily="monospace" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                    <Bar dataKey="in_staging" name="Active on Stage" fill="#8C241E" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={45} />
                    <Bar dataKey="in_rehearsal" name="In Rehearsal Use" fill="#E85F57" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={45} />
                    <Bar dataKey="archived" name="Archived in Storage" fill="#DCBAB2" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: LOG NEW FINANCIAL RECORD & METRIC */}
        {/* ========================================================================= */}
        {updateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-8 shadow-2xl relative max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
              
              {/* Close button */}
              <button
                type="button"
                onClick={() => setUpdateModalOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-20"
                title="Close"
              >
                <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              </button>

              <div className="pb-4 border-b border-[#DCBAB2]">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#8C5A54] block">
                  Official Ledger Audit
                </span>
                <h3 className="font-serif text-2xl text-[#2A1816] font-normal pt-1">
                  Log Financial Record
                </h3>
              </div>

              <form onSubmit={handleAddFinancialRecord} className="space-y-4 pt-5 overflow-y-auto flex-1 custom-scrollbar">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#8C5A54] uppercase font-bold block">
                    Transaction Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Stage Acoustic Rig Rental Deposit"
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E]"
                  />
                </div>

                {/* Amount & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#8C5A54] uppercase font-bold block">
                      Amount (INR) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="e.g. 35000"
                      className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-[#8C5A54] uppercase font-bold block">
                      Type *
                    </label>
                    <CustomSelect
                      value={newType}
                      onChange={(val) => setNewType(val)}
                      options={[
                        { value: "Income", label: "Inflow / Income (+)" },
                        { value: "Expense", label: "Outflow / Expense (-)" }
                      ]}
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#8C5A54] uppercase font-bold block">
                    Department Category
                  </label>
                  <CustomSelect
                    value={newDepartment}
                    onChange={(val) => setNewDepartment(val)}
                    options={[
                      { value: "Box Office", label: "Box Office & Passes" },
                      { value: "Sponsorship", label: "Corporate Title Sponsorship" },
                      { value: "Grants", label: "Council & Cultural Grants" },
                      { value: "Wardrobe", label: "Costumes & SFX Makeup" },
                      { value: "Audio/Visual", label: "Lighting & Acoustic Rig" },
                      { value: "Licensing", label: "Script Performance Rights" }
                    ]}
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#DCBAB2]">
                  <button
                    type="button"
                    onClick={() => setUpdateModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save & Update Charts</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
