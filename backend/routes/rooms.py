from flask import Blueprint, jsonify, request
from db_objects import Rooms, db, Users_room
from room import socketio
from app_state import update_user_room_maps, remove_room

bp = Blueprint('rooms', __name__, url_prefix='/api')

@bp.route('/rooms', methods=['GET'])
def get_rooms():
    query = Rooms.query.filter_by(is_private=False)
    
    rooms = query.all()
    
    return jsonify([room.to_dict() for room in rooms])

@bp.route('/room', methods=['GET'])
def get_room():
    query = Rooms.query

    if request.args.get("room_id"):
        room_id = request.args.get("room_id")
        query = query.filter_by(room_id=room_id)
    else:
        return jsonify({"error": "Missing room_id parameter"}), 400

    room = query.first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404

    return jsonify(room.to_dict())

@bp.route('/room/join', methods=['POST'])
def join_room():
    data = request.json
    room_id = data.get("room_id")
    user_name = data.get("user_name")
    access_key = data.get("access_key")
    
    if not room_id or not user_name:
        return jsonify({"error": "Missing room_id or user_name parameter"}), 400
    
    user_room = Users_room.query.filter_by(user_name=user_name, room_id=room_id).first()
    if user_room is not None:
        return jsonify({"error": "User already in room"}), 400
    
    room = Rooms.query.filter_by(room_id=room_id).first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404
    
    if room.is_private and room.access_key != access_key:
        return jsonify({"error": "Invalid access key"}), 401

    new_user_room = Users_room(user_name=user_name, room_id=room_id)
    db.session.add(new_user_room)
    db.session.commit()

    update_user_room_maps(room_id, user_name)

    socketio.emit("user_list_updated", to=str(room_id))

    return jsonify({"message": "Joined room successfully"}), 200

@bp.route('/room/leave', methods=['POST'])
def leave_room():
    data = request.json
    room_id = data.get("room_id")
    user_name = data.get("user_name")

    if not room_id or not user_name:
        return jsonify({"error": "Missing room_id or user_name parameter"}), 400

    room = Rooms.query.filter_by(room_id=room_id).first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404

    user_room = Users_room.query.filter_by(user_name=user_name, room_id=room_id).first()

    if user_room is None:
        return jsonify({"error": "User not in room"}), 404

    db.session.delete(user_room)
    db.session.commit()

    update_user_room_maps(room_id, user_name, remove=True)

    if len(room_users[room_id]) == 0:
        remove_room(room_id)

    socketio.emit("user_list_updated", to=str(room_id))

    return jsonify({"message": "Left room successfully"}), 200

@bp.route('/room/create', methods=['POST'])
def create_room():
    data = request.json
    room_name = data.get("room_name")
    room_owner = data.get("room_owner")
    is_private = data.get("is_private")
    access_key = data.get("access_key")
    
    if not room_name or not room_owner:
        return jsonify({"error": "Missing room_name or room_owner parameter"}), 400
    
    if is_private and not access_key:
        return jsonify({"error": "Missing access_key parameter"}), 400

    new_room = Rooms(room_name=room_name, room_owner=room_owner, is_private=is_private, access_key=access_key, create_date=db.func.now())
    db.session.add(new_room)
    db.session.commit()

    update_user_room_maps(new_room.room_id, room_owner)

    return jsonify({"message": "Room created successfully"}), 200

@bp.route('/room/delete', methods=['POST'])
def delete_room():
    data = request.json
    room_id = data.get("room_id")
    room_owner = data.get("room_owner")

    if not room_id:
        return jsonify({"error": "Missing room_id parameter"}), 400

    room = Rooms.query.filter_by(room_id=room_id, room_owner=room_owner).first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404

    db.session.delete(room)
    db.session.commit()

    remove_room(room_id)

    return jsonify({"message": "Room deleted successfully"}), 200