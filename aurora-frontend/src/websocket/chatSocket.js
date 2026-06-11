import { getSocketClient, } from "./socketClient";

export const subscribeMessages = (
    onMessage
) => {

    const client =
        getSocketClient();

    if (!client) {
        return null;
    }

    const subscribe = () =>
        client.subscribe(
            "/user/queue/messages",
            (message) => {

                console.log(
                    "WS MESSAGE RECEIVED",
                    message.body
                );

                onMessage(
                    JSON.parse(
                        message.body
                    )
                );
            }
        );

    if (client.connected) {
        return subscribe();
    }

    const originalOnConnect =
        client.onConnect;

    client.onConnect = (frame) => {

        originalOnConnect?.(frame);

        subscribe();
    };

    return null;
};
export const sendChatMessage = (
    conversationId,
    content
) => {

    const client =
        getSocketClient();

    if (!client?.connected) {
        return;
    }

    client.publish({
        destination:
            "/app/chat.send",

        body: JSON.stringify({
            conversationId,
            content,
        }),
    });
};