from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from config import get_config
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import secrets

db = SQLAlchemy()
ph = PasswordHasher()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    salt = db.Column(db.String(32), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    failed_login_attempts = db.Column(db.Integer, default=0)
    last_failed_login = db.Column(db.DateTime, default=None)
    is_locked = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.salt = secrets.token_hex(16)
        salted_password = f"{password}{self.salt}{self.username}"
        self.password_hash = ph.hash(salted_password)

    def verify_password(self, password):
        if self.is_locked:
            return False
        
        try:
            salted_password = f"{password}{self.salt}{self.username}"
            ph.verify(self.password_hash, salted_password)
            self.failed_login_attempts = 0
            self.is_locked = False
            self.last_failed_login = None
            db.session.commit()
            return True
        except VerifyMismatchError:
            self.failed_login_attempts += 1
            self.last_failed_login = datetime.utcnow()
            if self.failed_login_attempts >= 3:
                self.is_locked = True
            db.session.commit()
            return False

    def check_password_strength(self, password):
        if len(password) < 8:
            return False, 'A jelszónak legalább 8 karakter hosszúnak kell lennie!'
        
        if not any(char.isdigit() for char in password):
            return False, 'A jelszónak tartalmaznia kell legalább egy számot!'
        
        if not any(char.isupper() for char in password):
            return False, 'A jelszónak tartalmaznia kell legalább egy nagybetűt!'
        
        if not any(char.islower() for char in password):
            return False, 'A jelszónak tartalmaznia kell legalább egy kisbetűt!'
        
        return True, "Megfelelő jelszó!"
        

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat()
        }
    
def init_db(app):
    app.config.from_object(get_config())

    db.init_app(app)

    with app.app_context():
        db.create_all()

    return db