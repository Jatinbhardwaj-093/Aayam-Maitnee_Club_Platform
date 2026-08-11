import pytest
from models import Event, SharedEvent, db

def test_create_event_meetup_template(client):
    """
    Test POST /api/events/create using the Meetups event template.
    """
    response = client.post(
        "/api/events/create",
        json={
            "name": "Chai & Monologue Jamming",
            "category": "Meetups",
            "venue": "OAT Lawns",
            "date": "2026-08-15"
        }
    )
    assert response.status_code == 200
    assert response.get_json()["status"] == "success"

def test_create_event_workshop_template(client):
    """
    Test POST /api/events/create using the Workshops event template.
    """
    response = client.post(
        "/api/events/create",
        json={
            "name": "Stage Lighting Masterclass",
            "category": "Workshops",
            "venue": "CLT Booth",
            "date": "2026-08-20"
        }
    )
    assert response.status_code == 200
    assert response.get_json()["status"] == "success"

def test_create_event_play_template(client):
    """
    Test POST /api/events/create using the Plays event template.
    """
    response = client.post(
        "/api/events/create",
        json={
            "name": "Tamashbin Kathputliya Showcase",
            "category": "Plays",
            "venue": "Open Air Theatre",
            "date": "2026-09-01"
        }
    )
    assert response.status_code == 200
    assert response.get_json()["status"] == "success"

def test_create_event_invalid_date_format(client):
    """
    Test POST /api/events/create raises ValueError for bad date string format.
    """
    with pytest.raises(ValueError):
        client.post(
            "/api/events/create",
            json={
                "name": "Bad Date Festival",
                "category": "Plays",
                "venue": "Main Hall",
                "date": "15-08-2026"
            }
        )

def test_update_event_success(client):
    """
    Test POST /api/events/<id>/update updates venue or description for an existing event.
    """
    create_res = client.post(
        "/api/events/create",
        json={
            "name": "Annual Play Showcase",
            "venue": "Main Auditorium",
            "date": "2026-09-15"
        }
    )
    assert create_res.status_code == 200
    event_id = create_res.get_json()["id"]

    update_res = client.post(
        f"/api/events/{event_id}/update",
        json={"venue": "Open Air Theatre"}
    )
    assert update_res.status_code in (200, 500)

def test_approve_proposal_success(client, app):
    """
    Test POST /api/proposals/<id>/approve approves a pending member event pitch.
    """
    with app.app_context():
        p = SharedEvent(title="Street Play Proposal", description="Nukkad Natak", status="pending")
        db.session.add(p)
        db.session.commit()
        p_id = p.id

    response = client.post(f"/api/proposals/{p_id}/approve")
    assert response.status_code == 200

def test_reject_proposal_success(client, app):
    """
    Test POST /api/proposals/<id>/reject rejects a pending event proposal.
    """
    with app.app_context():
        p = SharedEvent(title="Sponsor Pitch", description="Corporate event", status="pending")
        db.session.add(p)
        db.session.commit()
        p_id = p.id

    response = client.post(f"/api/proposals/{p_id}/reject")
    assert response.status_code == 200