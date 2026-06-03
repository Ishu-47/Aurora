import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                formData
            );

            login(response.data);

            toast.success("Login Successful");

            navigate("/");
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                "Login Failed"
            );
        } finally {
            setLoading(false);
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
      flex
      items-center
      justify-center
      px-4
    "
        >
            <motion.div
                initial={{
                    opacity: 0,
                    y: 100,
                    scale: 0.8,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                }}
                className="w-full max-w-md"
            >
                <div
                    className="
          backdrop-blur-xl
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-8
          shadow-2xl
          hover:border-purple-500/30
          transition-all
        "
                >
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white">
                            Aurora
                        </h1>

                        <p className="text-gray-400 mt-2">
                            Welcome back
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="
              w-full
              p-4
              rounded-xl
              bg-white/10
              border
              border-white/20
              text-white
              placeholder-gray-400
              outline-none
              focus:border-purple-500
              focus:ring-2
              focus:ring-purple-500/30
              transition-all
            "
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="
                w-full
                p-4
                rounded-xl
                bg-white/10
                border
                border-white/20
                text-white
                placeholder-gray-400
                outline-none
                focus:border-purple-500
                focus:ring-2
                focus:ring-purple-500/30
                transition-all
              "
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-gray-400
                hover:text-white
                transition
              "
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            className="
              w-full
              bg-linear-to-r
              from-purple-600
              to-indigo-600
              hover:from-purple-500
              hover:to-indigo-500
              text-white
              p-4
              rounded-xl
              font-semibold
              cursor-pointer
              disabled:opacity-50
              transition-all
              shadow-lg
              shadow-purple-500/20
            "
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </motion.button>
                    </form>

                    <div className="text-center mt-6">
                        <span className="text-gray-400">
                            Don't have an account?
                        </span>

                        <Link
                            to="/register"
                            className="
              ml-2
              text-purple-400
              hover:text-purple-300
              transition
            "
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;