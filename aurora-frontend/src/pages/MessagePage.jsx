import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Search, Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getConversations, getMessages, markConversationAsRead, sendMessage, } from "../services/conversationService";
import MessageBubble from "../components/MessageBubble";
import { sendChatMessage, subscribeMessages } from "../websocket/chatSocket";


// Deterministic gradient per username initial
const avatarGradients = [
    "from-violet-500 to-indigo-600",
    "from-rose-500 to-pink-600",
    "from-amber-400 to-orange-500",
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-blue-500",
    "from-fuchsia-400 to-purple-500",
];

function getGradient(name = "") {
    const idx = (name.charCodeAt(0) || 0) % avatarGradients.length;
    return avatarGradients[idx];
}

function formatTime(timestamp) {
    if (!timestamp) return "";
    const d = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ConversationCard({ conversation, active, onClick }) {
    const gradient = getGradient(conversation.username);
    const initial = conversation.username?.charAt(0)?.toUpperCase() ?? "?";
    const time = formatTime(conversation.lastMessageTime);
    const unread = conversation.unreadCount ?? 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ x: 3, scale: 1.005 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={onClick}
            className={`
                mx-2 mb-1 px-4 py-3.5 rounded-[20px] cursor-pointer
                transition-all duration-200 ease-out relative overflow-hidden
                ${active
                    ? "bg-white/8 border border-white/15 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    : "hover:bg-white/5 border border-transparent"
                }
            `}
            style={active ? {
                background: "rgba(255,255,255,0.06)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 4px 24px rgba(255,255,255,0.04)",
            } : {}}
        >
            {/* Active glow line */}
            {active && (
                <motion.div
                    layoutId="activeGlow"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-white/60"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            )}

            <div className="flex items-center gap-3 pl-1">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <motion.div
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.15 }}
                        className={`
                            w-14 h-14 rounded-full bg-linear-to-br ${gradient}
                            flex items-center justify-center
                            text-white font-semibold text-lg
                            shadow-lg
                        `}
                    >
                        {initial}
                    </motion.div>
                    {/* Online indicator */}
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0a] shadow-sm" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                        <span className={`font-semibold text-sm truncate ${active ? "text-white" : "text-zinc-100"}`}>
                            {conversation.username}
                        </span>
                        <span className="text-[11px] text-zinc-500 shrink-0 ml-2">
                            {time}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className={`text-xs truncate ${active ? "text-zinc-300" : "text-zinc-500"}`}>
                            {conversation.lastMessage || "No messages yet"}
                        </span>
                        {unread > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="shrink-0 min-w-4.5 h-4.5 px-1 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center"
                            >
                                {unread > 99 ? "99+" : unread}
                            </motion.span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function MessagePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const { user } = useAuth();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const conversationParam = searchParams.get("conversation");
    const conversationId = conversationParam
        ? Number(conversationParam)
        : null;

    useEffect(() => {

        const subscription = subscribeMessages(
            (message) => {

                if (
                    Number(message.conversationId) ===
                    conversationId
                ) {

                    setMessages(prev => {

                        const exists =
                            prev.some(
                                m => m.id === message.id
                            );

                        if (exists) {
                            return prev;
                        }

                        return [
                            ...prev,
                            message
                        ];
                    });

                }

                setConversations(prev => {

                    const updated =
                        prev.map(conversation => {

                            if (
                                conversation.conversationId !==
                                message.conversationId
                            ) {
                                return conversation;
                            }

                            return {
                                ...conversation,

                                lastMessage:
                                    message.content,

                                lastMessageTime:
                                    message.createdAt,

                                unreadCount:
                                    Number(message.conversationId) ===
                                        conversationId
                                        ? 0
                                        : (conversation.unreadCount ?? 0) + 1
                            };
                        });

                    updated.sort(
                        (a, b) =>
                            new Date(
                                b.lastMessageTime || 0
                            ) -
                            new Date(
                                a.lastMessageTime || 0
                            )
                    );

                    return [...updated];
                });

            }
        );

        return () => {
            subscription?.unsubscribe();
        };

    }, [conversationId]);

    useEffect(() => {
        if (!conversationId) {
            return;
        }
        const loadMessages = async () => {
            try {

                await markConversationAsRead(
                    conversationId
                );
                const data =
                    await getMessages(
                        conversationId
                    );

                setMessages(data);
                setConversations(prev =>
                    prev.map(conversation =>
                        conversation.conversationId === conversationId
                            ? {
                                ...conversation,
                                unreadCount: 0
                            }
                            : conversation
                    )
                );

            } catch (error) {
                console.error(error);
            }
        };
        loadMessages();

    }, [conversationId]);

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const data = await getConversations();

                data.sort(
                    (a, b) =>
                        new Date(b.lastMessageTime || 0) -
                        new Date(a.lastMessageTime || 0)
                );

                setConversations(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadConversations();
    }, []);

    // useEffect(() => {
    //     if (!conversationId) {
    //         setMessages([]);
    //         return;
    //     }

    //     const loadMessages = async () => {
    //         try {
    //             const data = await getMessages(conversationId);
    //             setMessages(data);
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     };

    //     loadMessages();
    // }, [conversationId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const filtered = conversations.filter(
        (c) =>
            !searchQuery ||
            c.username?.toLowerCase().includes(
                searchQuery.toLowerCase()
            )
    );

    const handleSelect = (id) => {
        setSearchParams({ conversation: id });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !conversationId) {
            return;
        }

        try {
            const optimisticMessage = {
                id: Date.now(),
                conversationId,
                senderId: user.id,
                senderUsername: user.username,
                content: newMessage,
                createdAt: new Date().toISOString(),
            };

            setMessages(prev => [
                ...prev,
                optimisticMessage,
            ]);
            setConversations(prev => {

                const updated = prev.map(conversation => {

                    if (
                        conversation.conversationId !==
                        conversationId
                    ) {
                        return conversation;
                    }

                    return {
                        ...conversation,
                        lastMessage: newMessage,
                        lastMessageTime: new Date().toISOString(),
                    };
                });

                updated.sort(
                    (a, b) =>
                        new Date(b.lastMessageTime || 0) -
                        new Date(a.lastMessageTime || 0)
                );

                return [...updated];
            });

            sendChatMessage(
                conversationId,
                newMessage
            );

            setNewMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="min-h-screen px-4 py-4 md:px-6 md:py-6"
            style={{ background: "#080808" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full max-w-7xl mx-auto rounded-4xl overflow-hidden flex"
                style={{
                    background: "#0a0a0a",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.6)",
                }}
            >
                {/* ── SIDEBAR ── */}
                <div
                    className="w-85 md:w-[320px] shrink-0 flex flex-col"
                    style={{
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                        background: "#0c0c0c",
                    }}
                >
                    {/* Sidebar header */}
                    <div
                        className="px-6 pt-6 pb-4"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                    >
                        <h1 className="text-2xl font-bold text-white tracking-tight">Messages</h1>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
                        </p>

                        {/* Search */}
                        <div className="mt-4 relative">
                            <Search
                                size={14}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                            />
                            <input
                                type="text"
                                placeholder="Search conversations…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="
                                    w-full pl-9 pr-4 py-2.5 rounded-2xl
                                    bg-white/5 border border-white/8
                                    text-sm text-zinc-200 placeholder:text-zinc-600
                                    outline-none focus:border-white/20 focus:bg-white/7
                                    transition-all duration-200
                                "
                            />
                        </div>
                    </div>

                    {/* Conversation list */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-2 scrollbar-thin">
                        <AnimatePresence mode="popLayout">
                            {filtered.length > 0 ? (
                                filtered.map((conversation, i) => (
                                    <motion.div
                                        key={conversation.conversationId}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: i * 0.04, duration: 0.2 }}
                                    >
                                        <ConversationCard
                                            conversation={conversation}
                                            active={conversation.conversationId === conversationId}
                                            onClick={() => handleSelect(conversation.conversationId)}
                                        />
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="px-6 py-10 text-center text-zinc-600 text-sm"
                                >
                                    {searchQuery ? "No conversations match your search." : "No conversations yet."}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── MAIN CHAT AREA ── */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden min-w-0">
                    {/* Ambient glow effects */}
                    <div
                        className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.04]"
                        style={{
                            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)",
                            filter: "blur(60px)",
                        }}
                    />
                    <div
                        className="pointer-events-none absolute -bottom-32 -right-32 w-125 h-125 rounded-full opacity-[0.03]"
                        style={{
                            background: "radial-gradient(circle, rgba(255,255,255,1) 0%, transparent 70%)",
                            filter: "blur(80px)",
                        }}
                    />

                    <AnimatePresence mode="wait">
                        {conversationId ? (
                            /* Active conversation placeholder */
                            <motion.div
                                key="conversation"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full flex flex-col"
                            >
                                {(() => {
                                    const conv = conversations.find(
                                        (c) => c.conversationId === conversationId
                                    );

                                    return (
                                        <>
                                            {/* Header */}

                                            <div
                                                className="
                        h-20
                        px-8
                        flex
                        items-center
                        border-b
                        border-white/5
                    "
                                            >
                                                <div>
                                                    <h2 className="text-white font-semibold text-lg">
                                                        {conv?.username}
                                                    </h2>
                                                </div>
                                            </div>

                                            {/* Messages */}

                                            <div
                                                className="
                        flex-1
                        overflow-y-auto
                        px-8
                        py-6
                    "
                                            >
                                                {messages.map((message) => (
                                                    <MessageBubble
                                                        key={message.id}
                                                        message={message}
                                                        isMine={
                                                            message.senderId === user?.id
                                                        }
                                                    />
                                                ))}

                                                <div ref={messagesEndRef} />
                                            </div>

                                            {/* Input */}

                                            <div
                                                className="
                        p-6
                        border-t
                        border-white/5
                    "
                                            >
                                                <div className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) =>
                                                            setNewMessage(
                                                                e.target.value
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSendMessage();
                                                            }
                                                        }}
                                                        placeholder="Type a message..."
                                                        className="
                                flex-1
                                bg-white/5
                                border
                                border-white/10
                                rounded-2xl
                                px-4
                                py-3
                                text-white
                                outline-none
                            "
                                                    />

                                                    <button
                                                        onClick={handleSendMessage}
                                                        className="
                                px-6
                                rounded-2xl
                                bg-white
                                text-black
                                font-medium
                            "
                                                    >
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </motion.div>
                        ) : (
                            /* Empty state */
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                                className="text-center px-8 max-w-sm"
                            >
                                {/* Icon container */}
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="relative mx-auto mb-7 w-24 h-24"
                                >
                                    {/* Outer ring */}
                                    <div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: "rgba(255,255,255,0.04)",
                                            boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
                                        }}
                                    />
                                    {/* Inner glow */}
                                    <div
                                        className="absolute inset-3 rounded-full"
                                        style={{
                                            background: "rgba(255,255,255,0.05)",
                                            boxShadow: "0 0 20px rgba(255,255,255,0.06)",
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <MessageCircle size={36} className="text-zinc-400" />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ y: 8, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Sparkles size={14} className="text-zinc-600" />
                                        <span className="text-xs text-zinc-600 font-medium tracking-widest uppercase">
                                            Aurora Chat
                                        </span>
                                        <Sparkles size={14} className="text-zinc-600" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                                        Welcome to Aurora Chat
                                    </h2>
                                    <p className="text-zinc-500 text-sm leading-relaxed">
                                        Select a conversation from the sidebar to continue chatting.
                                    </p>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default MessagePage;