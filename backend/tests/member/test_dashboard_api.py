def test_get_my_schedule_success(client):
    """
    Test GET /my-schedule loads the member dashboard schedule for a valid registered member.
    """

    response = client.get(
        "/api/my-schedule",
        query_string={"email": "aditi.drama@handle.com"}
    )

    assert response.status_code == 200


def test_get_notifications_success(client):
    """
    Test GET /notifications retrieves notifications for a valid member account.
    """

    response = client.get(
        "/api/notifications",
        query_string={"email": "aditi.drama@handle.com"}
    )

    assert response.status_code == 200



def test_get_notifications_success(client):
    """
    Test GET /notifications retrieves notifications for a valid member account.
    """

    response = client.get(
        "/api/notifications",
        query_string={"email": "aditi.drama@handle.com"}
    )

    assert response.status_code == 200


def test_mark_notifications_read(client):
    """
    Test POST /notifications/mark-read marks all unread notifications as read for the given member.
    """

    response = client.post(
        "/api/notifications/mark-read",
        json={"email": "aditi.drama@handle.com"}
    )

    assert response.status_code == 200


def test_landing_page_button(client):
    """Test GET /api/landing_page goes to the landing page."""
    response = client.get("/")

    assert response.status_code == 200



def test_calendar(client, member_login):
    """Test GET /api/calendar shows the calendar."""
    response = client.get("/member/calendar")

    assert response.status_code == 200



def test_get_profile_success(client):
    """
    Test GET /profile/get returns the profile information of an existing member.
    """

    response = client.get(
        "/api/profile/get",
        query_string={"email": "aditi.drama@handle.com"}
    )

    assert response.status_code == 200


def test_update_profile_success(client):
    """
    Test POST /profile/update successfully updates member profile information.
    """

    response = client.post(
        "/api/profile/update",
        json={
            "email": "aditi.drama@handle.com",
            "phone": "9876543210"
        }
    )

    assert response.status_code == 200


def test_update_profile_missing_email(client):
    """
    Test POST /profile/update returns HTTP 400 when email is missing.
    """

    response = client.post(
        "/api/profile/update",
        json={
            "phone":"9876543210"
        }
    )

    assert response.status_code == 400



def test_update_profile_invalid_email(client):
    """
    Test POST /profile/update returns HTTP 404 for an unregistered member email.
    """

    response = client.post(
        "/api/profile/update",
        json={
            "email":"abc@test.com",
            "phone":"9876543210"
        }
    )

    assert response.status_code == 404







