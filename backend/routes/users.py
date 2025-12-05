from flask import Blueprint, jsonify, request
from db_objects import Users, db, Users_room, Chat_history, Rooms
from flask_jwt_extended import jwt_required, get_jwt_identity
from user_activity import get_online_users as get_online_users_from_app_state

bp = Blueprint('users', __name__, url_prefix='/api')

# @bp.route('/users', methods=['GET'])
# def get_users():
#     users = Users.query.all()
#     return jsonify([user.to_dict() for user in users])

@bp.route("users/online", methods=['GET'])
@jwt_required()
def get_online_users():
    """
    Get a list of online users for the current user.

    Returns:
        list: A list of online users, each containing the user_name.
    """
    user_name = get_jwt_identity()
    online_users = get_online_users_from_app_state(user_name)

    return jsonify(list(online_users))

# @bp.route('/user', methods=['GET'])
# def get_user():
#     query = Users.query
#     if request.args.get("user_name"):
#         user_name = request.args.get("user_name")
#         query = query.filter_by(user_name=user_name)
#     else:
#         return jsonify({"error": "Missing user_name parameter"}), 400
    
#     user = query.first()

#     if user is None:
#         return jsonify({"error": "User not found"}), 404
    
#     return jsonify(user.to_dict())

@bp.route('/user/change_password', methods=['POST'])
@jwt_required()
def change_password():
    """
    Change the password of the current user.

    Parameters:
        old_password (str): The current password of the user.
        new_password (str): The new password to set for the user.

    Returns:
        dict: A dictionary containing the message of the password change action.
    """
    user_name = get_jwt_identity()
    data = request.json
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({"error": "Missing password parameter"}), 400

    user = Users.query.filter_by(user_name=user_name).first()

    if user is None:
        return jsonify({"error": "User not found"}), 404
    
    if user.password != old_password:
        return jsonify({"error": "Invalid old password"}), 401
    
    user.password = new_password
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200

@bp.route('/user/get_info', methods=['GET'])
@jwt_required()
def get_user_info():
    #user_name = request.args.get("user_name")
    
    """
    Get information about the current user.

    Returns:
        dict: A dictionary containing the count of messages sent by the user, the count of private and public rooms owned by the user, and the count of private and public rooms that the user is a member of.
    """
    user_name = get_jwt_identity()
        
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