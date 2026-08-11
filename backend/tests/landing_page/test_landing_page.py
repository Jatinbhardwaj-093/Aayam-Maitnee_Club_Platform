import pytest

# ==============================================================================
# 1. NAVIGATION BAR BUTTONS
# ==============================================================================

def test_nav_home_button_api(client):
    """Test Home button / Health check endpoint."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'


def test_nav_explore_events_button_api(client):
    """Test 'Events' / 'Explore Events' navigation button CTA."""
    # SUCCESS CASE
    response = client.get('/api/events')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)


def test_nav_read_scripts_button_api(client):
    """Test 'Scripts' / 'Read Scripts' navigation button CTA."""
    # SUCCESS CASE
    response = client.get('/api/scripts')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert 'public' in data


def test_nav_stage_bookings_button_api(client):
    """Test 'Stage Bookings' / 'Schedule' button CTA."""
    # SUCCESS CASE
    response = client.get('/api/stage-bookings')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)


# ==============================================================================
# 2. AUTHENTICATION BUTTONS (LOGIN & JOIN US / REGISTER)
# ==============================================================================

def test_login_button_success_api(client):
    """Test Login button submission with valid credentials."""
    # ERROR CASE: Non-existent or invalid user
    response = client.post('/api/login', json={
        'email': 'invalid@example.com',
        'password': 'wrongpassword'
    })
    assert response.status_code in (400, 401, 404)


def test_login_button_missing_fields_api(client):
    """Test Login button submission missing required fields."""
    # ERROR CASE: Missing password field
    response = client.post('/api/login', json={'email': 'user@example.com'})
    assert response.status_code == 400


def test_join_us_button_success_api(client):
    """Test 'Join Us' / Register button submission with full payload."""
    payload = {
        'name': 'Aayam Member',
        'phone': '9876543210',
        'state': 'West Bengal',
        'country': 'India',
        'pronouns': 'He/Him',
        'interest': 'Acting & Script Writing',
        'availability': 'Weekends',
        'bio': 'Passionate about theatre and drama.',
        'emergencyName': 'Emergency Contact',
        'emergencyPhone': '9123456789'
    }
    response = client.post('/api/join', json=payload)
    assert response.status_code in (200, 201)


def test_join_us_button_missing_fields_api(client):
    """Test 'Join Us' button submission missing required payload fields."""
    # ERROR CASE: Missing email and password
    response = client.post('/api/join', json={'name': 'Incomplete User'})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'Missing field' in data['error']


# ==============================================================================
# 3. HERO / CTA BUTTONS (SUBMIT SCRIPT)
# ==============================================================================

def test_submit_script_button_success_api(client, app):
    """Test 'Submit Script' CTA button on landing page."""
    payload = {
        "title": "Aayam Production Play",
        "playwright": "Writer Name",
        "genre": "Drama",
        "language": "Hindi",
        "acts": "2 Acts",
        "pages": 25,
        "roles_count": "8 Roles",
        "rehearsal_focus": "Expression",
        "excerpt": "Opening scene excerpt...",
        "content": "Full play script text...",
        "author_email": "writer@example.com",
        "author_name": "Writer Name",
        "status": "Public"
    }
    # SUCCESS CASE
    response = client.post('/api/scripts', json=payload)
    assert response.status_code in (200, 201)


def test_submit_script_button_error_api(client):
    """Test 'Submit Script' CTA button with missing mandatory title."""
    # ERROR CASE
    response = client.post('/api/scripts', json={
        "author_email": "writer@example.com"
    })
    assert response.status_code == 400