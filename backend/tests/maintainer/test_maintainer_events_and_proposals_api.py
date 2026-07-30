from models import Event, SharedEvent, db

def test_create_and_update_event(client, app):
    """
    Test POST /api/events/create and POST /api/events/<id>/update.
    """
    create_payload = {
        "name": "Annual Play Showcase",
        "description": "Mainstage production",
        "venue": "Main Auditorium",
        "date": "2026-09-15"
    }
    create_res = client.post("/api/events/create", json=create_payload)
    assert create_res.status_code == 200
    event_id = create_res.get_json()["id"]

    update_res = client.post(
        f"/api/events/{event_id}/update",
        json={"venue": "Open Air Theatre"}
    )
    assert update_res.status_code == 200
    assert update_res.get_json()["status"] == "success"


def test_proposals_approve_and_reject(client, app):
    """
    Test approving and rejecting event proposals.
    """
    with app.app_context():
        proposal1 = SharedEvent(
            title="Street Play Proposal",
            description="Nukkad Natak performance",
            status="pending"
        )
        proposal2 = SharedEvent(
            title="Sponsor Pitch",
            description="Corporate event",
            status="pending"
        )
        db.session.add_all([proposal1, proposal2])
        db.session.commit()
        p1_id, p2_id = proposal1.id, proposal2.id

    # Approve Proposal 1
    approve_res = client.post(f"/api/proposals/{p1_id}/approve")
    assert approve_res.status_code == 200

    # Reject Proposal 2
    reject_res = client.post(f"/api/proposals/{p2_id}/reject")
    assert reject_res.status_code == 200