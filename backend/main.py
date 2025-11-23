import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from db_objects import Users, db
from room import socketio
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

def create_app():
    load_dotenv()
    app = Flask(__name__)
    CORS(app) # Enable CORS for next.js
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    jwt = JWTManager(app)
    # TODO add dotenv detection and verification, throw error if not found or invalid
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqldb://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    socketio.init_app(app)

    db.init_app(app)

    from routes.users import bp as users_bp
    app.register_blueprint(users_bp)

    from routes.rooms import bp as rooms_bp
    app.register_blueprint(rooms_bp)
    
    from routes.chat_history import bp as chat_history_bp
    app.register_blueprint(chat_history_bp)
    
    from routes.user_rooms import bp as user_rooms_bp
    app.register_blueprint(user_rooms_bp)

    from routes.authorization import bp as auth_bp
    app.register_blueprint(auth_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    socketio.run(app, debug=True, host="0.0.0.0", port=5000) # enable access from any IP
