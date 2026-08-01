from models import User, Notification, db

def test_get_notifications_success(client, app):
    """
    Test GET /api/notifications retrieves notifications for a given user email.
    """
    with app.app_context():
        u = User.query.filter_by(email="maintainer_notif@aayam.org").first()
        if not u:
            u = User(name="Notif Maintainer", email="maintainer_notif@aayam.org", password="pass")
            db.session.add(u)
            db.session.commit()

        n = Notification(recipient_id=u.id, type="rehearsal", title="Rehearsal Sync", is_read=False)
        db.session.add(n)
        db.session.commit()

    response = client.get(
        "/api/notifications",
        query_string={"email": "maintainer_notif@aayam.org"}
    )
    assert response.status_code == 200
    assert len(response.get_json()) >= 1

def test_dismiss_single_notification_by_id(client, app):
    """
    Test POST /api/notifications/mark-read marks a single notification as read by notification ID.
    """
    with app.app_context():
        u = User.query.filter_by(email="single_notif@aayam.org").first()
        if not u:
            u = User(name="User Single", email="single_notif@aayam.org", password="pass")
            db.session.add(u)
            db.session.commit()

        n = Notification(recipient_id=u.id, type="audition", title="Audition Pitch", is_read=False)
        db.session.add(n)
        db.session.commit()
        n_id = n.id

    response = client.post(
        "/api/notifications/mark-read",
        json={"id": n_id}
    )
    assert response.status_code == 200
    assert response.get_json()["success"] is True

def test_mark_all_notifications_read_by_email(client, app):
    """
    Test POST /api/notifications/mark-read marks all notifications as read for a specific member email.
    """
    with app.app_context():
        u = User.query.filter_by(email="all_notif@aayam.org").first()
        if not u:
            u = User(name="User All", email="all_notif@aayam.org", password="pass")
            db.session.add(u)
            db.session.commit()

        n1 = Notification(recipient_id=u.id, type="script", title="Script 1", is_read=False)
        n2 = Notification(recipient_id=u.id, type="event", title="Event 1", is_read=False)
        db.session.add_all([n1, n2])
        db.session.commit()

    response = client.post(
        "/api/notifications/mark-read",
        json={"email": "all_notif@aayam.org"}
    )
    assert response.status_code == 200
    assert response.get_json()["success"] is True

def test_mark_all_notifications_read_global(client):
    """
    Test POST /api/notifications/mark-read marks all notifications as read globally when payload is empty.
    """
    response = client.post(
        "/api/notifications/mark-read",
        json={}
    )
    assert response.status_code == 200
    assert response.get_json()["success"] is True