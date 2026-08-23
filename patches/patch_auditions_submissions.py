import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/member/AuditionsCasting.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Pattern to replace from '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">' 
# up to the end of the Progress Phases Timeline

pattern = r'<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">.*?<!-- TONED-DOWN EDITORIAL FILTER BAR -->'
replacement = '''<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((app) => {
              const roleTitle = app.role_name || app.positionTitle || "Production Role";
              const isShortlisted = app.status === "Shortlisted" || app.status === "Selected" || app.status === "Cast";
              
              let progressWidth = "33%";
              let currentPhase = "Phase 1: Application Received";
              if (app.status === "In Review" || app.status === "Directorial Review") {
                progressWidth = "66%";
                currentPhase = "Phase 2: Directorial Review";
              } else if (isShortlisted) {
                progressWidth = "100%";
                currentPhase = "Phase 3: Selected / Cast";
              } else if (app.status === "Declined") {
                progressWidth = "100%";
                currentPhase = "Archived";
              }

              return (
                <div
                  key={app.id}
                  className="bg-[#FAF2EE] border border-[#DCBAB2] rounded-[2rem] p-7 shadow-xs hover:border-[#B32D25]/50 transition-all flex flex-col justify-between group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="space-y-1.5">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#8C5A54] bg-[#EEDBD5] px-2.5 py-0.5 rounded-full">
                        {app.category || "Audition Role"}
                      </span>
                      <h3 className="text-2xl font-serif text-[#2A1816] tracking-tight font-normal leading-snug">
                        {roleTitle}
                      </h3>
                      {app.audition_date && (
                        <p className="text-xs font-mono text-[#8C241E] font-medium flex items-center gap-1.5 pt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Audition Slot: {app.audition_date}</span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleWithdrawApplication(app.id, roleTitle)}
                      className="px-4 py-2 rounded-full border border-[#D5AAA2] bg-[#F5EAE6] hover:bg-[#EEDBD5] text-[#8C241E] text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-xs shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Withdraw
                    </button>
                  </div>

                  {/* Dynamic Progress Phase Timeline per Submission */}
                  <div className="bg-[#E7DDD3] rounded-2xl p-5 border border-[#DCBAB2] space-y-3">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-mono uppercase font-bold text-[#8C5A54]">{currentPhase}</span>
                       <span className="text-[10px] font-mono uppercase font-bold text-[#8C241E]">{app.status}</span>
                    </div>
                    
                    <div className="relative h-2.5 bg-[#D5AAA2] rounded-full overflow-hidden shadow-inner">
                       <div 
                         className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${app.status === "Declined" ? "bg-[#6E4742]" : "bg-[#8C241E]"}`} 
                         style={{ width: progressWidth }}
                       ></div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-[9px] font-mono uppercase text-[#8C5A54]">Pending</span>
                      <span className="text-[9px] font-mono uppercase text-[#8C5A54]">Review</span>
                      <span className="text-[9px] font-mono uppercase text-[#8C5A54]">Result</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TONED-DOWN EDITORIAL FILTER BAR */}'''

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(file_path, "w") as f:
    f.write(content)

print("Submissions patched!")
