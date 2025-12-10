"use client";

import { io } from "socket.io-client";


const BASE_URL = process.env.BASE_BACKEND_API_URL;

export const socket = io(BASE_URL);
