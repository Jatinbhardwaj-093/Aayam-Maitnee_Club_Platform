import { useState } from "react";
import { UserPlus, Star, Video, Clipboard, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Applicant {
  id: string;
  name: string;
  role: string;
  assets: string;
  assessment: string;
  rating: number;
}

const initialApplicants: Applicant[] = [
  { id: "Ap01", name: "David Tennant", role: "Macbeth (Lead Role)", assets: "Resume.pdf, Video_Monologue.mp4", assessment: "Outstanding screen presence and dynamic cadence", rating: 5 },
  { id: "Ap02", name: "Emma Watson", role: "Lady Macbeth (Lead Role)", assets: "Resume.pdf", assessment: "Highly technical; great synergy with director notes", rating: 4 },
  { id: "Ap03", name: "Rami Malek", role: "Banquo (Supporting)", assets: "Video_Audition.mov", assessment: "Excellent vocal depth; needs scene rehearsal tests", rating: 4 },
];

export default function AuditionsCasting() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Macbeth (Lead Role)");
  const [newAsset, setNewAsset] = useState("");
  const [newNote, setNewNote] = useState("");

  const handleRegisterAudition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newApp: Applicant = {
      id: `Ap0${applicants.length + 1}`,
      name: newName,
      role: newRole,
      assets: newAsset || "Resume_Submitted.pdf",
      assessment: newNote || "Awaiting Director assessment review",
      rating: 0,
    };
    setApplicants([...applicants, newApp]);
    setNewName("");
    setNewAsset("");
    setNewNote("");
    setOpen(false);
  };

  const filteredApplicants = applicants.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Overview Block */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] mb-[32px] md:mb-[48px]">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#466272]/70 font-semibold">Casting Board</span>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Auditions &amp; Casting Portal</h2>
          <p className="text-sm text-[#466272]">
            Catalog of open casting positions and director reviews for lead and ensemble roles.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 font-semibold rounded-[8px] py-[10px] px-[20px] gap-1.5 transition-all active:scale-95" />}>
            <UserPlus className="w-4 h-4" /> Register for Audition Slot
          </DialogTrigger>
          <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272]">
            <form onSubmit={handleRegisterAudition}>
              <DialogHeader className="space-y-2">
                <DialogTitle className="font-serif text-[#635f41]">Register for Audition Slot</DialogTitle>
                <DialogDescription className="text-[#466272]/80 text-xs">
                  Create a new audition slot in the director's review pipeline.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Applicant Name</label>
                  <Input 
                    placeholder="e.g., Benedict Cumberbatch" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Desired Role</label>
                  <Input 
                    placeholder="e.g., Macbeth (Lead Role)" 
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Media Assets (Separated by comma)</label>
                  <Input 
                    placeholder="e.g., Resume.pdf, Monologue.mov" 
                    value={newAsset}
                    onChange={(e) => setNewAsset(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#635f41]">Initial Director Notes / Assessment</label>
                  <Input 
                    placeholder="e.g., Outstanding baritone voice" 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px]">
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                  Register Applicant
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Review Pipeline Table */}
      <section className="bg-white border border-[#e6e2dd] rounded-[8px] overflow-hidden shadow-sm">
        <div className="px-[24px] py-[20px] border-b border-[#e6e2dd] bg-[#f7f3ee]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif">Review Pipeline (Admin View)</h3>
            <p className="text-xs text-[#466272]/70">Track ratings, resume links, and casting status of talent</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#466272]/50" />
            <Input
              placeholder="Search talent or role..."
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
                <TableHead className="text-[#635f41] font-semibold">Applicant</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Production &amp; Role</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Media Assets</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Director Assessment</TableHead>
                <TableHead className="text-[#635f41] font-semibold text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplicants.map((app) => (
                <TableRow key={app.id} className="border-b border-[#e6e2dd]/60 hover:bg-[#fdf9f4]/45">
                  <TableCell className="font-semibold text-sm text-[#635f41] py-[16px]">{app.name}</TableCell>
                  <TableCell className="py-[16px]">
                    <Badge variant="outline" className="border-[#635f41]/25 text-[#635f41] bg-[#635f41]/5 rounded-[4px]">
                      {app.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[#466272]/70 py-[16px] flex flex-col gap-1">
                    {app.assets.split(", ").map((asset, i) => (
                      <span key={i} className="hover:underline cursor-pointer flex items-center gap-1 font-medium text-[#8CC0EB]">
                        {asset.endsWith(".mp4") || asset.endsWith(".mov") ? (
                          <Video className="w-3.5 h-3.5 text-[#8CC0EB]" />
                        ) : (
                          <Clipboard className="w-3.5 h-3.5 text-[#8CC0EB]" />
                        )}
                        {asset}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell className="text-xs text-[#466272]/95 py-[16px] max-w-xs">{app.assessment}</TableCell>
                  <TableCell className="text-right py-[16px]">
                    <div className="flex justify-end gap-0.5">
                      {app.rating > 0 ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${
                              i < app.rating ? "fill-[#8CC0EB] text-[#8CC0EB]" : "text-gray-300"
                            }`} 
                          />
                        ))
                      ) : (
                        <span className="text-xs text-[#466272]/40 italic">Awaiting assessment</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredApplicants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-xs text-[#466272]/60">
                    No applicants found matching "{searchTerm}".
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
