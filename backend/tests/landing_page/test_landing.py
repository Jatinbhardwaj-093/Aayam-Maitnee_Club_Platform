import pytest

# ==============================================================================
# 1. NAVIGATION BAR BUTTONS
# ==============================================================================

def test_nav_home_button_api(client):
    """Test Home / Logo button action (Health Check)."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'


def test_nav_explore_events_button_api(client):
    """Test 'Explore Events' button action."""
    response = client.get('/api/events')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)


def test_nav_read_scripts_button_api(client):
    """Test 'Read Scripts' button action."""
    response = client.get('/api/scripts')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert 'public' in data


def test_nav_stage_bookings_button_api(client):
    """Test 'Stage Bookings' button action."""
    response = client.get('/api/stage-bookings')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)


# ==============================================================================
# 2. AUTHENTICATION BUTTONS (LOGIN & LOGOUT)
# ==============================================================================

def test_login_button_failing_action_missing_fields(client):
    """Failing Action: Login button clicked without entering password."""
    response = client.post('/api/login', json={'username': 'testuser'})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data


def test_login_button_failing_action_invalid_credentials(client):
    """Failing Action: Login button clicked with invalid credentials."""
    response = client.post('/api/login', json={
        'username': 'nonexistentuser',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
    data = response.get_json()
    assert data['error'] == 'Invalid credentials'


def test_logout_button_failing_action_no_token(client):
    """Failing Action: Logout button clicked without providing session token."""
    response = client.post('/api/logout', json={})
    assert response.status_code == 400
    data = response.get_json()
    assert 'Token is required' in data['error']


# ==============================================================================
# 3. REGISTRATION / 'JOIN US' FORM BUTTONS
# ==============================================================================

def test_join_us_button_accepted_action(client):
    """Accepted Action: 'Join Us' button submitted with all 10 required fields."""
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
    assert response.status_code == 201
    data = response.get_json()
    assert data['status'] == 'success'
    assert 'generated_credentials' in data


def test_join_us_button_failing_action_missing_field(client):
    """Failing Action: 'Join Us' button submitted with missing fields."""
    payload = {
        'name': 'Incomplete User',
        'phone': '9876543210'
    }
    response = client.post('/api/join', json=payload)
    assert response.status_code == 400
    data = response.get_json()
    assert 'Missing field:' in data['error']


# ==============================================================================
# 4. SCRIPT VAULT CTA BUTTONS (SUBMIT SCRIPT)
# ==============================================================================

def test_submit_script_button_accepted_action(client):
    """Accepted Action: 'Submit Script' button submitted with required payload."""
    payload = {
        "title": "New Play Script",
        "author_email": "writer@example.com",
        "playwright": "Writer Name",
        "genre": "Drama",
        "language": "Hindi",
        "acts": "2 Acts",
        "pages": 30,
        "rolesCount": "5 Roles",
        "rehearsalFocus": "Character Study",
        "excerpt": "Opening scene excerpt...",
        "content": "Full script text...",
        "status": "Public"
    }
    response = client.post('/api/scripts', json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data['status'] == 'success'


def test_submit_script_button_failing_action_missing_title(client):
    """Failing Action: 'Submit Script' button clicked without title/email."""
    response = client.post('/api/scripts', json={"genre": "Drama"})
    assert response.status_code == 400
    data = response.get_json()
    assert 'Title and author_email are required' in data['error']


# ==============================================================================
# 5. COLLABORATION / PROPOSAL SUBMISSION BUTTONS
# ==============================================================================

def test_pitch_event_button_accepted_action(client):
    """Accepted Action: 'Pitch Event / Proposal' button submitted."""
    payload = {
        'title': 'Inter-College Street Play',
        'description': 'A competitive street play showcase.',
        'venue': 'Open Air Theatre',
        'submitter_name': 'Cultural Secretary',
        'contact_email': 'partner@example.com',
        'contact_phone': '9876543210',
        'budget': '₹25,000',
        'proposal_type': 'Member Pitch'
    }
    response = client.post('/api/proposals', json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data['status'] == 'success'


# ==============================================================================
# 6. STAGE BOOKING FORM BUTTONS
# ==============================================================================

def test_book_stage_button_accepted_action(client):
    """Accepted Action: 'Book Stage Slot' button submitted."""
    payload = {
        'time': '04:00 PM - 06:00 PM',
        'period': 'Evening Slot',
        'stage': 'Main Stage',
        'details': 'Final Dress Rehearsal',
        'isSecondaryStyle': False
    }
    response = client.post('/api/stage-bookings', json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data['status'] == 'success'
    assert 'id' in data