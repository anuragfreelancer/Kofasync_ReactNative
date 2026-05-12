import { io } from "socket.io-client";

export const socket = io("https://appointment.aitechnotech.in", {
  auth: {
    token: null, // Will be set dynamically
  },
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});