import os
import sys
import pytest

# Ensure backend folder is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app as flask_app
from models import db

@pytest.fixture
def app():
    flask_app.config.update({
        "TESTING": True,
    })
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.session.remove()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def member_login(client):
    """Fixture simulating logged-in member test client."""
    return client

