from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
from src.models.user import db, User
from src.models.token_blacklist import TokenBlacklist
from datetime import datetime, timedelta
from argon2 import PasswordHasher
from src.extensions.jwt import jwt

ph = PasswordHasher()

token_blacklist = set()

users_bp = Blueprint('users', __name__)

@users_bp.route('/login', methods=['POST']) # POST BEJELENTKEZÉS
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
        token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(hours=24) # 24 óra a token ideje
        )
        return jsonify({
            'message': 'Sikeres bejeletkezés!',
            'user': user.to_dict(),
            'token': token
        }), 200
    
    user.failed_login_attempts += 1
    if user.failed_login_attempts >= 3:
        user.is_locked = True
        user.last_failed_login = datetime.utcnow()

    db.session.commit()
    
    return jsonify({'error': 'Hibás felhasználónév vagy jelszó!'}), 401

@users_bp.route('/logout', methods=['POST']) # POST KIJELENTKEZÉS
@jwt_required()
def logout():
    try:
        jwt_payload = get_jwt()
        jti = get_jwt()["jti"]
        exp = datetime.fromtimestamp(jwt_payload["exp"])

        TokenBlacklist.add_token_to_blacklist(jti, exp)

        TokenBlacklist.clean_expired_tokens()

        return jsonify({
            'message': 'Sikeres kijelentkezés!',
            'status': 'success'
        }), 200
    except Exception as e:
        return jsonify({
            'error': 'Hiba a kijelentkezés során!',
            'details': str(e)
        }), 500
    
@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return TokenBlacklist.is_token_blacklisted(jti)

@users_bp.route('/me', methods=['GET']) # GET CURRENT USER
@jwt_required()
def get_current_user():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'error': 'Nincs ilyen felhasználó!'}), 404
        
        return jsonify({
            'status': 'success',
            'data': user.to_dict()
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': 'Hiba a felhasználó lekérdezése során!',
            'details': str(e)
        }), 500

@users_bp.route('/', methods=['GET']) # GET USERS
@jwt_required()
def get_users():
    try:
        users = User.query.all()
        return jsonify({
            "status": "success",
            "data": {
                "users": [user.to_dict() for user in users],
                "total": len(users)
            }
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': 'Hiba a felhasználók lekérdezése során!',
            'details': str(e)
        }), 500

@users_bp.route('/<int:id>', methods=['GET']) # GET SPECIFIC USER
@jwt_required()
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict())

@users_bp.route('/add_user', methods=['POST']) # POST USER LÉTREHOZÁSA
# @jwt_required() # MUSZÁJ MOST TOKENHEZ KÖTNI, MIVEL EGYETLEN FELHASZNÁLÓJA VAN A RENDSZERNEK - NEM ENGEDÜNK MÁST BELÉPNI, CSAK ADMIN ÁLTAL LEHET
def create_user():
    data = request.get_json()

    required_fields = ['username', 'email', 'password', 'real_name']
    if not data or not all(field in data for field in required_fields):
        return jsonify({'error': 'Hiányzó adatok!'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'A felhasználónév foglalt!'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Ez az email cím már használatban van.'}), 400
    
    if len(data['username']) < 3:
        return jsonify({'error': 'A felhasználónév legalább 3 karakter hosszú kell legyen!'}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        real_name=data['real_name']
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

@users_bp.route('/<int:id>', methods=['PUT']) # PUT SPECIFIC USER ADATMÓDOSÍTÁS
@jwt_required()
def update_user(id):
    current_user_id = get_jwt_identity()
    if current_user_id != str(id):
        return jsonify({'error': 'Nincs jogosultsága művelethez!'}), 403

    user = User.query.get_or_404(id)
    data = request.get_json()

    try:
        if 'password' in data:
            if 'current_password' not in data:
                return jsonify({'error': 'A jelenlegi jelszó megadása kötelező!'}), 400
            
            if not user.verify_password(data['current_password']):
                return jsonify({'error': 'Hibás jelenlegi jelszó!'}), 400

            is_strong, message = user.check_password_strength(data['password'])
            if not is_strong:
                return jsonify({'error': message}), 400
            user.set_password(data['password'])
        else:
            if 'real_name' in data:
                user.real_name = data['real_name']

            if 'email' in data:
                user.email = data['email']

            # if 'username' in data:
            #     user.username = data['username']

        db.session.commit()
        return jsonify(user.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@users_bp.route('/<int:id>', methods=['DELETE']) # DELETE SPECIFIC USER
@jwt_required()
def delete_user(id):
    current_user_id = get_jwt_identity()
    if current_user_id != id:
        return jsonify({'error': 'Nincs jogosultsága a művelethez!'}), 403

    user = User.query.get(id)
    if user is None:
        return jsonify({'error': 'Nincs ilyen felhasználó!'}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'Felhasználó törölve!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
