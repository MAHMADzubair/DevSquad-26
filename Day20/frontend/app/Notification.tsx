'use client';

import React, { useEffect, useState } from 'react';

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
      case 'comment':
        return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400';
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  return (
    <div
      className={`glass px-5 py-4 rounded-3xl border shadow-xl flex items-center gap-4 animate-slide-down ${getStyle()}`}
    >
      <div className={`w-2 h-2 rounded-full ${type === 'comment' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-primary'} animate-pulse`} />
      <span className="text-sm font-semibold tracking-tight leading-none">{message}</span>
    </div>
  );
}
