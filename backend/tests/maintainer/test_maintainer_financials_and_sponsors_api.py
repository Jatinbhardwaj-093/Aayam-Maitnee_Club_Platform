from models import FinancialRecord, SponsorAdRequest, Script, db

def test_get_financial_records(client, app):
    """
    Test GET /api/financials returns all logged income and expense records.
    """
    with app.app_context():
        r1 = FinancialRecord(title="Grant", amount=50000.0, record_type="Income", category="Sponsorship")
        r2 = FinancialRecord(title="Props", amount=15000.0, record_type="Expense", category="Props")
        db.session.add_all([r1, r2])
        db.session.commit()

    response = client.get("/api/financials")
    assert response.status_code == 200
    assert len(response.get_json()) >= 2

def test_get_financials_summary(client):
    """
    Test GET /api/financials/summary calculates revenue, expenses, and net surplus.
    """
    response = client.get("/api/financials/summary")
    assert response.status_code == 200
    summary = response.get_json()
    assert "total_revenue" in summary
    assert "total_expenses" in summary
    assert "net_surplus" in summary

def test_create_sponsor_ad_request(client):
    """
    Test POST /api/sponsor-ads/create submits a new sponsor promotion request.
    """
    response = client.post(
        "/api/sponsor-ads/create",
        json={
            "sponsor_name": "Tech Corp",
            "contact_person": "Jane Doe",
            "contact_email": "jane@techcorp.com",
            "ad_title": "Playbill Banner Ad",
            "budget_offered": "₹75,000"
        }
    )
    assert response.status_code == 200
    assert "sponsor_ad" in response.get_json()

def test_update_sponsor_ad_status(client):
    """
    Test POST /api/sponsor-ads/<id>/status updates sponsor ad approval status.
    """
    create_res = client.post(
        "/api/sponsor-ads/create",
        json={
            "sponsor_name": "Red Bull",
            "contact_person": "John",
            "contact_email": "john@redbull.com",
            "ad_title": "Stage Sponsor",
            "budget_offered": "₹1,50,000"
        }
    )
    ad_id = create_res.get_json()["sponsor_ad"]["id"]

    response = client.post(
        f"/api/sponsor-ads/{ad_id}/status",
        json={"status": "Approved"}
    )
    assert response.status_code == 200
    assert response.get_json()["sponsor_ad"]["status"] == "Approved"

def test_update_sponsor_ad_invalid_id(client):
    """
    Test POST /api/sponsor-ads/<id>/status returns HTTP 404 for non-existent ad request.
    """
    response = client.post(
        "/api/sponsor-ads/99999/status",
        json={"status": "Approved"}
    )
    assert response.status_code == 404

def test_approve_script_publication(client, app):
    """
    Test POST /api/scripts/<id>/approve-publish sets script status to Public.
    """
    with app.app_context():
        s = Script(title="Script A", author_email="a@test.com", status="Pending")
        db.session.add(s)
        db.session.commit()
        s_id = s.id

    response = client.post(f"/api/scripts/{s_id}/approve-publish")
    assert response.status_code == 200
    assert response.get_json()["script"]["status"] == "Public"

def test_reject_script_publication(client, app):
    """
    Test POST /api/scripts/<id>/reject-publish sets script status to Draft.
    """
    with app.app_context():
        s = Script(title="Script B", author_email="b@test.com", status="Pending")
        db.session.add(s)
        db.session.commit()
        s_id = s.id

    response = client.post(f"/api/scripts/{s_id}/reject-publish")
    assert response.status_code == 200
    assert response.get_json()["script"]["status"] == "Draft"

def test_approve_script_invalid_id(client):
    """
    Test POST /api/scripts/<id>/approve-publish returns HTTP 404 for invalid script ID.
    """
    response = client.post("/api/scripts/99999/approve-publish")
    assert response.status_code == 404