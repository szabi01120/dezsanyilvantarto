# src/models/user.py
from datetime import datetime
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
import secrets
from src.extensions.database import db

ph = PasswordHasher()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    real_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    salt = db.Column(db.String(32), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)  # Új mező a legutóbbi sikeres bejelentkezéshez
    failed_login_attempts = db.Column(db.Integer, default=0)
    last_failed_login = db.Column(db.DateTime)
    is_locked = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        """Jelszó beállítása salt-tal és hash-eléssel"""
        self.salt = secrets.token_hex(16)
        salted_password = f"{password}{self.salt}{self.username}"
        self.password_hash = ph.hash(salted_password)

    def verify_password(self, password):
        """Jelszó ellenőrzése és bejelentkezési kísérletek kezelése"""
        if self.is_locked:
            # Ha a fiók zárolva van, ellenőrizzük, hogy eltelt-e már 5 perc
            if self.last_failed_login and \
                (datetime.utcnow() - self.last_failed_login).total_seconds() > 300:
                self.is_locked = False
                self.failed_login_attempts = 0
                self.last_failed_login = None
                db.session.commit()
            else:
                return False
        
        try:
            salted_password = f"{password}{self.salt}{self.username}"
            ph.verify(self.password_hash, salted_password)
            # Sikeres bejelentkezés esetén nullázzuk a számlálókat
            self.failed_login_attempts = 0
            self.is_locked = False
            self.last_failed_login = None
            self.last_login = datetime.utcnow()
            db.session.commit()
            return True
        except VerifyMismatchError:
            # Sikertelen bejelentkezés kezelése
            self.failed_login_attempts += 1
            self.last_failed_login = datetime.utcnow()
            if self.failed_login_attempts >= 3:
                self.is_locked = True
            db.session.commit()
            return False

    def check_password_strength(self, password):
        """Jelszó erősségének ellenőrzése"""
        if len(password) < 8:
            return False, 'A jelszónak legalább 8 karakter hosszúnak kell lennie!'
        
        if not any(char.isdigit() for char in password):
            return False, 'A jelszónak tartalmaznia kell legalább egy számot!'
        
        if not any(char.isupper() for char in password):
            return False, 'A jelszónak tartalmaznia kell legalább egy nagybetűt!'
        
        if not any(char.islower() for char in password):
            return False, 'A jelszónak tartalmaznia kell legalább egy kisbetűt!'
        
        special_chars = '!@#$%^&*(),.?":{}|<>'
        if not any(char in special_chars for char in password):
            return False, 'A jelszónak tartalmaznia kell legalább egy speciális karaktert!'
        
        return True, "Megfelelő jelszó!"

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_locked': self.is_locked,
            'failed_login_attempts': self.failed_login_attempts,
            'real_name': self.real_name
        }

    @classmethod
    def get_by_username(cls, username):
        """Felhasználó keresése felhasználónév alapján"""
        return cls.query.filter_by(username=username).first()

    @classmethod
    def get_by_email(cls, email):
        """Felhasználó keresése email alapján"""
        return cls.query.filter_by(email=email).first()
