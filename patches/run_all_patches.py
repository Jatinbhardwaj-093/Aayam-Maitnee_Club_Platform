import os
import re
import subprocess

# 1. Models
with open('backend/models.py', 'r') as f:
    models = f.read()

models = models.replace(
    'class AuditionPosition(db.Model):\n    __tablename__ = "audition_position"\n\n    id = db.Column(db.Integer, primary_key=True, autoincrement=True)\n    production_name = db.Column(db.String(150), nullable=False)\n    role_name = db.Column(db.String(150), nullable=False)\n    role_category = db.Column(db.String(100), default="Character Role") # Character Role, Makeup & Hair, Backstage Technical, Costume, Stage Management\n    character_description = db.Column(db.Text)\n    requirements = db.Column(db.Text)\n    slots_available = db.Column(db.Integer, default=1)\n    status = db.Column(db.String(50), default="Open Calling") # Open Calling, In Review, Casting Closed\n    created_at = db.Column(db.DateTime, default=datetime.utcnow)\n\n    def to_dict(self):',
    '''class AuditionPosition(db.Model):
    __tablename__ = "audition_position"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    production_name = db.Column(db.String(150), nullable=False)
    role_name = db.Column(db.String(150), nullable=False)
    role_category = db.Column(db.String(100), default="Character Role")
    character_description = db.Column(db.Text)
    requirements = db.Column(db.Text)
    slots_available = db.Column(db.Integer, default=1)
    status = db.Column(db.String(50), default="Open Calling")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"), nullable=True)
    skills = db.Column(db.Text, nullable=True)
    application_open_date = db.Column(db.Date, nullable=True)
    application_close_date = db.Column(db.Date, nullable=True)
    require_portfolio = db.Column(db.Boolean, default=False)
    require_video = db.Column(db.Boolean, default=False)
    require_audio = db.Column(db.Boolean, default=False)
    event = db.relationship("Event", backref=db.backref("audition_positions", lazy="dynamic"))

    def to_dict(self):'''
)

models = models.replace(
    '''            'status': self.status or 'Open Calling',
            'deadline': 'Sep 25, 2026',
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else 'Jul 20, 2026'
        }''',
    '''            'event_id': self.event_id,
            'skills': self.skills or '',
            'application_open_date': self.application_open_date.strftime('%b %d, %Y') if self.application_open_date else None,
            'application_close_date': self.application_close_date.strftime('%b %d, %Y') if self.application_close_date else None,
            'require_portfolio': self.require_portfolio,
            'require_video': self.require_video,
            'require_audio': self.require_audio,
            'period_status': self._compute_period_status(),
            'slots_available': self.slots_available or 1,
            'status': self.status or 'Open Calling',
            'deadline': self.application_close_date.strftime('%b %d, %Y') if self.application_close_date else 'Sep 25, 2026',
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else 'Jul 20, 2026'
        }

    def _compute_period_status(self):
        from datetime import date as d
        today = d.today()
        if self.status in ('Casting Closed', 'Concluded'):
            return 'concluded'
        if self.status == 'In Review':
            return 'review'
        if self.application_open_date and self.application_open_date > today:
            return 'upcoming'
        if self.application_close_date and self.application_close_date < today:
            return 'review'
        return 'application' '''
)

models = models.replace(
    '''class AuditionApplication(db.Model):
    __tablename__ = "audition_application"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    position_id = db.Column(db.Integer, db.ForeignKey('audition_position.id'), nullable=True)
    role_name = db.Column(db.String(150), nullable=False)
    applicant_name = db.Column(db.String(150), nullable=False)
    applicant_email = db.Column(db.String(120), nullable=False)
    applicant_phone = db.Column(db.String(50))
    experience_level = db.Column(db.String(50), default="Ensemble Member")
    portfolio_link = db.Column(db.String(255))
    notes = db.Column(db.Text)
    status = db.Column(db.String(50), default="Pending Review")
    audition_date = db.Column(db.String(50))
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': str(self.id),
            'position_id': self.position_id,
            'role_name': self.role_name,
            'applicant_name': self.applicant_name,
            'applicant_email': self.applicant_email,
            'applicant_phone': self.applicant_phone,
            'experience_level': self.experience_level,
            'portfolio_link': self.portfolio_link,
            'notes': self.notes,
            'status': self.status,
            'audition_date': self.audition_date,
            'submitted_at': self.submitted_at.strftime('%Y-%m-%d %H:%M:%S') if self.submitted_at else None
        }''',
    '''class AuditionApplication(db.Model):
    __tablename__ = "audition_application"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    position_id = db.Column(db.Integer, db.ForeignKey('audition_position.id'), nullable=True)
    role_name = db.Column(db.String(150), nullable=False)
    applicant_name = db.Column(db.String(150), nullable=False)
    applicant_email = db.Column(db.String(120), nullable=False)
    applicant_phone = db.Column(db.String(50))
    experience_level = db.Column(db.String(50), default="Ensemble Member")
    portfolio_link = db.Column(db.String(255))
    notes = db.Column(db.Text)
    status = db.Column(db.String(50), default="Pending Review")
    audition_date = db.Column(db.String(50))
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    portfolio_filename = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': str(self.id),
            'position_id': self.position_id,
            'role_name': self.role_name,
            'applicant_name': self.applicant_name,
            'applicant_email': self.applicant_email,
            'applicant_phone': self.applicant_phone,
            'experience_level': self.experience_level,
            'portfolio_link': self.portfolio_link,
            'notes': self.notes,
            'status': self.status,
            'audition_date': self.audition_date,
            'submitted_at': self.submitted_at.strftime('%Y-%m-%d %H:%M:%S') if self.submitted_at else None,
            'user_id': self.user_id,
            'portfolio_filename': self.portfolio_filename
        }'''
)
with open('backend/models.py', 'w') as f:
    f.write(models)

# 2. API
with open('backend/api.py', 'r') as f:
    api = f.read()
    
api = re.sub(r"@api_bp\.route\('/my-auditions', methods=\['GET'\]\)\ndef get_my_auditions\(\):.*?(?=@api_bp)", '''@api_bp.route('/my-auditions', methods=['GET'])
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
    return jsonify(result)\n\n''', api, flags=re.DOTALL)

api = re.sub(r"@api_bp\.route\('/audition/submit', methods=\['POST'\]\)\ndef submit_audition\(\):.*?(?=@api_bp)", '''@api_bp.route('/audition/submit', methods=['POST'])
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
    return jsonify({'success': True, 'id': app.id})\n\n''', api, flags=re.DOTALL)

new_endpoints = """@api_bp.route('/audition-applications/<int:app_id>/withdraw', methods=['POST'])
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

"""
if "/audition-applications/<int:app_id>/withdraw" not in api:
    api += "\n" + new_endpoints

api = api.replace('''@api_bp.route('/auditions/positions', methods=['GET'])
def get_audition_positions():
    from models import AuditionPosition
    positions = AuditionPosition.query.order_by(AuditionPosition.created_at.desc()).all()
    result = []
    for p in positions:
        result.append(p.to_dict())
    return jsonify(result)''', '''@api_bp.route('/auditions/positions', methods=['GET'])
def get_audition_positions():
    from models import AuditionPosition
    positions = AuditionPosition.query.order_by(AuditionPosition.created_at.desc()).all()
    
    period_filter = request.args.get('period')
    event_id_filter = request.args.get('event_id')
    
    result = []
    for p in positions:
        result.append(p.to_dict())
        
    if period_filter:
        result = [r for r in result if r.get('period_status') == period_filter]
    if event_id_filter:
        result = [r for r in result if r.get('event_id') == int(event_id_filter)]
        
    return jsonify(result)''')

api = api.replace('''@api_bp.route('/auditions/positions', methods=['POST'])
def create_audition_position():
    from models import AuditionPosition, db
    data = request.json or {}
    pos = AuditionPosition(
        production_name=data.get('production_name', ''),
        role_name=data.get('role_name', ''),
        role_category=data.get('role_category', 'Character Role'),
        character_description=data.get('character_description', ''),
        requirements=data.get('requirements', ''),
        slots_available=int(data.get('slots_available', 1)),
        status=data.get('status', 'Open Calling')
    )
    db.session.add(pos)
    db.session.commit()
    return jsonify({'success': True, 'position': pos.to_dict()})''', '''@api_bp.route('/auditions/positions', methods=['POST'])
def create_audition_position():
    from models import AuditionPosition, db
    from datetime import datetime
    data = request.json or {}
    pos = AuditionPosition(
        production_name=data.get('production_name', ''),
        role_name=data.get('role_name', ''),
        role_category=data.get('role_category', 'Character Role'),
        character_description=data.get('character_description', ''),
        requirements=data.get('requirements', ''),
        slots_available=int(data.get('slots_available', 1)),
        status=data.get('status', 'Open Calling'),
        event_id=int(data['event_id']) if data.get('event_id') else None,
        skills=data.get('skills', ''),
        application_open_date=datetime.strptime(data['application_open_date'], '%Y-%m-%d').date() if data.get('application_open_date') else None,
        application_close_date=datetime.strptime(data['application_close_date'], '%Y-%m-%d').date() if data.get('application_close_date') else None,
    )
    db.session.add(pos)
    db.session.commit()
    return jsonify({'success': True, 'position': pos.to_dict()})''')

old_gallery = '''@api_bp.route('/gallery', methods=['POST'])
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
    return jsonify({'status': 'success', 'item': item.to_dict()}), 201'''

new_gallery = '''@api_bp.route('/gallery', methods=['POST'])
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
    return jsonify({'status': 'success', 'item': item.to_dict()}), 201'''

api = api.replace(old_gallery, new_gallery)
if "/uploads/<path:filename>" not in api:
    api += """
@api_bp.route('/uploads/<path:filename>', methods=['GET'])
def serve_uploads(filename):
    import os
    from flask import send_from_directory
    upload_dir = os.path.join(os.path.dirname(__file__), 'uploads')
    return send_from_directory(upload_dir, filename)
"""

with open('backend/api.py', 'w') as f:
    f.write(api)

