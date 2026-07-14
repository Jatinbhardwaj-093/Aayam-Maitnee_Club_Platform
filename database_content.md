# AAYAM Hub — Database Content Summary

This document presents the actual seeded data currently stored inside the SQLite database (`aayam.db`), covering the ensemble members, plays, and workshops/events.

---

## 👥 1. Ensemble Members (`user` & `role` tables)

Here are the 10 members currently registered in the database, along with their roles, contact details, and locations.

| ID | Name | Email / ID | Default Password | Primary Role | Phone | City, State |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `MC-1001` | **Sneha Vyas** | `sneha@handle.com` | `sneha123` | Director Coordinator | `+91 98765 33333` | Mumbai, Maharashtra |
| `MC-1002` | **Kabir Mehta** | `kabir@handle.com` | `kabir123` | Core Maintainer | `+91 98765 88888` | New Delhi, Delhi |
| `MC-1003` | **Lakshya Hari** | `lakshya@handle.com` | `lakshya123` | Grand Patron & Sponsor | `+91 98765 99999` | Bengaluru, Karnataka |
| `MC-1004` | **Siddharth Verma** | `siddharth@handle.com` | `siddharth123` | Production Coordinator | `+91 98765 77777` | Pune, Maharashtra |
| `MC-1005` | **Jayesh Dave** | `jayesh@handle.com` | `jayesh123` | Lead Actor & Member | `+91 98765 43210` | Ahmedabad, Gujarat |
| `MC-1006` | **Amit Sharma** | `amit@handle.com` | `amit123` | Lead Actor & Member | `+91 98765 22222` | Lucknow, Uttar Pradesh |
| `MC-1007` | **Pooja Patel** | `pooja@handle.com` | `pooja123` | Scenic Artist | `+91 98765 11111` | Jaipur, Rajasthan |
| `MC-1008` | **Rohan Sen** | `rohan@handle.com` | `rohan123` | Choreographer | `+91 98765 00000` | Kolkata, West Bengal |
| `MC-1009` | **Priya Nair** | `priya@handle.com` | `priya123` | Member | `+91 98765 55555` | Kochi, Kerala |
| `MC-1010` | **Arjun Kapoor** | `arjun@handle.com` | `arjun123` | Member | `+91 98765 66666` | Navi Mumbai, Maharashtra |

### 👥 1.1 Admin Accounts (`admin` table)

These are the 6 users promoted to Admin status, managing schedules, casting, backstage, designs, and systems.

| User | Designation | Permissions | Managed Areas |
| :--- | :--- | :--- | :--- |
| **Sneha Vyas** | Director Coordinator | `All` | Complete platform control, play runs, scheduling |
| **Kabir Mehta** | Core Maintainer | `All` | System configurations, server health, API access |
| **Siddharth Verma** | Production Coordinator | `Backstage, Lights, Props` | Rehearsals, stage resources, safety checklists |
| **Amit Sharma** | Lead Actor & Casting Director | `Casting, Auditions` | Member auditions, review applicant profiles |
| **Rohan Sen** | Choreographer & Stage Manager | `Backstage, Choreography` | Technical rehearsals, scene blocks, dance routines |
| **Pooja Patel** | Scenic Art Lead | `Props, Design` | Prop list audit, scenic design layout controls |

---

## 🎭 2. Theatrical Productions (`play` table)

These are the 7 active stage plays currently staged in the season, representing different styles and regional origins.

| Title | Director | Staging Venue | Date Run | Runtime | Ticket Price | Lead Cast |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Tughlaq** | Sneha Vyas | Prithvi Theatre, Mumbai | Aug 12 - Sep 04, 2026 | 120 Mins | Tickets from ₹300 | Jayesh Dave, Amit Sharma, Pooja Patel |
| **Andha Yug** | Sneha Vyas | Kamani Auditorium, Delhi | Sep 15 - Oct 02, 2026 | 110 Mins | Tickets from ₹250 | Amit Sharma, Rohan Sen, Jayesh Dave |
| **Hayavadana** | Kabir Mehta | Ranga Shankar, Bengaluru | Oct 10 - Oct 28, 2026 | 100 Mins | Tickets from ₹350 | Priya Nair, Arjun Kapoor, Jayesh Dave |
| **Charandas Chor** | Rohan Sen | Shree Ram Centre, New Delhi | Oct 05 - Oct 18, 2026 | 115 Mins | Tickets from ₹200 | Jayesh Dave, Priya Nair, Arjun Kapoor |
| **Ebong Indrajit** | Kabir Mehta | Academy of Fine Arts, Kolkata | Nov 10 - Nov 25, 2026 | 90 Mins | Tickets from ₹150 | Arjun Kapoor, Priya Nair, Amit Sharma |
| **Sakharam Binder** | Sneha Vyas | Bal Gandharva Rang Mandir, Pune | Dec 01 - Dec 15, 2026 | 130 Mins | Tickets from ₹250 | Jayesh Dave, Priya Nair, Rohan Sen |
| **Karnabhari** | Siddharth Verma | Fine Arts Hall, Kochi | Dec 20 - Dec 30, 2026 | 80 Mins | Tickets from ₹300 | Amit Sharma, Rohan Sen, Jayesh Dave |

---

## 📅 3. Scheduled Events & Workshops (`event` table)

These are the 9 scheduled events, including acting workshops, rehearsal showcases, and regional playwright meetups.

| Event Title | Category | Venue | Date | Time | Capacity | Facilitator / Host |
| :--- | :--- | :--- | :--- | :--- | :---: | :--- |
| **Tughlaq Premiere** | Plays | Prithvi Theatre, Mumbai | Aug 12, 2026 | 19:30 - 21:30 | 200 | Sneha Vyas |
| **Natya Shastra Acting Workshop** | Workshops | Studio Workshop Room, Mumbai | Aug 19, 2026 | 10:00 - 13:00 | 20 | Sneha Vyas |
| **Chai & Playwriting Meetup** | Meetups | Ensemble Lounge, Ahmedabad | Aug 30, 2026 | 16:00 - 18:00 | 50 | Kabir Mehta |
| **Andha Yug Rehearsal Showcase** | Plays | Kamani Auditorium, Delhi | Jul 01, 2026 | 17:00 - 19:30 | 150 | Sneha Vyas |
| **Sufi Music & Movement Masterclass** | Workshops | Ranga Shankara Studio, Bengaluru | Sep 05, 2026 | 14:00 - 17:00 | 25 | Siddharth Verma |
| **Yakshagana Physical Theatre Intensive** | Workshops | Ranga Shankara Studio, Bengaluru | Oct 15, 2026 | 09:00 - 12:00 | 30 | Kabir Mehta |
| **Habib Tanvir Folk Satire Discussion** | Meetups | Shree Ram Centre, New Delhi | Oct 08, 2026 | 17:30 - 19:30 | 80 | Siddharth Verma |
| **Badal Sircar Third Theatre Workshop** | Workshops | Academy of Fine Arts, Kolkata | Nov 14, 2026 | 14:00 - 17:00 | 40 | Kabir Mehta |
| **Marathi Realistic Drama Panel** | Meetups | Bal Gandharva Rang Mandir, Pune | Dec 05, 2026 | 18:00 - 20:00 | 100 | Sneha Vyas |
