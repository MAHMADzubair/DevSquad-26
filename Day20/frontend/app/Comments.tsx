'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const { isConnected, emit, on, off } = useSocket();
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load comments and handle new ones
  useEffect(() => {
    const handleLoadComments = (loadedComments: Comment[]) => {
      setComments(loadedComments);
    };

    const handleNewComment = (comment: Comment) => {
      setComments((prev) => [...prev, comment]);
      // Smooth scroll to bottom when new comment arrives
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    const handleNotification = (notification: { message: string; type: string }) => {
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
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_60%)] bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-primary)_0%,_transparent_60%)] animate-float">
      {/* Notifications */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 w-full max-w-sm px-4">
        {notifications.map((n) => (
          <Notification key={n.id} message={n.message} type={n.type} />
        ))}
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Modern Header */}
        <header className="flex flex-col items-center justify-center gap-2 animate-spring">
          <div className="p-3 bg-white/40 glass pink-glow rounded-3xl mb-4">
            <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-primary shadow-[0_0_15px_hsl(var(--primary))] animate-pulse' : 'bg-red-400 opacity-60'}`} />
          </div>
          <h1 className="text-7xl font-extrabold tracking-tighter text-foreground drop-shadow-sm">
            echo
          </h1>
          <p className="text-lg font-medium opacity-50 tracking-wide uppercase text-primary-foreground">
            {isConnected ? 'LIVE & REAL-TIME' : 'STREAM DISCONNECTED'}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
          {/* Main Feed Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-xl font-bold opacity-80">Stream Feed</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/20 glass rounded-full text-sm font-semibold opacity-60">
                 {comments.length} Entries
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {comments.length === 0 ? (
                <div className="glass rounded-[40px] p-20 text-center border-dashed border-primary/20 bg-white/10 animate-spring" style={{ animationDelay: '0.2s' }}>
                  <p className="text-xl font-semibold opacity-40 italic">Waiting for an echo...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment, i) => (
                    <div
                      key={comment.id}
                      className="group flex flex-col gap-2 animate-spring"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-2xl bg-primary/20 glass flex items-center justify-center font-bold text-xs text-primary-foreground">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-sm opacity-60">{comment.author}</span>
                        <span className="text-[10px] font-medium opacity-30 mt-0.5 tracking-widest">{formatDate(comment.timestamp)}</span>
                      </div>
                      <div className="glass rounded-[32px] p-6 shadow-sm border border-white/40 ring-1 ring-primary/5 transition-all group-hover:scale-[1.01] group-hover:shadow-xl group-hover:shadow-primary/5">
                        <p className="text-foreground/90 text-lg leading-relaxed font-medium">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={scrollRef} />
                </div>
              )}
            </div>
          </section>

          {/* Input Side Section */}
          <aside className="lg:sticky lg:top-12 space-y-6">
            <div className="glass rounded-[40px] p-8 pink-glow border border-whiteShadow shadow-2xl animate-spring" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold mb-6 px-1">Share Thoughts</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Alias</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Identify yourself"
                    className="w-full bg-white/30 border border-whiteShadow rounded-2xl px-5 py-4 focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:opacity-20 font-semibold"
                    disabled={!isConnected}
                    required
                  />
                </div>
                <div className="space-y-1.5 px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Message</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your stream entry..."
                    rows={4}
                    className="w-full bg-white/30 border border-whiteShadow rounded-3xl px-5 py-4 focus:ring-[12px] focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none placeholder:opacity-20 font-medium"
                    disabled={!isConnected}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={!isConnected || isLoading || !author.trim() || !text.trim()}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:scale-100 text-primary-foreground font-extrabold py-5 rounded-[28px] shadow-2xl shadow-primary/40 transform active:scale-[0.95] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                >
                  {isLoading ? 'Relaying...' : (
                    <>
                      <span className="tracking-tight italic">Echo Entry</span>
                      <svg className="w-5 h-5 opacity-50 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="glass rounded-[32px] p-6 text-center opacity-40 animate-spring" style={{ animationDelay: '0.3s' }}>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em]">real-time platform v2.0</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
