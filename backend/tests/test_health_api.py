def test_health_check_api(client):
    """Test GET /api/health returns status 200 and healthy payload."""
    response = client.get('/api/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert data['database'] == 'SQLite'
