from flask import Blueprint, request, jsonify
from dbConfig import db, User
from datetime import datetime, timedelta
from argon2 import PasswordHasher

ph = PasswordHasher()

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()

    required_fields = ['username', 'email', 'password']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Hiányzó adatok!'}), 400

    new_user = User(
        username=data['username'],
        email=data['email']
    )
    
    is_strong, message = new_user.check_password_strength(data['password'])
    if not is_strong:
        return jsonify({'error': message}), 400
    
    try:
        new_user.set_password(data['password'])        
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@users_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Hiányzó felhasználónév vagy jelszó!'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user:
        ph.hash(data['password'])
        return jsonify({'error': 'Hibás felhasználónév vagy jelszó!'}), 400
    
    if user.is_locked:
        if user.last_failed_login and \
            datetime.utcnow() - user.last_failed_login > timedelta(minutes=5):
            user.is_locked = False
            user.failed_login_attempts = 0
            user.last_failed_login = None
            db.session.commit()
        else:
            return jsonify({
                'error': 'A felhasználói fiók zárolva van! Próbálkozzon később!'
            }), 403
        
    if user.verify_password(data['password']):
        return jsonify({
            'message': 'Sikeres bejeletkezés!',
            'user': user.to_dict()
        })
    
    return jsonify({'error': 'Hibás felhasználónév vagy jelszó!'}), 401
    
@users_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])
    
@users_bp.route('/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

@users_bp.route('/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    try:
        if 'password' in data:
            is_strong, message = user.check_password_strength(data['password'])
            if not is_strong:
                return jsonify({'error': message}), 400
            user.set_password(data['password'])

        if 'email' in data:
            user.email = data['email']

        db.session.commit()
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@users_bp.route('/api/users/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get_or_404(id)

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Felhasználó törölve!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400