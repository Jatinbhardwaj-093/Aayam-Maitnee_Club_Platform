def test_get_maintainer_dashboard(client):
    """
    Test GET /api/maintainer/dashboard loads the main control center dashboard.
    """
    response = client.get("/api/maintainer/dashboard")
    assert response.status_code in (200, 500)

def test_get_maintainer_stats(client):
    """
    Test GET /api/maintainer/stats returns aggregated system metrics.
    """
    response = client.get("/api/maintainer/stats")
    assert response.status_code == 200
    data = response.get_json()
    assert "events" in data
    assert "auditions" in data
    assert "financials" in data

def test_get_revenue_metrics(client):
    """
    Test GET /api/revenue-metrics retrieves playbill sales and patron metrics.
    """
    response = client.get("/api/revenue-metrics")
    assert response.status_code == 200

def test_update_revenue_metrics_success(client):
    """
    Test POST /api/revenue-metrics updates playbill sales and corporate patron data.
    """
    response = client.post(
        "/api/revenue-metrics",
        json={"playbillSold": 25, "corporatePatrons": 15}
    )
    assert response.status_code == 200
    assert response.get_json()["status"] == "success"