from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy import func

db = SQLAlchemy()

class Users(db.Model):
    """!
    Users model representing a user account in the database.
    """
    __tablename__ = "users"
    user_name = db.Column(db.String(48), primary_key=True)  ##< The unique username, serves as the primary key. Maximum 48 characters.
    password = db.Column(db.String(128), nullable=False)  ##< The password for the user account. Maximum 128 characters, required field.
    
    def to_dict(self):
        """!
        Converts the Users instance to a dictionary representation.
        
        @return Dictionary containing user_name and password.
        """
        return {
            "user_name": self.user_name,
            "password": self.password
        }
        
class Rooms(db.Model):
    """!
    Database model representing a chat room.
    
    This model defines the structure for storing room information in the database.
    Rooms can be public or private, and private rooms require an access key for entry.
    """
    __tablename__ = "rooms"
    room_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  ##< Unique identifier for the room. Auto-incremented primary key.
    room_name = db.Column(db.String(64), nullable=False)  ##< Name of the room. Maximum 64 characters. Required.
    room_owner = db.Column(db.String(48), nullable=False)  ##< Username of the room owner. Maximum 48 characters. Required.
    create_date = db.Column(db.DateTime, nullable=False)  ##< Timestamp when the room was created. Required.
    is_private = db.Column(db.Boolean, nullable=False)  ##< Flag indicating whether the room is private (True) or public (False). Required.
    access_key = db.Column(db.String(64), nullable=True, unique=True)  ##< Unique access key for private rooms. Maximum 64 characters. Optional and unique.
    
    def to_dict(self):
        """!
        Converts the room object to a dictionary representation for serialization.
        
        @return Dictionary containing all room attributes.
        """
        return {
            "room_id": self.room_id,
            "room_name": self.room_name,
            "room_owner": self.room_owner,
            "create_date": self.create_date,
            "is_private": self.is_private,
            "access_key": self.access_key
        }
        
class Users_room(db.Model):
    """!
    Database model representing the association between users and rooms.
    
    This model creates a many-to-many relationship between the Users and Rooms tables,
    allowing multiple users to be associated with multiple rooms.
    """
    __tablename__ = "users_room"
    user_name = db.Column(db.String(48), ForeignKey("users.user_name"), primary_key=True)  ##< Foreign key reference to the user's user_name in the users table. Part of the composite primary key.
    room_id = db.Column(db.Integer, ForeignKey("rooms.room_id"), primary_key=True)  ##< Foreign key reference to the room's ID in the rooms table. Part of the composite primary key.
    
    def to_dict(self):
        """!
        Converts the Users_room instance to a dictionary representation.
        
        @return Dictionary containing user_name and room_id.
        """
        return {
            "user_name": self.user_name,
            "room_id": self.room_id
        }
        
class Chat_history(db.Model):
    """!
    Chat_history model representing a message in a chat room.
    """
    __tablename__ = "chat_history"
    message_id = db.Column(db.Integer, primary_key=True, autoincrement=True)  ##< Primary key, unique identifier for each message. Automatically incremented.
    room_id = db.Column(db.Integer, nullable=False)  ##< Foreign key reference to the chat room containing this message.
    user_name = db.Column(db.String(48), nullable=False)  ##< Name of the user who sent the message (max 48 characters).
    message = db.Column(db.String(1000), nullable=False)  ##< The content of the chat message (max 1000 characters).
    message_date = db.Column(db.DateTime, nullable=False, server_default=func.now())  ##< Timestamp when the message was created. Defaults to the current server time.
    
    def to_dict(self):
        """!
        Converts the Chat_history instance to a dictionary representation.
        
        @return Dictionary with keys: chat_id, room_id, user_name, message, create_date.
        """
        return {
            "chat_id": self.message_id,
            "room_id": self.room_id,
            "user_name": self.user_name,
            "message": self.message,
            "create_date": self.message_date
        }