import { socket } from "./socket";

class SocketService {
  // 🔌 SET TOKEN
  setToken(token) {
    socket.auth.token = token;
  }

  // 🔌 CONNECT
  connect(token) {
    if (token) {
      this.setToken(token);
    }
    if (!socket.connected) {
      socket.connect();
    }
  }

  // 🔌 DISCONNECT
  disconnect() {
    if (socket.connected) {
      socket.disconnect();
    }
  }

  // ✅ CONNECTION STATUS
  onConnect(callback) {
    socket.on("connect", callback);
  }

  onDisconnect(callback) {
    socket.on("disconnect", callback);
  }

  onError(callback) {
    socket.on("connect_error", callback);
  }

  // 🟢 ONLINE USERS
  onUserOnline(callback) {
    socket.on("user-online", callback);
  }

  onUserOffline(callback) {
    socket.on("user-offline", callback);
  }

  // 💬 JOIN CHAT (IMPORTANT)
  joinChat(recipientId) {
    socket.emit("join-chat", { recipientId });
  }

  // 📤 SEND MESSAGE (FIXED)
  sendMessage({ recipientId, message }) {
    socket.emit("send-message", { recipientId, message });
  }

  // 📥 RECEIVE MESSAGE (FIXED)
  onReceiveMessage(callback) {
    socket.on("receive-message", callback);
  }

  // ⌨️ TYPING
  sendTyping() {
    socket.emit("typing");
  }

  stopTyping() {
    socket.emit("stop-typing");
  }

  onTyping(callback) {
    socket.on("user-typing", callback);
  }

  onStopTyping(callback) {
    socket.on("user-stop-typing", callback);
  }

  // 🧹 REMOVE LISTENER
  removeListener(event) {
    socket.off(event);
  }
}

export const socketService = new SocketService();