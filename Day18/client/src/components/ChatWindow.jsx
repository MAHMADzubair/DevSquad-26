import React, { useState, useEffect, useRef } from "react";
import { Send, Hash, Wifi, WifiOff } from "lucide-react";
import { useGetMessagesQuery } from "../store/chatApi";
import { getSocket } from "../services/socket";
import "./ChatWindow.css";

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString();
}

const AVATAR_COLORS = [
  "#7c3aed", "#db2777", "#ea580c", "#16a34a",
  "#0891b2", "#d97706", "#dc2626", "#7c3aed",
];

function getAvatarColor(name) {
  let hash = 0;
  for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function ChatWindow({ channel, username }) {
  const [inputText, setInputText] = useState("");
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const {
    data: messages,
    isLoading,
    isFetching,
  } = useGetMessagesQuery(channel.id);

  // Track socket connection status
  useEffect(() => {
    const socket = getSocket();
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    setConnected(socket.connected);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    const socket = getSocket();
    socket.emit("send_message", {
      channelId: channel.id,
      author: username,
      text,
    });
    setInputText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend(e);
    }
  };

  // Group messages by date
  const groupedMessages = [];
  let lastDate = null;
  messages?.forEach((msg) => {
    const dateStr = formatDate(msg.timestamp);
    if (dateStr !== lastDate) {
      groupedMessages.push({ type: "divider", date: dateStr, key: `divider-${msg.id}` });
      lastDate = dateStr;
    }
    groupedMessages.push({ type: "message", ...msg, key: msg.id });
  });

  return (
    <div className="chatwindow">
      {/* Header */}
      <div className="chatwindow__header">
        <div className="chatwindow__header-left">
          <Hash size={20} className="chatwindow__hash" />
          <div>
            <h2 className="chatwindow__channel-name">{channel.name}</h2>
            <p className="chatwindow__channel-desc">{channel.description}</p>
          </div>
        </div>
        <div className={`chatwindow__status ${connected ? "chatwindow__status--connected" : "chatwindow__status--disconnected"}`}>
          {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{connected ? "Live" : "Offline"}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="chatwindow__messages">
        {isLoading && (
          <div className="chatwindow__loading">
            <div className="loading-spinner" />
            <p>Loading messages…</p>
          </div>
        )}

        {!isLoading && messages?.length === 0 && (
          <div className="chatwindow__empty">
            <Hash size={48} className="chatwindow__empty-icon" />
            <h3>Welcome to #{channel.name}</h3>
            <p>This is the beginning of #{channel.name}. Be the first to say something!</p>
          </div>
        )}

        {groupedMessages.map((item) => {
          if (item.type === "divider") {
            return (
              <div key={item.key} className="chatwindow__date-divider">
                <div className="chatwindow__divider-line" />
                <span>{item.date}</span>
                <div className="chatwindow__divider-line" />
              </div>
            );
          }

          const isOwn = item.author === username;
          return (
            <div key={item.key} className={`chatwindow__message ${isOwn ? "chatwindow__message--own" : ""}`}>
              <div
                className="chatwindow__avatar"
                style={{ background: getAvatarColor(item.author) }}
              >
                {item.avatar || item.author.charAt(0).toUpperCase()}
              </div>
              <div className="chatwindow__bubble-group">
                <div className="chatwindow__meta">
                  <span className="chatwindow__author">{item.author}</span>
                  <span className="chatwindow__time">{formatTime(item.timestamp)}</span>
                </div>
                <div className={`chatwindow__bubble ${isOwn ? "chatwindow__bubble--own" : ""}`}>
                  {item.text}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="chatwindow__input-bar" onSubmit={handleSend}>
        <input
          className="chatwindow__input"
          type="text"
          placeholder={`Message #${channel.name}`}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className={`chatwindow__send-btn ${inputText.trim() ? "chatwindow__send-btn--active" : ""}`}
          disabled={!inputText.trim()}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
