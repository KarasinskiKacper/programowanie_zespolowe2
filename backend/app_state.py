from flask_socketio import SocketIO
socketio = SocketIO(cors_allowed_origins="*")

online_users = set()
user_last_seen = {} # user_name: timestamp
room_users = {} # room_id: set(user_name)
user_rooms = {} # user_name: set(room_id)

def update_user_room_maps(room_id: int, user_name: str , remove: bool = False):
    room_users.setdefault(room_id, set())
    user_rooms.setdefault(user_name, set())

    if remove:
        room_users[room_id].discard(user_name)
        user_rooms[user_name].discard(room_id)
    else:
        room_users[room_id].add(user_name)
        user_rooms[user_name].add(room_id)
    
def remove_room(room_id: int):
    users = room_users.pop(room_id, set())
    for user in users:
        user_rooms[user, set()].discard(room_id)
