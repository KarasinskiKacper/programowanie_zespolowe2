from flask import Blueprint, jsonify, request
from db_objects import Users, db, Users_room, Chat_history, Rooms

bp = Blueprint('users', __name__, url_prefix='/api')

@bp.route('/users', methods=['GET'])
def get_users():
    users = Users.query.all()
    return jsonify([user.to_dict() for user in users])

@bp.route('/user', methods=['GET'])
def get_user():
    query = Users.query
    if request.args.get("user_name"):
        user_name = request.args.get("user_name")
        query = query.filter_by(user_name=user_name)
    else:
        return jsonify({"error": "Missing user_name parameter"}), 400
    
    user = query.first()

    if user is None:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify(user.to_dict())

@bp.route('/user/change_passowrd', methods=['POST'])
def change_password():
    data = request.json
    user_name = data.get("user_name")
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not user_name or not old_password or not new_password:
        return jsonify({"error": "Missing user_name or password parameter"}), 400

    user = Users.query.filter_by(user_name=user_name).first()

    if user is None:
        return jsonify({"error": "User not found"}), 404
    
    if user.password != old_password:
        return jsonify({"error": "Invalid old password"}), 401
    
    user.password = new_password
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200

@bp.route('/user/get_info', methods=['GET'])
def get_user_info():
    user_name = request.args.get("user_name")
    
    if not user_name:
        return jsonify({"error": "Missing user_name parameter"}), 400
        
    message_count = Chat_history.query.filter_by(user_name=user_name).count()
    private_rooms_owned = Rooms.query.filter(Rooms.room_owner==user_name, Rooms.is_private==True).count()
    public_rooms_owned = Rooms.query.filter(Rooms.room_owner==user_name, Rooms.is_private==False).count()
    
    private_rooms_member = db.session.query(Users_room, Rooms).join(Rooms, Users_room.room_id == Rooms.room_id).filter(Users_room.user_name==user_name, Rooms.is_private==True).count()
    public_rooms_member = db.session.query(Users_room, Rooms).join(Rooms, Users_room.room_id == Rooms.room_id).filter(Users_room.user_name==user_name, Rooms.is_private==False).count()
    
    return jsonify({
        "message_count": message_count,
        "private_rooms_owned": private_rooms_owned,
        "public_rooms_owned": public_rooms_owned,
        "private_rooms_member": private_rooms_member,
        "public_rooms_member": public_rooms_member
    })