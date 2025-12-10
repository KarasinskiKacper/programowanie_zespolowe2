import jwt from "jsonwebtoken";
import { deleteCookie } from "@/app/actions";

const BASE_URL = `${process.env.BASE_BACKEND_API_URL}/api`;

function handleExpiredToken(accessToken: string) {
  if (jwt.decode(accessToken).exp < Date.now() / 1000) {
    deleteCookie("access_token");
    location.reload();
    return true;
  }
  return false;
}

export async function test() {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "GET",
  });
  return response.json();
}

export async function getPublicRooms() {
  const response = await fetch(`${BASE_URL}/rooms`, {
    method: "GET",
  });
  return response.json();
}

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

export async function getChatMessages(roomId: number) {
  const response = await fetch(`${BASE_URL}/chat_history?room_id=${roomId}`, {
    method: "GET",
  });
  return response.json();
}

export async function getChatMembers(roomId: number) {
  const response = await fetch(`${BASE_URL}/user_list?room_id=${roomId}`, {
    method: "GET",
  });
  return response.json();
}

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
