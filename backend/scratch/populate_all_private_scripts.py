import sys
import json
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("backend"))

from app import app, db
from models import Script

with app.app_context():
    all_scripts = Script.query.all()
    for s in all_scripts:
        if s.id == 1 or "Tamashbin" in s.title:
            s.pages = 4
            s.roles_count = "5 Characters"
            s.abstract = "A high-energy street drama satire exploring corruption, political puppetry, and public conscience in a crowded market square."
            s.content = json.dumps({
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
              "abstract": "A high-energy street drama satire exploring corruption, political puppetry, and public conscience.",
              "labels": "Street Drama, Satire, Folk",
              "theme": "Deception & Political Puppetry",
              "settingInfo": "Town Square Courtyard, Noon"
            })

        elif s.id == 2 or "DDDJ" in s.title:
            s.pages = 5
            s.roles_count = "5 Characters"
            s.abstract = "An intense psychological confrontation behind the velvet curtains of a premier theatre academy on opening night."
            s.content = json.dumps({
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
            })

        elif s.id == 3 or "Karn" in s.title:
            s.pages = 6
            s.roles_count = "5 Characters"
            s.abstract = "An epic classical verse tragedy exploring Karna's moral dilemmas and unfaltering loyalty before Kurukshetra."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Karna", "traits": "Tragic Hero", "color": "#635f41"},
                {"id": "c2", "name": "Krishna", "traits": "Divine Strategist / Guide", "color": "#2563eb"},
                {"id": "c3", "name": "Kunti", "traits": "Mother", "color": "#7c3aed"},
                {"id": "c4", "name": "Duryodhana", "traits": "Loyal Friend / King", "color": "#d97706"},
                {"id": "c5", "name": "Parasurama Ghost", "traits": "Mentor Voice", "color": "#059669"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Karna", "color": "#635f41", "text": "Dharm rakshati rakshita! Kaun hai jo destiny ko badal sake jab rath ka chakka dharti me dhas jaaye..."},
                {"id": "l2", "characterId": "c2", "characterName": "Krishna", "color": "#2563eb", "text": "Karna, victory belongs not to weapons, but to unyielding righteousness."},
                {"id": "l3", "characterId": "c3", "characterName": "Kunti", "color": "#7c3aed", "text": "My son, forgive a mother who had to choose silence over honor."},
                {"id": "l4", "characterId": "c4", "characterName": "Duryodhana", "color": "#d97706", "text": "Karna gave me his kingdom when I had none. I stand with Karna till sunrise!"},
                {"id": "l5", "characterId": "c5", "characterName": "Parasurama Ghost", "color": "#059669", "text": "[Voice echoing] When your ultimate moment comes, the sacred mantras will slip from your memory..."}
              ],
              "abstract": "An epic classical verse tragedy exploring Karna's moral dilemmas.",
              "labels": "Mythological, Classical Verse",
              "theme": "Dharma & Destiny",
              "settingInfo": "Kurukshetra Tent at Sunset"
            })

        elif s.id == 4 or "Samatvam" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A physical movement theatre piece depicting human equilibrium, spatial geometry, and synchronized breath."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Samarth", "traits": "Movement Master", "color": "#059669"},
                {"id": "c2", "name": "Ensemble Lead 1", "traits": "Rhythmic Wave", "color": "#8CC0EB"},
                {"id": "c3", "name": "Ensemble Lead 2", "traits": "Counter-balance", "color": "#d97706"},
                {"id": "c4", "name": "Soundscape Vocalist", "traits": "Harmonic Chants", "color": "#635f41"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Samarth", "color": "#059669", "text": "(Movement Cue 4): The ensemble forms a concentric circle. Slow breathing sync on beat 3..."},
                {"id": "l2", "characterId": "c2", "characterName": "Ensemble Lead 1", "color": "#8CC0EB", "text": "[Inhales in unison, expanding spatial circle outwards]"},
                {"id": "l3", "characterId": "c3", "characterName": "Ensemble Lead 2", "color": "#d97706", "text": "[Leans backward at 45 degree angle into trust-fall posture]"},
                {"id": "l4", "characterId": "c4", "characterName": "Soundscape Vocalist", "color": "#635f41", "text": "[Sustained low hum in pitch A-440]"}
              ],
              "abstract": "A physical movement theatre piece depicting human equilibrium and collective pulse.",
              "labels": "Physical Theatre, Movement",
              "theme": "Equilibrium & Pulse",
              "settingInfo": "Black Box Studio"
            })

        elif s.id == 5 or "Speak Up Tara" in s.title:
            s.pages = 5
            s.roles_count = "4 Characters"
            s.abstract = "A contemporary social drama centering on a student activist fighting institutional silence."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Tara", "traits": "Student Activist", "color": "#db2777"},
                {"id": "c2", "name": "Professor Anand", "traits": "Academic Mentor", "color": "#475569"},
                {"id": "c3", "name": "Rohan", "traits": "Student Journalist", "color": "#059669"},
                {"id": "c4", "name": "Dean Kapoor", "traits": "University Dean Antagonist", "color": "#635f41"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Tara", "color": "#db2777", "text": "Silence isn't safety. If we don't speak up today, our stories will be written by others!"},
                {"id": "l2", "characterId": "c2", "characterName": "Professor Anand", "color": "#475569", "text": "Truth has a heavy cost in this institution, Tara. Are you prepared to bear it?"},
                {"id": "l3", "characterId": "c3", "characterName": "Rohan", "color": "#059669", "text": "The student press is running the story on tomorrow's front page!"},
                {"id": "l4", "characterId": "c4", "characterName": "Dean Kapoor", "color": "#635f41", "text": "You are risking your scholarships, students. Think carefully before taking another step."}
              ],
              "abstract": "A contemporary social drama centering on a student activist fighting institutional silence.",
              "labels": "Social Drama, Youth",
              "theme": "Courage & Truth",
              "settingInfo": "Campus Auditorium Steps"
            })

        elif s.id == 6 or "Court of Shadows" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A noir psychological courtroom thriller investigating a high-stakes conspiracy in midnight Mumbai."
            s.content = json.dumps({
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
              "abstract": "A noir psychological courtroom thriller investigating a high-stakes conspiracy in midnight Mumbai.",
              "labels": "Courtroom, Thriller, Noir",
              "theme": "Justice vs Corruption",
              "settingInfo": "Session Courtroom 4, Midnight"
            })

        elif s.id == 7 or "The Last Soliloquy" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A poignant dramatic soliloquy following a legendary theatre actor facing his final curtain call."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Abay", "traits": "Veteran Stage Actor", "color": "#635f41"},
                {"id": "c2", "name": "The Ghost of Hamlet", "traits": "Apparition / Foil", "color": "#8CC0EB"},
                {"id": "c3", "name": "Young Apprentice Kabir", "traits": "Stage Protégé", "color": "#059669"},
                {"id": "c4", "name": "Understudy Tarun", "traits": "Eager Rival", "color": "#d97706"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Abay", "color": "#635f41", "text": "When all the applause fades into dust, only the empty wooden stage remains..."},
                {"id": "l2", "characterId": "c3", "characterName": "Young Apprentice Kabir", "color": "#059669", "text": "Master Abay! The audience is standing. They are chanting your name for an encore!"},
                {"id": "l3", "characterId": "c1", "characterName": "Abay", "color": "#635f41", "text": "Let them chant for the characters, Kabir, not the fragile man behind the mask."},
                {"id": "l4", "characterId": "c2", "characterName": "The Ghost of Hamlet", "color": "#8CC0EB", "text": "[Echoing from upstage darkness] Remember me... remember the words we gave to the night."},
                {"id": "l5", "characterId": "c4", "characterName": "Understudy Tarun", "color": "#d97706", "text": "Are you ready to pass the mantle, Sir?"},
                {"id": "l6", "characterId": "c1", "characterName": "Abay", "color": "#635f41", "text": "The mantle belongs to anyone who speaks with truth!"}
              ],
              "abstract": "A poignant dramatic soliloquy following a legendary theatre actor facing his final curtain call.",
              "labels": "Classic, Monologue, Drama",
              "theme": "Legacy & Artistic Passion",
              "settingInfo": "Dimly Lit Stage, Post-Show"
            })

        elif s.id == 8 or "Whispers" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A rural social drama centered on a teacher building a girl's school under an ancient village banyan tree."
            s.content = json.dumps({
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
              "abstract": "A rural social drama centered on a teacher building a girl's school.",
              "labels": "Social Realism, Village Life",
              "theme": "Education & Reform",
              "settingInfo": "Under Banyan Tree, Village Square"
            })

        elif s.id == 9 or "Nayi Subah" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "An uplifting motivational play following four college students organizing a clean energy initiative."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Aditi", "traits": "Lead Student Organizer", "color": "#8CC0EB"},
                {"id": "c2", "name": "Rohan", "traits": "Tech Lead", "color": "#059669"},
                {"id": "c3", "name": "Meera", "traits": "Creative Designer", "color": "#db2777"},
                {"id": "c4", "name": "Mayor Verma", "traits": "Town Mayor Antagonist", "color": "#635f41"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Aditi", "color": "#8CC0EB", "text": "Morning comes not when the sun rises, but when we choose to wake up and take action!"},
                {"id": "l2", "characterId": "c2", "characterName": "Rohan", "color": "#059669", "text": "The solar prototype is tested and ready. We just need the town hall permit."},
                {"id": "l3", "characterId": "c4", "characterName": "Mayor Verma", "color": "#635f41", "text": "Town hall permits require municipal review. You students move too fast."},
                {"id": "l4", "characterId": "c3", "characterName": "Meera", "color": "#db2777", "text": "The climate doesn't wait for municipal review, Mayor Sir!"},
                {"id": "l5", "characterId": "c1", "characterName": "Aditi", "color": "#8CC0EB", "text": "Sign the permit today, or we take our solar demonstration to the public square tomorrow!"}
              ],
              "abstract": "An uplifting motivational play following four college students organizing a clean energy initiative.",
              "labels": "Youth, Environment, Hope",
              "theme": "Youth Leadership & Innovation",
              "settingInfo": "Town Hall Steps"
            })

        elif s.id == 10 or "Chai" in s.title:
            s.pages = 4
            s.roles_count = "5 Characters"
            s.abstract = "A satirical street play portraying lively conversations, local politics, and youth dreams at a tea stall."
            s.content = json.dumps({
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
              "abstract": "A satirical street play portraying lively conversations, local politics, and youth dreams at a tea stall.",
              "labels": "Street Play, Satire, Nukkad",
              "theme": "Urban Aspirations",
              "settingInfo": "Corner Tea Stall Naka"
            })

        elif s.id == 11 or "Siren" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "An atmospheric folklore thriller set along the misty river steps of ancient Varanasi."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Kanishk", "traits": "Mysterious Boatman", "color": "#2563eb"},
                {"id": "c2", "name": "Scholar Ananya", "traits": "Historian / Researcher", "color": "#7c3aed"},
                {"id": "c3", "name": "Pandit Shastri", "traits": "Ghat Priest", "color": "#d97706"},
                {"id": "c4", "name": "The Traveler", "traits": "Stranger", "color": "#635f41"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Kanishk", "color": "#2563eb", "text": "When river fog rises over Manikarnika Ghat, old legends walk among us..."},
                {"id": "l2", "characterId": "c2", "characterName": "Scholar Ananya", "color": "#7c3aed", "text": "The manuscript mentioned a hidden inscription under the third step."},
                {"id": "l3", "characterId": "c3", "characterName": "Pandit Shastri", "color": "#d97706", "text": "Some secrets are meant to rest beneath the sacred waters, Ananya."},
                {"id": "l4", "characterId": "c4", "characterName": "The Traveler", "color": "#635f41", "text": "[Stepping off boat] Then why did the temple bell ring three times at midnight?"},
                {"id": "l5", "characterId": "c1", "characterName": "Kanishk", "color": "#2563eb", "text": "Row with me... and I will show you what lies beneath the fog."}
              ],
              "abstract": "An atmospheric folklore thriller set along the misty river steps of ancient Varanasi.",
              "labels": "Mystery, Folklore, Thriller",
              "theme": "Faith & Ancient Secrets",
              "settingInfo": "Varanasi River Ghat, Midnight"
            })

        elif s.id == 12 or "Stage Manager" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A fast-paced backstage comedy following a stage manager navigating props disasters before opening night."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Esha", "traits": "Stage Manager", "color": "#7c3aed"},
                {"id": "c2", "name": "Lead Actor Rohan", "traits": "Panicked Star", "color": "#db2777"},
                {"id": "c3", "name": "Prop Master Chhotu", "traits": "Flustered Assistant", "color": "#d97706"},
                {"id": "c4", "name": "Director Madam", "traits": "Strict Commander", "color": "#635f41"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Esha", "color": "#7c3aed", "text": "Thirty seconds to curtain and Rohan has lost his royal sword! Where is Chhotu?"},
                {"id": "l2", "characterId": "c2", "characterName": "Lead Actor Rohan", "color": "#db2777", "text": "I can't enter Scene 1 holding a plastic ruler, Esha! The audience will laugh!"},
                {"id": "l3", "characterId": "c3", "characterName": "Prop Master Chhotu", "color": "#d97706", "text": "[Running in out of breath] Found it! It was sitting under the soundboard amplifier!"},
                {"id": "l4", "characterId": "c4", "characterName": "Director Madam", "color": "#635f41", "text": "Quiet backstage! House lights down in 5, 4, 3..."},
                {"id": "l5", "characterId": "c1", "characterName": "Esha", "color": "#7c3aed", "text": "[Whispering into headset] Cue stage left door open! Break a leg, everyone!"}
              ],
              "abstract": "A fast-paced backstage comedy following a stage manager navigating props disasters before opening night.",
              "labels": "Backstage Comedy, Theatre Life",
              "theme": "Chaos & Stage Magic",
              "settingInfo": "Stage Left Wings, 1 Minute to Opening"
            })

        elif s.id == 13 or "Shadow Play" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "An experimental puppetry & verse play telling traditional stories through light and shadow animation."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Esha", "traits": "Master Puppeteer", "color": "#475569"},
                {"id": "c2", "name": "Narrator Kabir", "traits": "Verse Chanter", "color": "#059669"},
                {"id": "c3", "name": "Musician Pandit Ji", "traits": "Sitarist / Soundscape", "color": "#d97706"},
                {"id": "c4", "name": "Shadow Character Ramu", "traits": "Leather Puppet Character", "color": "#8CC0EB"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Esha", "color": "#475569", "text": "Behind this white silk screen, paper shadows dance to ancient verses..."},
                {"id": "l2", "characterId": "c2", "characterName": "Narrator Kabir", "color": "#059669", "text": "Look closely at the shadow, for light without shadow has no story to tell."},
                {"id": "l3", "characterId": "c3", "characterName": "Musician Pandit Ji", "color": "#d97706", "text": "[Sitar melody plays soft raga Raag Bhairavi in background]"},
                {"id": "l4", "characterId": "c4", "characterName": "Shadow Character Ramu", "color": "#8CC0EB", "text": "[Shadow moves across screen] Who calls me from the dark?"},
                {"id": "l5", "characterId": "c1", "characterName": "Esha", "color": "#475569", "text": "The puppeteer's hands move, but the soul belongs to the audience."}
              ],
              "abstract": "An experimental puppetry & verse play telling traditional stories through light and shadow animation.",
              "labels": "Puppetry, Experimental, Folk",
              "theme": "Art & Illusion",
              "settingInfo": "Silk Shadow Screen Stage"
            })

        elif s.id == 14 or "Mudras" in s.title:
            s.pages = 4
            s.roles_count = "4 Characters"
            s.abstract = "A physical theatre exploration of rhythmic mudras, spatial geometry, and synchronized breath."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Samarth", "traits": "Choreographer & Movement Lead", "color": "#059669"},
                {"id": "c2", "name": "Dancer 1 (Fire)", "traits": "Dynamic Movement", "color": "#d97706"},
                {"id": "c3", "name": "Dancer 2 (Water)", "traits": "Fluid Movement", "color": "#8CC0EB"},
                {"id": "c4", "name": "Percussionist", "traits": "Rhythm Pulse", "color": "#635f41"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Samarth", "color": "#059669", "text": "(Movement Cue 1): The ensemble creates a wave motion across the stage floor..."},
                {"id": "l2", "characterId": "c2", "characterName": "Dancer 1 (Fire)", "color": "#d97706", "text": "[Sharp staccato leap towards center stage with Pataka mudra]"},
                {"id": "l3", "characterId": "c3", "characterName": "Dancer 2 (Water)", "color": "#8CC0EB", "text": "[Fluid spin mirroring fire movement in concentric arc]"},
                {"id": "l4", "characterId": "c4", "characterName": "Percussionist", "color": "#635f41", "text": "[Bols: Dha dhin dhin dha, rhythm accelerating]"},
                {"id": "l5", "characterId": "c1", "characterName": "Samarth", "color": "#059669", "text": "(Cue 2): Freeze in trikuta pose! Hold breath for 4 counts."}
              ],
              "abstract": "A physical theatre exploration of rhythmic mudras, spatial geometry, and synchronized breath.",
              "labels": "Physical Theatre, Movement",
              "theme": "Harmony & Rhythm",
              "settingInfo": "Black Box Movement Studio"
            })

        elif s.id == 15 or "Sanskrit" in s.title:
            s.pages = 5
            s.roles_count = "4 Characters"
            s.abstract = "A classical Natyashastra director's notebook detailing ancient Sanskrit verse staging techniques for modern proscenium."
            s.content = json.dumps({
              "characters": [
                {"id": "c1", "name": "Utkarsh (Yuuhi)", "traits": "Sutradhar / Director", "color": "#635f41"},
                {"id": "c2", "name": "Nati", "traits": "Stage Heroine / Co-Director", "color": "#db2777"},
                {"id": "c3", "name": "Vidushak", "traits": "Classical Jester / Foil", "color": "#d97706"},
                {"id": "c4", "name": "Raja Dushyanta", "traits": "Royal Protagonist", "color": "#7c3aed"}
              ],
              "lines": [
                {"id": "l1", "characterId": "c1", "characterName": "Utkarsh (Yuuhi)", "color": "#635f41", "text": "Nandi stotra completes; the Sutradhar steps onto the holy mandala..."},
                {"id": "l2", "characterId": "c2", "characterName": "Nati", "color": "#db2777", "text": "Arya! The audience has assembled. Which play shall we perform tonight?"},
                {"id": "l3", "characterId": "c3", "characterName": "Vidushak", "color": "#d97706", "text": "[Entering with crooked wooden staff] Perform whatever fills the stomach first!"},
                {"id": "l4", "characterId": "c1", "characterName": "Utkarsh (Yuuhi)", "color": "#635f41", "text": "We present Kalidasa's immortal verse under the celestial canopy!"},
                {"id": "l5", "characterId": "c4", "characterName": "Raja Dushyanta", "color": "#7c3aed", "text": "[Enters with royal bow] Where does the wild deer flee in this sacred grove?"}
              ],
              "abstract": "A classical Natyashastra director's notebook detailing ancient Sanskrit verse staging techniques.",
              "labels": "Classical, Sanskrit, Natyashastra",
              "theme": "Dharma & Aesthetics",
              "settingInfo": "Traditional Mandapa Stage"
            })

    db.session.commit()
    print("All 15 scripts successfully updated with clean JSON, 4-5 characters, and detailed storylines!")
