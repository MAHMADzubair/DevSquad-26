'use client';

import React, { useState, useEffect } from 'react';
import { Comment } from '@/lib/types';
import { useSocket } from '@/lib/useSocket';
import Notification from './Notification';

interface NotificationData {
  id: string;
  message: string;
  type: string;
  timestamp: Date;
}

export default function Comments() {
  const { socket, isConnected, emit, on, off } = useSocket();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load comments when socket connects
  useEffect(() => {
    const handleLoadComments = (loadedComments: Comment[]) => {
      console.log('Comments loaded:', loadedComments);
      setComments(loadedComments);
    };

    const handleNewComment = (comment: Comment) => {
      console.log('New comment:', comment);
      setComments((prev) => [...prev, comment]);
    };

    const handleNotification = (notification: NotificationData) => {
      console.log('Notification:', notification);
      const notificationId = Math.random().toString(36).substr(2, 9);
      const newNotification: NotificationData = {
        id: notificationId,
        message: notification.message,
        type: notification.type,
        timestamp: new Date(),
      };
      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notificationId),
        );
      }, 5000);
    };

    on('load_comments', handleLoadComments);
    on('new_comment', handleNewComment);
    on('notification', handleNotification);

    return () => {
      off('load_comments', handleLoadComments);
      off('new_comment', handleNewComment);
      off('notification', handleNotification);
    };
  }, [on, off]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !text.trim()) {
      alert('Please enter both author and comment');
      return;
    }

    setIsLoading(true);
    emit('add_comment', {
      author: author.trim(),
      text: text.trim(),
    });

    // Clear form
    setText('');
    setIsLoading(false);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💬 Real-Time Comments
          </h1>
          <p className="text-gray-600">
            Status:{' '}
            <span
              className={`font-semibold ${
                isConnected ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </p>
        </div>

        {/* Comment Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Name
              </label>
              <input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={!isConnected}
              />
            </div>

            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your Comment
              </label>
              <textarea
                id="comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                disabled={!isConnected}
              />
            </div>

            <button
              type="submit"
              disabled={!isConnected || isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              {isLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Comments ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No comments yet. Be the first!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {comment.author}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.timestamp)}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
