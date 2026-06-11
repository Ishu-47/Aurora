import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import api from "../api/axios";

import {
    subscribeNotifications,
} from "../websocket/notificationSocket";

import {
    disconnectSocket,
} from "../websocket/socketClient";

import { useAuth } from "./AuthContext";

const NotificationContext =
    createContext();

export function NotificationProvider({
    children,
}) {
    const { user } = useAuth();

    const [
        unreadCount,
        setUnreadCount,
    ] = useState(0);

    const [
        latestNotification,
        setLatestNotification,
    ] = useState(null);

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
        if (!user) {
            return;
        }

        fetchUnreadCount();

        const token =
            localStorage.getItem(
                "token"
            );

        subscribeNotifications(
            token,
            (event) => {
                console.log(
                    "NOTIFICATION:",
                    event
                );

                setUnreadCount(
                    event.unreadCount ??
                    0
                );

                setLatestNotification(
                    event.notification
                );
            }
        );

        return () => {
            disconnectSocket();
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