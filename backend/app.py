import os
import uuid
import json
import random
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, Role, Admin, Membership, Event, Booking, Announcement, Feedback, Gallery, Notification, Volunteer, Participation
import redis

app = Flask(__name__)
CORS(app)

# SQLite Config
DATABASE_PATH = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'aayam.db')
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DATABASE_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Redis Config (with graceful fallback)
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
r = None
try:
    r = redis.Redis.from_url(REDIS_URL, socket_timeout=2)
    # Test ping
    r.ping()
    print("Successfully connected to Redis server!")
except Exception as e:
    print(f"Redis server not available ({e}). Using local in-memory store for caching/sessions.")
    r = None

# Fallbacks for in-memory caching and session tokens
local_cache = {}
local_sessions = {}

# Ensure tables exist
with app.app_context():
    db.create_all()

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'database': 'SQLite',
        'redis_connected': r is not None
    })

@app.route('/api/join', methods=['POST'])
def join_club():
    data = request.json
    if not data:
        return jsonify({'error': 'Missing request body'}), 400

    required_fields = ['name', 'email', 'phone', 'state', 'country', 'pronouns', 'interest', 'availability', 'bio', 'emergencyName', 'emergencyPhone']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    # Check unique email
    existing = User.query.filter_by(email=data['email']).first()
    if existing:
        return jsonify({'error': 'Email address already registered'}), 409

    # Auto-tag generation logic
    tag = 'member'
    portfolio = data.get('portfolio', '')
    port = portfolio.lower()
    mail = data['email'].lower()
    intr = data['interest'].lower()

    if 'github.com' in port or 'dev' in port or 'code' in port or 'admin' in mail:
        tag = 'developer'
    elif any(kw in intr for kw in ['tech', 'crew', 'lighting', 'props', 'costumes']):
        tag = 'maintainer'

    member_id = f"MC-{random.randint(1000, 9999)}"

    # Create User
    user = User(
        member_id=member_id,
        name=data['name'],
        email=data['email'],
        password='aayam_default_password', # Default mock password for schema compliance
        phone=data['phone'],
        city=data['state'], # Map state/city
        state=data['state'],
        country=data['country'],
        pronouns=data['pronouns'],
        level='Ensemble', # Default level
        area_of_interest=True,
        availability=data['availability'],
        bio=data['bio'],
        portfolio=portfolio,
        interest=data['interest'],
        status='Pending',
        emergency_name=data['emergencyName'],
        emergency_phone=data['emergencyPhone']
    )

    try:
        db.session.add(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to write to database: {str(e)}'}), 500

    # Invalidate cached members list
    if r:
        try:
            r.delete('aayam:members_list')
            r.incr('aayam:member_count')
        except Exception:
            pass
    else:
        local_cache.pop('aayam:members_list', None)

    return jsonify({
        'status': 'success',
        'member': user.to_dict()
    }), 201

@app.route('/api/members', methods=['GET'])
def get_members():
    members_data = None

    # Try loading from Redis cache
    if r:
        try:
            cached = r.get('aayam:members_list')
            if cached:
                members_data = json.loads(cached)
                print("Cache HIT: members loaded from Redis.")
        except Exception:
            pass
    else:
        # Fallback local cache
        if 'aayam:members_list' in local_cache:
            members_data = local_cache['aayam:members_list']
            print("Cache HIT: members loaded from local memory.")

    if not members_data:
        # Query database
        print("Cache MISS: querying SQLite database.")
        users = User.query.all()
        members_data = [u.to_dict() for u in users]

        # Save back to cache (60 seconds expiration)
        if r:
            try:
                r.setex('aayam:members_list', 60, json.dumps(members_data))
            except Exception:
                pass
        else:
            local_cache['aayam:members_list'] = members_data

    return jsonify(members_data)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400

    email = data['email']
    lower_email = email.lower()

    # Query DB to check if user exists
    db_user = User.query.filter_by(email=email).first()
    
    if db_user:
        name = db_user.name
        initials = "".join([n[0] for n in name.split()]).upper()[:2]
        
        # Determine role based on tag
        if db_user.portfolio and ('github' in db_user.portfolio.lower() or 'code' in db_user.portfolio.lower()):
            role = "Core Maintainer"
        elif db_user.interest and any(kw in db_user.interest.lower() for kw in ['tech', 'crew', 'lighting', 'props', 'costumes']):
            role = "Production Coordinator"
        else:
            role = "Lead Actor & Member"
    else:
        # Fallback to mock persona rules if not in database
        if 'maintainer' in lower_email or 'admin' in lower_email:
            name = "Julian Devereux"
            role = "Core Maintainer"
            initials = "JD"
        elif 'sponsor' in lower_email or 'patron' in lower_email:
            name = "Lakshya Hari"
            role = "Grand Patron & Sponsor"
            initials = "LH"
        elif 'director' in lower_email:
            name = "Sneha Vyas"
            role = "Director & Coordinator"
            initials = "SV"
        elif 'coordinator' in lower_email:
            name = "Siddharth Verma"
            role = "Production Coordinator"
            initials = "SV"
        else:
            name = "Jayesh Dave"
            role = "Lead Actor & Member"
            initials = "JD"

    user_profile = {
        'name': name,
        'role': role,
        'initials': initials,
        'email': email
    }

    # Generate session token
    token = uuid.uuid4().hex

    # Save to session cache (1 hour TTL)
    if r:
        try:
            r.setex(f"session:{token}", 3600, json.dumps(user_profile))
        except Exception:
            pass
    else:
        local_sessions[token] = user_profile

    return jsonify({
        'status': 'success',
        'token': token,
        'user': user_profile
    })

@app.route('/api/logout', methods=['POST'])
def logout():
    data = request.json or {}
    token = data.get('token') or request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is required'}), 400

    # Strip Bearer prefix if present
    if token.startswith('Bearer '):
        token = token[7:]

    # Remove session
    deleted = False
    if r:
        try:
            deleted = r.delete(f"session:{token}") > 0
        except Exception:
            pass
    else:
        if token in local_sessions:
            del local_sessions[token]
            deleted = True

    return jsonify({
        'status': 'success',
        'logged_out': deleted
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
