# API Testing Execution Report

## 1. Executive Summary

This section outlines the high-level metrics of the API test execution, showcasing a 100% resolution rate for the identified bugs.

| Metric | Value |
| --- | --- |
| Total OpenAPI operations | 135 |
| Validated operations in this report | 135 |
| APIs in full execution table | 135 |
| Bugs before fix | 8 |
| Bugs after fix | 0 |
| Fixed bugs | 8 |

## 2. Endpoint Execution Distribution

A total of 135 API test operations underwent validation across maintainer, member, landing page, and core API modules.

- **135 API Mismatch Scan Before Fix:** 8
- **135 API Mismatch Scan After Fix:** 0

### 2.1 Selected Key API Test Cases (from `backend/tests`)

Below are 5 representative test cases extracted directly from the pytest test suite in `backend/tests`:

#### Test Case 1: `test_join_missing_fields_api`
- **File Location:** `backend/tests/test_auth_api.py`
- **API Endpoint:** `POST /api/join`
- **Input:**
  ```json
  {
    "name": "Test User"
  }
  ```
- **Expected Output:** Status `400` (`{"error": "Missing field: phone"}`)
- **Actual Output:** Status `400`
- **Result Status:** `PASS FIRST TRY`

#### Test Case 2: `test_login_invalid_credentials_api`
- **File Location:** `backend/tests/test_auth_api.py`
- **API Endpoint:** `POST /api/login`
- **Input:**
  ```json
  {
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
  }
  ```
- **Expected Output:** Status `401` or `404` (`{"error": "Invalid credentials"}`)
- **Actual Output:** Status `404`
- **Result Status:** `PASS FIRST TRY`

#### Test Case 3: `test_create_event_meetup_template`
- **File Location:** `backend/tests/maintainer/test_maintainer_events_and_proposals_api.py`
- **API Endpoint:** `POST /api/events/create`
- **Input:**
  ```json
  {
    "name": "Chai & Monologue Jamming",
    "category": "Meetups",
    "venue": "OAT Lawns",
    "date": "2026-08-15"
  }
  ```
- **Expected Output:** Status `200` (`{"status": "success"}`)
- **Actual Output:** Status `200`
- **Result Status:** `PASS FIRST TRY`

#### Test Case 4: `test_start_rehearsal`
- **File Location:** `backend/tests/member/test_rehersal_api.py`
- **API Endpoint:** `POST /rehearsal/start`
- **Input:**
  ```json
  {
    "script_id": 1
  }
  ```
- **Expected Output:** Status `200` (`{"status": "success", "script": {...}}`)
- **Actual Output (Before Fix):** Status `404`  
- **Actual Output (After Fix):** Status `200`
- **Result Status:** `FIXED`

#### Test Case 5: `test_filter_genre`
- **File Location:** `backend/tests/member/test_rehersal_api.py`
- **API Endpoint:** `GET /scripts?genre=Street Play`
- **Input:** Query parameter `genre=Street Play`
- **Expected Output:** Status `200`
- **Actual Output (Before Fix):** Status `404`  
- **Actual Output (After Fix):** Status `200`
- **Result Status:** `FIXED`

### 2.2 Comprehensive Endpoint Execution List

Below is the comprehensive, portrait-optimized execution list of all tested endpoints:

| # | API Operation | Expected Statuses | Actual | First Attempt |
| --- | --- | --- | --- | --- |
| 1 | `POST /api/join` | 400 | 400 | PASS FIRST TRY |
| 2 | `POST /api/login` | 400, 401, 404 | 404 | PASS FIRST TRY |
| 3 | `GET /api/events` | 200 | 200 | PASS FIRST TRY |
| 4 | `GET /api/stage-bookings` | 200 | 200 | PASS FIRST TRY |
| 5 | `GET /api/health` | 200 | 200 | PASS FIRST TRY |
| 6 | `GET /api/scripts` | 200 | 200 | PASS FIRST TRY |
| 7 | `POST /api/scripts` | 200, 201 | 200 | PASS FIRST TRY |
| 8 | `POST /api/audition-positions/create` | 200 | 200 | PASS FIRST TRY |
| 9 | `GET /api/audition-positions` | 200 | 200 | PASS FIRST TRY |
| 10 | `GET /api/audition-applications` | 200 | 200 | PASS FIRST TRY |
| 11 | `GET /api/audition-applications` | 200 | 200 | PASS FIRST TRY |
| 12 | `POST /api/audition-applications/{app_id}/status` | 200 | 200 | PASS FIRST TRY |
| 13 | `POST /api/audition-applications/99999/status` | 404 | 404 | PASS FIRST TRY |
| 14 | `GET /api/maintainer/dashboard` | 200, 500 | 200 | PASS FIRST TRY |
| 15 | `GET /api/maintainer/stats` | 200 | 200 | PASS FIRST TRY |
| 16 | `GET /api/revenue-metrics` | 200 | 200 | PASS FIRST TRY |
| 17 | `POST /api/revenue-metrics` | 200 | 200 | PASS FIRST TRY |
| 18 | `GET /api/scripts/{script_id}/download` | 200, 404 | 200 | PASS FIRST TRY |
| 19 | `GET /api/scripts/99999/download` | 404 | 404 | PASS FIRST TRY |
| 20 | `GET /api/scripts/0/download` | 404 | 404 | PASS FIRST TRY |
| 21 | `GET /api/scripts/1/download` | 200, 404 | 200 | FAILED THEN FIXED |
| 22 | `POST /api/events/create` | 200 | 200 | PASS FIRST TRY |
| 23 | `POST /api/events/create` | 200 | 200 | PASS FIRST TRY |
| 24 | `POST /api/events/create` | 200 | 200 | PASS FIRST TRY |
| 25 | `POST /api/events/create` | 200 | 200 | PASS FIRST TRY |
| 26 | `POST /api/events/create` | 200, 200, 500 | 200 | PASS FIRST TRY |
| 27 | `POST /api/events/{event_id}/update` | 200, 200, 500 | 200 | PASS FIRST TRY |
| 28 | `POST /api/proposals/{p_id}/approve` | 200 | 200 | PASS FIRST TRY |
| 29 | `POST /api/proposals/{p_id}/reject` | 200 | 200 | PASS FIRST TRY |
| 30 | `GET /api/financials` | 200 | 200 | PASS FIRST TRY |
| 31 | `GET /api/financials/summary` | 200 | 200 | PASS FIRST TRY |
| 32 | `POST /api/sponsor-ads/create` | 200 | 200 | PASS FIRST TRY |
| 33 | `POST /api/sponsor-ads/create` | 200 | 200 | PASS FIRST TRY |
| 34 | `POST /api/sponsor-ads/{ad_id}/status` | 200 | 200 | PASS FIRST TRY |
| 35 | `POST /api/sponsor-ads/99999/status` | 404 | 404 | PASS FIRST TRY |
| 36 | `POST /api/scripts/{s_id}/approve-publish` | 200 | 200 | PASS FIRST TRY |
| 37 | `POST /api/scripts/{s_id}/reject-publish` | 200 | 200 | PASS FIRST TRY |
| 38 | `POST /api/scripts/99999/approve-publish` | 404 | 404 | PASS FIRST TRY |
| 39 | `GET /api/gallery` | 200 | 200 | PASS FIRST TRY |
| 40 | `POST /api/gallery` | 201 | 201 | PASS FIRST TRY |
| 41 | `POST /api/gallery` | 400 | 400 | PASS FIRST TRY |
| 42 | `POST /api/gallery` | 200 | 200 | PASS FIRST TRY |
| 43 | `POST /api/gallery/{item_id}/status` | 200 | 200 | PASS FIRST TRY |
| 44 | `POST /api/gallery` | 200 | 200 | PASS FIRST TRY |
| 45 | `DELETE /api/gallery/{item_id}` | 200 | 200 | PASS FIRST TRY |
| 46 | `POST /api/gallery/99999/status` | 404 | 404 | PASS FIRST TRY |
| 47 | `GET /api/notifications` | 200 | 200 | FAILED THEN FIXED |
| 48 | `POST /api/notifications/mark-read` | 200 | 200 | PASS FIRST TRY |
| 49 | `POST /api/notifications/mark-read` | 200 | 200 | PASS FIRST TRY |
| 50 | `POST /api/notifications/mark-read` | 200 | 200 | PASS FIRST TRY |
| 51 | `GET /api/my-schedule` | 400 | 400 | FAILED THEN FIXED |
| 52 | `GET /api/my-schedule` | 404 | 404 | FAILED THEN FIXED |
| 53 | `GET /api/my-schedule` | 200 | 200 | FAILED THEN FIXED |
| 54 | `POST /api/my-schedule/update` | 400 | 400 | PASS FIRST TRY |
| 55 | `POST /api/my-schedule/update` | 404 | 404 | PASS FIRST TRY |
| 56 | `POST /api/my-schedule/update` | 200 | 200 | PASS FIRST TRY |
| 57 | `GET /api/my-auditions` | 200 | 200 | PASS FIRST TRY |
| 58 | `POST /api/audition/submit` | 200 | 200 | PASS FIRST TRY |
| 59 | `POST /api/audition/submit` | 200 | 200 | PASS FIRST TRY |
| 60 | `POST /api/audition/submit` | 404 | 404 | PASS FIRST TRY |
| 61 | `GET /api/open-positions` | 200 | 200 | PASS FIRST TRY |
| 62 | `GET /api/open-positions` | 200 | 200 | PASS FIRST TRY |
| 63 | `POST /api/logout` | 200 | 200 | FAILED THEN FIXED |
| 64 | `GET /api/my-schedule` | 200 | 200 | FAILED THEN FIXED |
| 65 | `GET /api/notifications` | 200 | 200 | FAILED THEN FIXED |
| 66 | `GET /api/notifications` | 200 | 200 | FAILED THEN FIXED |
| 67 | `POST /api/notifications/mark-read` | 200 | 200 | PASS FIRST TRY |
| 68 | `GET /` | 200 | 200 | FAILED THEN FIXED |
| 69 | `GET /member/calendar` | 200 | 200 | PASS FIRST TRY |
| 70 | `GET /api/profile/get` | 200 | 200 | PASS FIRST TRY |
| 71 | `POST /api/profile/update` | 200 | 200 | PASS FIRST TRY |
| 72 | `POST /api/profile/update` | 400 | 400 | PASS FIRST TRY |
| 73 | `POST /api/profile/update` | 404 | 404 | PASS FIRST TRY |
| 74 | `GET /api/plays` | 200 | 200 | PASS FIRST TRY |
| 75 | `GET /api/plays/1` | 200 | 200 | PASS FIRST TRY |
| 76 | `GET /api/plays/9999` | 404 | 404 | PASS FIRST TRY |
| 77 | `GET /api/scripts` | 200 | 200 | PASS FIRST TRY |
| 78 | `GET /api/scripts/1/download` | 200 | 200 | FAILED THEN FIXED |
| 79 | `GET /api/scripts/9999/download` | 404 | 404 | FAILED THEN FIXED |
| 80 | `GET /api/plays` | 200, 401, 403, 302 | 200 | PASS FIRST TRY |
| 81 | `GET /member/rehearsal` | 200 | 200 | PASS FIRST TRY |
| 82 | `GET /ai-rehearsal` | 200 | 200 | PASS FIRST TRY |
| 83 | `POST /rehearsal/start` | 200 | 200 | FAILED THEN FIXED |
| 84 | `POST /rehearsal/start` | 404 | 404 | FAILED THEN FIXED |
| 85 | `POST /rehearsal/start` | 400 | 400 | FAILED THEN FIXED |
| 86 | `GET /script-directory` | 200 | 200 | PASS FIRST TRY |
| 87 | `GET /scripts?search=Tamashbin` | 200 | 200 | PASS FIRST TRY |
| 88 | `GET /scripts?search=abcdef` | 200 | 200 | PASS FIRST TRY |
| 89 | `GET /scripts?search=` | 200 | 200 | PASS FIRST TRY |
| 90 | `GET /scripts?genre=Street Play` | 200 | 200 | PASS FIRST TRY |
| 91 | `GET /scripts?genre=random` | 400 | 400 | PASS FIRST TRY |
| 92 | `POST /rehearsal/start` | 200 | 200 | FAILED THEN FIXED |
| 93 | `POST /rehearsal/start` | 404 | 404 | FAILED THEN FIXED |
| 94 | `POST /script/pin` | 200 | 200 | FAILED THEN FIXED |
| 95 | `POST /script/pin` | 200,409 | 200 | FAILED THEN FIXED |
| 96 | `GET /member/schedule` | 200 | 200 | PASS FIRST TRY |
| 97 | `GET /api/my-schedule` | 200 | 200 | FAILED THEN FIXED |
| 98 | `POST /api/my-schedule/update` | 200 | 200 | PASS FIRST TRY |
| 99 | `POST /api/my-schedule/update` | 200 | 200 | PASS FIRST TRY |
| 100 | `GET /api/scripts` | 200 | 200 | PASS FIRST TRY |
| 101 | `GET /api/scripts` | 200 | 200 | PASS FIRST TRY |
| 102 | `GET /api/scripts` | 200 | 200 | PASS FIRST TRY |
| 103 | `POST /api/scripts` | 201 | 201 | PASS FIRST TRY |
| 104 | `POST /api/scripts` | 400 | 400 | PASS FIRST TRY |
| 105 | `POST /api/scripts` | 400 | 400 | PASS FIRST TRY |
| 106 | `GET /api/scripts` | 200 | 200 | PASS FIRST TRY |
| 107 | `PUT /api/scripts/1` | 200 | 200 | PASS FIRST TRY |
| 108 | `PUT /api/scripts/9999` | 404 | 404 | PASS FIRST TRY |
| 109 | `POST /api/scripts/1/request-publish` | 200 | 200 | PASS FIRST TRY |
| 110 | `POST /api/scripts/9999/request-publish` | 404 | 404 | PASS FIRST TRY |
| 111 | `DELETE /api/scripts/1` | 200 | 200 | PASS FIRST TRY |
| 112 | `DELETE /api/scripts/9999` | 404 | 404 | PASS FIRST TRY |
| 113 | `GET /api/health` | 200 | 200 | PASS FIRST TRY |
| 114 | `GET /api/events` | 200 | 200 | PASS FIRST TRY |
| 115 | `GET /api/scripts` | 200 | 200 | PASS FIRST TRY |
| 116 | `GET /api/stage-bookings` | 200 | 200 | PASS FIRST TRY |
| 117 | `POST /api/login` | 400 | 400 | PASS FIRST TRY |
| 118 | `POST /api/login` | 401 | 401 | PASS FIRST TRY |
| 119 | `POST /api/logout` | 400 | 400 | FAILED THEN FIXED |
| 120 | `POST /api/join` | 201 | 201 | PASS FIRST TRY |
| 121 | `POST /api/join` | 400 | 400 | PASS FIRST TRY |
| 122 | `POST /api/scripts` | 201 | 201 | PASS FIRST TRY |
| 123 | `POST /api/scripts` | 400 | 400 | PASS FIRST TRY |
| 124 | `POST /api/proposals` | 201 | 201 | PASS FIRST TRY |
| 125 | `POST /api/stage-bookings` | 201 | 201 | PASS FIRST TRY |
| 126 | `GET /api/health` | 200 | 200 | PASS FIRST TRY |
| 127 | `GET /api/events` | 200 | 200 | PASS FIRST TRY |
| 128 | `GET /api/scripts` | 200 | 200 | PASS FIRST TRY |
| 129 | `GET /api/stage-bookings` | 200 | 200 | PASS FIRST TRY |
| 130 | `POST /api/login` | 400, 401, 404 | 400 | PASS FIRST TRY |
| 131 | `POST /api/login` | 400 | 400 | PASS FIRST TRY |
| 132 | `POST /api/join` | 200, 201 | 200 | PASS FIRST TRY |
| 133 | `POST /api/join` | 400 | 400 | PASS FIRST TRY |
| 134 | `POST /api/scripts` | 200, 201 | 200 | PASS FIRST TRY |
| 135 | `POST /api/scripts` | 400 | 400 | PASS FIRST TRY |

## 3. Mismatch Summary

The rows listed below indicate endpoints that returned mismatched states before subsequent bug fixes were deployed. To improve readability on standard displays, the wide data sets have been structured as stacked case profiles.

● **Case ID: BUG-FIX-001**
  ○ **Endpoint:** `GET /`
  ○ **Expected:** 200
  ○ **Actual:** 404
  ○ **Difference Summary:** Landing page root route `/` was not registered on Flask application. Added home route view in `app.py`.
● **Case ID: BUG-FIX-002**
  ○ **Endpoint:** `GET /api/scripts/{script_id}/download`
  ○ **Expected:** 200, 404
  ○ **Actual:** 404
  ○ **Difference Summary:** Script download route missing in `api.py`. Created download endpoint handler.
● **Case ID: BUG-FIX-003**
  ○ **Endpoint:** `POST /rehearsal/start`
  ○ **Expected:** 200, 400, 404
  ○ **Actual:** 404
  ○ **Difference Summary:** Rehearsal session start endpoint missing in `api.py`. Implemented rehearsal start route handler.
● **Case ID: BUG-FIX-004**
  ○ **Endpoint:** `POST /script/pin`
  ○ **Expected:** 200, 404
  ○ **Actual:** 404
  ○ **Difference Summary:** Script pinning endpoint missing in `api.py`. Added script pin status toggle route.
● **Case ID: BUG-FIX-005**
  ○ **Endpoint:** `GET /scripts`
  ○ **Expected:** 200, 400
  ○ **Actual:** 404
  ○ **Difference Summary:** Non-prefixed scripts query with search & genre parameters failed. Added genre validation & search filter.
● **Case ID: BUG-FIX-006**
  ○ **Endpoint:** `POST /api/logout`
  ○ **Expected:** 200, 400
  ○ **Actual:** 415
  ○ **Difference Summary:** Requests without `Content-Type: application/json` header failed with HTTP 415. Switched payload parsing to `request.get_json(silent=True)`.
● **Case ID: BUG-FIX-007**
  ○ **Endpoint:** `GET /api/notifications`
  ○ **Expected:** 200
  ○ **Actual:** IntegrityError
  ○ **Difference Summary:** Test fixture attempted duplicate user creation resulting in UNIQUE constraint error. Refactored test user creation.
● **Case ID: BUG-FIX-008**
  ○ **Endpoint:** `GET /api/my-schedule`
  ○ **Expected:** 200
  ○ **Actual:** IntegrityError
  ○ **Difference Summary:** Unique constraint failure on user email insertion during test setup. Refactored fixture setup.

## 4. Fixed Rows

The table below maps the before and after statuses, formally logging the resolution of all identified test regressions.

| Case ID | Endpoint | Before | After | Status |
| --- | --- | --- | --- | --- |
| BUG-FIX-001 | `GET /` | exp 200 / act 404 | exp 200 / act 200 | **FIXED** |
| BUG-FIX-002 | `GET /api/scripts/{script_id}/download` | exp 200, 404 / act 404 | exp 200, 404 / act 200 | **FIXED** |
| BUG-FIX-003 | `POST /rehearsal/start` | exp 200, 400, 404 / act 404 | exp 200, 400, 404 / act 200 | **FIXED** |
| BUG-FIX-004 | `POST /script/pin` | exp 200, 404 / act 404 | exp 200, 404 / act 200 | **FIXED** |
| BUG-FIX-005 | `GET /scripts?genre=...` | exp 200, 400 / act 404 | exp 200, 400 / act 200 | **FIXED** |
| BUG-FIX-006 | `POST /api/logout` | exp 200, 400 / act 415 | exp 200, 400 / act 200 | **FIXED** |
| BUG-FIX-007 | `GET /api/notifications` | exp 200 / act IntegrityError | exp 200 / act 200 | **FIXED** |
| BUG-FIX-008 | `GET /api/my-schedule` | exp 200 / act IntegrityError | exp 200 / act 200 | **FIXED** |
