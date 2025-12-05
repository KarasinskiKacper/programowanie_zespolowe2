from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from db_objects import db, Users

bp = Blueprint("auth", __name__, url_prefix="/api")

@bp.route("/register", methods=['POST'])
def register():
    """
    Register a new user

    Parameters:
        user_name (str): The username of the new user
        password (str): The password of the new user

    Returns:
        dict: A dictionary containing the access token of the newly registered user
    Errors:
        400: Missing user_name or password
        409: User with given user_name already exists
    """
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
    """
    Login an existing user

    Parameters:
        user_name (str): The username of the existing user
        password (str): The password of the existing user

    Returns:
        dict: A dictionary containing the access token of the logged in user
    Errors:
        400: Missing user_name or password
        401: Invalid user credentials
    """
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