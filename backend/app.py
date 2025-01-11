from flask import Flask, jsonify
from flask_cors import CORS
from dbConfig import init_db
from api.users import users_bp
from config import get_config

def create_app():
    app = Flask(__name__)

    app.config.from_object(get_config())

    CORS(app)

    db = init_db(app)

    app.register_blueprint(users_bp, url_prefix='/api/users')

    @app.route('/api/hello', methods=['GET'])
    def hello():
        return jsonify({'message': 'Hello from the backend!'})

    return app

if __name__ == '__main__':
    app = create_app()
    app.run()