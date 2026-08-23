import re

with open('backend/api.py', 'r') as f:
    api = f.read()

# Fix create route
create_old = """    new_pos = AuditionPosition(
        production_name=data.get('production_name', 'Mainstage Production'),
        role_name=data.get('role_name', 'Character Role'),
        role_category=data.get('role_category', 'Character Role'),
        character_description=data.get('character_description', ''),
        requirements=data.get('requirements', ''),
        slots_available=int(data.get('slots_available', 1)),
        status=data.get('status', 'Open Calling')
    )"""

create_new = """    new_pos = AuditionPosition(
        production_name=data.get('production_name', 'Mainstage Production'),
        role_name=data.get('role_name', 'Character Role'),
        role_category=data.get('role_category', 'Character Role'),
        character_description=data.get('character_description', ''),
        requirements=data.get('requirements', ''),
        slots_available=int(data.get('slots_available', 1)),
        status=data.get('status', 'Open Calling'),
        require_portfolio=bool(data.get('require_portfolio', False)),
        require_video=bool(data.get('require_video', False)),
        require_audio=bool(data.get('require_audio', False))
    )"""

api = api.replace(create_old, create_new)

# Fix update route
update_old = """    pos.production_name = data.get('production_name', pos.production_name)
    pos.role_name = data.get('role_name', pos.role_name)
    pos.role_category = data.get('role_category', pos.role_category)
    pos.character_description = data.get('character_description', pos.character_description)
    pos.requirements = data.get('requirements', pos.requirements)
    pos.slots_available = int(data.get('slots_available', pos.slots_available))
    pos.status = data.get('status', pos.status)"""

update_new = """    pos.production_name = data.get('production_name', pos.production_name)
    pos.role_name = data.get('role_name', pos.role_name)
    pos.role_category = data.get('role_category', pos.role_category)
    pos.character_description = data.get('character_description', pos.character_description)
    pos.requirements = data.get('requirements', pos.requirements)
    pos.slots_available = int(data.get('slots_available', pos.slots_available))
    pos.status = data.get('status', pos.status)
    pos.require_portfolio = bool(data.get('require_portfolio', pos.require_portfolio))
    pos.require_video = bool(data.get('require_video', pos.require_video))
    pos.require_audio = bool(data.get('require_audio', pos.require_audio))"""

api = api.replace(update_old, update_new)

with open('backend/api.py', 'w') as f:
    f.write(api)
