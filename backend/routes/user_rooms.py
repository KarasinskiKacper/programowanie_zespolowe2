from flask import Blueprint, jsonify, request
from db_objects import Users_room, db, Rooms
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('user_rooms', __name__, url_prefix='/api')

@bp.route('/user_rooms', methods=['GET'])
@jwt_required()
def get_user_rooms():
    """!
    Get a list of user rooms for the current user.

    @return A list of user rooms, each containing the user_name, room_id, room_name, room_owner, and is_private.
    """
    user_name = get_jwt_identity()
    query = db.session.query(Users_room, Rooms).join(Rooms, Users_room.room_id == Rooms.room_id).filter(Users_room.user_name == user_name)
    user_rooms = query.all()
    result = []
    
    for user_room, room in user_rooms:
        print(room.room_name, room)
        result.append({
            "user_name": user_room.user_name,
            "room_id": user_room.room_id,
            "room_name": room.room_name,
            "room_owner": room.room_owner,
            "is_private": room.is_private
        })
        
    return jsonify(result)

@bp.route('/user_list', methods=['GET'])
def get_user_list():
    """!
    Get a list of users in a room.

    @param room_id The id of the room to get the user list for.

    @return A list of users in the room, each containing the user_name, room_id.
    """
    query = Users_room.query
    
    if request.args.get("room_id"):
        room_id = request.args.get("room_id")
        query = query.filter_by(room_id=room_id)
    else:
        return jsonify({"error": "Missing room_id parameter"}), 400
        
    user_lists = query.all()
    return jsonify([user_list.to_dict() for user_list in user_lists])

@bp.route('/user_kick', methods=['POST'])
@jwt_required()
def kick_user():
    """!
    Kick a user from a room.

    @param room_id The id of the room to kick the user from.
    @param user_to_kick The name of the user to kick.

    @return A dictionary containing the message of the kick action.
    """
    user_name = get_jwt_identity()
    data = request.json
    room_id = data.get("room_id")
    user_to_kick = data.get("user_to_kick")
    
    if not user_name or not room_id:
        return jsonify({"error": "Missing user_name or room_id parameter"}), 400
    
    user_room_owner = db.session.query(Users_room, Rooms).join(Rooms, Users_room.room_id == Rooms.room_id).filter(Rooms.room_owner == User_room.user_name)
    if user_room_owner is None:
        return jsonify({"error": "User not owner of room "}), 404
    
    user_room = Users_room.query.filter_by(user_name=user_to_kick, room_id=room_id).first()
    
    if user_room is None:
        return jsonify({"error": "User not in room"}), 404
    
    db.session.delete(user_room)
    db.session.commit()
    
    return jsonify({"message": "User kicked successfully"}), 200