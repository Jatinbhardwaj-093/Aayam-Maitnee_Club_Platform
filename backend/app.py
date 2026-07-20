import os
from flask import Flask
from flask_cors import CORS
from models import db
from api import api_bp

app = Flask(__name__)
CORS(app)

# SQLite Config
DATABASE_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'aayam.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Register Blueprint
app.register_blueprint(api_bp, url_prefix='/api')

def ensure_user_columns():
    with db.engine.begin() as conn:
        existing_columns = {
            row[1] for row in conn.exec_driver_sql('PRAGMA table_info("user")').fetchall()
        }

        if 'state' not in existing_columns:
            conn.exec_driver_sql('ALTER TABLE "user" ADD COLUMN state VARCHAR(100)')
        if 'country' not in existing_columns:
            conn.exec_driver_sql('ALTER TABLE "user" ADD COLUMN country VARCHAR(100)')
        if 'interest' not in existing_columns:
            conn.exec_driver_sql('ALTER TABLE "user" ADD COLUMN interest VARCHAR(100)')

# Ensure tables exist
with app.app_context():
    db.create_all()
    ensure_user_columns()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
