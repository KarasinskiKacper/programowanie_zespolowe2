from flask import Blueprint, jsonify, request
from db_objects import Chat_history, Rooms, db

bp = Blueprint('chat_history', __name__, url_prefix='/api')

@bp.route('/chat_history', methods=['GET'])
def get_chat_history():
    """!
    Get the chat history of a room by its id.

    @param room_id The id of the room to get the chat history for.

    @return A list of chat history messages, each containing the message_id, room_id, user_name, message, and create_date of the message.

    @exception 400 If the room_id parameter is missing.
    @exception 404 If the room is not found.
    """
    query = Chat_history.query
    
    if request.args.get('room_id'):
        room_id = request.args.get('room_id')
        query = query.filter_by(room_id=room_id)
    else:
        return jsonify({"error": "Missing room_id parameter"}), 400
    
    room = Rooms.query.filter_by(room_id=room_id).first()

    if room is None:
        return jsonify({"error": "Room not found"}), 404

    chat_history = query.all()

    return jsonify([chat_history.to_dict() for chat_history in chat_history])