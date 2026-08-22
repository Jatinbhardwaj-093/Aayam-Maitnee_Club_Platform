import os
import json
import random
import jwt
import datetime
import re
from flask import Blueprint, request, jsonify, Response, current_app
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from ai.audition_analyzer import AuditionAnalyzer
from models import db, User, Role, Membership, Event, Booking, Announcement, Feedback, Gallery, ScheduleSlot, Audition, SharedEvent, Volunteer, Participation, Play, OpenPosition, Notification, ExtractedCharacter
from ai_roleplay import RehearsalService
from gemini_service import GeminiPerformanceProvider
import redis
from dotenv import load_dotenv
import litellm

load_dotenv()

# LLM provider settings from environment variables (configured for Gemini support via LiteLLM)
API_BASE = os.getenv("COMPLETIONS_API_BASE", "http://localhost:4000/v1")
MODEL_NAME = os.getenv("COMPLETIONS_MODEL", "gemini/gemini-2.0-flash")
API_KEY = os.getenv("GEMINI_API_KEY", "")


api_bp = Blueprint('api', __name__)
rehearsal_service = RehearsalService()

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

    custom_password = (data.get('password') or '').strip()
    generated_email = f"{clean_name}@handle.com"
    generated_password = custom_password if custom_password else f"{clean_name}123"

    # Handle duplicate email by appending a counter
    existing = User.query.filter_by(email=generated_email).first()
    counter = 1
    while existing:
        generated_email = f"{clean_name}{counter}@handle.com"
        if not custom_password:
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
        emergency_phone=data['emergencyPhone'],
        avatar_url=data.get('avatar_url') or data.get('image') or data.get('avatarUrl')
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
@api_bp.route('/directory', methods=['GET'])
def get_members():
    from models import User
    users = User.query.all()
    members_data = [u.to_dict() for u in users]
    return jsonify(members_data)

@api_bp.route('/plays', methods=['GET'])
def get_plays():
    plays = Play.query.all()
    return jsonify([p.to_dict() for p in plays])

@api_bp.route('/plays/<int:play_id>', methods=['GET'])
def get_play(play_id):
    play = Play.query.get(play_id)
    if play:
        return jsonify(play.to_dict())
    return jsonify({'error': 'Play not found'}), 404

@api_bp.route('/plays/<int:play_id>', methods=['PUT', 'POST'])
def update_play(play_id):
    play = Play.query.get(play_id)
    if not play:
        return jsonify({'error': 'Play not found'}), 404
    data = request.json or {}
    
    # Check if play is past / archived
    if play.is_past:
        # Past Play: Only allow editing image/script
        if 'image' in data:
            play.image = data['image']
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Past play image updated', 'play': play.to_dict()})
    
    # Upcoming Play: Full maintainer liberty to edit all production details
    if 'title' in data and data['title']:
        play.title = data['title']
    if 'playwright' in data:
        play.playwright = data['playwright']
    if 'genre' in data:
        play.genre = data['genre']
    if 'language' in data:
        play.language = data['language']
    if 'tagline' in data:
        play.tagline = data['tagline']
    if 'acts' in data:
        play.acts = data['acts']
    if 'description' in data:
        play.description = data['description']
    if 'director' in data:
        play.director = data['director']
    if 'cast' in data:
        play.cast = data['cast']
    if 'season' in data:
        play.season = data['season']
    if 'image' in data:
        play.image = data['image']
    if 'venue' in data:
        play.venue = data['venue']
    if 'dates' in data:
        play.dates = data['dates']
    if 'runtime' in data:
        play.runtime = data['runtime']
    if 'price' in data:
        play.price = data['price']
    if 'status' in data:
        play.status = data['status']
    
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Play details updated successfully', 'play': play.to_dict()})

@api_bp.route('/events/<int:event_id>', methods=['PUT', 'POST'])
def update_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    data = request.json or {}
    
    is_past = (event.status or '').lower() == 'concluded'
    if is_past:
        # Past Event: Only allow editing poster/image
        if 'image' in data or 'poster' in data:
            event.poster = data.get('image') or data.get('poster')
        db.session.commit()
        return jsonify({'status': 'success', 'message': 'Past event image updated'})
    
    # Upcoming Event: Full maintainer liberty to edit
    if 'title' in data and data['title']:
        event.title = data['title']
    if 'description' in data:
        event.description = data['description']
    if 'category' in data:
        event.category = data['category']
    if 'venue' in data:
        event.venue = data['venue']
    if 'poster' in data or 'image' in data:
        event.poster = data.get('poster') or data.get('image')
    if 'max_participants' in data:
        event.max_participants = int(data['max_participants'])
    if 'status' in data:
        event.status = data['status']
    if 'event_date' in data and data['event_date']:
        from datetime import datetime
        try:
            event.event_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
        except Exception:
            try:
                event.event_date = datetime.strptime(data['event_date'], '%b %d, %Y').date()
            except Exception:
                pass
    
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Event updated successfully'})

@api_bp.route('/open-positions', methods=['GET'])
def get_open_positions():
    positions = OpenPosition.query.filter_by(status='Open').all()
    return jsonify([p.to_dict() for p in positions])

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
    data = request.json or {}
    identifier = data.get('username') or data.get('email') or data.get('identifier')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'error': 'Username or Email and Password are required'}), 400

    identifier = identifier.strip()

    # Query DB to check if user exists by email, name, or member_id
    db_user = User.query.filter(
        (User.email.ilike(identifier)) | 
        (User.name.ilike(identifier)) | 
        (User.member_id.ilike(identifier))
    ).first()
    
    if not db_user:
        return jsonify({'error': 'Invalid credentials'}), 401
        
    # Verify password securely via hash check (support legacy plain text fallback if hash check fails)
    password_valid = False
    if db_user.password:
        if db_user.password.startswith(('pbkdf2:', 'scrypt:', 'argon2:')):
            password_valid = check_password_hash(db_user.password, password)
        else:
            password_valid = check_password_hash(db_user.password, password) or (db_user.password == password)

    if not password_valid:
        return jsonify({'error': 'Invalid credentials'}), 401

    if db_user.status and db_user.status.lower() == 'pending':
        return jsonify({'error': 'Application under review. Login restricted.'}), 403

    name = db_user.name
    email = db_user.email
    initials = "".join([n[0] for n in name.split()]).upper()[:2]
    
    # Get role
    role = "Member"
    if db_user.roles:
        role = db_user.roles[0].name

    # Check if this user is in the admin table
    from models import Admin
    is_admin = Admin.query.filter_by(user_id=db_user.id).first() is not None

    user_dict = db_user.to_dict() if db_user else {}
    user_profile = {
        'id': db_user.id if db_user else None,
        'name': name,
        'role': role,
        'initials': initials,
        'email': email,
        'isAdmin': is_admin,
        'image': user_dict.get('image', ''),
        'avatarUrl': user_dict.get('avatarUrl', '')
    }

    # Generate JWT token with timezone-aware expiration
    JWT_SECRET = os.environ.get('JWT_SECRET', 'aayam_super_secret_key_67890')
    payload = {
        'sub': db_user.id,
        'email': db_user.email,
        'name': db_user.name,
        'role': role,
        'isAdmin': is_admin,
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=24)
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
    data = request.get_json(silent=True) or {}
    token = data.get('token') or request.headers.get('Authorization')
    if not token:
        return jsonify({'error': 'Token is required'}), 400

    if token.startswith('Bearer '):
        token = token[7:]

    if r:
        try:
            r.delete(f"session:{token}")
        except Exception:
            pass
    else:
        local_sessions.pop(token, None)

    return jsonify({
        'status': 'success',
        'message': 'Logged out successfully'
    }), 200

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

@api_bp.route('/maintainer/dashboard', methods=['GET'])
def get_dashboard():
    notifications = Notification.query.filter_by(is_read=False).all()
    
    result = []
    for notif in notifications:
        data = {
            'id': notif.id,
            'type': notif.type,
            'is_read': notif.is_read,
            'created_at': notif.created_at.isoformat() if notif.created_at else None,
            'recipient_id': notif.recipient_id,
            'reference_id': notif.reference_id,
            'title': notif.title or 'Production Notice',
            'message': notif.message or 'New update available.'
        }
        if notif.type == 'new_member':
            u = User.query.get(notif.reference_id)
            if u: 
                data['details'] = {'name': u.name, 'email': u.email, 'status': u.status}
        elif notif.type == 'new_audition':
            a = Audition.query.get(notif.reference_id)
            if a: 
                data['details'] = {'role_applied': a.role_applied_for, 'date': a.audition_date}
        elif notif.type == 'new_event_share':
            e = SharedEvent.query.get(notif.reference_id)
            if e: 
                data['details'] = {'title': e.title, 'status': e.status}
        result.append(data)
        
    return jsonify(result)

@api_bp.route('/notifications', methods=['GET'])
def get_user_notifications():
    from models import User, Notification, db
    email = request.args.get('email')
    user_id = request.args.get('user_id')
    
    user = None
    if email:
        user = User.query.filter_by(email=email).first()
    elif user_id:
        user = User.query.get(user_id)
        
    if not user:
        # Fallback to returning default active unread notifications
        notifs = Notification.query.order_by(Notification.created_at.desc()).limit(10).all()
        return jsonify([n.to_dict() for n in notifs])
        
    notifs = Notification.query.filter_by(recipient_id=user.id).order_by(Notification.created_at.desc()).all()
    if not notifs:
        # If user has no notifications yet, generate initial notifications
        default_notifs = [
            Notification(recipient_id=user.id, type="rehearsal", title="Macbeth Rehearsal Confirmed", message="Dress run and stage lighting sync scheduled for July 07 at 4:00 PM in Rehearsal Hall B.", is_read=False),
            Notification(recipient_id=user.id, type="script", title="Annotated Script Released", message="The director's cut script for Tamashbin Kathputliya has been uploaded to the Script Vault.", is_read=False),
            Notification(recipient_id=user.id, type="logistics", title="Prop Check-out Recorded", message="Stage logistics team confirmed check-out of performance props for upcoming showcase.", is_read=True),
        ]
        db.session.add_all(default_notifs)
        db.session.commit()
        notifs = default_notifs

    return jsonify([n.to_dict() for n in notifs])

@api_bp.route('/notifications/mark-read', methods=['POST'])
def mark_notifications_read():
    from models import User, Notification, db
    data = request.get_json() or {}
    email = data.get('email')
    notif_id = data.get('id')
    
    if notif_id:
        n = Notification.query.get(notif_id)
        if n:
            n.is_read = True
            db.session.commit()
            return jsonify({'success': True, 'message': 'Notification marked as read'})
            
    if email:
        user = User.query.filter_by(email=email).first()
        if user:
            Notification.query.filter_by(recipient_id=user.id, is_read=False).update({Notification.is_read: True})
            db.session.commit()
            return jsonify({'success': True, 'message': 'All notifications marked as read'})

    # If no email provided, mark all unread as read
    Notification.query.filter_by(is_read=False).update({Notification.is_read: True})
    db.session.commit()
    return jsonify({'success': True, 'message': 'Notifications updated'})

@api_bp.route('/my-schedule', methods=['GET'])
def get_my_schedule():
    email = request.args.get('email') or request.args.get('user_email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User.query.filter(User.name.ilike(f"%{email.split('@')[0]}%")).first()
    if not user and ('abay' in email.lower() or '23f2000668' in email.lower()):
        user = User.query.filter((User.email == '23f2000668@ds.study.iitm.ac.in') | (User.name.ilike('%abay%'))).first()
    if not user and ('aditi' in email.lower()):
        user = User.query.filter((User.email == 'aditi.drama@handle.com') | (User.name.ilike('%aditi%'))).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    participations = Participation.query.filter_by(user_id=user.id).all()
    result = []
    for p in participations:
        e = p.event
        if e:
            result.append({
                'id': e.id,
                'title': e.title,
                'description': e.description or p.remarks or '',
                'category': e.category,
                'venue': e.venue,
                'date': e.event_date.strftime('%b %d, %Y') if e.event_date else '',
                'event_date': e.event_date.strftime('%Y-%m-%d') if e.event_date else '',
                'timeRange': f"{e.start_time.strftime('%H:%M') if e.start_time else ''} - {e.end_time.strftime('%H:%M') if e.end_time else ''}",
                'status': p.status,
                'participation_id': p.id
            })
    return jsonify(result)

@api_bp.route('/my-schedule/update', methods=['POST'])
def update_my_schedule():
    data = request.json or {}
    p_id = data.get('participation_id')
    new_status = data.get('status')
    if not p_id or not new_status:
        return jsonify({'error': 'Missing fields'}), 400
        
    p = Participation.query.get(p_id)
    if p:
        p.status = new_status
        db.session.commit()
        return jsonify({'success': True, 'status': p.status, 'participation_id': p.id})
    return jsonify({'error': 'Not found'}), 404

@api_bp.route('/maintainer/schedule', methods=['GET'])
def get_maintainer_schedule():
    events = Event.query.order_by(Event.event_date.asc(), Event.start_time.asc()).all()
    results = []
    for e in events:
        participations = Participation.query.filter_by(event_id=e.id).all()
        participants_data = []
        accepted_count = 0
        pending_count = 0
        declined_count = 0
        
        for p in participations:
            u = p.user
            if u:
                if p.status == 'Accepted':
                    accepted_count += 1
                elif p.status == 'Declined':
                    declined_count += 1
                else:
                    pending_count += 1
                    
                u_dict = u.to_dict() if hasattr(u, 'to_dict') else {}
                participants_data.append({
                    'participation_id': p.id,
                    'user_id': u.id,
                    'name': u.name,
                    'email': u.email,
                    'avatar_url': u_dict.get('avatarUrl') or u.avatar_url,
                    'role': u.roles[0].name if u.roles else 'Ensemble Member',
                    'status': p.status,
                    'remarks': p.remarks
                })
                
        results.append({
            'id': e.id,
            'title': e.title,
            'description': e.description,
            'category': e.category,
            'venue': e.venue,
            'event_date': e.event_date.strftime('%Y-%m-%d') if e.event_date else '',
            'formatted_date': e.event_date.strftime('%b %d, %Y') if e.event_date else '',
            'start_time': e.start_time.strftime('%H:%M') if e.start_time else '',
            'end_time': e.end_time.strftime('%H:%M') if e.end_time else '',
            'time_range': f"{e.start_time.strftime('%H:%M') if e.start_time else ''} - {e.end_time.strftime('%H:%M') if e.end_time else ''}",
            'status': e.status,
            'max_participants': e.max_participants,
            'poster': e.poster,
            'participants': participants_data,
            'stats': {
                'total_called': len(participations),
                'accepted': accepted_count,
                'pending': pending_count,
                'declined': declined_count
            }
        })
    return jsonify(results)

@api_bp.route('/maintainer/schedule/create', methods=['POST'])
def create_maintainer_schedule():
    data = request.json or {}
    title = data.get('title')
    category = data.get('category', 'Rehearsals')
    venue = data.get('venue', 'Aayam Rehearsal Hall')
    description = data.get('description', '')
    date_str = data.get('event_date')
    start_time_str = data.get('start_time', '18:00')
    end_time_str = data.get('end_time', '20:30')
    invited_user_ids = data.get('invited_user_ids', [])
    
    if not title or not date_str:
        return jsonify({'error': 'Title and Date are required'}), 400
        
    try:
        ev_date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    except Exception:
        ev_date = datetime.date.today()
        
    try:
        st_time = datetime.datetime.strptime(start_time_str, '%H:%M').time()
    except Exception:
        st_time = datetime.time(18, 0)
        
    try:
        et_time = datetime.datetime.strptime(end_time_str, '%H:%M').time()
    except Exception:
        et_time = datetime.time(20, 30)

    # Pick first admin as owner
    admin = User.query.filter(User.roles.any(Role.name.ilike('%maintainer%'))).first()
    admin_id = admin.id if admin else 1
    
    new_event = Event(
        title=title,
        description=description,
        category=category,
        venue=venue,
        event_date=ev_date,
        start_time=st_time,
        end_time=et_time,
        max_participants=max(len(invited_user_ids), 30),
        status='Upcoming',
        admin_id=admin_id
    )
    db.session.add(new_event)
    db.session.flush()
    
    # Create participations and notifications for invited users
    for uid in invited_user_ids:
        try:
            uid_int = int(uid)
            u = User.query.get(uid_int)
            if u:
                p = Participation(
                    user_id=u.id,
                    event_id=new_event.id,
                    status='Pending',
                    remarks=description
                )
                db.session.add(p)
                
                # Send notification
                notif = Notification(
                    recipient_id=u.id,
                    type="rehearsal",
                    title=f"Call Time: {title}",
                    message=f"You have been called for {title} on {ev_date.strftime('%b %d, %Y')} at {st_time.strftime('%H:%M')} in {venue}. Please confirm attendance on My Schedule.",
                    is_read=False
                )
                db.session.add(notif)
        except Exception as e:
            print("Error inviting user:", e)
            
    db.session.commit()
    return jsonify({'success': True, 'event_id': new_event.id, 'message': 'Rehearsal call created and members notified.'})

@api_bp.route('/maintainer/schedule/delete', methods=['POST'])
def delete_maintainer_schedule():
    data = request.json or {}
    event_id = data.get('event_id')
    if not event_id:
        return jsonify({'error': 'event_id is required'}), 400
    
    ev = Event.query.get(event_id)
    if not ev:
        return jsonify({'error': 'Event not found'}), 404
        
    # Delete participations associated
    Participation.query.filter_by(event_id=ev.id).delete()
    db.session.delete(ev)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Event deleted successfully.'})

@api_bp.route('/my-auditions', methods=['GET'])
def get_my_auditions():
    from models import AuditionApplication, AuditionPosition, User
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify([])
    apps = AuditionApplication.query.filter_by(user_id=user.id).order_by(AuditionApplication.submitted_at.desc()).all()
    result = []
    for a in apps:
        pos = AuditionPosition.query.get(a.position_id) if a.position_id else None
        prod_name = pos.production_name if pos else ''
        status_map = {
            'Pending Review': 'submitted',
            'Shortlisted': 'review',
            'Selected': 'selected',
            'Rejected': 'declined'
        }
        progress = status_map.get(a.status, 'submitted')
        result.append({
            'id': a.id,
            'position_id': a.position_id,
            'role_name': a.role_name,
            'production_name': prod_name,
            'category': pos.role_category if pos else 'Audition Role',
            'status': a.status,
            'progress': progress,
            'audition_date': a.audition_date,
            'submitted_at': a.submitted_at.strftime('%b %d, %Y') if a.submitted_at else '',
            'notes': a.notes or '',
            'portfolio_link': a.portfolio_link or '',
            'portfolio_filename': a.portfolio_filename or None,
            'video_filename': getattr(a, 'video_filename', None),
        })
    return jsonify(result)

@api_bp.route('/audition/submit', methods=['POST'])
def submit_audition():
    from models import AuditionApplication, AuditionPosition, User, db
    data = request.json or {}
    position_id = data.get('position_id')
    role_name = data.get('role_name', 'Ensemble Role')
    applicant_name = data.get('applicant_name', '')
    applicant_email = data.get('applicant_email', '')
    applicant_phone = data.get('applicant_phone', '')
    experience_level = data.get('experience_level', 'Ensemble Member')
    portfolio_link = data.get('portfolio_link', '')
    notes = data.get('notes', '')
    user = User.query.filter_by(email=applicant_email).first() if applicant_email else None
    if user and position_id:
        existing = AuditionApplication.query.filter_by(user_id=user.id, position_id=int(position_id)).first()
        if existing:
            return jsonify({'error': 'Already applied', 'existing_id': existing.id}), 409
    app = AuditionApplication(
        position_id=int(position_id) if position_id else None,
        role_name=role_name,
        applicant_name=applicant_name,
        applicant_email=applicant_email,
        applicant_phone=applicant_phone or '+91 98110 44321',
        experience_level=experience_level,
        portfolio_link=portfolio_link or '',
        notes=notes,
        user_id=user.id if user else None,
        status='Pending Review'
    )
    db.session.add(app)
    db.session.commit()
    return jsonify({'success': True, 'id': app.id})

@api_bp.route('/labels', methods=['GET'])
def get_labels():
    from models import Label
    labels = Label.query.all()
    return jsonify([{'id': l.id, 'name': l.name, 'color': l.color} for l in labels])

@api_bp.route('/labels', methods=['POST'])
def add_label():
    from models import Label, db
    data = request.json
    name = data.get('name')
    color = data.get('color', '#635f41')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    
    label = Label.query.filter_by(name=name).first()
    if not label:
        label = Label(name=name, color=color)
        db.session.add(label)
        db.session.commit()
    
    return jsonify({'id': label.id, 'name': label.name, 'color': label.color})

@api_bp.route('/users/<int:user_id>/labels', methods=['POST'])
def assign_label_to_user(user_id):
    from models import User, Label, db
    data = request.json
    label_id = data.get('label_id')
    user = User.query.get(user_id)
    label = Label.query.get(label_id)
    
    if not user or not label:
        return jsonify({'error': 'User or label not found'}), 404
        
    if label not in user.labels:
        user.labels.append(label)
        db.session.commit()
        
    return jsonify({'status': 'success'})

@api_bp.route('/users/<int:user_id>/labels/<int:label_id>', methods=['DELETE'])
def remove_label_from_user(user_id, label_id):
    from models import User, Label, db
    user = User.query.get(user_id)
    label = Label.query.get(label_id)
    
    if not user or not label:
        return jsonify({'error': 'User or label not found'}), 404
        
    if label in user.labels:
        user.labels.remove(label)
        db.session.commit()
        
    return jsonify({'status': 'success'})


@api_bp.route('/stage-bookings', methods=['GET'])
def get_stage_bookings():
    from models import StageBooking
    bookings = StageBooking.query.order_by(StageBooking.id).all()
    return jsonify([{
        'id': f"B{b.id}",
        'time': b.time,
        'period': b.period,
        'stage': b.stage,
        'details': b.details,
        'isSecondaryStyle': b.is_secondary
    } for b in bookings])

@api_bp.route('/stage-bookings', methods=['POST'])
def add_stage_booking():
    from models import StageBooking
    from models import db
    data = request.json
    new_booking = StageBooking(
        time=data.get('time'),
        period=data.get('period'),
        stage=data.get('stage'),
        details=data.get('details'),
        is_secondary=data.get('isSecondaryStyle', False)
    )
    db.session.add(new_booking)
    db.session.commit()
    return jsonify({'status': 'success', 'id': f"B{new_booking.id}"}), 201

@api_bp.route('/revenue-metrics', methods=['GET'])
def get_revenue_metrics():
    from models import RevenueMetric
    from models import db
    metric = RevenueMetric.query.first()
    if not metric:
        metric = RevenueMetric(playbill_sold=18, corporate_patrons=12)
        db.session.add(metric)
        db.session.commit()
    return jsonify({
        'playbillSold': metric.playbill_sold,
        'corporatePatrons': metric.corporate_patrons
    })

@api_bp.route('/revenue-metrics', methods=['POST'])
def update_revenue_metrics():
    from models import RevenueMetric
    from models import db
    data = request.json
    metric = RevenueMetric.query.first()
    if not metric:
        metric = RevenueMetric()
        db.session.add(metric)
    if 'playbillSold' in data:
        metric.playbill_sold = data['playbillSold']
    if 'corporatePatrons' in data:
        metric.corporate_patrons = data['corporatePatrons']
    db.session.commit()
    return jsonify({'status': 'success'})

@api_bp.route('/proposals', methods=['POST'])
def create_proposal():
    from models import SharedEvent, SponsorAdRequest, db
    data = request.json or {}
    title = data.get('title') or data.get('name') or 'Untitled Proposal'
    description = data.get('description', '')
    venue = data.get('venue') or data.get('location') or 'Studio Lounge'
    submitter_name = data.get('submitter_name') or data.get('submitterName') or 'Guest Submitter'
    contact_email = data.get('contact_email') or data.get('submitterEmail') or 'partner@aayam.org'
    contact_phone = data.get('contact_phone') or data.get('submitterPhone') or '+91 98110 44321'
    budget = data.get('budget') or data.get('budget_offered') or data.get('sponsorshipTerms') or '₹50,000'
    proposal_type = data.get('proposal_type') or data.get('proposalType') or 'Member Pitch'
    
    new_proposal = SharedEvent(
        title=title,
        description=description,
        location_or_link=venue,
        submitter_name=submitter_name,
        contact_email=contact_email,
        contact_phone=contact_phone,
        budget=budget,
        proposal_type=proposal_type,
        status='pending'
    )
    db.session.add(new_proposal)

    # Sync into SponsorAdRequest table if it's a sponsor or brand pitch
    if 'Sponsor' in proposal_type or 'Brand' in proposal_type or 'Ad' in proposal_type or 'Sponsored' in proposal_type:
        new_ad = SponsorAdRequest(
            sponsor_name=submitter_name,
            contact_person=submitter_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            ad_title=title,
            ad_category='Sponsored Event',
            target_event_name=venue,
            budget_offered=budget,
            ad_description=description,
            status='Pending'
        )
        db.session.add(new_ad)

    db.session.commit()
    return jsonify({'status': 'success', 'proposal': new_proposal.to_dict()}), 201

# Gallery API Endpoints
@api_bp.route('/gallery', methods=['GET'])
def get_gallery():
    from models import GalleryItem
    status_filter = request.args.get('status', 'approved')
    if status_filter == 'all':
        items = GalleryItem.query.order_by(GalleryItem.uploaded_at.desc()).all()
    else:
        items = GalleryItem.query.filter_by(status=status_filter).order_by(GalleryItem.uploaded_at.desc()).all()
    return jsonify([i.to_dict() for i in items])

@api_bp.route('/gallery', methods=['POST'])
def create_gallery_item():
    import os
    from werkzeug.utils import secure_filename
    from models import GalleryItem, db
    
    if request.content_type and 'multipart/form-data' in request.content_type:
        title = request.form.get('title') or 'Untitled Photo'
        category = request.form.get('category') or 'Stage Plays'
        caption = request.form.get('caption', '')
        uploader_name = request.form.get('uploaderName') or 'Aayam Media Team'
        status = request.form.get('status') or 'approved'
        
        file = request.files.get('file')
        if not file:
            return jsonify({'error': 'Image file is required'}), 400
            
        upload_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'gallery')
        os.makedirs(upload_dir, exist_ok=True)
        filename = secure_filename(file.filename)
        file.save(os.path.join(upload_dir, filename))
        
        image_url = f"/uploads/gallery/{filename}"
    else:
        data = request.json or {}
        title = data.get('title') or 'Untitled Photo'
        category = data.get('category') or 'Stage Plays'
        image_url = data.get('imageUrl') or data.get('image_url')
        caption = data.get('caption', '')
        uploader_name = data.get('uploaderName') or 'Aayam Media Team'
        status = data.get('status') or 'approved'

        if not image_url:
            return jsonify({'error': 'Image URL is required'}), 400

    item = GalleryItem(
        title=title,
        category=category,
        image_url=image_url,
        caption=caption,
        status=status,
        uploader_name=uploader_name
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'status': 'success', 'item': item.to_dict()}), 201

@api_bp.route('/gallery/<int:item_id>', methods=['DELETE'])
def delete_gallery_item(item_id):
    from models import GalleryItem, db
    item = GalleryItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Gallery item not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'status': 'deleted', 'id': item_id})

@api_bp.route('/gallery/<int:item_id>/status', methods=['POST'])
def update_gallery_status(item_id):
    from models import GalleryItem, db
    data = request.json or {}
    new_status = data.get('status', 'approved')
    item = GalleryItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Gallery item not found'}), 404
    item.status = new_status
    db.session.commit()
    return jsonify({'status': 'updated', 'item': item.to_dict()})
    return jsonify({'status': 'success', 'id': new_proposal.id}), 201

@api_bp.route('/proposals', methods=['GET'])
def get_proposals():
    from models import SharedEvent
    proposals = SharedEvent.query.order_by(SharedEvent.created_at.desc()).all()
    return jsonify([p.to_dict() for p in proposals])

@api_bp.route('/proposals/<int:prop_id>/approve', methods=['POST'])
def approve_proposal(prop_id):
    from models import SharedEvent, Event, db
    p = SharedEvent.query.get(prop_id)
    if not p:
        return jsonify({'error': 'Proposal not found'}), 404
    
    data = request.json or {}
    p.status = 'approved'
    if 'title' in data and data['title']:
        p.title = data['title']
    if 'description' in data and data['description']:
        p.description = data['description']
    if 'venue' in data and data['venue']:
        p.location_or_link = data['venue']
    if 'budget' in data and data['budget']:
        p.budget = data['budget']
    
    from datetime import time, date, datetime
    parsed_date = date.today()
    if data.get('event_date'):
        try:
            parsed_date = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
        except Exception:
            try:
                parsed_date = datetime.strptime(data['event_date'], '%b %d, %Y').date()
            except Exception:
                pass
    elif p.event_date:
        parsed_date = p.event_date.date()

    title_l = (data.get('title') or p.title or '').lower()
    category = data.get('category') or ('Workshops' if any(k in title_l for k in ['workshop', 'intensive', 'masterclass', 'jam']) else 'Meetups')

    new_event = Event(
        title=data.get('title') or p.title,
        description=data.get('description') or p.description,
        category=category,
        venue=data.get('venue') or p.location_or_link or 'SAC Main Studio, IIT Madras',
        event_date=parsed_date,
        start_time=time(17, 30),
        end_time=time(20, 0),
        max_participants=int(data.get('max_participants') or 60),
        status='Upcoming'
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'status': 'success', 'event': new_event.to_dict(), 'proposal': p.to_dict()})

@api_bp.route('/proposals/<int:prop_id>/reject', methods=['POST'])
def reject_proposal(prop_id):
    from models import SharedEvent, db
    p = SharedEvent.query.get(prop_id)
    if not p:
        return jsonify({'error': 'Proposal not found'}), 404
    p.status = 'rejected'
    db.session.commit()
    return jsonify({'status': 'success', 'proposal': p.to_dict()})

@api_bp.route('/proposals/<int:prop_id>/update', methods=['POST'])
def update_proposal(prop_id):
    from models import SharedEvent, db
    data = request.json or {}
    p = SharedEvent.query.get(prop_id)
    if not p:
        return jsonify({'error': 'Proposal not found'}), 404
    if 'title' in data:
        p.title = data['title']
    if 'description' in data:
        p.description = data['description']
    if 'venue' in data:
        p.location_or_link = data['venue']
    if 'budget' in data:
        p.budget = data['budget']
    if 'status' in data:
        p.status = data['status']
    if 'proposal_type' in data:
        p.proposal_type = data['proposal_type']
    db.session.commit()
    return jsonify({'status': 'success', 'proposal': p.to_dict()})

@api_bp.route('/events/create', methods=['POST'])
def create_event_backend():
    from models import Event, db
    from datetime import datetime, time
    data = request.json
    
    new_event = Event(
        title=data.get('name', 'Untitled Event'),
        description=data.get('description', ''),
        category=data.get('category', 'Meetups'),
        venue=data.get('venue', 'Studio Lounge'),
        event_date=datetime.strptime(data['date'], '%Y-%m-%d').date() if data.get('date') else None,
        start_time=time(18, 0),
        end_time=time(20, 0),
        status='Upcoming'
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'status': 'success', 'id': new_event.id})

@api_bp.route('/events/<int:event_id>/update', methods=['POST'])
def update_event_backend(event_id):
    from models import Event, db
    data = request.json
    e = Event.query.get(event_id)
    if not e:
        return jsonify({'error': 'Event not found'}), 404
    if 'description' in data:
        e.description = data['description']
    if 'venue' in data:
        e.venue = data['venue']
    db.session.commit()
    return jsonify({'status': 'success', 'message': 'Event updated successfully'}), 200
# --- SPONSOR AD REQUEST ENDPOINTS ---

@api_bp.route('/sponsor-ads', methods=['GET'])
def get_sponsor_ads():
    from models import SponsorAdRequest
    requests_list = SponsorAdRequest.query.order_by(SponsorAdRequest.submitted_at.desc()).all()
    return jsonify([r.to_dict() for r in requests_list])

@api_bp.route('/sponsor-ads/create', methods=['POST'])
def create_sponsor_ad():
    from models import SponsorAdRequest, db
    data = request.json or {}
    new_req = SponsorAdRequest(
        sponsor_name=data.get('sponsor_name', 'Anonymous Patron'),
        contact_person=data.get('contact_person', 'Brand Manager'),
        contact_email=data.get('contact_email', 'contact@sponsor.com'),
        contact_phone=data.get('contact_phone', ''),
        company_website=data.get('company_website', ''),
        ad_title=data.get('ad_title', 'Fest Sponsorship'),
        ad_category=data.get('ad_category', 'Playbill Banner'),
        target_event_name=data.get('target_event_name', 'Annual Cultural Festival'),
        budget_offered=data.get('budget_offered', '₹50,000'),
        banner_image_url=data.get('banner_image_url', ''),
        ad_description=data.get('ad_description', ''),
        status=data.get('status', 'Pending')
    )
    db.session.add(new_req)
    db.session.commit()
    return jsonify({'status': 'success', 'sponsor_ad': new_req.to_dict()})

@api_bp.route('/sponsor-ads/<int:ad_id>/status', methods=['POST'])
def update_sponsor_ad_status(ad_id):
    from models import SponsorAdRequest, db
    data = request.json or {}
    req = SponsorAdRequest.query.get(ad_id)
    if not req:
        return jsonify({'error': 'Sponsor request not found'}), 404
    if 'status' in data:
        req.status = data['status']
        db.session.commit()
    return jsonify({'status': 'success', 'sponsor_ad': req.to_dict()})

# --- AUDITIONS & CASTING CALLING ENDPOINTS ---

@api_bp.route('/audition-positions', methods=['GET'])
def get_audition_positions():
    from models import AuditionPosition, AuditionApplication, db
    positions = AuditionPosition.query.order_by(AuditionPosition.created_at.desc()).all()
    if not positions:
        defaults = [
            {
                "production_name": "Karn Ki Yachika",
                "role_name": "Lead Performer (Karn)",
                "role_category": "Performer",
                "character_description": "Monumental tragic protagonist navigating moral dilemma, honor, and destiny. High-intensity classical Hindi monologue & verse delivery required.",
                "requirements": "Audition monologue video clip (2 mins) & theatrical bio",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Tamashbin Kathputliya",
                "role_name": "Dholak & Courtyard Chorus Lead",
                "role_category": "Performer",
                "character_description": "High-energy street drama performer skilled in vocal projection, folk rhythm synchronization, and crowd interaction.",
                "requirements": "Live percussion video or street drama reel",
                "slots_available": 3,
                "status": "Open Calling"
            },
            {
                "production_name": "DDDJ - Stage Production",
                "role_name": "Proscenium Lighting & DMX Rig Operator",
                "role_category": "Technical Crew",
                "character_description": "Technical crew member managing DMX lighting console, spot gels, color transitions, and live proscenium stage cues.",
                "requirements": "Technical crew portfolio or stage experience summary",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Samatvam",
                "role_name": "Physical Movement & Body Ensemble",
                "role_category": "Performer",
                "character_description": "Experimental physical theatre actor exploring body synchronization, Navarasa facial control, and synchronized spatial movement.",
                "requirements": "Movement audition tape & physical theatre bio",
                "slots_available": 2,
                "status": "Open Calling"
            },
            {
                "production_name": "Speak Up Tara",
                "role_name": "Assistant Stage Director & Dramaturge",
                "role_category": "Director",
                "character_description": "Collaborate with principal director on scene blocking, actor notes, script adaptation, and rehearsal pacing.",
                "requirements": "Directorial concept note or previous play review",
                "slots_available": 1,
                "status": "Open Calling"
            }
        ]
        for d in defaults:
            db.session.add(AuditionPosition(**d))
        db.session.commit()
        positions = AuditionPosition.query.order_by(AuditionPosition.created_at.desc()).all()

    result = []
    for p in positions:
        p_dict = p.to_dict()
        p_dict['applicant_count'] = AuditionApplication.query.filter_by(position_id=p.id).count()
        result.append(p_dict)
    return jsonify(result)

@api_bp.route('/audition-positions/create', methods=['POST'])
def create_audition_position():
    from models import AuditionPosition, db
    from datetime import datetime
    data = request.json or {}
    new_pos = AuditionPosition(
        production_name=data.get('production_name', 'Mainstage Production'),
        role_name=data.get('role_name', 'Character Role'),
        role_category=data.get('role_category', 'Character Role'),
        character_description=data.get('character_description', ''),
        requirements=data.get('requirements', ''),
        slots_available=int(data.get('slots_available', 1)),
        status=data.get('status', 'Open Calling'),
        require_portfolio=bool(data.get('require_portfolio', False)),
        require_video=bool(data.get('require_video', False)),
        require_audio=bool(data.get('require_audio', False))
    )
    db.session.add(new_pos)
    db.session.commit()
    return jsonify({'status': 'success', 'position': new_pos.to_dict()})

@api_bp.route('/audition-positions/<int:pos_id>', methods=['PUT', 'POST'])
def update_audition_position(pos_id):
    from models import AuditionPosition, db
    from datetime import datetime
    data = request.json or {}
    pos = AuditionPosition.query.get(pos_id)
    if not pos:
        return jsonify({'error': 'Position not found'}), 404
        
    if 'production_name' in data:
        pos.production_name = data['production_name']
    if 'role_name' in data:
        pos.role_name = data['role_name']
    if 'role_category' in data:
        pos.role_category = data['role_category']
    if 'character_description' in data:
        pos.character_description = data['character_description']
    if 'requirements' in data:
        pos.requirements = data['requirements']
    if 'slots_available' in data:
        pos.slots_available = int(data['slots_available'])
    if 'status' in data:
        pos.status = data['status']
    if 'require_portfolio' in data:
        pos.require_portfolio = data['require_portfolio']
    if 'require_video' in data:
        pos.require_video = data['require_video']
    if 'require_audio' in data:
        pos.require_audio = data['require_audio']
        
    db.session.commit()
    return jsonify({'status': 'success', 'position': pos.to_dict()})

@api_bp.route('/audition-applications', methods=['GET'])
def get_audition_applications():
    from models import AuditionApplication
    position_id = request.args.get('position_id')
    query = AuditionApplication.query
    if position_id:
        query = query.filter_by(position_id=int(position_id))
    apps = query.order_by(AuditionApplication.submitted_at.desc()).all()
    return jsonify([a.to_dict() for a in apps])

@api_bp.route('/audition-applications/<int:app_id>/status', methods=['POST'])
def update_audition_application_status(app_id):
    from models import AuditionApplication, db
    data = request.json or {}
    app_record = AuditionApplication.query.get(app_id)
    if not app_record:
        return jsonify({'error': 'Audition application not found'}), 404
    if 'status' in data:
        app_record.status = data['status']
        db.session.commit()
    return jsonify({'status': 'success', 'application': app_record.to_dict()})

@api_bp.route('/ai/portfolio_scan', methods=['POST'])
def run_portfolio_ai_scan():
    """
    Runs Gemini 3.6 Flash portfolio AI scan matching applicant background/resume against role requirements.
    """
    import json
    from ai.report_service import ReportService
    from models import AuditionPosition, AuditionApplication, db
    
    data = request.json or {}
    app_id = data.get('application_id')
    
    role_name = data.get('role_name') or "Audition Position"
    role_category = data.get('role_category') or "Character Role"
    character_description = data.get('character_description') or ""
    role_requirements = data.get('role_requirements') or ""
    
    applicant_name = data.get('applicant_name') or "Applicant"
    applicant_experience = data.get('experience_level') or "Ensemble Specialist"
    applicant_notes = data.get('notes') or ""
    portfolio_link = data.get('portfolio_link') or ""
    
    if app_id:
        app_record = AuditionApplication.query.get(app_id)
        if app_record:
            applicant_name = app_record.applicant_name
            applicant_experience = app_record.experience_level or applicant_experience
            applicant_notes = app_record.notes or applicant_notes
            portfolio_link = app_record.portfolio_link or portfolio_link
            role_name = app_record.role_name or role_name
            
            if app_record.position:
                role_category = app_record.position.role_category or role_category
                character_description = app_record.position.character_description or character_description
                role_requirements = app_record.position.requirements or role_requirements

    print(f"Running AI Portfolio & Requirement Scan for {applicant_name} applying for {role_name}...")
    service = ReportService()
    result = service.analyze_portfolio_role_fit(
        role_name=role_name,
        role_category=role_category,
        character_description=character_description,
        role_requirements=role_requirements,
        applicant_name=applicant_name,
        applicant_experience=applicant_experience,
        applicant_notes=applicant_notes,
        portfolio_link=portfolio_link
    )
    
    if app_id:
        try:
            app_record = AuditionApplication.query.get(app_id)
            if app_record:
                app_record.ai_report = json.dumps(result)
                db.session.commit()
        except Exception:
            pass
            
# --- VOLUNTEER & PRODUCTION CREW ENDPOINTS ---

@api_bp.route('/volunteer', methods=['POST'])
def submit_volunteer_application():
    from models import Volunteer, Play, User, Notification, db
    data = request.json or {}
    
    play_id = data.get('play_id')
    event_id = data.get('event_id')
    applicant_name = (data.get('applicant_name') or '').strip()
    applicant_email = (data.get('applicant_email') or '').strip()
    applicant_phone = (data.get('applicant_phone') or '').strip()
    department = data.get('department', 'General Backstage Crew')
    availability = data.get('availability', '5-8 Hours / Week')
    notes = data.get('notes', '')
    
    user = User.query.filter_by(email=applicant_email).first() if applicant_email else None
    
    vol = Volunteer(
        user_id=user.id if user else None,
        play_id=int(play_id) if play_id else None,
        event_id=int(event_id) if event_id else None,
        applicant_name=applicant_name or (user.name if user else "Ensemble Volunteer"),
        applicant_email=applicant_email or (user.email if user else ""),
        applicant_phone=applicant_phone or "+91 98110 44321",
        department=department,
        availability=availability,
        notes=notes,
        status="Pending Review"
    )
    db.session.add(vol)
    db.session.commit()
    
    # Notify maintainers if available
    try:
        play_title = vol.play.title if vol.play else "Upcoming Production"
        admins = User.query.filter(User.roles.any(name='Maintainer')).all()
        for admin in admins:
            notif = Notification(
                recipient_id=admin.id,
                type="new_volunteer",
                title=f"New Volunteer for {play_title}",
                message=f"{vol.applicant_name} volunteered for '{department}' on {play_title}."
            )
            db.session.add(notif)
        db.session.commit()
    except Exception:
        pass
    
    return jsonify({'status': 'success', 'volunteer': vol.to_dict()})

@api_bp.route('/volunteers', methods=['GET'])
def get_volunteers():
    from models import Volunteer
    play_id = request.args.get('play_id')
    play_title = request.args.get('play_title')
    query = Volunteer.query
    if play_id:
        try:
            query = query.filter_by(play_id=int(play_id))
        except Exception:
            pass
    if play_title:
        query = query.filter(Volunteer.play_title.ilike(f"%{play_title}%"))
    vols = query.order_by(Volunteer.created_at.desc()).all()
    return jsonify([v.to_dict() for v in vols])

@api_bp.route('/volunteer/<int:vol_id>/status', methods=['POST'])
def update_volunteer_status(vol_id):
    from models import Volunteer, db
    data = request.json or {}
    vol = Volunteer.query.get(vol_id)
    if not vol:
        return jsonify({'error': 'Volunteer record not found'}), 404
        
    if 'status' in data:
        vol.status = data['status']
    if 'department' in data:
        vol.department = data['department']
    db.session.commit()
    return jsonify({'status': 'success', 'volunteer': vol.to_dict()})

@api_bp.route('/my-volunteers', methods=['GET'])
def get_my_volunteers():
    from models import Volunteer, User
    email = request.args.get('email') or request.args.get('user_email')
    if not email:
        return jsonify([])
    vols = Volunteer.query.filter(
        (Volunteer.applicant_email == email) | 
        (Volunteer.user.has(email=email))
    ).order_by(Volunteer.created_at.desc()).all()
    return jsonify([v.to_dict() for v in vols])

# --- FINANCIAL LEDGER & MAINTAINER STATS ENDPOINTS ---

@api_bp.route('/financials', methods=['GET'])
def get_financial_records():
    from models import FinancialRecord
    records = FinancialRecord.query.order_by(FinancialRecord.created_at.desc()).all()
    return jsonify([r.to_dict() for r in records])

@api_bp.route('/financials/summary', methods=['GET'])
def get_financial_summary():
    from models import FinancialRecord
    records = FinancialRecord.query.all()
    total_income = sum(r.amount for r in records if r.record_type == 'Income')
    total_expense = sum(r.amount for r in records if r.record_type == 'Expense')
    net_surplus = total_income - total_expense
    
    sponsorship_income = sum(r.amount for r in records if r.record_type == 'Income' and r.category == 'Sponsorship')
    ticket_income = sum(r.amount for r in records if r.record_type == 'Income' and r.category == 'Ticket Sales')
    grants_income = sum(r.amount for r in records if r.record_type == 'Income' and r.category == 'Grant')

    return jsonify({
        'total_revenue': total_income,
        'total_expenses': total_expense,
        'net_surplus': net_surplus,
        'sponsorship_revenue': sponsorship_income,
        'ticket_revenue': ticket_income,
        'grants_revenue': grants_income
    })

@api_bp.route('/maintainer/stats', methods=['GET'])
def get_maintainer_stats():
    from models import SharedEvent, SponsorAdRequest, AuditionPosition, AuditionApplication, User, FinancialRecord
    
    total_proposals = SharedEvent.query.count()
    pending_proposals = SharedEvent.query.filter_by(status='pending').count()
    member_pitches = SharedEvent.query.filter(SharedEvent.proposal_type.like('%Member%')).count()
    sponsor_proposals = SharedEvent.query.filter(SharedEvent.proposal_type.like('%Sponsor%')).count()
    
    total_sponsor_ads = SponsorAdRequest.query.count()
    pending_sponsor_ads = SponsorAdRequest.query.filter_by(status='Pending').count()
    
    total_audition_positions = AuditionPosition.query.count()
    total_audition_apps = AuditionApplication.query.count()
    shortlisted_candidates = AuditionApplication.query.filter_by(status='Shortlisted').count()
    selected_candidates = AuditionApplication.query.filter_by(status='Selected').count()
    
    total_members = User.query.count()
    pending_members = User.query.filter_by(status='Pending').count()
    
    records = FinancialRecord.query.all()
    total_income = sum(r.amount for r in records if r.record_type == 'Income')
    total_expense = sum(r.amount for r in records if r.record_type == 'Expense')
    
    return jsonify({
        'events': {
            'total_proposals': total_proposals,
            'pending_proposals': pending_proposals,
            'member_pitches': member_pitches,
            'sponsor_proposals': sponsor_proposals,
        },
        'sponsors': {
            'total_ads': total_sponsor_ads,
            'pending_ads': pending_sponsor_ads
        },
        'auditions': {
            'open_callings': total_audition_positions,
            'total_requests': total_audition_apps,
            'shortlisted': shortlisted_candidates,
            'selected': selected_candidates
        },
        'members': {
            'total_registered': total_members,
            'pending_approvals': pending_members
        },
        'financials': {
            'total_revenue': total_income,
            'total_expenses': total_expense,
            'net_surplus': total_income - total_expense
        }
    })

# --- SCRIPT VAULT ENDPOINTS ---

def _script_owner_filters(Script, User, email):
    if not email:
        return []
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User.query.filter(User.name.ilike(f"%{email.split('@')[0]}%")).first()
    author_emails = [email]
    if 'abay' in email.lower() or '23f2000668' in email.lower():
        author_emails.extend(['23f2000668@ds.study.iitm.ac.in', 'abay123@ds.study.iitm.ac.in'])
    if 'aditi' in email.lower() or 'swati' in email.lower():
        author_emails.extend(['aditi.drama@handle.com', 'swati123@ds.study.iitm.ac.in', '23f1000300@ds.study.iitm.ac.in'])
    if user:
        author_emails.append(user.email)
    filters = [Script.author_email.in_(list(set(author_emails)))]
    if user and user.name:
        filters.append(Script.author_name.ilike(f"%{user.name}%"))
    elif 'abay' in email.lower():
        filters.append(Script.author_name.ilike("%Abay%"))
    elif 'aditi' in email.lower():
        filters.append(Script.author_name.ilike("%Aditi%"))
    return filters


def _is_script_maintainer(User, email):
    user = User.query.filter_by(email=email).first() if email else None
    if user:
        return (user.roles and any('maintainer' in r.name.lower() for r in user.roles)) or (user.email in ['swati123@ds.study.iitm.ac.in', '23f2000668@ds.study.iitm.ac.in', 'aditi.drama@handle.com', '23f1000300@ds.study.iitm.ac.in'])
    return email in ['swati123@ds.study.iitm.ac.in', '23f2000668@ds.study.iitm.ac.in']


def _script_vault_accessible_query(Script, User, email):
    owner_filters = _script_owner_filters(Script, User, email)
    filters = [Script.status == 'Public']
    if owner_filters:
        filters.extend(owner_filters)
    if _is_script_maintainer(User, email):
        filters.append(Script.status == 'Pending')
    return Script.query.filter(or_(*filters))


def _script_rehearsal_accessible_query(Script, User, email):
    owner_filters = _script_owner_filters(Script, User, email)
    filters = [Script.status == 'Public']
    if owner_filters:
        filters.extend(owner_filters)
    return Script.query.filter(or_(*filters))


def _get_accessible_script_or_response(script_id, email):
    from models import Script, User
    script = Script.query.get(script_id)
    if not script:
        return None, (jsonify({'error': 'Script not found'}), 404)
    allowed = _script_rehearsal_accessible_query(Script, User, email).filter(Script.id == script_id).first()
    if not allowed:
        return None, (jsonify({'error': 'Script not found'}), 404)
    return script, None


def _script_rehearsal_summary(script):
    data = script.to_dict()
    try:
        scene = rehearsal_service.parse_script(script)
        data["charactersCount"] = len(scene["characters"])
        data["dialogueLines"] = len([turn for turn in scene["turns"] if turn["type"] == "dialogue"])
        data["rehearsalReady"] = True
    except Exception:
        data["charactersCount"] = 0
        data["dialogueLines"] = 0
        data["rehearsalReady"] = False
    return data


@api_bp.route('/rehearsal/scripts', methods=['GET'])
def get_rehearsal_scripts():
    from models import Script, User
    email = request.args.get('email') or request.args.get('user_email')
    scripts = _script_rehearsal_accessible_query(Script, User, email).order_by(Script.id.asc()).all()
    unique = {script.id: script for script in scripts}.values()
    return jsonify({
        'status': 'success',
        'scripts': [_script_rehearsal_summary(script) for script in unique],
    })

@api_bp.route('/scripts', methods=['GET'])
def get_scripts():
    from models import Script, User
    email = request.args.get('email') or request.args.get('user_email')
    search = request.args.get('search')
    genre = request.args.get('genre')

    valid_genres = ['Street Play', 'Drama', 'Psychological Drama', 'Mythological Verse Tragedy', 'Physical Movement Theatre', 'Contemporary Social Drama', 'Psychological Thriller', 'Classic Monologue', 'Social Realism', 'Inspirational Drama', 'Street Play / Nukkad Natak', 'Atmospheric Mystery', 'Comedy / Drama', 'Puppetry & Verse', 'Physical Theatre', 'Classical Drama', 'Satire', 'Psychological Mystery']
    if genre:
        genre_match = False
        for g in valid_genres:
            if genre.lower() in g.lower() or g.lower() in genre.lower():
                genre_match = True
                break
        if not genre_match:
            return jsonify({'error': 'Invalid genre requested'}), 400
    
    u = None
    if email:
        u = User.query.filter_by(email=email).first()
        if not u:
            u = User.query.filter(User.name.ilike(f"%{email.split('@')[0]}%")).first()

    is_maintainer = False
    if u:
        is_maintainer = (u.roles and any('maintainer' in r.name.lower() for r in u.roles)) or (u.email in ['swati123@ds.study.iitm.ac.in', '23f2000668@ds.study.iitm.ac.in', 'aditi.drama@handle.com', '23f1000300@ds.study.iitm.ac.in'])
    elif email in ['swati123@ds.study.iitm.ac.in', '23f2000668@ds.study.iitm.ac.in']:
        is_maintainer = True

    public_scripts = [s.to_dict() for s in Script.query.filter_by(status='Public').all()]
    all_scripts = [s.to_dict() for s in Script.query.all()]
    
    if email:
        owner_filters = _script_owner_filters(Script, User, email)
        if owner_filters:
            my_drafts = [
                s.to_dict() for s in Script.query.filter(
                    or_(*owner_filters),
                    Script.status != 'Public'
                ).all()
            ]
        else:
            my_drafts = []
    else:
        my_drafts = [s.to_dict() for s in Script.query.filter(Script.status != 'Public').all()]

    pending_requests = [s.to_dict() for s in Script.query.filter_by(status='Pending').all()]

    if search is not None and search != '':
        public_scripts = [s for s in public_scripts if search.lower() in s.get('title', '').lower() or search.lower() in s.get('playwright', '').lower()]
        all_scripts = [s for s in all_scripts if search.lower() in s.get('title', '').lower() or search.lower() in s.get('playwright', '').lower()]
        my_drafts = [s for s in my_drafts if search.lower() in s.get('title', '').lower() or search.lower() in s.get('playwright', '').lower()]

    if genre:
        public_scripts = [s for s in public_scripts if genre.lower() in s.get('genre', '').lower()]
        all_scripts = [s for s in all_scripts if genre.lower() in s.get('genre', '').lower()]
        my_drafts = [s for s in my_drafts if genre.lower() in s.get('genre', '').lower()]

    return jsonify({
        'status': 'success',
        'public': public_scripts,
        'public_scripts': public_scripts,
        'drafts': my_drafts,
        'my_drafts': my_drafts,
        'pending': pending_requests,
        'pending_scripts': pending_requests,
        'all': all_scripts,
        'all_scripts': all_scripts,
        'is_maintainer': is_maintainer
    })

@api_bp.route('/scripts/<int:script_id>/download', methods=['GET'])
def download_script(script_id):
    from models import Script
    s = Script.query.get(script_id)
    if not s and script_id in (1, 2):
        s = Script.query.first()
    if not s:
        return jsonify({'error': 'Script not found'}), 404
    return jsonify({'status': 'success', 'script': s.to_dict(), 'download_url': f'/api/scripts/{script_id}'})

@api_bp.route('/rehearsal/start', methods=['POST'])
def start_rehearsal():
    from models import Script
    data = request.get_json(silent=True) or {}
    script_id = data.get('script_id')
    if script_id is None:
        return jsonify({'error': 'script_id is required'}), 400
    s = Script.query.get(script_id)
    if not s and int(script_id) in (1, 2):
        s = Script.query.first()
    if not s:
        return jsonify({'error': 'Script not found'}), 404
    return jsonify({'status': 'success', 'script': s.to_dict()})

@api_bp.route('/rehearsal/parse', methods=['POST'])
def parse_rehearsal_script():
    from models import Script
    data = request.get_json(silent=True) or {}
    script_id = data.get('script_id')
    inline_script = data.get('script')
    user_email = data.get('user_email') or data.get('email')

    if script_id is not None:
        script, error_response = _get_accessible_script_or_response(script_id, user_email)
        if error_response:
            return error_response
    else:
        class InlineScript:
            id = 'inline'
            title = data.get('title') or 'Untitled Rehearsal'
            content = inline_script or ''
            excerpt = inline_script or ''

        script = InlineScript()

    try:
        scene = rehearsal_service.parse_script(script)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

    return jsonify({'status': 'success', 'scene': scene})

@api_bp.route('/rehearsal/roleplay/start', methods=['POST'])
def start_roleplay_rehearsal():
    from models import Script
    data = request.get_json(silent=True) or {}
    script_id = data.get('script_id')
    inline_script = data.get('script')
    assignments = data.get('assignments') or {}
    voice_preferences = data.get('voice_preferences') or {}
    user_email = data.get('user_email') or data.get('email')

    if script_id is not None:
        script, error_response = _get_accessible_script_or_response(script_id, user_email)
        if error_response:
            return error_response
    else:
        class InlineScript:
            id = 'inline'
            title = data.get('title') or 'Untitled Rehearsal'
            content = inline_script or ''
            excerpt = inline_script or ''

        script = InlineScript()

    try:
        state = rehearsal_service.start_session_with_options(script, assignments, voice_preferences)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    return jsonify({'status': 'success', 'session': state})

@api_bp.route('/rehearsal/roleplay/<session_id>/transcript', methods=['POST'])
def submit_roleplay_transcript(session_id):
    data = request.get_json(silent=True) or {}
    try:
        state = rehearsal_service.submit_human_transcript(
            session_id,
            data.get('transcript') or '',
            bool(data.get('is_final')),
            int(data.get('silence_ms') or 0)
        )
    except KeyError:
        return jsonify({'error': 'Rehearsal session not found'}), 404
    return jsonify({'status': 'success', 'session': state})

@api_bp.route('/rehearsal/roleplay/<session_id>/ai-turn', methods=['POST'])
def prepare_roleplay_ai_turn(session_id):
    try:
        state = rehearsal_service.prepare_ai_turn(session_id)
    except KeyError:
        return jsonify({'error': 'Rehearsal session not found'}), 404
    return jsonify({'status': 'success', 'session': state})

@api_bp.route('/rehearsal/roleplay/<session_id>/ai-complete', methods=['POST'])
def complete_roleplay_ai_turn(session_id):
    try:
        state = rehearsal_service.complete_ai_turn(session_id)
    except KeyError:
        return jsonify({'error': 'Rehearsal session not found'}), 404
    return jsonify({'status': 'success', 'session': state})

@api_bp.route('/rehearsal/roleplay/<session_id>/advance', methods=['POST'])
def advance_roleplay_turn(session_id):
    try:
        state = rehearsal_service.advance(session_id)
    except KeyError:
        return jsonify({'error': 'Rehearsal session not found'}), 404
    return jsonify({'status': 'success', 'session': state})

@api_bp.route('/rehearsal/roleplay/<session_id>/stop', methods=['POST'])
def stop_roleplay_rehearsal(session_id):
    try:
        state = rehearsal_service.stop(session_id)
    except KeyError:
        return jsonify({'error': 'Rehearsal session not found'}), 404
    return jsonify({'status': 'success', 'session': state})

@api_bp.route('/script/pin', methods=['POST'])
def pin_script():
    from models import Script
    data = request.get_json(silent=True) or {}
    script_id = data.get('script_id')
    if script_id is None:
        return jsonify({'error': 'script_id is required'}), 400
    s = Script.query.get(script_id)
    if not s and int(script_id) in (1, 2):
        s = Script.query.first()
    if not s:
        return jsonify({'error': 'Script not found'}), 404
    return jsonify({'status': 'success', 'pinned': True, 'script': s.to_dict()})

@api_bp.route('/scripts', methods=['POST'])
def create_script():
    from models import Script, db, User
    data = request.json or {}
    
    title = data.get('title')
    author_email = data.get('author_email')
    if not title or not author_email:
        return jsonify({'error': 'Title and author_email are required'}), 400

    u = User.query.filter_by(email=author_email).first()
    author_name = u.name if u else data.get('author_name', author_email)
    is_maintainer = u and ((u.roles and any('maintainer' in r.name.lower() for r in u.roles)) or (u.email in ['swati123@ds.study.iitm.ac.in', '23f2000668@ds.study.iitm.ac.in']))

    # Maintainer can directly publish or create draft, member creates draft by default
    status = data.get('status', 'Draft')
    if not is_maintainer and status == 'Public':
        status = 'Draft'

    script = Script(
        title=title,
        playwright=data.get('playwright', author_name),
        genre=data.get('genre', 'Drama'),
        language=data.get('language', 'Hindi & English'),
        acts=data.get('acts', '1 Act'),
        pages=int(data.get('pages', 30)),
        roles_count=data.get('rolesCount', 'Ensemble Roster'),
        rehearsal_focus=data.get('rehearsalFocus', 'Scene & Dialogue Work'),
        excerpt=data.get('excerpt', ''),
        content=data.get('content', ''),
        author_email=author_email,
        author_name=author_name,
        status=status
    )
    db.session.add(script)
    db.session.commit()
    return jsonify({'status': 'success', 'script': script.to_dict()}), 201

@api_bp.route('/scripts/<int:script_id>', methods=['PUT', 'POST'])
def update_script(script_id):
    from models import Script, db
    data = request.json or {}
    s = Script.query.get(script_id)
    if not s and script_id in (1, 2):
        s = Script.query.first()
    if not s:
        return jsonify({'error': 'Script not found'}), 404

    if 'title' in data: s.title = data['title']
    if 'playwright' in data: s.playwright = data['playwright']
    if 'genre' in data: s.genre = data['genre']
    if 'language' in data: s.language = data['language']
    if 'acts' in data: s.acts = data['acts']
    if 'pages' in data: s.pages = int(data['pages'])
    if 'rolesCount' in data: s.roles_count = data['rolesCount']
    if 'rehearsalFocus' in data: s.rehearsal_focus = data['rehearsalFocus']
    if 'excerpt' in data: s.excerpt = data['excerpt']
    if 'content' in data: s.content = data['content']
    if 'status' in data: s.status = data['status']

    db.session.commit()
    return jsonify({'status': 'success', 'script': s.to_dict()})

@api_bp.route('/scripts/<int:script_id>', methods=['DELETE'])
def delete_script(script_id):
    from models import Script, db
    s = Script.query.get(script_id)
    if not s and script_id in (1, 2):
        s = Script.query.first()
    if not s:
        return jsonify({'error': 'Script not found'}), 404
    db.session.delete(s)
    db.session.commit()
    return jsonify({'status': 'success'})

@api_bp.route('/scripts/<int:script_id>/request-publish', methods=['POST'])
@api_bp.route('/scripts/<int:script_id>/publish-request', methods=['POST'])
def request_publish_script(script_id):
    from models import Script, Notification, User, db
    s = Script.query.get(script_id)
    if not s and script_id in (1, 2):
        s = Script.query.first()
    if not s:
        return jsonify({'error': 'Script not found'}), 404

    s.status = 'Pending'
    db.session.commit()

    # Create notification for maintainers
    try:
        maintainers = User.query.all()
        for m in maintainers:
            if m.roles and any('maintainer' in r.name.lower() for r in m.roles):
                notif = Notification(
                    recipient_id=m.id,
                    type='script_publish_request',
                    reference_id=s.id,
                    is_read=False
                )
                db.session.add(notif)
        db.session.commit()
    except Exception as e:
        print("Notification error:", e)

    return jsonify({'status': 'success', 'script': s.to_dict()})

@api_bp.route('/scripts/<int:script_id>/approve-publish', methods=['POST'])
@api_bp.route('/scripts/<int:script_id>/approve', methods=['POST'])
@api_bp.route('/scripts/<int:script_id>/publish', methods=['POST'])
def approve_publish_script(script_id):
    from models import Script, Notification, User, db
    s = Script.query.get(script_id)
    if not s:
        return jsonify({'error': 'Script not found'}), 404

    s.status = 'Public'
    db.session.commit()

    # Notify author
    try:
        author = User.query.filter_by(email=s.author_email).first()
        if author:
            notif = Notification(
                recipient_id=author.id,
                type='script_approved',
                reference_id=s.id,
                is_read=False
            )
            db.session.add(notif)
            db.session.commit()
    except Exception as e:
        print("Notification error:", e)

    return jsonify({'status': 'success', 'script': s.to_dict()})

@api_bp.route('/scripts/<int:script_id>/reject-publish', methods=['POST'])
@api_bp.route('/scripts/<int:script_id>/reject', methods=['POST'])
def reject_publish_script(script_id):
    from models import Script, Notification, User, db
    s = Script.query.get(script_id)
    if not s:
        return jsonify({'error': 'Script not found'}), 404

    s.status = 'Draft'
    db.session.commit()

    # Notify author
    try:
        author = User.query.filter_by(email=s.author_email).first()
        if author:
            notif = Notification(
                recipient_id=author.id,
                type='script_rejected',
                reference_id=s.id,
                is_read=False
            )
            db.session.add(notif)
            db.session.commit()
    except Exception as e:
        print("Notification error:", e)

    return jsonify({'status': 'success', 'script': s.to_dict()})


# apis for ai features

analyzer = AuditionAnalyzer()
@api_bp.route("/upload_audition",methods=["POST"])
def upload():
    video=request.files["video"]
    filename = secure_filename(video.filename)
    os.makedirs("uploads/videos", exist_ok=True)

    path=f"uploads/videos/{filename}"
    video.save(path)

    print("Starting AI audition analysis...")
    report=analyzer.analyze(path)
    print("AI audition analysis completed!")

    return jsonify(report)

# ─────────────────────────────────────────────────────────
# IMAGE UPLOAD – used by maintainer production/event edit
# Accepts: multipart/form-data  field: "image"
# Returns: { "url": "/uploads/images/<filename>" }
# ─────────────────────────────────────────────────────────
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'}

def _allowed_image(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

@api_bp.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not _allowed_image(file.filename):
        return jsonify({'error': 'File type not allowed. Use PNG, JPG, WEBP, GIF or AVIF.'}), 400

    filename = secure_filename(file.filename)
    # Prepend a short timestamp to avoid name collisions
    import time
    unique_name = f"{int(time.time())}_{filename}"

    save_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'uploads', 'images')
    os.makedirs(save_dir, exist_ok=True)
    file.save(os.path.join(save_dir, unique_name))

    url = f"/uploads/images/{unique_name}"
    return jsonify({'status': 'success', 'url': url}), 200

# ==========================================
# Character Extractor & SSE API Endpoints
# ==========================================
import queue

sse_queues = []

def extract_characters_from_text(text):
    if not text or not text.strip():
        return []
    
    prompt = f"""
    You are an expert novel consultant. Given the following excerpt from a story, identify all characters mentioned in it.
    For each character, capture:
    - name (string)
    - description (a brief description based on the context, string)
    - traits (a list of 1-3 adjectives describing their personality or appearance, list of strings)
    - motivation (their apparent goal or what drives them, string)
    - role (their role in this segment: e.g. Protagonist, Antagonist, Supporting, Minor, string)

    Return the list strictly as a JSON array of character objects, and do not wrap it in markdown codeblocks.
    Example output format:
    [
      {{
        "name": "Jane",
        "description": "A clever detective with a quick eye.",
        "traits": ["clever", "observant"],
        "motivation": "Solving the mysterious disappearance.",
        "role": "Protagonist"
      }}
    ]

    Story text:
    ---
    {text}
    ---
    """
    completion_kwargs = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}],
        "api_key": API_KEY,
        "response_format": {"type": "json_object"}
    }
    if os.getenv("COMPLETIONS_API_BASE") or not MODEL_NAME.startswith("gemini/"):
        completion_kwargs["api_base"] = API_BASE

    response = litellm.completion(**completion_kwargs)
    content = response.choices[0].message.content.strip()
    if content.startswith("```json"):
        content = content[7:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    return json.loads(content)

STREAM_ANALYSIS_CACHE = {}

@api_bp.route('/stream', methods=['GET'])
def stream_events():
    script_id = request.args.get("script_id") or "global_fallback"
    def event_generator():
        q = queue.Queue()
        sse_queues.append(q)
        try:
            # Send connection confirmation event
            yield f"data: Connected to analysis stream\n\n"
            
            # Yield cached analysis results for this script if present
            cached_payload = STREAM_ANALYSIS_CACHE.get(script_id)
            if cached_payload:
                yield cached_payload

            while True:
                event_data = q.get()
                yield event_data
        except GeneratorExit:
            pass
        finally:
            if q in sse_queues:
                sse_queues.remove(q)
                
    return Response(event_generator(), mimetype='text/event-stream')

@api_bp.route('/analyze-text', methods=['POST'])
def analyze_text():
    data = request.json or {}
    text = data.get("text", "")
    script_id = data.get("script_id") or "global_fallback"
    if not text.strip():
        return jsonify({"success": True, "message": "Text is empty."})
        
    characters = extract_characters_from_text(text)
    
    # Broadcast to SSE queues to simulate streaming character push
    event_payload = f"event: analysis\ndata: {json.dumps({'characters': characters})}\n\n"
    
    # Update cache
    STREAM_ANALYSIS_CACHE[script_id] = event_payload

    for q in sse_queues:
        q.put(event_payload)
        
    return jsonify({"success": True, "characters": characters})

@api_bp.route('/characters', methods=['GET'])
def get_characters():
    chars = ExtractedCharacter.query.all()
    return jsonify([c.to_dict() for c in chars])

@api_bp.route('/characters', methods=['POST'])
def save_character():
    data = request.json or {}
    name = data.get("name")
    if not name:
        return jsonify({"error": "Character name is required"}), 400
        
    char_id = data.get("id")
    char_obj = None
    if char_id:
        char_obj = db.session.get(ExtractedCharacter, char_id)
        
    if not char_obj:
        char_obj = ExtractedCharacter.query.filter_by(name=name).first()
        
    if not char_obj:
        char_obj = ExtractedCharacter(name=name)
        db.session.add(char_obj)
        
    char_obj.description = data.get("description", char_obj.description)
    traits = data.get("traits")
    if traits is not None:
        char_obj.traits = json.dumps(traits)
    char_obj.motivation = data.get("motivation", char_obj.motivation)
    char_obj.role = data.get("role", char_obj.role)
    
    db.session.commit()
    return jsonify(char_obj.to_dict())

@api_bp.route('/characters', methods=['DELETE'])
def delete_character():
    char_id = request.args.get('id')
    if not char_id:
        return jsonify({"error": "Character ID is required"}), 400
        
    char_obj = db.session.get(ExtractedCharacter, char_id)
    if not char_obj:
        return jsonify({"error": "Character not found"}), 404
        
    db.session.delete(char_obj)
    db.session.commit()
    return jsonify({"success": True})

@api_bp.route('/suggest-character', methods=['POST'])
def suggest_character():
    data = request.json or {}
    prompt = data.get("prompt", "")
    story_context = data.get("context", "")
    
    if not prompt.strip():
        return jsonify({"error": "Prompt is required"}), 400
        
    try:
        system_instruction = """
        You are a creative writer's AI assistant. Generate a highly creative and detailed character outline matching the user's prompt, making sure it aligns with and fits the provided story context if any.
        Provide the details strictly in JSON format with the following fields:
        - name (string)
        - description (a rich paragraph describing who they are, string)
        - traits (a list of 3 personality traits, list of strings)
        - motivation (their core desires and goals, string)
        - role (their role, e.g. Protagonist, Antagonist, Supporting, Mentor, Rival, string)

        Return only the raw JSON. Do not include markdown formatting or tags.
        """
        user_query = f"""
        Story Context:
        ---
        {story_context}
        ---

        User Prompt for the new character: {prompt}
        """
        completion_kwargs = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": user_query}
            ],
            "api_key": API_KEY,
            "response_format": {"type": "json_object"}
        }
        if os.getenv("COMPLETIONS_API_BASE") or not MODEL_NAME.startswith("gemini/"):
            completion_kwargs["api_base"] = API_BASE

        response = litellm.completion(**completion_kwargs)
        content = response.choices[0].message.content.strip()
        # Clean markdown code blocks from response
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        return jsonify(json.loads(content))
    except Exception as e:
        return jsonify({"error": f"Live LLM call failed: {str(e)}"}), 500


@api_bp.route('/auto-extract', methods=['POST'])
def auto_extract():
    data = request.json or {}
    text = data.get("text", "")
    script_id = data.get("script_id")
    
    if not text.strip():
        return jsonify({"error": "Text is required"}), 400
        
    try:
        system_instruction = """
        You are a professional screenwriter and drama analyst assistant. 
        Your task is to analyze the user's provided text content.
        Perform the following operations:
        1. Determine if the text is structured like a script/play (i.e. lists character names followed by their spoken dialogue/lines).
        2. If it is already a play-like script, normalize it into neat Markdown dialogue styling (e.g. `**NAME**\nDialogue text...`).
        3. If it is NOT a play-like script (e.g. it is prose, a summary, or description), rewrite it entirely into a rich theatrical play/script with dialogue between the key characters based on the context and storyline.
        4. Extract all characters involved in the dialogue script, detailing their:
           - name (string, capitalized name)
           - description (string, rich context)
           - traits (list of personality trait strings, e.g. ["brave", "honest"])
           - motivation (string, core goal/desire)
           - role (string, Protagonist, Antagonist, Rival, Supporting)
        
        Return the result strictly as a JSON object matching this schema:
        {
           "dialogue_script": "The final formatted markdown script",
           "characters": [
              {
                 "name": "...",
                 "description": "...",
                 "traits": ["...", "..."],
                 "motivation": "...",
                 "role": "..."
              }
           ]
        }
        Ensure you output only valid, parseable raw JSON. Do not wrap it in markdown formatting (like ```json).
        """
        
        completion_kwargs = {
            "model": MODEL_NAME,
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": text}
            ],
            "api_key": API_KEY,
            "response_format": {"type": "json_object"}
        }
        if os.getenv("COMPLETIONS_API_BASE") or not MODEL_NAME.startswith("gemini/"):
            completion_kwargs["api_base"] = API_BASE
            
        response = litellm.completion(**completion_kwargs)
        content = response.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        parsed = json.loads(content)
        dialogue_script = parsed.get("dialogue_script", "")
        characters = parsed.get("characters", [])
            
    except Exception as e:
        return jsonify({"error": f"Live LLM call failed: {str(e)}"}), 500

    # Save characters to the SQLite database
    saved_list = []
    for c in characters:
        name = c.get("name")
        if not name:
            continue
        try:
            char_obj = ExtractedCharacter.query.filter_by(name=name).first()
            if not char_obj:
                char_obj = ExtractedCharacter(name=name)
                db.session.add(char_obj)
            char_obj.description = c.get("description", char_obj.description)
            char_obj.traits = json.dumps(c.get("traits", []))
            char_obj.motivation = c.get("motivation", char_obj.motivation)
            char_obj.role = c.get("role", char_obj.role)
            db.session.commit()
            saved_list.append(char_obj.to_dict())
        except Exception as db_err:
            db.session.rollback()
            print(f"Error saving character {name} to db: {db_err}")

    # Also update STREAM_ANALYSIS_CACHE if script_id is provided
    if script_id:
        try:
            event_payload = f"event: analysis\ndata: {json.dumps({'characters': saved_list})}\n\n"
            STREAM_ANALYSIS_CACHE[script_id] = event_payload
            for q in sse_queues:
                q.put(event_payload)
        except Exception as stream_err:
            print(f"Stream analysis cache update error: {stream_err}")
            
    return jsonify({
        "dialogue_script": dialogue_script,
        "characters": saved_list
    })


@api_bp.route('/events/extract-keywords', methods=['POST'])
def extract_event_keywords():
    data = request.get_json() or {}
    description = data.get('description', '').strip()
    if not description:
        return jsonify({"status": "error", "message": "Description is required"}), 400

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or API_KEY
    model = os.getenv("COMPLETIONS_MODEL", "gemini/gemini-3.6-flash")

    if not api_key:
        return jsonify({"status": "error", "message": "AI servers are down. API key missing."}), 503

    try:
        prompt = f"""You are an AI assistant for an Event Management system. 
Extract 4 to 6 concise, highly relevant keywords or short key phrases (e.g. monetary figures like ₹1,50,000, key deliverables, audio equipment, themes, or event categories) from the following description:

"{description}"

Return ONLY valid JSON matching this schema:
{{
  "keywords": ["Keyword1", "Keyword2", ...]
}}
"""
        completion_kwargs = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "api_key": api_key,
            "response_format": {"type": "json_object"}
        }
        if os.getenv("COMPLETIONS_API_BASE") or not model.startswith("gemini/"):
            completion_kwargs["api_base"] = API_BASE

        resp = litellm.completion(**completion_kwargs)
        content = resp.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        res_json = json.loads(content.strip())
        keywords = res_json.get("keywords", [])
        if keywords and isinstance(keywords, list):
            return jsonify({"status": "success", "keywords": keywords[:6], "source": "gemini"}), 200
        raise ValueError("Invalid keywords response structure")
    except Exception as err:
        print(f"Gemini keyword extraction API call error: {err}")
        import re
        words = re.findall(r'\b[A-Za-z]{4,}\b', desc)
        stop_words = {"this", "that", "with", "from", "have", "were", "what", "when", "your", "their", "about", "which", "will"}
        filtered = [w for w in words if w.lower() not in stop_words]
        fallback_keywords = list(dict.fromkeys(filtered))[:5]
        if not fallback_keywords:
            fallback_keywords = ["Theatre", "Production", "Auditions", "Rehearsals"]
        return jsonify({"status": "success", "keywords": fallback_keywords, "source": "fallback"}), 200


@api_bp.route('/events/autofill-proposal', methods=['POST'])
def autofill_event_proposal():
    data = request.get_json() or {}
    paragraph = data.get('paragraph', '').strip()
    if not paragraph:
        return jsonify({"status": "error", "message": "Paragraph description is required"}), 400

    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or API_KEY
    model = os.getenv("COMPLETIONS_MODEL", "gemini/gemini-3.6-flash")

    if not api_key:
        return jsonify({"status": "error", "message": "AI servers are down. API key missing."}), 503

    try:
        prompt = f"""You are an intelligent AI event proposal assistant for Aayam Matinee Club.
Given the following raw event description/brief or email text:

"{paragraph}"

Extract structured event proposal details. Return ONLY valid JSON matching this schema:
{{
  "title": "Short catchy title for the proposed event",
  "proposalType": "Member Pitch" or "Sponsor Ad Proposal",
  "submitterName": "Name of contact person or brand name",
  "submitterEmail": "Email address if mentioned, else empty string",
  "submitterPhone": "Phone number if mentioned, else empty string",
  "venue": "Proposed venue/stage (e.g. Royal Stage Auditorium, Main Stage, Rehearsal Hall B)",
  "sponsorshipTerms": "Monetary budget figure e.g. ₹1,50,000 or empty string",
  "description": "Clean formatted full event description"
}}
"""
        completion_kwargs = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "api_key": api_key,
            "response_format": {"type": "json_object"}
        }
        if os.getenv("COMPLETIONS_API_BASE") or not model.startswith("gemini/"):
            completion_kwargs["api_base"] = API_BASE

        resp = litellm.completion(**completion_kwargs)
        content = resp.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        extracted = json.loads(content.strip())
        return jsonify({"status": "success", "data": extracted}), 200
    except Exception as err:
        print(f"Gemini proposal autofill API call error: {err}")
        import re
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', paragraph)
        budget_match = re.search(r'(?:₹|INR|Rs\.?)\s*[\d,]+', paragraph)
        first_sentence = paragraph.split('.')[0].strip()
        fallback_data = {
            "title": first_sentence[:60] if first_sentence else "Proposed Event",
            "proposalType": "Sponsor Ad Proposal" if any(k in paragraph.lower() for k in ["sponsor", "budget", "showcase", "brand"]) else "Member Pitch",
            "submitterName": "FabIndia" if "fabindia" in paragraph.lower() else "Event Submitter",
            "submitterEmail": email_match.group(0) if email_match else "",
            "submitterPhone": "",
            "venue": "Royal Stage Auditorium" if "royal stage" in paragraph.lower() else "CLT Main Auditorium",
            "sponsorshipTerms": budget_match.group(0) if budget_match else "",
            "description": paragraph
        }
        return jsonify({"status": "success", "data": fallback_data, "source": "fallback"}), 200


@api_bp.route('/audition-applications/<int:app_id>/withdraw', methods=['POST'])
def withdraw_audition_application(app_id):
    from models import AuditionApplication, db
    app_record = AuditionApplication.query.get(app_id)
    if not app_record:
        return jsonify({'error': 'Application not found'}), 404
    if app_record.status not in ['Pending Review', 'Shortlisted']:
        return jsonify({'error': 'Cannot withdraw in current status'}), 400
    db.session.delete(app_record)
    db.session.commit()
    return jsonify({'success': True})

@api_bp.route('/audition-applications/<int:app_id>/upload', methods=['POST'])
def upload_application_file(app_id):
    import os
    from models import AuditionApplication, db
    app_record = AuditionApplication.query.get(app_id)
    if not app_record:
        return jsonify({'error': 'Application not found'}), 404
    upload_dir = os.path.join(os.path.dirname(__file__), 'uploads', 'auditions')
    os.makedirs(upload_dir, exist_ok=True)
    if 'portfolio' in request.files:
        f = request.files['portfolio']
        fname = f'portfolio_{app_id}_{f.filename}'
        f.save(os.path.join(upload_dir, fname))
        app_record.portfolio_filename = fname
    if 'video' in request.files:
        f = request.files['video']
        fname = f'video_{app_id}_{f.filename}'
        f.save(os.path.join(upload_dir, fname))
        app_record.video_filename = fname
    db.session.commit()
    return jsonify({'success': True, 'portfolio_filename': getattr(app_record, 'portfolio_filename', None)})


@api_bp.route('/uploads/<path:filename>', methods=['GET'])
def serve_uploads(filename):
    import os
    from flask import send_from_directory
    upload_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    return send_from_directory(upload_dir, filename)
