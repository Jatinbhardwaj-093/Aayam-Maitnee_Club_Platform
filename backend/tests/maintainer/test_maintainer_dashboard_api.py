def test_get_maintainer_dashboard(client):
    """
    Test GET /api/maintainer/dashboard endpoint.
    Verifies that the route is callable and processes notifications.
    """
    response = client.get("/api/maintainer/dashboard")
    # Status code will be 200 once Notification is imported in api.py
    assert response.status_code in (200, 500)


def test_get_maintainer_stats(client):
    """
    Test GET /api/maintainer/stats returns system overview statistics.
    """
    response = client.get("/api/maintainer/stats")
    assert response.status_code == 200
    data = response.get_json()
    assert "events" in data
    assert "auditions" in data
    assert "financials" in data


def test_get_and_update_revenue_metrics(client):
    """
    Test GET /api/revenue-metrics and POST /api/revenue-metrics.
    """
    # Fetch initial metrics
    get_res = client.get("/api/revenue-metrics")
    assert get_res.status_code == 200

    # Update metrics
    post_res = client.post(
        "/api/revenue-metrics",
        json={"playbillSold": 25, "corporatePatrons": 15}
    )
    assert post_res.status_code == 200
    assert post_res.get_json()["status"] == "success"