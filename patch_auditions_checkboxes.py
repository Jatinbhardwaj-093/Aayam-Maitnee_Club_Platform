import re

with open('frontend/src/pages/maintainers/AuditionsManagement.tsx', 'r') as f:
    content = f.read()

# 1. Update initial state of newPosForm
state_old = """  const [newPosForm, setNewPosForm] = useState({
    production_name: "Hayavadana",
    role_name: "",
    role_category: "Character Role",
    character_description: "",
    requirements: "",
    slots_available: 1,
    status: "Open Calling"
  });"""

state_new = """  const [newPosForm, setNewPosForm] = useState({
    production_name: "Hayavadana",
    role_name: "",
    role_category: "Character Role",
    character_description: "",
    requirements: "",
    slots_available: 1,
    status: "Open Calling",
    require_portfolio: false,
    require_video: false,
    require_audio: false
  });"""

content = content.replace(state_old, state_new)

# 2. Add checkboxes to the CREATE form
create_req_old = """              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                  Audition Requirements & Submission Format
                </label>
                <textarea
                  rows={3}
                  value={newPosForm.requirements}
                  onChange={(e) => setNewPosForm({ ...newPosForm, requirements: e.target.value })}
                  placeholder="e.g. 2-minute video monologue tape, classical diction, or technical portfolio summary"
                  className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl p-4 text-sm font-serif leading-relaxed text-[#2A1816] focus:border-[#B32D25] focus:outline-none shadow-sm transition-colors"
                />
              </div>

              <DialogFooter"""

create_req_new = """              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                  Audition Requirements & Submission Format
                </label>
                <textarea
                  rows={3}
                  value={newPosForm.requirements}
                  onChange={(e) => setNewPosForm({ ...newPosForm, requirements: e.target.value })}
                  placeholder="e.g. 2-minute video monologue tape, classical diction, or technical portfolio summary"
                  className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl p-4 text-sm font-serif leading-relaxed text-[#2A1816] focus:border-[#B32D25] focus:outline-none shadow-sm transition-colors"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                  Required Submissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_portfolio || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_portfolio: e.target.checked})}
                      className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#8C5A54]" /> Portfolio
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_video || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_video: e.target.checked})}
                      className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#8C5A54]" /> Video
                    </span>
                  </label>
                  
                  <label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_audio || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_audio: e.target.checked})}
                      className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-[#8C5A54]" /> Audio
                    </span>
                  </label>
                </div>
              </div>

              <DialogFooter"""

content = content.replace(create_req_old, create_req_new)


# 3. Add checkboxes to the EDIT form
edit_req_old = """              <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Audition Requirements & Submission Format
                  </label>
                  <textarea
                    rows={3}
                    value={selectedPosForEdit.requirements}
                    onChange={(e) => setSelectedPosForEdit({ ...selectedPosForEdit, requirements: e.target.value })}
                    className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl p-4 text-sm font-serif leading-relaxed text-[#2A1816] focus:border-[#B32D25] focus:outline-none shadow-sm transition-colors"
                  />
                </div>

                <DialogFooter"""

edit_req_new = """              <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Audition Requirements & Submission Format
                  </label>
                  <textarea
                    rows={3}
                    value={selectedPosForEdit.requirements}
                    onChange={(e) => setSelectedPosForEdit({ ...selectedPosForEdit, requirements: e.target.value })}
                    className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl p-4 text-sm font-serif leading-relaxed text-[#2A1816] focus:border-[#B32D25] focus:outline-none shadow-sm transition-colors"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Required Submissions
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_portfolio || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_portfolio: e.target.checked})}
                        className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2"
                      />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#8C5A54]" /> Portfolio
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_video || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_video: e.target.checked})}
                        className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2"
                      />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#8C5A54]" /> Video
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_audio || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_audio: e.target.checked})}
                        className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2"
                      />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-[#8C5A54]" /> Audio
                      </span>
                    </label>
                  </div>
                </div>

                <DialogFooter"""

content = content.replace(edit_req_old, edit_req_new)

with open('frontend/src/pages/maintainers/AuditionsManagement.tsx', 'w') as f:
    f.write(content)
