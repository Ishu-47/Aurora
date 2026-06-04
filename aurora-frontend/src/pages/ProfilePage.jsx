import api from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useAuth } from "../context/AuthContext";

function ProfilePage() {
  const { username } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const [profileRes, postsRes] = await Promise.all([
        api.get(`/users/${username}`),
        api.get(`/users/${username}/posts`)
      ]);

      setProfile(profileRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error(err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex justify-center py-10">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black flex justify-center py-10">
        <p className="text-red-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Profile Header */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-lg">

          {/* Cover */}
          <div className="h-40 bg-linear-to-r from-violet-600 via-fuchsia-600 to-cyan-500" />

          <div className="px-6 pb-6">

            {/* Avatar */}
            <div className="-mt-12">
              <div className="w-24 h-24 rounded-full border-4 border-zinc-900 bg-zinc-700 flex items-center justify-center text-3xl font-bold">
                {profile.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* User Info */}
            <div className="mt-4">
              <h1 className="text-2xl font-bold">
                @{profile.username}
              </h1>

              <p className="mt-2 text-gray-400">
                {profile.bio || "Exploring Aurora ✨"}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                Joined{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-6 border-t border-zinc-800 pt-4">
              <div>
                <p className="text-xl font-bold">
                  {posts.length}
                </p>
                <p className="text-sm text-gray-400">
                  Posts
                </p>
              </div>

              <div>
                <p className="text-xl font-bold">
                  0
                </p>
                <p className="text-sm text-gray-400">
                  Followers
                </p>
              </div>

              <div>
                <p className="text-xl font-bold">
                  0
                </p>
                <p className="text-sm text-gray-400">
                  Following
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Posts
          </h2>

          {posts.length === 0 ? (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-gray-400">
                No posts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={user}
                  onDelete={fetchProfile}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;