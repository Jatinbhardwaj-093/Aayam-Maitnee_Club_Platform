import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/EventsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Fix the modal insertion
old_end = '''      <ProductionEditModal
        open={Boolean(selectedEditProd)}
        onClose={() => setSelectedEditProd(null)}
        production={selectedEditProd}
        onSuccess={handleProductionEditSuccess}
      />
    </div>
  );
}'''

new_end = '''      <ProductionEditModal
        open={Boolean(selectedEditProd)}
        onClose={() => setSelectedEditProd(null)}
        production={selectedEditProd}
        onSuccess={handleProductionEditSuccess}
      />

      {/* Create Event Modal */}
      {createEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full sm:max-w-2xl bg-[#F5EAE6] border border-[#DEBEB7] text-[#2A1816] rounded-[2.5rem] p-0 shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={() => setCreateEventOpen(false)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#EEDBD5] hover:bg-[#E3CEC6] text-[#5C3B37] hover:text-[#2A1816] flex items-center justify-center transition-all cursor-pointer border border-[#D5AAA2] shadow-xs group z-30"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            </button>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 sm:p-10 text-left space-y-6">
              <div className="text-left space-y-1 border-b border-[#DCBAB2]/70 pb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                  New Scheduled Event
                </span>
                <h2 className="text-3xl font-serif text-[#2A1816] flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-[#8C241E]" />
                  Schedule New Event
                </h2>
                <p className="text-xs text-[#6E4742] font-serif">
                  Directly add a new confirmed production, workshop, or internal gathering to the official Society Calendar.
                </p>
              </div>
              
              <form onSubmit={handleCreateEventSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider text-[10px] font-mono">Event Title</label>
                  <input
                    required
                    type="text"
                    value={newEventForm.title}
                    onChange={e => setNewEventForm({...newEventForm, title: e.target.value})}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                    placeholder="e.g. Macbeth Rehearsals"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#8C5A54] uppercase tracking-wider text-[10px] font-mono">Event Category</label>
                    <CustomSelect
                       options={[
                         {value: "Plays", label: "Mainstage Play"},
                         {value: "Workshops", label: "Workshop"},
                         {value: "Meetups", label: "Internal Meetup"},
                       ]}
                       value={newEventForm.category}
                       onChange={(val) => setNewEventForm({...newEventForm, category: val})}
                       placeholder="Select Category"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#8C5A54] uppercase tracking-wider text-[10px] font-mono">Venue</label>
                    <input
                      type="text"
                      required
                      value={newEventForm.venue}
                      onChange={e => setNewEventForm({...newEventForm, venue: e.target.value})}
                      className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                      placeholder="e.g. SAC CLT"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#8C5A54] uppercase tracking-wider text-[10px] font-mono">Date</label>
                    <input
                      type="text"
                      required
                      value={newEventForm.date}
                      onChange={e => setNewEventForm({...newEventForm, date: e.target.value})}
                      className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                      placeholder="e.g. Sept 15, 2026"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#8C5A54] uppercase tracking-wider text-[10px] font-mono">Time</label>
                    <input
                      type="text"
                      required
                      value={newEventForm.timeRange}
                      onChange={e => setNewEventForm({...newEventForm, timeRange: e.target.value})}
                      className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-sm text-[#2A1816] font-medium focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                      placeholder="e.g. 18:00 - 21:00"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="font-bold text-[#8C5A54] uppercase tracking-wider text-[10px] font-mono">Event Details & Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newEventForm.description}
                    onChange={e => setNewEventForm({...newEventForm, description: e.target.value})}
                    className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-3 text-sm text-[#2A1816] font-serif leading-relaxed focus:border-[#B32D25] focus:outline-none transition-colors shadow-sm"
                    placeholder="Describe the agenda, who should attend, and any prerequisites..."
                  ></textarea>
                </div>
                
                <div className="pt-6 border-t border-[#DCBAB2]/70 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateEventOpen(false)}
                    className="px-6 py-3 rounded-full border border-[#D5AAA2] bg-[#FAF2EE] hover:bg-[#EEDBD5] text-[#5C3B37] text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg shadow-[#8C241E]/20 border border-[#A6352F] flex items-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#FFD0CC]" />
                    Publish Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}'''

content = content.replace(old_end, new_end)

# 2. Fix the header positioning
old_header = '''      {/* Editorial Header */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
              <Calendar className="w-3.5 h-3.5 text-[#8C241E]" />
              <span>SOCIETY REPERTOIRE & OPERATIONAL DESK</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Events & Season Management
            </h1>
            <p className="text-xs sm:text-sm text-[#6E4742] max-w-2xl font-serif italic">
              Oversee upcoming productions, manage member event pitches and funded sponsor partnerships, assign budgets, and open society donation patronage.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 self-start md:self-auto shrink-0">
            <button
                onClick={() => setCreateEventOpen(true)}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-sm font-mono font-bold uppercase tracking-widest shadow-xl shadow-[#8C241E]/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-[#A6352F] hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5 text-[#FFD0CC]" />
                <span>New Event</span>
            </button>
            
            <div className="flex items-center gap-2 bg-[#FAF2EE] p-1.5 rounded-full border border-[#DCBAB2] shadow-xs shrink-0 self-start md:self-auto">
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'calendar' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Upcoming Events ({eventsList.length})
            </button>
            <button 
              onClick={() => setActiveTab("pitches")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'pitches' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Pitches & Proposals ({proposalsList.length})
            </button>
          </div>
          </div>
        </div>
      </section>'''

new_header = '''      {/* Editorial Header */}
      <section className="bg-[#F2E5E0] border border-[#DCBAB2] rounded-[2.5rem] p-8 md:p-10 shadow-xs space-y-6">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                <Calendar className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>SOCIETY REPERTOIRE & OPERATIONAL DESK</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
                Events & Season Management
              </h1>
              <p className="text-xs sm:text-sm text-[#6E4742] max-w-2xl font-serif italic">
                Oversee upcoming productions, manage member event pitches and funded sponsor partnerships, assign budgets, and open society donation patronage.
              </p>
            </div>
            
            <button
              onClick={() => setCreateEventOpen(true)}
              className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-8 py-3.5 rounded-full text-sm font-mono font-bold uppercase tracking-widest shadow-xl shadow-[#8C241E]/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-[#A6352F] hover:scale-105 active:scale-95 shrink-0"
            >
              <Plus className="w-5 h-5 text-[#FFD0CC]" />
              <span>New Event</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-[#FAF2EE] p-1.5 rounded-full border border-[#DCBAB2] shadow-xs shrink-0 self-start w-fit">
            <button 
              onClick={() => setActiveTab("calendar")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'calendar' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Upcoming Events ({eventsList.length})
            </button>
            <button 
              onClick={() => setActiveTab("pitches")}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'pitches' 
                  ? 'bg-[#8C241E] text-[#FDF8F7] shadow-sm border border-[#A6352F]' 
                  : 'text-[#5C3B37] hover:text-[#2A1816] hover:bg-[#EEDBD5]'
              }`}
            >
              Pitches & Proposals ({proposalsList.length})
            </button>
          </div>
        </div>
      </section>'''

content = content.replace(old_header, new_header)

with open(file_path, "w") as f:
    f.write(content)

print("Modal added and header fixed!")
