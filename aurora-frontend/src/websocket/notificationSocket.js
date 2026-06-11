import { connectSocket, getSocketClient, } from "./socketClient";

export const subscribeNotifications = (token, onNotification) => {
    const client = connectSocket(token);
    client.onConnect = () => {
        client.subscribe("/user/queue/notifications",
            (message) => {
                onNotification(JSON.parse(message.body));
            }
        );
    };
};