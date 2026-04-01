import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

const NEST_URL = import.meta.env.VITE_NEST_URL;

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const s = io(NEST_URL, { transports: ['websocket', 'polling'] });
    setSocket(s);

    return () => s.disconnect();
  }, []);

  // Join personal room when user logs in
  useEffect(() => {
    const userId = user?._id || user?.id;
    if (socket && userId) {
      socket.emit('join', userId);
    }
  }, [socket, user]);

  // ── Listen to all notification events ────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const addNotification = (type, data) => {
      setNotifications((prev) => [
        { id: Date.now(), type, ...data, read: false },
        ...prev.slice(0, 49), // keep max 50
      ]);

      const userId = user?._id || user?.id;
      
      // Do not show a popup to the author of the review (they already get a success toast)
      if (type === 'review' && (data.review?.authorId === userId || data.review?.authorId?.toString() === userId?.toString())) return;

      const icons = { review: '✨', reply: '💬', like: '❤️', flag: '🚨', product: '📣' };
      
      toast(data.message || 'New notification', {
        icon: icons[type] || '🔔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
          fontSize: '13px',
        },
      });
    };

    socket.on('new-review', (data) => addNotification('review', data));
    socket.on('new-reply', (data) => addNotification('reply', data));
    socket.on('review-liked', (data) => addNotification('like', data));
    socket.on('review-flagged', (data) => addNotification('flag', data));
    socket.on('product-updated', (data) => addNotification('product', data));

    return () => {
      socket.off('new-review');
      socket.off('new-reply');
      socket.off('review-liked');
      socket.off('review-flagged');
      socket.off('product-updated');
    };
  }, [socket]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SocketContext.Provider
      value={{ socket, notifications, unreadCount, markAllRead, clearAll }}
    >
      {children}
    </SocketContext.Provider>
  );
};
