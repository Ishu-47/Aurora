import { motion } from "framer-motion";

function PostCard({ post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        backdrop-blur-xl
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
      "
    >
      <div className="flex justify-between mb-4">
        <h3
          className="
            text-purple-400
            font-semibold
          "
        >
          @{post.username}
        </h3>

        <span
          className="
            text-sm
            text-gray-400
          "
        >
          {new Date(
            post.createdAt
          ).toLocaleString()}
        </span>
      </div>

      <p className="text-white">
        {post.content}
      </p>
    </motion.div>
  );
}

export default PostCard;