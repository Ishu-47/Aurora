import { useEffect, useState } from "react";
import api from "../api/axios";

function NotificationDropdown({
    open,
    setUnreadCount,
}) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await api.get("/notifications");

            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchNotifications();
        }
    }, [open]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id
                        ? { ...notification, read: true }
                        : notification
                )
            );

            setUnreadCount((prev) =>
                Math.max(prev - 1, 0)
            );
        } catch (error) {
            console.error(error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    read: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    if (!open) return null;

    return (
        <div
            className="
                absolute
                right-0
                mt-3
                w-96
                rounded-3xl
                border border-white/10
                bg-slate-950/95
                backdrop-blur-xl
                shadow-2xl
                overflow-hidden
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    p-4
                    border-b
                    border-white/10
                "
            >
                <h3
                    className="
                        text-lg
                        font-semibold
                        text-white
                    "
                >
                    Notifications
                </h3>

                <button
                    onClick={markAllAsRead}
                    className="
                        text-sm
                        text-purple-300
                        hover:text-white
                    "
                >
                    Mark all read
                </button>
            </div>

            <div className="max-h-112.5 overflow-y-auto">
                {loading ? (
                    <div className="p-6 text-center text-purple-300">
                        Loading...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-purple-300">
                        No notifications
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <button
                            key={notification.id}
                            onClick={() => {
                                if (!notification.read) {
                                    markAsRead(
                                        notification.id
                                    );
                                }
                            }}
                            className={`
                                w-full
                                text-left
                                p-4
                                border-b
                                border-white/5
                                transition-all
                                hover:bg-white/5

                                ${
                                    !notification.read
                                        ? "bg-purple-500/10"
                                        : ""
                                }
                            `}
                        >
                            <div className="flex gap-3">
                                {!notification.read && (
                                    <div
                                        className="
                                            mt-2
                                            h-2
                                            w-2
                                            rounded-full
                                            bg-purple-400
                                        "
                                    />
                                )}

                                <div>
                                    <p className="text-white">
                                        {
                                            notification.message
                                        }
                                    </p>

                                    <p
                                        className="
                                            text-xs
                                            text-purple-300/70
                                            mt-1
                                        "
                                    >
                                        @
                                        {
                                            notification.senderUsername
                                        }
                                    </p>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationDropdown;