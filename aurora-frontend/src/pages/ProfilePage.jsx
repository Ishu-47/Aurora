import api from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProfilePage() {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/users/${username}`);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>User not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="rounded-2xl border p-6">

        <div className="h-24 w-24 rounded-full bg-gray-700 mb-4" />

        <h1 className="text-2xl font-bold">
          @{profile.username}
        </h1>

        <p className="mt-2 text-gray-400">
          {profile.bio || "No bio yet"}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Joined{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>

      </div>

    </div>
  );
}

export default ProfilePage;