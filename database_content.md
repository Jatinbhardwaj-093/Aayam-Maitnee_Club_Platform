# Database Content Inventory — Aayam IIT Madras BS Drama Society

> **Last Updated**: July 20, 2026  
> **Seed File**: [`backend/seed.py`](file:///Users/jatinbhardwaj/Github/software_project/backend/seed.py)  
> **Gallery Data**: [`backend/seed_gallery_data.py`](file:///Users/jatinbhardwaj/Github/software_project/backend/seed_gallery_data.py)  
> **Models**: [`backend/models.py`](file:///Users/jatinbhardwaj/Github/software_project/backend/models.py)

---

## 1. Roles (7 Roles)

| # | Key | Role Name |
|---|-----|-----------|
| 1 | `maintainer` | Core Maintainer |
| 2 | `director` | Director Coordinator |
| 3 | `sponsor` | Sponsorship & Outreach Lead |
| 4 | `coordinator` | Production Coordinator |
| 5 | `actor` | Lead Actor & Member |
| 6 | `artist` | Design Head |
| 7 | `member` | Member |

---

## 2. Users / Ensemble Members (13 Members)

| # | Name | Email Prefix | Password | Role | Age | City | Bio Summary | Avatar File | Member ID | Pronouns |
|---|------|-------------|----------|------|-----|------|-------------|-------------|-----------|----------|
| 1 | **Abay Nandhiga** | `23f2000668` | abay123 | maintainer | 22 | Chennai | Secretary of Aayam. Directing operations, stagecraft, national festivals. | `abay_nandhiga.jpg` | MC-1001 | he/him |
| 2 | **Yuuhi** | `21f1005042` | utkarsh123 | maintainer | 23 | Chennai | Deputy Secretary. Lead Nukkad Natak performer & stage productions. | `abay_nandhiga.jpg` | MC-1002 | she/her |
| 3 | **Samarth Shrivastava** | `21f1002840` | samarth123 | coordinator | 22 | Chennai | Chief Coordinator. Production logistics, stage design, inter-college fests. | `samarth_shrivastava.jpg` | MC-1003 | he/him |
| 4 | **Krishna Subramanian** | `23f1000655` | krishna123 | coordinator | 21 | Chennai | Dept. Chief Coordinator. DMX lighting, acoustic soundscapes, live cues. | `krishna_subramanian.jpg` | MC-1004 | she/her |
| 5 | **Kaushal Raj** | `22f3003301` | kaushal123 | sponsor | 23 | Bengaluru | Outreach & Sponsorship Head. Corporate partnerships & patron circles. | `sneha_das.jpg` | MC-1005 | he/him |
| 6 | **Sneha Das** | `23f1000100` | sneha123 | artist | 22 | Kolkata | Design Head. Scenic backdrops, prop design, visual brand identity. | `sylene_bansal.jpg` | MC-1006 | she/her |
| 7 | **Anshi Jain** | `23f1000200` | anshi123 | artist | 21 | Jaipur | PR Head. Public relations, media engagement, audience growth. | `chirag_kumar.jpg` | MC-1007 | he/him |
| 8 | **Swati Singh** | `23f1000300` | swati123 | maintainer | 22 | New Delhi | Web Admin & Tech Lead. Digital roster, booking engines, portal infra. | `swati_singh.jpg` | MC-1008 | she/her |
| 9 | **Tanu Kurade** | `21f1005637` | tanu123 | director | 24 | Mumbai | Mentor (Acting). Method acting workshops, dialogue modulation. | `tanu_kurade.jpg` | MC-1009 | he/him |
| 10 | **S. Sri Vaishnavi** | `21f3001698` | vaishnavi123 | director | 24 | Hyderabad | Mentor (Directing). Multi-act plays, script adaptation, blocking. | `vaishnavi_srivastava.jpg` | MC-10010 | she/her |
| 11 | **Esha Hinde** | `esha.hinde` | esha123 | artist | 23 | Pune | Costume & Production Coordinator. Period costume, props, styling. | `esha_hinde.jpg` | MC-10011 | he/him |
| 12 | **Kanishk Mishra** | `kanishk.mishra` | kanishk123 | director | 24 | Delhi | Stage & Technical Director. Acoustics, lighting rigs, set construction. | `kanishk_mishra.jpg` | MC-10012 | she/her |
| 13 | **Aditi** | `aditi.drama` | aditi123 | actor | 22 | Bengaluru | Principal Dramatic Actress. Contemporary stage adaptations & street plays. | `aditi_drama.jpg` | MC-10013 | he/him |

> **Email format**: Prefix starting with `2` → `{prefix}@ds.study.iitm.ac.in`, otherwise → `{prefix}@handle.com`  
> **Shared defaults**: status=`Active`, availability=`Weekday evenings & weekend rehearsals`, level=`Ensemble Leader`, portfolio=`https://sites.google.com/study.iitm.ac.in/aayam/about`

---

## 3. Admins (4 Admins)

| # | User | Designation | Permissions |
|---|------|-------------|-------------|
| 1 | Abay Nandhiga | Secretary Aayam | All |
| 2 | Yuuhi | Deputy Secretary | All |
| 3 | Samarth Shrivastava | Chief Coordinator | Logistics, Stage |
| 4 | Swati Singh | Web Admin & Tech Lead | Portal, DB |

---

## 4. Plays / Productions (6 Plays)

| # | Title | Status | Director | Cast | Venue | Dates | Runtime | Price |
|---|-------|--------|----------|------|-------|-------|---------|-------|
| 1 | **Karn Ki Yachika** | SELLING FAST | S. Sri Vaishnavi | Abay, Yuuhi, Samarth | Kashiyatra Stage, IIT BHU / OAT IIT Madras | Aug 12 – Sep 04, 2026 | 75 min (no intermission) | Free Admission |
| 2 | **Tamashbin Kathputliya** | LIMITED TICKETS | Utkarsh (Yuuhi) | Samarth, Krishna, Swati | Open Air Theatre (OAT), IIT Madras | Sep 12 – Sep 25, 2026 | 45 min (no intermission) | Free Open Stage |
| 3 | **DDDJ – Stage Production** | TICKETS ON SALE | S. Sri Vaishnavi | Abay, Krishna, Sneha | CLT Auditorium, IIT Madras | Sep 28 – Oct 10, 2026 | 85 min (with intermission) | Registration Required |
| 4 | **Samatvam** | TICKETS ON SALE | Tanu Kurade | Abay, Sneha, Anshi | CLT Auditorium, IIT Madras | Oct 05 – Oct 20, 2026 | 90 min (with intermission) | Free Entry |
| 5 | **Speak Up Tara** | SELLING FAST | S. Sri Vaishnavi | Anshi, Sneha, Swati | Kashiyatra Festival Stage, IIT BHU | Nov 02 – Nov 15, 2026 | 60 min (no intermission) | Festival Pass Required |
| 6 | **SNHJ – Virtual Play** | ARCHIVED PLAY | Abay Nandhiga | Aayam Core Ensemble | Aayam YouTube Channel & Portal | Available Online | 50 min | Free Stream |

---

## 5. Events (5 Events)

| # | Title | Category | Venue | Date | Time | Max | Poster | Organizer |
|---|-------|----------|-------|------|------|-----|--------|-----------|
| 1 | Musimprov (with Akord) – Musical Improv Session | Workshops | SAC, IIT Madras | Aug 15, 2026 | 5:00–7:30 PM | 60 | `tamashbin_user_3.jpg` | Abay |
| 2 | Sahitya Sabha – Chit-Chat & Jamming Session | Meetups | Aayam Lounge, IITM | Aug 22, 2026 | 6:00–8:00 PM | 50 | `samatvam_user_4.jpg` | Yuuhi |
| 3 | Theatre Masterclass with Gyaneshwar Mishra | Workshops | CLT Seminar Room, IIT Madras | Sep 10, 2026 | 10:00 AM–2:00 PM | 40 | `kky_user_2.jpg` | Samarth |
| 4 | Darpan 2026 Annual Drama Festival | Plays | OAT & CLT, IIT Madras | Oct 05, 2026 | All Day–10 PM | 300 | `dddj_user_3.jpg` | Abay |
| 5 | Nukkad Natak Guidance Session with Om Bhope | Workshops | OAT Stage Grounds, IIT Madras | Sep 28, 2026 | 4:00–6:30 PM | 45 | `tamashbin_user_4.jpg` | Yuuhi |

---

## 6. Gallery Items (67 Photos)

| Category | Count | Image Files |
|----------|-------|-------------|
| Tamashbin Kathputliya | 15 | `tamashbin_user_1.jpg` → `tamashbin_user_15.jpg` |
| DDDJ | 9 | `dddj_user_1.jpg` → `dddj_user_9.jpg` |
| KKY (Karn Ki Yachika) | 21 | `kky_user_1.jpg` → `kky_user_21.jpg` |
| Samatvam | 12 | `samatvam_user_1.jpg` → `samatvam_user_12.jpg` |
| Speak Up Tara | 10 | `speak_up_tara_user_1.webp` → `speak_up_tara_user_10.webp` |
| **Total** | **67** | |

> All items: `status: "approved"`. Uploaders rotate among: Yuuhi, S. Sri Vaishnavi, Samarth, Krishna, Sneha Das, Abay Nandhiga.

---

## 7. Notifications (52 Total = 13 users × 4 each)

| Type | Title | Message | Read? |
|------|-------|---------|-------|
| `rehearsal` | Macbeth Dress Rehearsal Sync | Technical dress run confirmed for July 07 at 4:00 PM in Rehearsal Hall B. Lighting cues and full costume required. | ❌ |
| `script` | Tamashbin Director's Script Released | The updated Hindustani Street Play script with modified courtyard cues is available in the Script Vault. | ❌ |
| `logistics` | Stage Prop Checked Out | Logistics lead confirmed checkout of gold banquet goblets and throne props for upcoming showcase. | ✅ |
| `workshop` | Natya Shastra Masterclass Pass | Your registration for the upcoming physical theatre masterclass has been confirmed by the executive committee. | ✅ |

---

## 8. Avatar Map (22 Entries + Default Fallback)

The `User.to_dict()` method in `models.py` maps display names to profile images:

| Name | Avatar Path |
|------|-------------|
| Abay Nandhiga | `/aayam_assets/profiles/utkarsh_yuuhi.jpg` |
| Yuuhi | `/aayam_assets/profiles/abay_nandhiga.jpg` |
| Utkarsh / Yuuhi | `/aayam_assets/profiles/abay_nandhiga.jpg` |
| Utkarsh (Yuuhi) | `/aayam_assets/profiles/abay_nandhiga.jpg` |
| Samarth Shrivastava | `/aayam_assets/profiles/samarth_shrivastava.jpg` |
| Krishna Subramanian | `/aayam_assets/profiles/krishna_subramanian.jpg` |
| Harsh Aryan | `/aayam_assets/profiles/harsh_aryan.jpg` |
| Swati Singh | `/aayam_assets/profiles/swati_singh.jpg` |
| Sneha Das | `/aayam_assets/profiles/sylene_bansal.jpg` |
| Tanu Kurade | `/aayam_assets/profiles/tanu_kurade.jpg` |
| S. Sri Vaishnavi | `/aayam_assets/profiles/vaishnavi_srivastava.jpg` |
| Akanksha Kadam | `/aayam_assets/profiles/akanksha_kadam.jpg` |
| Anshi Jain | `/aayam_assets/profiles/chirag_kumar.jpg` |
| Kaushal Raj | `/aayam_assets/profiles/sneha_das.jpg` |
| Vaishnavi Srivastava | `/aayam_assets/profiles/vaishnavi_srivastava.jpg` |
| Gaurav | `/aayam_assets/profiles/chirag_kumar.jpg` |
| Shrit | `/aayam_assets/profiles/harsh_aryan.jpg` |
| Dipanshu Bist | `/aayam_assets/profiles/utkarsh_yuuhi.jpg` |
| Neelotpala | `/aayam_assets/profiles/tanu_kurade.jpg` |
| Kanishk Mishra | `/aayam_assets/profiles/kanishk_mishra.jpg` |
| Chirag Kumar | `/aayam_assets/profiles/chirag_kumar.jpg` |
| Sylene Bansal | `/aayam_assets/profiles/sylene_bansal.jpg` |
| Esha Hinde | `/aayam_assets/profiles/esha_hinde.jpg` |
| Aditi | `/aayam_assets/profiles/aditi_drama.jpg` |

> **Default fallback**: `/aayam_assets/profiles/abay_nandhiga.jpg`

---

## 9. Database Schema — All Model Classes (19 Models + 2 Association Tables)

### Association Tables

| Table | Columns |
|-------|---------|
| `user_roles` | `user_id` (FK→user.id), `role_id` (FK→role.id) |
| `user_labels` | `user_id` (FK→user.id), `label_id` (FK→label.id) |

### Model Classes

| Model | Key Columns |
|-------|-------------|
| **User** | id, member_id, name, age, email (unique), password, address, city, phone, level, status, pronouns, availability, bio, portfolio, emergency_name, emergency_phone, state, country, interest |
| **Role** | id, name |
| **Label** | id, name (unique), color |
| **Admin** | id, user_id (FK), designation, permissions |
| **Play** | id, title, status, status_color, description, director, cast, season, image, venue, dates, runtime, price |
| **Event** | id, title, description, category, venue, event_date, start_time, end_time, max_participants, poster, status, admin_id (FK) |
| **GalleryItem** | id, title, category, image_url, caption, uploaded_at, status, uploader_name |
| **Notification** | id, recipient_id (FK), type, title, message, reference_id, is_read, created_at |
| **Audition** | id, user_id (FK), play_id (FK), audition_date, role_applied_for, experience_notes, status, submitted_at |
| **OpenPosition** | id, play_id (FK), title, category, description, requirements, deadline, status |
| **Membership** | id, membership_type, start_date, end_date, membership_status, user_id (FK) |
| **Booking** | id, booking_date, booking_status, user_id (FK), event_id (FK) |
| **StageBooking** | id, time, period, stage, details, is_secondary, created_at |
| **RevenueMetric** | id, playbill_sold, corporate_patrons, updated_at |
| **ScheduleSlot** | id, user_id (FK), date, day_of_week, start_time, end_time, notes |
| **SharedEvent** | id, submitted_by (FK), title, description, event_date, location_or_link, status, created_at |
| **Announcement** | id, title, content, posted_date, admin_id (FK) |
| **Feedback** | id, rating, comments, user_id (FK), event_id (FK) |
| **Gallery** | id, media_url, media_type, upload_date, event_id (FK) |
| **Volunteer** | id, status, user_id (FK), event_id (FK) |
| **Participation** | id, user_id (FK), event_id (FK), booking_id (FK), registration_date, status, remarks |

---

## 10. Event Listeners (Auto-Notifications)

| Trigger | Action |
|---------|--------|
| **User insert** (status=pending) | Creates `new_member` notification for all admins |
| **Audition insert** | Creates `new_audition` notification for all admins |
| **SharedEvent insert** | Creates `new_event_share` notification for all admins |

---

## 11. Unseeded Tables (14 — Populated at Runtime via Portal)

These models exist in the schema but have **no seed data**. They are populated through the member/maintainer portal:

`OpenPosition`, `Audition`, `Label`, `ScheduleSlot`, `StageBooking`, `RevenueMetric`, `Membership`, `Booking`, `Announcement`, `Feedback`, `Gallery` (event-linked), `SharedEvent`, `Volunteer`, `Participation`

---

## Summary

| Entity | Count |
|--------|-------|
| Roles | 7 |
| Users / Members | 13 |
| Admins | 4 |
| Plays | 6 |
| Events | 5 |
| Gallery Photos | 67 |
| Notifications | 52 |
| Avatar Map Entries | 22 + fallback |
| Model Classes | 19 + 2 association tables |
| Seeded Tables | 7 |
| Unseeded Tables | 14 |
| **Total Seeded Records** | **~154** |
