import re
import os

files = [
    "frontend/src/pages/maintainers/AuditionsManagement.tsx",
    "frontend/src/pages/maintainers/MediaModeration.tsx",
    "frontend/src/pages/maintainers/MemberProfileAudit.tsx"
]

for file_path in files:
    full_path = os.path.join("/Users/jatinbhardwaj/Github/software_project", file_path)
    if os.path.exists(full_path):
        with open(full_path, "r") as f:
            content = f.read()
        
        content = content.replace("bg-[#FDF8F7]", "bg-[#FAF2EE]")
        
        with open(full_path, "w") as f:
            f.write(content)
            print(f"Patched {file_path}")
