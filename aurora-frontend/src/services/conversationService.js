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
    const response = await api.get( `/conversations/${conversationId}/messages`);
    return response.data;
};
