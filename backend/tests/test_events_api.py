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

def test_autofill_proposal_api_success(client):
    """Test POST /api/events/autofill-proposal returns extracted event form fields."""
    response = client.post('/api/events/autofill-proposal', json={
        "paragraph": "FabIndia is presenting a grand ethnic costume showcase at the Royal Stage Auditorium on 24th August with budget ₹1,50,000. Contact Rohan Sharma at rohan@fabindia.com."
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data["status"] == "success"
    assert "data" in data
    assert isinstance(data["data"], dict)

def test_autofill_proposal_api_empty(client):
    """Test POST /api/events/autofill-proposal returns 400 when paragraph is missing."""
    response = client.post('/api/events/autofill-proposal', json={})
    assert response.status_code == 400

