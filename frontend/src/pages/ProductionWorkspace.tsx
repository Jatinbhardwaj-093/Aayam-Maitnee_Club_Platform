import { useState } from "react";
import { PlusCircle, FileText, CheckCircle2, ClipboardList, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AssetTransfer {
  id: string;
  item: string;
  borrower: string;
  timer: string;
}

interface ExpenseClaim {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Approved" | "Pending" | "Rejected";
  receipt: string;
}

const initialAssets: AssetTransfer[] = [
  { id: "A001", item: "Banquet Goblet (Gold-plated)", borrower: "Julian Devereux", timer: "2 Days Remaining" },
  { id: "A002", item: "Macbeth Ornamental Dagger", borrower: "Lady Macbeth (Emma)", timer: "5 Hours Remaining" },
  { id: "A003", item: "Witches' Cauldron (Iron)", borrower: "Sebastian Vance", timer: "Returned" },
];

const initialExpenses: ExpenseClaim[] = [
  { id: "E001", date: "2026-06-25", description: "Velvet Stage Curtains Fabric", amount: "$350.00", status: "Approved", receipt: "receipt_curtains.pdf" },
  { id: "E002", date: "2026-06-28", description: "Apparition Dry Ice Fog Machine Fluid", amount: "$45.50", status: "Pending", receipt: "receipt_fog.pdf" },
  { id: "E003", date: "2026-06-30", description: "Banquet Feast Plastic Prop Apples", amount: "$15.80", status: "Pending", receipt: "receipt_apples.pdf" },
];

export default function ProductionWorkspace() {
  const [assets, setAssets] = useState<AssetTransfer[]>(initialAssets);
  const [expenses, setExpenses] = useState<ExpenseClaim[]>(initialExpenses);

  // Form states
  const [newAssetItem, setNewAssetItem] = useState("");
  const [newAssetBorrower, setNewAssetBorrower] = useState("");
  const [newAssetTimer, setNewAssetTimer] = useState("3 Days Remaining");

  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseAmt, setNewExpenseAmt] = useState("");

  const [assetOpen, setAssetOpen] = useState(false);
  const [expenseOpen, setExpenseOpen] = useState(false);

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetItem || !newAssetBorrower) return;
    const newAsset: AssetTransfer = {
      id: `A00${assets.length + 1}`,
      item: newAssetItem,
      borrower: newAssetBorrower,
      timer: newAssetTimer,
    };
    setAssets([...assets, newAsset]);
    setNewAssetItem("");
    setNewAssetBorrower("");
    setAssetOpen(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc || !newExpenseAmt) return;
    const newExpense: ExpenseClaim = {
      id: `E00${expenses.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      description: newExpenseDesc,
      amount: `$${parseFloat(newExpenseAmt).toFixed(2)}`,
      status: "Pending",
      receipt: "receipt_uploaded.pdf",
    };
    setExpenses([...expenses, newExpense]);
    setNewExpenseDesc("");
    setNewExpenseAmt("");
    setExpenseOpen(false);
  };

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Welcome & Overview */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] mb-[32px] md:mb-[48px]">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#466272]/70 font-semibold">Active Workspace</span>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41] mt-1">Production Workspace: Macbeth</h2>
          <p className="text-[14px] text-[#466272] mt-2 max-w-xl">
            Manage physical asset checkouts, track expenditures, log prop receipts, and coordinate rehearsals for the Macbeth season.
          </p>
        </div>
        <div className="flex flex-wrap gap-[12px]">
          <Button variant="outline" className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 font-semibold rounded-[8px] py-[10px] px-[20px] gap-2 shadow-sm transition-all active:scale-95">
            <FileText className="w-4 h-4 text-[#8CC0EB]" /> Download Script.pdf
          </Button>
        </div>
      </div>

      {/* Asset Tracking Section */}
      <section className="bg-white border border-[#e6e2dd] rounded-[8px] overflow-hidden shadow-sm space-y-4">
        <div className="px-[24px] py-[20px] border-b border-[#e6e2dd] bg-[#f7f3ee]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#635f41]/75" />
              Props &amp; Costumes Checkouts
            </h3>
            <p className="text-xs text-[#466272]/70">Track which borrower holds the active physical stage props</p>
          </div>
          <Dialog open={assetOpen} onOpenChange={setAssetOpen}>
            <DialogTrigger render={<Button size="sm" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 font-semibold rounded-[8px] py-[10px] px-[20px] gap-1.5 transition-all active:scale-95" />}>
              <PlusCircle className="w-4 h-4" /> Register Prop Transfer
            </DialogTrigger>
            <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272]">
              <form onSubmit={handleAddAsset}>
                <DialogHeader className="space-y-2">
                  <DialogTitle className="font-serif text-[#635f41]">Register Prop Transfer</DialogTitle>
                  <DialogDescription className="text-[#466272]/85 text-xs">
                    Assign a physical asset to a cast or crew member checkout list.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Prop Item Name</label>
                    <Input
                      placeholder="e.g., Ornamental Golden Dagger"
                      value={newAssetItem}
                      onChange={(e) => setNewAssetItem(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Borrower Name</label>
                    <Input
                      placeholder="e.g., Emma Vance"
                      value={newAssetBorrower}
                      onChange={(e) => setNewAssetBorrower(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Due Period / Return Timer</label>
                    <Input
                      placeholder="e.g., 2 Days Remaining"
                      value={newAssetTimer}
                      onChange={(e) => setNewAssetTimer(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setAssetOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px]">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                    Register Transfer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e6e2dd] hover:bg-transparent">
                <TableHead className="text-[#635f41] font-semibold w-24">Asset ID</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Stage Prop/Item</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Active Borrower</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Due Timer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id} className="border-b border-[#e6e2dd]/60 hover:bg-[#fdf9f4]/45">
                  <TableCell className="font-semibold text-xs text-[#466272]/70 py-[16px]">{asset.id}</TableCell>
                  <TableCell className="font-medium text-[#635f41] py-[16px]">{asset.item}</TableCell>
                  <TableCell className="text-sm text-[#466272] py-[16px]">{asset.borrower}</TableCell>
                  <TableCell className="py-[16px]">
                    <Badge className="rounded-[4px] bg-amber-600/10 text-amber-700 border-amber-600/20">
                      <Clock className="w-3 h-3 mr-1 inline-block text-amber-600" /> {asset.timer}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Expense Tracker Section */}
      <section className="bg-white border border-[#e6e2dd] rounded-[8px] overflow-hidden shadow-sm space-y-4">
        <div className="px-[24px] py-[20px] border-b border-[#e6e2dd] bg-[#f7f3ee]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#635f41]/75" />
              Budget &amp; Expense Tracker
            </h3>
            <p className="text-xs text-[#466272]/70">Review and log budget claims for Macbeth production props</p>
          </div>
          <Dialog open={expenseOpen} onOpenChange={setExpenseOpen}>
            <DialogTrigger render={<Button size="sm" variant="outline" className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 font-semibold rounded-[8px] py-[10px] px-[20px] gap-1.5 transition-all active:scale-95" />}>
              <PlusCircle className="w-4 h-4" /> Submit New Claim
            </DialogTrigger>
            <DialogContent className="bg-[#fdf9f4] border border-[#e6e2dd] text-[#466272]">
              <form onSubmit={handleAddExpense}>
                <DialogHeader className="space-y-2">
                  <DialogTitle className="font-serif text-[#635f41]">Submit New Expense Claim</DialogTitle>
                  <DialogDescription className="text-[#466272]/85 text-xs">
                    Log expenditures for prop fabrics, materials, and production kits.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Item Description</label>
                    <Input
                      placeholder="e.g., Dry Ice Machine Fluid"
                      value={newExpenseDesc}
                      onChange={(e) => setNewExpenseDesc(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#635f41]">Amount ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="45.50"
                      value={newExpenseAmt}
                      onChange={(e) => setNewExpenseAmt(e.target.value)}
                      className="border-[#e6e2dd] focus-visible:ring-[#8CC0EB]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setExpenseOpen(false)} className="border-2 border-[#8CC0EB] text-[#8CC0EB] hover:bg-[#8CC0EB]/5 rounded-[8px]">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 rounded-[8px]">
                    Submit Claim
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#e6e2dd] hover:bg-transparent">
                <TableHead className="text-[#635f41] font-semibold w-32">Date Logged</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Item Description</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Amount</TableHead>
                <TableHead className="text-[#635f41] font-semibold">Claim Status</TableHead>
                <TableHead className="text-[#635f41] font-semibold text-right">Receipt File</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id} className="border-b border-[#e6e2dd]/60 hover:bg-[#fdf9f4]/45">
                  <TableCell className="text-xs text-[#466272] py-[16px]">{expense.date}</TableCell>
                  <TableCell className="font-semibold text-sm text-[#635f41] py-[16px]">{expense.description}</TableCell>
                  <TableCell className="text-sm font-medium text-[#635f41] py-[16px]">{expense.amount}</TableCell>
                  <TableCell className="py-[16px]">
                    <Badge className={`rounded-[4px] ${
                      expense.status === "Approved" ? "bg-emerald-600/10 text-emerald-700 border-emerald-600/20" :
                      expense.status === "Rejected" ? "bg-red-600/10 text-red-700 border-red-600/20" :
                      "bg-amber-600/10 text-amber-700 border-amber-600/20"
                    }`}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right py-[16px] text-xs font-medium text-[#8CC0EB] hover:underline cursor-pointer">
                    {expense.receipt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
