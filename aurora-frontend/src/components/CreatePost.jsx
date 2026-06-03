import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      return toast.error("Post cannot be empty");
    }

    try {
      setLoading(true);

      await api.post("/posts", {
        content,
      });

      toast.success("Post created");

      setContent("");

      onPostCreated();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        backdrop-blur-xl
        bg-white/5
        border
        border-white/10
        rounded-3xl
        p-6
        mb-6
      "
    >
      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          className="
            w-full
            resize-none
            bg-white/10
            border
            border-white/20
            rounded-xl
            p-4
            text-white
            placeholder-gray-400
            outline-none
            focus:border-purple-500
          "
        />

        <div className="flex justify-end mt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="
              px-6
              py-3
              rounded-xl
              bg-linear-to-r
              from-purple-600
              to-indigo-600
              text-white
              font-semibold
            "
          >
            {loading ? "Posting..." : "Post"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default CreatePost;