import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function CreatePost({ onPostCreated }) {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      return toast.error(
        "Post must contain text or image"
      );
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (content.trim()) {
        formData.append("content", content);
      }

      if (image) {
        formData.append("image", image);
      }

      await api.post(
        "/posts",
        formData
      );

      toast.success("Post created");

      setContent("");
      setImage(null);
      setPreviewUrl("");

      onPostCreated();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
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
        border border-white/10
        rounded-3xl
        p-6
        mb-8
        shadow-lg shadow-black/10
      "
    >
      <div className="flex items-center gap-3 mb-5">
        <div
          className="
            h-12 w-12
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
          {user?.username?.charAt(0)?.toUpperCase()}
        </div>

        <div>
          <p className="font-semibold text-purple-100">
            @{user?.username}
          </p>

          <p className="text-sm text-purple-300/60">
            Share something with Aurora
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          className="
            w-full
            resize-none
            rounded-2xl
            bg-white/5
            border border-white/10
            p-5
            text-white
            placeholder:text-purple-300/40
            outline-none
            transition-all
            focus:border-purple-500
            focus:ring-2
            focus:ring-purple-500/30
          "
        />

        {previewUrl && (
          <div className="mt-4 relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="
                w-full
                max-h-96
                object-cover
                rounded-2xl
                border border-white/10
              "
            />

            <button
              type="button"
              onClick={removeImage}
              className="
                absolute
                top-3
                right-3
                bg-black/70
                text-white
                px-3
                py-1
                rounded-lg
                text-sm
              "
            >
              Remove
            </button>
          </div>
        )}

        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="
              block
              w-full
              text-sm
              text-purple-200
              file:mr-4
              file:rounded-lg
              file:border-0
              file:bg-purple-600
              file:px-4
              file:py-2
              file:text-white
              file:cursor-pointer
            "
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <span
            className="
              text-sm
              text-purple-300/50
            "
          >
            {content.length} characters
          </span>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="
              px-7
              py-3
              rounded-xl
              bg-linear-to-r
              from-purple-600
              to-indigo-600
              text-white
              font-semibold
              shadow-lg
              shadow-purple-500/20
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Posting..."
              : "Post"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default CreatePost;