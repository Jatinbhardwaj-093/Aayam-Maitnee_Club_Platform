from models import AuditionPosition, AuditionApplication, db

def test_create_and_get_audition_positions(client):
    """
    Test POST /api/audition-positions/create and GET /api/audition-positions.
    """
    payload = {
        "production_name": "Macbeth 2026",
        "role_name": "Lead Actor - Macbeth",
        "role_category": "Character Role",
        "character_description": "Tragic protagonist",
        "slots_available": 2
    }
    create_res = client.post("/api/audition-positions/create", json=payload)
    assert create_res.status_code == 200
    assert create_res.get_json()["status"] == "success"

    get_res = client.get("/api/audition-positions")
    assert get_res.status_code == 200
    positions = get_res.get_json()
    assert isinstance(positions, list)
    assert len(positions) > 0


def test_audition_applications_get_and_update_status(client, app):
    """
    Test GET /api/audition-applications and status updates.
    """
    with app.app_context():
        pos = AuditionPosition(
            production_name="Hamlet",
            role_name="Ophelia",
            slots_available=1
        )
        db.session.add(pos)
        db.session.commit()

        app_record = AuditionApplication(
            position_id=pos.id,
            role_name="Ophelia",
            applicant_name="Test Applicant",
            applicant_email="applicant@example.com",
            status="Pending Review"
        )
        db.session.add(app_record)
        db.session.commit()
        app_id = app_record.id

    # Get applications
    get_res = client.get("/api/audition-applications")
    assert get_res.status_code == 200
    apps = get_res.get_json()
    assert len(apps) > 0

    # Update application status
    status_res = client.post(
        f"/api/audition-applications/{app_id}/status",
        json={"status": "Shortlisted"}
    )
    assert status_res.status_code == 200
    assert status_res.get_json()["application"]["status"] == "Shortlisted"


def test_update_audition_application_not_found(client):
    """
    Test POST /api/audition-applications/<id>/status returns 404 for invalid ID.
    """
    response = client.post(
        "/api/audition-applications/9999/status",
        json={"status": "Selected"}
    )
    assert response.status_code == 404