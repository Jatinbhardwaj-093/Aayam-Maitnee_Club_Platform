def test_get_my_auditions_success(client):
    """
    Test GET /my-auditions returns all audition
    applications submitted by the member.
    """

    response = client.get(
        "/api/my-auditions",
        query_string={"email": "aditi.drama@handle.com"}
    )

    assert response.status_code == 200



def test_submit_audition_success(client):
    """
    Test POST /audition/submit creates a new
    audition application for the member.
    """

    response = client.post(
        "/api/audition/submit",
        json={
            "email": "aditi.drama@handle.com",
            "play_id": 1,
            "role": "Actor"
        }
    )

    assert response.status_code == 200



def test_submit_audition_success(client):
    """
    Test POST /audition/submit successfully submits
    an audition application for a valid member.
    """

    response = client.post(
        "/api/audition/submit",
        json={
            "email": "aditi.drama@handle.com",
            "play_id": 1,
            "role": "Ensemble",
            "notes": "Experienced stage performer"
        }
    )

    assert response.status_code == 200
    assert response.get_json()["success"] is True




def test_submit_audition_invalid_email(client):
    """
    Test POST /audition/submit returns HTTP 404
    when the member email does not exist.
    """

    response = client.post(
        "/api/audition/submit",
        json={
            "email": "abc@test.com",
            "play_id": 1,
            "role": "Ensemble"
        }
    )

    assert response.status_code == 404




def test_search_open_positions(client):
    """
    Test GET /open-positions returns matching
    audition positions for a search query.
    """

    response = client.get(
        "/api/open-positions",
        query_string={"search": "Karn"}
    )

    assert response.status_code == 200



def test_filter_performer_positions(client):
    """
    Test GET /open-positions filters
    performer audition positions.
    """

    response = client.get(
        "/api/open-positions",
        query_string={"category": "Performer"}
    )

    assert response.status_code == 200



