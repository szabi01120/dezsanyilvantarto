# src/extensions/jwt.py
from flask_jwt_extended import JWTManager
from datetime import datetime
from src.extensions.database import db
from src.models.user import User  # Ezt még létrehozzuk

jwt = JWTManager()

@jwt.user_identity_loader
def user_identity_lookup(user):
    if isinstance(user, dict):
        return user.get('id')
    return user.id

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return {
        'error': 'A token lejárt. Kérjük, jelentkezzen be újra!',
        'code': 'token_expired'
    }, 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return {
        'error': 'Érvénytelen token!',
        'code': 'invalid_token'
    }, 401

@jwt.unauthorized_loader
def missing_token_callback(error):
    return {
        'error': 'Hozzáférés megtagadva! Token szükséges!',
        'code': 'authorization_required'
    }, 401
