import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from db_objects import Users, db


def create_app():
    load_dotenv()
    app = Flask(__name__)

    # TODO add dotenv detection and verification, throw error if not found or invalid
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqldb://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    from routes.users import bp as users_bp
    app.register_blueprint(users_bp)

    from routes.rooms import bp as rooms_bp
    app.register_blueprint(rooms_bp)
    
    from routes.chat_history import bp as chat_history_bp
    app.register_blueprint(chat_history_bp)
    
    from routes.user_rooms import bp as user_rooms_bp
    app.register_blueprint(user_rooms_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)