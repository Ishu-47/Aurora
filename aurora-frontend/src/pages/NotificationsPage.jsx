import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

function NotificationsPage() {
    const [notifications, setNotifications] =
        useState([]);

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
                }
            };

        fetchNotifications();
    }, []);

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
                <h1
                    className="
                        text-3xl
                        font-bold
                        text-white
                        mb-6
                    "
                >
                    Notifications
                </h1>

                <div className="space-y-3">
                    {notifications.map(
                        (notification) => (
                            <div
                                key={
                                    notification.id
                                }
                                className="
                                    rounded-2xl
                                    border
                                    border-white/10
                                    bg-white/5
                                    p-4
                                "
                            >
                                <p className="text-white">
                                    {
                                        notification.message
                                    }
                                </p>

                                <p
                                    className="
                                        text-sm
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
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotificationsPage;