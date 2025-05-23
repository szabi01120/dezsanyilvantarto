import os
from app import create_app
from src.extensions.database import db

def reset_database():
    app = create_app()
    
    with app.app_context():
        # Régi adatbázis törlése
        db_path = app.config.get('SQLALCHEMY_DATABASE_URI', '').replace('sqlite:///', '')
        if os.path.exists(db_path):
            os.remove(db_path)
            print(f"Régi adatbázis törölve: {db_path}")
        
        # Új táblák létrehozása
        db.create_all()
        print("Új adatbázis létrehozva az összes táblával!")
        
        # Táblák ellenőrzése
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"Létrehozott táblák: {tables}")

if __name__ == '__main__':
    reset_database()
