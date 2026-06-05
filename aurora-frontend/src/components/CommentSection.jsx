import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

function CommentSection({
    postId,
    onCommentAdded,
}) {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await api.get(
                `/posts/${postId}/comments`
            );

            setComments(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load comments");
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleComment = async () => {
        if (!commentText.trim()) return;

        try {
            setLoading(true);

            const res = await api.post(
                `/posts/${postId}/comments`,
                {
                    content: commentText,
                }
            );

            setComments((prev) => [
                ...prev,
                res.data,
            ]);

            setCommentText("");

            onCommentAdded?.();

            toast.success("Comment added");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add comment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex gap-3 mb-5">
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) =>
                        setCommentText(e.target.value)
                    }
                    placeholder="Write a comment..."
                    className="
                        flex-1
                        px-4 py-3
                        rounded-full
                        bg-white/5
                        border border-white/10
                        text-white
                        placeholder:text-purple-300/40
                        focus:outline-none
                        focus:border-purple-500
                    "
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleComment();
                        }
                    }}
                />

                <button
                    onClick={handleComment}
                    disabled={loading}
                    className="
                        px-5 py-3
                        rounded-full
                        bg-gradient-to-r
                        from-pink-500
                        to-purple-600
                        text-white
                        font-medium
                        hover:opacity-90
                        transition
                        disabled:opacity-50
                    "
                >
                    {loading ? "..." : "Post"}
                </button>
            </div>

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-sm text-purple-300/50">
                        No comments yet.
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="flex gap-3"
                        >
                            <div
                                className="
                                    h-8 w-8
                                    rounded-full
                                    bg-gradient-to-r
                                    from-pink-500
                                    to-purple-600
                                    flex items-center
                                    justify-center
                                    text-xs
                                    font-bold
                                    text-white
                                    shrink-0
                                "
                            >
                                {comment.username
                                    ?.charAt(0)
                                    ?.toUpperCase()}
                            </div>

                            <div className="flex-1">
                                <div
                                    className="
                                        bg-white/5
                                        border border-white/10
                                        rounded-2xl
                                        px-4 py-3
                                    "
                                >
                                    <p
                                        className="
                                            text-purple-200
                                            font-semibold
                                            text-sm
                                        "
                                    >
                                        @{comment.username}
                                    </p>

                                    <p className="text-white mt-1 break-words">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CommentSection;