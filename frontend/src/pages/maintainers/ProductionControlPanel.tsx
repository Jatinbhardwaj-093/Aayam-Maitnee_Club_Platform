import { useState } from "react";
import {
    ShieldAlert,
    Key,
    Network,
    User,
    Tv,
    Lightbulb,
    Mic,
    Edit2,
    AlertTriangle,
    XCircle,
    Search,
    CheckCircle2,
    Lock,
    X
} from "lucide-react";

interface Person {
    id: string;
    name: string;
    role: string;
    accessScope: 'Full Access' | 'Restricted' | 'Temporary';
    permissionLevel: 'Administrator (Production)' | 'Standard Contributor' | 'View Only';
    avatarIcon: string;
    toggles: {
        lighting: boolean;
        audio: boolean;
        security: boolean;
    };
}

interface Dependency {
    id: string;
    name: string;
    desc: string;
    status: 'Active' | 'Conflict' | 'Booked' | 'Cancelled';
    time: string;
    icon: string;
}

export default function ProductionControlPanel() {
    // Personnel Access State
    const [personnel, setPersonnel] = useState<Person[]>([
        {
            id: "person-1",
            name: "Elena Rostova",
            role: "Director",
            accessScope: "Full Access",
            permissionLevel: "Administrator (Production)",
            avatarIcon: "person",
            toggles: {
                lighting: true,
                audio: true,
                security: true
            }
        },
        {
            id: "person-2",
            name: "Marcus Thorne",
            role: "Stage Manager",
            accessScope: "Restricted",
            permissionLevel: "Standard Contributor",
            avatarIcon: "headset_mic",
            toggles: {
                lighting: false,
                audio: true,
                security: false
            }
        }
    ]);

    // System Dependencies State
    const [dependencies, setDependencies] = useState<Dependency[]>([
        {
            id: "dep-1",
            name: "Main Stage",
            desc: "Technical Load-in",
            status: "Active",
            time: "Today, 08:00 - 18:00",
            icon: "theater_comedy"
        },
        {
            id: "dep-2",
            name: "Lighting Kit A",
            desc: "Moving Heads (x12)",
            status: "Conflict",
            time: "Requested by 'Hamlet' prod.",
            icon: "highlight"
        },
        {
            id: "dep-3",
            name: "Wireless Mic Rack 1",
            desc: "Channels 1-8",
            status: "Booked",
            time: "Tomorrow, 14:00 - 17:00",
            icon: "mic"
        }
    ]);

    // Master navigation tabs
    const [activeTab, setActiveTab] = useState<'access' | 'deps'>('access');

    // UI state controllers
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showTempAccessModal, setShowTempAccessModal] = useState(false);
    const [showEditAllocationModal, setShowEditAllocationModal] = useState(false);
    const [editDep, setEditDep] = useState<Dependency | null>(null);
    const [editTime, setEditTime] = useState("");

    // Temporary Access Form inputs
    const [tempName, setTempName] = useState("");
    const [tempRole, setTempRole] = useState("Lighting Designer");
    const [tempLevel, setTempLevel] = useState<'Standard Contributor' | 'View Only'>("Standard Contributor");

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    // Handle single toggle updates
    const handleToggle = (id: string, key: 'lighting' | 'audio' | 'security') => {
        setPersonnel(prev => prev.map(p => {
            if (p.id !== id) return p;

            // Check rules based on permissions
            if (p.permissionLevel === 'View Only') return p;
            if (p.permissionLevel === 'Standard Contributor' && (key === 'lighting' || key === 'security')) {
                // If restricted, lighting and security are locked
                triggerToast(`Permission locked. Upgrade ${p.name}'s scope to Admin first.`);
                return p;
            }

            const updatedToggles = { ...p.toggles, [key]: !p.toggles[key] };
            triggerToast(`${p.name}'s ${key} toggle is now ${updatedToggles[key] ? 'ENABLED' : 'DISABLED'}.`);
            return {
                ...p,
                toggles: updatedToggles
            };
        }));
    };

    // Update permission level
    const handlePermissionChange = (id: string, level: 'Administrator (Production)' | 'Standard Contributor' | 'View Only') => {
        setPersonnel(prev => prev.map(p => {
            if (p.id !== id) return p;

            // Auto toggle setup based on new level
            let updatedToggles = { ...p.toggles };
            let updatedScope = p.accessScope;

            if (level === 'Administrator (Production)') {
                updatedToggles = { lighting: true, audio: true, security: true };
                updatedScope = 'Full Access';
            } else if (level === 'Standard Contributor') {
                updatedToggles = { lighting: false, audio: true, security: false };
                updatedScope = 'Restricted';
            } else if (level === 'View Only') {
                updatedToggles = { lighting: false, audio: false, security: false };
                updatedScope = 'Restricted';
            }

            triggerToast(`Updated ${p.name} to ${level}. Access toggles adjusted.`);
            return {
                ...p,
                permissionLevel: level,
                accessScope: updatedScope as any,
                toggles: updatedToggles
            };
        }));
    };

    // Global: Revoke All Non-Essential access
    const handleRevokeAllNonEssential = () => {
        setPersonnel(prev => prev.map(p => {
            if (p.role === 'Director') return p; // Don't revoke Director
            triggerToast("Revoked all non-essential production credentials.");
            return {
                ...p,
                permissionLevel: 'View Only',
                accessScope: 'Restricted',
                toggles: { lighting: false, audio: false, security: false }
            };
        }));
    };

    // Global: Grant Temp Access
    const handleAddTempAccess = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tempName.trim()) return;

        const newPerson: Person = {
            id: `person-${Date.now()}`,
            name: tempName,
            role: tempRole,
            accessScope: "Temporary",
            permissionLevel: tempLevel as any,
            avatarIcon: "person",
            toggles: {
                lighting: tempLevel === 'Standard Contributor' ? false : false,
                audio: tempLevel === 'Standard Contributor' ? true : false,
                security: false
            }
        };

        setPersonnel(prev => [...prev, newPerson]);
        setShowTempAccessModal(false);
        triggerToast(`Granted temporary ${tempLevel} clearance to ${tempName}.`);
        // reset form
        setTempName("");
    };

    // Dependency Actions
    const handleResolveConflict = (id: string) => {
        setDependencies(prev => prev.map(d => {
            if (d.id !== id) return d;
            triggerToast(`Conflict resolved. ${d.name} booking has been successfully overridden.`);
            return {
                ...d,
                status: 'Active',
                time: 'Prioritized: Macbeth Production Load-in'
            };
        }));
    };

    const handleCancelReservation = (id: string, name: string) => {
        setDependencies(prev => prev.map(d => {
            if (d.id !== id) return d;
            triggerToast(`Cancelled reservation for ${name}.`);
            return {
                ...d,
                status: 'Cancelled',
                time: 'Released'
            };
        }));
    };

    const openEditAllocation = (dep: Dependency) => {
        setEditDep(dep);
        setEditTime(dep.time);
        setShowEditAllocationModal(true);
    };

    const handleSaveAllocation = () => {
        if (!editDep) return;
        setDependencies(prev => prev.map(d => {
            if (d.id !== editDep.id) return d;
            return {
                ...d,
                time: editTime
            };
        }));
        setShowEditAllocationModal(false);
        triggerToast(`Updated allocation details for ${editDep.name}.`);
    };

    // Search query filter for personnel tab
    const filteredPersonnel = personnel.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.permissionLevel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="production-control w-full bg-[#E7DDD3] text-[#232323] font-sans antialiased min-h-screen pb-16 selection:bg-[#E85F57]/30 relative">
            {/* Ambient Background Effect */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
                background: "radial-gradient(circle at 80% 20%, #c9e7fa 0%, transparent 50%), radial-gradient(circle at 10% 80%, #fff9d2 0%, transparent 55%)"
            }}></div>

            <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-8">
                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2 text-[#666361]/60 text-sm font-semibold uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4 text-[#ba1a1a]" />
                        <span>System Maintenance</span>
                    </div>
                    <h2 className="font-serif text-[40px] md:text-[32px] text-[#232323] font-bold tracking-tight mb-2 leading-tight">
                        Production Control Panel: <span className="text-[#353535] italic">Macbeth</span>
                    </h2>
                    <p className="text-lg text-[#666361] max-w-2xl leading-relaxed">
                        Technical oversight, access management, and system dependencies.
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="mb-8 border-b border-[#DDD8CE]">
                    <div className="flex gap-8" role="tablist">
                        <button
                            aria-selected={activeTab === 'access'}
                            className={`py-4 text-sm font-semibold transition-all focus:outline-none flex items-center gap-2 border-b-2 ${activeTab === 'access'
                                ? 'text-[#353535] border-[#353535]'
                                : 'text-[#666361]/60 border-transparent hover:text-[#353535] hover:border-[#D5C9BE]'
                                }`}
                            onClick={() => setActiveTab('access')}
                            role="tab"
                        >
                            <Key className="w-4 h-4" />
                            Access Control
                        </button>
                        <button
                            aria-selected={activeTab === 'deps'}
                            className={`py-4 text-sm font-semibold transition-all focus:outline-none flex items-center gap-2 border-b-2 ${activeTab === 'deps'
                                ? 'text-[#353535] border-[#353535]'
                                : 'text-[#666361]/60 border-transparent hover:text-[#353535] hover:border-[#D5C9BE]'
                                }`}
                            onClick={() => setActiveTab('deps')}
                            role="tab"
                        >
                            <Network className="w-4 h-4" />
                            System Dependencies
                        </button>
                    </div>
                </div>

                {/* Tab Content: Access Control */}
                {activeTab === 'access' && (
                    <div className="animate-fadeIn">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                            <div>
                                <h3 className="font-serif text-[28px] font-bold text-[#232323] mb-1">Personnel Access</h3>
                                <p className="text-sm text-[#666361]/80 leading-normal">Manage roles and technical permissions for the production team.</p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleRevokeAllNonEssential}
                                    className="px-4 py-2 border border-[#E85F57] text-[#666361] rounded text-sm font-semibold hover:bg-[#E85F57]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85F57]/50"
                                >
                                    Revoke All Non-Essential
                                </button>
                                <button
                                    onClick={() => setShowTempAccessModal(true)}
                                    className="px-4 py-2 bg-[#fff9d2] text-[#767253] border border-[#353535]/20 rounded text-sm font-semibold hover:bg-[#fff9d2]/80 transition-colors focus:outline-none shadow-sm"
                                >
                                    Grant Temporary Access
                                </button>
                            </div>
                        </div>

                        {/* Search Filter for Access Control */}
                        <div className="relative mb-6 w-full max-w-sm">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666361]/50" />
                            <input
                                type="text"
                                className="matte-input w-full pl-10 pr-4 py-2 text-sm focus:border-b-2 focus:border-[#353535] focus:ring-0 focus:outline-none transition-colors border-0 border-b border-[#E1E2E6] bg-[#F8F9FA] rounded-none placeholder:text-[#7a776c]"
                                placeholder="Search crew members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Grid Personnel List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredPersonnel.map(person => {
                                const isViewOnly = person.permissionLevel === 'View Only';
                                const isRestricted = person.permissionLevel === 'Standard Contributor';

                                return (
                                    <div
                                        key={person.id}
                                        className={`border rounded p-6 shadow-sm flex flex-col gap-6 transition-all ${person.accessScope === 'Full Access'
                                            ? 'bg-[#fff9d2] border-[#E1E2E6]'
                                            : person.accessScope === 'Temporary'
                                                ? 'bg-[#c9e7fa] border-[#E1E2E6]'
                                                : 'bg-[#E7DDD3] border-[#E1E2E6]'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded border border-[#D5C9BE]/30 flex items-center justify-center ${person.accessScope === 'Full Access' ? 'bg-white/50' : 'bg-[#DDD8CE]/50'}`}>
                                                    {person.avatarIcon === 'person' ? (
                                                        <User className="w-6 h-6 text-[#353535]" />
                                                    ) : (
                                                        <Tv className="w-6 h-6 text-[#666361]" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-[#232323] text-base font-sans">{person.name}</h4>
                                                    <p className="text-xs text-[#666361]/70 uppercase tracking-wider font-semibold mt-0.5">{person.role}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-[11px] font-bold rounded uppercase tracking-wider border ${person.accessScope === 'Full Access'
                                                ? 'bg-[#FFEBCC] text-[#232323] border-[#D5C9BE]/25'
                                                : person.accessScope === 'Temporary'
                                                    ? 'bg-[#c9e7fa] text-[#001e2c] border-[#D5C9BE]/25'
                                                    : 'bg-[#DDD8CE] text-[#232323] border-[#D5C9BE]/25'
                                                }`}>
                                                {person.accessScope}
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs uppercase font-bold tracking-wider text-[#666361] mb-1">Permission Level</label>
                                                <select
                                                    className="matte-input w-full py-2 px-1 text-sm text-[#232323] focus:ring-0 cursor-pointer"
                                                    value={person.permissionLevel}
                                                    onChange={(e) => handlePermissionChange(person.id, e.target.value as any)}
                                                >
                                                    <option value="Administrator (Production)">Administrator (Production)</option>
                                                    <option value="Standard Contributor">Standard Contributor</option>
                                                    <option value="View Only">View Only</option>
                                                </select>
                                            </div>

                                            <div className="pt-2 border-t border-[#DDD8CE]/60">
                                                <p className="text-xs uppercase font-bold tracking-wider text-[#666361] mb-3">System Toggles</p>
                                                <div className="flex flex-col gap-3">
                                                    {/* Toggle: Lighting */}
                                                    <label className={`flex items-center justify-between cursor-pointer group ${isRestricted || isViewOnly ? 'opacity-50' : ''}`}>
                                                        <span className="text-sm text-[#232323] group-hover:text-[#353535] transition-colors">
                                                            Lighting Rig Access
                                                        </span>
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                disabled={isRestricted || isViewOnly}
                                                                checked={person.toggles.lighting}
                                                                onChange={() => handleToggle(person.id, 'lighting')}
                                                            />
                                                            <div className={`w-10 h-5 bg-[#DDD8CE] rounded-full peer ${isRestricted || isViewOnly ? '' : 'peer-focus:ring-2 peer-focus:ring-[#E85F57] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E85F57]'}`}></div>
                                                            {(isRestricted || isViewOnly) && (
                                                                <Lock className="w-3.5 h-3.5 text-[#666361]/70 absolute right-1 top-1/2 -translate-y-1/2" />
                                                            )}
                                                        </div>
                                                    </label>

                                                    {/* Toggle: Audio Comms */}
                                                    <label className={`flex items-center justify-between cursor-pointer group ${isViewOnly ? 'opacity-50' : ''}`}>
                                                        <span className="text-sm text-[#232323] group-hover:text-[#353535] transition-colors">
                                                            Audio Console (Comms)
                                                        </span>
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                disabled={isViewOnly}
                                                                checked={person.toggles.audio}
                                                                onChange={() => handleToggle(person.id, 'audio')}
                                                            />
                                                            <div className={`w-10 h-5 bg-[#DDD8CE] rounded-full peer ${isViewOnly ? '' : 'peer-focus:ring-2 peer-focus:ring-[#E85F57] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E85F57]'}`}></div>
                                                            {isViewOnly && (
                                                                <Lock className="w-3.5 h-3.5 text-[#666361]/70 absolute right-1 top-1/2 -translate-y-1/2" />
                                                            )}
                                                        </div>
                                                    </label>

                                                    {/* Toggle: Stage Door Override */}
                                                    <label className={`flex items-center justify-between cursor-pointer group ${isRestricted || isViewOnly ? 'opacity-50' : ''}`}>
                                                        <span className="text-sm text-[#232323] group-hover:text-[#353535] transition-colors">
                                                            Stage Door Security (Override)
                                                        </span>
                                                        <div className="relative">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                disabled={isRestricted || isViewOnly}
                                                                checked={person.toggles.security}
                                                                onChange={() => handleToggle(person.id, 'security')}
                                                            />
                                                            <div className={`w-10 h-5 bg-[#DDD8CE] rounded-full peer ${isRestricted || isViewOnly ? '' : 'peer-focus:ring-2 peer-focus:ring-[#E85F57] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#E85F57]'}`}></div>
                                                            {(isRestricted || isViewOnly) && (
                                                                <Lock className="w-3.5 h-3.5 text-[#666361]/70 absolute right-1 top-1/2 -translate-y-1/2" />
                                                            )}
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tab Content: System Dependencies */}
                {activeTab === 'deps' && (
                    <div className="animate-fadeIn">
                        <div className="mb-6">
                            <h3 className="font-serif text-[28px] font-bold text-[#232323] mb-1">Equipment Logs &amp; Bookings</h3>
                            <p className="text-sm text-[#666361]/80 leading-normal">Monitor hardware status and resolve space conflicts.</p>
                        </div>

                        {/* Dependencies Table */}
                        <div className="bg-white/50 backdrop-blur-sm border border-[#E1E2E6] rounded-lg overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#DDD8CE]/50 bg-[#EFE8E1]/50 font-sans">
                                            <th className="py-4 px-6 font-bold text-sm text-[#666361] font-sans">Resource / Dependency</th>
                                            <th className="py-4 px-6 font-bold text-sm text-[#666361] font-sans">Status</th>
                                            <th className="py-4 px-6 font-bold text-sm text-[#666361] font-sans">Time / Allocation</th>
                                            <th className="py-4 px-6 font-bold text-sm text-[#666361] font-sans text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#DDD8CE]/30 font-sans text-xs text-[#232323]">
                                        {dependencies.map((dep) => {
                                            const isConflict = dep.status === 'Conflict';
                                            return (
                                                <tr
                                                    key={dep.id}
                                                    className={`hover:bg-[#DDD8CE]/10 transition-colors ${isConflict ? 'bg-[#ffdad6]/10' : ''
                                                        }`}
                                                >
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-white/80 border border-[#D5C9BE]/30 flex items-center justify-center">
                                                                {dep.icon === 'theater_comedy' ? (
                                                                    <Tv className="w-4 h-4 text-[#666361]" />
                                                                ) : dep.icon === 'highlight' ? (
                                                                    <Lightbulb className="w-4 h-4 text-amber-500" />
                                                                ) : (
                                                                    <Mic className="w-4 h-4 text-[#353535]" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-[#232323] text-sm">{dep.name}</p>
                                                                <p className="text-xs text-[#666361]/70 mt-0.5">{dep.desc}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        {dep.status === 'Active' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#F8E8E4] text-[#666361] text-[12px] font-bold uppercase tracking-wider">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#E85F57]"></span> Active
                                                            </span>
                                                        )}
                                                        {dep.status === 'Conflict' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#ffdad6] text-[#93000a] text-[12px] font-bold uppercase tracking-wider">
                                                                <AlertTriangle className="w-3.5 h-3.5 mr-0.5 text-[#ba1a1a]" /> Conflict
                                                            </span>
                                                        )}
                                                        {dep.status === 'Booked' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#DDD8CE] text-[#666361] text-[12px] font-bold uppercase tracking-wider">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#7a776c]"></span> Booked
                                                            </span>
                                                        )}
                                                        {dep.status === 'Cancelled' && (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 text-neutral-500 text-[12px] font-bold uppercase tracking-wider">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400"></span> Cancelled
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-4 px-6 text-[#666361] text-sm">
                                                        {dep.time}
                                                    </td>
                                                    <td className="py-4 px-6 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {isConflict ? (
                                                                <button
                                                                    onClick={() => handleResolveConflict(dep.id)}
                                                                    className="px-3 py-1.5 text-xs font-bold text-[#ba1a1a] border border-[#ba1a1a]/30 hover:bg-[#ba1a1a]/5 rounded transition-colors focus:outline-none mr-2"
                                                                >
                                                                    Override
                                                                </button>
                                                            ) : dep.status === 'Booked' ? (
                                                                <button
                                                                    onClick={() => handleCancelReservation(dep.id, dep.name)}
                                                                    className="p-2 text-[#666361]/60 hover:text-[#ba1a1a] transition-colors focus:outline-none"
                                                                    title="Cancel Reservation"
                                                                >
                                                                    <XCircle className="w-5 h-5" />
                                                                </button>
                                                            ) : dep.status === 'Active' ? (
                                                                <button
                                                                    onClick={() => openEditAllocation(dep)}
                                                                    className="p-2 text-[#666361]/60 hover:text-[#353535] transition-colors focus:outline-none"
                                                                    title="Edit Allocation"
                                                                >
                                                                    <Edit2 className="w-5 h-5" />
                                                                </button>
                                                            ) : null}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Grant Temporary Access Modal */}
            {showTempAccessModal && (
                <div className="fixed inset-0 bg-[#31302d]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-[#D5C9BE]/65 rounded-xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col">
                        <div className="bg-[#EFE8E1] px-6 py-4 border-b border-[#D5C9BE]/40 flex items-center justify-between">
                            <h3 className="font-serif text-sm font-bold text-[#666361] uppercase tracking-wider">Grant Temporary Access</h3>
                            <button
                                onClick={() => setShowTempAccessModal(false)}
                                className="p-1 hover:bg-[#D5C9BE]/30 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-[#666361]" />
                            </button>
                        </div>

                        <form onSubmit={handleAddTempAccess} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#666361] mb-1">Crew Member Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-[#F8F9FA] border-0 border-b border-[#D5C9BE] focus:border-[#353535] focus:ring-0 text-xs px-2 py-2.5 rounded-t-sm"
                                    placeholder="e.g. Sarah Connor"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#666361] mb-1">Production Role</label>
                                <select
                                    className="w-full bg-[#F8F9FA] border-0 border-b border-[#D5C9BE] focus:ring-0 cursor-pointer font-sans text-xs focus:border-[#353535] py-2 px-1 text-[#232323]"
                                    value={tempRole}
                                    onChange={(e) => setTempRole(e.target.value)}
                                >
                                    <option value="Lighting Designer">Lighting Designer</option>
                                    <option value="Sound Engineer">Sound Engineer</option>
                                    <option value="Costume Supervisor">Costume Supervisor</option>
                                    <option value="Guest Inspector">Guest Inspector</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#666361] mb-1">Clearance Level</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#232323]">
                                        <input
                                            type="radio"
                                            className="text-[#353535] focus:ring-0 focus:ring-offset-0"
                                            name="tempLevel"
                                            checked={tempLevel === 'Standard Contributor'}
                                            onChange={() => setTempLevel('Standard Contributor')}
                                        />
                                        Standard
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#232323]">
                                        <input
                                            type="radio"
                                            className="text-[#353535] focus:ring-0 focus:ring-offset-0"
                                            name="tempLevel"
                                            checked={tempLevel === 'View Only'}
                                            onChange={() => setTempLevel('View Only')}
                                        />
                                        View Only
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTempAccessModal(false)}
                                    className="flex-grow border border-[#D5C9BE] text-xs font-semibold py-2 px-3 hover:bg-[#DDD8CE]/40 rounded-lg text-[#232323]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow bg-[#353535] hover:bg-[#353535]/90 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors shadow-sm"
                                >
                                    Grant Access
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Allocation Modal */}
            {showEditAllocationModal && editDep && (
                <div className="fixed inset-0 bg-[#31302d]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-[#D5C9BE]/65 rounded-xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col">
                        <div className="bg-[#EFE8E1] px-6 py-4 border-b border-[#D5C9BE]/40 flex items-center justify-between">
                            <h3 className="font-serif text-sm font-bold text-[#666361] uppercase tracking-wider">Edit Allocation: {editDep.name}</h3>
                            <button
                                onClick={() => setShowEditAllocationModal(false)}
                                className="p-1 hover:bg-[#D5C9BE]/30 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-[#666361]" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#666361] mb-1">Time / Allocation Slot</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#F8F9FA] border-0 border-b border-[#D5C9BE] focus:border-[#353535] focus:ring-0 text-xs px-2 py-2.5 rounded-t-sm"
                                    value={editTime}
                                    onChange={(e) => setEditTime(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditAllocationModal(false)}
                                    className="flex-grow border border-[#D5C9BE] text-xs font-semibold py-2 px-3 hover:bg-[#DDD8CE]/40 rounded-lg text-[#232323]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveAllocation}
                                    className="flex-grow bg-[#353535] hover:bg-[#353535]/90 text-white font-bold text-xs py-2 px-3 rounded-lg transition-colors shadow-sm"
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Dynamic Toast System */}
            {toastMessage && (
                <div className="fixed bottom-6 right-6 bg-[#31302d] text-white border border-[#D5C9BE]/30 rounded-xl px-5 py-3.5 shadow-2xl z-50 flex items-center gap-3 animate-slide-in max-w-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] font-semibold leading-normal">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
