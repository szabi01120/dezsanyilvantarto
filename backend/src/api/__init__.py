# src/api/__init__.py
from src.api.users import users_bp

def register_blueprints(app):
    app.register_blueprint(users_bp, url_prefix='/api/users')
