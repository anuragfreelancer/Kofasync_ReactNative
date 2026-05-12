import { Link } from "react-router-dom";
import Header from "../components/Header";

import PageTitle from "../components/PageTitle";
import { useEffect, useState, useMemo } from "react";
import { socketService } from "../socket/socketService";
import { socket } from "../socket/socket";
import DashboardSidebar from "../components/DashboardSidebar";
import { getConversations } from "../api/chatApi";
import Footer from "../components/Footer";

export default function MyChat() {
  const [chats, setChats] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unread, setUnread] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = user?.user?._id;

  // Load conversations with unread counts
  const loadChats = async () => {
    try {
      setLoading(true);
      const res = await getConversations();
      const data = Array.isArray(res) ? res : res.data || [];
      setChats(data);

      // Initialize unread counts from API response
      const unreadMap = {};
      data.forEach((conv) => {
        if (conv.unreadCount > 0) {
          unreadMap[conv._id] = conv.unreadCount;
        }
      });
      setUnread(unreadMap);
    } catch (err) {
      console.error("Chat load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Join all chat rooms when chats load
  useEffect(() => {
    if (!currentUserId || chats.length === 0) return;
    chats.forEach((chat) => {
      socket.emit("join-chat", { recipientId: chat._id });
    });
  }, [chats, currentUserId]);

  // Initial load
  useEffect(() => {
    loadChats();
  }, []);

  // Socket connection and real-time updates
  useEffect(() => {
    socketService.connect();

    socketService.onConnect(() => setIsConnected(true));
    socketService.onDisconnect(() => setIsConnected(false));

    // Handle incoming messages
    const handleReceiveMessage = (msg) => {
      // Refresh conversations to update last message
      loadChats();

      const otherUserId =
        String(msg.senderId) === String(currentUserId)
          ? msg.receiverId
          : msg.senderId;

      if (String(otherUserId) !== String(currentUserId)) {
        setUnread((prev) => ({
          ...prev,
          [otherUserId]: (prev[otherUserId] || 0) + 1,
        }));
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socketService.disconnect();
    };
  }, [currentUserId]);

  // Online users tracking
  useEffect(() => {
    const handleUserOnline = (data) => {
      setOnlineUsers(data.activeUsers || []);
    };
    const handleUserOffline = (data) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, []);

  // Reset unread count when user clicks on a conversation
  const handleChatClick = (chatId) => {
    setUnread((prev) => ({ ...prev, [chatId]: 0 }));
  };

  // Filter chats based on search term
  const filteredChats = useMemo(() => {
    if (!searchTerm.trim()) return chats;
    return chats.filter((chat) =>
      (chat.name || chat.senderName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [chats, searchTerm]);

  // Helper: format last message time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <>
      <Header />

      <PageTitle
        title="Messages"
        breadcrumbs={[
          { label: "Home", link: "/" },
          { label: "My Chat", active: true },
        ]}
      />

      <div className="user-dashboard pt-100 pb-60">
        <div className="container">
          <div className="row gx-xl-5">
            <div className="col-lg-3">
              <DashboardSidebar />
            </div>

            <div className="col-lg-9">
              <div className="user-profile-details mb-30">
                <div className="account-info radius-md">
                  <div className="title d-flex justify-content-between align-items-center">
                    <h4>Conversations</h4>
                    <span
                      style={{
                        fontSize: "12px",
                        color: isConnected ? "#10b981" : "#ef4444",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: isConnected ? "#10b981" : "#ef4444",
                        }}
                      />
                      {isConnected ? "Connected" : "Offline"}
                    </span>
                  </div>

                  <div className="main-info">
                    <style>{`
                      /* Custom scrollbar */
                      .messages-left::-webkit-scrollbar {
                        width: 4px;
                      }
                      .messages-left::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 10px;
                      }
                      .messages-left::-webkit-scrollbar-thumb {
                        background: #cbd5e1;
                        border-radius: 10px;
                      }

                      /* Chat list container */
                      .messages-left {
                        width: 100%;
                        background: #ffffff;
                        overflow-y: auto;
                        padding: 16px;
                        height: calc(100vh - 240px);
                        border-radius: 16px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                      }

                      /* Individual chat item - user side distinct style */
                      .msg-user {
                        display: flex;
                        align-items: center;
                        gap: 14px;
                        padding: 14px;
                        border-radius: 20px;
                        transition: all 0.2s ease;
                        cursor: pointer;
                        margin-bottom: 8px;
                        background: #ffffff;
                        border: 1px solid #f0f2f5;
                        text-decoration: none;
                        color: #1e293b;
                        position: relative;
                      }

                      .msg-user:hover {
                        background: #f8fafc;
                        border-color: #e2e8f0;
                        transform: translateX(2px);
                      }

                      /* Avatar styling */
                      .msg-user img {
                        object-fit: cover;
                        border-radius: 50%;
                        width: 52px;
                        height: 52px;
                        border: 2px solid #fff;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                      }

                      /* Content area */
                      .chat-content {
                        flex: 1;
                        min-width: 0;
                      }

                      .chat-name {
                        font-weight: 600;
                        font-size: 15px;
                        margin-bottom: 4px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                      }

                      .last-message {
                        font-size: 13px;
                        color: #64748b;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        max-width: 200px;
                      }

                      /* Time and unread badge */
                      .chat-meta {
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                        gap: 6px;
                      }

                      .message-time {
                        font-size: 11px;
                        color: #94a3b8;
                      }

                      .unread-badge {
                        background: #3b82f6;
                        color: white;
                        border-radius: 30px;
                        padding: 2px 8px;
                        font-size: 11px;
                        font-weight: 600;
                        min-width: 20px;
                        text-align: center;
                      }

                      /* Online status dot */
                      .online-dot {
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background-color: #22c55e;
                        box-shadow: 0 0 0 2px white;
                      }

                      .offline-dot {
                        background-color: #cbd5e1;
                      }

                      /* Search input */
                      .search-input {
                        width: 100%;
                        padding: 12px 16px;
                        border: 1px solid #e2e8f0;
                        border-radius: 40px;
                        font-size: 14px;
                        outline: none;
                        transition: all 0.2s;
                        background: #f8fafc;
                        margin-bottom: 16px;
                      }
                      .search-input:focus {
                        border-color: #3b82f6;
                        background: white;
                        box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
                      }

                      /* Empty state */
                      .empty-state {
                        text-align: center;
                        padding: 48px 20px;
                        color: #94a3b8;
                      }

                      /* Loading skeleton */
                      .skeleton-item {
                        display: flex;
                        gap: 14px;
                        padding: 14px;
                        margin-bottom: 8px;
                        background: #f8fafc;
                        border-radius: 20px;
                        animation: pulse 1.5s infinite;
                      }
                      @keyframes pulse {
                        0% { opacity: 0.6; }
                        50% { opacity: 1; }
                        100% { opacity: 0.6; }
                      }
                      .skeleton-avatar {
                        width: 52px;
                        height: 52px;
                        background: #e2e8f0;
                        border-radius: 50%;
                      }
                      .skeleton-text {
                        flex: 1;
                        height: 48px;
                        background: #e2e8f0;
                        border-radius: 12px;
                      }
                    `}</style>

                    <div className="content-area">
                      <div className="messages-left">
                        <input
                          type="text"
                          className="search-input"
                          placeholder="Search conversations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {loading ? (
                          // Skeleton loading
                          Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="skeleton-item">
                              <div className="skeleton-avatar" />
                              <div className="skeleton-text" />
                            </div>
                          ))
                        ) : filteredChats.length === 0 ? (
                          <div className="empty-state">
                            <p>No conversations found</p>
                          </div>
                        ) : (
                          filteredChats.map((chat) => {
                            const isOnline = onlineUsers.some(
                              (u) => u.userId === chat._id
                            );
                            const unreadCount = unread[chat._id] || 0;
                            const displayName = chat.name || chat.senderName || "User";
                            const lastMessage = chat.lastMessage || "No messages yet";
                            const timestamp = chat.timestamp || chat.updatedAt;

                            return (
                              <Link
                                key={chat._id}
                                to={`/chat-details/${chat._id}`}
                                state={{ name: displayName }}
                                className="msg-user"
                                onClick={() => handleChatClick(chat._id)}
                              >
                                <img
                                  src={
                                    chat.avatar ||
                                    "https://ui-avatars.com/api/?background=0084ff&color=fff&name=" +
                                      encodeURIComponent(displayName)
                                  }
                                  alt={displayName}
                                />
                                <div className="chat-content">
                                  <div className="chat-name">
                                    {displayName}
                                    <span
                                      className={`online-dot ${
                                        !isOnline ? "offline-dot" : ""
                                      }`}
                                      title={isOnline ? "Online" : "Offline"}
                                    />
                                  </div>
                                  <div className="last-message">{lastMessage}</div>
                                </div>
                                <div className="chat-meta">
                                  <span className="message-time">
                                    {formatTime(timestamp)}
                                  </span>
                                  {unreadCount > 0 && (
                                    <span className="unread-badge">
                                      {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}