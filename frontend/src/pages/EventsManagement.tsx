import { useState } from "react";
import {
    Calendar,
    Search,
    Filter,
    ArrowUpDown,
    MoreVertical,
    Lock,
    Lightbulb,
    User,
    Check,
    X,
    Bell,
    HelpCircle,
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

interface Submitter {
    name: string;
    avatarUrl?: string;
    initials?: string;
}

interface AssignedRole {
    roleName: string;
    memberName: string;
    icon: 'user' | 'lightbulb';
}

interface ProposalEvent {
    id: number;
    name: string;
    submitter: Submitter;
    date: string;
    status: 'Reviewing' | 'Approved' | 'Draft' | 'Rejected';
    urgency: 'High' | 'Normal' | 'Low';
    description: string;
    venue: string;
    startTime: string;
    endTime: string;
    assignedRoles: AssignedRole[];
    currentlyEditing?: string;
}

export default function EventsManagement() {
    // Current state for list of events
    const [events, setEvents] = useState<ProposalEvent[]>([
        {
            id: 1,
            name: "Summer Gala Exhibition",
            submitter: {
                name: "Elena R.",
                avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgN_EeNT-ghqPQNJ89DcPegP5KfhHiL1pQZuNpIxl-wakBPSCwHeD8qBUHXxxR4m40gNyo5iRPcuVuCDfITPIBrpHrW2NUL_uoNMwwUirtVIuPDlMuMAcUVi-4-pNO3DSSHyIkXhi-FIfKcB0ASsWU3WuJR6NNlNhCJPF5gafbG0qmnDS23VQjCxTcVjJ1aZZIt3K9NFBax_oGEw_9jAin-ZW7pjVuie8A2JNcxCl-kF-Jb_o1-VIi9B_a-lCko33sxQ1U2DUHDlTB"
            },
            date: "Aug 15, 2024",
            status: "Reviewing",
            urgency: "High",
            description: "An exclusive evening showcasing contemporary minimalist sculptures. The event aims to bring together local patrons and emerging artists in a brightly lit, immersive environment.",
            venue: "Main Atrium, West Wing",
            startTime: "14:00",
            endTime: "18:00",
            assignedRoles: [
                { roleName: "Curator", memberName: "Marcus J.", icon: "user" },
                { roleName: "Lighting Tech", memberName: "Sarah W.", icon: "lightbulb" }
            ],
            currentlyEditing: "Elena R."
        },
        {
            id: 2,
            name: "Abstract Art Symposium",
            submitter: { name: "Marcus J.", initials: "MJ" },
            date: "Sep 02, 2024",
            status: "Approved",
            urgency: "Normal",
            description: "A panel discussion exploring the roots and future of abstract art. Local and regional art critics discuss modern movements.",
            venue: "Workshop Flat 3B",
            startTime: "10:00",
            endTime: "13:00",
            assignedRoles: [
                { roleName: "Panel Host", memberName: "Sarah W.", icon: "user" }
            ]
        },
        {
            id: 3,
            name: "Local Sculptors Meetup",
            submitter: { name: "Sarah W.", initials: "SW" },
            date: "Oct 10, 2024",
            status: "Draft",
            urgency: "Low",
            description: "Informal gather for local sculptors to share methods, materials, and updates on community public art spaces.",
            venue: "Sculpture Studio",
            startTime: "18:30",
            endTime: "21:00",
            assignedRoles: [
                { roleName: "Host", memberName: "Sarah W.", icon: "user" }
            ]
        },
        {
            id: 4,
            name: "Winter Residency Showcase",
            submitter: {
                name: "David T.",
                avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXu-jO9GRtQF4OY8dp0SlpYfC7iBcpSvfEy2W83hiyD55UKA2RNL7EbRAo1e0csu8RXAy4kPd7h_Fs38OMmEszGX5ic5liwNoOe140QO_T0ElP0Fvim8Qu5jkw4X-Hz3IOGbJn8RB7XZEkZpDaQDb2AKxIfGQ00eZcrbLeFeaYPgQuHevbPoXbrYs3WMEmqsi0PhHUe0HHDGPNaZdltFdBJ75zYq7abupgl6qOy_56jmpqu6QA45X2chpcVJQWWQi614xSI3uzv1VDro"
            },
            date: "Dec 05, 2024",
            status: "Reviewing",
            urgency: "Normal",
            description: "Concluding showcase highlighting work produced by winter artist-in-residence cohort, open to the general public.",
            venue: "Gallery Hall B",
            startTime: "15:00",
            endTime: "17:00",
            assignedRoles: [
                { roleName: "Director", memberName: "Marcus J.", icon: "user" }
            ]
        }
    ]);

    const [selectedEventId, setSelectedEventId] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [sortByUrgency, setSortByUrgency] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    // Selected Event derived
    const currentEvent = events.find(e => e.id === selectedEventId) || events[0];

    // Handlers
    const handleDescriptionChange = (val: string) => {
        setEvents(prev =>
            prev.map(e => (e.id === currentEvent?.id ? { ...e, description: val } : e))
        );
    };

    const handleVenueChange = (val: string) => {
        setEvents(prev =>
            prev.map(e => (e.id === currentEvent?.id ? { ...e, venue: val } : e))
        );
    };

    const handleApprove = () => {
        if (!currentEvent) return;
        setEvents(prev =>
            prev.map(e => (e.id === currentEvent.id ? { ...e, status: "Approved" } : e))
        );
        triggerToast(`Proposal "${currentEvent.name}" Approved successfully!`);
    };

    const handleReject = () => {
        if (!currentEvent) return;
        setEvents(prev =>
            prev.map(e => (e.id === currentEvent.id ? { ...e, status: "Rejected" } : e))
        );
        triggerToast(`Proposal "${currentEvent.name}" Rejected successfully!`);
    };

    const toggleSort = () => {
        setSortByUrgency(prev => !prev);
        triggerToast(`Sorting ${!sortByUrgency ? "by Urgency" : "default"}`);
    };

    const toggleFilter = () => {
        setStatusFilter(prev => {
            const list = ["All", "Reviewing", "Approved", "Draft", "Rejected"];
            const idx = list.indexOf(prev);
            const next = list[(idx + 1) % list.length];
            triggerToast(`Filtering by: ${next}`);
            return next;
        });
    };

    const handleNewEvent = () => {
        triggerToast("New Event formulation page loaded.");
    };

    // Filter & Sort Logic
    let filteredEvents = events.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.submitter.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = statusFilter === "All" || e.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    if (sortByUrgency) {
        const urgencyWeight = { High: 3, Normal: 2, Low: 1 };
        filteredEvents = [...filteredEvents].sort((a, b) => urgencyWeight[b.urgency] - urgencyWeight[a.urgency]);
    }

    return (
        <div className="events-management flex-grow bg-[#fdf9f4] text-[#1c1b19] font-sans antialiased flex flex-col h-screen overflow-hidden">
            {/* Header bar */}
            <header className="bg-white/70 backdrop-blur-xl border-b border-[#E1E2E6]/60 sticky top-0 z-40 text-[#635f41] flex justify-between items-center h-16 px-6">
                <div className="flex items-center gap-8">
                    <h2 className="font-serif text-[28px] leading-[36px] font-bold text-[#635f41] tracking-tight">Events Management</h2>
                    <nav className="hidden lg:flex gap-6 font-semibold text-[14px]">
                        <a className="text-[#49473d] hover:text-[#635f41] transition-all hover:scale-105" href="#archived">Archived</a>
                        <a className="text-[#49473d] hover:text-[#635f41] transition-all hover:scale-105" href="#templates">Templates</a>
                        <a className="text-[#49473d] hover:text-[#635f41] transition-all hover:scale-105" href="#reports">Reports</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#49473d] w-4.5 h-4.5" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="matinee-input pl-10 pr-4 py-2 text-sm w-64 rounded-t-md focus:border-b-2"
                        />
                    </div>
                    <button className="p-2 text-[#49473d] hover:text-[#635f41] transition-colors hover:bg-[#ece7e3] rounded-full">
                        <Bell className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-[#49473d] hover:text-[#635f41] transition-colors hover:bg-[#ece7e3] rounded-full">
                        <HelpCircle className="w-5 h-5" />
                    </button>
                    <div className="ml-2 pl-4 border-l border-[#E1E2E6]">
                        <img
                            alt="Admin User Avatar"
                            className="w-8 h-8 rounded-full object-cover border border-[#E1E2E6] hover:shadow-md transition-shadow cursor-pointer"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxZTj8vMYFa2UfXio9Rzu4Vti4jPLn0lckLvt3N6oY8uSytQm-Y89_TS_ZwSCNej6FIi4soks20mxbE5ohReCX3-UxPGDR0cxxSSAvy4lcU_5BEAiJIW1Vk1_WqP3yAwoq146vhDsJ8eQD0nRR0jRLpjdAInObf40apidmI2kg2ApwWUElgVm_hZ810bzOsnLNhhsjTZu2oyFcXOfVLmo8wW8pJR8ch7BUWiqfAACpWxVVCe6-Mj15mBkfhh4asj4fCcHlco0f9FkU"
                        />
                    </div>
                </div>
            </header>

            {/* Split Screen Layout */}
            <main className="flex-grow flex flex-col lg:flex-row p-6 gap-6 h-[calc(100vh-64px)] overflow-hidden">

                {/* Left Side: Table (60%) */}
                <section className="lg:w-[60%] flex flex-col bg-white rounded-xl shadow-ambient border border-[#E1E2E6] overflow-hidden">
                    {/* Table Toolbar */}
                    <div className="p-4 border-b border-[#E1E2E6] bg-white flex flex-wrap items-center justify-between gap-4">
                        <h3 className="font-serif text-[24px] font-bold text-[#635f41]">Proposals</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleFilter}
                                className="px-3 py-1.5 rounded-lg border border-[#E1E2E6] text-[#49473d] bg-white font-semibold text-[14px] leading-5 tracking-[0.05em] flex items-center gap-1.5 hover:bg-[#ece7e3] transition-colors"
                            >
                                <Filter className="w-4 h-4" /> Filter {statusFilter !== "All" && `(${statusFilter})`}
                            </button>
                            <button
                                onClick={toggleSort}
                                className={`px-3 py-1.5 rounded-lg border text-[#49473d] font-semibold text-[14px] leading-5 tracking-[0.05em] flex items-center gap-1.5 hover:bg-[#ece7e3] transition-colors ${sortByUrgency ? 'bg-[#ece7e3] border-[#8CC0EB]' : 'bg-white border-[#E1E2E6]'
                                    }`}
                            >
                                <ArrowUpDown className="w-4 h-4" /> Sort
                            </button>
                            <button
                                onClick={handleNewEvent}
                                className="px-3 py-1.5 rounded-lg bg-[#8CC0EB] text-[#001e2c] font-semibold text-[14px] leading-5 flex items-center gap-1 hover:bg-[#7ab0dd] transition-colors"
                            >
                                Add Proposal
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    <div className="overflow-auto flex-grow bg-white">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f7f3ee] sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 font-semibold text-[14px] text-[#49473d] border-b border-[#E1E2E6]/50 whitespace-nowrap">Event Name</th>
                                    <th className="p-4 font-semibold text-[14px] text-[#49473d] border-b border-[#E1E2E6]/50 whitespace-nowrap">Submitter</th>
                                    <th className="p-4 font-semibold text-[14px] text-[#49473d] border-b border-[#E1E2E6]/50 whitespace-nowrap">Date</th>
                                    <th className="p-4 font-semibold text-[14px] text-[#49473d] border-b border-[#E1E2E6]/50 whitespace-nowrap">Status</th>
                                    <th className="p-4 font-semibold text-[14px] text-[#49473d] border-b border-[#E1E2E6]/50 whitespace-nowrap">Urgency</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E1E2E6]/30">
                                {filteredEvents.map((item) => {
                                    const isSelected = item.id === selectedEventId;
                                    return (
                                        <tr
                                            key={item.id}
                                            onClick={() => setSelectedEventId(item.id)}
                                            className={`cursor-pointer transition-colors border-l-4 ${isSelected
                                                    ? 'bg-[#FFF9D2]/50 hover:bg-[#FFF9D2] border-[#8CC0EB]'
                                                    : 'hover:bg-[#f7f3ee]/40 border-transparent'
                                                }`}
                                        >
                                            <td className="p-4 text-sm font-medium text-[#1c1b19]">{item.name}</td>
                                            <td className="p-4 text-sm text-[#49473d]">
                                                <div className="flex items-center gap-2">
                                                    {item.submitter.avatarUrl ? (
                                                        <img
                                                            alt={`${item.submitter.name} Avatar`}
                                                            className="w-6 h-6 rounded-full object-cover"
                                                            src={item.submitter.avatarUrl}
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-[#BFDDF0] flex items-center justify-center text-[#001e2c] text-[10px] font-semibold">
                                                            {item.submitter.initials}
                                                        </div>
                                                    )}
                                                    <span>{item.submitter.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-[#49473d]">{item.date}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase ${item.status === 'Approved'
                                                        ? 'bg-[#BFDDF0] text-[#001e2c]'
                                                        : item.status === 'Reviewing'
                                                            ? 'bg-[#FFEBCC] text-[#764b15]'
                                                            : item.status === 'Rejected'
                                                                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                                                : 'bg-[#E1E2E6] text-[#49473d]'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`flex items-center text-xs font-semibold ${item.urgency === 'High'
                                                        ? 'text-[#ba1a1a]'
                                                        : item.urgency === 'Normal'
                                                            ? 'text-[#764b15]'
                                                            : 'text-[#49473d]/70'
                                                    }`}>
                                                    {item.urgency === 'High' && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                                                    {item.urgency}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredEvents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-6 text-center text-[#49473d] opacity-60">
                                            No event proposals found matching the filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="p-4 border-t border-[#E1E2E6] bg-white flex justify-between items-center text-sm text-[#49473d]">
                        <span>Showing 1 to {filteredEvents.length} of {events.length} entries</span>
                        <div className="flex gap-1">
                            <button className="px-2 py-1 rounded hover:bg-[#ece7e3] disabled:opacity-50" disabled>
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="px-3 py-1 rounded bg-[#BFDDF0] text-[#001e2c] font-semibold">1</button>
                            <button className="px-3 py-1 rounded hover:bg-[#ece7e3]">2</button>
                            <button className="px-2 py-1 rounded hover:bg-[#ece7e3]">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Side: Detail Panel (40%) */}
                {currentEvent ? (
                    <section className="lg:w-[40%] flex flex-col glass-panel rounded-xl shadow-ambient overflow-hidden bg-white/70">
                        {/* Detail Header */}
                        <div className="p-6 border-b border-[#E1E2E6]/60 bg-white/50">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="font-serif text-[24px] font-bold text-[#635f41] leading-tight select-all">
                                    {currentEvent.name}
                                </h2>
                                <button className="p-1.5 text-[#49473d] hover:text-[#635f41] rounded-full hover:bg-[#ece7e3] transition-colors">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-wider uppercase ${currentEvent.status === 'Approved'
                                        ? 'bg-[#BFDDF0] text-[#001e2c]'
                                        : currentEvent.status === 'Reviewing'
                                            ? 'bg-[#FFEBCC] text-[#764b15]'
                                            : currentEvent.status === 'Rejected'
                                                ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                                : 'bg-[#E1E2E6] text-[#49473d]'
                                    }`}>
                                    {currentEvent.status}
                                </span>
                                <span className="text-[#49473d] font-semibold text-[14px] flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" /> {currentEvent.date}
                                </span>
                            </div>
                        </div>

                        {/* Concurrent Editing Banner */}
                        {currentEvent.currentlyEditing && (
                            <div className="bg-[#FFF9D2] border-b border-[#E1E2E6]/30 px-6 py-2 flex items-center gap-3">
                                <div className="relative flex -space-x-1.5">
                                    <img
                                        alt="Elena R."
                                        className="w-6 h-6 rounded-full border-2 border-[#FFF9D2] z-10 object-cover"
                                        src={currentEvent.submitter.avatarUrl}
                                    />
                                    <div className="w-6 h-6 rounded-full border-2 border-[#FFF9D2] bg-[#BFDDF0] z-0 flex items-center justify-center text-[8px] font-bold text-[#001e2c]">
                                        +1
                                    </div>
                                </div>
                                <span className="text-xs text-[#764b15] font-semibold animate-pulse">
                                    {currentEvent.currentlyEditing} is currently editing...
                                </span>
                            </div>
                        )}

                        {/* Detail Content (Scrollable) */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-8 bg-white/30">

                            {/* Metadata Section */}
                            <div className="space-y-4">
                                <h4 className="font-semibold text-xs tracking-widest text-[#466272] uppercase border-b border-[#E1E2E6] pb-1">Event Details</h4>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#49473d] mb-1.5 uppercase tracking-wider">Description</label>
                                    <textarea
                                        value={currentEvent.description}
                                        onChange={(e) => handleDescriptionChange(e.target.value)}
                                        className="w-full p-3 bg-white rounded-md border border-[#E1E2E6] shadow-sm text-sm text-[#1c1b19] focus:outline-none focus:ring-1 focus:ring-[#8CC0EB] focus:border-[#8CC0EB] min-h-[100px] resize-none"
                                        placeholder="Enter event description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#49473d] mb-1.5 uppercase tracking-wider">Venue</label>
                                    <input
                                        type="text"
                                        value={currentEvent.venue}
                                        onChange={(e) => handleVenueChange(e.target.value)}
                                        className="matinee-input w-full p-2 text-sm text-[#1c1b19]"
                                    />
                                </div>
                            </div>

                            {/* Schedule Section (Locked) */}
                            <div className="space-y-4 opacity-70 relative">
                                <div className="absolute -left-2 top-0 text-[#8CC0EB] flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-sm z-10 text-[10px] font-bold -translate-y-1/2 border border-[#E1E2E6]/60">
                                    <Lock className="w-3 h-3" /> Elena R.
                                </div>
                                <h4 className="font-semibold text-xs tracking-widest text-[#466272] uppercase border-b border-[#E1E2E6] pb-1 mt-2">Schedule</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#49473d] mb-1.5 uppercase tracking-wider">Start Time</label>
                                        <input
                                            type="time"
                                            value={currentEvent.startTime}
                                            disabled
                                            className="matinee-input w-full p-2 text-sm text-[#1c1b19] bg-gray-50 border-dashed border-[#E1E2E6] cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#49473d] mb-1.5 uppercase tracking-wider">End Time</label>
                                        <input
                                            type="time"
                                            value={currentEvent.endTime}
                                            disabled
                                            className="matinee-input w-full p-2 text-sm text-[#1c1b19] bg-gray-50 border-dashed border-[#E1E2E6] cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Roles Section (Locked) */}
                            <div className="space-y-4 opacity-70 relative">
                                <div className="absolute -left-2 top-0 text-[#8CC0EB] flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-sm z-10 text-[10px] font-bold -translate-y-1/2 border border-[#E1E2E6]/60">
                                    <Lock className="w-3 h-3" /> Elena R.
                                </div>
                                <h4 className="font-semibold text-xs tracking-widest text-[#466272] uppercase border-b border-[#E1E2E6] pb-1 mt-2">Assigned Roles</h4>
                                <div className="space-y-3">
                                    {currentEvent.assignedRoles ? currentEvent.assignedRoles.map((role, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-md border border-[#E1E2E6]">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-[#1c1b19]">{role.roleName}</span>
                                                <span className="text-xs text-[#49473d]">{role.memberName}</span>
                                            </div>
                                            {role.icon === 'lightbulb' ? (
                                                <Lightbulb className="w-4.5 h-4.5 text-[#49473d]/70" />
                                            ) : (
                                                <User className="w-4.5 h-4.5 text-[#49473d]/70" />
                                            )}
                                        </div>
                                    )) : (
                                        <p className="text-xs text-[#49473d]/60 italic">No roles assigned.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-6 border-t border-[#E1E2E6] bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.02)] flex gap-4 z-20">
                            <button
                                onClick={handleReject}
                                className="flex-1 py-3 px-4 rounded-xl border border-[#8CC0EB] text-[#466272] hover:bg-[#BFDDF0]/20 transition-colors flex justify-center items-center gap-2 font-bold text-sm tracking-wider uppercase"
                            >
                                <X className="w-4.5 h-4.5" /> Reject
                            </button>
                            <button
                                onClick={handleApprove}
                                className="flex-1 py-3 px-4 rounded-xl bg-[#8CC0EB] text-[#001e2c] hover:bg-[#7ab0dd] transition-colors flex justify-center items-center gap-2 font-bold text-sm tracking-wider uppercase shadow-sm"
                            >
                                <Check className="w-4.5 h-4.5" /> Approve
                            </button>
                        </div>
                    </section>
                ) : (
                    <div className="lg:w-[40%] flex items-center justify-center bg-white/70 border border-[#E1E2E6] rounded-xl text-[#49473d]/70 italic">
                        Select a proposal from the list to view particulars.
                    </div>
                )}
            </main>

            {/* Dynamic Toast System */}
            {toastMessage && (
                <div className={`fixed bottom-6 right-6 border rounded-xl px-5 py-3.5 shadow-xl z-50 flex items-center gap-3 animate-slide-in max-w-sm ${toastMessage.includes("Rejected")
                        ? "bg-[#ffdad6] border-[#ffdad6] text-[#93000a]"
                        : "bg-[#31302d] border-[#cac6b9]/30 text-white"
                    }`}>
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${toastMessage.includes("Rejected") ? "text-[#ba1a1a]" : "text-emerald-400"
                        }`} />
                    <span className="text-xs font-semibold leading-normal">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
