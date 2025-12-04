from flask import Blueprint, jsonify, request
from db_objects import Rooms, db, Users_room, Users
from flask_jwt_extended import jwt_required, get_jwt_identity
from app_state import socketio, room_users as room_users_app_state, update_user_room_maps, remove_room

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

@bp.route('/room/join_public', methods=['POST'])
@jwt_required()
def join_public_room():
    user_name = get_jwt_identity()
    data = request.json
    room_id = data.get("room_id")
    access_key = data.get("access_key")
    
    if not room_id:
        return jsonify({"error": "Missing room_id parameter"}), 400
    
    user_room = Users_room.query.filter_by(user_name=user_name, room_id=room_id).first()
    if user_room is not None:
        return jsonify({"error": "User already in room"}), 400
    
    room = Rooms.query.filter_by(room_id=room_id).first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404
    
    new_user_room = Users_room(user_name=user_name, room_id=room_id)
    db.session.add(new_user_room)
    db.session.commit()

    update_user_room_maps(room_id, user_name)

    socketio.emit("user_list_updated", to=room_id)

    return jsonify({"message": "Joined room successfully"}), 200

@bp.route('/room/join_private', methods=['POST'])
@jwt_required()
def join_private_room():
    user_name = get_jwt_identity()
    data = request.json
    access_key = data.get("access_key")

    if not access_key:
        return jsonify({"error": "Missing access_key parameter"}), 400

    room = Rooms.query.filter_by(access_key=access_key).first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404
    
    user = Users.query.filter_by(user_name=user_name).first()
    
    if user is None:
        return jsonify({"error": "User not found"}), 404

    existing_user_room = Users_room.query.filter_by(user_name=user_name, room_id=room.room_id).first()

    if existing_user_room is not None:
        return jsonify({"error": "User already in room"}), 400

    user_room = Users_room(user_name=user_name, room_id=room.room_id)
    db.session.add(user_room)
    db.session.commit()
    
    socketio.emit("user_list_updated", to=str(room.room_id))

    return jsonify({"message": "Joined room successfully"}), 200

@bp.route('/room/leave', methods=['POST'])
@jwt_required()
def leave_room():
    user_name = get_jwt_identity()
    data = request.json
    room_id = data.get("room_id")

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

    if len(room_users_app_state.get(room_id, set())) == 0:
        remove_room(room_id)

    socketio.emit("user_list_updated", to=room_id)

    return jsonify({"message": "Left room successfully"}), 200

@bp.route('/room/create', methods=['POST'])
@jwt_required()
def create_room():
    room_owner = get_jwt_identity()
    data = request.json
    room_name = data.get("room_name")
    is_private = data.get("is_private")
    access_key = data.get("access_key")
    
    if not room_name or not room_owner:
        return jsonify({"error": "Missing room_name or room_owner parameter"}), 400
    
    if is_private and not access_key:
        return jsonify({"error": "Missing access_key parameter"}), 400
    
    if access_key is not None:
        existing_room = Rooms.query.filter_by(access_key=access_key).first()
    
        if existing_room is not None:
            return jsonify({"error": "Room with this access key already exists"}), 400

    new_room = Rooms(room_name=room_name, room_owner=room_owner, is_private=is_private, access_key=access_key, create_date=db.func.now())
    db.session.add(new_room)
    db.session.commit()

    update_user_room_maps(new_room.room_id, room_owner)

    socketio.emit("room_list_updated")
    
    return jsonify({"message": "Room created successfully"}), 200

@bp.route('/room/delete', methods=['POST'])
@jwt_required()
def delete_room():
    room_owner = get_jwt_identity()
    data = request.json
    room_id = data.get("room_id")

    if not room_id:
        return jsonify({"error": "Missing room_id parameter"}), 400

    room = Rooms.query.filter(room_id==room_id, room_owner==room_owner).first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404

    db.session.delete(room)
    db.session.commit()

    remove_room(room_id)

    socketio.emit("room_list_updated")

    return jsonify({"message": "Room deleted successfully"}), 200

@bp.route('/room/edit', methods=['POST'])
@jwt_required()
def edit_room():
    data = request.json
    room_owner = get_jwt_identity()
    room_id = data.get("room_id")
    new_access_key = data.get("new_access_key")
    is_private = data.get("is_private")
    new_name = data.get("new_name")

    if not room_id:
        return jsonify({"error": "Missing room_id parameter"}), 400

    room = Rooms.query.filter_by(room_id=room_id).first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404
    
    if room.room_owner != room_owner:
        return jsonify({"error": "You are not the owner of this room"}), 403
    
    if is_private:
        room.is_private = True
    else:
        room.is_private = False
    
    room.name = new_name

    room.access_key = new_access_key

    db.session.commit()

    return jsonify({"message": "Room edited successfully"}), 200