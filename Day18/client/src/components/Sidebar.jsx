import React from "react";
import { Hash, Users, Volume2, X } from "lucide-react";
import { useGetChannelsQuery } from "../store/chatApi";
import "./Sidebar.css";

export default function Sidebar({ activeChannelId, onSelectChannel, username, isOpen, onClose }) {
  const { data: channels, isLoading, isError } = useGetChannelsQuery();

  return (
    <aside className={`sidebar ${isOpen ? "sidebar--open" : ""}`}>
      <div className="sidebar__header">
        <div className="sidebar__server-name">
          <div className="sidebar__server-icon">💬</div>
          <span>Chat Lounge</span>
        </div>
        <button className="sidebar__close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="sidebar__section">
        <p className="sidebar__section-title">
          <Volume2 size={12} />
          Text Channels
        </p>

        <div className="sidebar__channels">
          {isLoading && (
            <div className="sidebar__loading">
              <div className="loading-dots">
                <span /><span /><span />
              </div>
            </div>
          )}
          {isError && (
            <p className="sidebar__error">Failed to load channels</p>
          )}
          {channels?.map((channel) => (
            <button
              key={channel.id}
              className={`sidebar__channel ${activeChannelId === channel.id ? "sidebar__channel--active" : ""}`}
              onClick={() => onSelectChannel(channel)}
            >
              <Hash size={16} />
              <span className="sidebar__channel-name">{channel.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__user-avatar">{username.charAt(0).toUpperCase()}</div>
        <div className="sidebar__user-info">
          <p className="sidebar__username">{username}</p>
          <p className="sidebar__status">
            <span className="status-dot" />
            Online
          </p>
        </div>
        <Users size={16} className="sidebar__user-icon" />
      </div>
    </aside>
  );
}
