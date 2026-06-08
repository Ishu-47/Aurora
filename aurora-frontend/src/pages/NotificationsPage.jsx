import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";

import Navbar from "../components/Navbar";
import api from "../api/axios";

function NotificationsPage() {
    const navigate = useNavigate();

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const fetchNotifications =
            async () => {
                try {
                    const response =
                        await api.get(
                            "/notifications"
                        );

                    setNotifications(
                        response.data
                    );
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

        fetchNotifications();
    }, []);

    const getNotificationIcon = (
        type
    ) => {
        switch (type) {
            case "LIKE":
                return "❤️";

            case "COMMENT":
                return "💬";

            case "FOLLOW":
                return "👤";

            default:
                return "🔔";
        }
    };

    const getTimeAgo = (
        createdAt
    ) => {
        const text =
            formatDistanceToNowStrict(
                new Date(createdAt)
            );

        return text
            .replace(
                " seconds",
                "s"
            )
            .replace(
                " second",
                "s"
            )
            .replace(
                " minutes",
                "m"
            )
            .replace(
                " minute",
                "m"
            )
            .replace(
                " hours",
                "h"
            )
            .replace(
                " hour",
                "h"
            )
            .replace(
                " days",
                "d"
            )
            .replace(
                " day",
                "d"
            )
            .replace(
                " months",
                "mo"
            )
            .replace(
                " month",
                "mo"
            )
            .replace(
                " years",
                "y"
            )
            .replace(
                " year",
                "y"
            );
    };

    const markAsRead = async (
        notificationId
    ) => {
        try {
            await api.put(
                `/notifications/${notificationId}/read`
            );

            setNotifications(
                (prev) =>
                    prev.map(
                        (
                            notification
                        ) =>
                            notification.id ===
                                notificationId
                                ? {
                                    ...notification,
                                    read: true,
                                }
                                : notification
                    )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleNotificationClick =
        async (notification) => {
            try {
                if (
                    !notification.read
                ) {
                    await markAsRead(
                        notification.id
                    );
                }

                if (
                    notification.type ===
                    "FOLLOW"
                ) {
                    navigate(
                        `/${notification.senderUsername}`
                    );
                    return;
                }

                if (
                    notification.postId
                ) {
                    navigate(
                        `/posts/${notification.postId}`
                    );
                }
            } catch (error) {
                console.error(error);
            }
        };

    return (
        <div
            className="
                min-h-screen
                bg-linear-to-br
                from-slate-950
                via-purple-950
                to-indigo-950
            "
        >
            <Navbar />

            <div
                className="
                    max-w-3xl
                    mx-auto
                    px-4
                    py-8
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-6
                    "
                >
                    <h1
                        className="
                            text-3xl
                            font-bold
                            text-white
                        "
                    >
                        Notifications
                    </h1>

                    <span
                        className="
                            text-sm
                            text-purple-300/70
                        "
                    >
                        {notifications.length}
                        {" "}
                        total
                    </span>
                </div>

                {loading ? (
                    <div
                        className="
                            text-center
                            text-purple-300
                            py-12
                        "
                    >
                        Loading...
                    </div>
                ) : notifications.length ===
                    0 ? (
                    <div
                        className="
                            rounded-3xl
                            border border-white/10
                            bg-white/5
                            backdrop-blur-xl
                            text-center
                            py-16
                        "
                    >
                        <div className="text-6xl mb-4">
                            🔔
                        </div>

                        <h2
                            className="
                                text-xl
                                font-semibold
                                text-white
                            "
                        >
                            No notifications
                        </h2>

                        <p
                            className="
                                text-purple-300/70
                                mt-2
                            "
                        >
                            Activity on your
                            posts and profile
                            will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map(
                            (
                                notification
                            ) => (
                                <button
                                    key={
                                        notification.id
                                    }
                                    onClick={() =>
                                        handleNotificationClick(
                                            notification
                                        )
                                    }
                                    className={`
                                        w-full
                                        text-left
                                        rounded-3xl
                                        border
                                        p-5
                                        transition-all
                                        duration-200
                                        hover:scale-[1.01]
                                        hover:bg-white/10

                                        ${notification.read
                                            ? "border-white/10 bg-white/5"
                                            : "border-purple-500/40 bg-purple-500/10 border-l-4"
                                        }
                                    `}
                                >
                                    <div className="flex gap-4 items-start">
                                        <div
                                            className="
                                                text-2xl
                                                shrink-0
                                            "
                                        >
                                            {getNotificationIcon(
                                                notification.type
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <p
                                                className="
                                                    text-white
                                                    leading-relaxed
                                                "
                                            >
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    mt-3
                                                "
                                            >
                                                <span
                                                    className="
                                                        text-sm
                                                        font-medium
                                                        text-purple-200
                                                    "
                                                >
                                                    {
                                                        notification.senderDisplayUsername
                                                    }
                                                </span>

                                                <span
                                                    className="
                                                        text-xs
                                                        text-purple-400/60
                                                    "
                                                >
                                                    {getTimeAgo(
                                                        notification.createdAt
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationsPage;