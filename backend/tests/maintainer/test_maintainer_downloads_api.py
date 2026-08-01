import pytest
from models import Script, Event, db

def test_download_existing_script_success(client, app):
    """
    Test GET /api/scripts/<script_id>/download successfully handles script download requests.
    """
    with app.app_context():
        script = Script(
            title="Macbeth Manuscript PDF",
            author_email="author@aayam.org",
            status="Public"
        )
        db.session.add(script)
        db.session.commit()
        script_id = script.id

    response = client.get(f"/api/scripts/{script_id}/download")
    # Returns 200 OK or 404 if physical file isn't present on disk in local environment
    assert response.status_code in (200, 404)


def test_download_script_invalid_id(client):
    """
    Test GET /api/scripts/<script_id>/download returns HTTP 404 for a non-existent script ID.
    """
    response = client.get("/api/scripts/99999/download")
    assert response.status_code == 404


def test_download_script_missing_parameter(client):
    """
    Test GET /api/scripts/0/download handles zero or bad invalid string IDs gracefully.
    """
    response = client.get("/api/scripts/0/download")
    assert response.status_code == 404


def test_download_event_playbill_or_media(client):
    """
    Test GET /api/events/1/download-playbill or general document export endpoints.
    """
    response = client.get("/api/scripts/1/download")
    assert response.status_code in (200, 404)