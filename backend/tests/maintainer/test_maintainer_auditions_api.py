from models import AuditionPosition, AuditionApplication, db

def test_create_audition_position_success(client):
    """
    Test POST /api/audition-positions/create creates a new casting call position.
    """
    response = client.post(
        "/api/audition-positions/create",
        json={
            "production_name": "Macbeth 2026",
            "role_name": "Lead Actor - Macbeth",
            "role_category": "Character Role",
            "character_description": "Tragic protagonist",
            "requirements": "Strong vocal projection",
            "slots_available": 2,
            "status": "Open Calling"
        }
    )
    assert response.status_code == 200
    assert response.get_json()["status"] == "success"

def test_get_audition_positions(client):
    """
    Test GET /api/audition-positions retrieves all open audition positions.
    """
    response = client.get("/api/audition-positions")
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_get_audition_applications(client, app):
    """
    Test GET /api/audition-applications returns submitted audition applications.
    """
    with app.app_context():
        pos = AuditionPosition(production_name="Hamlet", role_name="Ophelia", slots_available=1)
        db.session.add(pos)
        db.session.commit()

        app_record = AuditionApplication(
            position_id=pos.id,
            role_name="Ophelia",
            applicant_name="Vrinda Test",
            applicant_email="vrinda@example.com",
            status="Pending Review"
        )
        db.session.add(app_record)
        db.session.commit()

    response = client.get("/api/audition-applications")
    assert response.status_code == 200
    assert len(response.get_json()) > 0

def test_filter_audition_applications_by_position(client, app):
    """
    Test GET /api/audition-applications filters applications by position_id query string.
    """
    with app.app_context():
        pos = AuditionPosition(production_name="Karn", role_name="Lead", slots_available=1)
        db.session.add(pos)
        db.session.commit()
        pos_id = pos.id

        app_record = AuditionApplication(
            position_id=pos_id,
            role_name="Lead",
            applicant_name="Karn Applicant",
            applicant_email="karn@example.com",
            status="Pending Review"
        )
        db.session.add(app_record)
        db.session.commit()

    response = client.get(
        "/api/audition-applications",
        query_string={"position_id": pos_id}
    )
    assert response.status_code == 200
    apps = response.get_json()
    assert len(apps) == 1
    assert apps[0]["applicant_email"] == "karn@example.com"

def test_update_audition_application_status_success(client, app):
    """
    Test POST /api/audition-applications/<id>/status successfully updates status.
    """
    with app.app_context():
        pos = AuditionPosition(production_name="Othello", role_name="Iago", slots_available=1)
        db.session.add(pos)
        db.session.commit()

        app_record = AuditionApplication(
            position_id=pos.id,
            role_name="Iago",
            applicant_name="Iago Actor",
            applicant_email="iago@example.com",
            status="Pending Review"
        )
        db.session.add(app_record)
        db.session.commit()
        app_id = app_record.id

    response = client.post(
        f"/api/audition-applications/{app_id}/status",
        json={"status": "Shortlisted"}
    )
    assert response.status_code == 200
    assert response.get_json()["application"]["status"] == "Shortlisted"

def test_update_audition_application_invalid_id(client):
    """
    Test POST /api/audition-applications/<id>/status returns HTTP 404 for non-existent ID.
    """
    response = client.post(
        "/api/audition-applications/99999/status",
        json={"status": "Selected"}
    )
    assert response.status_code == 404