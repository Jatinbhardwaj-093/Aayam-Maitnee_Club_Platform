def test_join_missing_fields_api(client):
    """Test POST /api/join validates required payload fields."""
    response = client.post('/api/join', json={'name': 'Test User'})
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'Missing field' in data['error']

def test_login_invalid_credentials_api(client):
    """Test POST /api/login rejects unverified user credentials."""
    response = client.post('/api/login', json={
        'email': 'nonexistent@example.com',
        'password': 'wrongpassword'
    })
    assert response.status_code in (400, 401, 404)
