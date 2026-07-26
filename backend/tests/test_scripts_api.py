from models import Script

def test_get_scripts_api(client):
    """Test GET /api/scripts returns script collections dict."""
    response = client.get('/api/scripts')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'success'
    assert 'public' in data
    assert 'drafts' in data
    assert 'all' in data

def test_create_script_api(client, app):
    """Test POST /api/scripts creates a new script entry in database."""
    payload = {
        "title": "Test Play API",
        "playwright": "Tester",
        "genre": "Drama",
        "language": "English",
        "acts": "1 Act",
        "pages": 10,
        "roles_count": "5 Roles",
        "rehearsal_focus": "Blocking",
        "excerpt": "To test or not to test...",
        "content": "Full script content",
        "author_email": "testapi@example.com",
        "author_name": "Tester API",
        "status": "Public"
    }
    response = client.post('/api/scripts', json=payload)
    assert response.status_code in (200, 201)
    
    with app.app_context():
        script = Script.query.filter_by(title="Test Play API").first()
        assert script is not None
        assert script.author_email == "testapi@example.com"
