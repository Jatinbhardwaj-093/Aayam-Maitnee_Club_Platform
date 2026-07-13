# AAYAM Hub Backend Services

Backstage services engine for the Aayam Hub and Matinee Club ensemble boards. Powered by **Flask**, persistent **SQLite**, and **Redis** cache/session storage.

## Stack Architecture

- **Web Server:** Flask (Python)
- **Database:** SQLite (local persistent SQL db `aayam.db`)
- **Cache & Sessions:** Redis (local memory key-value store with automatic in-memory fallback if Redis server is inactive)
- **CORS:** Configured for cross-origin frontend queries (default port `5173`)

## Features

1. **Automated Ensemble Induction (`POST /api/join`):** Inserts registration into SQLite database and dynamically assigns system tags (`developer`, `maintainer`, `member`). Clears stale Redis cached lists.
2. **Cached Member List (`GET /api/members`):** Checks Redis caching layer for near-instant retrieval. Performs SQLite query fallbacks and populates cache if cache misses.
3. **Session Token Vault (`POST /api/login` & `POST /api/logout`):** Issues cryptographically random tokens and maps active session parameters in Redis under a 1-hour time-to-live (TTL).

---

## Setup & Running Guide

### 1. Initialize Virtual Environment

Always run backend commands inside the `.venv` directory:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Start Application Server

Ensure Redis is active locally (default `redis://localhost:6379`). Start the Flask development listener:

```bash
python app.py
```

The server will initialize SQLite database tables and start listening on [http://localhost:5001](http://localhost:5001).

> [!NOTE]
> If Redis is not running, the application logs a warning and gracefully transitions to process memory cache and session mapping.

### 3. API Handshake References

- **Health Check:** `GET /api/health`
- **Register Member:** `POST /api/join` (Accepts JSON body matching registration inputs)
- **Load Directory:** `GET /api/members`
- **Login Session:** `POST /api/login` (Accepts `email` payload)
- **Logout Session:** `POST /api/logout`
