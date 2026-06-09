import { useNavigate, Link } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

import { useState } from "react";

import NotificationDropdown from "./NotificationDropdown";

function Navbar() {
    const { user, logout } = useAuth();

    const {
        unreadCount,
        setUnreadCount,
    } = useNotifications();

    const navigate = useNavigate();

    const [notificationOpen,
        setNotificationOpen] =
        useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    console.log(
    "NAVBAR COUNT:",
    unreadCount
);
    return (
        <nav
            className="
                sticky top-0 z-50
                backdrop-blur-xl
                bg-white/5
                border-b border-white/10
                shadow-lg shadow-black/20
            "
        >
            <div
                className="
                    max-w-4xl mx-auto
                    px-4 py-4
                    flex items-center justify-between
                "
            >
                <Link
                    to="/"
                    className="flex items-center gap-3 group"
                >
                    <div
                        className="
                            h-12 w-12
                            rounded-full
                            bg-linear-to-r
                            from-pink-500
                            via-purple-500
                            to-indigo-500
                            flex items-center justify-center
                            font-bold text-white text-xl
                            shadow-lg shadow-purple-500/40
                            transition-transform duration-200
                            group-hover:scale-105
                        "
                    >
                        A
                    </div>

                    <div>
                        <h1
                            className="
                                text-3xl font-extrabold
                                bg-linear-to-r
                                from-pink-400
                                to-purple-300
                                bg-clip-text
                                text-transparent
                                leading-none
                            "
                        >
                            Aurora
                        </h1>

                        <p className="text-xs text-purple-300/70">
                            Social Network
                        </p>
                    </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        to={`/${user?.username}`}
                        className="
                            flex items-center gap-3
                            group
                            transition-all duration-200
                        "
                    >
                        <div
                            className="
                                h-11 w-11
                                rounded-full
                                bg-linear-to-r
                                from-purple-500
                                to-pink-500
                                flex items-center justify-center
                                font-semibold
                                text-white
                                shadow-lg
                                transition-transform duration-200
                                group-hover:scale-105
                            "
                        >
                            {user?.username
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </div>

                        <span
                            className="
                                text-gray-200
                                font-medium
                                max-w-35
                                truncate
                            "
                        >
                            @{user?.username}
                        </span>
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() =>
                                setNotificationOpen(
                                    !notificationOpen
                                )
                            }
                            title="Notifications"
                            className="
                                relative
                                p-2.5
                                rounded-xl
                                bg-white/5
                                border border-white/10
                                hover:bg-white/10
                                transition-all duration-200
                                hover:scale-105
                            "
                        >
                            <Bell
                                size={18}
                                className="text-purple-200"
                            />

                            {unreadCount > 0 && (
                                <span
                                    className="
                                        absolute
                                        -top-1
                                        -right-1
                                        min-w-5
                                        h-5
                                        px-1
                                        rounded-full
                                        bg-red-500
                                        text-white
                                        text-xs
                                        flex
                                        items-center
                                        justify-center
                                        font-medium
                                    "
                                >
                                    {unreadCount > 99
                                        ? "99+"
                                        : unreadCount}
                                </span>
                            )}
                        </button>

                        <NotificationDropdown
                            open={notificationOpen}
                            setUnreadCount={setUnreadCount}
                        />
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Logout"
                        className="
                            group
                            p-2.5
                            rounded-xl
                            bg-white/5
                            border border-white/10
                            hover:bg-red-500/20
                            hover:border-red-500/30
                            transition-all duration-200
                            hover:scale-105
                        "
                    >
                        <LogOut
                            size={18}
                            className="
                                text-purple-200
                                group-hover:text-red-300
                                transition-colors
                            "
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;