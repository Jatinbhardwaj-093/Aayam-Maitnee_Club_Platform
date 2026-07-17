// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, Filter, Mail, Phone, Calendar, ChevronRight, Eye, Edit3, MoreHorizontal, UserCheck, UserX, Award } from "lucide-react";

interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    joinDate: string;
    productionsCount: number;
    avatarUrl?: string;
    initials?: string;
    labels?: { id: number; name: string; color: string }[];
}

export default function AllMembersDirectory() {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
        fetch(`${baseUrl}/api/members`)
            .then((res) => {
                if (!res.ok) throw new Error("HTTP error");
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    const mapped = data.map((m: any) => ({
                        id: m.member_id || m.id.toString(),
                        name: m.name,
                        email: m.email,
                        role: m.roles && m.roles.length > 0 ? m.roles[0] : "Member",
                        status: m.status || "Active",
                        joinDate: m.joinDate || "Recent",
                        productionsCount: m.productionsCount || 0,
                        avatarUrl: m.avatarUrl || undefined,
                        initials: m.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
                        labels: m.labels || []
                    }));
                    setMembers(mapped);
                }
            })
            .catch((err) => {
                console.error("Failed to load members:", err);
                setError(err.toString());
            });
    }, []);

    const [error, setError] = useState<string | null>(null);

    // Handle Search and Filter
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
    const paginatedMembers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMembers.slice(start, start + itemsPerPage);
    }, [filteredMembers, currentPage]);

    const stats = useMemo(() => {
        return {
            total: members.length,
            active: members.filter(m => m.status === "Active" || m.status === "Approved").length,
            newJoins: members.length > 0 ? 3 : 0
        };
    }, [members]);

    return (
        <div className="flex-1 bg-[#fdf9f4] text-[#1c1b19] font-sans py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#635f41] tracking-tight mb-2">Member Directory</h2>
                        <p className="text-sm text-[#466272] max-w-2xl">
                            Manage your ensemble, technical crew, and support staff. Review statuses and manage Discord-style profile labels.
                        </p>
                    </div>
                </div>

                {/* Stats Summary Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white border border-[#cac6b9]/40 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#635f41]/10 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-center gap-3 text-[#466272] relative z-10 mb-4">
                            <Users className="w-5 h-5 text-[#8CC0EB]" />
                            <span className="text-xs font-bold uppercase tracking-wider">Total Members</span>
                        </div>
                        <div className="text-4xl font-serif font-bold text-[#635f41] relative z-10">{stats.total}</div>
                    </div>
                    <div className="bg-white border border-[#cac6b9]/40 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#8CC0EB]/20 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-center gap-3 text-[#466272] relative z-10 mb-4">
                            <UserCheck className="w-5 h-5 text-[#8CC0EB]" />
                            <span className="text-xs font-bold uppercase tracking-wider">Active Performers</span>
                        </div>
                        <div className="text-4xl font-serif font-bold text-[#635f41] relative z-10">{stats.active}</div>
                    </div>
                    <div className="bg-white border border-[#cac6b9]/40 rounded-3xl p-6 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="flex items-center gap-3 text-[#466272] relative z-10 mb-4">
                            <Award className="w-5 h-5 text-green-500" />
                            <span className="text-xs font-bold uppercase tracking-wider">New Joins</span>
                        </div>
                        <div className="text-4xl font-serif font-bold text-[#635f41] relative z-10">{stats.newJoins}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border border-[#cac6b9]/30 rounded-2xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8CC0EB]/50 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <select 
                            className="bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Approved">Approved</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                {/* Members Grid */}
                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">
                        Error loading members: {error}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedMembers.length > 0 ? (
                        paginatedMembers.map((member) => (
                            <div 
                                key={member.id} 
                                className="bg-white border border-[#cac6b9]/40 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-[#8CC0EB]/40 transition-all duration-300 group flex flex-col cursor-pointer"
                                onClick={() => navigate(`/profile-audit?email=${encodeURIComponent(member.email)}`)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    {member.avatarUrl ? (
                                        <img src={member.avatarUrl} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-[#635f41]/10 text-[#635f41] border-2 border-white shadow-sm flex items-center justify-center font-bold text-lg">
                                            {member.initials}
                                        </div>
                                    )}
                                    <div className="flex gap-1">
                                        <span className={`w-2.5 h-2.5 rounded-full ${member.status === 'Active' || member.status === 'Approved' ? 'bg-green-500' : 'bg-amber-400'}`} title={member.status}></span>
                                    </div>
                                </div>
                                
                                <h3 className="font-bold text-lg text-[#1c1b19] tracking-tight">{member.name}</h3>
                                <p className="text-xs text-[#466272] mb-3">{member.email}</p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap gap-1.5">
                                    <span className="inline-block px-2 py-0.5 rounded bg-[#8CC0EB]/20 text-[#2e4a5a] text-[10px] font-bold uppercase tracking-wider mb-1 w-fit">
                                        {member.role}
                                    </span>
                                    {member.labels?.slice(0,2).map(label => (
                                        <span 
                                            key={label.id} 
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                                            style={{ backgroundColor: `${label.color}15`, border: `1px solid ${label.color}40`, color: label.color }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: label.color}}></span>
                                            {label.name}
                                        </span>
                                    ))}
                                    {member.labels && member.labels.length > 2 && (
                                        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                                            +{member.labels.length - 2}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-16 text-center bg-white border border-dashed border-[#cac6b9] rounded-3xl">
                            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-500 font-medium">No members found matching your filters.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-semibold text-gray-500 mx-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
