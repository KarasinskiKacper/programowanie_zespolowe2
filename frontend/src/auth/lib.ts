import jwt from "jsonwebtoken";
import { deleteCookie } from "@/app/actions";

const BASE_URL = `${process.env.BASE_BACKEND_API_URL}/api`;

/**
 * Handles expired access token by deleting the cookie and reloading the page.
 * @param {string} accessToken The access token to check for expiration.
 * @return {boolean} True if the token has expired, false otherwise.
 */
function handleExpiredToken(accessToken: string) {
  if (jwt.decode(accessToken).exp < Date.now() / 1000) {
    deleteCookie("access_token");
    location.reload();
    return true;
  }
  return false;
}

/**
 * Retrieves a list of all public rooms available in the application.
 *
 * @return {Promise<Array<Object>>} A promise that resolves to an array of objects, each containing information about a public room.
 */

export async function getPublicRooms() {
  const response = await fetch(`${BASE_URL}/rooms`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Joins a public room.
 * @param {number} room_id The ID of the public room to join.
 * @param {string} accessToken The access token to use for joining the room.
 * @returns {Promise<Response>} A promise that resolves to the response of the join room request.
 */
export async function joinPublicRoom(room_id: number, accessToken: string) {
  if (handleExpiredToken(accessToken)) return;

  const response = await fetch(`${BASE_URL}/room/join_public`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ room_id }),
  });
  return response;
}

/**
 * Joins a private room.
 * @param {string} accessToken The access token to use for joining the room.
 * @param {string} access_key The access key of the private room to join.
 * @returns {Promise<Response>} A promise that resolves to the response of the join room request.
 */
export async function joinPrivateRoom(accessToken: string, access_key: string) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/room/join_private`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ access_key }),
  });
  return response;
}

/**
 * Leaves a room.
 * @param {number} room_id The ID of the room to leave.
 * @param {string} accessToken The access token to use for leaving the room.
 * @returns {Promise<Response>} A promise that resolves to the response of the leave room request.
 */
export async function leaveRoom(room_id: number, accessToken: string) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/room/leave`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ room_id }),
  });
  return response;
}

/**
 * Kicks a user from a room given.
 * @param {number} room_id The ID of the room to kick the user from.
 * @param {string} accessToken The access token to use for kicking the user.
 * @param {string} user_to_kick The username of the user to kick from the room.
 * @returns {Promise<Response>} A promise that resolves to the response of the kick user request.
 */
export async function kickUser(room_id: number, accessToken: string, user_to_kick: string) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/user_kick`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ room_id, user_to_kick }),
  });
  return response;
}

/**
 * Gets the rooms that the user is currently in.
 * @param {any} accessToken The access token to use for getting the rooms of the user.
 * @returns {Promise<any>} A promise that resolves to the response of the get user rooms request.
 */
export async function getUserRooms(accessToken: any) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/user_rooms?`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

/**
 * Retrieves a list of all chat messages in a given room.
 * @param {number} roomId The ID of the room to retrieve the chat messages from.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects, each containing information about a chat message.
 */
export async function getChatMessages(roomId: number) {
  const response = await fetch(`${BASE_URL}/chat_history?room_id=${roomId}`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Retrieves a list of all users in a given room.
 * @param {number} roomId The ID of the room to retrieve the user list from.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects, each containing information about a user in the room.
 */

export async function getChatMembers(roomId: number) {
  const response = await fetch(`${BASE_URL}/user_list?room_id=${roomId}`, {
    method: "GET",
  });
  return response.json();
}

/**
 * Logs a user in using their login and password.
 * @param {string} login The login of the user to log in.
 * @param {string} password The password of the user to log in.
 * @returns {Promise<Response>} A promise that resolves to the response of the login request.
 */
export async function loginUser(login: string, password: string) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_name: login, password: password }),
  });
  return response;
}

/**
 * Registers a user with the given login and password.
 * @param {string} login The login of the user to register.
 * @param {string} password The password of the user to register.
 * @returns {Promise<Response>} A promise that resolves to the response of the register request.
 */
export async function registerUser(login: string, password: string) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_name: login, password: password }),
  });
  return response;
}

/**
 * Retrieves information about the user with the given access token.
 * @param {string} accessToken The access token to use for retrieving the user's information.
 * @returns {Promise<any>} A promise that resolves to an object containing information about the user.
 */
export async function getProfilData(accessToken: string) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/user/get_info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

/**
 * Changes the password of the user associated with the given access token.
 * @param {string} accessToken The access token to use for changing the password.
 * @param {string} old_password The old password of the user.
 * @param {string} new_password The new password of the user.
 * @returns {Promise<any>} A promise that resolves to the response of the change password request.
 */
export async function changePassword(
  accessToken: string,
  old_password: string,
  new_password: string
) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/user/change_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ old_password, new_password }),
  });
  return response.json();
}

/**
 * Creates a room with the given name and properties.
 * @param {string} accessToken The access token to use for creating the room.
 * @param {string} room_name The name of the room to create.
 * @param {boolean} is_private Whether the room is private or not.
 * @param {string} access_key The access key of the private room, if applicable.
 * @returns {Promise<any>} A promise that resolves to the response of the create room request.
 */
export async function createRoomRequest(
  accessToken: string,
  room_name: string,
  is_private: boolean,
  access_key: string
) {
  if (handleExpiredToken(accessToken)) return;
  let response;
  if (is_private) {
    response = await fetch(`${BASE_URL}/room/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ room_name, is_private, access_key }),
    });
    await joinPrivateRoom(accessToken, access_key);
  } else {
    response = await fetch(`${BASE_URL}/room/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ room_name, is_private }),
    });
  }

  return response.json();
}

/**
 * Retrieves a list of all online users in the application.
 *
 * @param {string} accessToken The access token to use for retrieving the online users.
 *
 * @returns {Promise<Array<string>>} A promise that resolves to an array of usernames of online users.
 */
export async function getOnlineUsers(accessToken: string) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/users/online`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
}

/**
 * Deletes a room with the given ID.
 * @param {string} accessToken The access token to use for deleting the room.
 * @param {number} room_id The ID of the room to delete.
 * @returns {Promise<Response>} A promise that resolves to the response of the delete room request.
 */
export async function deleteRoom(accessToken: string, room_id: number) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/room/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ room_id }),
  });
  return response;
}

/**
 * Updates a room with the given properties.
 * @param {string} accessToken The access token to use for updating the room.
 * @param {number} room_id The ID of the room to update.
 * @param {string} new_access_key The new access key of the room, if applicable.
 * @param {string} new_name The new name of the room.
 * @param {boolean} is_private Whether the room is private or not.
 * @returns {Promise<any>} A promise that resolves to the response of the update room request.
 */
export async function updateRoom(
  accessToken: string,
  room_id: number,
  new_access_key: string,
  new_name: string,
  is_private: boolean
) {
  if (handleExpiredToken(accessToken)) return;
  const response = await fetch(`${BASE_URL}/room/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ room_id, new_access_key, is_private, new_name }),
  });
  return response.json();
}
