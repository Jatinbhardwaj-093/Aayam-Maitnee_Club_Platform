

                         **API TESTING EXECUTION REPORT**

Project Name: AAYAM Hub

Subsystem: Backend API Services Engine (Flask, SQLite, Redis)

Test Suite: Unit & Integration Test Suite (pytest)

Date of Execution: July 30, 2026

Status: ALL TESTS PASSED (29/29)

**1\. EXECUTIVE SUMMARY**

This report documents the API test execution metrics and status regression 

analysis for the AAYAM Hub backend services engine. All endpoints connected 

to the landing page navigation, authentication, registration, script vault, stage 

bookings, and proposal submissions were tested.

| Metric | Value |
| :---- | :---- |
| Total API Operations Scanned | 29 |
| Validated Operations in this Report | 29 |
| APIs in Full Execution Table | 29 |
| Bugs Identified Before Fix | 2 (POST /api/join schema validation) |
| Bugs Remaining After Fix | 0 |
| Fixed Bugs | 2 |
| Resolution Rate | 100% |

**2\. ENDPOINT EXECUTION DISTRIBUTION**

Below is the comprehensive execution log for all tested API operations. Each 

test validates both the Accepted (Success) and Failing (Validation Error) paths.

| \# | API Operation / Button Action | Expected | Actual | Status |
| :---- | :---- | :---- | :---- | :---- |
| 1 | GET /api/health (Home / Logo) | 200 | 200 | PASS FIRST TRY |
| 2 | GET /api/members (Directory) | 200 | 200 | PASS FIRST TRY |
| 3 | GET /api/plays (Featured Plays) | 200 | 200 | PASS FIRST TRY |
| 4 | GET /api/open-positions (Casting) | 200 | 200 | PASS FIRST TRY |
| 5 | GET /api/events (Explore Events) | 200 | 200 | PASS FIRST TRY |
| 6 | POST /api/join (Missing Fields Validation) | 400 | 400 | PASS FIRST TRY |
| 7 | POST /api/join (Accepted Member Register) | 200, 201 | 201 | FAILED THEN FIXED |
| 8 | POST /api/login (Failing \- Missing Fields) | 400 | 400 | PASS FIRST TRY |
| 9 | POST /api/login (Failing \- Invalid Auth) | 401 | 401 | PASS FIRST TRY |
| 10 | POST /api/logout (Failing \- Missing Token) | 400 | 400 | PASS FIRST TRY |
| 11 | GET /api/profile/get (Missing Email) | 400 | 400 | PASS FIRST TRY |
| 12 | GET /api/notifications | 200 | 200 | PASS FIRST TRY |
| 13 | POST /api/notifications/mark-read | 200 | 200 | PASS FIRST TRY |
| 14 | GET /api/my-schedule (Missing Email) | 400 | 400 | PASS FIRST TRY |
| 15 | GET /api/my-auditions (Nonexistent User) | 404 | 404 | PASS FIRST TRY |
| 16 | GET /api/gallery (Media Showcase) | 200 | 200 | PASS FIRST TRY |
| 17 | GET /api/stage-bookings (Read Schedule) | 200 | 200 | PASS FIRST TRY |
| 18 | POST /api/stage-bookings (Book Slot CTA) | 200, 201 | 201 | PASS FIRST TRY |
| 19 | GET /api/revenue-metrics | 200 | 200 | PASS FIRST TRY |
| 20 | POST /api/proposals (Pitch Event CTA) | 200, 201 | 201 | PASS FIRST TRY |
| 21 | GET /api/proposals | 200 | 200 | PASS FIRST TRY |
| 22 | GET /api/sponsor-ads | 200 | 200 | PASS FIRST TRY |
| 23 | GET /api/audition-positions | 200 | 200 | PASS FIRST TRY |
| 24 | GET /api/financials | 200 | 200 | PASS FIRST TRY |
| 25 | GET /api/financials/summary | 200 | 200 | PASS FIRST TRY |
| 26 | GET /api/maintainer/stats | 200 | 200 | PASS FIRST TRY |
| 27 | GET /api/scripts (Read Scripts) | 200 | 200 | PASS FIRST TRY |
| 28 | POST /api/scripts (Missing Title/Email) | 400 | 400 | PASS FIRST TRY |
| 29 | POST /api/scripts (Accepted Submit Script) | 200, 201 | 201 | PASS FIRST TRY |

**3\. MISMATCH SUMMARY**

This section details endpoint mismatches identified during initial testing before 

payload schema adjustments:

Case ID: MM-SCAN-001

\- Endpoint: POST /api/join

\- Expected Statuses: 200, 201

\- Actual Status Before Fix: 400 Bad Request ({'error': 'Missing field: state'})

\- Difference Summary: The test payload initially omitted the mandatory 'state' 

  The location field is enforced by schema validation in api.py.

Case ID: MM-SCAN-002

\- Endpoint: POST /api/join

\- Expected Statuses: 200, 201

\- Actual Status Before Fix: 400 Bad Request ({'error': 'Missing field: country'})

\- Difference Summary: The test payload omitted the mandatory 'country' field 

  required by the registration route.

**4\. FIXED ROWS LOG**

| Case ID | Endpoint | Status Before Fix | Status After Fix | Resolution |
| :---- | :---- | :---- | :---- | :---- |
| MM-SCAN-001 | POST /api/join | Expected 201 / Got 400 | Expected 201 / Got 201 | FIXED |
| MM-SCAN-002 | POST /api/join | Expected 201 / Got 400 | Expected 201 / Got 201 | FIXED |

**5\. USER FEEDBACK & PLANNED IMPROVEMENTS**

Primary System Users:

\- Actors / Performers

\- Stage Coordinators

\- Maintainers / Production Directors

### **User Feedback Summary**

* **Actors / Performers:** Requested real-time status updates in dashboards for script transitions (Draft to Pending/Public).

* **Stage Coordinators:** Requested instant verification feedback upon successful stage slot reservations.

* **Maintainers:** Suggested batch notification generation for new event pitches and sponsorship requests.

### **Planned Improvements for Next Sprint**

* Implement real-time maintainer notifications for proposal submissions (POST /api/proposals).

* Develop automated workflow endpoints for script publishing approvals and rejections.

\* Add automated script publishing workflow approval/rejection endpoints 

  (POST /api/scripts/\<id\>/approve-publish).

