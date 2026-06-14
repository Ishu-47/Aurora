import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function SettingsPage() {
const { user } = useAuth();


const [profile, setProfile] = useState(null);

const [bio, setBio] = useState("");

const [image, setImage] = useState(null);

const [previewUrl, setPreviewUrl] = useState("");

const [loadingBio, setLoadingBio] = useState(false);

const [loadingImage, setLoadingImage] = useState(false);

useEffect(() => {
    fetchProfile();
}, []);

const fetchProfile = async () => {
    try {
        const response = await api.get(
            `/users/${user.username}`
        );
        setProfile(response.data);

        setBio(response.data.bio || "");

        setPreviewUrl(
            response.data.profilePictureUrl || ""
        );
    } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
    }
};

const handleBioSave = async () => {
    try {
        setLoadingBio(true);

        const response = await api.put(
            "/users/profile",
            {
                bio,
            }
        );

        setProfile(response.data);

        toast.success("Profile updated");
    } catch (error) {
        console.error(error);

        toast.error("Failed to update profile");
    } finally {
        setLoadingBio(false);
    }
};

const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        return toast.error(
            "Please select an image"
        );
    }

    if (file.size > 5 * 1024 * 1024) {
        return toast.error(
            "Image must be smaller than 5MB"
        );
    }

    setImage(file);

    setPreviewUrl(
        URL.createObjectURL(file)
    );
};

const handleImageUpload = async () => {
    if (!image) {
        return toast.error(
            "Please select an image"
        );
    }

    try {
        setLoadingImage(true);

        const formData = new FormData();

        formData.append(
            "image",
            image
        );

        const response = await api.put(
            "/users/profile-picture",
            formData
        );

        setProfile(response.data);

        setPreviewUrl(
            response.data.profilePictureUrl
        );

        setImage(null);

        toast.success(
            "Profile picture updated"
        );
    } catch (error) {
        console.error(error);

        toast.error(
            "Failed to upload image"
        );
    } finally {
        setLoadingImage(false);
    }
};

if (!profile) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            Loading...
        </div>
    );
}

return (
    <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 py-8">

            <h1 className="text-3xl font-bold mb-8">
                Settings
            </h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

                <h2 className="text-xl font-semibold mb-6">
                    Profile Picture
                </h2>

                <div className="flex flex-col items-center gap-4">

                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Profile"
                            className="
                                w-32
                                h-32
                                rounded-full
                                object-cover
                                border-4
                                border-zinc-700
                            "
                        />
                    ) : (
                        <div
                            className="
                                w-32
                                h-32
                                rounded-full
                                bg-zinc-700
                                flex
                                items-center
                                justify-center
                                text-4xl
                                font-bold
                            "
                        >
                            {profile.username
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    <button
                        onClick={handleImageUpload}
                        disabled={loadingImage}
                        className="
                            px-5
                            py-2
                            rounded-lg
                            bg-violet-600
                            hover:bg-violet-500
                            disabled:opacity-50
                        "
                    >
                        {loadingImage
                            ? "Uploading..."
                            : "Upload Picture"}
                    </button>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mt-6">

                <h2 className="text-xl font-semibold mb-6">
                    Bio
                </h2>

                <textarea
                    value={bio}
                    onChange={(e) =>
                        setBio(e.target.value)
                    }
                    maxLength={200}
                    rows={5}
                    className="
                        w-full
                        bg-zinc-800
                        border
                        border-zinc-700
                        rounded-xl
                        p-4
                        resize-none
                        outline-none
                    "
                />

                <div className="flex justify-between items-center mt-4">

                    <span className="text-sm text-gray-400">
                        {bio.length}/200
                    </span>

                    <button
                        onClick={handleBioSave}
                        disabled={loadingBio}
                        className="
                            px-5
                            py-2
                            rounded-lg
                            bg-violet-600
                            hover:bg-violet-500
                            disabled:opacity-50
                        "
                    >
                        {loadingBio
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    </div>
);


}

export default SettingsPage;
