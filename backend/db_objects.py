from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy import func

db = SQLAlchemy()

class Users(db.Model):
    __tablename__ = "users"
    user_name = db.Column(db.String(48), primary_key=True)
    password = db.Column(db.String(128), nullable=False)
    
    def to_dict(self):
        return {
            "user_name": self.user_name,
            "password": self.password
        }
        
class Rooms(db.Model):
    __tablename__ = "rooms"
    room_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    room_name = db.Column(db.String(64), nullable=False)
    room_owner = db.Column(db.String(48), nullable=False)
    create_date = db.Column(db.DateTime, nullable=False)
    is_private = db.Column(db.Boolean, nullable=False)
    access_key = db.Column(db.String(64), nullable=True, unique=True)
    
    def to_dict(self):
        return {
            "room_id": self.room_id,
            "room_name": self.room_name,
            "room_owner": self.room_owner,
            "create_date": self.create_date,
            "is_private": self.is_private,
            "access_key": self.access_key
        }
        
class Users_room(db.Model):
    __tablename__ = "users_room"
    user_name = db.Column(db.String(48), ForeignKey("users.user_name"), primary_key=True)
    room_id = db.Column(db.Integer, ForeignKey("rooms.room_id"), primary_key=True)
    
    def to_dict(self):
        return {
            "user_name": self.user_name,
            "room_id": self.room_id
        }
        
class Chat_history(db.Model):
    __tablename__ = "chat_history"
    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    room_id = db.Column(db.Integer, nullable=False)
    user_name = db.Column(db.String(48), nullable=False)
    message = db.Column(db.String(1000), nullable=False)
    message_date = db.Column(db.DateTime, nullable=False, server_default=func.now())
    
    def to_dict(self):
        return {
            "chat_id": self.message_id,
            "room_id": self.room_id,
            "user_name": self.user_name,
            "message": self.message,
            "create_date": self.message_date
        }