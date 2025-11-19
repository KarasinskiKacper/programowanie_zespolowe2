// export async function login(formData: FormData) {
//     const user = {
//         login: formData.get("login"),
//         password: formData.get("password"),
//     };
// }

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
  return response.json();
}

export async function registerUser(login: string, password: string) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_name: login, password: password }),
  });
  return response.json();
}