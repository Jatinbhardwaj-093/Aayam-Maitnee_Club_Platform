def test_get_script_vault(client):
    """
    Test GET /scripts loads the Script Vault page
    with all public and personal scripts.
    """

    response = client.get(
        "/api/scripts",
        query_string={"email": "aditi.drama@handle.com"}
    )

    assert response.status_code == 200


def test_get_public_scripts(client):
    """
    Test GET /scripts returns all public scripts
    displayed under the Public Vault tab.
    """

    response = client.get("/api/scripts")

    assert response.status_code == 200

    data = response.get_json()

    assert "public" in data


def test_get_my_scripts(client):
    """
    Test GET /scripts returns personal draft scripts created by the logged-in member.
    """

    response = client.get(
        "/api/scripts",
        query_string={
            "email": "aditi.drama@handle.com"
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "drafts" in data


def test_create_new_script(client):
    """
    Test POST /scripts creates a new personal script draft successfully.
    """

    response = client.post(
        "/api/scripts",
        json={
            "title":"My First Play",
            "author_email":"aditi.drama@handle.com",
            "genre":"Drama",
            "language":"English"
        }
    )

    assert response.status_code == 201


def test_create_script_without_title(client):
    """
    Test POST /scripts returns HTTP 400
    when the title field is missing.
    """

    response = client.post(
        "/api/scripts",
        json={
            "author_email":"aditi.drama@handle.com"
        }
    )

    assert response.status_code == 400



def test_create_script_without_email(client):
    """
    Test POST /scripts returns HTTP 400
    when the author email is not provided.
    """

    response = client.post(
        "/api/scripts",
        json={
            "title":"Hamlet"
        }
    )

    assert response.status_code == 400


def test_view_script(client):
    """
    Test GET /scripts returns script information
    for viewing in the Script Vault.
    """

    response = client.get("/api/scripts")

    assert response.status_code == 200


def test_save_script_draft(client):
    """
    Test PUT /scripts/<script_id> successfully
    saves changes to a personal draft.
    """

    response = client.put(
        "/api/scripts/1",
        json={
            "title":"Updated Draft"
        }
    )

    assert response.status_code == 200



def test_save_invalid_script(client):
    """
    Test PUT /scripts/<script_id> returns HTTP 404
    when updating a non-existent script.
    """

    response = client.put(
        "/api/scripts/9999",
        json={
            "title":"Test"
        }
    )

    assert response.status_code == 404



def test_request_publish(client):
    """
    Test POST /scripts/<script_id>/request-publish
    submits a draft script for maintainer review.
    """

    response = client.post(
        "/api/scripts/1/request-publish"
    )

    assert response.status_code == 200



def test_request_publish_invalid_script(client):
    """
    Test POST /scripts/<script_id>/request-publish
    returns HTTP 404 for an invalid script.
    """

    response = client.post(
        "/api/scripts/9999/request-publish"
    )

    assert response.status_code == 404



def test_delete_script(client):
    """
    Test DELETE /scripts/<script_id>
    successfully deletes an existing script.
    """

    response = client.delete(
        "/api/scripts/1"
    )

    assert response.status_code == 200



def test_delete_invalid_script(client):
    """
    Test DELETE /scripts/<script_id>
    returns HTTP 404 for an invalid script id.
    """

    response = client.delete(
        "/api/scripts/9999"
    )

    assert response.status_code == 404


