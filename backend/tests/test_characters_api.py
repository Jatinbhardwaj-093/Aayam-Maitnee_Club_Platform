import json
from unittest.mock import patch, MagicMock
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

@patch('api.litellm.completion')
def test_suggest_character_api(mock_completion, client):
    """Test POST /api/suggest-character endpoint."""
    mock_choices = MagicMock()
    mock_choices.message.content = json.dumps({
        "name": "Garrett",
        "description": "A quiet and agile thief who knows the city's underbelly like the back of his hand. He is cynical but loyal to those who earn his trust.",
        "traits": ["agile", "cynical", "stealthy"],
        "motivation": "To survive and retrieve stolen relics from corrupt nobles.",
        "role": "Supporting"
    })
    mock_completion.return_value = MagicMock(choices=[mock_choices])

    response = client.post('/api/suggest-character', json={"prompt": "Suggest a clever rogue companion"})
    assert response.status_code == 200
    data = response.get_json()
    assert data["name"] == "Garrett"
    assert "agile" in data["traits"]

@patch('api.litellm.completion')
def test_analyze_text_api(mock_completion, client):
    """Test POST /api/analyze-text gets parsed characters."""
    mock_choices = MagicMock()
    mock_choices.message.content = json.dumps([
        {
            "name": "Arthur",
            "description": "A young king.",
            "traits": ["brave", "chivalrous"],
            "motivation": "To unite the kingdom.",
            "role": "Protagonist"
        },
        {
            "name": "Merlin",
            "description": "A wizard.",
            "traits": ["wise", "magical"],
            "motivation": "To guide Arthur.",
            "role": "Supporting"
        }
    ])
    mock_completion.return_value = MagicMock(choices=[mock_choices])

    response = client.post('/api/analyze-text', json={"text": "Arthur and Merlin entered the forest."})
    assert response.status_code == 200
    data = response.get_json()
    assert data["success"] is True
    assert len(data["characters"]) == 2
    assert any(c["name"] == "Arthur" for c in data["characters"])
    assert any(c["name"] == "Merlin" for c in data["characters"])

@patch('api.litellm.completion')
def test_auto_extract_api(mock_completion, client):
    """Test POST /api/auto-extract endpoint."""
    # Test text validation
    response = client.post('/api/auto-extract', json={})
    assert response.status_code == 400
    
    mock_choices = MagicMock()
    mock_choices.message.content = json.dumps({
        "dialogue_script": "**Gandalf**\nThe staff has guided me safely, Frodo. But we must be careful of the shadow.\n\n**Frodo**\nI understand, Gandalf. I will watch the path.",
        "characters": [
            {
                "name": "Gandalf",
                "description": "An ancient wizard holding a staff and guiding travelers.",
                "traits": ["wise", "cautious", "protective"],
                "motivation": "To guide and protect Frodo from the shadow.",
                "role": "Protagonist"
            },
            {
                "name": "Frodo",
                "description": "A loyal companion holding a ring, wary of the warning.",
                "traits": ["wary", "resolute", "loyal"],
                "motivation": "To follow Gandalf safely.",
                "role": "Supporting"
            }
        ]
    })
    mock_completion.return_value = MagicMock(choices=[mock_choices])

    response = client.post('/api/auto-extract', json={"text": "Gandalf and Frodo walk to Mordor.", "script_id": 999})
    assert response.status_code == 200
    data = response.get_json()
    assert "dialogue_script" in data
    assert "characters" in data
    assert len(data["characters"]) == 2
    assert any(c["name"] == "Gandalf" for c in data["characters"])
    assert any(c["name"] == "Frodo" for c in data["characters"])

