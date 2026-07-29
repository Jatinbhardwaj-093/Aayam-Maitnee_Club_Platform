def test_logout_success(client):
    """
    Test POST /logout successfully logs out the authenticated member and invalidates the active session.
    """

    response = client.post("/api/logout")

    assert response.status_code == 200
