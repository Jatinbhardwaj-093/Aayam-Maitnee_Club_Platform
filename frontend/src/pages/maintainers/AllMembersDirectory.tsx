import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "Active" | "On Break";
    joinDate: string;
    productionsCount: number;
    avatarUrl?: string;
    initials?: string;
}

const INITIAL_MEMBERS: Member[] = [
    {
        id: "#DC-482",
        name: "Eleanor Vance",
        email: "e.vance@example.com",
        role: "Lead Actor",
        status: "Active",
        joinDate: "Oct 2021",
        productionsCount: 14,
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnKUcfY7TKeCByoapSFAmtQIcIc4MmzLibSjnluJbKUysBTKE9qXxmIV3G3iSB8y0k17HEH1E3cfGc0y9OU2Or4LrSIk1pq6J3Skuvg39T7DXSjvd-iBflpXguYRHkVHdb9BJ_Vun0fgkFKmmlnW29sKRqsWDcvSj1_dMPMnE8aCABiaRJWvEyCIOY5pCj3aSn4u_5noKiiqjdzp1cT19rKnbLW9-s_uAzKe2-bkEKYmTE9qGb13joN8SvuzO34Z8BVa05uhfFubR3"
    },
    {
        id: "#DC-391",
        name: "Julian Montague",
        email: "j.montague@example.com",
        role: "Tech Director",
        status: "Active",
        joinDate: "Jan 2020",
        productionsCount: 28,
        initials: "JM"
    },
    {
        id: "#DC-102",
        name: "Arthur Pendelton",
        email: "art.pendleton@example.com",
        role: "Ensemble",
        status: "On Break",
        joinDate: "Mar 2018",
        productionsCount: 34,
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYb0UYh56FwHk3uOiZ9VTP0qXd5aXnux-Ed7uqdpVAUCuRoKydLtGHFwvGg1FFXsi3KQlYUiA2Zw1TOmHq-zZKPbMIxGATGM7yvBv65DfkNPKDgK9U8nRTAqwbo2SrCtduDeXso0gOS38ui_qSqO4ZJ3_Pgl5ULzimZw-pSHmoy_Q84WK5GdVdTCriCbcpLyYX5EptqmiyfxtDnNgN7H6V0-p6E-jGglmpS684IfEAPqgtLozcCP1QdpEQkmOQcWov3q_IJlTTAbu2"
    },
    {
        id: "#DC-590",
        name: "Sarah Chen",
        email: "s.chen@example.com",
        role: "Choreographer",
        status: "Active",
        joinDate: "Feb 2023",
        productionsCount: 3,
        initials: "SC"
    },
    {
        id: "#DC-202",
        name: "Marcus Aurelius",
        email: "m.aurelius@example.com",
        role: "Ensemble",
        status: "Active",
        joinDate: "Jun 2019",
        productionsCount: 19,
        initials: "MA"
    },
    {
        id: "#DC-931",
        name: "Sneha Vyas",
        email: "sneha.v@matinee.club",
        role: "Lead Actor",
        status: "Active",
        joinDate: "Sep 2022",
        productionsCount: 8,
        initials: "SV"
    },
    {
        id: "#DC-842",
        name: "Jayesh Dave",
        email: "jayesh.d@matinee.club",
        role: "Lead Actor",
        status: "Active",
        joinDate: "May 2021",
        productionsCount: 12,
        initials: "JD"
    },
    {
        id: "#DC-704",
        name: "Siddharth Verma",
        email: "siddharth.v@matinee.club",
        role: "Tech Director",
        status: "Active",
        joinDate: "Nov 2020",
        productionsCount: 21,
        initials: "SV"
    },
    {
        id: "#DC-603",
        name: "Elena Rostova",
        email: "e.rostova@example.com",
        role: "Choreographer",
        status: "On Break",
        joinDate: "Jul 2024",
        productionsCount: 2,
        initials: "ER"
    },
    {
        id: "#DC-505",
        name: "David Kim",
        email: "d.kim@example.com",
        role: "Tech Director",
        status: "Active",
        joinDate: "Dec 2022",
        productionsCount: 6,
        initials: "DK"
    }
];

export default function AllMembersDirectory() {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // Custom dropdown open flags
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Stats Calculations
    const stats = useMemo(() => {
        return {
            total: members.length,
            active: members.filter(m => m.status === "Active").length,
            newJoins: 12 // static matching mockup card total
        };
    }, [members]);

    // Handle Search and Filter logic
    const filteredMembers = useMemo(() => {
        return members.filter((member) => {
            const matchesSearch =
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = roleFilter === "All" || member.role === roleFilter;
            const matchesStatus = statusFilter === "All" || member.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [members, searchQuery, roleFilter, statusFilter]);

    // Pagination limits
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
    const paginatedMembers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMembers.slice(start, start + itemsPerPage);
    }, [filteredMembers, currentPage]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setRoleFilter("All");
        setStatusFilter("All");
        setCurrentPage(1);
    };

    const handleAddMember = () => {
        const name = prompt("Enter Member Name:");
        if (!name) return;
        const email = prompt("Enter Email address:");
        if (!email) return;
        const role = prompt("Enter Primary Role (e.g. Lead Actor, Tech Director, Ensemble, Choreographer):") || "Ensemble";

        const newMember: Member = {
            id: `#DC-${Math.floor(100 + Math.random() * 900)}`,
            name,
            email,
            role,
            status: "Active",
            joinDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            productionsCount: 0,
            initials: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        };

        setMembers([newMember, ...members]);
    };

    return (
        <div className="members-directory w-full flex-1 flex flex-col min-h-screen text-[#1c1b19]">
            <div className="flex-1 w-full max-w-container-max mx-auto px-6 md:px-16 py-12 flex flex-col gap-10">

                {/* Header Section */}
                <div className="flex flex-col gap-2">
                    <h2 className="font-headline-lg text-headline-lg text-[#1c1b19]">Member Directory</h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                        Manage your ensemble, technical crew, and support staff. Review statuses and assign roles across productions.
                    </p>
                </div>

                {/* Stats Summary Bar (Bento-ish Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                        <div className="flex items-center gap-3 text-on-surface-variant relative z-10">
                            <span className="material-symbols-outlined">groups</span>
                            <span className="font-label-md text-label-md tracking-wider">Total Members</span>
                        </div>
                        <div className="font-display-lg text-display-lg text-on-surface relative z-10">
                            {stats.total}
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                        <div className="flex items-center gap-3 text-on-surface-variant relative z-10">
                            <span className="material-symbols-outlined">theater_comedy</span>
                            <span className="font-label-md text-label-md tracking-wider">Active Performers</span>
                        </div>
                        <div className="font-display-lg text-display-lg text-secondary relative z-10">
                            {stats.active}
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 ease-out"></div>
                        <div className="flex items-center gap-3 text-on-surface-variant relative z-10">
                            <span className="material-symbols-outlined">person_celebrate</span>
                            <span className="font-label-md text-label-md tracking-wider">New Joins (Month)</span>
                        </div>
                        <div className="font-display-lg text-display-lg text-tertiary relative z-10">
                            {stats.newJoins}
                        </div>
                    </div>
                </div>

                {/* Sticky Toolbar (Search & Filters) */}
                <div className="sticky top-[64px] z-30 glass-panel py-4 -mx-6 px-6 md:-mx-16 md:px-16 border-y border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                    {/* Search Input (Matte Finish) */}
                    <div className="relative w-full md:w-96 group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                            search
                        </span>
                        <input
                            className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/50 focus:border-primary focus:ring-0 pl-10 pr-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-outline transition-colors rounded-t-lg"
                            placeholder="Search members by name or email..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 w-full md:w-auto overflow-visible">

                        {/* Role Filter Button + Panel */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setRoleDropdownOpen(!roleDropdownOpen);
                                    setStatusDropdownOpen(false);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 border ${roleFilter !== "All" ? "border-primary bg-primary-container-low font-bold" : "border-outline-variant"
                                    } rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors whitespace-nowrap`}
                            >
                                Role: {roleFilter}
                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                            </button>
                            {roleDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-outline-variant shadow-lg rounded-xl z-50 overflow-hidden">
                                    {["All", "Lead Actor", "Tech Director", "Ensemble", "Choreographer"].map((role) => (
                                        <button
                                            key={role}
                                            onClick={() => {
                                                setRoleFilter(role);
                                                setRoleDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-sm text-on-surface transition-colors"
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Filter Button + Panel */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setStatusDropdownOpen(!statusDropdownOpen);
                                    setRoleDropdownOpen(false);
                                }}
                                className={`flex items-center gap-2 px-4 py-2 border ${statusFilter !== "All" ? "border-primary bg-primary-container-low font-bold" : "border-outline-variant"
                                    } rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors whitespace-nowrap`}
                            >
                                Status: {statusFilter}
                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                            </button>
                            {statusDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-outline-variant shadow-lg rounded-xl z-50 overflow-hidden">
                                    {["All", "Active", "On Break"].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setStatusDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-surface-container-low text-sm text-on-surface transition-colors"
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Filter Button */}
                        <button
                            onClick={handleClearFilters}
                            className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface-variant rounded-full font-label-md text-label-md hover:bg-outline-variant transition-colors whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[18px]">filter_alt_off</span> Clear
                        </button>

                        {/* Add Member Button - aligns with search bar actions */}
                        <button
                            onClick={handleAddMember}
                            className="px-4 py-2 bg-primary-container text-on-primary-container border border-outline-variant/40 hover:bg-surface-container-highest rounded-full font-label-md text-label-md transition-colors flex items-center gap-2 ml-auto"
                        >
                            <span className="material-symbols-outlined text-[18px]">person_add</span>
                            <span className="hidden sm:inline">Add Member</span>
                        </button>
                    </div>
                </div>

                {/* Data Table Container */}
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.02)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-container-low border-b border-outline-variant/30">
                                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Member</th>
                                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Contact</th>
                                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Primary Role</th>
                                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
                                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">Joined</th>
                                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-center">Productions</th>
                                    <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20">
                                {paginatedMembers.length > 0 ? (
                                    paginatedMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-surface-container-low/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {member.avatarUrl ? (
                                                        <img
                                                            alt="Avatar"
                                                            className="w-10 h-10 rounded-full object-cover border border-outline-variant/50"
                                                            src={member.avatarUrl}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-base font-bold border border-outline-variant/50">
                                                            {member.initials}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-label-md text-label-md text-on-surface font-bold">{member.name}</div>
                                                        <div className="font-body-sm text-sm text-outline">ID: {member.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-on-surface-variant font-body-md text-body-md bg-transparent select-all">
                                                {member.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-md font-label-md text-[13px] border ${member.role === "Lead Actor"
                                                    ? "bg-secondary-container/50 text-on-secondary-container border-secondary-container"
                                                    : member.role === "Tech Director"
                                                        ? "bg-tertiary-container/50 text-on-tertiary-container border-tertiary-container"
                                                        : "bg-surface-variant text-on-surface-variant border-outline-variant/50"
                                                    }`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 font-label-md text-label-md ${member.status === "Active" ? "text-primary" : "text-outline"
                                                    }`}>
                                                    <span className={`w-2 h-2 rounded-full ${member.status === "Active" ? "bg-primary" : "border border-outline"
                                                        }`}></span>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-on-surface-variant font-body-md text-body-md">{member.joinDate}</td>
                                            <td className="px-6 py-4 text-center font-headline-md text-lg text-on-surface font-bold">
                                                {member.productionsCount}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => alert(`Viewing profile for ${member.name}`)}
                                                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                                                        title="View Profile"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    <button
                                                        onClick={() => alert(`Starting message chat with ${member.name}`)}
                                                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                                                        title="Message"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">chat</span>
                                                    </button>
                                                    <button
                                                        onClick={() => navigate("/profile-audit")}
                                                        className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center font-body-md text-body-md text-outline">
                                            No directory members found matching search query or applied filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="border-t border-outline-variant/30 px-6 py-4 flex items-center justify-between bg-surface-container-lowest">
                        <div className="font-body-sm text-sm text-outline">
                            Showing <span className="font-semibold text-on-surface-variant">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                            <span className="font-semibold text-on-surface-variant">
                                {Math.min(currentPage * itemsPerPage, filteredMembers.length)}
                            </span>{" "}
                            of <span className="font-semibold text-on-surface-variant">{filteredMembers.length}</span> results
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container disabled:opacity-50 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md font-label-md text-sm transition-colors ${currentPage === i + 1
                                            ? "bg-primary-container text-on-primary-container font-bold"
                                            : "hover:bg-surface-container text-on-surface-variant"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
