import json
from models import ExtractedCharacter

def test_characters_crud_api(client, app):
    """Test GET, POST, DELETE /api/characters endpoints."""
    # 1. Create a character
    payload = {
        "name": "Thorin Oakenshield",
        "description": "Leader of the Dwarves.",
        "traits": ["proud", "brave", "stubborn"],
        "motivation": "To reclaim the Lonely Mountain.",
        "role": "Supporting"
    }
    response = client.post('/api/characters', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data["name"] == "Thorin Oakenshield"
    assert data["role"] == "Supporting"
    assert "id" in data
    char_id = data["id"]
    
    # 2. Get characters
    response = client.get('/api/characters')
    assert response.status_code == 200
    data_list = response.get_json()
    assert len(data_list) >= 1
    assert any(c["name"] == "Thorin Oakenshield" for c in data_list)
    
    # 3. Update character
    update_payload = {
        "id": char_id,
        "name": "Thorin Oakenshield",
        "role": "Protagonist",
        "traits": ["proud", "brave", "noble"]
    }
    response = client.post('/api/characters', json=update_payload)
    assert response.status_code == 200
    updated_data = response.get_json()
    assert updated_data["role"] == "Protagonist"
    assert "noble" in updated_data["traits"]
    
    # 4. Delete character
    response = client.delete(f'/api/characters?id={char_id}')
    assert response.status_code == 200
    
    response = client.get('/api/characters')
    data_list = response.get_json()
    assert not any(c["id"] == char_id for c in data_list)

def test_suggest_character_api(client):
    """Test POST /api/suggest-character endpoint."""
    response = client.post('/api/suggest-character', json={"prompt": "Suggest a clever rogue companion"})
    assert response.status_code == 200
    data = response.get_json()
    assert data["name"] == "Garrett"
    assert "agile" in data["traits"]

def test_analyze_text_api(client):
    """Test POST /api/analyze-text gets parsed characters."""
    response = client.post('/api/analyze-text', json={"text": "Arthur and Merlin entered the forest."})
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert len(data["characters"]) == 2
