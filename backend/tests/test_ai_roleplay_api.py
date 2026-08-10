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


def test_roleplay_john_mary_loop(client):
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
