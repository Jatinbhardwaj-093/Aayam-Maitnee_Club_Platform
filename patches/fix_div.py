import re

file_path = "/Users/jatinbhardwaj/Github/software_project/frontend/src/pages/maintainers/EventsManagement.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_end = '''            </button>
          </div>
        </div>
      </section>'''

new_end = '''            </button>
          </div>
          </div>
        </div>
      </section>'''

content = content.replace(old_end, new_end)

with open(file_path, "w") as f:
    f.write(content)

print("Div fixed!")
