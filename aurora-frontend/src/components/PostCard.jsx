import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";

function PostCard({ post, currentUser, onDelete }) {
    const [liked, setLiked] = useState(post.likedByCurrentUser);
    const [likeCount, setLikeCount] = useState(post.likeCount);
    const [commentCount, setCommentCount] = useState(
        post.commentCount
    );
    const [loadingLike, setLoadingLike] = useState(false);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        setLiked(post.likedByCurrentUser);
        setLikeCount(post.likeCount);
        setCommentCount(post.commentCount);
    }, [
        post.likedByCurrentUser,
        post.likeCount,
        post.commentCount,
    ]);

    const handleLike = async () => {
        if (loadingLike) return;

        try {
            setLoadingLike(true);

            const res = await api.post(`/posts/${post.id}/like`);

            setLiked(res.data.liked);
            setLikeCount(res.data.likeCount);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update like");
        } finally {
            setLoadingLike(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/posts/${post.id}`);

            toast.success("Post deleted");

            onDelete?.();
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
                    {post.authorProfilePictureUrl ? (
                        <img
                            src={post.authorProfilePictureUrl}
                            alt={post.username}
                            className="
            h-11
            w-11
            rounded-full
            object-cover
            border border-white/10
        "
                        />
                    ) : (
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
                    )}

                    <div>
                        <h3 className="text-purple-200 font-semibold">
                            <Link
                                to={`/${post.username}`}
                                className="font-medium hover:underline"
                            >
                                @{post.username}
                            </Link>
                        </h3>

                        <p className="text-sm text-purple-300/50">
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
                {post.content && (
                    <p
                        className="mt-5 text-white text-lg leading-relaxed wrap-break-word"
                    >
                        {post.content}
                    </p>
                )}
            </p>
            {post.imageUrl && (
                <div className="mt-4">
                    <img
                        src={post.imageUrl}
                        alt="Post"
                        className="
                w-full
                max-h-125
                object-cover
                rounded-2xl
                border border-white/10
            "
                        loading="lazy"
                    />
                </div>
            )}

            <div className="mt-5 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleLike}
                        disabled={loadingLike}
                        className={`
                            text-xl transition-transform
                            hover:scale-110
                            ${loadingLike
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                        `}
                    >
                        {liked ? "❤️" : "🤍"}
                    </button>

                    <span className="text-purple-300 text-sm font-medium">
                        {likeCount}
                    </span>
                </div>

                <button
                    onClick={() =>
                        setShowComments((prev) => !prev)
                    }
                    className="
                        flex items-center gap-2
                        text-purple-300
                        hover:text-white
                        transition
                    "
                >
                    <span className="text-lg">💬</span>

                    <span className="text-sm font-medium">
                        {commentCount}
                    </span>
                </button>
            </div>

            {showComments && (
                <CommentSection
                    postId={post.id}
                    onCommentAdded={() =>
                        setCommentCount((prev) => prev + 1)
                    }
                />
            )}
        </motion.div>
    );
}

export default PostCard;