def test_schedule_page(client, member_login):
    ''' TEST GET /member/schedule loads the production schedule and acceptance schedule page.''' 
    response = client.get("/member/schedule")

    assert response.status_code == 200


def test_get_member_schedule(client):
    """
    Test GET /my-schedule loads the production schedule for the logged-in member.
    """

    response = client.get(
        "/api/my-schedule",
        query_string={
            "email": "aditi.drama@handle.com"
        }
    )

    assert response.status_code == 200



def test_accept_schedule_invitation(client):
    """
    Test POST /my-schedule/update accepts a pending rehearsal invitation.
    """

    response = client.post(
        "/api/my-schedule/update",
        json={
            "participation_id":1,
            "status":"Accepted"
        }
    )

    assert response.status_code == 200


def test_reject_schedule_invitation(client):
    """
    Test POST /my-schedule/update rejects a pending rehearsal invitation.
    """

    response = client.post(
        "/api/my-schedule/update",
        json={
            "participation_id":1,
            "status":"Rejected"
        }
    )

    assert response.status_code == 200






