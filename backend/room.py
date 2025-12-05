from flask_socketio import emit, join_room, leave_room
from db_objects import Chat_history, db, Rooms, Users_room
from user_activity import update_user_last_seen
from app_state import socketio

@socketio.on('join')
def handle_join(data):
    """
    Handle a user joining a room.

    Parameters:
        data (dict): A dictionary containing the user_name and room_id.

    Returns:
        None

    Raises:
        None

    Emits:
        error (dict): A dictionary containing the error message and code.
        user_joined (dict): A dictionary containing the user_name and room_id.

    Notes:
        If the user_name or room_id is missing, an error is emitted.
        If the room is private and the user is not in the room, an error is emitted.
        If the user joins the room successfully, user_joined is emitted to the room.
    """
    room_id = data['room_id']
    user_name = data['user_name']
    
    if not user_name or not room_id:
        emit('error', {'message': 'Missing user_name or room_id',
                       'code': 3})
        return
    
    room = Rooms.query.filter_by(room_id=room_id).first()
    
    if (room.is_private):
        user = Users_room.query.filter_by(user_name=user_name, room_id=room_id).first()
        if (user is None):
            emit('error', {'message': 'Join failed', 'code': 4})
            return

    join_room(room_id)

    emit('user_joined', {
        "user_name": user_name,
        'room_id': room_id
    }, to=room_id)
    

@socketio.on('leave')
def handle_leave(data):
    """
    Handle a user leaving a room.

    Parameters:
        data (dict): A dictionary containing the user_name and room_id.

    Returns:
        None

    Raises:
        None

    Emits:
        error (dict): A dictionary containing the error message and code.
        user_left (dict): A dictionary containing the user_name and room_id.

    Notes:
        If the user_name or room_id is missing, an error is emitted.
        If the user leaves the room successfully, user_left is emitted to the room.
    """
    room_id = data['room_id']
    user_name = data['user_name']
    
    if not user_name or not room_id:
        emit('error', {'message': 'Missing user_name or room_id',
                       'code': 3})
        return
    
    leave_room(room_id)
    
    emit('user_left', {
        'user_name': user_name,
        'room_id': room_id
    }, to=room_id)

@socketio.on('message')
def handle_message(data):
    """
    Handle a message sent by a user to a room.

    Parameters:
        data (dict): A dictionary containing the room_id, user_name, and message.

    Returns:
        None

    Raises:
        None

    Emits:
        error (dict): A dictionary containing the error message and code.
        new_message (dict): A dictionary containing the chat_id, user_name, message, and create_date.

    Notes:
        If the user_name or room_id is missing, an error is emitted.
        If the message is missing, an error is emitted.
        If the message is too long, an error is emitted.
        If the message is sent successfully, new_message is emitted to the room.
    """
    room_id = data['room_id']
    user_name = data['user_name']
    message = data['message']
    
    if not user_name or not room_id:
        emit('error', {'message': 'Missing user_name or room_id',
                       'code': 3})
        return
    
    if not message:
        emit('error', {'message': 'Missing message',
                       'code': 2})
        return
    
    if len(message) > 1000:
        emit('error', {'message': 'Message is too long',
                       'code': 1})
        return
    
    chat_entry = Chat_history(
        room_id=room_id,
        user_name=user_name,
        message=message,
    )
    db.session.add(chat_entry)
    db.session.commit()
    
    emit('new_message', {
        'chat_id': chat_entry.message_id,
        'user_name': user_name,
        'message': message,
        'create_date': chat_entry.message_date.isoformat()
    }, to=room_id)

@socketio.on('watchdog')
def handle_watchdog(data):
    """
    Handle a watchdog event sent by a user.

    Parameters:
        data (dict): A dictionary containing the user_name.

    Returns:
        None

    Raises:
        None

    Emits:
        error (dict): A dictionary containing the error message and code.

    Notes:
        If the user_name is missing, an error is emitted.
        If the watchdog event is sent successfully, update_user_last_seen is called with the user_name.
    """
    user_name = data['user_name']

    if not user_name:
        emit('error', {'message': 'Missing user_name',
                       'code': 3})
        return
    
    update_user_last_seen(user_name)