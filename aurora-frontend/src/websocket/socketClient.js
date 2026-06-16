import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (token) => {

    if (stompClient?.connected) {
        return stompClient;
    }

    stompClient = new Client({
        brokerURL: import.meta.env.VITE_WS_URL,

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        reconnectDelay: 5000,
    });

    stompClient.activate();

    return stompClient;
};

export const getSocketClient = () =>
    stompClient;

export const disconnectSocket = () => {
    stompClient?.deactivate();
};