from flask import Blueprint, jsonify, request
from db_objects import Users_room, db

bp = Blueprint('user_rooms', __name__, url_prefix='/api')

@bp.route('/user_rooms', methods=['GET'])
def get_user_rooms():
    query = Users_room.query

    if request.args.get("user_name"):
        user_name = request.args.get("user_name")
        query = query.filter_by(user_name=user_name)
    else:
        return jsonify({"error": "Missing user_name parameter"}), 400
    
    user_rooms = query.all()
    return jsonify([user_room.to_dict() for user_room in user_rooms])

@bp.route('/user_list', methods=['GET'])
def get_user_list():
    query = Users_room.query
    
    if request.args.get("room_id"):
        room_id = request.args.get("room_id")
        query = query.filter_by(room_id=room_id)
    else:
        return jsonify({"error": "Missing room_id parameter"}), 400
        
    user_lists = query.all()
    return jsonify([user_list.to_dict() for user_list in user_lists])