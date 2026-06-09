import apiClient from "./apiClient";
import { GET_API } from "./apiRequest";

// 🔹 Get all conversations
export const getConversations = async (token: string, setLoading: any) => {
  const response = await GET_API("chat/conversations", token, "GET", setLoading);
  return response.data;
};

// 🔹 Get messages
export const getMessages = async (chatRoomId: string, token: string, setLoading: any) => {
  const response = await GET_API(`/chat/messages/${chatRoomId}`, token, "GET", setLoading);
  return response.data;
};

// 🔹 Send message
export const sendMessage = async (data: any) => {
  const response = await apiClient.post("/chat/send", data);
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