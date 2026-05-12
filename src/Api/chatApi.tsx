import { GET_API } from "./apiRequest";

export const getConversations = async (token: string) => {
  return await GET_API("conversations", token);
};

export const getChatMessages = async (senderId: string, recipientId: string, token: string) => {
  return await GET_API(`chat/history/${senderId}/${recipientId}`, token);
};
