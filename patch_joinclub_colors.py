import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/JoinClub.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace text-[#FDF8F7] with text-[#2A1816] EXCEPT where bg-[#8C241E] is present (buttons)
# It's easier to just do a global replace of text-[#FDF8F7] to text-[#2A1816] on elements that have light backgrounds

# 1. Main wrapper text color:
content = content.replace(
    '<div className="bg-[#E7DDD3] text-[#FDF8F7] min-h-screen font-sans selection:bg-[#F2E5E0] pt-8 pb-20">',
    '<div className="bg-[#E7DDD3] text-[#5C3B37] min-h-screen font-sans selection:bg-[#F2E5E0] pt-8 pb-20">'
)

# 2. Main card text color:
content = content.replace(
    '<div className="bg-[#F5EAE6] text-[#FDF8F7] rounded-[2rem] p-7 md:p-8 border border-[#DEBEB7] shadow-2xl space-y-5 relative overflow-hidden">',
    '<div className="bg-[#F5EAE6] text-[#2A1816] rounded-[2rem] p-7 md:p-8 border border-[#DEBEB7] shadow-2xl space-y-5 relative overflow-hidden">'
)

# 3. Error box dark mode remnant:
content = content.replace(
    'bg-rose-950/60 border border-rose-500/40 text-rose-200',
    'bg-rose-100 border border-rose-300 text-rose-800'
)

# 4. Success box dark mode remnant:
content = content.replace(
    'bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30',
    'bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto border border-emerald-300'
)

with open(file_path, "w") as f:
    f.write(content)

print("JoinClub patched!")
