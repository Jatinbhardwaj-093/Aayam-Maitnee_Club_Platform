from models import User, Event, Participation, db

def test_get_schedule_missing_email(client):
    """
    Test GET /api/my-schedule returns HTTP 400 when email query string is missing.
    """
    response = client.get("/api/my-schedule")
    assert response.status_code == 400

def test_get_schedule_invalid_email(client):
    """
    Test GET /api/my-schedule returns HTTP 404 for an unregistered email.
    """
    response = client.get(
        "/api/my-schedule",
        query_string={"email": "nonexistent@aayam.org"}
    )
    assert response.status_code == 404

def test_get_schedule_success(client, app):
    """
    Test GET /api/my-schedule retrieves schedule events for a valid user.
    """
    with app.app_context():
        u = User(name="Sched User", email="sched_valid@aayam.org", password="pass")
        e = Event(title="Rehearsal Session", category="Meetups")
        db.session.add_all([u, e])
        db.session.commit()

        p = Participation(user_id=u.id, event_id=e.id, status="Confirmed")
        db.session.add(p)
        db.session.commit()

    response = client.get(
        "/api/my-schedule",
        query_string={"email": "sched_valid@aayam.org"}
    )
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)

def test_update_schedule_missing_body(client):
    """
    Test POST /api/my-schedule/update returns HTTP 400 when payload is empty.
    """
    response = client.post("/api/my-schedule/update", json={})
    assert response.status_code == 400

def test_update_schedule_invalid_participation_id(client):
    """
    Test POST /api/my-schedule/update returns HTTP 404 for invalid participation ID.
    """
    response = client.post(
        "/api/my-schedule/update",
        json={"participation_id": 99999, "status": "Declined"}
    )
    assert response.status_code == 404

def test_update_schedule_success(client, app):
    """
    Test POST /api/my-schedule/update successfully updates event invitation status.
    """
    with app.app_context():
        u = User(name="Part User", email="part_valid@aayam.org", password="pass")
        e = Event(title="Mainstage Rehearsal")
        db.session.add_all([u, e])
        db.session.commit()

        p = Participation(user_id=u.id, event_id=e.id, status="Pending")
        db.session.add(p)
        db.session.commit()
        p_id = p.id

    response = client.post(
        "/api/my-schedule/update",
        json={"participation_id": p_id, "status": "Attending"}
    )
    assert response.status_code == 200
    assert response.get_json()["success"] is True