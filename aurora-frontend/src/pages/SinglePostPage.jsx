import { useEffect, useState, } from "react";
import { useParams, } from "react-router-dom";

import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import api from "../api/axios";

function SinglePostPage() {

    const { postId } =
        useParams();

    const [post, setPost] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchPost =
            async () => {

                try {

                    const response =
                        await api.get(
                            `/posts/${postId}`
                        );

                    setPost(
                        response.data
                    );

                } catch (error) {

                    console.error(
                        error
                    );

                } finally {

                    setLoading(
                        false
                    );
                }
            };

        fetchPost();

    }, [postId]);

    return (
        <div
            className="
                min-h-screen
                bg-linear-to-br
                from-slate-950
                via-purple-950
                to-indigo-950
            "
        >
            <Navbar />

            <div
                className="
                    max-w-3xl
                    mx-auto
                    px-4
                    py-8
                "
            >
                {loading ? (

                    <div
                        className="
                            text-center
                            text-purple-300
                        "
                    >
                        Loading...
                    </div>

                ) : !post ? (

                    <div
                        className="
                            text-center
                            text-purple-300
                        "
                    >
                        Post not found
                    </div>

                ) : (

                    <PostCard
                        post={post}
                    />

                )}
            </div>
        </div>
    );
}

export default SinglePostPage;