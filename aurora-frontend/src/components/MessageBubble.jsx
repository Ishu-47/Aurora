import { motion } from "framer-motion";

function MessageBubble({
    message,
    isMine,
}) {

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.2,
            }}
            className={`
                flex
                mb-3

                ${
                    isMine
                        ? "justify-end"
                        : "justify-start"
                }
            `}
        >
            <div
                className={`
                    max-w-[70%]
                    px-4
                    py-3
                    rounded-3xl
                    break-words

                    ${
                        isMine
                            ? `
                                bg-white
                                text-black
                            `
                            : `
                                bg-zinc-900
                                text-white
                                border
                                border-zinc-800
                            `
                    }
                `}
            >
                <p
                    className="
                        text-sm
                        leading-relaxed
                    "
                >
                    {message.content}
                </p>
            </div>
        </motion.div>
    );
}

export default MessageBubble;