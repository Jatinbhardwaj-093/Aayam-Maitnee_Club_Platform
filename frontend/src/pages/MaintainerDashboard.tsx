import { useState } from "react";
import {
    Search,
    MoreVertical,
    Plus,
    TrendingUp,
    ArrowRight,
    Shirt,
    Armchair,
    Lightbulb,
    Volume2,
    Calendar,
    Settings,
    Trash2,
    CheckCircle2,
    XCircle,
    Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

interface RosterMember {
    id: string;
    name: string;
    email: string;
    role: string;
    roleBg: string;
    roleText: string;
    availability: string;
    isAvailable: boolean;
}

interface RoomBooking {
    id: string;
    time: string;
    period: string;
    stage: string;
    details: string;
    isSecondaryStyle?: boolean;
}

export default function MaintainerDashboard() {
    // Members State
    const [roster, setRoster] = useState<RosterMember[]>([
        {
            id: "EW",
            name: "Elena Wells",
            email: "elena.w@stagedoor.art",
            role: "Lead Actress",
            roleBg: "bg-[#BFDDF0]",
            roleText: "text-[#2e4a5a]",
            availability: "Full-time",
            isAvailable: true,
        },
        {
            id: "MK",
            name: "Marcus Kane",
            email: "m.kane@stagedoor.art",
            role: "Stage Manager",
            roleBg: "bg-[#FFEBCC]",
            roleText: "text-[#4a482c]",
            availability: "Rehearsals Only",
            isAvailable: true,
        },
        {
            id: "SC",
            name: "Sofia Chen",
            email: "s.chen@stagedoor.art",
            role: "Set Designer",
            roleBg: "bg-[#BFDDF0]",
            roleText: "text-[#2e4a5a]",
            availability: "On-call",
            isAvailable: false,
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [memberDialogOpen, setMemberDialogOpen] = useState(false);

    // New Member Form States
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("Lead Actress");
    const [newMemberAvailability, setNewMemberAvailability] = useState("Full-time");

    // Bookings State
    const [bookings, setBookings] = useState<RoomBooking[]>([
        {
            id: "B1",
            time: "09:00",
            period: "AM",
            stage: "Main Stage: Macbeth Rehearsal",
            details: "Director: James Thorne • 3 Hours",
            isSecondaryStyle: false,
        },
        {
            id: "B2",
            time: "02:30",
            period: "PM",
            stage: "Studio B: Script Workshop",
            details: "Literary Team • 1.5 Hours",
            isSecondaryStyle: true,
        },
        {
            id: "B3",
            time: "07:00",
            period: "PM",
            stage: "Main Stage: Technical Load-in",
            details: "Crew A • Overnight",
            isSecondaryStyle: false,
        },
    ]);

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

    // Form Submit Handlers
    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMemberName || !newMemberEmail) return;

        const initials = newMemberName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

        const isLead = newMemberRole.toLowerCase().includes("act") || newMemberRole.toLowerCase().includes("lead");
        const roleBg = isLead ? "bg-[#BFDDF0]" : "bg-[#FFEBCC]";
        const roleText = isLead ? "text-[#2e4a5a]" : "text-[#4a482c]";

        const newMember: RosterMember = {
            id: initials || "NM",
            name: newMemberName,
            email: newMemberEmail,
            role: newMemberRole,
            roleBg,
            roleText,
            availability: newMemberAvailability,
            isAvailable: true,
        };

        setRoster([...roster, newMember]);
        setNewMemberName("");
        setNewMemberEmail("");
        setMemberDialogOpen(false);
    };

    const handleAddBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBookingTitle || !newBookingDetails) return;

        const newBooking: RoomBooking = {
            id: `B${bookings.length + 1}`,
            time: newBookingTime,
            period: newBookingPeriod,
            stage: `${newBookingStage}: ${newBookingTitle}`,
            details: newBookingDetails,
            isSecondaryStyle: newBookingStage.startsWith("Studio"),
        };

        setBookings([...bookings, newBooking]);
        setNewBookingTitle("");
        setNewBookingDetails("");
        setBookingDialogOpen(false);
    };

    const toggleMemberAvailability = (memberId: string) => {
        setRoster(
            roster.map((m) => (m.id === memberId ? { ...m, isAvailable: !m.isAvailable } : m))
        );
    };

    const deleteMember = (memberId: string) => {
        setRoster(roster.filter((m) => m.id !== memberId));
    };

    const filteredRoster = roster.filter(
        (m) =>
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                {/* Member Database - 8 Columns */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-[#cac6b9] p-6 shadow-[0_8px_32px_rgba(140,192,235,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-[28px] font-semibold font-serif text-[#635f41]">Member Database</h3>
                            <p className="text-xs uppercase tracking-wider text-[#49473d]/70 font-semibold mt-0.5">Active cast and crew directory</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-full sm:w-48">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#466272]/50" />
                                <Input
                                    placeholder="Search members..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus-visible:ring-0 focus-visible:border-[#8CC0EB] rounded-none h-9 text-xs transition-colors"
                                />
                            </div>

                            <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
                                <DialogTrigger render={
                                    <Button className="bg-[#8CC0EB] text-[#001e2c] hover:bg-[#8CC0EB]/90 font-bold rounded-lg text-xs py-2 px-3 flex items-center gap-1" />
                                }>
                                    <Plus className="w-3.5 h-3.5" /> Add Member
                                </DialogTrigger>
                                <DialogContent className="bg-[#fdf9f4] border border-[#cac6b9] text-[#466272]">
                                    <form onSubmit={handleAddMember}>
                                        <DialogHeader className="space-y-2">
                                            <DialogTitle className="font-serif text-[#635f41] text-lg">Add Roster Member</DialogTitle>
                                            <DialogDescription className="text-[#466272]/85 text-xs">
                                                Add a new cast or crew member to the active StageDoor roster.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="py-4 space-y-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-[#635f41]">Full Name</label>
                                                <Input
                                                    placeholder="e.g. Elena Wells"
                                                    value={newMemberName}
                                                    onChange={(e) => setNewMemberName(e.target.value)}
                                                    className="bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus-visible:ring-0 focus-visible:border-[#8CC0EB] rounded-none"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-[#635f41]">Email Address</label>
                                                <Input
                                                    type="email"
                                                    placeholder="elena.w@stagedoor.art"
                                                    value={newMemberEmail}
                                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                                    className="bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus-visible:ring-0 focus-visible:border-[#8CC0EB] rounded-none"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-[#635f41]">Designation/Role</label>
                                                    <select
                                                        value={newMemberRole}
                                                        onChange={(e) => setNewMemberRole(e.target.value)}
                                                        className="w-full bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus:ring-0 focus:border-[#8CC0EB] h-9 text-xs"
                                                    >
                                                        <option value="Lead Actress">Lead Actress</option>
                                                        <option value="Lead Actor">Lead Actor</option>
                                                        <option value="Stage Manager">Stage Manager</option>
                                                        <option value="Set Designer">Set Designer</option>
                                                        <option value="Lighting Tech">Lighting Tech</option>
                                                        <option value="Sound Engineer">Sound Engineer</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-[#635f41]">Availability</label>
                                                    <select
                                                        value={newMemberAvailability}
                                                        onChange={(e) => setNewMemberAvailability(e.target.value)}
                                                        className="w-full bg-[#F8F9FA] border-0 border-b-2 border-[#E1E2E6] focus:ring-0 focus:border-[#8CC0EB] h-9 text-xs"
                                                    >
                                                        <option value="Full-time">Full-time</option>
                                                        <option value="Rehearsals Only">Rehearsals Only</option>
                                                        <option value="On-call">On-call</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button type="button" variant="outline" onClick={() => setMemberDialogOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-lg text-xs">
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="bg-[#8CC0EB] text-[#001e2c] hover:bg-[#8CC0EB]/90 rounded-lg text-xs font-bold">
                                                Add to Directory
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-[#cac6b9] hover:bg-transparent">
                                    <TableHead className="pb-4 font-semibold text-xs tracking-wider text-[#49473d]/60 uppercase">Member</TableHead>
                                    <TableHead className="pb-4 font-semibold text-xs tracking-wider text-[#49473d]/60 uppercase">Role</TableHead>
                                    <TableHead className="pb-4 font-semibold text-xs tracking-wider text-[#49473d]/60 uppercase">Availability</TableHead>
                                    <TableHead className="pb-4 font-semibold text-xs tracking-wider text-[#49473d]/60 uppercase text-center">Status</TableHead>
                                    <TableHead className="pb-4 font-semibold text-xs tracking-wider text-[#49473d]/60 uppercase text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-[#cac6b9]/30">
                                {filteredRoster.map((member) => (
                                    <TableRow key={member.id} className="hover:bg-[#f7f3ee]/35 border-0">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-[#FFF9D2] border border-[#cac6b9] flex items-center justify-center text-xs font-bold text-[#635f41] flex-shrink-0">
                                                    {member.id}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#1c1b19]">{member.name}</div>
                                                    <div className="text-xs text-[#49473d] opacity-80">{member.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge className={`px-3 py-0.5 ${member.roleBg} ${member.roleText} rounded-full text-[10px] font-bold uppercase border-0 shadow-none`}>
                                                {member.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-[#466272]">
                                                <span className="w-2 h-2 rounded-full bg-[#635f41]"></span> {member.availability}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 text-center">
                                            <button
                                                onClick={() => toggleMemberAvailability(member.id)}
                                                className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-colors ${member.isAvailable
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                                    : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                                    }`}
                                                title="Click to toggle availability"
                                            >
                                                {member.isAvailable ? (
                                                    <>
                                                        <CheckCircle2 className="w-3 h-3" /> Available
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-3 h-3" /> Checked Out
                                                    </>
                                                )}
                                            </button>
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteMember(member.id)}
                                                    className="h-8 w-8 hover:bg-[#ffdad6] hover:text-[#ba1a1a] text-[#49473d]/70 rounded-full"
                                                    title="Delete Member"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-[#49473d] hover:bg-[#f7f3ee] rounded-full"
                                                >
                                                    <MoreVertical className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredRoster.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-6 text-xs text-[#49473d]/60">
                                            No members matched "{searchTerm}"
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
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
                                            onClick={() => setPlaybillSold(prev => Math.min(24, prev + 1))}
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
                                            onClick={() => setCorporatePatrons(prev => prev + 1)}
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
