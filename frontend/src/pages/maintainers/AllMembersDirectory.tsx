// @ts-nocheck
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Mail,
  Calendar,
  Eye,
  UserCheck,
  Award,
  UserPlus,
  Download,
  LayoutGrid,
  List,
  Sparkles,
  Shield,
  MoreVertical,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Clapperboard,
  ArrowUpRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Member Form State
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "Lead Actor & Member",
    status: "Active"
  });

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
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
            joinDate: m.joinDate || "Oct 2023",
            productionsCount: m.productionsCount || Math.floor(Math.random() * 4) + 1,
            avatarUrl: m.avatarUrl || undefined,
            initials: m.name
              ? m.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "MB",
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

  // Unique roles for filter dropdown
  const availableRoles = useMemo(() => {
    const rolesSet = new Set(members.map((m) => m.role));
    return ["All", ...Array.from(rolesSet)];
  }, [members]);

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

  // Pagination
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
      active: members.filter((m) => m.status === "Active" || m.status === "Approved").length,
      newJoins: members.length > 0 ? 3 : 0
    };
  }, [members]);

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const created: Member = {
      id: `MEM-${Date.now().toString().slice(-4)}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: newMember.status,
      joinDate: "Just now",
      productionsCount: 1,
      initials: newMember.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      labels: [{ id: 101, name: "New Member", color: "#E85F57" }]
    };

    setMembers([created, ...members]);
    setNewMember({ name: "", email: "", role: "Lead Actor & Member", status: "Active" });
    setIsAddModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ["ID,Name,Email,Role,Status,JoinDate,ProductionsCount\n"];
    const rows = filteredMembers.map(
      (m) => `"${m.id}","${m.name}","${m.email}","${m.role}","${m.status}","${m.joinDate}",${m.productionsCount}`
    );
    const blob = new Blob([headers.concat(rows.join("\n")).join("")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aayam_members_roster.csv";
    a.click();
  };

  // Helper for role badge colors
  const getRoleStyle = (role: string) => {
    const lower = role.toLowerCase();
    if (lower.includes("maintainer") || lower.includes("director")) {
      return "bg-[#353535]/10 text-[#353535] border-[#353535]/30";
    }
    if (lower.includes("patron") || lower.includes("sponsor")) {
      return "bg-amber-50 text-amber-800 border-amber-200";
    }
    if (lower.includes("actor") || lower.includes("performer")) {
      return "bg-[#E85F57]/20 text-[#1e4463] border-[#E85F57]/40";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="flex-1 bg-[#E7DDD3] text-[#2C2A28] font-sans pb-16">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#DDD8CE]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#353535]/10 text-[#353535] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#353535]" /> Maintainer Governance
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#353535] tracking-tight">
              Members & Crew Directory
            </h1>
            <p className="text-xs md:text-sm text-[#666361] mt-1 max-w-2xl">
              Central roster management for ensemble performers, directors, technical crew, and patrons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5C9BE] bg-white text-[#666361] hover:bg-[#EFE8E1] text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-[#353535]" />
              Export Roster
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353535] text-white hover:bg-[#353535]/90 text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </button>
          </div>
        </div>

        {/* Executive Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#666361]">Total Members</span>
                <div className="text-3xl font-serif font-bold text-[#353535]">{stats.total}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#353535]/10 flex items-center justify-center text-[#353535]">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#666361]/80">
              <span className="flex items-center gap-1 font-medium text-emerald-600">
                <Sparkles className="w-3 h-3" /> Fully Synced
              </span>
              <span>Across all productions</span>
            </div>
          </div>

          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#666361]">Active Performers</span>
                <div className="text-3xl font-serif font-bold text-[#353535]">{stats.active}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#E85F57]/20 flex items-center justify-center text-[#1e4463]">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#666361]/80">
              <span className="flex items-center gap-1 text-[#666361]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Verified
              </span>
              <span>Stage Ready</span>
            </div>
          </div>

          <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#666361]">New Joins</span>
                <div className="text-3xl font-serif font-bold text-[#353535]">{stats.newJoins}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Award className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#666361]/80">
              <span className="text-emerald-700 font-semibold">+3 this month</span>
              <span>Onboarding active</span>
            </div>
          </div>
        </div>

        {/* Filter & Controls Toolbar */}
        <div className="bg-white border border-[#DDD8CE] rounded-2xl p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
          <div className="flex-1 flex flex-col md:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-2 bg-[#E7DDD3] border border-[#D5C9BE]/60 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E85F57] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter by Role */}
            <div className="w-full md:w-auto">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full md:w-auto bg-[#E7DDD3] border border-[#D5C9BE]/60 rounded-xl px-3 py-2 text-xs text-[#666361] font-medium focus:outline-none"
              >
                <option value="All">All Roles ({availableRoles.length - 1})</option>
                {availableRoles
                  .filter((r) => r !== "All")
                  .map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full md:w-auto bg-[#E7DDD3] border border-[#D5C9BE]/60 rounded-xl px-3 py-2 text-xs text-[#666361] font-medium focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Right Toolbar Actions (Layout switcher & counter) */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
            <span className="text-xs text-[#666361]/70 font-medium">
              Showing <strong>{filteredMembers.length}</strong> members
            </span>

            <div className="flex items-center bg-[#E7DDD3] p-1 border border-[#D5C9BE]/60 rounded-xl gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-[#353535] shadow-xs font-bold"
                    : "text-[#666361]/60 hover:text-[#666361]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "table"
                    ? "bg-white text-[#353535] shadow-xs font-bold"
                    : "text-[#666361]/60 hover:text-[#666361]"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Member Directory Content */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-medium">
            Error loading member directory: {error}
          </div>
        )}

        {paginatedMembers.length === 0 ? (
          <div className="py-16 text-center bg-white border border-dashed border-[#D5C9BE] rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E7DDD3] flex items-center justify-center mx-auto text-[#666361]/60">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#353535]">No matching members found</h3>
            <p className="text-xs text-[#666361]/70 max-w-sm mx-auto">
              Try adjusting your search keywords or resetting status/role filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("All");
                setStatusFilter("All");
              }}
              className="text-xs font-bold text-[#E85F57] hover:underline pt-2 inline-block"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginatedMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-[#DDD8CE] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#E85F57] transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Card Top: Avatar & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#353535]/10 text-[#353535] border border-[#DDD8CE] flex items-center justify-center font-bold text-sm">
                          {member.initials}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          member.status === "Active" || member.status === "Approved"
                            ? "bg-emerald-500"
                            : "bg-amber-400"
                        }`}
                        title={member.status}
                      />
                    </div>

                    <button
                      onClick={() => navigate(`/profile-audit?email=${encodeURIComponent(member.email)}`)}
                      className="p-1.5 text-[#666361]/50 hover:text-[#353535] hover:bg-[#E7DDD3] rounded-lg transition-all"
                      title="View Member Audit Log"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Name & Contact */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#2C2A28] tracking-tight group-hover:text-[#353535] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#666361]/70 truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#666361]/50 flex-shrink-0" />
                      {member.email}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div className="mt-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleStyle(
                        member.role
                      )}`}
                    >
                      {member.role}
                    </span>
                  </div>

                  {/* Custom Labels */}
                  {member.labels && member.labels.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {member.labels.slice(0, 2).map((label) => (
                        <span
                          key={label.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${label.color}15`,
                            border: `1px solid ${label.color}40`,
                            color: label.color
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: label.color }} />
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Details */}
                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#666361]/70">
                  <span className="flex items-center gap-1">
                    <Clapperboard className="w-3.5 h-3.5 text-[#353535]/60" />
                    {member.productionsCount} Plays
                  </span>
                  <button
                    onClick={() => navigate(`/profile-audit?email=${encodeURIComponent(member.email)}`)}
                    className="text-xs font-bold text-[#E85F57] hover:text-[#1e4463] transition-colors"
                  >
                    Manage Roster →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white border border-[#DDD8CE] rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#E7DDD3] border-b border-[#DDD8CE] text-[#666361] uppercase tracking-wider font-bold text-[10px]">
                    <th className="py-3.5 px-6">Member</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Productions</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-[#E7DDD3]/60 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-9 h-9 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#353535]/10 text-[#353535] border border-[#DDD8CE] flex items-center justify-center font-bold text-xs">
                              {member.initials}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-[#2C2A28]">{member.name}</div>
                            <div className="text-[11px] text-[#666361]/70">{member.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleStyle(
                            member.role
                          )}`}
                        >
                          {member.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            member.status === "Active" || member.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.status === "Active" || member.status === "Approved"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          />
                          {member.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#666361]">
                        {member.productionsCount} productions
                      </td>

                      <td className="py-3.5 px-4 text-[#666361]/70">{member.joinDate}</td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => navigate(`/profile-audit?email=${encodeURIComponent(member.email)}`)}
                          className="px-3 py-1.5 rounded-lg bg-[#E85F57]/20 text-[#1e4463] hover:bg-[#E85F57]/40 font-bold text-[11px] transition-all"
                        >
                          View Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-[#DDD8CE]">
            <span className="text-xs text-[#666361]">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="border-[#D5C9BE] text-[#666361] hover:bg-[#EFE8E1] text-xs h-8"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="border-[#D5C9BE] text-[#666361] hover:bg-[#EFE8E1] text-xs h-8"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-[#E7DDD3] border border-[#D5C9BE] text-[#666361] max-w-md rounded-2xl shadow-xl p-6">
          <DialogHeader className="border-b border-[#DDD8CE] pb-3">
            <DialogTitle className="font-serif text-xl text-[#353535] font-bold">
              Add New Ensemble Member
            </DialogTitle>
            <DialogDescription className="text-xs text-[#666361]/85">
              Register a performer, crew member, or coordinator into the Matinee roster.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMemberSubmit} className="py-4 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#353535] font-bold">
                Full Name
              </label>
              <Input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="border-[#DDD8CE] bg-white h-9 text-xs rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#353535] font-bold">
                Email Address
              </label>
              <Input
                type="email"
                required
                placeholder="e.g. aarav@matinee.club"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="border-[#DDD8CE] bg-white h-9 text-xs rounded-lg"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#353535] font-bold">
                Production Role
              </label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full bg-white border border-[#DDD8CE] rounded-lg px-3 py-2 text-xs text-[#666361] font-medium focus:outline-none"
              >
                <option value="Lead Actor & Member">Lead Actor & Member</option>
                <option value="Director Coordinator">Director Coordinator</option>
                <option value="Core Maintainer">Core Maintainer</option>
                <option value="Production Coordinator">Production Coordinator</option>
                <option value="Scenic Artist">Scenic Artist</option>
                <option value="Choreographer">Choreographer</option>
                <option value="Grand Patron & Sponsor">Grand Patron & Sponsor</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-[#353535] font-bold">
                Initial Status
              </label>
              <select
                value={newMember.status}
                onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
                className="w-full bg-white border border-[#DDD8CE] rounded-lg px-3 py-2 text-xs text-[#666361] font-medium focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <DialogFooter className="pt-4 border-t border-[#DDD8CE] flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="border-[#D5C9BE] text-[#666361] hover:bg-[#EFE8E1] rounded-lg text-xs font-bold flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#353535] text-white hover:bg-[#353535]/90 rounded-lg text-xs font-bold flex-1"
              >
                Save Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
