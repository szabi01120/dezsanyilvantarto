from flask_jwt_extended import JWTManager
from datetime import datetime
from src.extensions.database import db
from src.models.user import User

jwt = JWTManager()

@jwt.user_identity_loader
def user_identity_lookup(user):
    if hasattr(user, 'id'):
        return str(user.id)
    return str(user) if user is not None else None

@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_payload):
    identity = jwt_payload["sub"]
    return User.query.filter_by(id=int(identity)).one_or_none()

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    print(f"Expired token error: {jwt_payload}")
    return {
        'error': 'A token lejárt. Kérjük, jelentkezzen be újra!',
        'code': 'token_expired'
    }, 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    print(f"Invalid token error: {error}")
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
