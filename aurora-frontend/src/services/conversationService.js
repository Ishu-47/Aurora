import api from "../api/axios";
export const createOrGetConversation = async (username) => {
    const response = await api.post(`/conversations/${username}`);
    return response.data;
};
export const getConversations = async () => {
    const response = await api.get(`/conversations`);
    return response.data;
};
export const getMessages = async (conversationId) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
};
export const sendMessage = async (conversationId, content) => {
    const response = await api.post("/conversations/messages", { conversationId, content, });
    return response.data;
};
export const markConversationAsRead = async (conversationId) => {
    await api.put(`/conversations/${conversationId}/read`);
};
