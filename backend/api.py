import os
import json
import random
import jwt
import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Role, Admin, Event, Play
import redis

api_bp = Blueprint('api', __name__)

# Redis Config (with graceful fallback)
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
r = None
try:
    r = redis.Redis.from_url(REDIS_URL, socket_timeout=2)
    r.ping()
    print("Successfully connected to Redis server!")
except Exception as e:
    print(f"Redis server not available ({e}). Using local in-memory store for caching/sessions.")
    r = None

# Fallbacks for in-memory caching and session tokens
local_cache = {}
local_sessions = {}

@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'database': 'SQLite',
        'redis_connected': r is not None
    })

@api_bp.route('/join', methods=['POST'])
def join_club():
    data = request.json
    if not data:
        return jsonify({'error': 'Missing request body'}), 400

    required_fields = ['name', 'phone', 'state', 'country', 'pronouns', 'interest', 'availability', 'bio', 'emergencyName', 'emergencyPhone']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing field: {field}'}), 400

    # Auto-generate credentials: name@handle.com & name123
    clean_name = "".join(data['name'].strip().lower().split())
    if not clean_name:
        clean_name = "user"

    generated_email = f"{clean_name}@handle.com"
    generated_password = f"{clean_name}123"

    # Handle duplicate email by appending a counter
    existing = User.query.filter_by(email=generated_email).first()
    counter = 1
    while existing:
        generated_email = f"{clean_name}{counter}@handle.com"
        generated_password = f"{clean_name}{counter}123"
        existing = User.query.filter_by(email=generated_email).first()
        counter += 1

    # Determine role
    portfolio = data.get('portfolio', '')
    portfolio_lower = portfolio.lower()
    interest_lower = data['interest'].lower()
    
    role_name = "Member"
    if 'github.com' in portfolio_lower or 'dev' in portfolio_lower or 'code' in portfolio_lower:
        role_name = "Core Maintainer"
    elif any(kw in interest_lower for kw in ['tech', 'crew', 'lighting', 'props', 'costumes']):
        role_name = "Production Coordinator"

    role_obj = Role.query.filter_by(name=role_name).first()
    if not role_obj:
        role_obj = Role.query.filter_by(name="Member").first()

    member_id = f"MC-{random.randint(1000, 9999)}"

    # Create User with hashed password
    user = User(
        member_id=member_id,
        name=data['name'],
        email=generated_email,
        password=generate_password_hash(generated_password),
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
        status='Active',
        emergency_name=data['emergencyName'],
        emergency_phone=data['emergencyPhone']
    )

    if role_obj:
        user.roles.append(role_obj)

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
        'member': user.to_dict(),
        'generated_credentials': {
            'email': generated_email,
            'password': generated_password
        }
    }), 201

@api_bp.route('/members', methods=['GET'])
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

@api_bp.route('/plays', methods=['GET'])
def get_plays():
    plays = Play.query.all()
    return jsonify([p.to_dict() for p in plays])

@api_bp.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    events_list = []
    for e in events:
        events_list.append({
            'id': e.id,
            'title': e.title,
            'description': e.description,
            'category': e.category,
            'venue': e.venue,
            'date': e.event_date.strftime('%b %d, %Y') if e.event_date else '',
            'day': e.event_date.day if e.event_date else 1,
            'month': e.event_date.strftime('%b') if e.event_date else '',
            'image': e.poster,
            'status': e.status.lower() if e.status else 'upcoming',
            'timeRange': f"{e.start_time.strftime('%H:%M') if e.start_time else ''} - {e.end_time.strftime('%H:%M') if e.end_time else ''}",
            'host': e.admin.user.name if e.admin and e.admin.user else 'Aayam Ensemble',
            'priceInfo': 'Free Entry' if e.category == 'Meetups' else ('₹300 Tickets' if e.category == 'Plays' else 'Registration Required'),
            'capacity': f"{e.max_participants} seats" if e.max_participants else 'Open to All'
        })
    return jsonify(events_list)

@api_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Email and Password are required'}), 400

    email = data['email']
    password = data['password']

    # Query DB to check if user exists
    db_user = User.query.filter_by(email=email).first()
    
    if not db_user:
        return jsonify({'error': 'Invalid email or password'}), 401
        
    # Verify password hash or plain
    if not (check_password_hash(db_user.password, password) or db_user.password == password):
        return jsonify({'error': 'Invalid email or password'}), 401

    name = db_user.name
    initials = "".join([n[0] for n in name.split()]).upper()[:2]
    
    # Get role
    role = "Member"
    if db_user.roles:
        role = db_user.roles[0].name

    # Check if this user is in the admin table
    from models import Admin
    is_admin = Admin.query.filter_by(user_id=db_user.id).first() is not None

    user_profile = {
        'name': name,
        'role': role,
        'initials': initials,
        'email': email,
        'isAdmin': is_admin
    }

    # Generate JWT token
    JWT_SECRET = os.environ.get('JWT_SECRET', 'aayam_super_secret_key_67890')
    import datetime
    payload = {
        'sub': db_user.id,
        'email': db_user.email,
        'name': db_user.name,
        'role': role,
        'isAdmin': is_admin,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    # Save to session cache (24 hours TTL)
    if r:
        try:
            r.setex(f"session:{token}", 86400, json.dumps(user_profile))
        except Exception:
            pass
    else:
        local_sessions[token] = user_profile

    return jsonify({
        'status': 'success',
        'token': token,
        'user': user_profile
    })

@api_bp.route('/logout', methods=['POST'])
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

@api_bp.route('/profile/get', methods=['GET'])
def get_profile():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email parameter is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user.to_dict())

@api_bp.route('/profile/update', methods=['POST'])
def update_profile():
    data = request.json
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required to identify user'}), 400

    email = data['email']
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Update all database fields
    if 'name' in data:
        user.name = data['name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'age' in data:
        user.age = data['age']
    if 'address' in data:
        user.address = data['address']
    if 'city' in data:
        user.city = data['city']
    if 'state' in data:
        user.state = data['state']
    if 'country' in data:
        user.country = data['country']
    if 'pronouns' in data:
        user.pronouns = data['pronouns']
    if 'availability' in data:
        user.availability = data['availability']
    if 'bio' in data:
        user.bio = data['bio']
    if 'portfolio' in data:
        user.portfolio = data['portfolio']
    if 'interest' in data:
        user.interest = data['interest']
    if 'emergencyName' in data:
        user.emergency_name = data['emergencyName']
    if 'emergencyPhone' in data:
        user.emergency_phone = data['emergencyPhone']

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Database update failed: {str(e)}'}), 500

    # Invalidate cache
    if r:
        try:
            r.delete('aayam:members_list')
        except Exception:
            pass
    else:
        local_cache.pop('aayam:members_list', None)

    return jsonify({
        'status': 'success',
        'member': user.to_dict()
    })

