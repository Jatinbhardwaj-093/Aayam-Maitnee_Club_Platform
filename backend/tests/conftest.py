import os
import sys
import shutil
import pytest

# Ensure backend folder is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app as flask_app
from models import db

SEED_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'aayam.db'))
TEST_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'test_work.db'))

@pytest.fixture
def app():
    if os.path.exists(SEED_DB_PATH):
        shutil.copyfile(SEED_DB_PATH, TEST_DB_PATH)
    
    flask_app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{TEST_DB_PATH}",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False
    })
    with flask_app.app_context():
        db.engine.dispose()
        yield flask_app
        db.session.remove()
        db.engine.dispose()

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
