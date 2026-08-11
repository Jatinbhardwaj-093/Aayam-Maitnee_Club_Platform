import os
import json
import random
import jwt
import datetime
import re
from flask import Blueprint, request, jsonify, Response, current_app
from sqlalchemy import or_
from werkzeug.security import generate_password_hash, check_password_hash
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
rehearsal_service = RehearsalService(performance_provider=GeminiPerformanceProvider())

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

    user_profile = {
        'name': name,
        'role': role,
        'initials': initials,
        'email': email,
        'isAdmin': is_admin
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
        
        role_val = a.role_applied_for or "Ensemble"
        result.append({
            'id': f"app{a.id}",
            'positionId': f"{a.play_id}_{role_val}",
            'positionTitle': f"{play_title} - {role_val}",
            'category': role_val,
            'submittedAt': a.submitted_at.strftime('%b %d, %Y') if a.submitted_at else '',
            'status': ui_status,
            'notes': "Application received and logged. Creative board is reviewing your materials.",
            'files': ["application_details.pdf"]
        })
    return jsonify(result)

@api_bp.route('/audition/submit', methods=['POST'])
def submit_audition():
    data = request.json or {}
    email = data.get('email')
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    play_id = data.get('play_id')
    role = data.get('role') or data.get('category') or 'Ensemble'
    notes = data.get('notes')
    
    a = Audition(user_id=user.id, play_id=play_id, role_applied_for=role, experience_notes=notes, status='pending')
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
    from models import GalleryItem, db
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
    from models import AuditionPosition, AuditionApplication
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
    data = request.json or {}
    new_pos = AuditionPosition(
        production_name=data.get('production_name', 'Mainstage Production'),
        role_name=data.get('role_name', 'Character Role'),
        role_category=data.get('role_category', 'Character Role'),
        character_description=data.get('character_description', ''),
        requirements=data.get('requirements', ''),
        slots_available=int(data.get('slots_available', 1)),
        status=data.get('status', 'Open Calling')
    )
    db.session.add(new_pos)
    db.session.commit()
    return jsonify({'status': 'success', 'position': new_pos.to_dict()})

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
    author_emails = [email]
    if user:
        author_emails.append(user.email)
    filters = [Script.author_email.in_(list(set(author_emails)))]
    if user and user.name:
        filters.append(Script.author_name.ilike(f"%{user.name}%"))
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


def _get_accessible_script_or_response(script_id, email):
    from models import Script, User
    script = Script.query.get(script_id)
    if not script:
        return None, (jsonify({'error': 'Script not found'}), 404)
    allowed = _script_vault_accessible_query(Script, User, email).filter(Script.id == script_id).first()
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
    except ValueError:
        data["charactersCount"] = 0
        data["dialogueLines"] = 0
        data["rehearsalReady"] = False
    return data


@api_bp.route('/rehearsal/scripts', methods=['GET'])
def get_rehearsal_scripts():
    from models import Script, User
    email = request.args.get('email')
    scripts = _script_vault_accessible_query(Script, User, email).order_by(Script.created_at.desc()).all()
    unique = {script.id: script for script in scripts}.values()
    return jsonify({
        'status': 'success',
        'scripts': [_script_rehearsal_summary(script) for script in unique],
    })

@api_bp.route('/scripts', methods=['GET'])
def get_scripts():
    from models import Script, User
    email = request.args.get('email')
    search = request.args.get('search')
    genre = request.args.get('genre')

    valid_genres = ['Street Play', 'Drama', 'Psychological Drama', 'Mythological Verse Tragedy', 'Physical Movement Theatre', 'Contemporary Social Drama', 'Psychological Thriller', 'Classic Monologue', 'Social Realism', 'Inspirational Drama', 'Street Play / Nukkad Natak', 'Atmospheric Mystery', 'Comedy / Drama', 'Puppetry & Verse', 'Physical Theatre', 'Classical Drama', 'Satire']
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
        author_emails = [email]
        if 'aditi' in email.lower() or 'swati' in email.lower():
            author_emails.extend(['aditi.drama@handle.com', 'swati123@ds.study.iitm.ac.in', '23f1000300@ds.study.iitm.ac.in'])
        if u:
            author_emails.append(u.email)
        
        my_drafts = [
            s.to_dict() for s in Script.query.filter(
                (Script.author_email.in_(author_emails)) | (u and Script.author_name.ilike(f"%{u.name}%")),
                Script.status != 'Public'
            ).all()
        ]
    else:
        my_drafts = [s.to_dict() for s in Script.query.filter(Script.status != 'Public').all()]

    pending_requests = [s.to_dict() for s in Script.query.filter_by(status='Pending').all()]

    if search is not None and search != '':
        public_scripts = [s for s in public_scripts if search.lower() in s.get('title', '').lower() or search.lower() in s.get('playwright', '').lower()]
        all_scripts = [s for s in all_scripts if search.lower() in s.get('title', '').lower() or search.lower() in s.get('playwright', '').lower()]

    if genre:
        public_scripts = [s for s in public_scripts if genre.lower() in s.get('genre', '').lower()]
        all_scripts = [s for s in all_scripts if genre.lower() in s.get('genre', '').lower()]

    return jsonify({
        'status': 'success',
        'public': public_scripts,
        'drafts': my_drafts,
        'pending': pending_requests,
        'all': all_scripts,
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
        else:
            return jsonify({"status": "error", "message": "AI servers are down. Failed to extract keywords."}), 503
    except Exception as err:
        print(f"Gemini keyword extraction API call error: {err}")
        return jsonify({"status": "error", "message": "AI servers are down. Please try again later."}), 503


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
        return jsonify({"status": "error", "message": "AI servers are down. Please try again later."}), 503



