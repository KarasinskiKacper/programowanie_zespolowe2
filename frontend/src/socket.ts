"use client";

import { io } from "socket.io-client";

// TODO change URL
const BASE_URL = "http://192.168.1.22:5000";

export const socket = io(BASE_URL);
