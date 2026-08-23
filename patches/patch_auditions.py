import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/AuditionsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Fix CustomSelect options
bad_options = 'options={["Character Role", "Performer", "Technical Crew", "Backstage Technical", "Director", "Makeup & Hair", "Costume"]}'
good_options = 'options={[{value: "Character Role", label: "Character Role"}, {value: "Performer", label: "Performer"}, {value: "Technical Crew", label: "Technical Crew"}, {value: "Backstage Technical", label: "Backstage Technical"}, {value: "Director", label: "Director"}, {value: "Makeup & Hair", label: "Makeup & Hair"}, {value: "Costume", label: "Costume"}]}'

content = content.replace(bad_options, good_options)

# 2. Add accent-[#8C241E] to checkboxes
checkbox_class_bad = 'className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2"'
checkbox_class_good = 'className="w-4 h-4 text-[#8C241E] bg-[#F5EAE6] border-[#DCBAB2] rounded focus:ring-[#8C241E] focus:ring-2 accent-[#8C241E] cursor-pointer"'

content = content.replace(checkbox_class_bad, checkbox_class_good)

with open(file_path, "w") as f:
    f.write(content)

print("Patched.")
