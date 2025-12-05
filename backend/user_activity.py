from app_state import socketio, online_users, user_last_seen, room_users, user_rooms
import time

def set_user_online(user_name: str) -> None:
    """
    Set a user as online.

    If the user is already online, do nothing.

    Otherwise, add the user to the set of online users and emit a "user_online" event to all rooms that the user is a member of.

    Parameters:
        user_name (str): The name of the user to set as online.

    Returns:
        None
    """
    if user_name in online_users:
        return
    online_users.add(user_name)

    for room_id in user_rooms.get(user_name, set()):
        socketio.emit("user_online", {"user_name": user_name}, to=room_id)

def update_user_last_seen(user_name: str) -> None:
    """
    Update the last seen timestamp of a user and set them as online.

    Parameters:
        user_name (str): The name of the user to update.

    Returns:
        None
    """
    set_user_online(user_name)
    user_last_seen[user_name] = int(round(time.time() * 1000))

def get_online_users(user_name: str) -> set:
    """
    Get a set of online users that are in the same rooms as the given user.

    Parameters:
        user_name (str): The name of the user to get online users for.

    Returns:
        set: A set of online users that are in the same rooms as the given user.
    """
    rooms = user_rooms.get(user_name, set())
    users = [user for room in rooms for user in room_users.get(room, set()) if user in online_users and user != user_name]

    return set(users)

def start_activity_tracking():
    """
    Start a background task to track user activity.

    This task will check the last seen timestamp of each user every second, and if the difference between the current timestamp and the last seen timestamp is greater than the timeout threshold, it will set the user as offline and emit a "user_offline" event to all rooms that the user is a member of.

    Parameters:
        None

    Returns:
        None
    """
    timeout_threshold = 5000
    
    while(True):
        current_timestamp = int(round(time.time() * 1000))
        for [user, timestamp] in list(user_last_seen.items()):
            if current_timestamp - timestamp > timeout_threshold:
                del user_last_seen[user]
                online_users.discard(user)
                for room_id in user_rooms.get(user, set()):
                    socketio.emit("user_offline", {"user_name": user}, to=room_id)

        time.sleep(1)
                    

    