# src/api/__init__.py
from src.api.users import users_bp
from src.api.products import products_bp

def register_blueprints(app):
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(products_bp, url_prefix='/api/products')
