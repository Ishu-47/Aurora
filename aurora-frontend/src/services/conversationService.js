import api from "../api/axios";
export const createOrGetConversation = async (username) => {
    const response = await api.post(`/conversations/${username}`);
    return response.data;
};