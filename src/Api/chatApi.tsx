import apiClient from "./apiClient";

// 🔹 Get all conversations
export const getConversations = async () => {
  const response = await apiClient.get("chat/conversations");
  console.log("getConversations", response.data);
  return response.data;
};

// 🔹 Get messages
export const getMessages = async (chatRoomId: string) => {
  const response = await apiClient.get(`/chat/messages/${chatRoomId}`);
  return response.data;
};

// 🔹 Send message
export const sendMessage = async (data: any) => {
  const response = await apiClient.post("/chat/send", data, { showLoader: false });
  return response.data;
};

// 🔹 Mark as read
export const markAsRead = async (messageId: string) => {
  const response = await apiClient.patch(`/chat/read/${messageId}`);
  return response.data;
};

// 🔹 Unread count
export const getUnreadCount = async () => {
  const response = await apiClient.get("/chat/unread-count");
  return response.data;
};

// 🔹 delete chat
export const deleteMessageApi = async (id: string) => {
  const response = await apiClient.delete(`/chat/messages/${id}`);
  return response.data;
};