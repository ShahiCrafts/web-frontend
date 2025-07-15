import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Send, X, MessageSquare, Loader2, Info, Search, MoreHorizontal, MoreVertical, Smile, Paperclip, CornerUpLeft, File, Download, Settings, Users, Pencil, Trash2
} from "lucide-react";
import { socket } from "../services/socket";
import { useAuth } from "../context/AuthProvider";
import api from "../api/api";

// --- Helper Hooks and Functions ---

const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || ref.current.contains(event.target)) return;
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
};

const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const generateColorFromName = (name) => {
    const colors = [
        '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#14b8a6',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#ec4899',
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};


// --- Main Discussion Page Component ---

export default function DiscussionPage() {
    const { postId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // --- State Management ---
    const [discussion, setDiscussion] = useState(null);
    const [messages, setMessages] = useState([]);
    const [editingMessage, setEditingMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);


    // --- Refs for DOM elements ---
    const messagesEndRef = useRef(null);
    const sidebarRef = useRef(null);

    useOnClickOutside(sidebarRef, () => {
        if (window.innerWidth < 1024) { setSidebarOpen(false); }
    });

    // --- Data Fetching and Socket Management ---

    useEffect(() => {
        const getOrCreateDiscussion = async () => {
            setLoading(true);
            setError(null);

            let initialPostData = location.state?.post;

            try {
                if (!initialPostData && postId) {
                    const { data } = await api.get(`/posts/${postId}`);
                    initialPostData = data;
                }

                if (!initialPostData) {
                    setError("Could not load discussion details. Invalid Post.");
                    setLoading(false);
                    return;
                }

                const { data: discussionData } = await api.post('/group-discussions', {
                    postId: initialPostData._id,
                    description: initialPostData.title,
                });
                setDiscussion(discussionData);

                const { data: messagesData } = await api.get(`/messages`, {
                    params: {
                        conversationType: 'group',
                        conversationId: discussionData._id
                    }
                });
                setMessages(messagesData.messages || []);
            } catch (err) {
                console.error("Failed to get or create discussion:", err);
                setError(err.response?.data?.error || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            getOrCreateDiscussion();
        }
    }, [postId, location.state, currentUser]);


    // Connect socket when currentUser is available
    useEffect(() => {
        if (!currentUser) return;

        socket.auth = { token: localStorage.getItem("token") };
        if (!socket.connected) {
            socket.connect();
        }

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [currentUser]);

    // Join room and listen to messages when discussion is ready
    useEffect(() => {
        if (!discussion?._id) return;

        socket.emit("joinRoom", discussion._id);

        const onNewMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
            setShouldScrollToBottom(true);
        };

        const onMessageReacted = ({ messageId, reactions }) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId ? { ...msg, reactions } : msg
                )
            );
        };

        const onMessageEdited = (updatedMsg) => {
            setMessages((prev) =>
                prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg))
            );
        };

        const onMessageDeleted = ({ messageId }) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId
                        ? { ...msg, text: "This message was deleted.", isDeleted: true, attachments: [] }
                        : msg
                )
            );
        };

        socket.on("newMessage", onNewMessage);
        socket.on("messageReacted", onMessageReacted);
        socket.on("messageEdited", onMessageEdited);
        socket.on("messageDeleted", onMessageDeleted);

        return () => {
            socket.off("newMessage", onNewMessage);
            socket.off("messageReacted", onMessageReacted);
            socket.off("messageEdited", onMessageEdited);
            socket.off("messageDeleted", onMessageDeleted);
            socket.emit("leaveRoom", discussion._id);
        };
    }, [discussion]);

    useEffect(() => {
        if (shouldScrollToBottom) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            setShouldScrollToBottom(false);
        }
    }, [messages, shouldScrollToBottom]);



    // --- Event Handlers ---

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !discussion?._id || !isConnected) return;

        if (editingMessage) {
            // Editing existing message
            socket.emit("editMessage", {
                messageId: editingMessage._id,
                text: newMessage.trim(),
            });
            setEditingMessage(null);
        } else {
            // Sending new message
            const payload = {
                conversationId: discussion._id,
                conversationType: "group",
                text: newMessage,
            };
            socket.emit("sendMessage", payload);
        }

        setNewMessage("");
    };


    const handleReact = (messageId, emoji) => {
        setMessages(prev => prev.map(msg => {
            if (msg._id === messageId) {
                const newReactions = { ...(msg.reactions || {}) };
                newReactions[emoji] = (newReactions[emoji] || 0) + 1;
                return { ...msg, reactions: newReactions };
            }
            return msg;
        }));
        socket.emit("reactToMessage", { messageId, emoji, userId: currentUser.id });
    };

    const handleEdit = (message) => {
        setEditingMessage(message);
        setNewMessage(message.text);
    };



    const handleDelete = async (messageId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            await api.delete(`/messages/${messageId}`);

            // Optimistically update UI
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId
                        ? { ...msg, text: "This message was deleted.", isDeleted: true, attachments: [] }
                        : msg
                )
            );

            // Notify others via socket
            socket.emit("deleteMessage", { messageId });
        } catch (err) {
            console.error("Failed to delete message:", err);
            alert(err.response?.data?.error || "Failed to delete message.");
        }
    };



    // --- Sub-Components ---

    const MessageActions = ({ message, isCurrentUser }) => {
        const [showEmojiPicker, setShowEmojiPicker] = useState(false);
        const [showMoreMenu, setShowMoreMenu] = useState(false);
        const actionsRef = useRef(null);
        useOnClickOutside(actionsRef, () => {
            setShowEmojiPicker(false);
            setShowMoreMenu(false);
        });

        const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

        return (
            <div
                className={`absolute top-1/2 -translate-y-1/2 z-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isCurrentUser ? 'right-full mr-2' : 'left-full ml-2'}`}
            >
                <div ref={actionsRef} className="relative flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-1 rounded-full shadow-sm">
                    {/* Emoji Picker Pop-up */}
                    {showEmojiPicker && (
                        <div className="absolute bottom-full mb-2 flex gap-1 bg-white p-2 rounded-full shadow-lg border border-gray-200">
                            {EMOJIS.map(emoji => (
                                <button key={emoji} onClick={() => { handleReact(message._id, emoji); setShowEmojiPicker(false); }} className="p-1 text-xl hover:scale-125 transition-transform">
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                    {/* More Actions Pop-up (Edit/Delete) */}
                    {showMoreMenu && (
                        <div className="absolute bottom-full mb-2 w-32 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                            <button onClick={() => { handleEdit(message); setShowMoreMenu(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded">
                                <Pencil size={14} /> Edit
                            </button>
                            <button onClick={() => { handleDelete(message._id); setShowMoreMenu(false); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded">
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                    {/* Main Action Buttons */}
                    <button onClick={() => setShowEmojiPicker(p => !p)} className="p-1.5 text-gray-500 hover:text-purple-600"><Smile size={18} /></button>
                    <button onClick={() => alert('Replying to: ' + message.text)} className="p-1.5 text-gray-500 hover:text-purple-600"><CornerUpLeft size={18} /></button>
                    {isCurrentUser && (
                        <button onClick={() => setShowMoreMenu(p => !p)} className="p-1.5 text-gray-500 hover:text-purple-600"><MoreVertical size={18} /></button>
                    )}
                </div>
            </div>
        );
    };

    const MessageBubble = ({ message }) => {
        if (!message || !message.author) return null;
        const isCurrentUser = message.author._id === currentUser?.id;
        const avatarColor = generateColorFromName(message.author.fullName);

        return (
            <div className={`group flex items-start gap-3 w-full ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                {message.author.profileImage ? (
                    <img src={message.author.profileImage} alt={message.author.fullName} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                ) : (
                    <div className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold flex-shrink-0" style={{ backgroundColor: avatarColor }}>
                        {getInitials(message.author.fullName)}
                    </div>
                )}
                <div className={`relative flex flex-col max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    {!isCurrentUser && (
                        <p className="text-sm font-semibold text-gray-800 mb-1">{message.author.fullName}</p>
                    )}
                    <div className="relative">
                        <div className={`px-4 py-2.5 rounded-lg ${isCurrentUser ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            <p className="text-sm leading-relaxed break-words">
                                {message.text}
                                {message.isEdited && !message.isDeleted && (
                                    <span className="ml-1 text-xs text-gray-400">(edited)</span>
                                )}
                            </p>

                        </div>
                        <MessageActions message={message} isCurrentUser={isCurrentUser} />
                    </div>
                    {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                            {Object.entries(message.reactions).map(([emoji, count]) => (
                                <div key={emoji} className="flex items-center gap-1 px-2 py-0.5 bg-gray-200/70 border border-gray-300 rounded-full text-xs">
                                    <span>{emoji}</span>
                                    <span className="font-semibold text-gray-700">{count}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- Loading and Error States ---
    if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 text-purple-600 animate-spin" /></div>;
    if (error) return <div className="flex items-center justify-center h-screen"><div className="text-center"><X className="w-12 h-12 text-red-500 mx-auto" /><h2 className="mt-4 text-xl">Error</h2><p className="text-gray-600">{error}</p></div></div>;

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
            {/* Left Sidebar */}
            <aside className="hidden md:flex flex-col w-[360px] bg-white border-r border-gray-200 p-4">
                <h1 className="text-2xl font-bold mb-4">Chats</h1>
                <div className="relative mb-4">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search" className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none" />
                </div>
                {/* Chat list can be mapped here */}
            </aside>

            {/* Main Chat Area */}
            <main className="flex flex-col flex-1 min-w-0 bg-gray-50">
                <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate(-1)} className="p-2 text-gray-600 hover:text-black md:hidden"><ArrowLeft size={22} /></button>
                        <div className="relative">
                            <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">
                                <Users className="text-purple-600" size={24} />
                            </div>
                            <span className={`absolute bottom-0 right-0 w-3 h-3 ${isConnected ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white`}></span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{discussion?.description || "Loading..."}</h2>
                            <p className="text-sm text-gray-500">{discussion?.participants?.length || 0} participants</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-100"><Settings size={20} /></button>
                        <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-100 lg:hidden"><Info size={20} /></button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {messages.length > 0 ? (
                            messages.map((msg) => <MessageBubble key={msg._id || `msg-${Math.random()}`} message={msg} />)
                        ) : (
                            <div className="text-center py-10">
                                <MessageSquare size={48} className="mx-auto text-gray-300" />
                                <h3 className="mt-2 text-lg">No Messages Yet</h3>
                                <p className="mt-1 text-sm text-gray-500">Be the first to start the conversation!</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                <div className="border-t border-gray-200 p-4 bg-white">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={editingMessage ? "Editing message..." : "Type your message"}
                            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-lg focus:outline-none"
                            disabled={!isConnected}
                        />
                        {editingMessage && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingMessage(null);
                                    setNewMessage("");
                                }}
                                className="p-2 text-red-500 hover:text-red-700"
                            >
                                <X size={18} />
                            </button>
                        )}
                        <button
                            type="button"
                            className="p-2 text-gray-500 hover:text-purple-600"
                        >
                            <Paperclip size={22} />
                        </button>
                        <button
                            type="submit"
                            className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:bg-purple-300"
                            disabled={!newMessage.trim() || !isConnected}
                        >
                            <Send size={20} />
                        </button>
                    </form>

                </div>
            </main>

            {/* Right Details Sidebar */}
            <aside ref={sidebarRef} className={`w-80 bg-white border-l border-gray-200 flex-col p-6 transition-transform duration-300 ease-in-out absolute lg:static right-0 h-full z-20 ${sidebarOpen ? "flex translate-x-0" : "hidden translate-x-full"}`}>
                <div className="text-center mb-6">
                    <div className="relative inline-block">
                        <button onClick={() => setSidebarOpen(false)} className="absolute -top-2 -left-2 lg:hidden p-1.5 bg-white rounded-full shadow-md"><X size={18} /></button>
                        <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                            <Users className="text-purple-600" size={48} />
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-4">
                        <h3 className="text-xl font-semibold">{discussion?.description || 'Group'}</h3>
                        <button className="ml-2 p-1.5 text-gray-500 hover:text-black"><Pencil size={16} /></button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Participants ({discussion?.participants?.length || 0})</h4>
                        <div className="max-h-64 overflow-y-auto">
                            {(discussion?.participants || []).map(p => (
                                <div key={p._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                                    <img src={p.profileImage || `https://ui-avatars.com/api/?name=${p.fullName.replace(' ', '+')}&background=random`} className="w-9 h-9 rounded-full" />
                                    <div>
                                        <p className="font-medium text-sm">{p.fullName}</p>
                                        <p className="text-xs text-gray-400">{p._id === currentUser.id ? 'You' : 'Member'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}