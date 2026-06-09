import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

import {
    connectNotficationSocket,
    disconnectNotificationSocket,
} from "../websocket/notificationSocket";

import { useAuth } from "./AuthContext";

const NotificationContext =
    createContext();

export function NotificationProvider({
    children,
}) {
    const { user } = useAuth();

    const [unreadCount,
        setUnreadCount] = useState(0);

    const [latestNotification,
        setLatestNotification] =
        useState(null);

    const fetchUnreadCount =
        async () => {
            try {
                const response =
                    await api.get(
                        "/notifications/unread-count"
                    );

                setUnreadCount(
                    response.data.count
                );
            } catch (error) {
                console.error(error);
            }
        };
    useEffect(() => {
        console.log(
            "NotificationProvider mounted"
        );

        return () => {
            console.log(
                "NotificationProvider unmounted"
            );
        };
    }, []);
    useEffect(() => {
        console.log(
            "UNREAD COUNT CHANGED:",
            unreadCount
        );
    }, [unreadCount]);
    useEffect(() => {
        if (!user) {
            return;
        }

        fetchUnreadCount();

        const token =
            localStorage.getItem(
                "token"
            );

        connectNotficationSocket(
            token,
            (event) => {
                console.log(
                    "WS EVENT:",
                    event
                );

                console.log(
                    "UNREAD:",
                    event.unreadCount
                );

                setUnreadCount(
                    event.unreadCount
                );

                setLatestNotification(
                    event.notification
                );
            }
        );
        return () => {
            disconnectNotificationSocket();
        };
    }, [user]);

    return (
        <NotificationContext.Provider
            value={{
                unreadCount,
                setUnreadCount,
                latestNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications =
    () =>
        useContext(
            NotificationContext
        );