from models import GalleryItem, db

def test_get_gallery_media(client):
    """
    Test GET /api/gallery returns all submitted media items for moderation.
    """
    response = client.get("/api/gallery", query_string={"status": "all"})
    assert response.status_code == 200

def test_create_gallery_media_success(client):
    """
    Test POST /api/gallery successfully creates a new media gallery entry.
    """
    response = client.post(
        "/api/gallery",
        json={
            "title": "Stage Play Backstage Photo",
            "category": "Stage Plays",
            "imageUrl": "https://example.com/photo.jpg",
            "status": "pending"
        }
    )
    assert response.status_code == 201
    assert "item" in response.get_json()

def test_create_gallery_media_missing_image_url(client):
    """
    Test POST /api/gallery returns HTTP 400 when imageUrl is missing.
    """
    response = client.post(
        "/api/gallery",
        json={"title": "No Image Photo"}
    )
    assert response.status_code == 400

def test_update_gallery_media_status(client):
    """
    Test POST /api/gallery/<id>/status approves or rejects a media upload.
    """
    create_res = client.post(
        "/api/gallery",
        json={
            "title": "Audition Reel",
            "category": "Auditions",
            "imageUrl": "https://example.com/reel.mp4",
            "status": "pending"
        }
    )
    item_id = create_res.get_json()["item"]["id"]

    response = client.post(
        f"/api/gallery/{item_id}/status",
        json={"status": "approved"}
    )
    assert response.status_code == 200
    assert response.get_json()["item"]["status"] == "approved"

def test_delete_gallery_media_success(client):
    """
    Test DELETE /api/gallery/<id> deletes a media gallery item.
    """
    create_res = client.post(
        "/api/gallery",
        json={
            "title": "Temp Photo",
            "imageUrl": "https://example.com/temp.jpg"
        }
    )
    item_id = create_res.get_json()["item"]["id"]

    response = client.delete(f"/api/gallery/{item_id}")
    assert response.status_code == 200
    assert response.get_json()["status"] == "deleted"

def test_update_gallery_media_invalid_id(client):
    """
    Test POST /api/gallery/<id>/status returns HTTP 404 for non-existent item ID.
    """
    response = client.post(
        "/api/gallery/99999/status",
        json={"status": "approved"}
    )
    assert response.status_code == 404