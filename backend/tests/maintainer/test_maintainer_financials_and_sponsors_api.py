from models import FinancialRecord, SponsorAdRequest, Script, db

def test_financial_records_and_summary(client, app):
    """
    Test GET /api/financials and GET /api/financials/summary.
    """
    with app.app_context():
        record1 = FinancialRecord(
            title="Sponsorship Grant",
            amount=50000.0,
            record_type="Income",
            category="Sponsorship"
        )
        record2 = FinancialRecord(
            title="Stage Props Purchase",
            amount=15000.0,
            record_type="Expense",
            category="Production Props"
        )
        db.session.add_all([record1, record2])
        db.session.commit()

    # Get all records
    list_res = client.get("/api/financials")
    assert list_res.status_code == 200
    assert len(list_res.get_json()) >= 2

    # Get summary
    summary_res = client.get("/api/financials/summary")
    assert summary_res.status_code == 200
    summary = summary_res.get_json()
    assert summary["total_revenue"] == 50000.0
    assert summary["total_expenses"] == 15000.0
    assert summary["net_surplus"] == 35000.0


def test_sponsor_ads_create_and_status_update(client, app):
    """
    Test POST /api/sponsor-ads/create and updating status.
    """
    create_payload = {
        "sponsor_name": "Tech Corp",
        "contact_person": "Jane Doe",
        "contact_email": "jane@techcorp.com",
        "ad_title": "Playbill Banner Ad",
        "budget_offered": "₹75,000"
    }
    create_res = client.post("/api/sponsor-ads/create", json=create_payload)
    assert create_res.status_code == 200
    ad_id = create_res.get_json()["sponsor_ad"]["id"]

    status_res = client.post(
        f"/api/sponsor-ads/{ad_id}/status",
        json={"status": "Approved"}
    )
    assert status_res.status_code == 200
    assert status_res.get_json()["sponsor_ad"]["status"] == "Approved"


def test_script_approve_and_reject_publish(client, app):
    """
    Test maintainer approval and rejection of script publication requests.
    """
    with app.app_context():
        script1 = Script(
            title="Draft Playbook 1",
            author_email="author1@example.com",
            status="Pending"
        )
        script2 = Script(
            title="Draft Playbook 2",
            author_email="author2@example.com",
            status="Pending"
        )
        db.session.add_all([script1, script2])
        db.session.commit()
        s1_id, s2_id = script1.id, script2.id

    approve_res = client.post(f"/api/scripts/{s1_id}/approve-publish")
    assert approve_res.status_code == 200
    assert approve_res.get_json()["script"]["status"] == "Public"

    reject_res = client.post(f"/api/scripts/{s2_id}/reject-publish")
    assert reject_res.status_code == 200
    assert reject_res.get_json()["script"]["status"] == "Draft"