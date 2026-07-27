# AAYAM Hub Backend Services

Backstage services engine for the Aayam Hub and Matinee Club ensemble boards. Powered by **Flask**, persistent **SQLite**, and **Redis** cache/session storage.

---

## Stack Architecture

- **Web Server:** Flask (Python)
- **Database:** SQLite (local persistent database `aayam.db`)
- **Cache & Sessions:** Redis (local memory key-value store with automatic in-memory fallback if Redis server is inactive)
- **CORS:** Configured for cross-origin frontend queries (default port `5173`)
- **Testing:** Pytest suite

---

## Directory Layout

```
backend/
├── app.py                # Main Flask application listener
├── api.py                # REST API routes & endpoints blueprint
├── models.py             # SQLAlchemy ORM models & database schemas
├── seed.py               # Master script to populate full database
├── scripts/              # Modular dataset population scripts
│   ├── __init__.py
│   ├── alter_db.py
│   ├── populate_auditions.py
│   ├── populate_financials.py
│   ├── populate_proposals_and_sponsors.py
│   ├── populate_schedules.py
│   ├── populate_scripts.py
│   ├── populate_sponsor_ads.py
│   ├── seed_gallery_data.py
│   ├── seed_schedules.py
│   ├── seed_specific.py
│   └── setup_positions.py
├── tests/                # Automated pytest unit & integration tests
├── requirements.txt      # Python package dependencies
└── aayam.db              # SQLite database file (generated automatically)
```

---

## Setup & Running Guide

### 1. Initialize Virtual Environment

Always create and activate the virtual environment (`.venv`) inside the `backend` directory:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Database Setup & Local Dataset Population

### Populate Full Local Database (Master Script)

To initialize the SQLite database (`aayam.db`) and populate it with full realistic dataset (Roles, Users, Plays, Events, Gallery items, Auditions, Financials, Proposals, Schedules, Scripts, Open Positions):

```bash
# Ensure .venv is activated
python seed.py
```

Running `seed.py` performs the following steps:
1. Recreates all database tables (`models.db.create_all()`).
2. Seeds default system roles and core executive members.
3. Populates play records, upcoming events, and gallery media items.
4. Executes modular population scripts inside [`scripts/`](file:///Users/jatinbhardwaj/Github/software_project/backend/scripts):
   - `populate_auditions.py` — Character casting & crew audition postings
   - `populate_financials.py` — Sponsorship income and expense ledger
   - `populate_proposals_and_sponsors.py` — Collaborative event proposals
   - `populate_sponsor_ads.py` — Sponsor ad showcase requests
   - `populate_schedules.py` — Weekly rehearsal schedule slots
   - `populate_scripts.py` — Script Vault playbooks & dialogue excerpts
   - `setup_positions.py` — Open production positions

### Run Individual Population Scripts

If you need to seed or update a specific entity without resetting the entire database:

```bash
python scripts/populate_auditions.py
python scripts/populate_financials.py
python scripts/populate_scripts.py
python scripts/populate_schedules.py
python scripts/populate_sponsor_ads.py
python scripts/setup_positions.py
```

---

## Running the Application Server

Ensure Redis is active locally (default `redis://localhost:6379`). Start the Flask development server:

```bash
python app.py
```

The server listens on **http://localhost:5001**.

> [!NOTE]
> If Redis is not running locally, the application automatically falls back to process in-memory caching and session handling.

---

## Running Unit & Integration Tests

Run the test suite with `pytest`:

```bash
pytest
```

---

## API Handshake References

- **Health Check:** `GET /api/health`
- **Register Member:** `POST /api/join`
- **Load Directory:** `GET /api/members`
- **Login Session:** `POST /api/login`
- **Logout Session:** `POST /api/logout`
