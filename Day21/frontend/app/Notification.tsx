'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Info, Send } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: string;
}

export default function Notification({
  message,
  type,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const getStyle = () => {
    switch(type) {
      case 'comment': return 'bg-blue-500/10 border-blue-500/20 text-blue-700';
      case 'reply': return 'bg-primary/10 border-primary/20 text-primary';
      case 'like': return 'bg-red-500/10 border-red-500/20 text-red-700';
      case 'follow': return 'bg-green-500/10 border-green-500/20 text-green-700';
      case 'error': return 'bg-red-500/10 border-red-500/20 text-red-700';
      default: return 'bg-white shadow-xl text-foreground';
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'comment': return <MessageCircle className="w-4 h-4" />;
      case 'reply': return <Send className="w-4 h-4" />;
      case 'like': return <Heart className="w-4 h-4 fill-current" />;
      case 'follow': return <UserPlus className="w-4 h-4" />;
      case 'error': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`glass px-5 py-4 rounded-[28px] border shadow-2xl flex items-center gap-4 animate-spring animate-float ${getStyle()}`}
    >
      <div className="p-2 bg-white/40 rounded-xl">
        {getIcon()}
      </div>
      <span className="text-sm font-bold tracking-tight leading-tight">{message}</span>
    </div>
  );
}
