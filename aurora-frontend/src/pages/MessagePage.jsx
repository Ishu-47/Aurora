import { useSearchParams } from "react-router-dom";

function MessagePage() {

    const [searchParams] = useSearchParams();

    const conversationId = searchParams.get("conversation");
    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Messages
            </h1>

            <div className="rounded-xl border border-zinc-800 p-6">

                <p>
                    Selected Conversation:
                </p>

                <p className="font-bold">
                    {conversationId}
                </p>

            </div>

        </div>
    );
}

export default MessagePage;