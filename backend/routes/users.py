from flask import Blueprint, jsonify, request
from db_objects import Users, db

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