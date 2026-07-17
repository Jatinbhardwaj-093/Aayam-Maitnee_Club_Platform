import os
import json
import random
import jwt
import datetime
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Role, Membership, Event, Booking, Announcement, Feedback, Gallery, ScheduleSlot, Audition, SharedEvent, Volunteer, Participation, Play, OpenPosition
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

    if db_user.status and db_user.status.lower() == 'pending':
        return jsonify({'error': 'Application under review. Login restricted.'}), 403

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
            'reference_id': notif.reference_id
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

@api_bp.route('/my-schedule', methods=['GET'])
def get_my_schedule():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    user = User.query.filter_by(email=email).first()
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
                'description': e.description,
                'category': e.category,
                'venue': e.venue,
                'date': e.event_date.strftime('%b %d, %Y') if e.event_date else '',
                'timeRange': f"{e.start_time.strftime('%H:%M') if e.start_time else ''} - {e.end_time.strftime('%H:%M') if e.end_time else ''}",
                'status': p.status,
                'participation_id': p.id
            })
    return jsonify(result)

@api_bp.route('/my-schedule/update', methods=['POST'])
def update_my_schedule():
    data = request.json
    p_id = data.get('participation_id')
    new_status = data.get('status')
    if not p_id or not new_status:
        return jsonify({'error': 'Missing fields'}), 400
        
    p = Participation.query.get(p_id)
    if p:
        p.status = new_status
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'error': 'Not found'}), 404

@api_bp.route('/my-auditions', methods=['GET'])
def get_my_auditions():
    email = request.args.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    auditions = Audition.query.filter_by(user_id=user.id).all()
    result = []
    for a in auditions:
        play = Play.query.get(a.play_id)
        play_title = play.title if play else "Unknown Play"
        
        # map db status to UI status
        status_map = {
            'pending': 'Applied',
            'reviewing': 'Reviewing',
            'interview': 'Interview/Audition',
            'decision': 'Casting Decision'
        }
        ui_status = status_map.get(a.status.lower(), 'Applied')
        
        result.append({
            'id': f"app{a.id}",
            'positionId': f"{a.play_id}_{a.role}",
            'positionTitle': f"{play_title} - {a.role}",
            'category': a.role,
            'submittedAt': a.submitted_at.strftime('%b %d, %Y') if a.submitted_at else '',
            'status': ui_status,
            'notes': "Application received and logged.",
            'files': ["application_details.pdf"]
        })
    return jsonify(result)

@api_bp.route('/audition/submit', methods=['POST'])
def submit_audition():
    data = request.json
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    play_id = data.get('play_id')
    role = data.get('role')
    notes = data.get('notes')
    
    a = Audition(user_id=user.id, play_id=play_id, role=role, experience_notes=notes, status='pending')
    db.session.add(a)
    db.session.commit()
    
    return jsonify({'success': True, 'id': a.id})


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

@api_bp.route('/proposals', methods=['GET'])
def get_proposals():
    from models import SharedEvent
    proposals = SharedEvent.query.all()
    out = []
    for p in proposals:
        submitter_name = p.submitter.name if p.submitter else "Ensemble Member"
        submitter_initials = "".join([x[0] for x in submitter_name.split()]).upper()[:2] if submitter_name else "EM"
        out.append({
            'id': p.id,
            'name': p.title,
            'description': p.description,
            'date': p.event_date.strftime('%b %d, %Y') if p.event_date else '',
            'venue': p.location_or_link or 'Studio Lounge',
            'status': p.status.capitalize() if p.status else 'Reviewing',
            'urgency': 'Normal',
            'startTime': '18:00',
            'endTime': '20:00',
            'submitter': {
                'name': submitter_name,
                'initials': submitter_initials,
                'avatarUrl': None
            },
            'assignedRoles': [
                { 'roleName': 'Host', 'memberName': submitter_name, 'icon': 'user' }
            ]
        })
    return jsonify(out)

@api_bp.route('/proposals/<int:prop_id>/approve', methods=['POST'])
def approve_proposal(prop_id):
    from models import SharedEvent, Event, db
    p = SharedEvent.query.get(prop_id)
    if not p:
        return jsonify({'error': 'Proposal not found'}), 404
    p.status = 'approved'
    
    from datetime import time, date
    new_event = Event(
        title=p.title,
        description=p.description,
        category='Meetups',
        venue=p.location_or_link or 'Studio Lounge',
        event_date=p.event_date.date() if p.event_date else date.today(),
        start_time=time(18, 0),
        end_time=time(20, 0),
        status='Upcoming'
    )
    db.session.add(new_event)
    db.session.commit()
    return jsonify({'status': 'success'})

@api_bp.route('/proposals/<int:prop_id>/reject', methods=['POST'])
def reject_proposal(prop_id):
    from models import SharedEvent, db
    p = SharedEvent.query.get(prop_id)
    if not p:
        return jsonify({'error': 'Proposal not found'}), 404
    p.status = 'rejected'
    db.session.commit()
    return jsonify({'status': 'success'})

@api_bp.route('/proposals/<int:prop_id>/update', methods=['POST'])
def update_proposal(prop_id):
    from models import SharedEvent, db
    data = request.json
    p = SharedEvent.query.get(prop_id)
    if not p:
        return jsonify({'error': 'Proposal not found'}), 404
    if 'description' in data:
        p.description = data['description']
    if 'venue' in data:
        p.location_or_link = data['venue']
    db.session.commit()
    return jsonify({'status': 'success'})

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
    return jsonify({'status': 'success'})
