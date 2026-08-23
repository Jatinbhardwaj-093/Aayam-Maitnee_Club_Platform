import os
import glob

for filepath in glob.iglob('/Users/jatinbhardwaj/Github/software_project/frontend/src/**/*.tsx', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if "bg-white" in content:
        # Some are bg-white/20 (opacity), replacing bg-white with bg-[#FAF2EE] might result in bg-[#FAF2EE]/20 which is valid in tailwind
        content = content.replace("bg-white", "bg-[#FAF2EE]")
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Patched bg-white in {filepath}")

