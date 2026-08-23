import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/JoinClub.tsx"
with open(file_path, "r") as f:
    content = f.read()

# Replace colors to match Login.tsx
replacements = [
    # General Panels
    ('bg-[#F5EAE6]', 'bg-[#2C2A28]'),
    ('border-[#DEBEB7]', 'border-[#353535]'),
    
    ('bg-[#FAF2EE]', 'bg-[#2C2A28]'),
    ('border-[#DCBAB2]', 'border-[#353535]'),
    
    ('bg-[#FAF2EE]/80', 'bg-[#353535]/80'),
    
    # Text
    ('text-[#2A1816]', 'text-[#F7F5F0]'),
    ('text-[#5C3B37]', 'text-white/70'),
    ('text-[#6E4742]', 'text-white/70'),
    
    # Crimson Accents -> Orange/Flame Accents
    ('text-[#8C241E]', 'text-[#E85F57]'),
    ('bg-[#8C241E]', 'bg-[#E85F57]'),
    ('hover:bg-[#731B16]', 'hover:bg-[#D94538]'),
    ('border-[#A6352F]', 'border-transparent'),
    ('shadow-[#8C241E]/20', 'shadow-[#E85F57]/20'),
    
    # Muted things
    ('bg-[#EEDBD5]', 'bg-[#E85F57]/15'),
    
    # Success State specific fixes
    ('text-[#FDF8F7]', 'text-white'),
    ('text-emerald-800', 'text-emerald-400'),
    ('bg-emerald-100', 'bg-emerald-950/60'),
    ('border-emerald-300', 'border-emerald-500/30'),
]

for old, new in replacements:
    content = content.replace(old, new)

# Special fix for the Page Canvas Background (Login uses bg-[#E7DDD3] text-[#2C2A28] for body, which is already there, but let's check)
# JoinClub uses: <div className="bg-[#E7DDD3] text-[#2A1816] min-h-screen font-sans pt-8 pb-20 selection:bg-[#F8E8E4]">
content = content.replace('text-[#2A1816] min-h-screen', 'text-[#2C2A28] min-h-screen')

with open(file_path, "w") as f:
    f.write(content)

print("JoinClub.tsx updated to match Login.tsx theme!")
