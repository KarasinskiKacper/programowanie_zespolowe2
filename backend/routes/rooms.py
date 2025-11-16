from flask import Blueprint, jsonify, request
from db_objects import Rooms, db

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