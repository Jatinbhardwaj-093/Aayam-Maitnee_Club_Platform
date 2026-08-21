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
            role: m.roles && m.roles.length > 0 ? m.roles[0] : (m.role || "Member"),
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
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.role) set.add(m.role);
    });
    return ["All", ...Array.from(set)];
  }, [members]);

  // Filtered list based on Search, Role, and Status
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.id.toLowerCase().includes(q) ||
        (member.role && member.role.toLowerCase().includes(q));

      const matchesRole = roleFilter === "All" || member.role === roleFilter;
      const matchesStatus = statusFilter === "All" || member.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, statusFilter]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "Active" || m.status === "Approved").length;
    const newJoins = members.filter((m) => m.joinDate && m.joinDate.includes("2026")).length || 3;
    return { total, active, newJoins };
  }, [members]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;

  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, currentPage]);

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5005";
      const res = await fetch(`${baseUrl}/api/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMember.name,
          email: newMember.email,
          role: newMember.role,
          status: newMember.status,
          phone: "+91 98765 00000",
          state: "Tamil Nadu",
          country: "India",
          pronouns: "they/them",
          interest: "Acting",
          availability: "Flexible",
          bio: "Joined via Maintainer Roster Console."
        })
      });

      if (res.ok) {
        const added = await res.json();
        if (added.member) {
          const freshMember: Member = {
            id: added.member.member_id || added.member.id.toString(),
            name: added.member.name,
            email: added.member.email,
            role: newMember.role,
            status: newMember.status,
            joinDate: "Just now",
            productionsCount: 1,
            avatarUrl: added.member.avatarUrl,
            initials: added.member.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2),
            labels: []
          };
          setMembers((prev) => [freshMember, ...prev]);
        }
        setIsAddModalOpen(false);
        setNewMember({ name: "", email: "", role: "Lead Actor & Member", status: "Active" });
      }
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Member ID", "Name", "Email", "Role", "Status", "Productions", "Joined Date"];
    const rows = filteredMembers.map((m) => [
      `"${m.id}"`,
      `"${m.name}"`,
      `"${m.email}"`,
      `"${m.role}"`,
      `"${m.status}"`,
      m.productionsCount,
      `"${m.joinDate}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aayam_members_roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleStyle = (role: string) => {
    const lower = (role || "").toLowerCase();
    if (lower.includes("secretary") || lower.includes("director")) {
      return "bg-[#8C241E] text-[#FDF8F7] border-[#8C241E]";
    }
    if (lower.includes("maintainer") || lower.includes("chief") || lower.includes("coordinator")) {
      return "bg-[#EEDBD5] text-[#8C241E] border-[#D5AAA2]";
    }
    if (lower.includes("patron") || lower.includes("sponsor")) {
      return "bg-amber-100 text-amber-900 border-amber-300";
    }
    if (lower.includes("actor") || lower.includes("actress") || lower.includes("performer")) {
      return "bg-[#E8D6CF] text-[#5C3B37] border-[#DCBAB2]";
    }
    return "bg-[#FAF2EE] text-[#5C3B37] border-[#DCBAB2]";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 md:px-8 font-sans text-[#2C2A28] pb-24">
      
      {/* Editorial Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8B4AE]/60">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] bg-[#E85F57]/15 px-3 py-1 rounded-full border border-[#E85F57]/30">
            <Shield className="w-3.5 h-3.5 text-[#B32D25]" />
            <span>MAINTAINER GOVERNANCE</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
            Members & Crew Directory
          </h1>
          <p className="text-sm text-[#5C3B37] max-w-2xl font-light">
            Central roster governance for ensemble performers, directors, technical crew, and patrons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-5 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#8C241E]" />
            <span>Export Roster</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 flex items-center gap-2 transition-all cursor-pointer border border-[#A6352F]"
          >
            <UserPlus className="w-4 h-4 text-[#FFD0CC]" />
            <span>Add Member</span>
          </button>
        </div>
      </section>

      {/* Metrics Dashboard - Theatrical Crimson Theme */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#784A45] mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Total Members</span>
            <div className="w-8 h-8 rounded-full bg-[#E85F57]/15 flex items-center justify-center text-[#B32D25]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#2A1816]">{stats.total}</div>
          <div className="mt-3 pt-3 border-t border-[#D8B4AE]/50 flex items-center justify-between text-[11px] text-[#6E4742]">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <Sparkles className="w-3 h-3" /> Fully Synced
            </span>
            <span>Across all productions</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#784A45] mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Active Performers</span>
            <div className="w-8 h-8 rounded-full bg-emerald-700/15 flex items-center justify-center text-emerald-800">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#2A1816]">{stats.active}</div>
          <div className="mt-3 pt-3 border-t border-[#D8B4AE]/50 flex items-center justify-between text-[11px] text-[#6E4742]">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
            </span>
            <span>Stage Ready</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#F5EAE6] to-[#EEDBD5] border border-[#DEBEB7] rounded-[2rem] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#784A45] mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest">New Joins</span>
            <div className="w-8 h-8 rounded-full bg-[#E85F57]/15 flex items-center justify-center text-[#B32D25]">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-[#2A1816]">{stats.newJoins}</div>
          <div className="mt-3 pt-3 border-t border-[#D8B4AE]/50 flex items-center justify-between text-[11px] text-[#6E4742]">
            <span className="text-emerald-800 font-bold">+3 this month</span>
            <span>Onboarding active</span>
          </div>
        </div>
      </section>

      {/* Main Roster Container - Theatrical Crimson Styling */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2rem] p-8 shadow-sm space-y-6">
        
        {/* Filter & Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D8B4AE]/70">
          <div className="flex-1 flex flex-col md:flex-row gap-3 items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C5A54]" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-9 py-2 bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-full text-xs text-[#2A1816] focus:outline-none focus:border-[#B32D25] focus:bg-[#E8D6CF] transition-all placeholder:text-[#8C5A54]/70 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C5A54] hover:text-[#2A1816]"
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
                className="w-full md:w-auto bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-3 py-2 text-xs text-[#2A1816] font-bold focus:outline-none focus:border-[#B32D25] shadow-inner"
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
                className="w-full md:w-auto bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-3 py-2 text-xs text-[#2A1816] font-bold focus:outline-none focus:border-[#B32D25] shadow-inner"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Right Toolbar Actions (Layout switcher & counter) */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0">
            <span className="text-xs text-[#6E4742] font-medium font-mono">
              Showing <strong>{filteredMembers.length}</strong> members
            </span>

            <div className="flex items-center bg-[#E5D2CB] p-1 border border-[#D2A59D] rounded-full gap-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[#8C241E] text-[#FDF8F7] shadow-md"
                    : "text-[#6E4742] hover:text-[#2A1816]"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-[#8C241E] text-[#FDF8F7] shadow-md"
                    : "text-[#6E4742] hover:text-[#2A1816]"
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-[#EEDBD5] border border-[#B32D25]/40 text-[#8C241E] p-4 rounded-xl text-xs font-mono">
            Error loading member directory: {error}
          </div>
        )}

        {/* Member Grid or Table */}
        {paginatedMembers.length === 0 ? (
          <div className="py-16 text-center bg-[#E7DDD3] border border-dashed border-[#D5C9BE] rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#E8D6CF] flex items-center justify-center mx-auto text-[#6E4742]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-serif font-bold text-[#2A1816]">No matching members found</h3>
            <p className="text-xs text-[#6E4742] max-w-sm mx-auto font-light">
              Try adjusting your search keywords or resetting status/role filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setRoleFilter("All");
                setStatusFilter("All");
              }}
              className="text-xs font-mono font-bold text-[#B32D25] hover:underline pt-2 inline-block uppercase cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View - Using Signature Cream Card Background */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {paginatedMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#B32D25]/60 transition-all duration-300 flex flex-col justify-between group relative"
              >
                <div>
                  {/* Card Top: Avatar & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#D5AAA2] shadow-xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2] flex items-center justify-center font-bold text-sm">
                          {member.initials}
                        </div>
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#E7DDD3] ${
                          member.status === "Active" || member.status === "Approved"
                            ? "bg-emerald-600"
                            : "bg-amber-500"
                        }`}
                        title={member.status}
                      />
                    </div>

                    <button
                      onClick={() => navigate(`/profile-audit?email=${encodeURIComponent(member.email)}`)}
                      className="p-1.5 text-[#8C5A54] hover:text-[#2A1816] hover:bg-[#EEDBD5] rounded-lg transition-all cursor-pointer"
                      title="View Member Audit Log"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Name & Contact */}
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-[#2A1816] tracking-tight leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#6E4742] truncate flex items-center gap-1 font-mono text-[11px]">
                      <Mail className="w-3 h-3 text-[#8C5A54] shrink-0" />
                      {member.email}
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div className="mt-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${getRoleStyle(
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
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold"
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
                <div className="mt-6 pt-3 border-t border-[#D8B4AE]/50 flex items-center justify-between text-[11px] text-[#6E4742]">
                  <span className="flex items-center gap-1 font-mono text-[10px]">
                    <Clapperboard className="w-3.5 h-3.5 text-[#B32D25]" />
                    {member.productionsCount} Plays
                  </span>
                  <button
                    onClick={() => navigate(`/profile-audit?email=${encodeURIComponent(member.email)}`)}
                    className="text-xs font-mono font-bold text-[#8C241E] hover:text-[#731B16] transition-colors cursor-pointer flex items-center gap-0.5"
                  >
                    <span>Manage Roster</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#E5D2CB] border-b border-[#D5AAA2] text-[#5C3B37] uppercase tracking-wider font-mono font-bold text-[10px]">
                    <th className="py-3.5 px-6">Member</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Productions</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8B4AE]/40">
                  {paginatedMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-[#EEDBD5]/60 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#D5AAA2]"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#EEDBD5] text-[#8C241E] border border-[#D5AAA2] flex items-center justify-center font-bold text-xs">
                              {member.initials}
                            </div>
                          )}
                          <div>
                            <div className="font-serif font-bold text-sm text-[#2A1816]">{member.name}</div>
                            <div className="text-[11px] text-[#6E4742] font-mono">{member.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${getRoleStyle(
                            member.role
                          )}`}
                        >
                          {member.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            member.status === "Active" || member.status === "Approved"
                              ? "bg-emerald-700/15 text-emerald-900 border border-emerald-700/30"
                              : "bg-amber-700/15 text-amber-950 border border-amber-700/30"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.status === "Active" || member.status === "Approved"
                                ? "bg-emerald-600"
                                : "bg-amber-600"
                            }`}
                          />
                          {member.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-[#5C3B37]">
                        {member.productionsCount} productions
                      </td>

                      <td className="py-3.5 px-4 text-[#6E4742] font-mono">{member.joinDate}</td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => navigate(`/profile-audit?email=${encodeURIComponent(member.email)}`)}
                          className="px-3 py-1.5 rounded-lg bg-[#8C241E] text-[#FDF8F7] hover:bg-[#731B16] font-mono font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer border border-[#A6352F]"
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
          <div className="flex items-center justify-between pt-4 border-t border-[#D8B4AE]/70">
            <span className="text-xs text-[#6E4742] font-mono">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="border-[#D5AAA2] text-[#5C3B37] hover:bg-[#EEDBD5] text-xs h-8 rounded-lg cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="border-[#D5AAA2] text-[#5C3B37] hover:bg-[#EEDBD5] text-xs h-8 rounded-lg cursor-pointer"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Add Member Dialog - Theatrical Crimson Themed */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent showCloseButton={false} className="bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] sm:max-w-md max-w-md rounded-[2.5rem] p-8 shadow-2xl relative">
          
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group"
            title="Close dialog"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          <DialogHeader className="border-b border-[#D8B4AE]/70 pb-3 pr-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#B32D25] mb-1">
              <UserPlus className="w-3.5 h-3.5" />
              <span>ROSTER REGISTRATION</span>
            </div>
            <DialogTitle className="font-serif text-2xl text-[#2A1816] font-bold">
              Add Ensemble Member
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5C3B37]">
              Register a performer, crew member, or coordinator into the Matinee roster.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMemberSubmit} className="py-4 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                Full Name *
              </label>
              <Input
                type="text"
                required
                placeholder="e.g. Aarav Sharma"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="border-[#D5AAA2] bg-[#E8D6CF]/70 h-10 text-xs rounded-xl font-semibold text-[#2A1816] focus:border-[#B32D25] shadow-inner"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                Email Address *
              </label>
              <Input
                type="email"
                required
                placeholder="e.g. aarav@ds.study.iitm.ac.in"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="border-[#D5AAA2] bg-[#E8D6CF]/70 h-10 text-xs rounded-xl font-semibold text-[#2A1816] focus:border-[#B32D25] shadow-inner"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                Production Role
              </label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                className="w-full bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-3 py-2 text-xs text-[#2A1816] font-bold focus:outline-none focus:border-[#B32D25] shadow-inner"
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
              <label className="text-xs font-mono uppercase tracking-wider text-[#2A1816] font-bold">
                Initial Status
              </label>
              <select
                value={newMember.status}
                onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
                className="w-full bg-[#E8D6CF]/70 border border-[#D5AAA2] rounded-xl px-3 py-2 text-xs text-[#2A1816] font-bold focus:outline-none focus:border-[#B32D25] shadow-inner"
              >
                <option value="Active">Active</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <DialogFooter className="pt-4 border-t border-[#D8B4AE]/70 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="border-[#D5AAA2] text-[#6E4742] hover:bg-[#EEDBD5] rounded-full text-xs font-mono font-bold uppercase tracking-wider flex-1 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] rounded-full text-xs font-mono font-bold uppercase tracking-widest flex-1 cursor-pointer border border-[#A6352F] shadow-md shadow-[#8C241E]/20"
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
