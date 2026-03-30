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
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  const bgColor =
    type === 'comment'
      ? 'bg-green-500'
      : type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500';

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg animate-fade-in-down`}
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
