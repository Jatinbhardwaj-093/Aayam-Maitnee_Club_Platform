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
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function ComplianceLedger() {
    // Master ledger items matching comp.html database
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: "#TRX-9901", date: "Oct 24, 2023", event: "Spring Musical", member: "Sarah Jenkins", type: "Reimbursement", amount: -450.00, status: "Cleared" },
        { id: "#TRX-9902", date: "Oct 23, 2023", event: "General Fund", member: "Marcus Thorne", type: "Deposit", amount: 1200.00, status: "Cleared" },
        { id: "#TRX-9903", date: "Oct 22, 2023", event: "Fall Play", member: "Elena Rostova", type: "Reimbursement", amount: -85.50, status: "Pending Audit" },
        { id: "#TRX-9904", date: "Oct 20, 2023", event: "Gala Fundraiser", member: "David Chen", type: "Vendor Payout", amount: -3500.00, status: "Cleared" },
        { id: "#TRX-9905", date: "Oct 19, 2023", event: "Gala Fundraiser", member: "Anonymous", type: "Donation", amount: 5000.00, status: "Cleared" },
        { id: "#TRX-9906", date: "Oct 18, 2023", event: "Set Design", member: "Home Depot", type: "Purchase", amount: -342.12, status: "Cleared" }
    ]);

    // Active anomalies list from comp.html
    const [anomalies, setAnomalies] = useState<Anomaly[]>([
        {
            id: "anom-1",
            title: "Missing Receipt",
            description: "Reimbursement #TRX-9903 lacks supporting documentation.",
            trxId: "#TRX-9903",
            icon: Receipt,
            severity: "High",
            rule: "Rule 14: Reimbursements exceeding $50 require valid receipts."
        },
        {
            id: "anom-2",
            title: "Duplicate Entry Warning",
            description: "Identical amounts ($342.12) posted twice on Oct 18 for 'Home Depot'.",
            trxId: "#TRX-9906",
            icon: Copy,
            severity: "Medium",
            rule: "Rule 08: Double-posting checking on matching merchant & values."
        },
        {
            id: "anom-3",
            title: "Unusual Deposit Size",
            description: "Donation of $5,000.00 exceeds standard deviation for anonymous gifts.",
            trxId: "#TRX-9905",
            icon: ShieldAlert,
            severity: "Low",
            rule: "Rule 23: Anti-money laundering tracking for private contributions."
        }
    ]);

    // Filter selectors
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Events");
    const [selectedMember, setSelectedMember] = useState("All Members");
    const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");

    const [isScanning, setIsScanning] = useState(false);
    const [showScanComplete, setShowScanComplete] = useState(false);
    const [scanText, setScanText] = useState("");

    const [activeAnomalyDetail, setActiveAnomalyDetail] = useState<Anomaly | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Compute interactive filtered list
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

        setTimeout(() => {
            setScanText("Ingesting transaction receipt attachments...");
        }, 500);

        setTimeout(() => {
            setScanText("Evaluating compliance rules against 248 records...");
        }, 1000);

        setTimeout(() => {
            setIsScanning(false);
            setShowScanComplete(true);
            triggerToast("Full audit scan completed. Validated 248 records.");
        }, 1600);
    };

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const handleResolveAnomaly = (anomaly: Anomaly, action: 'upload' | 'request' | 'dismiss' | 'merge') => {
        setAnomalies(prev => prev.filter(a => a.id !== anomaly.id));
        setActiveAnomalyDetail(null);

        // If TRX-9903 missing receipt is processed, update in-memory status
        if (anomaly.trxId === "#TRX-9903") {
            setTransactions(prev => prev.map(t =>
                t.id === "#TRX-9903" ? { ...t, status: "Cleared" } : t
            ));
        }

        if (action === 'upload') {
            triggerToast(`Document uploaded. ${anomaly.trxId} has been successfully Cleared.`);
        } else if (action === 'request') {
            triggerToast(`Receipt receipt request successfully dispatched to member.`);
        } else if (action === 'dismiss') {
            triggerToast(`Compliance flag dismissed. Transaction cleared manually.`);
        } else if (action === 'merge') {
            triggerToast(`Duplicate entries combined successfully. Ledger updated.`);
        }
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
        <div className="compliance-ledger w-full space-y-8 relative">
            {/* Ambient Background Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-30" style={{
                background: "radial-gradient(circle at 75% 15%, #c9e7fa 0%, transparent 45%), radial-gradient(circle at 15% 75%, #fff9d2 0%, transparent 45%)"
            }}></div>

            {/* Anomalies Panel Block - matching comp.html styling closely */}
            {anomalies.length > 0 && (
                <section className="relative z-10 w-full mb-8">
                    <div className="bg-[#FFF9D2] rounded-xl border-2 border-[#ba1a1a]/30 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[#ba1a1a] text-xl font-bold flex items-center justify-center">
                                <ShieldAlert className="w-6 h-6 text-[#ba1a1a]" />
                            </span>
                            <h3 className="font-serif text-[24px] leading-tight text-on-surface font-bold">Critical Compliance Anomalies</h3>
                        </div>
                        <p className="font-sans text-base md:text-lg text-on-surface-variant/90 mb-6 pb-4 border-b border-outline-variant">
                            The following automated compliance flags require immediate administrator review before the monthly close.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {anomalies.map(anom => {
                                const AnomIcon = anom.icon;
                                return (
                                    <div
                                        key={anom.id}
                                        className="bg-[#ffdad6]/20 rounded-lg p-4 border border-[#ba1a1a]/20 flex gap-3 items-start hover:bg-[#ffdad6]/30 transition-colors cursor-pointer group"
                                    >
                                        <span className="text-[#ba1a1a] mt-0.5 flex-shrink-0">
                                            <AnomIcon className="w-5 h-5" />
                                        </span>
                                        <div>
                                            <h4 className="font-sans text-sm text-on-surface mb-1 font-bold">{anom.title}</h4>
                                            <p className="font-sans text-sm text-on-surface-variant mb-2 leading-relaxed">{anom.description}</p>
                                            <button
                                                onClick={() => setActiveAnomalyDetail(anom)}
                                                className="font-sans text-xs text-primary font-bold flex items-center gap-1 hover:underline"
                                            >
                                                Review Detail
                                                <ArrowRight className="w-3.5 h-3.5 text-xs font-bold" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={triggerAuditScan}
                                className="bg-[#635f41] text-white rounded-lg py-2 px-6 font-sans text-xs font-semibold hover:opacity-90 transition-opacity"
                            >
                                Run Full Audit Scan
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Audit Ledger List Main area */}
            <div className="relative z-10 w-full flex flex-col">
                <div className="mb-8 select-none animate-fade-in-up">
                    <h2 className="font-serif text-3xl md:text-4xl text-on-surface mb-2 font-bold">Audit Ledger</h2>
                    <p className="font-sans text-base md:text-lg text-on-surface-variant/90">View-only compliance records and transaction history.</p>
                </div>

                {/* Filters & Control bar matching comp.html exactly */}
                <div className="bg-surface-container-lowest p-4 rounded-lg mb-6 border border-surface-variant ambient-shadow flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4 items-center flex-1">

                        {/* Selector 1: Date Range */}
                        <div className="relative min-w-[200px]">
                            <label className="block font-sans text-[11px] font-bold mb-1 uppercase tracking-wider text-on-surface/90">Date Range</label>
                            <div className="flex items-center bg-[#F8F9FA] border-b border-outline-variant rounded-t-sm px-3 py-2">
                                <Calendar className="w-4 h-4 text-[#7a776c] mr-2 flex-shrink-0" />
                                <select
                                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-on-surface w-full appearance-none cursor-pointer outline-none"
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value)}
                                >
                                    <option>Last 30 Days</option>
                                    <option>Q1 2024</option>
                                    <option>Fiscal Year 2023</option>
                                    <option>Custom Range...</option>
                                </select>
                            </div>
                        </div>

                        {/* Selector 2: Event Category */}
                        <div className="relative min-w-[180px]">
                            <label className="block font-sans text-[11px] font-bold mb-1 uppercase tracking-wider text-on-surface/90">Event Category</label>
                            <div className="flex items-center bg-[#F8F9FA] border-b border-outline-variant rounded-t-sm px-3 py-2">
                                <Filter className="w-4 h-4 text-[#7a776c] mr-2 flex-shrink-0" />
                                <select
                                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-on-surface w-full appearance-none cursor-pointer outline-none"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option>All Events</option>
                                    <option>Spring Musical</option>
                                    <option>Fall Play</option>
                                    <option>Gala Fundraiser</option>
                                    <option>General Fund</option>
                                    <option>Set Design</option>
                                </select>
                            </div>
                        </div>

                        {/* Selector 3: Member */}
                        <div className="relative min-w-[180px]">
                            <label className="block font-sans text-[11px] font-bold mb-1 uppercase tracking-wider text-on-surface/90">Member</label>
                            <div className="flex items-center bg-[#F8F9FA] border-b border-outline-variant rounded-t-sm px-3 py-2">
                                <User className="w-4 h-4 text-[#7a776c] mr-2 flex-shrink-0" />
                                <select
                                    className="bg-transparent border-none p-0 focus:ring-0 text-sm font-semibold text-on-surface w-full appearance-none cursor-pointer outline-none"
                                    value={selectedMember}
                                    onChange={(e) => setSelectedMember(e.target.value)}
                                >
                                    <option>All Members</option>
                                    <option>Sarah Jenkins</option>
                                    <option>Marcus Thorne</option>
                                    <option>Elena Rostova</option>
                                    <option>David Chen</option>
                                    <option>Anonymous</option>
                                    <option>Home Depot</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Selected Filters */}
                        {(selectedCategory !== "All Events" || selectedMember !== "All Members" || searchQuery !== "" || selectedPeriod !== "Last 30 Days") && (
                            <button
                                onClick={() => {
                                    setSelectedCategory("All Events");
                                    setSelectedMember("All Members");
                                    setSelectedPeriod("Last 30 Days");
                                    setSearchQuery("");
                                }}
                                className="text-xs text-red-650 hover:underline font-bold self-end mb-2 flex items-center gap-1"
                            >
                                <X className="w-3.5 h-3.5" /> Clear filters
                            </button>
                        )}
                    </div>

                    {/* Table Specific Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/80" />
                        <input
                            className="w-full bg-[#F8F9FA] border-0 border-b border-outline-variant focus:border-primary focus:ring-0 pl-10 pr-4 py-2 font-sans text-sm rounded-t-sm transition-colors placeholder:text-outline text-on-surface"
                            placeholder="Filter by ID or Amount..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Data Table block */}
                <div className="bg-surface-container-lowest rounded-xl border border-surface-variant overflow-hidden flex flex-col ambient-shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-surface-variant font-sans text-sm font-semibold uppercase text-on-surface tracking-wider">
                                    <th className="py-4 px-6 font-semibold">Transaction ID</th>
                                    <th className="py-4 px-6 font-semibold">Date</th>
                                    <th className="py-4 px-6 font-semibold">Event</th>
                                    <th className="py-4 px-6 font-semibold">Member</th>
                                    <th className="py-4 px-6 font-semibold">Type</th>
                                    <th className="py-4 px-6 font-semibold text-right">Amount</th>
                                    <th className="py-4 px-6 font-semibold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="font-sans text-sm text-on-surface">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((trx) => {
                                        const isFlagged = trx.status === "Pending Audit";
                                        return (
                                            <tr
                                                key={trx.id}
                                                className={`table-matte-row ${isFlagged ? "bg-error-container/20 hover:bg-error-container/30" : ""}`}
                                            >
                                                <td className="py-4 px-6 font-mono text-sm text-outline">{trx.id}</td>
                                                <td className="py-4 px-6 text-on-surface-variant">{trx.date}</td>
                                                <td className="py-4 px-6 font-semibold text-primary">{trx.event}</td>
                                                <td className="py-4 px-6 font-medium">{trx.member}</td>
                                                <td className="py-4 px-6 text-on-surface-variant">{trx.type}</td>
                                                <td className={`py-4 px-6 text-right font-medium ${trx.amount < 0 ? "text-[#ba1a1a]" : "text-[#635f41]"}`}>
                                                    {trx.amount < 0 ? "-" : "+"}${Math.abs(trx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <button
                                                        onClick={() => handleRowStatusPillClick(trx)}
                                                        className={`inline-flex items-center justify-center px-2 py-1 rounded font-sans text-[11px] font-semibold uppercase tracking-wider transition-opacity hover:opacity-85 ${isFlagged
                                                            ? "bg-[#FFEBCC] text-[#4a482c] border border-amber-300"
                                                            : "bg-[#BFDDF0] text-[#001e2c] border border-blue-200"
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
                                        <td colSpan={7} className="py-10 text-center text-on-surface-variant font-medium">
                                            No logs correspond to chosen filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-auto border-t border-surface-variant p-4 flex items-center justify-between bg-surface-container-lowest text-on-surface-variant">
                        <span className="text-sm font-semibold">Showing {filteredTransactions.length} of {transactions.length} records</span>
                        <div className="flex items-center gap-2">
                            <button disabled className="p-1 rounded hover:bg-surface-container disabled:opacity-50 text-[#7a776c] flex items-center justify-center">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 rounded bg-primary-container text-on-primary-container font-sans text-xs font-bold flex items-center justify-center">1</button>
                            <button className="w-8 h-8 rounded hover:bg-surface-container font-sans text-xs font-semibold flex items-center justify-center text-on-surface">2</button>
                            <button className="w-8 h-8 rounded hover:bg-surface-container font-sans text-xs font-semibold flex items-center justify-center text-on-surface">3</button>
                            <span className="px-2 text-xs font-semibold text-outline">...</span>
                            <button className="w-8 h-8 rounded hover:bg-surface-container font-sans text-xs font-semibold flex items-center justify-center text-on-surface">42</button>
                            <button className="p-1 rounded hover:bg-surface-container text-[#1c1b19] flex items-center justify-center">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scan Simulation Dialog Frame */}
            {isScanning && (
                <div className="fixed inset-0 bg-[#31302d]/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#fdf9f4] border border-[#cac6b9]/60 rounded-xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-10 h-10 text-[#635f41] animate-spin mb-4" />
                        <h3 className="font-serif font-bold text-base text-[#635f41]">Run Compliance Audit Scan</h3>
                        <p className="text-xs text-[#49473d]/80 mt-2 h-6 animate-pulse font-mono">{scanText}</p>
                        <div className="w-full bg-[#cac6b9]/30 h-1 rounded-full mt-4 overflow-hidden">
                            <div className="h-full bg-[#635f41] rounded-full animate-loading-bar" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scan Completed Success Dialogue */}
            {showScanComplete && (
                <div className="fixed inset-0 bg-[#31302d]/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#fdf9f4] border border-[#cac6b9]/60 rounded-xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-650" />
                        </div>
                        <h3 className="font-serif font-bold text-base text-emerald-800 text-center">Scan Assessment Complete</h3>
                        <p className="text-xs text-[#49473d]/90 text-center mt-2 leading-relaxed">
                            Audit check performed across 248 transaction items. All compliance checkpoints matched successfully.
                        </p>
                        <Button
                            onClick={() => setShowScanComplete(false)}
                            className="bg-[#635f41] hover:bg-[#635f41]/90 text-white font-bold text-xs w-full py-2.5 mt-5 rounded-lg border border-amber-900/10"
                        >
                            Back To Ledger Dashboard
                        </Button>
                    </div>
                </div>
            )}

            {/* Anomaly Details Inspect Modal */}
            {activeAnomalyDetail && (
                <div className="fixed inset-0 bg-[#31302d]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-[#cac6b9]/60 rounded-xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">

                        {/* Title Bar */}
                        <div className="bg-[#f7f3ee] px-6 py-4 border-b border-[#cac6b9]/40 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileWarning className="w-4 h-4 text-[#ba1a1a]" />
                                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-[#49473d]">Compliance Audit Verification</h3>
                            </div>
                            <button
                                onClick={() => setActiveAnomalyDetail(null)}
                                className="p-1 hover:bg-[#cac6b9]/20 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-[#49473d]" />
                            </button>
                        </div>

                        {/* Content Body */}
                        <div className="p-6 flex-1 space-y-4">
                            <div>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${activeAnomalyDetail.severity === 'High' ? 'bg-red-100 text-red-800' :
                                    activeAnomalyDetail.severity === 'Medium' ? 'bg-amber-100 text-amber-800' :
                                        'bg-cyan-100 text-cyan-800'
                                    }`}>
                                    Severity: {activeAnomalyDetail.severity}
                                </span>
                                <h4 className="font-serif text-base font-bold text-[#1c1b19] mt-2">{activeAnomalyDetail.title}</h4>
                                <p className="text-xs text-[#49473d] mt-1 leading-relaxed">{activeAnomalyDetail.description}</p>
                            </div>

                            {/* Metadata */}
                            <div className="bg-[#fcf9f5] border border-[#cac6b9]/30 rounded-lg p-3 text-xs space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-[#7a776c] font-semibold">Flagged Item:</span>
                                    <span className="font-mono font-bold text-[#1c1b19]">{activeAnomalyDetail.trxId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7a776c] font-semibold">Trigger Rule:</span>
                                    <span className="text-[#49473d] text-right font-medium max-w-[200px]">{activeAnomalyDetail.rule}</span>
                                </div>
                                <div className="flex justify-between border-t border-[#cac6b9]/15 pt-2">
                                    <span className="text-[#7a776c] font-semibold">Matched Account:</span>
                                    <span className="font-semibold text-primary">
                                        {transactions.find(t => t.id === activeAnomalyDetail.trxId)?.member || "System Account"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#7a776c] font-semibold">Amount Impacted:</span>
                                    <span className="font-bold text-amber-900">
                                        ${Math.abs(transactions.find(t => t.id === activeAnomalyDetail.trxId)?.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <div className="text-[10px] text-amber-700 leading-normal flex items-start gap-1">
                                <span className="material-symbols-outlined text-[12px] mt-0.5">info</span>
                                Resolving this flag manually will update the ledger entry to 'Cleared' and record your administrator hash in compliance records.
                            </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="bg-[#fcf9f5] border-t border-[#cac6b9]/25 p-4 flex gap-3">
                            <button
                                onClick={() => setActiveAnomalyDetail(null)}
                                className="flex-grow border border-[#cac6b9] text-xs font-semibold py-2 px-3 hover:bg-[#e6e2dd]/40 rounded-lg transition-colors text-[#1c1b19]"
                            >
                                Cancel
                            </button>
                            {activeAnomalyDetail.title === "Missing Receipt" ? (
                                <>
                                    <button
                                        onClick={() => handleResolveAnomaly(activeAnomalyDetail, 'request')}
                                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors"
                                    >
                                        Request doc
                                    </button>
                                    <button
                                        onClick={() => handleResolveAnomaly(activeAnomalyDetail, 'upload')}
                                        className="bg-[#635f41] hover:bg-[#635f41]/90 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors"
                                    >
                                        Upload Receipt
                                    </button>
                                </>
                            ) : activeAnomalyDetail.title === "Duplicate Entry Warning" ? (
                                <button
                                    onClick={() => handleResolveAnomaly(activeAnomalyDetail, 'merge')}
                                    className="flex-grow bg-[#635f41] hover:bg-[#635f41]/90 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors"
                                >
                                    Merge Items
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleResolveAnomaly(activeAnomalyDetail, 'dismiss')}
                                    className="flex-grow bg-[#635f41] hover:bg-[#635f41]/90 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors"
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
                <div className="fixed bottom-6 right-6 bg-[#31302d] text-white border border-[#cac6b9]/30 rounded-xl px-5 py-3.5 shadow-2xl z-50 flex items-center gap-3 animate-slide-in max-w-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold leading-normal">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
