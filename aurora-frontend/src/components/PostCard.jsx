import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
// import { toast } from "react-toastify";

function PostCard({ post, currentUser, onDelete }) {

    const handleDelete = async () => {
        try {
            await api.delete(`/posts/${post.id}`);

            toast.success("Post deleted");

            if (onDelete) {
                onDelete();
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete post");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="
                backdrop-blur-xl
                bg-white/5
                border border-white/10
                rounded-3xl
                p-6
                shadow-lg shadow-black/10
            "
        >
            <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">
                    <div
                        className="
                            h-11 w-11
                            rounded-full
                            bg-linear-to-r
                            from-pink-500
                            to-purple-600
                            flex items-center justify-center
                            text-white
                            font-bold
                            shadow-lg
                        "
                    >
                        {post.username?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                        <h3
                            className="
                                text-purple-200
                                font-semibold
                            "
                        >
                            <Link
                                to={`/${post.username}`}
                                className="font-medium hover:underline"
                            >
                                @{post.username}
                            </Link>
                        </h3>

                        <p
                            className="
                                text-sm
                                text-purple-300/50
                            "
                        >
                            {formatDistanceToNow(
                                new Date(post.createdAt),
                                { addSuffix: true }
                            )}
                        </p>
                    </div>
                </div>

                {currentUser?.username === post.username && (
                    <button
                        onClick={handleDelete}
                        className="
                            text-red-400
                            hover:text-red-300
                            text-sm
                            font-medium
                        "
                    >
                        Delete
                    </button>
                )}
            </div>

            <p
                className="
                    mt-5
                    text-white
                    text-lg
                    leading-relaxed
                    wrap-break-word
                "
            >
                {post.content}
            </p>
        </motion.div>
    );
}

export default PostCard;