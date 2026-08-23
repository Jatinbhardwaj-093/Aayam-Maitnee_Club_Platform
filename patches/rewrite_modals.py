import re

with open('frontend/src/pages/maintainers/AuditionsManagement.tsx', 'r') as f:
    content = f.read()

# Define the new modals
new_modals = """      {/* MODAL 1: CREATE NEW ROLE CALLING */}
      <Dialog open={createPosOpen} onOpenChange={setCreatePosOpen}>
        <DialogContent showCloseButton={false} className="w-full sm:max-w-2xl md:max-w-3xl bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-0 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={() => setCreatePosOpen(false)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-10 text-left space-y-6">
            <DialogHeader className="text-left space-y-1 border-b border-[#DCBAB2]/70 pb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                New Recruitment Drive
              </span>
              <DialogTitle className="text-3xl font-serif text-[#2A1816] flex items-center gap-3">
                <Sparkle className="w-6 h-6 text-[#8C241E]" />
                Draft Role Calling
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6E4742] font-serif">
                Create a new open casting position or backstage crew requirement.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreatePosition} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Production Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPosForm.production_name}
                    onChange={(e) => setNewPosForm({ ...newPosForm, production_name: e.target.value })}
                    placeholder="e.g. Karn Ki Yachika"
                    className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPosForm.role_name}
                    onChange={(e) => setNewPosForm({ ...newPosForm, role_name: e.target.value })}
                    placeholder="e.g. Sultan Muhammad bin Tughlaq (Lead)"
                    className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative z-20">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Category
                  </label>
                  <CustomSelect
                    value={newPosForm.role_category}
                    options={["Character Role", "Performer", "Technical Crew", "Backstage Technical", "Director", "Makeup & Hair", "Costume"]}
                    onChange={(val) => setNewPosForm({ ...newPosForm, role_category: val })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Slots Available
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newPosForm.slots_available}
                    onChange={(e) => setNewPosForm({ ...newPosForm, slots_available: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                  Character Description & Dramatic Stakes
                </label>
                <textarea
                  rows={3}
                  value={newPosForm.character_description}
                  onChange={(e) => setNewPosForm({ ...newPosForm, character_description: e.target.value })}
                  placeholder="Describe character motivations, vocal weight, stage presence, and key emotional arcs..."
                  className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl p-4 text-sm font-serif leading-relaxed text-[#2A1816] focus:border-[#B32D25] focus:outline-none shadow-sm transition-colors"
                />
              </div>

              <div className="space-y-1.5">
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

              <DialogFooter className="pt-6 border-t border-[#DCBAB2]/70 flex flex-col sm:flex-row justify-end items-center gap-4">
                <button
                  type="button"
                  onClick={() => setCreatePosOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-full shadow-lg shadow-[#8C241E]/20 flex justify-center items-center gap-2 border border-[#A6352F] cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 text-[#FFD0CC]" />
                  <span>Publish Role Calling</span>
                </button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: EDIT ROLE CALLING */}
      <Dialog open={editPosOpen} onOpenChange={setEditPosOpen}>
        <DialogContent showCloseButton={false} className="w-full sm:max-w-2xl md:max-w-3xl bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-0 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
          <button
            type="button"
            onClick={() => setEditPosOpen(false)}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
          >
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-10 text-left space-y-6">
            <DialogHeader className="text-left space-y-1 border-b border-[#DCBAB2]/70 pb-4 pr-10">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                Edit Role Calling
              </span>
              <DialogTitle className="text-3xl font-serif text-[#2A1816]">
                {selectedPosForEdit?.role_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-[#6E4742] font-serif">
                {selectedPosForEdit?.production_name}
              </DialogDescription>
            </DialogHeader>

            {selectedPosForEdit && (
              <form onSubmit={handleEditPosition} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                      Production Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={selectedPosForEdit.production_name}
                      onChange={(e) => setSelectedPosForEdit({ ...selectedPosForEdit, production_name: e.target.value })}
                      className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                      Role Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={selectedPosForEdit.role_name}
                      onChange={(e) => setSelectedPosForEdit({ ...selectedPosForEdit, role_name: e.target.value })}
                      className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 relative z-20">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                      Category
                    </label>
                    <CustomSelect
                      value={selectedPosForEdit.role_category}
                      options={["Character Role", "Performer", "Technical Crew", "Backstage Technical", "Director", "Makeup & Hair", "Costume"]}
                      onChange={(val) => setSelectedPosForEdit({ ...selectedPosForEdit, role_category: val })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                      Slots Available
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={selectedPosForEdit.slots_available}
                      onChange={(e) => setSelectedPosForEdit({ ...selectedPosForEdit, slots_available: parseInt(e.target.value) || 1 })}
                      className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A54]">
                    Character Description & Dramatic Stakes
                  </label>
                  <textarea
                    rows={3}
                    value={selectedPosForEdit.character_description}
                    onChange={(e) => setSelectedPosForEdit({ ...selectedPosForEdit, character_description: e.target.value })}
                    className="w-full bg-[#FDF8F7] border border-[#DCBAB2] rounded-xl p-4 text-sm font-serif leading-relaxed text-[#2A1816] focus:border-[#B32D25] focus:outline-none shadow-sm transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
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

                <DialogFooter className="pt-6 border-t border-[#DCBAB2]/70 flex flex-col sm:flex-row justify-end items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setEditPosOpen(false)}
                    className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] font-mono text-xs font-bold uppercase tracking-wider px-8 py-3 rounded-full shadow-lg shadow-[#8C241E]/20 flex justify-center items-center gap-2 border border-[#A6352F] cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#FFD0CC]" />
                    <span>Save Changes</span>
                  </button>
                </DialogFooter>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>
"""

# Extract everything before MODAL 1
start_idx = content.find('{/* MODAL 1: CREATE NEW ROLE CALLING */}')
end_idx = content.find('{/* MODAL 3: CANDIDATE DOSSIER & AI SCREENING EVALUATION */}')

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_modals + "\n      " + content[end_idx:]
    with open('frontend/src/pages/maintainers/AuditionsManagement.tsx', 'w') as f:
        f.write(new_content)
else:
    print("Could not find start or end index")
