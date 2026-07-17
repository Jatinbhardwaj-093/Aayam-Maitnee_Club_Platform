import { useState, useEffect } from "react";
import {
    TrendingUp,
    ArrowRight,
    Shirt,
    Armchair,
    Lightbulb,
    Volume2,
    Calendar,
    Settings,
    Edit,
    Clock,
    Zap,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

interface RoomBooking {
    id: string;
    time: string;
    period: string;
    stage: string;
    details: string;
    isSecondaryStyle?: boolean;
}

export default function MaintainerDashboard() {
    // Bookings State
    const [bookings, setBookings] = useState<RoomBooking[]>([]);

    useEffect(() => {
        // Fetch bookings
        fetch("http://localhost:5001/api/stage-bookings")
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error(err));

        // Fetch revenue metrics
        fetch("http://localhost:5001/api/revenue-metrics")
            .then(res => res.json())
            .then(data => {
                setPlaybillSold(data.playbillSold || 18);
                setCorporatePatrons(data.corporatePatrons || 12);
            })
            .catch(err => console.error(err));
    }, []);

    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    // New Booking Form States
    const [newBookingTime, setNewBookingTime] = useState("10:00");
    const [newBookingPeriod, setNewBookingPeriod] = useState("AM");
    const [newBookingStage, setNewBookingStage] = useState("Studio A");
    const [newBookingTitle, setNewBookingTitle] = useState("");
    const [newBookingDetails, setNewBookingDetails] = useState("");

    // Revenue/Playbill Interactivity State
    const [playbillSold, setPlaybillSold] = useState(18);
    const [corporatePatrons, setCorporatePatrons] = useState(12);

    const handleAddBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBookingTitle || !newBookingDetails) return;

        const newBooking = {
            time: newBookingTime,
            period: newBookingPeriod,
            stage: `${newBookingStage}: ${newBookingTitle}`,
            details: newBookingDetails,
            isSecondaryStyle: newBookingStage.startsWith("Studio"),
        };

        try {
            const res = await fetch("http://localhost:5001/api/stage-bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBooking)
            });
            const data = await res.json();
            
            setBookings([...bookings, { id: data.id, ...newBooking }]);
            setNewBookingTitle("");
            setNewBookingDetails("");
            setBookingDialogOpen(false);
        } catch (err) {
            console.error("Failed to add booking", err);
        }
    };

    const updateRevenueMetric = async (metric: string, value: number) => {
        try {
            await fetch("http://localhost:5001/api/revenue-metrics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ [metric]: value })
            });
        } catch (err) {
            console.error("Failed to update metric", err);
        }
    };

    return (
        <div className="space-y-8 font-sans text-[#466272] max-w-[1280px] mx-auto min-h-screen">
            {/* Header Section */}
            <section className="mb-8">
                <h2 className="text-[40px] font-semibold font-serif text-[#1c1b19] leading-tight mb-2">Production Office</h2>
                <p className="text-[18px] text-[#49473d] max-w-2xl opacity-80 leading-relaxed font-normal">
                    Managing the intricate layers of the 2024 Winter Matinee Season. Every prop, every sponsor, every member matters.
                </p>
            </section>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Operational Insights - 8 Columns */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-[#cac6b9] p-6 shadow-[0_8px_32px_rgba(140,192,235,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-[28px] font-semibold font-serif text-[#635f41]">Operational Efficiency</h3>
                            <p className="text-xs uppercase tracking-wider text-[#49473d]/70 font-semibold mt-0.5 font-sans">Performance metrics for the current season</p>
                        </div>
                    </div>

                    {/* Stat Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-[#f7f3ee] rounded-lg border border-[#cac6b9]/30">
                            <p className="text-[11px] text-[#49473d]/70 uppercase tracking-wider font-bold mb-1 font-sans">Venue Utilization</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#1c1b19] font-sans">84%</span>
                                <span className="text-[#635f41] text-xs font-bold font-sans">+5%</span>
                            </div>
                        </div>
                        <div className="p-4 bg-[#f7f3ee] rounded-lg border border-[#cac6b9]/30">
                            <p className="text-[11px] text-[#49473d]/70 uppercase tracking-wider font-bold mb-1 font-sans">Resource Turnover</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#1c1b19] font-sans">12.4 days</span>
                                <Clock className="text-[#466272] w-4 h-4" />
                            </div>
                        </div>
                        <div className="p-4 bg-[#f7f3ee] rounded-lg border border-[#cac6b9]/30">
                            <p className="text-[11px] text-[#49473d]/70 uppercase tracking-wider font-bold mb-1 font-sans">Tech Support SLA</p>
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-[#1c1b19] font-sans">18 mins</span>
                                <Zap className="text-[#635f41] w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Facility Health Index */}
                    <div>
                        <h4 className="font-bold text-[#1c1b19] text-xs uppercase tracking-wider text-[#49473d]/70 mb-4 flex items-center gap-2 font-sans">
                            <Activity className="w-4 h-4 text-[#635f41]" /> Facility Health Index
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-[#49473d] font-sans">
                                    <span>Stage Lighting</span>
                                    <span>98%</span>
                                </div>
                                <div className="w-full bg-[#e6e2dd] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#635f41] h-full" style={{ width: "98%" }}></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-[#49473d] font-sans">
                                    <span>Audio Rig</span>
                                    <span>92%</span>
                                </div>
                                <div className="w-full bg-[#e6e2dd] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#8CC0EB] h-full" style={{ width: "92%" }}></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-[#49473d] font-sans">
                                    <span>Backstage HVAC</span>
                                    <span>85%</span>
                                </div>
                                <div className="w-full bg-[#e6e2dd] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#635f41] h-full" style={{ width: "85%" }}></div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-[#49473d] font-sans">
                                    <span>Rigging Safety</span>
                                    <span>100%</span>
                                </div>
                                <div className="w-full bg-[#e6e2dd] h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-[#8CC0EB] h-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue & Spotlight - 4 Columns */}
                <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">

                    {/* Revenue Card */}
                    <div className="bg-[#FFF9D2] rounded-xl border border-[#cac6b9] p-6 shadow-[0_8px_32px_rgba(140,192,235,0.08)] flex-1 flex flex-col justify-center">
                        <h3 className="text-[28px] font-semibold font-serif text-[#635f41] mb-0.5">Revenue Tracking</h3>
                        <p className="text-xs uppercase tracking-wider text-[#49473d]/70 font-semibold mb-4">Sponsorship & Ad Sales</p>

                        <div className="flex items-end gap-2 mb-6">
                            <span className="text-[40px] font-semibold text-[#1c1b19] font-serif leading-none">$24,800</span>
                            <span className="text-[#635f41] font-bold pb-1 text-sm flex items-center gap-0.5">
                                <TrendingUp className="w-3.5 h-3.5" /> 12%
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-[#49473d] opacity-80">Playbill Ad Slots</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#1c1b19] font-bold">{playbillSold}/24 Sold</span>
                                        <button
                                            onClick={() => {
                                                const newVal = Math.min(24, playbillSold + 1);
                                                setPlaybillSold(newVal);
                                                updateRevenueMetric('playbillSold', newVal);
                                            }}
                                            className="px-1 bg-[#8CC0EB]/20 text-[#001e2c] border border-[#8CC0EB]/40 rounded hover:bg-[#8CC0EB]/40 text-[10px]"
                                            title="Sell Slot"
                                        >
                                            +1
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full bg-[#e6e2dd] h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-[#8CC0EB] h-full transition-all duration-500"
                                        style={{ width: `${(playbillSold / 24) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-[#49473d] opacity-80">Corporate Patrons</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#1c1b19] font-bold">{corporatePatrons} Active</span>
                                        <button
                                            onClick={() => {
                                                const newVal = corporatePatrons + 1;
                                                setCorporatePatrons(newVal);
                                                updateRevenueMetric('corporatePatrons', newVal);
                                            }}
                                            className="px-1 bg-[#635f41]/20 text-[#635f41] border border-[#635f41]/40 rounded hover:bg-[#635f41]/30 text-[10px]"
                                            title="Add Patron"
                                        >
                                            +1
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full bg-[#e6e2dd] h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-[#635f41] h-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, (corporatePatrons / 20) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Sponsor Card */}
                    <div className="bg-white rounded-xl border border-[#cac6b9] p-6 shadow-[0_8px_32px_rgba(140,192,235,0.08)] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="font-bold text-[#635f41] text-sm mb-3">Featured Sponsor</h4>
                            <div className="h-12 w-32 bg-[#F8F9FA]/65 backdrop-blur rounded flex items-center justify-center mb-4 border border-[#cac6b9]/40">
                                <span className="text-[#1c1b19]/60 italic font-serif text-lg tracking-wide">Azure Arts</span>
                            </div>
                            <p className="text-xs text-[#49473d] opacity-80 mb-4 leading-normal">
                                Renewing for the 2025 season. Platinum tier partner.
                            </p>
                            <button className="text-xs font-bold text-[#8CC0EB] flex items-center gap-1 hover:gap-2 transition-all">
                                Manage Partner <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-[#8CC0EB]/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300"></div>
                    </div>
                </div>

                {/* Inventory Management - 6 Columns */}
                <div className="lg:col-span-6 bg-white rounded-xl border border-[#cac6b9] p-6 shadow-[0_8px_32px_rgba(140,192,235,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-[28px] font-semibold font-serif text-[#635f41]">Inventory &amp; Assets</h3>
                            <p className="text-xs uppercase tracking-wider text-[#49473d]/70 font-semibold mt-0.5">Asset storage and upkeep status</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-[#f7f3ee] flex items-center justify-center text-[#635f41]">
                            <Settings className="w-4 h-4 cursor-pointer hover:rotate-45 transition-transform duration-300" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-[#cac6b9] rounded-lg bg-[#fdf9f4] hover:bg-[#f7f3ee]/40 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <Shirt className="w-4 h-4 text-[#635f41]" />
                                <span className="font-bold text-xs text-[#1c1b19]">Costumes</span>
                            </div>
                            <div className="text-2xl font-semibold font-serif text-[#1c1b19]">1,240</div>
                            <p className="text-[10px] text-[#ba1a1a] mt-1 font-medium">42 requiring repair</p>
                        </div>

                        <div className="p-4 border border-[#cac6b9] rounded-lg bg-[#fdf9f4] hover:bg-[#f7f3ee]/40 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <Armchair className="w-4 h-4 text-[#635f41]" />
                                <span className="font-bold text-xs text-[#1c1b19]">Props</span>
                            </div>
                            <div className="text-2xl font-semibold font-serif text-[#1c1b19]">856</div>
                            <p className="text-[10px] text-[#49473d]/80 mt-1 font-medium">12 out on loan</p>
                        </div>

                        <div className="p-4 border border-[#cac6b9] rounded-lg bg-[#fdf9f4] hover:bg-[#f7f3ee]/40 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-[#635f41]" />
                                <span className="font-bold text-xs text-[#1c1b19]">Lighting Kit</span>
                            </div>
                            <div className="text-2xl font-semibold font-serif text-[#1c1b19]">14</div>
                            <p className="text-[10px] text-emerald-700 mt-1 font-medium">All functional</p>
                        </div>

                        <div className="p-4 border border-[#cac6b9] rounded-lg bg-[#fdf9f4] hover:bg-[#f7f3ee]/40 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <Volume2 className="w-4 h-4 text-[#635f41]" />
                                <span className="font-bold text-xs text-[#1c1b19]">Audio Gear</span>
                            </div>
                            <div className="text-2xl font-semibold font-serif text-[#1c1b19]">22</div>
                            <p className="text-[10px] text-amber-700 mt-1 font-medium">3 scheduled for maint.</p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full mt-6 py-2.5 border border-[#cac6b9] text-[#49473d] hover:bg-[#f7f3ee]/50 text-xs font-bold rounded-lg transition-colors"
                        onClick={() => alert("Generating Full Inventory Audit Report...")}
                    >
                        Full Inventory Audit Report
                    </Button>
                </div>

                {/* Stage & Studio Bookings - 6 Columns */}
                <div className="lg:col-span-6 bg-white rounded-xl border border-[#cac6b9] p-6 shadow-[0_8px_32px_rgba(140,192,235,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-[28px] font-semibold font-serif text-[#635f41]">Stage &amp; Studio Bookings</h3>
                            <p className="text-xs uppercase tracking-wider text-[#49473d]/70 font-semibold mt-0.5">Logistical tracking for play spaces</p>
                        </div>
                        <div className="flex gap-1 bg-[#f7f3ee] p-0.5 rounded-lg border border-[#cac6b9]/40">
                            <span className="px-2 py-1 bg-white text-[#635f41] rounded text-[10px] font-bold shadow-sm">Today</span>
                            <span className="px-2 py-1 text-[#49473d]/60 rounded text-[10px] font-bold cursor-pointer hover:text-[#49473d]">Week</span>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center gap-4 p-3 hover:bg-[#f7f3ee]/35 rounded-lg border border-transparent hover:border-[#cac6b9]/20 transition-all group"
                            >
                                <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border ${booking.isSecondaryStyle
                                    ? "bg-[#BFDDF0]/10 border-[#8CC0EB]/30 text-[#466272]"
                                    : "bg-[#FFF9D2]/70 border-[#cac6b9] text-[#635f41]"
                                    }`}>
                                    <span className="text-xs font-bold leading-none">{booking.time}</span>
                                    <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5">{booking.period}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-bold text-[#1c1b19] text-sm truncate">{booking.stage}</h5>
                                    <p className="text-xs text-[#49473d]/80 mt-0.5 truncate">{booking.details}</p>
                                </div>
                                <Edit className="w-4 h-4 text-[#49473d]/50 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-[#635f41] transition-all flex-shrink-0" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-[#cac6b9]/60 flex items-center justify-between gap-4">
                        <span className="text-xs text-[#49473d]/85 italic block truncate">
                            Next availability: Tomorrow 10:00 AM (Studio A)
                        </span>

                        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                            <DialogTrigger render={
                                <Button className="bg-[#635f41] text-white hover:bg-[#635f41]/90 rounded-lg text-xs font-bold py-2.5 px-4 shadow-lg shadow-[#635f41]/10 flex items-center gap-1 flex-shrink-0" />
                            }>
                                <Calendar className="w-3.5 h-3.5" /> Book Room
                            </DialogTrigger>
                            <DialogContent className="bg-[#fdf9f4] border border-[#cac6b9] text-[#466272]">
                                <form onSubmit={handleAddBooking}>
                                    <DialogHeader className="space-y-2">
                                        <DialogTitle className="font-serif text-[#635f41] text-lg">Book Studio Space</DialogTitle>
                                        <DialogDescription className="text-[#466272]/85 text-xs">
                                            Reserve a rehearse stage or studio board for casting sessions and script reads.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-[#635f41]">Time</label>
                                                <Input
                                                    placeholder="09:00"
                                                    value={newBookingTime}
                                                    onChange={(e) => setNewBookingTime(e.target.value)}
                                                    className="bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus-visible:ring-0 focus-visible:border-[#8CC0EB] rounded-none"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-[#635f41]">AM/PM</label>
                                                <select
                                                    value={newBookingPeriod}
                                                    onChange={(e) => setNewBookingPeriod(e.target.value)}
                                                    className="w-full bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus:ring-0 focus:border-[#8CC0EB] h-9 text-xs"
                                                >
                                                    <option value="AM">AM</option>
                                                    <option value="PM">PM</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-[#635f41]">Space</label>
                                                <select
                                                    value={newBookingStage}
                                                    onChange={(e) => setNewBookingStage(e.target.value)}
                                                    className="w-full bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus:ring-0 focus:border-[#8CC0EB] h-9 text-xs"
                                                >
                                                    <option value="Main Stage">Main Stage</option>
                                                    <option value="Studio A">Studio A</option>
                                                    <option value="Studio B">Studio B</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-[#635f41]">Event Title</label>
                                            <Input
                                                placeholder="e.g. Macbeth Read-through"
                                                value={newBookingTitle}
                                                onChange={(e) => setNewBookingTitle(e.target.value)}
                                                className="bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus-visible:ring-0 focus-visible:border-[#8CC0EB] rounded-none"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-[#635f41]">Booking Details</label>
                                            <Input
                                                placeholder="e.g. Director: James Thorne • 2 Hours"
                                                value={newBookingDetails}
                                                onChange={(e) => setNewBookingDetails(e.target.value)}
                                                className="bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus-visible:ring-0 focus-visible:border-[#8CC0EB] rounded-none"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setBookingDialogOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-lg text-xs">
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="bg-[#635f41] text-white hover:bg-[#635f41]/90 rounded-lg text-xs font-bold">
                                            Confirm Booking
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

            </div>
        </div>
    );
}
