// @ts-nocheck
import { useState, useEffect } from "react";
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
    // Current state for list of events (proposals)
    const [events, setEvents] = useState<ProposalEvent[]>([]);
    const [dbEvents, setDbEvents] = useState<any[]>([]);

    const [selectedEventId, setSelectedEventId] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [sortByUrgency, setSortByUrgency] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past' | 'Proposals'>('Proposals');
    const itemsPerPage = 5;

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
        
        // Fetch proposals (SharedEvent)
        fetch(`${baseUrl}/api/proposals`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setEvents(data);
                    if (data.length > 0) {
                        setSelectedEventId(data[0].id);
                    }
                }
            })
            .catch(err => console.error("Error fetching proposals:", err));

        // Fetch events (Event)
        fetch(`${baseUrl}/api/events`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDbEvents(data);
                }
            })
            .catch(err => console.error("Error fetching events:", err));
    }, []);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
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

    // Selected Event derived
    let currentEvent = filteredEvents.find(e => e.id === selectedEventId);
    if (!currentEvent && filteredEvents.length > 0) {
        currentEvent = filteredEvents[0];
    }

    // Handlers
    const handleDescriptionChange = (val: string) => {
        setEvents(prev =>
            prev.map(e => (e.id === currentEvent?.id ? { ...e, description: val } : e))
        );
        if (currentEvent) {
            const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
            fetch(`${baseUrl}/api/proposals/${currentEvent.id}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description: val })
            }).catch(err => console.error("Error updating description:", err));
        }
    };

    const handleVenueChange = (val: string) => {
        setEvents(prev =>
            prev.map(e => (e.id === currentEvent?.id ? { ...e, venue: val } : e))
        );
        if (currentEvent) {
            const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
            fetch(`${baseUrl}/api/proposals/${currentEvent.id}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ venue: val })
            }).catch(err => console.error("Error updating venue:", err));
        }
    };

    const handleStartTimeChange = (val: string) => {
        setEvents(prev =>
            prev.map(e => (e.id === currentEvent?.id ? { ...e, startTime: val } : e))
        );
    };

    const handleEndTimeChange = (val: string) => {
        setEvents(prev =>
            prev.map(e => (e.id === currentEvent?.id ? { ...e, endTime: val } : e))
        );
    };

    const handleApprove = () => {
        if (!currentEvent) return;
        const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
        fetch(`${baseUrl}/api/proposals/${currentEvent.id}/approve`, { method: 'POST' })
            .then(res => {
                if (res.ok) {
                    setEvents(prev =>
                        prev.map(e => (e.id === currentEvent.id ? { ...e, status: "Approved" } : e))
                    );
                    triggerToast(`Proposal "${currentEvent.name}" Approved successfully!`);
                    
                    // Reload events
                    fetch(`${baseUrl}/api/events`)
                        .then(res => res.json())
                        .then(data => {
                            if (Array.isArray(data)) setDbEvents(data);
                        });
                }
            })
            .catch(err => console.error("Error approving proposal:", err));
    };

    const handleReject = () => {
        if (!currentEvent) return;
        const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
        fetch(`${baseUrl}/api/proposals/${currentEvent.id}/reject`, { method: 'POST' })
            .then(res => {
                if (res.ok) {
                    setEvents(prev =>
                        prev.map(e => (e.id === currentEvent.id ? { ...e, status: "Rejected" } : e))
                    );
                    triggerToast(`Proposal "${currentEvent.name}" Rejected successfully!`);
                }
            })
            .catch(err => console.error("Error rejecting proposal:", err));
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

    // Pagination Logic
    const totalPages = Math.max(1, Math.ceil(filteredEvents.length / itemsPerPage));
    const paginatedEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Compute dynamic tab data from database events state
    const upcomingEvents = dbEvents
        .filter(e => e.status === 'upcoming' || e.status === 'Upcoming')
        .map(e => ({
            id: e.id,
            name: e.title,
            date: e.date,
            time: e.timeRange,
            venue: e.venue,
            attendees: e.capacity,
            image: e.image || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"
        }));

    const pastEvents = dbEvents
        .filter(e => e.status === 'concluded' || e.status === 'Concluded' || e.status === 'past')
        .map(e => ({
            id: e.id,
            name: e.title,
            date: e.date,
            time: e.timeRange,
            venue: e.venue,
            rating: "4.8/5",
            revenue: "N/A",
            image: e.image || "https://images.unsplash.com/photo-1507676184212-d0330a151f15?q=80&w=600&auto=format&fit=crop"
        }));

    return (
        <div className="events-management flex-grow bg-[#fdf9f4] text-[#1c1b19] font-sans antialiased flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            
            {/* Main Container */}
            <main className="flex-grow flex flex-col p-6 gap-6 overflow-hidden max-w-[1400px] mx-auto w-full">
                
                {/* Page Header & Tabs */}
                <div className="flex flex-col gap-5 shrink-0">
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="font-serif text-[32px] leading-tight font-bold text-[#635f41] tracking-tight">Events Hub</h2>
                            <p className="text-sm text-[#49473d]/70 mt-1">Manage proposals, schedule upcoming events, and review past performances.</p>
                        </div>
                        <button
                            onClick={handleNewEvent}
                            className="bg-[#635f41] hover:bg-[#635f41]/90 text-white font-bold px-6 py-2.5 rounded-[8px] shadow-sm transition-all flex items-center gap-2 active:scale-95"
                        >
                            <Calendar className="w-4 h-4" />
                            Create Event
                        </button>
                    </div>

                    <div className="flex gap-8 border-b border-[#E1E2E6]">
                        {['Upcoming', 'Past', 'Proposals'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-3 text-sm font-bold uppercase tracking-wider transition-all relative ${
                                    activeTab === tab
                                        ? 'text-[#635f41]'
                                        : 'text-[#49473d]/60 hover:text-[#635f41]'
                                }`}
                            >
                                {tab}
                                {tab === 'Proposals' && (
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-[#635f41] text-white' : 'bg-[#E1E2E6] text-[#49473d]'}`}>
                                        {events.length}
                                    </span>
                                )}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#635f41] rounded-t-md" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Contents */}
                
                {/* UPCOMING & PAST TABS */}
                {(activeTab === 'Upcoming' || activeTab === 'Past') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-8 pr-2">
                        {(activeTab === 'Upcoming' ? upcomingEvents : pastEvents).map(ev => (
                            <div key={ev.id} className="bg-white border border-[#E1E2E6] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                                <div className="h-40 overflow-hidden relative">
                                    <img src={ev.image} alt={ev.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                                        <span className="bg-white/90 backdrop-blur text-[#635f41] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            {ev.date}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="font-serif text-xl font-bold text-[#635f41] leading-tight mb-2">{ev.name}</h3>
                                    <div className="space-y-2 mt-auto">
                                        <div className="flex justify-between items-center text-sm text-[#49473d]">
                                            <span className="flex items-center gap-1.5 opacity-80"><Calendar className="w-3.5 h-3.5" /> Time</span>
                                            <span className="font-semibold">{ev.time}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm text-[#49473d]">
                                            <span className="flex items-center gap-1.5 opacity-80"><User className="w-3.5 h-3.5" /> Venue</span>
                                            <span className="font-semibold">{ev.venue}</span>
                                        </div>
                                        {activeTab === 'Upcoming' ? (
                                            <div className="flex justify-between items-center text-sm text-[#49473d]">
                                                <span className="flex items-center gap-1.5 opacity-80"><User className="w-3.5 h-3.5" /> RSVPs</span>
                                                <span className="font-semibold text-[#8CC0EB]">{(ev as any).attendees} going</span>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center text-sm text-[#49473d]">
                                                <span className="flex items-center gap-1.5 opacity-80"><Lightbulb className="w-3.5 h-3.5" /> Rating</span>
                                                <span className="font-semibold text-green-600">{(ev as any).rating}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* PROPOSALS TAB */}
                {activeTab === 'Proposals' && (
                    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                        {/* Left Side: Table (60%) */}
                        <section className="lg:w-[60%] flex flex-col bg-white rounded-xl shadow-ambient border border-[#E1E2E6] overflow-hidden h-full">
                            {/* Table Toolbar */}
                            <div className="p-4 border-b border-[#E1E2E6] bg-white flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <h3 className="font-serif text-[24px] font-bold text-[#635f41]">Proposals</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="relative hidden sm:block mr-2">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#49473d] w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search events..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9 pr-4 py-1.5 text-sm w-48 rounded-md border border-[#E1E2E6] focus:outline-none focus:ring-1 focus:ring-[#8CC0EB]"
                                        />
                                    </div>
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
                                </div>
                            </div>

                            {/* Table Container */}
                            <div className="flex-grow overflow-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead className="bg-[#fdf9f4] sticky top-0 z-10 border-b border-[#E1E2E6]">
                                        <tr>
                                            <th className="py-3 px-4 text-xs font-bold text-[#49473d] uppercase tracking-wider w-[35%]">Event Name</th>
                                            <th className="py-3 px-4 text-xs font-bold text-[#49473d] uppercase tracking-wider w-[20%]">Submitter</th>
                                            <th className="py-3 px-4 text-xs font-bold text-[#49473d] uppercase tracking-wider w-[20%]">Date</th>
                                            <th className="py-3 px-4 text-xs font-bold text-[#49473d] uppercase tracking-wider w-[15%]">Status</th>
                                            <th className="py-3 px-4 text-xs font-bold text-[#49473d] uppercase tracking-wider w-[10%] text-center">Urgency</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E1E2E6]">
                                        {paginatedEvents.length > 0 ? (
                                            paginatedEvents.map(ev => (
                                                <tr
                                                    key={ev.id}
                                                    onClick={() => setSelectedEventId(ev.id)}
                                                    className={`hover:bg-[#f7f3ee] transition-colors cursor-pointer group ${selectedEventId === ev.id ? 'bg-[#f7f3ee] border-l-4 border-[#8CC0EB]' : 'border-l-4 border-transparent'}`}
                                                >
                                                    <td className="py-4 px-4">
                                                        <span className="font-bold text-[#1c1b19] text-[15px] group-hover:text-[#635f41] transition-colors">{ev.name}</span>
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            {ev.submitter.avatarUrl ? (
                                                                <img src={ev.submitter.avatarUrl} alt={ev.submitter.name} className="w-6 h-6 rounded-full object-cover border border-[#E1E2E6]" />
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-[#8CC0EB] text-[#001e2c] flex items-center justify-center text-[10px] font-bold">
                                                                    {ev.submitter.initials}
                                                                </div>
                                                            )}
                                                            <span className="text-sm text-[#49473d]">{ev.submitter.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-sm text-[#49473d]">
                                                        {ev.date}
                                                    </td>
                                                    <td className="py-4 px-4">
                                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 w-max ${ev.status === 'Approved'
                                                                ? 'bg-[#cce8cd] text-[#00390a]'
                                                                : ev.status === 'Reviewing'
                                                                    ? 'bg-[#FFF9D2] text-[#764b15]'
                                                                    : ev.status === 'Rejected'
                                                                        ? 'bg-[#ffdad6] text-[#ba1a1a]'
                                                                        : 'bg-[#E1E2E6] text-[#49473d]'
                                                            }`}>
                                                            {ev.status === 'Reviewing' && <Lock className="w-3 h-3" />}
                                                            {ev.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <span className={`text-sm font-semibold flex items-center justify-center gap-1 ${ev.urgency === 'High' ? 'text-red-600' : 'text-[#49473d]'}`}>
                                                            {ev.urgency === 'High' && <AlertTriangle className="w-4 h-4" />}
                                                            {ev.urgency}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-[#49473d] text-sm">
                                                    No proposals match your filters.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination Controls */}
                            <div className="p-3 border-t border-[#E1E2E6] bg-white flex justify-between items-center text-sm text-[#49473d]">
                                <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length}</span>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        className="p-1.5 rounded hover:bg-[#ece7e3] disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        className="p-1.5 rounded hover:bg-[#ece7e3] disabled:opacity-50"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Right Side: Detail View (40%) */}
                        <aside className="lg:w-[40%] bg-white rounded-xl shadow-ambient border border-[#E1E2E6] flex flex-col overflow-hidden h-full">
                            {currentEvent ? (
                                <>
                                    {/* Detail Header */}
                                    <div className="p-6 border-b border-[#E1E2E6] bg-[#fdf9f4]">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-serif text-[26px] leading-[32px] font-bold text-[#635f41]">{currentEvent.name}</h3>
                                            <button className="text-[#49473d] hover:text-[#1c1b19] p-1 rounded-md hover:bg-[#E1E2E6]/50 transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${currentEvent.status === 'Approved'
                                                    ? 'bg-[#cce8cd] text-[#00390a]'
                                                    : currentEvent.status === 'Reviewing'
                                                        ? 'bg-[#FFF9D2] text-[#764b15]'
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
                                                    disabled={!!currentEvent.currentlyEditing}
                                                    className={`w-full p-3 bg-white rounded-md border border-[#E1E2E6] shadow-sm text-sm text-[#1c1b19] focus:outline-none focus:ring-1 focus:ring-[#8CC0EB] focus:border-[#8CC0EB] min-h-[100px] resize-none ${currentEvent.currentlyEditing ? 'bg-gray-50 border-dashed cursor-not-allowed opacity-70' : ''}`}
                                                    placeholder="Enter event description..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold text-[#49473d] mb-1.5 uppercase tracking-wider">Venue</label>
                                                <input
                                                    type="text"
                                                    value={currentEvent.venue}
                                                    onChange={(e) => handleVenueChange(e.target.value)}
                                                    disabled={!!currentEvent.currentlyEditing}
                                                    className={`matinee-input w-full p-2 text-sm text-[#1c1b19] ${currentEvent.currentlyEditing ? 'bg-gray-50 border-dashed cursor-not-allowed opacity-70' : ''}`}
                                                />
                                            </div>
                                        </div>

                                        {/* Schedule Section */}
                                        <div className={`space-y-4 relative pt-3 ${currentEvent.currentlyEditing ? 'opacity-70' : ''}`}>
                                            {currentEvent.currentlyEditing && (
                                                <div className="absolute right-0 top-0 text-[#8CC0EB] flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-sm z-10 text-[10px] font-bold border border-[#E1E2E6]/60">
                                                    <Lock className="w-3 h-3" /> {currentEvent.currentlyEditing}
                                                </div>
                                            )}
                                            <h4 className="font-semibold text-xs tracking-widest text-[#466272] uppercase border-b border-[#E1E2E6] pb-1">Schedule</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-[#49473d] mb-1.5 uppercase tracking-wider">Start Time</label>
                                                    <input
                                                        type="time"
                                                        value={currentEvent.startTime}
                                                        onChange={(e) => handleStartTimeChange(e.target.value)}
                                                        disabled={!!currentEvent.currentlyEditing}
                                                        className={`matinee-input w-full p-2 text-sm text-[#1c1b19] ${currentEvent.currentlyEditing ? 'bg-gray-50 border-dashed cursor-not-allowed opacity-70' : ''}`}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold text-[#49473d] mb-1.5 uppercase tracking-wider">End Time</label>
                                                    <input
                                                        type="time"
                                                        value={currentEvent.endTime}
                                                        onChange={(e) => handleEndTimeChange(e.target.value)}
                                                        disabled={!!currentEvent.currentlyEditing}
                                                        className={`matinee-input w-full p-2 text-sm text-[#1c1b19] ${currentEvent.currentlyEditing ? 'bg-gray-50 border-dashed cursor-not-allowed opacity-70' : ''}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Roles Section */}
                                        <div className={`space-y-4 relative pt-3 ${currentEvent.currentlyEditing ? 'opacity-70' : ''}`}>
                                            {currentEvent.currentlyEditing && (
                                                <div className="absolute right-0 top-0 text-[#8CC0EB] flex items-center gap-1 bg-white px-2 py-0.5 rounded shadow-sm z-10 text-[10px] font-bold border border-[#E1E2E6]/60">
                                                    <Lock className="w-3 h-3" /> {currentEvent.currentlyEditing}
                                                </div>
                                            )}
                                            <h4 className="font-semibold text-xs tracking-widest text-[#466272] uppercase border-b border-[#E1E2E6] pb-1">Assigned Roles</h4>
                                            <div className="space-y-3">
                                                {currentEvent.assignedRoles && currentEvent.assignedRoles.length > 0 ? currentEvent.assignedRoles.map((role, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded-md border border-[#E1E2E6]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[#fdf9f4] flex items-center justify-center text-[#635f41]">
                                                                {role.icon === 'user' ? <User className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                                                            </div>
                                                            <div>
                                                                <div className="text-[11px] font-bold text-[#49473d] uppercase tracking-wider">{role.roleName}</div>
                                                                <div className="text-sm font-semibold text-[#1c1b19]">{role.memberName}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )) : (
                                                    <div className="text-sm text-[#49473d] italic">No roles assigned.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons (Sticky Bottom) */}
                                    <div className="p-4 border-t border-[#E1E2E6] bg-white flex gap-3 shrink-0">
                                        <button
                                            onClick={handleReject}
                                            className="flex-1 py-2.5 rounded-lg border border-[#E1E2E6] text-[#ba1a1a] font-bold text-[13px] tracking-wide hover:bg-[#ffdad6]/30 transition-colors flex justify-center items-center gap-2"
                                        >
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            className="flex-1 py-2.5 rounded-lg bg-[#635f41] text-white font-bold text-[13px] tracking-wide hover:bg-[#635f41]/90 shadow-sm transition-colors flex justify-center items-center gap-2"
                                        >
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#fdf9f4]">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#E1E2E6] mb-4 text-[#8CC0EB]">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-bold text-[#1c1b19] mb-2">No Event Selected</h4>
                                    <p className="text-sm text-[#49473d] max-w-[250px]">
                                        Select a proposal from the list to view details, assign roles, and manage approvals.
                                    </p>
                                </div>
                            )}
                        </aside>
                    </div>
                )}
            </main>

            {/* Global Toast */}
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
