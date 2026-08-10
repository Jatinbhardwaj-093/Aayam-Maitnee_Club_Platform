import pytest


class FakePerformanceProvider:
    def __init__(self):
        self.calls = []

    def analyze_delivery(self, **kwargs):
        self.calls.append(kwargs)
        return {
            "emotion": "calm",
            "tone": "conversational",
            "pace": "moderate",
            "intensity": 0.6,
            "provider": "gemini",
            "available": True,
        }


class FailingPerformanceProvider:
    def analyze_delivery(self, **kwargs):
        raise TimeoutError("simulated gemini timeout")


@pytest.fixture(autouse=True)
def fake_gemini_provider():
    import api

    provider = FakePerformanceProvider()
    previous = api.rehearsal_service.performance_provider
    api.rehearsal_service.performance_provider = provider
    yield provider
    api.rehearsal_service.performance_provider = previous


def test_parse_inline_roleplay_script(client):
    response = client.post(
        "/api/rehearsal/parse",
        json={
            "title": "Opening Scene",
            "script": "John: Hello Mary.\nMary: Hello John.",
        },
    )

    assert response.status_code == 200
    scene = response.get_json()["scene"]
    assert scene["title"] == "Opening Scene"
    assert [c["name"] for c in scene["characters"]] == ["John", "Mary"]
    assert scene["turns"][0]["words"] == ["Hello", "Mary", "."]


def test_roleplay_john_mary_loop(client, fake_gemini_provider):
    script = "\n".join([
        "John: Hello Mary, how are you?",
        "Mary: I'm doing well, John.",
        "John: Are you ready for the performance?",
        "Mary: Yes, I'm completely ready.",
    ])

    start = client.post(
        "/api/rehearsal/roleplay/start",
        json={
            "title": "John and Mary",
            "script": script,
            "assignments": {"John": "human", "Mary": "ai"},
        },
    )
    assert start.status_code == 200
    session = start.get_json()["session"]
    assert session["status"] == "HUMAN_TURN"
    assert session["current_speaker"] == "John"

    transcript = client.post(
        f"/api/rehearsal/roleplay/{session['session_id']}/transcript",
        json={
            "transcript": "hello mary how are you",
            "is_final": True,
            "silence_ms": 1100,
        },
    )
    session = transcript.get_json()["session"]
    assert session["status"] == "AI_TURN"
    assert session["current_speaker"] == "Mary"
    assert session["currentTurnIndex"] == 1
    assert session["speakerType"] == "ai"

    ai_turn = client.post(f"/api/rehearsal/roleplay/{session['session_id']}/ai-turn")
    session = ai_turn.get_json()["session"]
    assert session["status"] == "PLAYING_AI_AUDIO"
    assert session["ai_payload"]["text"] == "I'm doing well, John."
    assert session["ai_payload"]["performance"]["emotion"] == "calm"
    assert fake_gemini_provider.calls[0]["character"] == "Mary"
    assert fake_gemini_provider.calls[0]["scripted_dialogue"] == "I'm doing well, John."
    assert session["ai_payload"]["words"][0]["word"] == "I'm"

    ai_complete = client.post(f"/api/rehearsal/roleplay/{session['session_id']}/ai-complete")
    session = ai_complete.get_json()["session"]
    assert session["status"] == "HUMAN_TURN"
    assert session["current_speaker"] == "John"

    transcript = client.post(
        f"/api/rehearsal/roleplay/{session['session_id']}/transcript",
        json={
            "transcript": "are you ready for performance",
            "is_final": True,
            "silence_ms": 1100,
        },
    )
    session = transcript.get_json()["session"]
    assert session["status"] == "AI_TURN"

    ai_turn = client.post(f"/api/rehearsal/roleplay/{session['session_id']}/ai-turn")
    session = ai_turn.get_json()["session"]
    assert session["ai_payload"]["text"] == "Yes, I'm completely ready."

    ai_complete = client.post(f"/api/rehearsal/roleplay/{session['session_id']}/ai-complete")
    session = ai_complete.get_json()["session"]
    assert session["status"] == "SCENE_COMPLETE"
    assert session["scene_status"] == "complete"


def test_human_transcript_tolerates_skipped_word(client):
    start = client.post(
        "/api/rehearsal/roleplay/start",
        json={
            "title": "Deviation",
            "script": "John: Hello Mary, how are you?\nMary: Good.",
            "assignments": {"John": "human", "Mary": "ai"},
        },
    )
    session = start.get_json()["session"]

    response = client.post(
        f"/api/rehearsal/roleplay/{session['session_id']}/transcript",
        json={
            "transcript": "hello mary how you",
            "is_final": True,
            "silence_ms": 1200,
        },
    )

    session = response.get_json()["session"]
    assert session["current_speaker"] == "Mary"
    assert session["status"] == "AI_TURN"


def test_late_human_transcript_does_not_break_ai_turn(client):
    start = client.post(
        "/api/rehearsal/roleplay/start",
        json={
            "title": "Late Transcript",
            "script": "John: Hello Mary.\nMary: Hello John.",
            "assignments": {"John": "human", "Mary": "ai"},
        },
    )
    session = start.get_json()["session"]

    response = client.post(
        f"/api/rehearsal/roleplay/{session['session_id']}/transcript",
        json={
            "transcript": "hello mary",
            "is_final": True,
            "silence_ms": 1200,
        },
    )
    session = response.get_json()["session"]
    assert session["status"] == "AI_TURN"
    assert session["current_speaker"] == "Mary"

    late_response = client.post(
        f"/api/rehearsal/roleplay/{session['session_id']}/transcript",
        json={
            "transcript": "hello mary",
            "is_final": False,
            "silence_ms": 0,
        },
    )
    session = late_response.get_json()["session"]
    assert session["status"] == "AI_TURN"
    assert session["current_speaker"] == "Mary"


def test_gemini_failure_falls_back_without_changing_dialogue(client):
    import api

    api.rehearsal_service.performance_provider = FailingPerformanceProvider()
    start = client.post(
        "/api/rehearsal/roleplay/start",
        json={
            "title": "Fallback",
            "script": "John: Hello Mary.\nMary: Hello John.",
            "assignments": {"John": "human", "Mary": "ai"},
        },
    )
    session = start.get_json()["session"]

    transcript = client.post(
        f"/api/rehearsal/roleplay/{session['session_id']}/transcript",
        json={"transcript": "hello mary", "is_final": True, "silence_ms": 1200},
    )
    session = transcript.get_json()["session"]

    ai_turn = client.post(f"/api/rehearsal/roleplay/{session['session_id']}/ai-turn")
    session = ai_turn.get_json()["session"]
    assert session["ai_payload"]["text"] == "Hello John."
    assert session["ai_payload"]["performance"]["provider"] == "default"
    assert session["ai_payload"]["performance"]["available"] is False
    assert session["status"] == "PLAYING_AI_AUDIO"


def test_voice_preference_is_stored_and_passed_to_ai_payload(client):
    start = client.post(
        "/api/rehearsal/roleplay/start",
        json={
            "title": "Voice",
            "script": "John: Hello Mary.\nMary: Hello John.",
            "assignments": {"John": "human", "Mary": "ai"},
            "voice_preferences": {"Mary": "female"},
        },
    )
    session = start.get_json()["session"]
    assert session["voice_preferences"]["Mary"] == "female"

    transcript = client.post(
        f"/api/rehearsal/roleplay/{session['session_id']}/transcript",
        json={"transcript": "hello mary", "is_final": True, "silence_ms": 1200},
    )
    session = transcript.get_json()["session"]

    ai_turn = client.post(f"/api/rehearsal/roleplay/{session['session_id']}/ai-turn")
    session = ai_turn.get_json()["session"]
    assert session["ai_payload"]["voice"] == "female"


def test_rehearsal_script_vault_lists_and_blocks_by_owner(client, app):
    from models import Script, db

    with app.app_context():
        owned = Script(
            title="Owner Scene",
            playwright="Owner",
            content="John: Hello Mary.\nMary: Hello John.",
            author_email="owner@example.com",
            author_name="Owner",
            status="Draft",
        )
        other = Script(
            title="Other Scene",
            playwright="Other",
            content="Alex: Private line.",
            author_email="other@example.com",
            author_name="Other",
            status="Draft",
        )
        public = Script(
            title="Public Static Scene",
            playwright="Public",
            content="Guide: Welcome everyone.",
            author_email="public@example.com",
            author_name="Public",
            status="Public",
        )
        db.session.add_all([owned, other, public])
        db.session.commit()
        owned_id = owned.id
        other_id = other.id
        public_id = public.id

    response = client.get("/api/rehearsal/scripts?email=owner@example.com")
    assert response.status_code == 200
    scripts = response.get_json()["scripts"]
    assert any(script["id"] == owned_id and script["dialogueLines"] == 2 for script in scripts)
    assert any(script["id"] == public_id and script["dialogueLines"] == 1 for script in scripts)
    assert all(script["id"] != other_id for script in scripts)

    public_parse = client.post(
        "/api/rehearsal/parse",
        json={"script_id": public_id, "user_email": "owner@example.com"},
    )
    assert public_parse.status_code == 200

    blocked = client.post(
        "/api/rehearsal/parse",
        json={"script_id": other_id, "user_email": "owner@example.com"},
    )
    assert blocked.status_code == 404
