import React, { useContext, useState, useRef, useEffect } from 'react';
import { SocketContext } from '../../context/SocketContext';
import { Bell, X, CheckCheck, MessageSquare, Heart, Flag, ShoppingBag } from 'lucide-react';

const iconMap = {
  review: <MessageSquare size={14} className="text-violet-400" />,
  reply: <MessageSquare size={14} className="text-blue-400" />,
  like: <Heart size={14} className="text-pink-400" />,
  flag: <Flag size={14} className="text-red-400" />,
  product: <ShoppingBag size={14} className="text-amber-400" />,
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAllRead, clearAll } = useContext(SocketContext);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen((v) => !v);
    if (!open) markAllRead();
  };

  const timeAgo = (id) => {
    const diff = Date.now() - id;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  return (
    <div className="notif-bell-wrapper" ref={panelRef}>
      {/* Bell button */}
      <button className="notif-bell-btn" onClick={handleOpen} aria-label="Notifications">
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="notif-panel">
          <div className="notif-panel-header">
            <span>Notifications</span>
            <div className="notif-panel-actions">
              {notifications.length > 0 && (
                <button onClick={clearAll} className="notif-action-btn" title="Clear all">
                  <X size={14} />
                </button>
              )}
              <button onClick={markAllRead} className="notif-action-btn" title="Mark all read">
                <CheckCheck size={14} />
              </button>
            </div>
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={28} className="notif-empty-icon" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className={`notif-item ${n.read ? '' : 'notif-item--unread'}`}>
                  <span className="notif-icon">{iconMap[n.type] || <Bell size={14} />}</span>
                  <div className="notif-content">
                    <p className="notif-msg">{n.message}</p>
                    <span className="notif-time">{timeAgo(n.id)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
