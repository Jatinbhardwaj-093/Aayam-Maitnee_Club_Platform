# AAYAM Hub — Database Schema & Data Dictionary

This document outlines the SQLite database structure (`aayam.db`) powering the AAYAM Hub and Matinee Club backend. It includes the complete schema design, table definitions, relationships, and a summary of the authentic seeded data from the Aayam Drama Society (IIT Madras BS).

---

## 📊 Entity Relationship Diagram

The following Mermaid diagram visualizes the tables and relationships defined in [models.py](file:///Users/jatinbhardwaj/Github/software_project/backend/models.py).

```mermaid
erDiagram
    user {
        int id PK
        string member_id UNIQUE
        string name
        string email UNIQUE
        string password
        string phone
        string age
        string address
        string city
        string state
        string country
        string pronouns
        string availability
        text bio
        string portfolio
        string interest
        string level
        string status
        string emergency_name
        string emergency_phone
    }
    role {
        int id PK
        string name
    }
    label {
        int id PK
        string name
        string color
    }
    user_roles {
        int user_id FK
        int role_id FK
    }
    user_labels {
        int user_id FK
        int label_id FK
    }
    admin {
        int id PK
        int user_id FK
        string designation
        text permissions
    }
    membership {
        int id PK
        int user_id FK
        string membership_type
        date start_date
        date end_date
        string membership_status
    }
    play {
        int id PK
        string title
        string status
        string status_color
        text description
        string director
        string cast
        string season
        string image
        string venue
        string dates
        string runtime
        string price
    }
    open_position {
        int id PK
        int play_id FK
        string title
        string category
        text description
        string requirements
        date deadline
        string status
    }
    event {
        int id PK
        int admin_id FK
        string title
        text description
        string category
        string venue
        date event_date
        time start_time
        time end_time
        int max_participants
        string poster
        string status
    }
    booking {
        int id PK
        int user_id FK
        int event_id FK
        datetime booking_date
        string booking_status
    }
    announcement {
        int id PK
        int admin_id FK
        string title
        text content
        datetime posted_date
    }
    feedback {
        int id PK
        int user_id FK
        int event_id FK
        int rating
        text comments
    }
    gallery {
        int id PK
        int event_id FK
        string media_url
        string media_type
        datetime upload_date
    }
    gallery_item {
        int id PK
        string title
        string category
        text image_url
        text caption
        datetime uploaded_at
        string status
        string uploader_name
    }
    schedule_slot {
        int id PK
        int user_id FK
        date date
        string day_of_week
        time start_time
        time end_time
        string notes
    }
    audition {
        int id PK
        int user_id FK
        int play_id FK
        datetime audition_date
        string role_applied_for
        text experience_notes
        string status
        datetime submitted_at
    }
    shared_event {
        int id PK
        int submitted_by FK
        string title
        text description
        datetime event_date
        string location_or_link
        string status
        datetime created_at
    }
    notification {
        int id PK
        int recipient_id FK
        string type
        int reference_id
        boolean is_read
        datetime created_at
    }
    volunteer {
        int id PK
        int user_id FK
        int event_id FK
        string status
    }
    participation {
        int id PK
        int user_id FK
        int event_id FK
        int booking_id FK
        datetime registration_date
        string status
        string remarks
    }
    stage_booking {
        int id PK
        string time
        string period
        string stage
        string details
        boolean is_secondary
        datetime created_at
    }
    revenue_metric {
        int id PK
        int playbill_sold
        int corporate_patrons
        datetime updated_at
    }

    user ||--o{ user_roles : "has"
    role ||--o{ user_roles : "has"
    user ||--o{ user_labels : "tagged with"
    label ||--o{ user_labels : "applied to"
    user ||--o| admin : "acts as"
    user ||--o| membership : "holds"
    user ||--o{ booking : "makes"
    user ||--o{ feedback : "submits"
    user ||--o{ notification : "receives"
    user ||--o{ volunteer : "offers to help"
    user ||--o{ participation : "joins"
    user ||--o{ schedule_slot : "has rehearsal slots"
    user ||--o{ audition : "applies for"
    user ||--o{ shared_event : "proposes"
    
    play ||--o{ open_position : "offers casting positions"
    play ||--o{ audition : "receives auditions"
    
    admin ||--o{ event : "moderates"
    admin ||--o{ announcement : "posts"
    
    event ||--o{ booking : "has registrations"
    event ||--o{ feedback : "receives reviews"
    event ||--o{ gallery : "exhibits media"
    event ||--o{ volunteer : "has helpers"
    event ||--o{ participation : "tracks attendance"
    
    booking ||--o| participation : "guarantees"
```

---

## 🗂️ Data Dictionary

### 1. `user`
Stores member profiles, contact info, emergency details, local profile images, and login credentials.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique user record identifier. |
| `member_id` | VARCHAR(50) | UNIQUE, NULLABLE | Public club membership token (e.g. `MC-1001`). |
| `name` | VARCHAR(150) | NOT NULL | User's full name. |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | Primary email (e.g., `23f2000668@ds.study.iitm.ac.in`). |
| `password` | VARCHAR(512) | NOT NULL | Securely hashed password credential. |
| `phone` | VARCHAR(20) | NULLABLE | Primary phone number (with country code). |
| `age` | VARCHAR(20) | NULLABLE | Age. |
| `address` | VARCHAR(255) | NULLABLE | Residential or campus address. |
| `city` | VARCHAR(100) | NULLABLE | City (e.g. Chennai, Mumbai, Pune). |
| `state` | VARCHAR(100) | NULLABLE | State. |
| `country` | VARCHAR(100) | NULLABLE | Country (default: India). |
| `pronouns` | VARCHAR(50) | NULLABLE | Pronouns preference. |
| `availability`| VARCHAR(100) | NULLABLE | Rehearsal/performance availability. |
| `bio` | TEXT | NULLABLE | Professional summary or theatrical journey. |
| `portfolio` | VARCHAR(200) | NULLABLE | Links to external portfolio or Google site. |
| `interest` | VARCHAR(100) | NULLABLE | Theatrical areas of interest. |
| `level` | VARCHAR(50) | NULLABLE | Experience level classification (e.g., Ensemble Leader). |
| `status` | VARCHAR(20) | DEFAULT 'Active' | Member status (Active, On Break, Pending). |
| `emergency_name` | VARCHAR(100)| NULLABLE | Emergency contact person name. |
| `emergency_phone`| VARCHAR(20) | NULLABLE | Emergency contact phone number. |

### 2. `role` & `user_roles`
Defines permission tags in the Aayam Drama Society.

* **`role` Table:**
  * `id` (INTEGER, PK)
  * `name` (VARCHAR(100), NOT NULL) — e.g. `Core Maintainer`, `Production Coordinator`, `Outreach & Sponsorship Head`, `Mentor (Directing)`, `Design Head`.
* **`user_roles` Table (Association):**
  * `user_id` (INTEGER, FK -> `user.id`, PK)
  * `role_id` (INTEGER, FK -> `role.id`, PK)

### 3. `play` & `open_position`
Details the active theatrical productions staged by Aayam.

* **`play` Table:**
  * `id` (INTEGER, PK)
  * `title` (VARCHAR(150), NOT NULL) — e.g. *Tamashbin Kathputliya*, *DDDJ*, *Karn Ki Yachika*, *Samatvam*, *Speak Up Tara*.
  * `status` (VARCHAR(50)) — Ticket status (e.g. `FEATURED MATINEE`, `SELLING FAST`).
  * `status_color` (VARCHAR(100)) — Color utility badge style.
  * `description` (TEXT) — Detailed play synopsis.
  * `director` (VARCHAR(150)) — Lead director.
  * `cast` (VARCHAR(255)) — Featured ensemble performers.
  * `season` (VARCHAR(100)) — Season name (e.g. `2024-2025 Lineage`).
  * `image` (VARCHAR(255)) — Authentic photo path under `/aayam_assets/`.
  * `venue` (VARCHAR(100)) — Performance venue (e.g., `OAT IIT Madras`).

* **`open_position` Table:**
  * `id` (INTEGER, PK)
  * `play_id` (INTEGER, FK -> `play.id`) — Associated play.
  * `title` (VARCHAR(150)) — Position title (e.g., `Female Lead - Tara`).
  * `category` (VARCHAR(100)) — Category (`Acting`, `Crew`, `Directing`).
  * `requirements` (VARCHAR(255)) — Casting requirements.

### 4. `gallery_item`
Maintains the authentic production photo library (60+ items).

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY | Unique media record identifier. |
| `title` | VARCHAR(200) | NOT NULL | Descriptive theatrical title. |
| `category` | VARCHAR(100) | DEFAULT 'Stage Plays' | Play folder category (Tamashbin Kathputliya, DDDJ, KKY, Samatvam, Speak Up Tara). |
| `image_url` | TEXT | NOT NULL | Path to image (e.g. `/aayam_assets/tamashbin_user_1.jpg`). |
| `caption` | TEXT | NULLABLE | Production scene caption. |
| `uploaded_at` | DATETIME | DEFAULT UTC | Upload timestamp. |
| `status` | VARCHAR(50) | DEFAULT 'approved' | Approval status. |
| `uploader_name`| VARCHAR(100)| DEFAULT 'Aayam Media Team' | Credit attribution. |

---

## 🗃️ Seeding Statistics (Current Status)

The database is seeded with authentic data from the **Aayam (IIT Madras BS Drama Society)** 2024-2025 ensemble:

| Metric | Count | Highlighted Data |
| :--- | :---: | :--- |
| **Ensemble Members** | 21 | Abay Nandhiga (Secretary), Yuuhi (Deputy Secretary), Samarth Shrivastava (Chief Coordinator), Krishna Subramanian (Dept. Chief Coordinator), Harsh Aryan (Tech Lead), Swati Singh (Content Head), Sneha Das (Design Head), Tanu Kurade, S. Sri Vaishnavi, Akanksha Kadam, Anshi Jain, Kaushal Raj, Esha Hinde, Kanishk Mishra, Aditi. |
| **Maintainers / Admins** | 4 | Abay Nandhiga, Yuuhi, Samarth Shrivastava, Swati Singh. |
| **Active Staged Plays** | 5 | *Tamashbin Kathputliya* (Street Play), *DDDJ* (Dramatic Showcase), *Karn Ki Yachika* (Classical Drama), *Samatvam* (Physical Movement), *Speak Up Tara* (Social Drama). |
| **Events & Workshops** | 6 | *Tamashbin Premiere*, *Natya Shastra Acting Intensive*, *Acoustic Sound & Lighting Workshop*, *Street Theatre Courtyard Showcase*. |
| **Authentic Gallery Items** | 60 | Real production performance photos imported from user media folders with descriptive theatrical titles. |

---

## 🛠️ How to Connect and Query (Quick Reference)

### Using Python Shell (`app.app_context`):
```python
from app import app
from models import db, User, Play, Event, GalleryItem

with app.app_context():
    # Count all authentic gallery items
    gallery_count = GalleryItem.query.count()
    print(f"Total media items in DB: {gallery_count}")
    
    # Retrieve Secretary profile
    user = User.query.filter_by(name="Abay Nandhiga").first()
    print(f"User: {user.name}, Email: {user.email}, Role: {user.roles[0].name if user.roles else 'None'}")
```

### Using SQLite3 CLI:
```bash
sqlite3 backend/aayam.db
# Within sqlite3 terminal:
.tables
SELECT title, category, image_url FROM gallery_item LIMIT 10;
SELECT name, email, city FROM user WHERE status='Active';
```
