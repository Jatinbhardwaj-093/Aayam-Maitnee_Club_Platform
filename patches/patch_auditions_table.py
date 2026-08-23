import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/AuditionsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_actions_start = '''<td className="px-6 py-4.5 align-top text-right">
                          <div className="flex items-center justify-end gap-2">'''

new_actions_start = '''<td className="px-6 py-4.5 align-top text-right">
                          <div className="flex flex-col items-end gap-2.5">
                            <div className="flex items-center justify-end gap-2">'''

content = content.replace(old_actions_start, new_actions_start)

# Now we need to close the inner div after Review Dossier button.
# Let's find the Shortlist button and insert `</div>` before it.

old_shortlist = '''{/* Quick Status Dropdown / Buttons */}'''
new_shortlist = '''</div>\n                            {/* Quick Status Dropdown / Buttons */}'''

content = content.replace(old_shortlist, new_shortlist)

# Also let's make the Shortlist / Cast buttons full width or better styled
old_shortlist_btn = '''className="px-3 py-1.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider border border-[#A6352F] transition-all cursor-pointer shadow-xs"'''
new_shortlist_btn = '''className="w-full flex items-center justify-center px-3 py-1.5 rounded-full bg-[#8C241E] hover:bg-[#731B16] text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider border border-[#A6352F] transition-all cursor-pointer shadow-xs"'''

content = content.replace(old_shortlist_btn, new_shortlist_btn)

old_cast_btn = '''className="px-3 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider border border-emerald-900 transition-all cursor-pointer shadow-xs"'''
new_cast_btn = '''className="w-full flex items-center justify-center px-3 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-[#FDF8F7] text-xs font-mono font-bold uppercase tracking-wider border border-emerald-900 transition-all cursor-pointer shadow-xs"'''

content = content.replace(old_cast_btn, new_cast_btn)


# And make the AI Scan Report button say just "AI Scan" so it's not so wide
old_ai_btn_text = '''AI Scan Report
                            </button>'''
new_ai_btn_text = '''AI Scan
                            </button>'''
content = content.replace(old_ai_btn_text, new_ai_btn_text)

# Review Dossier -> Dossier
old_dossier_btn_text = '''<span>Review Dossier</span>
                            </button>'''
new_dossier_btn_text = '''<span>Dossier</span>
                            </button>'''
content = content.replace(old_dossier_btn_text, new_dossier_btn_text)

with open(file_path, "w") as f:
    f.write(content)

print("Table patched!")
