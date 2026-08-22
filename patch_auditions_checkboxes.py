import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/AuditionsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace Require Portfolio (New)
old_portfolio_new = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_portfolio || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_portfolio: e.target.checked})}
                      className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2 accent-[#8C241E] cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#8C5A54]" /> Portfolio
                    </span>
                  </label>'''

new_portfolio_new = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm relative">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_portfolio || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_portfolio: e.target.checked})}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <div className={`w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors ${newPosForm.require_portfolio ? 'bg-[#8C241E] border border-[#8C241E]' : 'bg-[#F5EAE6] border border-[#DCBAB2]'}`}>
                      {newPosForm.require_portfolio && <Check className="w-3 h-3 text-[#FDF8F7]" />}
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#8C5A54]" /> Portfolio
                    </span>
                  </label>'''
content = content.replace(old_portfolio_new, new_portfolio_new)

# Replace Require Video (New)
old_video_new = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_video || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_video: e.target.checked})}
                      className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2 accent-[#8C241E] cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#8C5A54]" /> Video
                    </span>
                  </label>'''

new_video_new = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm relative">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_video || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_video: e.target.checked})}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <div className={`w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors ${newPosForm.require_video ? 'bg-[#8C241E] border border-[#8C241E]' : 'bg-[#F5EAE6] border border-[#DCBAB2]'}`}>
                      {newPosForm.require_video && <Check className="w-3 h-3 text-[#FDF8F7]" />}
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#8C5A54]" /> Video
                    </span>
                  </label>'''
content = content.replace(old_video_new, new_video_new)

# Replace Require Audio (New)
old_audio_new = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_audio || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_audio: e.target.checked})}
                      className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2 accent-[#8C241E] cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-[#8C5A54]" /> Audio
                    </span>
                  </label>'''

new_audio_new = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm relative">
                    <input 
                      type="checkbox" 
                      checked={newPosForm.require_audio || false}
                      onChange={(e) => setNewPosForm({...newPosForm, require_audio: e.target.checked})}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <div className={`w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors ${newPosForm.require_audio ? 'bg-[#8C241E] border border-[#8C241E]' : 'bg-[#F5EAE6] border border-[#DCBAB2]'}`}>
                      {newPosForm.require_audio && <Check className="w-3 h-3 text-[#FDF8F7]" />}
                    </div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-[#8C5A54]" /> Audio
                    </span>
                  </label>'''
content = content.replace(old_audio_new, new_audio_new)

# Replace Require Portfolio (Edit)
old_portfolio_edit = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_portfolio || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_portfolio: e.target.checked})}
                        className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2 accent-[#8C241E] cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#8C5A54]" /> Portfolio
                      </span>
                    </label>'''

new_portfolio_edit = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm relative">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_portfolio || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_portfolio: e.target.checked})}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div className={`w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors ${selectedPosForEdit.require_portfolio ? 'bg-[#8C241E] border border-[#8C241E]' : 'bg-[#F5EAE6] border border-[#DCBAB2]'}`}>
                        {selectedPosForEdit.require_portfolio && <Check className="w-3 h-3 text-[#FDF8F7]" />}
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#8C5A54]" /> Portfolio
                      </span>
                    </label>'''
content = content.replace(old_portfolio_edit, new_portfolio_edit)

# Replace Require Video (Edit)
old_video_edit = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_video || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_video: e.target.checked})}
                        className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2 accent-[#8C241E] cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#8C5A54]" /> Video
                      </span>
                    </label>'''

new_video_edit = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm relative">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_video || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_video: e.target.checked})}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div className={`w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors ${selectedPosForEdit.require_video ? 'bg-[#8C241E] border border-[#8C241E]' : 'bg-[#F5EAE6] border border-[#DCBAB2]'}`}>
                        {selectedPosForEdit.require_video && <Check className="w-3 h-3 text-[#FDF8F7]" />}
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-[#8C5A54]" /> Video
                      </span>
                    </label>'''
content = content.replace(old_video_edit, new_video_edit)

# Replace Require Audio (Edit)
old_audio_edit = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_audio || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_audio: e.target.checked})}
                        className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2 accent-[#8C241E] cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-[#8C5A54]" /> Audio
                      </span>
                    </label>'''

new_audio_edit = '''<label className="flex items-center gap-3 bg-[#FDF8F7] border border-[#DCBAB2] p-3 rounded-xl cursor-pointer hover:bg-[#FAF2EE] transition-colors shadow-sm relative">
                      <input 
                        type="checkbox" 
                        checked={selectedPosForEdit.require_audio || false}
                        onChange={(e) => setSelectedPosForEdit({...selectedPosForEdit, require_audio: e.target.checked})}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div className={`w-4 h-4 shrink-0 rounded flex items-center justify-center transition-colors ${selectedPosForEdit.require_audio ? 'bg-[#8C241E] border border-[#8C241E]' : 'bg-[#F5EAE6] border border-[#DCBAB2]'}`}>
                        {selectedPosForEdit.require_audio && <Check className="w-3 h-3 text-[#FDF8F7]" />}
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#5C3B37] flex items-center gap-1.5">
                        <Mic className="w-3.5 h-3.5 text-[#8C5A54]" /> Audio
                      </span>
                    </label>'''
content = content.replace(old_audio_edit, new_audio_edit)

with open(file_path, "w") as f:
    f.write(content)

print("Checkboxes patched!")
