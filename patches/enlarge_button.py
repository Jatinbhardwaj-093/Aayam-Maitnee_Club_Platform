import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/AuditionsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_btn = '''<button
              onClick={() => setCreatePosOpen(true)}
              className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-6 py-3 rounded-full text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-[#8C241E]/20 flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#A6352F] shrink-0"
            >
              <Plus className="w-4 h-4 text-[#FFD0CC]" />
              <span>New Calling</span>
            </button>'''

new_btn = '''<button
              onClick={() => setCreatePosOpen(true)}
              className="bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] px-8 py-3.5 rounded-full text-sm font-mono font-bold uppercase tracking-widest shadow-xl shadow-[#8C241E]/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-[#A6352F] shrink-0 hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5 text-[#FFD0CC]" />
              <span>New Calling</span>
            </button>'''

content = content.replace(old_btn, new_btn)

with open(file_path, "w") as f:
    f.write(content)

print("Button enlarged!")
