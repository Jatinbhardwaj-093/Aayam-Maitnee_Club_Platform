def test_get_events_api(client):
    """Test GET /api/events returns list of events."""
    response = client.get('/api/events')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)

def test_get_stage_bookings_api(client):
    """Test GET /api/stage-bookings returns stage bookings list."""
    response = client.get('/api/stage-bookings')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)

def test_extract_keywords_api_success(client):
    """Test POST /api/events/extract-keywords returns extracted keywords list."""
    response = client.post('/api/events/extract-keywords', json={
        "description": "Audio Technology & Acoustic Hardware Sponsorship for Annual Theatre Festival 2026. Budget ₹1,20,000 for wireless lapel mics."
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"
    assert "keywords" in data
    assert isinstance(data["keywords"], list)
    assert len(data["keywords"]) > 0

def test_extract_keywords_api_empty_desc(client):
    """Test POST /api/events/extract-keywords returns 400 when description missing."""
    response = client.post('/api/events/extract-keywords', json={})
    assert response.status_code == 400

