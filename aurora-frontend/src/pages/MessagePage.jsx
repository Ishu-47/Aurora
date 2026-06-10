import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getConversations } from "../services/conversationService";

function MessagePage() {

    const [searchParams] = useSearchParams();

    const [conversations, setConversations] =
        useState([]);

    const conversationId =
        searchParams.get("conversation");

    useEffect(() => {

        const loadConversations = async () => {
            try {

                const data =
                    await getConversations();

                setConversations(data);

            } catch (error) {
                console.error(error);
            }
        };

        loadConversations();

    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">

            <div className="grid grid-cols-12 gap-4">

                <div
                    className="
                        col-span-4
                        border
                        border-zinc-800
                        rounded-xl
                        overflow-hidden
                    "
                >
                    <div
                        className="
                            p-4
                            border-b
                            border-zinc-800
                            font-semibold
                        "
                    >
                        Conversations
                    </div>

                    {conversations.map(
                        conversation => (
                            <div
                                key={
                                    conversation.conversationId
                                }
                                className="
                                    p-4
                                    border-b
                                    border-zinc-800
                                "
                            >
                                <div
                                    className="font-medium"
                                >
                                    {
                                        conversation.username
                                    }
                                </div>

                                <div
                                    className="
                                        text-sm
                                        text-zinc-400
                                    "
                                >
                                    {
                                        conversation.lastMessage ||
                                        "No messages yet"
                                    }
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div
                    className="
                        col-span-8
                        border
                        border-zinc-800
                        rounded-xl
                        p-6
                    "
                >
                    <h2 className="text-xl font-bold">
                        Conversation
                    </h2>

                    <p className="mt-2 text-zinc-400">
                        Selected Conversation:
                        {" "}
                        {conversationId}
                    </p>
                </div>

            </div>

        </div>
    );
}

export default MessagePage;