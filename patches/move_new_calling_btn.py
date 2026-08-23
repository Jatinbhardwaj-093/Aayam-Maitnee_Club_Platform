import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/AuditionsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Remove it from the filter bar:
old_filter_btns = '''</button>

              <button
                onClick={() => setCreatePosOpen(true)}
                className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 transition-all cursor-pointer border border-[#A6352F]"
              >
                <Plus className="w-3.5 h-3.5 text-[#FFD0CC]" />
                <span>New Calling</span>
              </button>
            </div>'''

new_filter_btns = '''</button>
            </div>'''
            
content = content.replace(old_filter_btns, new_filter_btns)

# 2. Add it to the header banner
old_header = '''<div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
              <Activity className="w-3.5 h-3.5 text-[#8C241E]" />
              <span>DIRECTOR & MAINTAINER CASTING DESK</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
              Auditions & Casting Management
            </h1>
            <p className="text-xs sm:text-sm text-[#6E4742] max-w-2xl font-serif italic">
              Publish production role callings, screen audition slates with AI evaluation, and curate the official Aayam ensemble cast.
            </p>
          </div>'''

new_header = '''<div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A54]">
                <Activity className="w-3.5 h-3.5 text-[#8C241E]" />
                <span>DIRECTOR & MAINTAINER CASTING DESK</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl text-[#2A1816] font-normal tracking-tight">
                Auditions & Casting Management
              </h1>
              <p className="text-xs sm:text-sm text-[#6E4742] max-w-2xl font-serif italic">
                Publish production role callings, screen audition slates with AI evaluation, and curate the official Aayam ensemble cast.
              </p>
            </div>
            
            <button
              onClick={() => setCreatePosOpen(true)}
              className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#A6352F] shrink-0"
            >
              <Plus className="w-4 h-4 text-[#FFD0CC]" />
              <span>New Calling</span>
            </button>
          </div>'''

content = content.replace(old_header, new_header)

with open(file_path, "w") as f:
    f.write(content)

print("Button moved!")
