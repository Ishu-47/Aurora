import { Client } from "@stomp/stompjs";
// import { frame } from "framer-motion";

let stompClient = null;

export const connectNotficationSocket = (token, onNotification) => {
    if (stompClient?.connected) {
        return;
    }
    if(!token){
        return;
    }
    stompClient = new Client({
        brokerURL: "ws://localhost:8080/ws",

        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,

        onConnect: () => {
            console.log("WebSocket connected");

            const subscription =
                stompClient.subscribe(
                    "/user/queue/notifications",
                    (message) => {
                        console.log(
                            "RAW MESSAGE:",
                            message.body
                        );

                        const event =
                            JSON.parse(message.body);

                        onNotification(event);
                    }
                );

            console.log(
                "SUBSCRIBED:",
                subscription.id
            );
        },
        onStompError: (frame) => {
            console.error("STOMP Error:", frame);
        },
        onWebSocketError: (error) => {
            console.error("WebSocket Error", error);
        },
    });
    stompClient.activate();
};

export const disconnectNotificationSocket = () => {
    stompClient?.deactivate();
};