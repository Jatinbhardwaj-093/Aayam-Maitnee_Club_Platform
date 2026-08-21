def test_rehearsal_studio(client, member_login):

    response = client.get("/member/rehearsal")

    assert response.status_code == 200

def test_rehearsal_studio_page(client, member_login):
    response = client.get("/ai-rehearsal")
    assert response.status_code == 200


def test_start_rehearsal(client, member_login):
    ''' TEST POST /rehearsal/start gives success.'''
    response = client.post(
        "/rehearsal/start",
        json={
            "script_id":1
        }
    )

    assert response.status_code == 200


def test_start_invalid_script(client, member_login):

    response = client.post(
        "/rehearsal/start",
        json={
            "script_id":9999
        }
    )

    assert response.status_code == 404


def test_start_rehearsal_missing_id(client, member_login):

    response = client.post(
        "/rehearsal/start",
        json={}
    )

    assert response.status_code == 400



def test_script_directory_page(client, member_login):
    ''' Script Directory page loads.'''
    response = client.get("/script-directory")

    assert response.status_code == 200


def test_search_existing_script(client):
    '''Search box searchs existing title.'''
    response = client.get("/scripts?search=Tamashbin")

    assert response.status_code == 200


def test_search_invalid_script(client):
    '''search for invalid title'''
    '''Expected response is "NO records found". '''

    response = client.get("/scripts?search=abcdef")

    assert response.status_code == 200



def test_empty_search(client):
    '''empty search.'''
    response = client.get("/scripts?search=")

    assert response.status_code == 200



def test_filter_genre(client):
    '''genre dropdown to choose Street Play'''
    response = client.get("/scripts?genre=Street Play")

    assert response.status_code == 200


def test_invalid_genre(client):
    '''genre dropdown giving invalid genre'''
    response = client.get("/scripts?genre=random")

    assert response.status_code == 400



def test_rehearse_button(client):
    '''TEST POST /rehearsal/start when clicking reherse loads ai-rehersal page.'''
    response = client.post(
        "/rehearsal/start",
        json={
            "script_id":2
        }
    )

    assert response.status_code == 200



def test_rehearse_invalid_script(client):
    '''invalid script'''
    response = client.post(
        "/rehearsal/start",
        json={
            "script_id":999
        }
    )

    assert response.status_code == 404




def test_pin_script(client):
    ''' TEST POST /script/pin pins the script. '''
    response = client.post(
        "/script/pin",
        json={
            "script_id":2
        }
    )

    assert response.status_code == 200
    


def test_pin_already_pinned(client):
    '''already pinned script'''
    response = client.post(
        "/script/pin",
        json={
            "script_id":2
        }
    )

    assert response.status_code in (200,409)


def test_inline_roleplay_can_parse_and_start(client):
    """The Rehearsal Studio's custom scene flow can create a live session."""
    script = "Aditi: Are you ready for rehearsal?\nRavi: The stage is ours."
    parsed = client.post(
        "/api/rehearsal/parse",
        json={"title": "Studio Test Scene", "script": script},
    )

    assert parsed.status_code == 200
    assert len(parsed.get_json()["scene"]["turns"]) == 2

    started = client.post(
        "/api/rehearsal/roleplay/start",
        json={
            "title": "Studio Test Scene",
            "script": script,
            "assignments": {"Aditi": "human", "Ravi": "ai"},
            "voice_preferences": {"Aditi": "female", "Ravi": "male"},
        },
    )

    assert started.status_code == 200
    assert started.get_json()["session"]["session_id"]
