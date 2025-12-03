from app_state import socketio, online_users, user_last_seen, room_users, user_rooms
import time

def set_user_online(user_name: str) -> None:
    if user_name in online_users:
        return
    online_users.add(user_name)

    for room_id in user_rooms.get(user_name, set()):
        socketio.emit("user_online", {"user_name": user_name}, to=str(room_id))

def update_user_last_seen(user_name: str) -> None:
    set_user_online(user_name)
    user_last_seen[user_name] = int(round(time.time() * 1000))

def get_online_users(user_name: str) -> set:
    rooms = user_rooms.get(user_name, set())
    users = [user for room in rooms for user in room_users.get(room, set()) if user in online_users and user != user_name]

    return set(users)

def start_activity_tracking():
    timeout_threshold = 5000
    
    while(True):
        current_timestamp = int(round(time.time() * 1000))
        for [user, timestamp] in list(user_last_seen.items()):
            if current_timestamp - timestamp > timeout_threshold:
                del user_last_seen[user]
                online_users.discard(user)
                for room_id in user_rooms.get(user, set()):
                    socketio.emit("user_offline", {"user_name": user}, to=str(room_id))

        time.sleep(1)
                    

    