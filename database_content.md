# Database Content Inventory — Aayam IIT Madras BS Drama Society

> **Last Updated**: August 23, 2026  
> **Seed File**: [`backend/seed.py`](file:///Users/jatinbhardwaj/Github/software_project/backend/seed.py)  
> **Gallery Data**: [`backend/scripts/seed_gallery_data.py`](file:///Users/jatinbhardwaj/Github/software_project/backend/scripts/seed_gallery_data.py)  
> **Models**: [`backend/models.py`](file:///Users/jatinbhardwaj/Github/software_project/backend/models.py)  
> **Database File**: `backend/aayam.db` (SQLite)

---

## 1. Executive Roles (7 Roles)

| # | Role Key | Role Name |
|---|----------|-----------|
| 1 | `maintainer` | Core Maintainer |
| 2 | `director` | Director Coordinator |
| 3 | `sponsor` | Sponsorship & Outreach Lead |
| 4 | `coordinator` | Production Coordinator |
| 5 | `actor` | Lead Actor & Member |
| 6 | `artist` | Design Head |
| 7 | `member` | Member |

---

## 2. Ensemble Members & Mentors (13 Members)

| # | Name | Email Prefix | Role | City | Member ID | Pronouns | Artistic Discipline |
|---|------|--------------|------|------|-----------|----------|---------------------|
| 1 | **Abay Nandhiga** | `23f2000668` | maintainer | Chennai | MC-1001 | he/him | Directing, Playwriting, Society Leadership |
| 2 | **Yuuhi** | `21f1005042` | maintainer | Chennai | MC-1002 | she/her | Street Play, Acting, Script Supervision |
| 3 | **Samarth Shrivastava** | `21f1002840` | coordinator | Chennai | MC-1003 | he/him | Production Logistics, Stage Lighting, Auditions |
| 4 | **Krishna Subramanian** | `23f1000655` | coordinator | Chennai | MC-1004 | she/her | Technical Crew, DMX Lighting, Sound Design |
| 5 | **Kaushal Raj** | `22f3003301` | sponsor | Bengaluru | MC-1005 | he/him | Sponsorship, Corporate Partnerships, Brand Events |
| 6 | **Sneha Das** | `23f1000100` | artist | Kolkata | MC-1006 | she/her | Scenic Design, Set Painting, Poster Design |
| 7 | **Anshi Jain** | `23f1000200` | artist | Jaipur | MC-1007 | he/him | PR Head, Public Relations, Audience Outreach |
| 8 | **Swati Singh** | `23f1000300` | maintainer | New Delhi | MC-1008 | she/her | Web Admin, Digital Roster, Portal Infrastructure |
| 9 | **Tanu Kurade** | `21f1005637` | director | Mumbai | MC-1009 | he/him | Method Acting Workshops, Dialogue Modulation |
| 10 | **S. Sri Vaishnavi** | `21f3001698` | director | Hyderabad | MC-10010 | she/her | Multi-Act Plays, Script Adaptation, Blocking |
| 11 | **Esha Hinde** | `esha.hinde` | artist | Pune | MC-10011 | he/him | Period Costumes, Prop Fabrication, Styling |
| 12 | **Kanishk Mishra** | `kanishk.mishra` | director | Delhi | MC-10012 | she/her | Stage Acoustics, Lighting Rigs, Set Construction |
| 13 | **Aditi** | `aditi.drama` | actor | Bengaluru | MC-10013 | he/him | Principal Dramatic Actress, Monologue Delivery |

> **Email Format**: Numbers (`23f...`) map to `{prefix}@ds.study.iitm.ac.in`, names map to `{prefix}@handle.com`.

---

## 3. Productions & Repertory Plays (6 Productions)

| # | Title | Playwright / Origin | Status | Venue | Cast Size | Runtime |
|---|-------|---------------------|--------|-------|-----------|---------|
| 1 | **Hayavadana** | Girish Karnad | Upcoming Premiere | IC&SR Auditorium | 12 Cast | 110 Mins |
| 2 | **Ashadh Ka Ek Din** | Mohan Rakesh | Upcoming Premiere | CLT Amphitheatre | 9 Cast | 125 Mins |
| 3 | **Charandas Chor** | Habib Tanvir | Upcoming Premiere | Open Air Theatre | 16 Cast | 95 Mins |
| 4 | **Court Martial** | Swadesh Deepak | Past Repository | CLT Amphitheatre | 14 Cast | 105 Mins |
| 5 | **Tughlaq** | Girish Karnad | Past Repository | Student Activity Centre | 18 Cast | 130 Mins |
| 6 | **Andha Yug** | Dharamvir Bharati | Past Repository | Open Air Theatre | 20 Cast | 115 Mins |

---

## 4. Script Vault & Playbooks (11 Rich Canonical Scripts)

| # | Title | Playwright | Acts | Characters | Status |
|---|-------|------------|------|------------|--------|
| 1 | **Dharmakshetra: The Final Soliloquy of Karn** | Abay Nandhiga & Aayam Writing Cell | 3 Acts | 14 Performers | Approved (Pinned) |
| 2 | **Ashadh Ka Ek Din** | Mohan Rakesh | 3 Acts | 9 Performers | Approved (Pinned) |
| 3 | **Hayavadana** | Girish Karnad | 2 Acts | 12 Performers | Approved (Pinned) |
| 4 | **Charandas Chor** | Habib Tanvir & Naya Theatre | 2 Acts | 16 Performers | Approved (Pinned) |
| 5 | **Court Martial** | Swadesh Deepak | 2 Acts | 14 Performers | Approved (Pinned) |
| 6 | **Tughlaq** | Girish Karnad | 13 Scenes | 18 Performers | Approved (Pinned) |
| 7 | **Andha Yug** | Dharamvir Bharati | 5 Acts | 20 Performers | Approved (Pinned) |
| 8 | **Sakharam Binder** | Vijay Tendulkar | 3 Acts | 5 Performers | Approved |
| 9 | **Raktakalyan (Tale Danda)** | Girish Karnad | 3 Acts | 15 Performers | Approved |
| 10 | **Jasma Odan** | Shanta Gandhi | 2 Acts | 14 Performers | Approved |
| 11 | **The Silent Echo** | Aditi | 1 Act | 1 Performer | Pending Review |

---

## 5. Audition Calling Positions & Casting Board (9 Open Positions)

| # | Production | Calling Role | Department | Required Slots | Status |
|---|------------|--------------|------------|----------------|--------|
| 1 | Hayavadana | Lead Protagonists (Devadatta & Kapila) | Performer | 2 Slots | Open Calling |
| 2 | Hayavadana | Mask Craft & Prosthetic SFX Stylist | Creative Designer | 2 Slots | Open Calling |
| 3 | Hayavadana | Proscenium Lighting Master (DMX Cues) | Technical Crew | 2 Slots | Open Calling |
| 4 | Ashadh Ka Ek Din | Kalidas (Poet Laureate) | Performer | 1 Slot | Open Calling |
| 5 | Ashadh Ka Ek Din | Mallika (Sacrificial Muse) | Performer | 1 Slot | Open Calling |
| 6 | Ashadh Ka Ek Din | Period Set & Acoustic Scenographer | Technical Crew | 2 Slots | Open Calling |
| 7 | Charandas Chor | Charandas (The Honest Folk Thief) | Performer | 1 Slot | Open Calling |
| 8 | Charandas Chor | Live Dholak, Harmonium & Folk Chorus | Music & Vocal | 4 Slots | Open Calling |
| 9 | Charandas Chor | Costume Head (Chhattisgarhi Weaves) | Creative Designer | 2 Slots | Open Calling |

---

## 6. Audition Applications & AI Dossiers (6 Submissions)

| # | Applicant | Target Role | Declared Experience | AI Fit Score | Review Status |
|---|-----------|-------------|---------------------|--------------|---------------|
| 1 | **Aditi** (`aditi.drama@handle.com`) | Lead Protagonists (Devadatta & Kapila) | 4 yrs classical stage, voice projection | 94 / 100 | Shortlisted |
| 2 | **Kanishk Mishra** (`kanishk.mishra@handle.com`) | Proscenium Lighting Master | 3 yrs DMX console, CLT stage manager | 96 / 100 | Selected (Cast) |
| 3 | **Yuuhi** (`21f1005042@ds.study.iitm.ac.in`) | Kalidas (Poet Laureate) | 3 yrs street plays, classical Hindi | 92 / 100 | Shortlisted |
| 4 | **Sneha Das** (`23f1000100@ds.study.iitm.ac.in`) | Period Set & Scenographer | Visual artist, set construction head | 95 / 100 | Selected (Cast) |
| 5 | **Samarth Shrivastava** (`21f1002840@ds.study.iitm.ac.in`) | Charandas (Honest Folk Thief) | Lead actor in 4 campus productions | 91 / 100 | Applied (Pending) |
| 6 | **Krishna Subramanian** (`23f1000655@ds.study.iitm.ac.in`) | Live Dholak & Folk Chorus | Classical percussionist, Carnatic rhythm | 97 / 100 | Selected (Cast) |

---

## 7. Production Crew Volunteers (6 Crew Assignments)

| # | Volunteer Name | Play Assignment | Department / Role | Availability | Status |
|---|----------------|-----------------|-------------------|--------------|--------|
| 1 | S. Sri Vaishnavi | Hayavadana | Stage Management & Blocking | 10+ Hrs/Wk | Approved & Assigned |
| 2 | Chirag Kumar | Hayavadana | Sound & Foley Acoustic Loops | 6-8 Hrs/Wk | Approved & Assigned |
| 3 | Swati Singh | Ashadh Ka Ek Din | Costumes & Makeup | 8 Hrs/Wk | Approved & Assigned |
| 4 | Anshi Jain | Ashadh Ka Ek Din | Props & Ancient Set Fabrication | 5-8 Hrs/Wk | Approved & Assigned |
| 5 | Sneha Das | Charandas Chor | Marketing & Ticketing Relations | 5 Hrs/Wk | Pending Review |
| 6 | Kanishk Mishra | Charandas Chor | Lighting & CLT Spotlight Tracking | 8-10 Hrs/Wk | Approved & Assigned |

---

## 8. Financial Ledger & Society Accounts (8 Audited Records)

| # | Transaction Title | Category | Type | Amount | Reference Play |
|---|-------------------|----------|------|--------|----------------|
| 1 | Titan Theatrical Sponsorship | Corporate Sponsorship | Income | +₹1,20,000 | Hayavadana |
| 2 | Hayavadana Ticket Pre-Sales | Box Office Ticket Sales | Income | +₹85,000 | Hayavadana |
| 3 | IITM Student Welfare Drama Grant | Institutional Grant | Income | +₹50,000 | Society Operations |
| 4 | OAT Amphitheatre DMX Lighting Rig | Stage Lighting & Equipment | Expense | -₹35,000 | Charandas Chor |
| 5 | Period Costumes & Chhattisgarhi Weaves | Wardrobe & Costumes | Expense | -₹22,500 | Charandas Chor |
| 6 | Ashadh Ka Ek Din Set Carpentry | Scenic Set Construction | Expense | -₹18,000 | Ashadh Ka Ek Din |
| 7 | Sound Console & Wireless Lapels | Acoustics & Audio Tech | Expense | -₹15,000 | Hayavadana |
| 8 | Darpan Drama Festival Print Materials | Posters & Playbill Printing | Expense | -₹6,500 | All Productions |

* **Total Income**: ₹2,55,000  
* **Total Expenses**: ₹97,000  
* **Net Society Treasury Surplus**: +₹1,58,000

---

## 9. Gallery & Archive Media (60 High-Resolution Assets)

60 curated theatrical production photographs distributed across:
* **Stagecraft & Dramatic Monologues**: 24 items
* **Nukkad Natak & Street Theatre**: 16 items
* **Backstage & Lighting Rigs**: 12 items
* **Workshop Masterclasses**: 8 items

---

## 10. Rehearsal Schedules & Attendance (533 Records)

* **Participation Logs**: 273 individual user rehearsal event allocations.
* **August & September 2026 Time Slots**: 260 confirmed rehearsal slots distributed evenly across all 13 society ensemble members.
