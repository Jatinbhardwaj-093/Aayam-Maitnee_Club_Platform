import { useState } from "react";
import { ClipboardList, PlusCircle, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface CrewTask {
  id: string;
  task: string;
  assignedTo: string;
  category: "Wardrobe" | "Props" | "Lighting" | "Sound";
  isCompleted: boolean;
}

const initialTasks: CrewTask[] = [
  { id: "T1", task: "Iron Lord Macbeth's banquet robe", assignedTo: "Ishita Sen", category: "Wardrobe", isCompleted: true },
  { id: "T2", task: "Mix dry ice and verify fog machine level", assignedTo: "Manish Chaudhari", category: "Props", isCompleted: false },
  { id: "T3", task: "Configure spot lighting cue for apparition", assignedTo: "Jayesh Dave", category: "Lighting", isCompleted: false },
  { id: "T4", task: "Test cauldron sound effects", assignedTo: "Sneha Vyas", category: "Sound", isCompleted: true },
];

export default function BackstagePass() {
  const [tasks, setTasks] = useState<CrewTask[]>(initialTasks);
  const [newTaskText, setNewTaskText] = useState("");
  const [newAssigned, setNewAssigned] = useState("");
  const [newCategory, setNewCategory] = useState<"Wardrobe" | "Props" | "Lighting" | "Sound">("Props");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText || !newAssigned) return;
    const newTask: CrewTask = {
      id: `T${tasks.length + 1}`,
      task: newTaskText,
      assignedTo: newAssigned,
      category: newCategory,
      isCompleted: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
    setNewAssigned("");
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="space-y-[32px] font-sans text-[#466272]">
      {/* Title & Status Bar */}
      <div className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-[24px] md:p-[32px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[24px] mb-[32px] md:mb-[48px]">
        <div className="space-y-[8px]">
          <span className="text-xs uppercase tracking-widest text-[#466272]/70 font-semibold">Technical Crew</span>
          <h2 className="text-[32px] font-bold font-serif text-[#635f41]">Backstage Pass &amp; Checklists</h2>
          <p className="text-[14px] text-[#466272]">
            Daily checklist and technical tasks for props, stage lighting cues, and audio syncs.
          </p>
        </div>
        <div className="bg-white border border-[#e6e2dd] p-4 rounded-[8px] shadow-sm text-center min-w-[120px]">
          <span className="text-[28px] font-bold font-serif text-[#8CC0EB]">{completionRate}%</span>
          <p className="text-[10px] text-[#466272]/70 uppercase font-semibold tracking-wider mt-1">Completed Rate</p>
        </div>
      </div>

      {/* Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
        {/* Left 2 Cols: Checklists */}
        <section className="lg:col-span-2 bg-white border border-[#e6e2dd] rounded-[8px] p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-[#e6e2dd]/80 pb-4">
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#8CC0EB]" /> Active Crew Checklist
            </h3>
            <span className="text-xs text-[#466272]/70 font-semibold">{completedCount} of {tasks.length} Done</span>
          </div>

          {/* Checklist List */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-4 rounded-[8px] border transition-all ${
                  task.isCompleted 
                    ? "bg-[#f7f3ee]/40 border-[#e6e2dd]/60 opacity-70" 
                    : "bg-[#fdf9f4]/20 border-[#e6e2dd] hover:border-[#8CC0EB]/40"
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className="text-[#8CC0EB] hover:text-[#8CC0EB]/80 transition-colors mt-0.5"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 fill-current text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <p className={`text-sm font-medium text-[#635f41] ${task.isCompleted ? "line-through text-[#466272]/60" : ""}`}>
                      {task.task}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#466272]/70">
                      <span>Assigned to: <strong className="font-semibold text-[#635f41]">{task.assignedTo}</strong></span>
                      <span>&bull;</span>
                      <Badge variant="outline" className="border-[#635f41]/25 text-[#635f41] bg-[#635f41]/5 rounded-[4px] px-1.5 py-0">
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-300 hover:text-red-600 hover:bg-red-50 rounded-[4px]"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            {tasks.length === 0 && (
              <p className="text-center text-xs text-[#466272]/50 italic py-8">No backstage tasks logged for today.</p>
            )}
          </div>
        </section>

        {/* Right Col: Create Task Form */}
        <section className="bg-[#f7f3ee] border border-[#e6e2dd] rounded-[8px] p-6 h-fit space-y-6">
          <div>
            <h3 className="font-bold text-[18px] text-[#635f41] font-serif">Quick Create Task</h3>
            <p className="text-xs text-[#466272]/70">Create and assign a new daily task for the crew roster</p>
          </div>

          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#635f41]">Task Description</label>
              <Input
                placeholder="e.g., Fill fog machine fluid"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="border-[#e6e2dd] bg-white focus-visible:ring-[#8CC0EB]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#635f41]">Assigned Crew Member</label>
              <Input
                placeholder="e.g., M. Chen"
                value={newAssigned}
                onChange={(e) => setNewAssigned(e.target.value)}
                className="border-[#e6e2dd] bg-white focus-visible:ring-[#8CC0EB]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#635f41]">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full rounded-md border border-[#e6e2dd] bg-white px-3 py-2 text-sm text-[#466272] outline-none focus:ring-1 focus:ring-[#8CC0EB] focus:border-[#8CC0EB]"
              >
                <option value="Props">Props</option>
                <option value="Wardrobe">Wardrobe</option>
                <option value="Lighting">Lighting</option>
                <option value="Sound">Sound</option>
              </select>
            </div>

            <Button type="submit" className="w-full bg-[#8CC0EB] text-[#1c1b19] hover:bg-[#8CC0EB]/90 font-semibold rounded-[8px] py-2.5 transition-all shadow-sm">
              <PlusCircle className="w-4 h-4 mr-2" /> Add Crew Task
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
