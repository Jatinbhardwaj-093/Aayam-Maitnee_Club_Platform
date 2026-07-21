import sys
import os

sys.path.append('backend')
from app import app, db
from models import Script

with app.app_context():
    scripts = Script.query.all()
    for s in scripts:
        if s.id == 1 or "Tamashbin" in s.title:
            s.pages = 4
            s.roles_count = "5 Characters"
            s.abstract = "A high-energy street drama satire exploring corruption, political puppetry, and public conscience in a crowded market square."
            s.content = '''{
              "characters": [
                {"id": "c1", "name": "Sutradhar", "traits": "Lead Narrator & Chorus Master", "color": "#635f41"},
                {"id": "c2", "name": "Tamashbin", "traits": "Cynical Bystander", "color": "#d97706"},
                {"id": "c3", "name": "Kathputli Master", "traits": "Stage Puppet Operator", "color": "#059669"},
                {"id": "c4", "name": "Neta Ji", "traits": "Local Politician Antagonist", "color": "#7c3aed"},
                {"id": "c5", "name": "Aam Aadmi", "traits": "Common Citizen Voice", "color": "#db2777"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Sutradhar", "color": "#635f41", "text": "Suno suno re bhaiyo, suno tamashbin ka khel! Kathputliya naachegi, bolega sach ka mel!"},
                {"id": "l2", "characterId": "c2", "characterName": "Tamashbin", "color": "#d97706", "text": "Sach? Is shahad ke mausam me sach bolne wala pagal hi kehlaayega!"},
                {"id": "l3", "characterId": "c3", "characterName": "Kathputli Master", "color": "#059669", "text": "Dhaaga mere haath me hai, par nachne wala samajhta hai ki khwahish uski apni hai!"},
                {"id": "l4", "characterId": "c4", "characterName": "Neta Ji", "color": "#7c3aed", "text": "Kyu shor macha rahe ho courtyard me? Vaade hum karte hain, taaliya tum bajate ho!"},
                {"id": "l5", "characterId": "c5", "characterName": "Aam Aadmi", "color": "#db2777", "text": "Taaliya bajate bajate humare haath thak gaye Neta Ji, par ration ki dukan ab bhi khali hai!"},
                {"id": "l6", "characterId": "c1", "characterName": "Sutradhar", "color": "#635f41", "text": "[Pacing rhythmically with dholak beat] Dekha jan-gan-man ka tamasha? Parda uth chuka hai!"},
                {"id": "l7", "characterId": "c3", "characterName": "Kathputli Master", "color": "#059669", "text": "Ek jhukav baayein, ek jhukav daayein... aur janata taali bajayein!"},
                {"id": "l8", "characterId": "c2", "characterName": "Tamashbin", "color": "#d97706", "text": "Bas karo! Hasi aati hai humein apne aap par."},
                {"id": "l9", "characterId": "c4", "characterName": "Neta Ji", "color": "#7c3aed", "text": "Agli baar fir aayenge, fir naye vaade layenge!"},
                {"id": "l10", "characterId": "c5", "characterName": "Aam Aadmi", "color": "#db2777", "text": "Is baar nahi Neta Ji. Is baar dhaaga humare haath me hai!"}
              ],
              "abstract": "A high-energy street drama satire exploring corruption, political puppetry, and public conscience in a crowded market square.",
              "labels": "Street Drama, Satire, Folk",
              "theme": "Deception & Political Puppetry",
              "settingInfo": "Town Square Courtyard, Noon"
            }'''
        elif s.id == 2 or "DDDJ" in s.title:
            s.pages = 5
            s.roles_count = "5 Characters"
            s.abstract = "An intense psychological confrontation behind the velvet curtains of a premier theatre academy on opening night."
            s.content = '''{
              "characters": [
                {"id": "c1", "name": "Abay", "traits": "Lead Actor / Protagonist", "color": "#635f41"},
                {"id": "c2", "name": "Director Vikram", "traits": "Uncompromising Theatre Director", "color": "#d97706"},
                {"id": "c3", "name": "Maya", "traits": "Co-Star & Confidante", "color": "#db2777"},
                {"id": "c4", "name": "Stage Manager Esha", "traits": "Backstage Controller", "color": "#059669"},
                {"id": "c5", "name": "The Critic", "traits": "Observer / Antagonist", "color": "#7c3aed"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Abay", "color": "#635f41", "text": "When the lights fade into crimson, the stage forgets who you were before the curtain rose..."},
                {"id": "l2", "characterId": "c2", "characterName": "Director Vikram", "color": "#d97706", "text": "Don't hide behind the mask, Abay! Give me raw passion, or leave the stage!"},
                {"id": "l3", "characterId": "c3", "characterName": "Maya", "color": "#db2777", "text": "He is not acting, Vikram... look at his eyes. He is speaking from real pain."},
                {"id": "l4", "characterId": "c4", "characterName": "Stage Manager Esha", "color": "#059669", "text": "[Over headset] Two minutes to places! Act I lighting preset active."},
                {"id": "l5", "characterId": "c5", "characterName": "The Critic", "color": "#7c3aed", "text": "Let us see if tonight brings genuine art or mere theatrical ambition."},
                {"id": "l6", "characterId": "c1", "characterName": "Abay", "color": "#635f41", "text": "Art demands sacrifice. Tonight, I leave my soul under the spotlight."},
                {"id": "l7", "characterId": "c3", "characterName": "Maya", "color": "#db2777", "text": "I am standing right beside you, Abay. We deliver this together."},
                {"id": "l8", "characterId": "c2", "characterName": "Director Vikram", "color": "#d97706", "text": "Curtain up! Sound system go!"}
              ],
              "abstract": "An intense psychological confrontation behind velvet curtains on opening night.",
              "labels": "Psychological, Drama, Backstage",
              "theme": "Masks of Identity",
              "settingInfo": "Greenroom & Stage Left"
            }'''
        elif "Court of Shadows" in s.title or s.id == 6:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A noir courtroom thriller investigating a high-stakes conspiracy in midnight Mumbai."
            s.content = '''{
              "characters": [
                {"id": "c1", "name": "Abay", "traits": "Lead Defense Attorney", "color": "#635f41"},
                {"id": "c2", "name": "Prosecutor Devendra", "traits": "Rival Prosecutor", "color": "#d97706"},
                {"id": "c3", "name": "Inspector Rathore", "traits": "Key Witness / Police Officer", "color": "#059669"},
                {"id": "c4", "name": "Judge Roy", "traits": "Presiding Magistrate", "color": "#7c3aed"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Abay", "color": "#635f41", "text": "In the dim light of this court, truth is treated like a bargaining chip..."},
                {"id": "l2", "characterId": "c2", "characterName": "Prosecutor Devendra", "color": "#d97706", "text": "Objection, Your Honor! Counsel is indulging in poetic melodrama instead of facts."},
                {"id": "l3", "characterId": "c4", "characterName": "Judge Roy", "color": "#7c3aed", "text": "Sustained. Mr. Abay, present your primary evidence or yield the floor."},
                {"id": "l4", "characterId": "c3", "characterName": "Inspector Rathore", "color": "#059669", "text": "[Stepping to witness box] The logbook entries for that midnight shift were altered, Your Honor."},
                {"id": "l5", "characterId": "c1", "characterName": "Abay", "color": "#635f41", "text": "And who had access to the master lock-up key, Inspector? Tell the court!"},
                {"id": "l6", "characterId": "c2", "characterName": "Prosecutor Devendra", "color": "#d97706", "text": "[Standing up abruptly] That question violates official protocol!"},
                {"id": "l7", "characterId": "c1", "characterName": "Abay", "color": "#635f41", "text": "Protocol cannot hide justice!"}
              ],
              "abstract": "A noir courtroom thriller investigating a high-stakes conspiracy in midnight Mumbai.",
              "labels": "Courtroom, Thriller, Noir",
              "theme": "Justice vs Corruption",
              "settingInfo": "Session Courtroom 4"
            }'''
        elif "Whispers" in s.title or s.id == 8:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A social realism drama following a rural schoolteacher standing up for women’s literacy against entrenched village elders."
            s.content = '''{
              "characters": [
                {"id": "c1", "name": "Aditi", "traits": "Village Schoolteacher", "color": "#059669"},
                {"id": "c2", "name": "Gram Pradhan", "traits": "Village Headman Antagonist", "color": "#d97706"},
                {"id": "c3", "name": "Dadi Janki", "traits": "Respected Village Matriarch", "color": "#7c3aed"},
                {"id": "c4", "name": "Pooja", "traits": "Young Student", "color": "#8CC0EB"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Aditi", "color": "#059669", "text": "The roots of this banyan tree run deep, Pradhan Ji, but so does our children's right to learn!"},
                {"id": "l2", "characterId": "c2", "characterName": "Gram Pradhan", "color": "#d97706", "text": "Books won't till the fields, Aditi. Traditions cannot be broken overnight."},
                {"id": "l3", "characterId": "c4", "characterName": "Pooja", "color": "#8CC0EB", "text": "Pradhan Baba! Look, I wrote my own name in Hindi today!"},
                {"id": "l4", "characterId": "c3", "characterName": "Dadi Janki", "color": "#7c3aed", "text": "[Leaning on cane] Let the girl speak, Pradhan. In my eighty years, I have seen ignorance ruin more families than drought."},
                {"id": "l5", "characterId": "c1", "characterName": "Aditi", "color": "#059669", "text": "If we educate Pooja today, she will light the lantern for the entire village tomorrow."}
              ],
              "abstract": "A social realism drama following a rural schoolteacher standing up for women’s literacy.",
              "labels": "Social Realism, Village Life",
              "theme": "Education & Tradition",
              "settingInfo": "Under Banyan Tree, Village Square"
            }'''
        elif "Chai" in s.title or s.id == 10:
            s.pages = 4
            s.roles_count = "5 Characters"
            s.abstract = "A vibrant street play depicting urban life, college aspirations, and political debates at a local tea stall."
            s.content = '''{
              "characters": [
                {"id": "c1", "name": "Kanishk", "traits": "Chaiwala & Ensemble Lead", "color": "#db2777"},
                {"id": "c2", "name": "Student Leader Arjun", "traits": "Activist", "color": "#2563eb"},
                {"id": "c3", "name": "Corporate Exec Priya", "traits": "Urban Professional", "color": "#059669"},
                {"id": "c4", "name": "Uncle Sharma", "traits": "Opinionated Elder", "color": "#d97706"},
                {"id": "c5", "name": "Chorus Voice", "traits": "Street Ensemble", "color": "#635f41"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Kanishk", "color": "#db2777", "text": "Chai garam, baatein garam! Suno janata, nukkad par aaj kya naya hungama hai!"},
                {"id": "l2", "characterId": "c2", "characterName": "Student Leader Arjun", "color": "#2563eb", "text": "Hungama nahi Kanishk, aawaz hai youth ki! Jobs kahan hain?"},
                {"id": "l3", "characterId": "c3", "characterName": "Corporate Exec Priya", "color": "#059669", "text": "Skills develop karo Arjun! Market efficiency needs innovation, not just slogans."},
                {"id": "l4", "characterId": "c4", "characterName": "Uncle Sharma", "color": "#d97706", "text": "[Sipping tea] Humare zamaane me to ek biskut me poora din nikal jaata tha!"},
                {"id": "l5", "characterId": "c5", "characterName": "Chorus Voice", "color": "#635f41", "text": "[Clapping in street rhythm] Chai ki chuski, nukkad ka rang! Har aam insaan ki yahi hai patang!"}
              ],
              "abstract": "A vibrant street play depicting urban life, college aspirations, and political debates at a local tea stall.",
              "labels": "Street Play, Satire, Nukkad",
              "theme": "Urban Aspirations",
              "settingInfo": "Corner Tea Naka, Morning"
            }'''
        elif "Stage Manager" in s.title or s.id == 12:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A fast-paced backstage comedy following a stage manager navigating props disasters before opening night."
            s.content = '''{
              "characters": [
                {"id": "c1", "name": "Esha", "traits": "Stage Manager", "color": "#7c3aed"},
                {"id": "c2", "name": "Lead Actor Rohan", "traits": "Panicked Star", "color": "#db2777"},
                {"id": "c3", "name": "Prop Master Chhotu", "traits": "Flustered Assistant", "color": "#d97706"},
                {"id": "c4", "name": "Director Madam", "traits": "Strict Commander", "color": "#635f41"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Esha", "color": "#7c3aed", "text": "Thirty seconds to curtain and Rohan has lost his royal sword! Where is Chhotu?"},
                {"id": "l2", "characterId": "c2", "characterName": "Lead Actor Rohan", "color": "#db2777", "text": "I can\'t enter Scene 1 holding a plastic ruler, Esha! The audience will laugh!"},
                {"id": "l3", "characterId": "c3", "characterName": "Prop Master Chhotu", "color": "#d97706", "text": "[Running in out of breath] Found it! It was sitting under the soundboard amplifier!"},
                {"id": "l4", "characterId": "c4", "characterName": "Director Madam", "color": "#635f41", "text": "Quiet backstage! House lights down in 5, 4, 3..."},
                {"id": "l5", "characterId": "c1", "characterName": "Esha", "color": "#7c3aed", "text": "[Whispering into headset] Cue stage left door open! Break a leg, everyone!"}
              ],
              "abstract": "A fast-paced backstage comedy following a stage manager navigating props disasters before opening night.",
              "labels": "Backstage Comedy, Theatre Life",
              "theme": "Chaos & Stage Magic",
              "settingInfo": "Stage Left Wings, 1 Minute to Opening"
            }'''

    db.session.commit()
    print("Successfully populated rich multi-character 1-2 page stories across aayam.db!")
