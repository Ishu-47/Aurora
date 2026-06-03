import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

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
                {/* Logo */}
                <h1
                    className="
        text-3xl font-bold
        bg-linear-to-r
        from-purple-400
        via-pink-400
        to-indigo-400
        bg-clip-text
        text-transparent
        tracking-tight
      "
                >
                    Aurora
                </h1>

                {/* User Section */}
                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-3">
                        <div
                            className="
            h-10 w-10
            rounded-full
            bg-linear-to-r
            from-purple-500
            to-pink-500
            flex items-center justify-center
            font-semibold
            text-white
            shadow-lg
          "
                        >
                            {user?.username?.charAt(0)?.toUpperCase()}
                        </div>

                        <span
                            className="
            text-gray-300
            font-medium
          "
                        >
                            @{user?.username}
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="
          p-2.5
          rounded-xl
          bg-white/5
          hover:bg-red-500/20
          transition-all duration-200
          hover:scale-105
        "
                    >
                        <LogOut
                            size={20}
                            className="text-white"
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;