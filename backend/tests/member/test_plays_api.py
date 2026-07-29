def test_get_all_plays(client):
    """
    Test GET /plays successfully loads all production plays for members.
    """

    response = client.get("/api/plays")

    assert response.status_code == 200


def test_get_play_details(client):
    """
    Test GET /plays/<play_id> returns details of a selected production play.
    """

    response = client.get("/api/plays/1")

    assert response.status_code == 200

def test_get_invalid_play(client):
    """
    Test GET /plays/<play_id> returns HTTP 404 for a non-existent production.
    """

    response = client.get("/api/plays/9999")

    assert response.status_code == 404


def test_open_script_library(client):
    """
    Test GET /scripts opens the production script library from the Plays page.
    """

    response = client.get("/api/scripts")

    assert response.status_code == 200


def test_download_script(client):
    """
    Test GET /scripts/<script_id>/download downloads the selected production script.
    """

    response = client.get("/api/scripts/1/download")

    assert response.status_code == 200


def test_download_invalid_script(client):
    """
    Test GET /scripts/<script_id>/download returns HTTP 404 for an invalid script id.
    """

    response = client.get("/api/scripts/9999/download")

    assert response.status_code == 404



def test_get_plays_without_login(client):
    """
    Test GET /plays denies access to unauthenticated users.
    """

    response = client.get("/api/plays")

    assert response.status_code in (401, 403, 302)