import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/EventsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

# 1. Add import
if "import CustomSelect" not in content:
    content = content.replace('import ProductionEditModal from "@/components/ProductionEditModal";',
                              'import ProductionEditModal from "@/components/ProductionEditModal";\nimport CustomSelect from "@/components/CustomSelect";')

# 2. Replace native selects
old_select_1 = '''<select
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="w-full bg-[#FAF2EE] border border-[#DCBAB2] rounded-xl px-4 py-2.5 text-xs text-[#2A1816] focus:outline-hidden focus:border-[#8C241E] cursor-pointer shadow-xs"
                    >
                      <option value="Workshops">Workshops & Masterclasses</option>
                      <option value="Meetups">Meetups & Script Readings</option>
                      <option value="Plays">Stage Production Preview</option>
                      <option value="Sponsor Showcase">Sponsor Showcase</option>
                    </select>'''

new_select_1 = '''<CustomSelect
                      value={editFormData.category || "Workshops"}
                      onChange={(val) => setEditFormData({ ...editFormData, category: val })}
                      options={[
                        {value: "Workshops", label: "Workshops & Masterclasses"},
                        {value: "Meetups", label: "Meetups & Script Readings"},
                        {value: "Plays", label: "Stage Production Preview"},
                        {value: "Sponsor Showcase", label: "Sponsor Showcase"}
                      ]}
                      placeholder="Select Category"
                    />'''

content = content.replace(old_select_1, new_select_1)


old_select_2 = '''<select
                              value={app.status || "Under Review"}
                              onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                              className="bg-[#F5EAE6] border border-[#D5AAA2] rounded-xl px-3 py-1.5 text-xs font-mono text-[#2A1816] font-semibold focus:outline-hidden focus:border-[#8C241E] cursor-pointer"
                            >
                              <option value="Under Review">Under Review</option>
                              <option value="Audition Scheduled">Audition Scheduled</option>
                              <option value="Selected">Selected</option>
                              <option value="Waitlisted">Waitlisted</option>
                              <option value="Declined">Declined</option>
                            </select>'''

new_select_2 = '''<CustomSelect
                              value={app.status || "Under Review"}
                              onChange={(val) => handleUpdateAppStatus(app.id, val)}
                              options={[
                                {value: "Under Review", label: "Under Review"},
                                {value: "Audition Scheduled", label: "Audition Scheduled"},
                                {value: "Selected", label: "Selected"},
                                {value: "Waitlisted", label: "Waitlisted"},
                                {value: "Declined", label: "Declined"}
                              ]}
                              placeholder="Update Status"
                            />'''

content = content.replace(old_select_2, new_select_2)

with open(file_path, "w") as f:
    f.write(content)

print("Selects replaced!")
