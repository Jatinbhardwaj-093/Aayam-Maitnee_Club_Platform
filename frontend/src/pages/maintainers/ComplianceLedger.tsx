import { useState } from "react";
import {
    ShieldAlert,
    Receipt,
    Copy,
    Search,
    ArrowRight,
    Loader2,
    Calendar,
    User,
    CheckCircle2,
    X,
    Filter,
    FileWarning,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Activity
} from "lucide-react";

interface Transaction {
    id: string;
    date: string;
    event: string;
    member: string;
    type: string;
    amount: number;
    status: 'Cleared' | 'Pending Audit';
}

interface Anomaly {
    id: string;
    title: string;
    description: string;
    trxId: string;
    icon: any;
    severity: 'High' | 'Medium' | 'Low';
    rule: string;
}

const CustomSelect = ({ value, onChange, options, icon: Icon, label }: any) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative min-w-[180px]">
            <label className="block font-mono text-[10px] font-bold mb-1.5 uppercase tracking-wider text-[#8C5A54]">{label}</label>
            <div
                onClick={() => setOpen(!open)}
                className="bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] font-semibold flex items-center justify-between cursor-pointer hover:bg-[#E8D6CF] transition-colors"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-[#8C5A54]" />}
                    <span className="font-mono">{value}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#8C5A54]" />
            </div>
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-full bg-[#F5EAE6] border border-[#DEBEB7] rounded-2xl p-2 shadow-2xl z-50">
                        {options.map((opt: string) => (
                            <button
                                key={opt}
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className={`w-full text-left rounded-xl p-2.5 text-[11px] font-mono font-medium flex items-center gap-2 transition-colors ${value === opt
                                        ? "bg-[#8C241E] text-[#FDF8F7] font-bold shadow-xs"
                                        : "hover:bg-[#EEDBD5] text-[#2A1816]"
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default function ComplianceLedger() {
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: "#TRX-9901", date: "Oct 24, 2026", event: "Spring Musical", member: "Sarah Jenkins", type: "Reimbursement", amount: -450.00, status: "Cleared" },
        { id: "#TRX-9902", date: "Oct 23, 2026", event: "General Fund", member: "Marcus Thorne", type: "Deposit", amount: 1200.00, status: "Cleared" },
        { id: "#TRX-9903", date: "Oct 22, 2026", event: "Fall Play", member: "Elena Rostova", type: "Reimbursement", amount: -85.50, status: "Pending Audit" },
        { id: "#TRX-9904", date: "Oct 20, 2026", event: "Gala Fundraiser", member: "David Chen", type: "Vendor Payout", amount: -3500.00, status: "Cleared" },
        { id: "#TRX-9905", date: "Oct 19, 2026", event: "Gala Fundraiser", member: "Anonymous", type: "Donation", amount: 5000.00, status: "Cleared" },
        { id: "#TRX-9906", date: "Oct 18, 2026", event: "Set Design", member: "Home Depot", type: "Purchase", amount: -342.12, status: "Cleared" }
    ]);

    const [anomalies, setAnomalies] = useState<Anomaly[]>([
        {
            id: "anom-1",
            title: "Missing Receipt",
            description: "Reimbursement #TRX-9903 lacks supporting documentation.",
            trxId: "#TRX-9903",
            icon: Receipt,
            severity: "High",
            rule: "Rule 14: Reimbursements exceeding ₹50 require valid receipts."
        },
        {
            id: "anom-2",
            title: "Duplicate Entry Warning",
            description: "Identical amounts (₹342.12) posted twice on Oct 18 for 'Home Depot'.",
            trxId: "#TRX-9906",
            icon: Copy,
            severity: "Medium",
            rule: "Rule 08: Double-posting checking on matching merchant & values."
        },
        {
            id: "anom-3",
            title: "Unusual Deposit Size",
            description: "Donation of ₹5,000.00 exceeds standard deviation for anonymous gifts.",
            trxId: "#TRX-9905",
            icon: ShieldAlert,
            severity: "Low",
            rule: "Rule 23: Anti-money laundering tracking for private contributions."
        }
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Events");
    const [selectedMember, setSelectedMember] = useState("All Members");
    const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");

    const [isScanning, setIsScanning] = useState(false);
    const [showScanComplete, setShowScanComplete] = useState(false);
    const [scanText, setScanText] = useState("");
    const [activeAnomalyDetail, setActiveAnomalyDetail] = useState<Anomaly | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const filteredTransactions = transactions.filter(t => {
        const matchesQuery = searchQuery === "" ||
            t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.member.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.amount.toString().includes(searchQuery);

        const matchesCategory = selectedCategory === "All Events" || t.event === selectedCategory;
        const matchesMember = selectedMember === "All Members" || t.member === selectedMember;

        return matchesQuery && matchesCategory && matchesMember;
    });

    const triggerAuditScan = () => {
        setIsScanning(true);
        setScanText("Initializing compliance database link...");
        setTimeout(() => setScanText("Ingesting transaction receipt attachments..."), 500);
        setTimeout(() => setScanText("Evaluating compliance rules against 248 records..."), 1000);
        setTimeout(() => {
            setIsScanning(false);
            setShowScanComplete(true);
            triggerToast("Full audit scan completed. Validated 248 records.");
        }, 1600);
    };

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleResolveAnomaly = (anomaly: Anomaly, action: 'upload' | 'request' | 'dismiss' | 'merge') => {
        setAnomalies(prev => prev.filter(a => a.id !== anomaly.id));
        setActiveAnomalyDetail(null);

        if (anomaly.trxId === "#TRX-9903") {
            setTransactions(prev => prev.map(t =>
                t.id === "#TRX-9903" ? { ...t, status: "Cleared" } : t
            ));
        }

        if (action === 'upload') triggerToast(`Document uploaded. ${anomaly.trxId} Cleared.`);
        else if (action === 'request') triggerToast(`Receipt request dispatched to member.`);
        else if (action === 'dismiss') triggerToast(`Compliance flag dismissed.`);
        else if (action === 'merge') triggerToast(`Duplicate entries combined successfully.`);
    };

    const handleRowStatusPillClick = (trx: Transaction) => {
        if (trx.status === "Pending Audit") {
            const correspondingAnomaly = anomalies.find(a => a.trxId === trx.id);
            if (correspondingAnomaly) {
                setActiveAnomalyDetail(correspondingAnomaly);
            } else {
                setActiveAnomalyDetail({
                    id: "temp",
                    title: "Manual Ledger Check",
                    description: `Transaction ${trx.id} is flagged for compliance auditing.`,
                    trxId: trx.id,
                    icon: FileWarning,
                    severity: "High",
                    rule: "Rule 01: Audit trigger manually initialized."
                });
            }
        } else {
            triggerToast(`Transaction ${trx.id} is already cleared.`);
        }
    };

    return (
        <div className="bg-[#E7DDD3] min-h-screen font-sans p-6 md:p-10 text-[#5C3B37]">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DCBAB2] pb-8">
                    <div className="space-y-3">
                        <div className="font-mono text-xs uppercase font-bold tracking-widest text-[#8C5A54] flex items-center gap-2">
                            <Activity className="w-4 h-4 text-[#8C241E]" />
                            <span>Maintainer Operations</span>
                        </div>
                        <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
                            Compliance Ledger
                        </h1>
                        <p className="text-sm text-[#6E4742] max-w-2xl font-light leading-relaxed">
                            Secured financial audit logs and automated transaction flags. Mandatory review required before closing the monthly theatrical ledger.
                        </p>
                    </div>
                </div>

                {/* Anomalies Panel Block */}
                {anomalies.length > 0 && (
                    <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-10 shadow-sm animate-in fade-in duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8C241E]/5 to-transparent rounded-bl-full pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DCBAB2]/60">
                                <div className="space-y-1">
                                    <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C241E] flex items-center gap-2">
                                        <ShieldAlert className="w-3.5 h-3.5" /> Action Required
                                    </span>
                                    <h3 className="font-serif text-2xl text-[#2A1816] tracking-tight">Critical Compliance Anomalies</h3>
                                </div>
                                <button
                                    onClick={triggerAuditScan}
                                    className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 transition-all cursor-pointer border border-[#A6352F] whitespace-nowrap"
                                >
                                    Run Audit Scan
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                {anomalies.map(anom => {
                                    const AnomIcon = anom.icon;
                                    return (
                                        <div
                                            key={anom.id}
                                            className="bg-[#FAF2EE] rounded-[1.5rem] p-6 border border-[#DCBAB2] flex flex-col gap-4 hover:border-[#B32D25]/50 hover:shadow-md transition-all cursor-pointer group"
                                            onClick={() => setActiveAnomalyDetail(anom)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="w-10 h-10 rounded-full bg-[#EEDBD5] border border-[#D5AAA2] flex items-center justify-center text-[#8C241E] group-hover:bg-[#8C241E] group-hover:text-[#FDF8F7] transition-colors">
                                                    <AnomIcon className="w-5 h-5" />
                                                </div>
                                                <span className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${anom.severity === 'High' ? 'bg-[#FDECEB] text-[#B32D25] border-[#FDECEB]' : 'bg-[#EEDBD5] text-[#8C5A54] border-[#D5AAA2]'}`}>
                                                    {anom.severity}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-serif text-lg text-[#2A1816] tracking-tight mb-1">{anom.title}</h4>
                                                <p className="font-sans text-xs text-[#6E4742] leading-relaxed">{anom.description}</p>
                                            </div>
                                            <div className="mt-auto pt-4 border-t border-[#DCBAB2]/50 flex items-center gap-1.5 text-xs font-mono font-bold text-[#8C241E] uppercase tracking-wider group-hover:text-[#B32D25]">
                                                Review Detail <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                )}

                {/* Audit Ledger List Main area */}
                <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-10 shadow-sm flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#DCBAB2]/60">
                        <div className="space-y-1">
                            <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#8C5A54]">Database</span>
                            <h2 className="font-serif text-3xl text-[#2A1816] tracking-tight">Audit Ledger</h2>
                        </div>
                    </div>

                    {/* Custom Filter Controls */}
                    <div className="flex flex-wrap gap-4 items-end justify-between bg-[#F5EAE6] p-4 rounded-2xl border border-[#DEBEB7]">
                        <div className="flex flex-wrap gap-4 items-center flex-1">
                            <CustomSelect
                                label="Date Range"
                                icon={Calendar}
                                value={selectedPeriod}
                                onChange={setSelectedPeriod}
                                options={["Last 30 Days", "Q1 2026", "Fiscal Year 2025", "Custom Range..."]}
                            />
                            <CustomSelect
                                label="Event Category"
                                icon={Filter}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                options={["All Events", "Spring Musical", "Fall Play", "Gala Fundraiser", "General Fund", "Set Design"]}
                            />
                            <CustomSelect
                                label="Member Entity"
                                icon={User}
                                value={selectedMember}
                                onChange={setSelectedMember}
                                options={["All Members", "Sarah Jenkins", "Marcus Thorne", "Elena Rostova", "David Chen", "Anonymous", "Home Depot"]}
                            />

                            {(selectedCategory !== "All Events" || selectedMember !== "All Members" || searchQuery !== "" || selectedPeriod !== "Last 30 Days") && (
                                <button
                                    onClick={() => {
                                        setSelectedCategory("All Events");
                                        setSelectedMember("All Members");
                                        setSelectedPeriod("Last 30 Days");
                                        setSearchQuery("");
                                    }}
                                    className="text-[10px] font-mono text-[#8C241E] hover:underline font-bold flex items-center gap-1 mb-2.5 ml-2 uppercase tracking-wider"
                                >
                                    <X className="w-3.5 h-3.5" /> Clear Filters
                                </button>
                            )}
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C5A54]" />
                            <input
                                className="w-full bg-[#E8D6CF]/70 border border-[#D5AAA2] focus:border-[#8C241E] focus:bg-[#FAF2EE] focus:ring-0 pl-11 pr-4 py-2.5 font-sans text-xs rounded-xl transition-colors placeholder:text-[#8C5A54] text-[#2A1816] font-medium outline-none"
                                placeholder="Search by ID or amount..."
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Data Table block */}
                    <div className="overflow-hidden border border-[#DCBAB2] rounded-2xl">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-[#EEDBD5] border-b border-[#DCBAB2] font-mono text-[10px] font-bold uppercase text-[#8C5A54] tracking-widest">
                                        <th className="py-4 px-6">Transaction ID</th>
                                        <th className="py-4 px-6">Date</th>
                                        <th className="py-4 px-6">Event Context</th>
                                        <th className="py-4 px-6">Member/Entity</th>
                                        <th className="py-4 px-6">Record Type</th>
                                        <th className="py-4 px-6 text-right">Amount</th>
                                        <th className="py-4 px-6 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="font-sans text-xs text-[#5C3B37]">
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((trx) => {
                                            const isFlagged = trx.status === "Pending Audit";
                                            return (
                                                <tr
                                                    key={trx.id}
                                                    className={`border-b border-[#DCBAB2]/40 transition-colors ${isFlagged ? "bg-[#FDECEB]/50 hover:bg-[#FDECEB]" : "bg-[#FAF2EE] hover:bg-[#EEDBD5]/40"}`}
                                                >
                                                    <td className="py-4 px-6 font-mono font-medium">{trx.id}</td>
                                                    <td className="py-4 px-6 font-mono text-[#8C5A54]">{trx.date}</td>
                                                    <td className="py-4 px-6 font-semibold text-[#2A1816]">{trx.event}</td>
                                                    <td className="py-4 px-6 font-medium text-[#2A1816]">{trx.member}</td>
                                                    <td className="py-4 px-6 text-[#8C5A54]">{trx.type}</td>
                                                    <td className={`py-4 px-6 text-right font-mono font-bold ${trx.amount < 0 ? "text-[#B32D25]" : "text-emerald-700"}`}>
                                                        {trx.amount < 0 ? "-" : "+"}₹{Math.abs(trx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <button
                                                            onClick={() => handleRowStatusPillClick(trx)}
                                                            className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${isFlagged
                                                                    ? "bg-amber-700/15 text-amber-950 border border-amber-700/30 hover:bg-amber-700/25 cursor-pointer"
                                                                    : "bg-emerald-700/15 text-emerald-900 border border-emerald-700/30 cursor-default"
                                                                }`}
                                                        >
                                                            {trx.status}
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-[#8C5A54] font-medium font-sans text-sm">
                                                No ledger records match the current filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="border-t border-[#DCBAB2] p-4 flex items-center justify-between bg-[#F5EAE6] text-[#8C5A54]">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">Showing {filteredTransactions.length} of {transactions.length} records</span>
                            <div className="flex items-center gap-1.5">
                                <button disabled className="p-1.5 rounded-lg hover:bg-[#EEDBD5] disabled:opacity-40 text-[#5C3B37] transition-colors">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 rounded-lg bg-[#8C241E] text-[#FDF8F7] font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">1</button>
                                <button className="w-8 h-8 rounded-lg hover:bg-[#EEDBD5] font-mono text-[10px] font-bold flex items-center justify-center text-[#5C3B37] transition-colors">2</button>
                                <button className="w-8 h-8 rounded-lg hover:bg-[#EEDBD5] font-mono text-[10px] font-bold flex items-center justify-center text-[#5C3B37] transition-colors">3</button>
                                <span className="px-1 text-xs font-bold text-[#8C5A54]">...</span>
                                <button className="w-8 h-8 rounded-lg hover:bg-[#EEDBD5] font-mono text-[10px] font-bold flex items-center justify-center text-[#5C3B37] transition-colors">42</button>
                                <button className="p-1.5 rounded-lg hover:bg-[#EEDBD5] text-[#5C3B37] transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scan Simulation Dialog Frame */}
                {isScanning && (
                    <div className="fixed inset-0 bg-[#2A1816]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#F5EAE6] border border-[#DEBEB7] rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center justify-center text-center">
                            <Loader2 className="w-10 h-10 text-[#8C241E] animate-spin mb-6" />
                            <h3 className="font-serif text-xl font-bold text-[#2A1816] tracking-tight">Run Compliance Audit Scan</h3>
                            <p className="text-xs text-[#8C5A54] mt-3 h-6 font-mono uppercase tracking-wider font-semibold">{scanText}</p>
                            <div className="w-full bg-[#EEDBD5] h-1.5 rounded-full mt-6 overflow-hidden">
                                <div className="h-full bg-[#8C241E] rounded-full animate-loading-bar" style={{ width: '100%', animation: 'loading-bar 1.6s ease-in-out' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scan Completed Success Dialogue */}
                {showScanComplete && (
                    <div className="fixed inset-0 bg-[#2A1816]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#F5EAE6] border border-[#DEBEB7] rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-emerald-700/15 border border-emerald-700/30 text-emerald-700 flex items-center justify-center mb-5">
                                <CheckCircle2 className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold text-[#2A1816] tracking-tight text-center">Scan Assessment Complete</h3>
                            <p className="text-xs text-[#6E4742] text-center mt-3 leading-relaxed font-medium">
                                Audit check performed across 248 transaction items. All compliance checkpoints matched successfully.
                            </p>
                            <button
                                onClick={() => setShowScanComplete(false)}
                                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 w-full rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 mt-8 transition-all cursor-pointer border border-[#A6352F]"
                            >
                                Back To Ledger Dashboard
                            </button>
                        </div>
                    </div>
                )}

                {/* Anomaly Details Inspect Modal */}
                {activeAnomalyDetail && (
                    <div className="fixed inset-0 bg-[#2A1816]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#F5EAE6] border border-[#DEBEB7] rounded-[2.5rem] max-w-md w-full shadow-2xl overflow-hidden flex flex-col">

                            <div className="bg-[#EEDBD5] px-8 py-5 border-b border-[#DEBEB7] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileWarning className="w-4 h-4 text-[#8C241E]" />
                                    <h3 className="font-mono font-bold text-[10px] uppercase tracking-widest text-[#8C241E]">Compliance Verification</h3>
                                </div>
                                <button
                                    onClick={() => setActiveAnomalyDetail(null)}
                                    className="p-1.5 hover:bg-[#D5AAA2]/40 rounded-full transition-colors group cursor-pointer"
                                >
                                    <X className="w-4 h-4 text-[#8C5A54] group-hover:text-[#2A1816]" />
                                </button>
                            </div>

                            <div className="p-8 flex-1 space-y-6">
                                <div>
                                    <span className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${activeAnomalyDetail.severity === 'High' ? 'bg-[#FDECEB] text-[#B32D25] border-[#FDECEB]' :
                                            activeAnomalyDetail.severity === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                'bg-[#EEDBD5] text-[#8C5A54] border-[#D5AAA2]'
                                        }`}>
                                        Severity: {activeAnomalyDetail.severity}
                                    </span>
                                    <h4 className="font-serif text-2xl font-bold text-[#2A1816] mt-4 tracking-tight">{activeAnomalyDetail.title}</h4>
                                    <p className="text-sm text-[#6E4742] mt-2 leading-relaxed font-medium">{activeAnomalyDetail.description}</p>
                                </div>

                                <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-4 text-xs space-y-3 font-sans">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#8C5A54] font-bold">Flagged Item</span>
                                        <span className="font-mono font-bold text-[#2A1816] bg-[#EEDBD5] px-2 py-0.5 rounded">{activeAnomalyDetail.trxId}</span>
                                    </div>
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="text-[#8C5A54] font-bold whitespace-nowrap">Trigger Rule</span>
                                        <span className="text-[#5C3B37] text-right font-medium">{activeAnomalyDetail.rule}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-[#DCBAB2]/50 pt-3">
                                        <span className="text-[#8C5A54] font-bold">Matched Entity</span>
                                        <span className="font-bold text-[#2A1816]">
                                            {transactions.find(t => t.id === activeAnomalyDetail.trxId)?.member || "System Account"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#8C5A54] font-bold">Amount Impacted</span>
                                        <span className="font-mono font-bold text-[#B32D25]">
                                            ₹{Math.abs(transactions.find(t => t.id === activeAnomalyDetail.trxId)?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-[11px] text-[#8C5A54] leading-relaxed flex items-start gap-2 bg-[#EEDBD5]/50 p-3 rounded-xl">
                                    <ShieldAlert className="w-3.5 h-3.5 text-[#8C241E] shrink-0 mt-0.5" />
                                    <span>Resolving this flag manually will update the ledger entry to 'Cleared' and record your administrator hash in compliance records.</span>
                                </div>
                            </div>

                            <div className="bg-[#FAF2EE] border-t border-[#DCBAB2] p-6 flex gap-3">
                                <button
                                    onClick={() => setActiveAnomalyDetail(null)}
                                    className="px-5 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                                >
                                    Cancel
                                </button>
                                {activeAnomalyDetail.title === "Missing Receipt" ? (
                                    <>
                                        <button
                                            onClick={() => handleResolveAnomaly(activeAnomalyDetail, 'request')}
                                            className="px-5 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs flex-grow text-center justify-center flex"
                                        >
                                            Request Doc
                                        </button>
                                        <button
                                            onClick={() => handleResolveAnomaly(activeAnomalyDetail, 'upload')}
                                            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-5 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 transition-all cursor-pointer border border-[#A6352F] flex-grow text-center justify-center flex"
                                        >
                                            Upload
                                        </button>
                                    </>
                                ) : activeAnomalyDetail.title === "Duplicate Entry Warning" ? (
                                    <button
                                        onClick={() => handleResolveAnomaly(activeAnomalyDetail, 'merge')}
                                        className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 transition-all cursor-pointer border border-[#A6352F] flex-grow text-center justify-center flex"
                                    >
                                        Merge Items
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleResolveAnomaly(activeAnomalyDetail, 'dismiss')}
                                        className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 transition-all cursor-pointer border border-[#A6352F] flex-grow text-center justify-center flex"
                                    >
                                        Dismiss Flag
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Dynamic bottom toast block */}
                {toastMessage && (
                    <div className="fixed bottom-8 right-8 bg-[#2A1816] text-[#FDF8F7] border border-[#8C5A54] rounded-2xl px-5 py-3.5 shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-bottom-8 fade-in duration-300 max-w-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-[11px] font-sans font-medium leading-relaxed">{toastMessage}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
