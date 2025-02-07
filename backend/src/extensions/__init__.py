# src/extensions/__init__.py
from .database import db
from .jwt import jwt
from .cors import configure_cors

def init_extensions(app):
    db.init_app(app)
    jwt.init_app(app)
    configure_cors(app)
