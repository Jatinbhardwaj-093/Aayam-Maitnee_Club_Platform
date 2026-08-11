import { useState, useEffect } from "react";
import { PlusCircle, Search, Shield, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface RosterMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  isAvailable: boolean;
}

const fallbackRoster: RosterMember[] = [
  { id: "MC-1001", name: "Sneha Vyas", role: "Director Coordinator", phone: "+91 98765 33333", email: "sneha@handle.com", isAvailable: true },
  { id: "MC-1005", name: "Jayesh Dave", role: "Lead Actor & Member", phone: "+91 98765 43210", email: "jayesh@handle.com", isAvailable: true },
  { id: "MC-1004", name: "Siddharth Verma", role: "Production Coordinator", phone: "+91 98765 77777", email: "siddharth@handle.com", isAvailable: true },
  { id: "MC-1002", name: "Kabir Mehta", role: "Core Maintainer", phone: "+91 98765 88888", email: "kabir@handle.com", isAvailable: true },
];

export default function ProductionOffice() {
  const [roster, setRoster] = useState<RosterMember[]>(fallbackRoster);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5005/api/members")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((m: any) => ({
            id: m.member_id || m.id.toString(),
            name: m.name,
            role: m.roles && m.roles.length > 0 ? m.roles[0] : "Member",
            phone: m.phone || "+91 98765 00000",
            email: m.email,
            isAvailable: m.status === "Active"
          }));
          setRoster(mapped);
        }
      })
      .catch((err) => console.error("Failed to load roster:", err));
  }, []);

  const [open, setOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleCreateProduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newRole) return;
    const newMember: RosterMember = {
      id: `R0${roster.length + 1}`,
      name: newName,
      role: newRole,
      phone: newPhone || "+91 98765 00000",
      email: newEmail || `${newName.toLowerCase().replace(" ", ".")}@matinee.club`,
      isAvailable: true,
    };
    setRoster([...roster, newMember]);
    setNewName("");
    setNewRole("");
    setNewPhone("");
    setNewEmail("");
    setOpen(false);
  };

  const toggleAvailability = (id: string) => {
    setRoster(prev => prev.map(m => m.id === id ? { ...m, isAvailable: !m.isAvailable } : m));
  };

  const filteredRoster = roster.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Overview Block */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-[32px] md:mb-[48px]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#635f41]" />
            <span className="text-xs uppercase tracking-widest text-[#466272]/70 font-semibold">Director Office</span>
          </div>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Production Office Dashboard</h2>
          <p className="text-sm text-[#466272]">
            Maintainer dashboard to schedule reads, toggle actor availability, and initialize new productions.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 font-semibold rounded-[8px] py-[10px] px-[20px] gap-1.5 transition-all active:scale-95" />}>
            <PlusCircle className="w-4 h-4" /> New Production
          </DialogTrigger>
          <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272]">
            <form onSubmit={handleCreateProduction}>
              <DialogHeader className="space-y-2">
                <DialogTitle className="font-serif text-[#635f41]">Initialize New Production</DialogTitle>
                <DialogDescription className="text-[#466272]/85 text-xs">
                  Create a new theater production instance on Aayam.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Cast/Crew Name</label>
                  <Input
                    placeholder="e.g., Kabir Bedi"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Role Designation</label>
                  <Input
                    placeholder="e.g., Lead Scenic Designer"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Phone Number</label>
                  <Input
                    placeholder="+1 555-0100"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Email Address</label>
                  <Input
                    type="email"
                    placeholder="benedict@matinee.club"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px]">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                  Launch Production Member
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Member Roster Board */}
      <section className="bg-white border border-[#e6e2dd] rounded-[8px] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-[#e6e2dd] bg-[#f7f3ee]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#8CC0EB]" /> Active Member Roster
            </h3>
            <p className="text-xs text-[#466272]/70">Track actor contact sheets and availability states</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#466272]/50" />
            <Input
              placeholder="Search roster..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 border-[#e6e2dd] focus-visible:ring-[#8CC0EB] h-9 text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e6e2dd] hover:bg-transparent">
                <TableHead className="text-[#635f41] font-semibold w-24">Member ID</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Name</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Role</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Contact Details</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Availability</TableHead>
                <TableHead className="text-[#635f41] font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoster.map((member) => (
                <TableRow key={member.id} className="border-b border-[#e6e2dd]/60 hover:bg-[#fdf9f4]/45">
                  <TableCell className="font-semibold text-xs text-[#466272]/70 py-[16px]">{member.id}</TableCell>
                  <TableCell className="font-semibold text-[#635f41] py-[16px]">{member.name}</TableCell>
                  <TableCell className="py-[16px]">
                    <Badge variant="outline" className="border-[#635f41]/25 text-[#635f41] bg-[#635f41]/5 rounded-[4px]">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[#466272]/85 py-[16px]">
                    <div className="flex flex-col">
                      <span>{member.phone}</span>
                      <span className="text-[#466272]/65">{member.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-[16px]">
                    <Badge className={`rounded-[4px] ${
                      member.isAvailable 
                        ? "bg-emerald-600/10 text-emerald-700 border-emerald-600/20" 
                        : "bg-red-600/10 text-red-700 border-red-600/20"
                    }`}>
                      {member.isAvailable ? "Available" : "Checked Out"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-[16px]">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-8 rounded-[4px] font-semibold text-xs border-2 transition-all ${
                        member.isAvailable
                          ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                      onClick={() => toggleAvailability(member.id)}
                    >
                      {member.isAvailable ? "Set Offline" : "Set Online"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRoster.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-xs text-[#466272]/60">
                    No roster members found matching "{searchTerm}".
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
