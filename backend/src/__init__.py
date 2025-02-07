# src/__init__.py
from flask import Flask
from src.config.settings import Config
from src.extensions.database import db
from src.extensions import init_extensions
from src.api import register_blueprints

def create_app():
    app = Flask(__name__)
    
    # Load config
    app.config.from_object(Config)
    
    # Initialize extensions
    init_extensions(app)
    
    # Register blueprints
    register_blueprints(app)

    with app.app_context():
        db.create_all()
    
    return app
