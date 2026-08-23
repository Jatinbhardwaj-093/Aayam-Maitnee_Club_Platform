# Aayam - The Matinee Club
## IIT Madras BS Drama Society Platform Documentation

---

## 1. System Architecture and Overview

Aayam is a full-stack platform designed for the dramatic arts society of IIT Madras. It integrates public engagement, member rehearsal workflows, maintainer production administration, financial governance, casting callboards, and AI-driven dramaturgy tools into a unified theatrical application.

```
+-------------------------------------------------------------------------------+
|                             CLIENT APPLICATION                                |
|         React 18 + TypeScript + Vite + Tailwind CSS v4 + Recharts             |
|                                                                               |
|  +---------------------------+  +------------------------------------------+  |
|  |       MEMBER PORTAL       |  |          MAINTAINER CASTING DESK         |  |
|  | - Theatrical Script Hub   |  | - Auditions & Casting Management         |  |
|  | - Line-by-Line Rehearsal  |  | - Editorial Candidate Dossiers           |  |
|  | - Audition Submissions    |  | - Event Pitches & Proposals              |  |
|  | - Society Callboard       |  | - Financial Ledgers & Analytics          |  |
|  +---------------------------+  +------------------------------------------+  |
+---------------------------------------+---------------------------------------+
                                        | HTTP / JSON REST APIs
                                        v
+-------------------------------------------------------------------------------+
|                              FLASK BACKEND ENGINE                             |
|                                                                               |
|  +----------------------+  +---------------------+  +----------------------+  |
|  |      API ROUTER      |  |    DATABASE ORM     |  |    AI GEMINI POOL    |  |
|  |  Flask Blueprints    |  |  Flask-SQLAlchemy   |  | Multi-Key Failover   |  |
|  |  CORS + Uploads Svc  |  |  SQLite (aayam.db)  |  | Dynamic Load Balance |  |
|  +----------------------+  +---------------------+  +----------------------+  |
|                                                                               |
|  +----------------------+  +---------------------+  +----------------------+  |
|  |   REHEARSAL ENGINE   |  |   AUDITION VISION   |  |    REDIS CACHE       |  |
|  | Dialogue Extractor   |  | OpenCV Blur/Lighting|  | In-Memory Fallback   |  |
|  | Edge-TTS Neural Svc  |  | Whisper Audio STT   |  | Session Management   |  |
|  +----------------------+  +---------------------+  +----------------------+  |
+-------------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
software_project/
|-- backend/
|   |-- ai/
|   |   |-- audition_analyzer.py      # Audio-visual audition evaluation pipeline
|   |   |-- gemini_pool.py            # Centralized API key pool with failover rotation
|   |   |-- quality_service.py        # OpenCV computer vision quality scoring
|   |   |-- report_service.py         # LLM prompt evaluation engine
|   |   |-- utils.py                  # Frame and audio extraction utilities
|   |   |-- whisper_service.py        # Groq/Whisper speech transcription service
|   |-- scripts/
|   |   |-- populate_scripts.py       # Seed catalog for canonical drama plays
|   |   |-- seed.py                   # Global database seeding orchestrator
|   |-- uploads/                      # Upload directory for slates, PDFs, and posters
|   |-- .env                          # Backend environment variables and API keys
|   |-- .env.example                  # Template configuration for environment variables
|   |-- aayam.db                      # SQLite relational database (auto-generated)
|   |-- ai_roleplay.py                # Line-by-line script rehearsal engine & Edge-TTS
|   |-- api.py                        # REST API endpoint handlers and business logic
|   |-- app.py                        # Application entry point and database lifecycle
|   |-- config.py                     # Environment loading and system constants
|   |-- models.py                     # SQLAlchemy database models and schema definitions
|   |-- requirements.txt              # Python dependency specifications
|-- frontend/
|   |-- src/
|   |   |-- components/               # Custom UI components (CustomSelect, Modals)
|   |   |-- data/                     # Local fallback playbook and production records
|   |   |-- pages/
|   |   |   |-- maintainers/          # Director casting desk, analytics, and ledgers
|   |   |   |-- member/               # Member rehearsal, script builder, auditions
|   |   |   |-- website_landing/      # Public repertory showcase, plays, and pitches
|   |   |   |-- Login.tsx             # Authentication interface
|   |   |   |-- JoinClub.tsx          # Member application registration
|   |   |-- App.tsx                   # Route definitions and layout provider
|   |   |-- main.tsx                  # Vite React bootstrapping entry
|   |   |-- index.css                 # Master typography and custom scrollbars
|   |-- package.json                  # Node.js dependencies and build scripts
|   |-- tailwind.config.js            # Tailwind styling token configuration
|   |-- vite.config.ts                # Vite build and development configuration
|-- GEMINI.md                         # Aayam Theatre Design System specification
`-- README.md                         # Project documentation
```

---

## 3. Installation and Setup Guide

### Prerequisites
* Python 3.10 or higher
* Node.js 18 or higher (with npm)
* Redis Server (Optional, backend automatically falls back to in-memory caching if Redis is offline)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Jatinbhardwaj-093/software_project.git
cd software_project
```

### Step 2: Backend Environment Configuration
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Create the `.env` file from the template:
   ```bash
   cp .env.example .env
   ```
5. Configure your Gemini API keys in `backend/.env`:
   ```env
   GEMINI_API_KEY=your_primary_gemini_api_key
   GEMINI_API_KEY_2=your_secondary_gemini_api_key
   COMPLETIONS_MODEL=gemini/gemini-3.6-flash
   PORT=5005
   ```

### Step 3: Frontend Environment Configuration
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Verify or create `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5005
   ```

---

## 4. Startup and Database Auto-Initialization Lifecycle

When running the backend via `python app.py`, the system executes an automated bootstrapping sequence:

```
[System Startup Trigger: python app.py]
                   |
                   v
  1. Initialize Flask & SQLAlchemy with SQLite URI (aayam.db)
                   |
                   v
  2. Execute db.create_all() -> Auto-creates all tables if non-existent
                   |
                   v
  3. Execute ensure_user_columns() -> Auto-migrates any missing schema columns
                   |
                   v
  4. Execute seed_default_scripts() -> Seeds canonical theatrical plays into Script
                   |
                   v
  5. Check User.query.count() -> If empty, runs seed_database() with initial roles
                   |
                   v
  6. Initialize GeminiPool -> Discovers and validates all configured API keys
                   |
                   v
  7. Start WSGI Server on host 0.0.0.0, port 5005 (Debug Mode Active)
```

### Launching the Application

1. **Start the Backend Server**:
   ```bash
   cd backend
   source .venv/bin/activate
   python app.py
   ```
   The backend will start at `http://localhost:5005`.

2. **Start the Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.

3. **Start the Redis Server (Optional)**:
   ```bash
   redis-server
   ```
   If Redis is not running, the application logs a graceful notice and operates using in-memory state.

---

## 5. Script Management and Scripting Engine

The script engine processes unstructured dramatic texts into structured, interactive scene hierarchies.

### Script Data Structure
Each script is decomposed into:
* **Acts and Scenes**: Hierarchical segmentation identified by syntactic keywords (e.g. `ACT I`, `SCENE II`).
* **Characters**: Extracted cast list with character metadata, line counts, and description profiles.
* **Turns / Dialogue Units**: Ordered lines mapping character speaker names directly to spoken dialogue.
* **Stage Directions**: Parenthetical or bracketed cues (`[Exit stage left]`, `(softly)`) extracted to prevent the TTS engine from vocalizing stage notes.

### Upload and Ingestion Pipelines
1. **Raw Script Text**: Standard drama script format ingested via the Script Builder interface.
2. **PDF Upload**: Ingests PDF scripts, parses raw textual streams into standardized acts and character dialogue turns.
3. **Pinning and Status**: Scripts can be pinned to the member hub dashboard or archived into the historical repository.

---

## 6. AI Subsystems and Multi-Key Failover Pool

Aayam features five specialized AI systems engineered for theatrical staging, screening, and evaluation.

### A. Centralized Gemini Pool (`GeminiPool`)
All Gemini-backed features route requests through `backend/ai/gemini_pool.py`.

```
                        [ AI Request Entry ]
                                  |
                                  v
                    +---------------------------+
                    |        GeminiPool         |
                    | Key Rotation & Dispatcher |
                    +-------------+-------------+
                                  |
            +---------------------+---------------------+
            |                                           |
            v                                           v
    [ API Key #1 ]                              [ API Key #2 ]
    (Primary Pool)                              (Failover Pool)
            |                                           |
            v                                           v
    +---------------+                           +---------------+
    | Gemini Engine |                           | Gemini Engine |
    +-------+-------+                           +-------+-------+
            |                                           |
            +---------------------+---------------------+
                                  |
                                  v
                      [ Structured JSON Return ]
```

* **Round-Robin Load Balancing**: Successive requests rotate across active keys in `.env` to prevent single-key rate saturation.
* **Instant Failover on 429 / Quota Error**: If Key 1 triggers a rate limit or exhaustion error, the pool catches the exception, switches to Key 2, and retries the prompt without client interruption.
* **Key Discovery**: Supports both comma-separated `GEMINI_API_KEYS=key1,key2` and numbered declarations (`GEMINI_API_KEY_1`, `GEMINI_API_KEY_2`).

---

### B. The Five Theatrical AI Systems

| System | Module / Route | API Key Required? | Primary Function |
| :--- | :--- | :---: | :--- |
| **1. Rehearsal Partner** | `ai_roleplay.py` | No | Line-by-line dialogue rehearsal using Edge-TTS neural speech synthesis. Adheres strictly to authored script text. |
| **2. Audition Tape Vision & Audio** | `ai/audition_analyzer.py` | Yes | Analyzes video blur (Laplacian variance), lighting intensity, facial detection, and Whisper audio transcription. |
| **3. Reviewdozer Role-Fit Scanner** | `ReportService.analyze_portfolio_role_fit` | Yes | Theatrical dramaturgy scanner comparing candidate experience against character specifications and returning callback tests. |
| **4. Event Keypoint Extractor** | `/api/events/extract-keywords` | Yes | Extracts production formats, budgets (e.g. ₹1,40,000), technical rigs, and venue requirements from proposals. |
| **5. Proposal Autofill Parser** | `/api/events/autofill-proposal` | Yes | Converts unstructured email pitches or proposal descriptions into structured event records. |

---

## 7. Frontend Architecture and Theatrical Design System

The frontend strictly implements the **Aayam Theatre Design System**, emphasizing cinematic warmth, archival cream paper textures, and theatrical crimson accents.

### Core Visual Palette

| Token / Layer | Hex Value | Application |
| :--- | :--- | :--- |
| **Page Canvas Background** | `#E7DDD3` | App-wide canvas backdrop |
| **Main Section Container** | `#F2E5E0` | Elevated container frame (Border: `#DCBAB2`) |
| **Inside Cards and Panels** | `#FAF2EE` | Candidate dossiers, rehearsal cards, script cards |
| **Metric Gradient Surfaces** | `#F5EAE6` to `#EEDBD5` | Platform analytics and summary metrics |
| **Modal / Dialog Windows** | `#F5EAE6` | Dialog surfaces and floating drawers |
| **Primary Theatrical Crimson**| `#8C241E` (Hover: `#731B16`)| Primary call-to-action buttons, active pills |
| **Crimson Accents and Links** | `#B32D25` | Icons, dates, highlights, sub-actions |
| **Headings and Primary Text** | `#2A1816` | Playwright titles, character roles, candidate names |
| **Body and Description Text** | `#5C3B37` / `#6E4742` | Subtitles, script excerpts, dialog notes |
| **Muted Metadata** | `#8C5A54` | Timestamps, applicant email labels, acts |

### Mandatory Frontend Rules
1. **No Stark White**: Pure white (`#FFFFFF`, `bg-white`) is strictly disallowed to preserve the warm paper aesthetic.
2. **Custom Themed Dropdowns**: Raw HTML `<select>` tags are prohibited; all inputs utilize the themed `CustomSelect` component.
3. **Thin Theatrical Scrollbar**: All scrollable areas enforce `custom-scrollbar` with `#D5AAA2` thumb coloring.
4. **Contained Modal Scrolling**: Modals feature fixed header titles, contained inner scrolling bodies, and fixed bottom action bars to prevent scrollbars from clipping rounded borders.

---

## 8. Database Schema and Model Reference

The relational database is managed via Flask-SQLAlchemy with SQLite (`aayam.db`).

### Primary Database Models

#### 1. `User`
Stores member and administrator accounts.
* `id` (Integer, Primary Key)
* `member_id` (String, Unique)
* `name` (String, Required)
* `email` (String, Unique, Indexed)
* `password` (String, Hashed)
* `status` (String: `Active`, `Pending`, `Archived`)
* `level` (String: `Ensemble`, `Senior Cast`, `Lead`, `Director`)
* `bio`, `portfolio`, `availability`, `pronouns`, `avatar_url`

#### 2. `Script` & `DraftScript`
Stores complete authored theatrical plays and draft works.
* `id` (Integer, Primary Key)
* `title` (String, Required)
* `playwright` (String)
* `genre` (String)
* `language` (String)
* `acts` (Integer / String)
* `content` (Text, Raw Script)
* `pdf_filename` (String, Uploaded File Path)
* `is_pinned` (Boolean, Default: False)

#### 3. `AuditionPosition`
Maintains casting callboards for open productions.
* `id` (Integer, Primary Key)
* `production_name` (String)
* `role_name` (String)
* `role_category` (String: `Performer`, `Technical Crew`, `Direction`)
* `character_description` (Text)
* `requirements` (Text)
* `require_portfolio`, `require_audio`, `require_video` (Boolean)
* `status` (String: `Open Calling`, `Reviewing`, `Cast Closed`)
* `deadline` (String / DateTime)

#### 4. `AuditionApplication`
Tracks candidate applications and directorial decisions.
* `id` (Integer, Primary Key)
* `position_id` (Integer, ForeignKey to `AuditionPosition.id`)
* `applicant_name` (String)
* `applicant_email` (String, Indexed)
* `applicant_phone` (String)
* `experience_level` (String)
* `portfolio_link` (String)
* `notes` (Text, Candidate Statement)
* `status` (String: `Applied`, `Pending Review`, `Shortlisted`, `Selected`, `Declined`)
* `ai_report` (Text, JSON payload of Gemini match and vision metrics)
* `submitted_at` (DateTime)

#### 5. `Event` & `EventProposal`
Stores approved society events and pending pitches.
* `id` (Integer, Primary Key)
* `title` (String)
* `category` (String: `Plays`, `Sponsor Showcase`, `Workshops`)
* `venue` (String)
* `date` (String)
* `status` (String: `Upcoming Premiere`, `Completed`, `Proposed`)
* `is_sponsored` (Boolean)
* `sponsor_name` (String)
* `donations_collected`, `target_budget` (String)

#### 6. `FinancialRecord`
Maintains financial transparency and compliance logs.
* `id` (Integer, Primary Key)
* `title` (String)
* `category` (String: `Production Cost`, `Ticket Sales`, `Grant`, `Sponsorship`)
* `amount` (Float)
* `type` (String: `Income`, `Expense`)
* `date` (String)
* `reference_play` (String)

---

## 9. REST API Endpoint Reference

### Authentication and Members
* `POST /api/auth/register` - Register a new member profile
* `POST /api/auth/login` - Authenticate member or director
* `GET /api/members` - Retrieve all registered society members

### Scripts and Rehearsals
* `GET /api/scripts` - Retrieve all published theatrical scripts
* `POST /api/scripts` - Upload and parse a new script
* `POST /api/script/pin` - Toggle script pinned status on member board
* `POST /api/rehearsal/start` - Initialize real-time dialogue rehearsal session
* `POST /api/rehearsal/turn` - Process actor response and fetch next AI turn

### Auditions and Casting Desk
* `GET /api/audition-positions` - List all open casting callboards
* `POST /api/audition-positions` - Create a new character calling position
* `GET /api/audition-applications` - Fetch all audition submissions (Maintainer)
* `GET /api/my-auditions?email=<email>` - Fetch candidate submissions (Member)
* `POST /api/audition-applications` - Submit an audition application
* `POST /api/audition-application/<id>/status` - Update review status (`Shortlisted`, `Selected`, `Declined`)
* `POST /api/audition-applications/<id>/withdraw` - Withdraw active application

### AI Services
* `POST /api/ai/portfolio_scan` - Run Gemini candidate role-fit and dossier analysis
* `POST /api/events/extract-keywords` - Extract theatrical tags and budget deliverables
* `POST /api/events/autofill-proposal` - Parse unstructured email pitches into structured proposals

### Events and Proposals
* `GET /api/events` - Retrieve public upcoming events and past showcases
* `GET /api/proposals` - Fetch all member and sponsor event pitches
* `POST /api/proposals/<id>/approve` - Approve pitch and convert to production
* `POST /api/proposals/<id>/reject` - Reject proposal with notes

---

## 10. Verification and Testing

### Testing Backend AI Key Pool
Execute the following verification script inside `backend/`:
```bash
python -c "from ai.gemini_pool import gemini_pool; print('Keys in pool:', gemini_pool.key_count); print(gemini_pool.generate_content('Say: OK'))"
```

### Testing Frontend Production Build
Execute the following inside `frontend/`:
```bash
npm run build
```
This builds production-ready bundles and validates TypeScript and styling compatibility.

---

## 11. Maintenance and Contribution Rules

1. Always activate the virtual environment in `backend/.venv` prior to running Python commands.
2. Strictly maintain the color tokens defined in `GEMINI.md`. Never introduce `#FFFFFF` surfaces.
3. Every database schema modification in `models.py` must be accompanied by an update in `app.py:ensure_user_columns` to maintain seamless automatic initialization.
