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
