import { useState } from "react";
import {
    ShieldCheck,
    CheckCircle2,
    History,
    Download,
    Star,
    Edit2,
    LogIn,
    AlertTriangle,
    UserPlus,
    ChevronRight
} from "lucide-react";

interface AuditEntry {
    id: number;
    event: string;
    time: string;
    descriptionPre: string;
    badge: string | null;
    descriptionPost?: string;
    icon: 'edit' | 'download' | 'login' | 'warning' | 'person_add';
    warning?: boolean;
}

export default function MemberProfileAudit() {
    // Member Info State
    const [notes, setNotes] = useState(
        "Marcus has demonstrated exceptional commitment during the Fall rehearsal schedule. Recommended for consideration in next semester's mainstage production. Requires tech briefing for the new lighting rig."
    );
    const [accountActive, setAccountActive] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    // Selected Roles
    const [roles, setRoles] = useState({
        leadActor: true,
        stageManager: false,
        techCrew: false,
        director: false
    });

    // Immutable (but locally filterable/renderable if needed) Audit Logs
    const [auditLogs] = useState<AuditEntry[]>([
        {
            id: 1,
            event: "Role Modified",
            time: "2023-10-24 14:32:01 UTC",
            descriptionPre: "Admin 'StageDoor Admin' granted role ",
            badge: "Lead Actor",
            descriptionPost: ".",
            icon: "edit"
        },
        {
            id: 2,
            event: "Script Download",
            time: "2023-10-22 09:15:44 UTC",
            descriptionPre: "Downloaded digital asset ",
            badge: "Hamlet_Draft_V3.pdf",
            descriptionPost: " from the secure vault.",
            icon: "download"
        },
        {
            id: 3,
            event: "System Login",
            time: "2023-10-22 09:10:12 UTC",
            descriptionPre: "Successful authentication via SSO. IP: 192.168.1.45",
            badge: null,
            icon: "login"
        },
        {
            id: 4,
            event: "Failed Access Attempt",
            time: "2023-10-20 18:45:00 UTC",
            descriptionPre: "Attempted to access restricted resource ",
            badge: "/admin/finances",
            descriptionPost: ". Access denied.",
            icon: "warning",
            warning: true
        },
        {
            id: 5,
            event: "Profile Created",
            time: "2021-10-05 11:00:00 UTC",
            descriptionPre: "Initial system provisioning completed.",
            badge: null,
            icon: "person_add"
        }
    ]);

    const triggerToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };

    const handleSave = () => {
        triggerToast("Changes saved successfully!");
    };

    const handleMessage = () => {
        triggerToast("Outgoing message interface initialized for Marcus Kane");
    };

    const handleStatusToggle = () => {
        const nextState = !accountActive;
        setAccountActive(nextState);
        if (nextState) {
            triggerToast("Marcus Kane's user account activated.");
        } else {
            triggerToast("WARNING: Marcus Kane's user account suspended.");
        }
    };

    const handleRoleToggle = (roleKey: keyof typeof roles, roleLabel: string) => {
        setRoles(prev => {
            const nextVal = !prev[roleKey];
            triggerToast(`Role '${roleLabel}' ${nextVal ? 'assigned' : 'removed'}.`);
            return { ...prev, [roleKey]: nextVal };
        });
    };

    const handleExport = () => {
        triggerToast("Audit logs exported to stagesoor_audit_profile_marcus_kane.json");
    };

    return (
        <div className="profile-audit-page flex-1 min-h-screen bg-[#fdf9f4] text-[#1c1b19] font-sans pb-24">
            {/* Main Canvas Area */}
            <div className="max-w-[1280px] mx-auto px-4 md:px-[64px] pt-[96px]">

                {/* Page Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <nav className="flex items-center gap-2 text-[#49473d] opacity-70 mb-2 font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold text-xs tracking-wider uppercase">
                            <span className="cursor-pointer hover:text-[#635f41]">Members</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-[#635f41]">Profile Audit</span>
                        </nav>
                        <h2 className="font-serif text-[32px] md:text-[40px] leading-[40px] md:leading-[48px] font-semibold text-[#1c1b19] tracking-tight">Member Profile</h2>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleMessage}
                            className="px-6 py-2 border border-[#8CC0EB] text-[#466272] hover:bg-[#8CC0EB]/10 rounded-[4px] font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold transition-colors uppercase tracking-wider"
                        >
                            Message
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2 bg-[#8CC0EB] text-[#041f21] hover:bg-[#7AB0DB] rounded-[4px] ambient-shadow font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#8CC0EB] uppercase tracking-wider"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile & Privileges */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        {/* 1. Core Profile Card */}
                        <div className="glass-card rounded-[8px] p-8 ambient-shadow relative overflow-hidden group">
                            {/* Decorative bg accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8CC0EB]/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                            <div className="flex flex-col items-center text-center relative z-10">
                                <div className="relative mb-6">
                                    <img
                                        alt="Marcus Kane portrait"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-sm"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYJlRlAR2zNZRgSaoPoqB9RHSxADEWhmsX8xH7Dum3GyoGepl5TbFbWLw_FZvHXK21Y_sJd0HBKcrLZxNSNHdHY3yyLEQPVHkl9EVLn_c4pRxyatgGKyUIFOexxP_bnoY3Ohp6xFA-DIJUHB7kbdib9ggrmgqnvgYe113P0h70w0KwOVqP_NQkKafyUdQR8wnKJIbiYKvsfzmlxfKyKsBWrwpHzao54gXvRbMXhEtWifLFFocXVn5V7jK8hj6T6Sfr8RrfzGlyeDF8"
                                    />
                                    <div className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-sm border border-[#E1E2E6]" title="Verified Member">
                                        <CheckCircle2 className="w-4 h-4 text-[#8CC0EB] fill-current" />
                                    </div>
                                </div>
                                <h3 className="font-serif text-[28px] leading-[36px] font-semibold text-[#1c1b19] mb-1">Marcus Kane</h3>
                                <p className="font-sans text-[16px] leading-[24px] text-[#49473d] opacity-80 mb-4">marcus.kane@stagedoor.edu</p>

                                <div className="inline-flex items-center gap-2 bg-[#FFEBCC] px-4 py-1.5 rounded-[12px] mb-6 border border-[#F5E1C3]">
                                    <Star className="w-3.5 h-3.5 text-[#A67C00] fill-current" />
                                    <span className="font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold text-[#A67C00] uppercase tracking-wider">Senior Member</span>
                                </div>

                                <div className="w-full grid grid-cols-2 gap-4 border-t border-[#E1E2E6] pt-6 text-left">
                                    <div>
                                        <p className="font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold text-[#49473d] opacity-60 uppercase mb-1">Joined</p>
                                        <p className="font-sans text-[16px] leading-[24px] text-[#1c1b19]">Oct 2021</p>
                                    </div>
                                    <div>
                                        <p className="font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold text-[#49473d] opacity-60 uppercase mb-1">Productions</p>
                                        <p className="font-sans text-[16px] leading-[24px] text-[#1c1b19]">14</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Privilege Management */}
                        <div className="bg-white rounded-[8px] p-6 border border-[#FFB4A2] shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFB4A2] to-[#FFD8CD] rounded-t-[8px]"></div>

                            <div className="flex items-center gap-3 mb-6">
                                <ShieldCheck className="w-5 h-5 text-[#D95D39]" />
                                <h3 className="font-serif text-[20px] font-semibold text-[#1c1b19]">Access Privileges</h3>
                            </div>

                            {/* Status Switch */}
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E1E2E6]">
                                <div>
                                    <p className="font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold text-[#1c1b19] mb-1">Account Status</p>
                                    <p className="font-sans text-[14px] leading-5 text-[#49473d] opacity-70">Toggle to suspend member access.</p>
                                </div>
                                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        id="status-toggle"
                                        name="toggle"
                                        checked={accountActive}
                                        onChange={handleStatusToggle}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer z-10 transition-transform duration-200 ease-in-out"
                                        style={{
                                            transform: accountActive ? "translateX(24px)" : "translateX(0px)",
                                            borderColor: accountActive ? "#8CC0EB" : "#e6e2dd"
                                        }}
                                    />
                                    <label
                                        htmlFor="status-toggle"
                                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${accountActive ? "bg-[#8CC0EB]" : "bg-gray-300"
                                            }`}
                                    ></label>
                                </div>
                            </div>

                            {/* Role Assignment */}
                            <div>
                                <p className="font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold text-[#1c1b19] mb-4">Assigned Roles</p>
                                <div className="flex flex-wrap gap-3">
                                    <label className="cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={roles.leadActor}
                                            onChange={() => handleRoleToggle("leadActor", "Lead Actor")}
                                            className="peer sr-only"
                                        />
                                        <div className="px-4 py-2 rounded-full border border-[#8CC0EB] bg-[#8CC0EB]/10 text-[#466272] font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold uppercase transition-colors peer-checked:bg-[#8CC0EB] peer-checked:text-[#041f21] hover:bg-[#8CC0EB]/20">
                                            Lead Actor
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={roles.stageManager}
                                            onChange={() => handleRoleToggle("stageManager", "Stage Manager")}
                                            className="peer sr-only"
                                        />
                                        <div className="px-4 py-2 rounded-full border border-[#E1E2E6] text-[#49473d] font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold uppercase hover:bg-[#e6e2dd] transition-colors peer-checked:border-[#8CC0EB] peer-checked:bg-[#8CC0EB] peer-checked:text-[#041f21]">
                                            Stage Manager
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={roles.techCrew}
                                            onChange={() => handleRoleToggle("techCrew", "Tech Crew")}
                                            className="peer sr-only"
                                        />
                                        <div className="px-4 py-2 rounded-full border border-[#E1E2E6] text-[#49473d] font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold uppercase hover:bg-[#e6e2dd] transition-colors peer-checked:border-[#8CC0EB] peer-checked:bg-[#8CC0EB] peer-checked:text-[#041f21]">
                                            Tech Crew
                                        </div>
                                    </label>

                                    <label className="cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={roles.director}
                                            onChange={() => handleRoleToggle("director", "Director")}
                                            className="peer sr-only"
                                        />
                                        <div className="px-4 py-2 rounded-full border border-[#E1E2E6] text-[#49473d] font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold uppercase hover:bg-[#e6e2dd] transition-colors peer-checked:border-[#8CC0EB] peer-checked:bg-[#8CC0EB] peer-checked:text-[#041f21]">
                                            Director
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Notes & Audit Trail */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Director's Notes */}
                        <div className="bg-white rounded-[8px] p-8 border border-[#E1E2E6] shadow-sm">
                            <h3 className="font-serif text-[24px] text-[#1c1b19] mb-4 border-b border-[#E1E2E6] pb-4 font-semibold">Director's Notes</h3>
                            <div className="bg-[#F8F9FA] p-6 rounded border-b-2 border-[#cac6b9] focus-within:border-[#635f41] transition-colors">
                                <textarea
                                    className="w-full bg-transparent border-none focus:ring-0 resize-none font-sans text-[18px] leading-[28px] text-[#49473d] min-h-[120px] outline-none"
                                    placeholder="Add confidential notes here..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* 3. Immutable System Audit Log */}
                        <div className="bg-white rounded-[8px] border border-[#E1E2E6] shadow-sm flex flex-col h-[400px]">
                            <div className="p-6 border-b border-[#E1E2E6] flex justify-between items-center bg-[#fdf9f4]/50 rounded-t-[8px]">
                                <div className="flex items-center gap-3">
                                    <History className="w-5 h-5 text-[#49473d]" />
                                    <h3 className="font-serif text-[20px] font-semibold text-[#1c1b19]">System Audit Log</h3>
                                </div>
                                <button
                                    onClick={handleExport}
                                    className="text-[#8CC0EB] hover:text-[#7AB0DB] transition-colors flex items-center gap-1.5 font-sans text-[14px] leading-5 tracking-[0.05em] font-semibold"
                                >
                                    <Download className="w-4 h-4" /> Export
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto audit-scroll bg-[#FAFAFA] flex-grow">
                                <ul className="relative border-l border-[#cac6b9]/40 ml-3 space-y-6">
                                    {auditLogs.map((entry) => {
                                        return (
                                            <li key={entry.id} className="ml-6 relative">
                                                <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-9 ring-4 ring-[#FAFAFA] ${entry.warning ? 'bg-[#FFF4E5]' : 'bg-[#E8F0F8]'
                                                    }`}>
                                                    {entry.icon === 'edit' && <Edit2 className="w-3 h-3 text-[#cbdcf8] text-[#8CC0EB]" />}
                                                    {entry.icon === 'download' && <Download className="w-3 h-3 text-[#cceaea] text-[#8CC0EB]" />}
                                                    {entry.icon === 'login' && <LogIn className="w-3 h-3 text-[#8CC0EB]" />}
                                                    {entry.icon === 'warning' && <AlertTriangle className="w-3 h-3 text-[#D95D39]" />}
                                                    {entry.icon === 'person_add' && <UserPlus className="w-3 h-3 text-[#8CC0EB]" />}
                                                </span>
                                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                                                    <h4 className="font-sans text-[15px] leading-5 font-semibold text-[#1c1b19] uppercase tracking-wide">{entry.event}</h4>
                                                    <time className="font-mono text-sm text-[#49473d] opacity-60">{entry.time}</time>
                                                </div>
                                                <p className="font-sans text-[16px] leading-[24px] text-[#49473d]">
                                                    {entry.descriptionPre}
                                                    {entry.badge && (
                                                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${entry.warning
                                                            ? 'bg-[#ffdad6] text-[#93000a]'
                                                            : entry.badge === 'Hamlet_Draft_V3.pdf'
                                                                ? 'bg-[#e6e2dd] text-[#49473d]'
                                                                : 'bg-[#8CC0EB]/20 text-[#2e4a5a]'
                                                            }`}>
                                                            {entry.badge}
                                                        </span>
                                                    )}
                                                    {entry.descriptionPost}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Toast Notification */}
            {toastMessage && (
                <div className={`fixed bottom-6 right-6 border rounded-xl px-5 py-3.5 shadow-xl z-50 flex items-center gap-3 animate-slide-in max-w-sm ${toastMessage.includes("WARNING")
                    ? "bg-[#ffdad6] border-[#ffdad6] text-[#93000a]"
                    : "bg-[#31302d] border-[#cac6b9]/30 text-white"
                    }`}>
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${toastMessage.includes("WARNING") ? "text-[#ba1a1a]" : "text-emerald-400"
                        }`} />
                    <span className="text-xs font-semibold leading-normal">{toastMessage}</span>
                </div>
            )}
        </div>
    );
}
