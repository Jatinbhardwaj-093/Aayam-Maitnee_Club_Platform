import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/EventsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Remove the button
button_pattern = r'''\s*<button\s*onClick=\{[^}]*setCreateEventOpen\(true\)[^}]*\}\s*className="bg-\[#8C241E\] hover:bg-\[#731B16\][^"]*"\s*>\s*<Plus className="w-5 h-5 text-\[#FFD0CC\]" />\s*<span>New Event</span>\s*</button>'''
content = re.sub(button_pattern, '', content)

# 2. Remove the modal block
# Let's just find the start of the modal and remove until the end
modal_start = r'\{/\* Create Event Modal \*/\}'
# Find where it starts
match = re.search(modal_start, content)
if match:
    start_idx = match.start()
    # Find the end of the file
    # The modal is right before the last closing tags:
    #      )}
    #    </div>
    #  );
    # }
    
    # Let's just do string replacement
    modal_text_start = content.find('{/* Create Event Modal */}')
    if modal_text_start != -1:
        # Find the last '</div>\n  );\n}'
        end_text = '    </div>\n  );\n}'
        end_idx = content.rfind(end_text)
        
        # We replace everything from modal_text_start to end_idx with just spaces or nothing
        content = content[:modal_text_start] + '\n' + end_text

with open(file_path, "w") as f:
    f.write(content)

print("Removed New Event button and modal!")
