from flask_socketio import SocketIO, emit, join_room, leave_room
from db_objects import Chat_history, db, Rooms, Users_room

socketio = SocketIO(cors_allowed_origins="*")

@socketio.on('join')
def handle_join(data):
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
            return

    join_room(room_id)

    emit('user_joined', {
        "user_name": user_name,
        'room_id': room_id
    })
    

@socketio.on('leave')
def handle_leave(data):
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