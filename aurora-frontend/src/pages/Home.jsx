import { useEffect, useState } from "react";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../api/axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      className="
                relative
                min-h-screen
                overflow-hidden
                bg-linear-to-br
                from-slate-950
                via-purple-950
                to-indigo-950
            "
    >
      {/* Background Glow */}
      <div
        className="
                    absolute
                    top-20
                    left-20
                    h-72
                    w-72
                    rounded-full
                    bg-purple-600/20
                    blur-3xl
                    pointer-events-none
                "
      />

      <div
        className="
                    absolute
                    bottom-20
                    right-20
                    h-96
                    w-96
                    rounded-full
                    bg-indigo-600/20
                    blur-3xl
                    pointer-events-none
                "
      />

      <Navbar />

      <div
        className="
                    relative
                    max-w-3xl
                    mx-auto
                    px-4
                    py-8
                "
      >
        <CreatePost
          onPostCreated={fetchPosts}
        />

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                                    animate-pulse
                                    rounded-3xl
                                    bg-white/5
                                    border border-white/10
                                    p-6
                                "
              >
                <div className="h-4 w-24 bg-white/10 rounded mb-4" />

                <div className="h-4 w-full bg-white/10 rounded mb-3" />

                <div className="h-4 w-2/3 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div
            className="
                            text-center
                            py-20
                            rounded-3xl
                            bg-white/5
                            border border-white/10
                            backdrop-blur-xl
                        "
          >
            <div className="text-5xl mb-4">
              ✨
            </div>

            <h2
              className="
                                text-xl
                                font-semibold
                                text-purple-200
                            "
            >
              No posts yet
            </h2>

            <p className="text-purple-300/60 mt-2">
              Be the first to share something.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;