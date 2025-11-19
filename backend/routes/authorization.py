from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from db_objects import db, Users

bp = Blueprint("auth", __name__, url_prefix="/api")

@bp.route("/register", methods=['POST'])
def register():
    data = request.json
    username = data.get("user_name")
    password = data.get("password")

    if not username or not password:
        return jsonify(error = "Missing Login or password"), 400

    if Users.query.filter_by(user_name=username).first():
        return jsonify(error = "User Exists"), 409

    new_user = Users(user_name=username, password=password)
    db.session.add(new_user)
    db.session.commit()
    token = create_access_token(identity=username)
    return jsonify({"access_token": token}), 201

@bp.route("/login", methods=['POST'])
def login():
    data = request.json
    username = data.get("user_name")
    password = data.get("password")

    if not username or not password:
        return jsonify(error = "Missing Login or password"), 400

    user = Users.query.filter_by(user_name=username).first()

    if user and user.password == password:
        token = create_access_token(identity=username)
        return jsonify({"access_token": token})
    else:
        return jsonify(error = "Invalid user credentials"), 401