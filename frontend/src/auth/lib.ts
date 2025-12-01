import jwt from "jsonwebtoken";

// TODO change URL
const BASE_URL = "http://192.168.1.22:5000/api";

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
  const user_name = jwt.decode(accessToken).sub;
  const response = await fetch(`${BASE_URL}/room/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_name, room_id }),
  });
  return response;
}

export async function getUserRooms(userName: string) {
  const response = await fetch(`${BASE_URL}/user_rooms?user_name=${userName}`, {
    method: "GET",
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
  const user_name = jwt.decode(accessToken).sub;

  const response = await fetch(`${BASE_URL}/user/get_info?user_name=${user_name}`, {
    method: "GET",
  });
  return response.json();
}

export async function changePassword(
  accessToken: string,
  old_password: string,
  new_password: string
) {
  const user_name = jwt.decode(accessToken).sub;

  const response = await fetch(`${BASE_URL}/user/change_passowrd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_name, old_password, new_password }),
  });
  return response.json();
}
