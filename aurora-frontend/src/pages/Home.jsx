import { useEffect, useState, useRef, useCallback } from "react";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../api/axios";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedType, setFeedType] = useState("feed");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // 1. Strict lock to prevent rapid-fire fetching
  const isFetchingRef = useRef(false);
  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        // Only trigger if intersecting, there's more data, AND we aren't currently fetching
        if (entries[0].isIntersecting && hasMore && !isFetchingRef.current) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchPosts = async (pageNumber = 0) => {
    try {
      isFetchingRef.current = true; // Lock immediately
      setLoading(true);

      const endpoint = feedType === "feed" ? "/feed" : "/explore";
      // 2. INCREASED SIZE TO 10: Ensures the fetched content is tall enough to push the observer off-screen
      const response = await api.get(`${endpoint}?page=${pageNumber}&size=10`);
      const data = response.data;

      if (pageNumber === 0) {
        setPosts(data.content);
      } else {
        setPosts((prev) => [...prev, ...data.content]);
      }

      setHasMore(!data.last);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      // 3. Tiny delay before unlocking to give the DOM time to paint the new posts
      setTimeout(() => {
        isFetchingRef.current = false;
      }, 100);
    }
  };

  const refreshFeed = () => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    fetchPosts(0);
  };

  useEffect(() => {
    refreshFeed();
  }, [feedType]);

  useEffect(() => {
    if (page === 0) return;
    fetchPosts(page);
  }, [page]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-950 via-purple-950 to-indigo-950">
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

      <Navbar />

      <div className="relative max-w-3xl mx-auto px-4 py-8">
        <CreatePost onPostCreated={refreshFeed} />

        <div className="flex gap-3 mb-6 mt-6">
          <button
            onClick={() => setFeedType("feed")}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              feedType === "feed"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-white/5 text-purple-300 border border-white/10 hover:bg-white/10"
            }`}
          >
            Feed
          </button>

          <button
            onClick={() => setFeedType("explore")}
            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
              feedType === "explore"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-white/5 text-purple-300 border border-white/10 hover:bg-white/10"
            }`}
          >
            Explore
          </button>
        </div>

        {loading && page === 0 ? (
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl bg-white/5 border border-white/10 p-6"
              >
                <div className="h-4 w-24 bg-white/10 rounded mb-4" />
                <div className="h-4 w-full bg-white/10 rounded mb-3" />
                <div className="h-4 w-2/3 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-xl font-semibold text-purple-200">
              {feedType === "feed" ? "Your feed is empty" : "No posts found"}
            </h2>
            <p className="text-purple-300/60 mt-2">
              {feedType === "feed"
                ? "Follow some users or switch to Explore."
                : "No posts available right now."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Always render the observer div so it doesn't unmount and instantly refire */}
            {hasMore && (
              <div ref={lastElementRef} className="h-4 w-full" />
            )}

            {loading && page > 0 && (
              <div className="text-center py-6">
                <span className="text-purple-300">Loading more posts...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;