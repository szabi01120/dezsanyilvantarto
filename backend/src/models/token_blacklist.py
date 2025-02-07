from src.extensions.database import db
from datetime import datetime

class TokenBlacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    
    @classmethod
    def add_token_to_blacklist(cls, jti, expires_at):
        token = cls(jti=jti, expires_at=expires_at)
        db.session.add(token)
        db.session.commit()

    @classmethod
    def is_token_blacklisted(cls, jti):
        return cls.query.filter_by(jti=jti).first() is not None
    
    @classmethod
    def clean_expired_tokens(cls):
        cls.query.filter(cls.expires_at < datetime.utcnow()).delete()
        db.session.commit()