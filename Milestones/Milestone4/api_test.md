# API Testing Execution Report (Milestone 4)

## 1. Executive Summary

This report outlines the high-level metrics of the API test execution for **Milestone 4**, focusing strictly on newly introduced features including AI Roleplay Rehearsal, LLM Character Extraction, Portfolio AI Scanning, and Event Intelligence APIs. All identified M4 regressions and mismatches have achieved a 100% resolution rate.

| Metric | Value |
| --- | --- |
| Total New OpenAPI operations (Milestone 4) | 25 |
| Validated operations in this report | 25 |
| APIs in full execution table | 25 |
| Bugs before fix | 5 |
| Bugs after fix | 0 |
| Fixed bugs | 5 |

## 2. Endpoint Execution Distribution

A total of 25 new API test operations underwent validation across AI rehearsal, character extraction, portfolio scanning, and event intelligence modules.

- **25 New API Mismatch Scan Before Fix:** 5
- **25 New API Mismatch Scan After Fix:** 0

### 2.1 Selected Key API Test Cases (from `backend/tests`)

Below are 5 representative test cases extracted directly from the Milestone 4 pytest test suite in `backend/tests`:

#### Test Case 1: `test_roleplay_john_mary_loop`
- **File Location:** `backend/tests/test_ai_roleplay_api.py`
- **API Endpoint:** `POST /api/rehearsal/roleplay/start` & `POST /api/rehearsal/roleplay/{session_id}/ai-turn`
- **Input:**
  ```json
  {
    "title": "John and Mary",
    "script": "John: Hello Mary, how are you?\nMary: I'm doing well, John.",
    "assignments": {"John": "human", "Mary": "ai"}
  }
  ```
- **Expected Output:** Status `200` (`{"status": "success", "session": {"status": "HUMAN_TURN", "current_speaker": "John"}}`)
- **Actual Output:** Status `200`
- **Result Status:** `PASS FIRST TRY`

#### Test Case 2: `test_characters_crud_api`
- **File Location:** `backend/tests/test_characters_api.py`
- **API Endpoint:** `POST /api/characters`
- **Input:**
  ```json
  {
    "name": "Thorin Oakenshield",
    "description": "Leader of the Dwarves.",
    "traits": ["proud", "brave", "stubborn"],
    "motivation": "To reclaim the Lonely Mountain.",
    "role": "Supporting"
  }
  ```
- **Expected Output:** Status `200` (`{"name": "Thorin Oakenshield", "role": "Supporting", "id": 1}`)
- **Actual Output:** Status `200`
- **Result Status:** `PASS FIRST TRY`

#### Test Case 3: `test_gemini_failure_falls_back_without_changing_dialogue`
- **File Location:** `backend/tests/test_ai_roleplay_api.py`
- **API Endpoint:** `POST /api/rehearsal/roleplay/{session_id}/ai-turn`
- **Input:** Session ID with simulated Gemini LLM service timeout
- **Expected Output:** Status `200` (`{"ai_payload": {"performance": {"provider": "default", "available": false}}}`)
- **Actual Output (Before Fix):** Status `500` (Unhandled Timeout Exception)
- **Actual Output (After Fix):** Status `200` (Fallback performance returned)
- **Result Status:** `FIXED`

#### Test Case 4: `test_auto_extract_api`
- **File Location:** `backend/tests/test_characters_api.py`
- **API Endpoint:** `POST /api/auto-extract`
- **Input:**
  ```json
  {
    "text": "Gandalf and Frodo walk to Mordor.",
    "script_id": 101
  }
  ```
- **Expected Output:** Status `200` (`{"dialogue_script": "...", "characters": [...]}`)
- **Actual Output (Before Fix):** Status `500` (JSON parsing error on markdown codeblocks)
- **Actual Output (After Fix):** Status `200`
- **Result Status:** `FIXED`

#### Test Case 5: `test_ai_portfolio_scan`
- **File Location:** `backend/tests/maintainer/test_maintainer_auditions_api.py`
- **API Endpoint:** `POST /api/ai/portfolio_scan`
- **Input:**
  ```json
  {
    "application_id": 12,
    "position_id": 3
  }
  ```
- **Expected Output:** Status `200` (`{"status": "success", "score": 85, "match_breakdown": {...}}`)
- **Actual Output:** Status `200`
- **Result Status:** `PASS FIRST TRY`

---

### 2.2 Comprehensive Endpoint Execution List

Below is the comprehensive, portrait-optimized execution list of all 25 newly introduced Milestone 4 API endpoints:

| # | API Operation | Expected Statuses | Actual | First Attempt |
| --- | --- | --- | --- | --- |
| 1 | `POST /api/rehearsal/parse` | 200, 400 | 200 | PASS FIRST TRY |
| 2 | `POST /api/rehearsal/parse` (Script Access Block) | 404 | 404 | FAILED THEN FIXED |
| 3 | `POST /api/rehearsal/roleplay/start` | 200, 400 | 200 | PASS FIRST TRY |
| 4 | `POST /api/rehearsal/roleplay/{session_id}/transcript` | 200, 404 | 200 | PASS FIRST TRY |
| 5 | `POST /api/rehearsal/roleplay/{session_id}/transcript` (Out-of-Order) | 200 | 200 | FAILED THEN FIXED |
| 6 | `POST /api/rehearsal/roleplay/{session_id}/ai-turn` | 200, 404 | 200 | PASS FIRST TRY |
| 7 | `POST /api/rehearsal/roleplay/{session_id}/ai-turn` (Gemini Fallback) | 200 | 200 | FAILED THEN FIXED |
| 8 | `POST /api/rehearsal/roleplay/{session_id}/ai-complete` | 200, 404 | 200 | PASS FIRST TRY |
| 9 | `POST /api/rehearsal/roleplay/{session_id}/advance` | 200, 404 | 200 | PASS FIRST TRY |
| 10 | `POST /api/rehearsal/roleplay/{session_id}/stop` | 200, 404 | 200 | PASS FIRST TRY |
| 11 | `GET /api/rehearsal/scripts` | 200 | 200 | PASS FIRST TRY |
| 12 | `GET /api/characters` | 200 | 200 | PASS FIRST TRY |
| 13 | `POST /api/characters` (Create) | 200, 400 | 200 | PASS FIRST TRY |
| 14 | `POST /api/characters` (Update) | 200 | 200 | PASS FIRST TRY |
| 15 | `DELETE /api/characters` | 200, 404 | 200 | PASS FIRST TRY |
| 16 | `POST /api/suggest-character` | 200, 400, 500 | 200 | FAILED THEN FIXED |
| 17 | `POST /api/analyze-text` | 200 | 200 | PASS FIRST TRY |
| 18 | `POST /api/auto-extract` | 200, 400 | 200 | FAILED THEN FIXED |
| 19 | `POST /api/auto-extract` (Empty Input Validation) | 400 | 400 | PASS FIRST TRY |
| 20 | `POST /api/ai/portfolio_scan` | 200, 404, 500 | 200 | PASS FIRST TRY |
| 21 | `POST /api/events/extract-keywords` | 200, 400, 503 | 200 | PASS FIRST TRY |
| 22 | `POST /api/events/extract-keywords` (Missing Desc) | 400 | 400 | PASS FIRST TRY |
| 23 | `POST /api/events/autofill-proposal` | 200, 400, 503 | 200 | PASS FIRST TRY |
| 24 | `GET /api/stream` (SSE Character Stream) | 200 | 200 | PASS FIRST TRY |
| 25 | `POST /upload_audition` | 200, 400 | 200 | PASS FIRST TRY |

---

## 3. Mismatch Summary

The rows listed below indicate endpoints that returned mismatched states or exceptions before subsequent bug fixes were deployed during Milestone 4 development.

● **Case ID: BUG-FIX-M4-001**
  ○ **Endpoint:** `POST /api/rehearsal/roleplay/{session_id}/ai-turn`
  ○ **Expected:** 200 (With default performance fallback)
  ○ **Actual:** 500
  ○ **Difference Summary:** When external Gemini API timed out or threw an exception, the AI turn endpoint crashed with HTTP 500. Added `FailingPerformanceProvider` fallback logic returning default emotion/pace metrics without breaking session state.

● **Case ID: BUG-FIX-M4-002**
  ○ **Endpoint:** `POST /api/rehearsal/roleplay/{session_id}/transcript`
  ○ **Expected:** 200
  ○ **Actual:** 400 (Invalid State Transition)
  ○ **Difference Summary:** Receiving an out-of-order non-final speech transcript during `AI_TURN` status caused state corruptions. Implemented state guard ignoring non-final speech fragments during active AI turns.

● **Case ID: BUG-FIX-M4-003**
  ○ **Endpoint:** `POST /api/rehearsal/parse`
  ○ **Expected:** 404
  ○ **Actual:** 200
  ○ **Difference Summary:** Members were able to parse private draft scripts belonging to other users. Enforced strict ownership and maintainer query filters via `_script_vault_accessible_query`.

● **Case ID: BUG-FIX-M4-004**
  ○ **Endpoint:** `POST /api/suggest-character`
  ○ **Expected:** 200
  ○ **Actual:** 500 (JSON Decode Error)
  ○ **Difference Summary:** LiteLLM completion returned raw markdown code block tags (` ```json ... ``` `), causing `json.loads` parsing failures. Added automated string cleaning for markdown code wrappers.

● **Case ID: BUG-FIX-M4-005**
  ○ **Endpoint:** `POST /api/auto-extract`
  ○ **Expected:** 200
  ○ **Actual:** 500 (Integrity Error / Database Rollback)
  ○ **Difference Summary:** Failed character persistence when Gemini returned partial objects without character names. Added validation for missing `name` keys and session rollbacks.

---

## 4. Fixed Rows

The table below maps the before and after statuses, formally logging the resolution of all identified Milestone 4 test regressions.

| Case ID | Endpoint | Before | After | Status |
| --- | --- | --- | --- | --- |
| BUG-FIX-M4-001 | `POST /api/rehearsal/roleplay/{session_id}/ai-turn` | exp 200 / act 500 | exp 200 / act 200 | **FIXED** |
| BUG-FIX-M4-002 | `POST /api/rehearsal/roleplay/{session_id}/transcript` | exp 200 / act 400 | exp 200 / act 200 | **FIXED** |
| BUG-FIX-M4-003 | `POST /api/rehearsal/parse` | exp 404 / act 200 | exp 404 / act 404 | **FIXED** |
| BUG-FIX-M4-004 | `POST /api/suggest-character` | exp 200 / act 500 | exp 200 / act 200 | **FIXED** |
| BUG-FIX-M4-005 | `POST /api/auto-extract` | exp 200 / act 500 | exp 200 / act 200 | **FIXED** |
