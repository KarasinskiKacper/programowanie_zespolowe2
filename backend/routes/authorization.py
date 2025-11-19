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
        return jsonify(status = "Missing Login or password"), 420

    if Users.query.filter_by(user_name=username).first():
        return jsonify(status="USER_EXISTS"), 409

    new_user = Users(user_name=username, password=password)
    db.session.add(new_user)
    db.session.commit()
    token = create_access_token(identity=username)
    return jsonify({"access_token": token}), 200

@bp.route("/login", methods=['POST'])
def login():
    data = request.json
    username = data.get("user_name")
    password = data.get("password")

    if not username or not password:
        return jsonify(status = "Missing Login or password"), 420

    user = Users.query.filter_by(user_name=username).first()

    if user and user.password == password:
        token = create_access_token(identity=username)
        return jsonify({"access_token": token}), 200
    else:
        return jsonify(status="USER_DOESNT_EXISTS"), 409