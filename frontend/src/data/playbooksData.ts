// @ts-nocheck
export interface PlaybookCharacter {
  id: string;
  name: string;
  traits: string;
  color?: string;
  role?: string;
}

export interface PlaybookLine {
  id: string;
  characterName: string;
  color?: string;
  text: string;
}

export interface Playbook {
  id: number | string;
  title: string;
  playwright: string;
  genre: string;
  language: string;
  acts: string;
  pages: number;
  rolesCount: string;
  rehearsalFocus: string;
  excerpt: string;
  abstract: string;
  settingInfo: string;
  characters: PlaybookCharacter[];
  lines: PlaybookLine[];
}

export const playbooksRegistry: Playbook[] = [
  {
    id: 1,
    title: "Hayavadana",
    playwright: "Girish Karnad (Adapted by Aayam Guild)",
    genre: "Mythological Folk Drama / Mask Theatre",
    language: "Hindi & English",
    acts: "2 Acts (4 Scenes)",
    pages: 48,
    rolesCount: "10 Performers",
    rehearsalFocus: "Yakshagana Movement, Mask Acting & Choric Synchronization",
    excerpt: "[ACT I, SCENE 2: KALI TEMPLE] DEVADATTA: The intellect seeks perfection, but the flesh demands strength. Whose head rules this heart, Padmini?",
    abstract: "In this seminal masterpiece of modern Indian theatre, two close friends—Devadatta the poet-intellectual and Kapila the blacksmith of immense physical power—fall in love with the radiant Padmini. At the temple of Goddess Kali, a divine miracle transposes their heads onto each other's bodies, triggering an existential crisis of identity, desire, and the quest for completeness.",
    settingInfo: "A sacred Yakshagana proscenium draped in crimson and raw silk. A solitary sculpted stone shrine of Goddess Kali under flickering warm torchlight.",
    characters: [
      { id: "h1", name: "Devadatta", traits: "The intellectual mind, sensitive poet, conflicted scholar", color: "#8C241E", role: "Protagonist" },
      { id: "h2", name: "Kapila", traits: "Physical strength, instinctual dancer, loyal friend", color: "#059669", role: "Protagonist" },
      { id: "h3", name: "Padmini", traits: "Sharp-witted, desiring perfection of mind and form", color: "#db2777", role: "Protagonist" },
      { id: "h4", name: "Bhagavata", traits: "Choral narrator and spiritual master of ceremonies", color: "#475569", role: "Narrator" },
      { id: "h5", name: "Hayavadana", traits: "Man with a horse's head seeking human completeness", color: "#d97706", role: "Supporting" },
      { id: "h6", name: "Goddess Kali", traits: "Sleepy, all-powerful, sardonic deity", color: "#7c3aed", role: "Divine" }
    ],
    lines: [
      { id: "hl1", characterName: "scene-heading", text: "ACT I, SCENE 2: The Temple of Kali. Deep in the Shravan Forest." },
      { id: "hl2", characterName: "stage-note", text: "Red cyclorama wash. Sound of traditional cymbals (Taal) and Yakshagana drums in steady syncopation." },
      { id: "hl3", characterName: "Bhagavata", color: "#475569", text: "Two bodies, one soul. Or two minds trapped in the mirror of friendship? Who shall untangle the knot tied by the Goddess herself?" },
      { id: "hl4", characterName: "Devadatta", color: "#8C241E", text: "My mind was my kingdom, Kapila! With my words I moved the heavens. But looking into Padmini's eyes, I realized that poetry without a warrior's shoulder is only smoke in the wind!" },
      { id: "hl5", characterName: "Kapila", color: "#059669", text: "And what is my iron chest without your words, brother? I can bend iron with my bare hands, yet I cannot speak three sentences that will make her smile!" },
      { id: "hl6", characterName: "Padmini", color: "#db2777", text: "Why must beauty be severed from intellect? Must a woman always choose between the sun that illuminates and the earth that embraces?" },
      { id: "hl7", characterName: "stage-note", text: "Goddess Kali awakens with a long yawn from behind the stone altar, waving a divine sword." },
      { id: "hl8", characterName: "Goddess Kali", color: "#7c3aed", text: "Such noise over mortal clay! Swap the heads, join them back, and take your answers before the morning mist clears!" },
      { id: "hl9", characterName: "stage-note", text: "Darkness falls with a drum roll. In the confusion, Padmini joins Devadatta's head to Kapila's body and Kapila's head to Devadatta's body." },
      { id: "hl10", characterName: "Devadatta", color: "#8C241E", text: "(Looking at his hands) These veins... they pulse with mountain strength! My thoughts have iron fists!" },
      { id: "hl11", characterName: "Kapila", color: "#059669", text: "(Speaking with refined cadence) My limbs feel frail as lotus stems... yet my mind sings verses I never knew existed!" },
      { id: "hl12", characterName: "Bhagavata", color: "#475569", text: "Which is the true man? The head that thinks or the torso that embraces? The stage awaits judgment." }
    ]
  },
  {
    id: 2,
    title: "Ashadh Ka Ek Din",
    playwright: "Mohan Rakesh (Adapted by Aayam Guild)",
    genre: "Classical Poetic Hindi Drama & Historical Tragedy",
    language: "Hindustani & Poetic Verse",
    acts: "3 Acts (6 Scenes)",
    pages: 52,
    rolesCount: "8 Roles",
    rehearsalFocus: "Poetic Enunciation, Subtextual Silence & Emotional Restraint",
    excerpt: "[ACT I: THE MONSOON RETREAT] MALLIKA: Yeh megh kisi ki prateeksha mein nahi baraste, Kalidasa. Tumhein Ujjayini jaana hi hoga!",
    abstract: "Widely acclaimed as the foundational masterpiece of modern Hindi drama. In a remote Himalayan village, poet Kalidasa spends his youth in idyllic love with Mallika. When royal patronage calls him to the imperial court of Ujjayini, Mallika selflessly urges him to leave, setting in motion a heartbreaking trajectory of royal fame, compromise, and creative solitude.",
    settingInfo: "A rustic wooden mountain cottage overlooking rain-drenched pine valleys. Sound of continuous gentle monsoon rain.",
    characters: [
      { id: "a1", name: "Kalidasa", traits: "Genius poet torn between nature and empire", color: "#8C241E", role: "Protagonist" },
      { id: "a2", name: "Mallika", traits: "Selfless muse who sacrifices for art", color: "#db2777", role: "Protagonist" },
      { id: "a3", name: "Vilom", traits: "Cynical realist villager", color: "#475569", role: "Antagonist" },
      { id: "a4", name: "Ambika", traits: "Mallika's weary, pragmatic mother", color: "#d97706", role: "Supporting" },
      { id: "a5", name: "Priyangumanjari", traits: "Imperial princess of Ujjayini and patron", color: "#7c3aed", role: "Supporting" }
    ],
    lines: [
      { id: "al1", characterName: "scene-heading", text: "ACT I, SCENE 1: The Mountain Cottage. The First Day of Ashadh." },
      { id: "al2", characterName: "stage-note", text: "Sound of gentle thunder. Mallika stands near the wooden window holding a wounded fawn in her arms. Kalidasa enters." },
      { id: "al3", characterName: "Kalidasa", color: "#8C241E", text: "Hum ise ghaas khilayenge, Mallika. Dekho, iska shareer kaisa kaanp raha hai." },
      { id: "al4", characterName: "Mallika", color: "#db2777", text: "Ise aanchal mein lapet lo, Kalidasa. Kya Meghdoot ki rachna poori ho gayi?" },
      { id: "al5", characterName: "Kalidasa", color: "#8C241E", text: "Kavita kabhi poori nahi hoti, Mallika. Woh toh manushya ki aatma ka ek anant aalaap hai." },
      { id: "al6", characterName: "Vilom", color: "#475569", text: "(Entering with mocking smile) Kitna mahan tyaag hai! Samrat Chandragupta swayam jis kavi ko Rashtrakavi banana chahte hain, woh yahan baithkar meghon ko nihar raha hai!" },
      { id: "al7", characterName: "Mallika", color: "#db2777", text: "(Stepping forward firmly) Tumhe jaana hoga, Kalidasa. Yeh pahaad chhota hai; tumhara aakash poora Bharatvarsh hai!" },
      { id: "al8", characterName: "Kalidasa", color: "#8C241E", text: "Par Mallika... Tumhare bina meri kavita mein prana kahan se aayenge?" },
      { id: "al9", characterName: "Mallika", color: "#db2777", text: "Main har baraste hue megh mein tumhare saath rahoongi. Jao, Kalidasa... Ujjayini ko apna kavi do!" },
      { id: "al10", characterName: "scene-heading", text: "ACT III, SCENE 2: The Cottage, Years Later. A Cold Wintry Ashadh." },
      { id: "al11", characterName: "Kalidasa", color: "#8C241E", text: "(Voice broken, hair streaked with silver) Maine raj-paat chhod diya, Mallika. Ujjayini ne mujhe sab kuch diya... Par mujhse mera Kalidasa chheen liya!" },
      { id: "al12", characterName: "Mallika", color: "#db2777", text: "Kavita amar hai, Kalidasa. Chahe main rahoon ya na rahoon, tumhara yeh Ashadh hamesha barasta rahega." }
    ]
  },
  {
    id: 3,
    title: "Charandas Chor",
    playwright: "Habib Tanvir (Adapted by Utkarsh Yuuhi)",
    genre: "Chhattisgarhi Folk Musical Satire",
    language: "Hindustani & Folk Dialect",
    acts: "2 Acts (5 Scenes)",
    pages: 42,
    rolesCount: "12 Performers",
    rehearsalFocus: "Live Folk Rhythms, Dholak Cues & Slapstick Satire",
    excerpt: "[ACT II, SCENE 3: ROYAL COURT] CHARANDAS: Rani saheba, chori karna mera pesha hai, par jhooth bolna mere dharam ke viruddh hai!",
    abstract: "Habib Tanvir's legendary folk musical follows Charandas, a master thief with a strict code of ethics. Seeking a blessing from a holy guru, he casually takes four bizarre vows: never to eat from golden plates, never to ride in a royal procession, never to accept a queen's hand, and never to tell a lie. When his honesty earns the love of the Queen, his stubborn refusal to break his word leads to a climactic, tragic standoff with feudal power.",
    settingInfo: "A rustic village market square with bamboo poles, colorful bandhani canopies, and live dholak percussionists on stage.",
    characters: [
      { id: "c1", name: "Charandas", traits: "Charming thief of unbending honesty", color: "#8C241E", role: "Protagonist" },
      { id: "c2", name: "Guru Ji", traits: "Greedy, bewildered rural ascetic", color: "#d97706", role: "Supporting" },
      { id: "c3", name: "The Queen (Rani)", traits: "Proud ruler who cannot accept rejection", color: "#7c3aed", role: "Antagonist" },
      { id: "c4", name: "Havaldar", traits: "Bumbling, corrupt police constable", color: "#059669", role: "Supporting" },
      { id: "c5", name: "Folk Chorus", traits: "Singers and dancers providing satirical commentary", color: "#475569", role: "Chorus" }
    ],
    lines: [
      { id: "ccl1", characterName: "scene-heading", text: "ACT I, SCENE 1: The Hermitage of the Guru. Midday." },
      { id: "ccl2", characterName: "stage-note", text: "Upbeat Dholak groove: DHIN-TA-DHIN-TA. Charandas enters casually eating roasted gram while running from the police." },
      { id: "ccl3", characterName: "Charandas", color: "#8C241E", text: "Babaji! Mujhe koi aisi deeksha de do jisse policewale mere pichhe aana band kar dein!" },
      { id: "ccl4", characterName: "Guru Ji", color: "#d97706", text: "Chori chhod de murkh! Tabhi mukti milegi!" },
      { id: "ccl5", characterName: "Charandas", color: "#8C241E", text: "Babaji, chori toh mera khandani dhandha hai. Usko chhod diya toh khaoonga kya? Haan, agar aap bolo toh main chaar aise niyam le sakta hoon jo mere kisi kaam ke nahi!" },
      { id: "ccl6", characterName: "Guru Ji", color: "#d97706", text: "Kaunse niyam?" },
      { id: "ccl7", characterName: "Charandas", color: "#8C241E", text: "Pehla: Sone ki thaali mein khana nahi khaoonga. Doosra: Haathi ki sawari par shobhayatra nahi nikalunga. Teesra: Kisi rajya ka singhasan aur rani ka haath nahi loonga. Aur chautha... hamesha sach boloonga!" },
      { id: "ccl8", characterName: "scene-heading", text: "ACT II, SCENE 4: The Royal Treasury & Throne Room." },
      { id: "ccl9", characterName: "The Queen (Rani)", color: "#7c3aed", text: "Tumne mere khazane se ek katora chura kar bhi sabha mein sach bol diya? Charandas, main tumse vivah karke tumhe is rajya ka raja banana chahti hoon!" },
      { id: "ccl10", characterName: "Charandas", color: "#8C241E", text: "Kshama karein Rani saheba! Maine apne Guru ko vachan diya tha ki main singhasan aur rani ka haath kabhi nahi loonga!" },
      { id: "ccl11", characterName: "The Queen (Rani)", color: "#7c3aed", text: "(Furious) Ek chor ek rani ko thukrayega? Agar yeh baat bahar nikli toh mera rajya hans padega! Ya toh vivah karo, ya maut ko gale lagao!" },
      { id: "ccl12", characterName: "Charandas", color: "#8C241E", text: "Maut manzoor hai Rani saheba, par sachai ka vachan nahi tootega!" }
    ]
  },
  {
    id: 4,
    title: "Karn Ki Yachika",
    playwright: "Classical Ensemble (Adapted by Abay Nandhiga)",
    genre: "Epic Mythological Tragedy",
    language: "Classical Hindi & Sanskritized Verse",
    acts: "3 Acts (6 Scenes)",
    pages: 56,
    rolesCount: "14 Performers",
    rehearsalFocus: "Verse Recitation, Emotional Monologues & Dramatic Pauses",
    excerpt: "[ACT III, SCENE 2: KURUKSHETRA DUSK] KARN: Daanveer kehkar tumne mujhe jeeta, Keshav! Par ranbhoomi mein shastra-heen karke dharam ka paath kise sikha rahe ho?",
    abstract: "On the seventeenth day of the great Kurukshetra war, Karn's chariot wheel sinks into the mud. When Krishna commands Arjuna to shoot the weaponless warrior, Karn delivers an unforgettable defense of duty, friendship, and moral dignity.",
    settingInfo: "Kurukshetra battlefield under a blood-amber twilight sky. A fractured gilded chariot wheel half-sunken in mud.",
    characters: [
      { id: "k1", name: "Karn", traits: "Tragic warrior, undefeated in spirit", color: "#8C241E", role: "Protagonist" },
      { id: "k2", name: "Krishna", traits: "Divine executor of cosmic order", color: "#2563eb", role: "Supporting" },
      { id: "k3", name: "Arjuna", traits: "Conflicted archer", color: "#059669", role: "Rival" },
      { id: "k4", name: "Kunti", traits: "Grief-stricken mother", color: "#7c3aed", role: "Supporting" }
    ],
    lines: [
      { id: "kl1", characterName: "scene-heading", text: "ACT III, SCENE 2: The Fall of the Sun. Kurukshetra at Dusk." },
      { id: "kl2", characterName: "stage-note", text: "Deep amber side-lighting. War conches echo in the distance." },
      { id: "kl3", characterName: "Karn", color: "#8C241E", text: "Ruk gaye na mere pahiye bhi, Keshav? Jaise Gurukul ke dwaar par meri yogyata par samaj ka krodh ruk gaya tha?" },
      { id: "kl4", characterName: "Krishna", color: "#2563eb", text: "Pahiya mitti mein nahi phasa Radheya, tumhare nishtha ke bandhan mein phasa hai." },
      { id: "kl5", characterName: "Karn", color: "#8C241E", text: "Duryodhana ne meri jaati nahi, meri aatma dekhi thi! Teer chalao Partha, Karn maut ke samne bhi seena taan kar khada rahega!" }
    ]
  },
  {
    id: 5,
    title: "Tamashbin Kathputliya",
    playwright: "Utkarsh (Yuuhi) & Aayam Collective",
    genre: "Street Theatre (Nukkad Natak)",
    language: "Hindustani & Folk Dialect",
    acts: "1 Act (3 Scenes)",
    pages: 28,
    rolesCount: "12 Performers",
    rehearsalFocus: "Choral Chants, Dholak Beat Sync & High Vocal Projection",
    excerpt: "[SCENE 1: OAT COURTYARD] SUTRADHAR: Suno suno hey aam nagrik! Aaj hum laye hain Tamashbin Kathputliya!",
    abstract: "A high-energy satire exploring how modern social media and digital bystander culture reduce vibrant citizens into mechanical puppets controlled by unseen algorithms.",
    settingInfo: "An open circle on campus pavement with four dholak drummers and yellow prop ribbons.",
    characters: [
      { id: "t1", name: "Sutradhar", traits: "High-octane narrator", color: "#8C241E", role: "Protagonist" },
      { id: "t2", name: "Digital Netizen", traits: "Addicted to live streams", color: "#059669", role: "Supporting" },
      { id: "t3", name: "Activist", traits: "Demanding truth and action", color: "#d97706", role: "Supporting" }
    ],
    lines: [
      { id: "tl1", characterName: "scene-heading", text: "SCENE 1: The Ring of Spectators. High-tempo Dholak rhythm." },
      { id: "tl2", characterName: "stage-note", text: "Rhythmic beat: DHA-TIN-TIN-TA! Ensemble enters in a tight synchronized spiral." },
      { id: "tl3", characterName: "Sutradhar", color: "#8C241E", text: "Suno suno hey Bharat ke logo! Aaj Aayam laya hai ek aisi daastan jo aapki aankhein khol degi!" },
      { id: "tl4", characterName: "Digital Netizen", color: "#059669", text: "Ruko! Pehle is natak ki live reel bana loon, viral ho jayegi!" },
      { id: "tl5", characterName: "Sutradhar", color: "#8C241E", text: "Kab todoge in doro ko? Kab banoge asli insaan?" }
    ]
  },
  {
    id: 6,
    title: "DDDJ - Stage Production",
    playwright: "Original Society Playwrights",
    genre: "High-Tension Proscenium Drama",
    language: "Hindi & English",
    acts: "2 Acts (4 Scenes)",
    pages: 44,
    rolesCount: "8 Roles",
    rehearsalFocus: "Dialogue Intensity, Subtext & Blocking Dynamics",
    excerpt: "[ACT I, SCENE 2: THE MIDNIGHT DRAFT] VIKRAM: Three years of silence, and you expect a standing ovation?",
    abstract: "Set in a backstage drama rehearsal room 72 hours before the inter-collegiate finals, DDDJ unravels the explosive conflict between an uncompromising visionary director and his ensemble.",
    settingInfo: "A black box stage with a single hanging halogen lamp and scattered script sheets.",
    characters: [
      { id: "d1", name: "Vikram", traits: "Perfectionist director", color: "#8C241E", role: "Protagonist" },
      { id: "d2", name: "Ananya", traits: "Lead actress seeking authentic voice", color: "#db2777", role: "Protagonist" },
      { id: "d3", name: "Kabir", traits: "Stage manager maintaining calm", color: "#2563eb", role: "Supporting" }
    ],
    lines: [
      { id: "dl1", characterName: "scene-heading", text: "ACT I, SCENE 2: The Midnight Rehearsal. CLT Stage." },
      { id: "dl2", characterName: "Vikram", color: "#8C241E", text: "Three years of total radio silence, Ananya. And you expect me to rewrite the third act because the motivation was ambiguous?" },
      { id: "dl3", characterName: "Ananya", color: "#db2777", text: "I didn't say it was ambiguous, Vikram. I said it was a lie. You wrote a monologue that flatters your own guilt!" }
    ]
  },
  {
    id: 7,
    title: "Samatvam",
    playwright: "Aayam Physical Theatre Lab",
    genre: "Physical Theatre & Navarasa Movement",
    language: "Bilingual / Physical Expression",
    acts: "1 Act (Rhythmic Movement Sequence)",
    pages: 24,
    rolesCount: "10 Performers",
    rehearsalFocus: "Navarasa Facial Expression, Floor Stride & Choral Respiration",
    excerpt: "[SEQUENCE 3: THE EQUILIBRIUM] CHORUS: In the noise of modern ambition, who remembers the stillness of the breath?",
    abstract: "An intense ensemble exploration of balance, inner conflict, and human empathy in high-pressure academic societies.",
    settingInfo: "Bare wooden floor under deep indigo and amber spotlights. No props except white ribbons.",
    characters: [
      { id: "s1", name: "The Core Seeker", traits: "Striving for inner stillness", color: "#8C241E", role: "Protagonist" },
      { id: "s2", name: "The Chorus of Pressure", traits: "Embodying academic race and deadlines", color: "#475569", role: "Chorus" }
    ],
    lines: [
      { id: "sl1", characterName: "scene-heading", text: "SEQUENCE 2: The Collision of Navarasas." },
      { id: "sl2", characterName: "stage-note", text: "The ensemble breathes in unison: INHALE... EXHALE. Bodies form a living human wheel." },
      { id: "sl3", characterName: "The Core Seeker", color: "#8C241E", text: "Balance is not standing still while the storm passes. Balance is becoming the eye of the storm itself." }
    ]
  },
  {
    id: 8,
    title: "Speak Up Tara",
    playwright: "S. Sri Vaishnavi & Writing Cell",
    genre: "Social Realism Drama",
    language: "Hindi",
    acts: "2 Acts (6 Scenes)",
    pages: 36,
    rolesCount: "7 Roles",
    rehearsalFocus: "Vocal Modulation, Realistic Pacing & Emotive Monologues",
    excerpt: "[ACT II, SCENE 1: THE LECTURE HALL] TARA: If silence was peace, the graveyard would be the happiest place on earth!",
    abstract: "A powerful social drama following Tara, a collegiate student who breaks institutional silence to champion equality and student welfare.",
    settingInfo: "A college classroom that transforms under sharp spotlighting into a courtroom of public opinion.",
    characters: [
      { id: "st1", name: "Tara", traits: "Courageous student leader", color: "#8C241E", role: "Protagonist" },
      { id: "st2", name: "Professor Verma", traits: "Traditionalist academic dean", color: "#475569", role: "Antagonist" }
    ],
    lines: [
      { id: "stl1", characterName: "scene-heading", text: "ACT II, SCENE 1: The Auditorium Podium." },
      { id: "stl2", characterName: "Tara", color: "#8C241E", text: "Aap kehte hain chup raho, shanti bani rahegi. Par jahan nyay nahi hota, wahan ki shanti kewal kayarta ka doosra naam hai!" }
    ]
  },
  {
    id: 9,
    title: "SNHJ - Virtual Play",
    playwright: "Digital Theatre Collective",
    genre: "Digital Experimental Theatre",
    language: "Hindi & English",
    acts: "1 Act (Multi-Screen Play)",
    pages: 30,
    rolesCount: "6 Performers",
    rehearsalFocus: "Camera Gaze, Frame Blocking & Subtle Vocal Micro-inflections",
    excerpt: "[SCREEN 3: 02:00 AM] ARJUN: We are connected by a thousand fibers of glass, yet no one hears the echo in this room.",
    abstract: "Aayam's groundbreaking virtual production exploring screen fatigue, isolation, and remote human connection across digital networks.",
    settingInfo: "A 4-way split video window with ambient blue backlight and mechanical keyboard clicks.",
    characters: [
      { id: "sn1", name: "Arjun", traits: "Night owl coder seeking connection", color: "#2563eb", role: "Protagonist" },
      { id: "sn2", name: "Meera", traits: "Visual designer in another time zone", color: "#db2777", role: "Protagonist" }
    ],
    lines: [
      { id: "snl1", characterName: "scene-heading", text: "WINDOW 1: The Midnight Stream." },
      { id: "snl2", characterName: "Arjun", color: "#2563eb", text: "You can mute the microphone, Meera, but the screen still reflects your silence." }
    ]
  }
];

export function getPlaybookForTitle(title: string): Playbook {
  const query = (title || "").toLowerCase();
  const found = playbooksRegistry.find(p => 
    query.includes(p.title.toLowerCase()) || 
    p.title.toLowerCase().includes(query) ||
    (query.includes("karn") && p.title.toLowerCase().includes("karn")) ||
    (query.includes("ashadh") && p.title.toLowerCase().includes("ashadh")) ||
    (query.includes("hayavadana") && p.title.toLowerCase().includes("hayavadana")) ||
    (query.includes("charandas") && p.title.toLowerCase().includes("charandas")) ||
    (query.includes("tamashbin") && p.title.toLowerCase().includes("tamashbin")) ||
    (query.includes("dddj") && p.title.toLowerCase().includes("dddj")) ||
    (query.includes("samatvam") && p.title.toLowerCase().includes("samatvam")) ||
    (query.includes("tara") && p.title.toLowerCase().includes("tara")) ||
    (query.includes("snhj") && p.title.toLowerCase().includes("snhj"))
  );

  if (found) return found;

  // Generic fallback playbook
  return {
    id: 99,
    title: title || "Aayam Repertory Playbook",
    playwright: "Aayam Theatre Guild",
    genre: "Classical Stage Drama",
    language: "Hindi & English",
    acts: "2 Acts (4 Scenes)",
    pages: 40,
    rolesCount: "8 Performers",
    rehearsalFocus: "Stage Blocking, Dialogue Pacing & Ensemble Sync",
    excerpt: `[ACT I, SCENE 1] Ensemble takes center stage under warm amber spotlights.`,
    abstract: `Official performance playbook for ${title}. Preserved in the Aayam Society Repertory Archive.`,
    settingInfo: "Central Lecture Theatre Main Stage with warm theatrical footlights.",
    characters: [
      { id: "gen-1", name: "Lead Performer", traits: "Ensemble lead with vocal projection", color: "#8C241E", role: "Protagonist" },
      { id: "gen-2", name: "Sutradhar", traits: "Dramatic narrator", color: "#475569", role: "Narrator" }
    ],
    lines: [
      { id: "gen-l1", characterName: "scene-heading", text: `ACT I, SCENE 1: Opening Night of ${title}.` },
      { id: "gen-l2", characterName: "stage-note", text: "Curtains open to gentle flute melodies and stage mist." },
      { id: "gen-l3", characterName: "Sutradhar", color: "#475569", text: `Welcome to the stage of ${title}. Here the words of the playwright meet the breath of the actors.` },
      { id: "gen-l4", characterName: "Lead Performer", color: "#8C241E", text: "The spotlight belongs to truth. Let the play begin!" }
    ]
  };
}
