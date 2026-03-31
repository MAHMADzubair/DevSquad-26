'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './authContext';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
}

export function useSocket(): UseSocketReturn {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    // Avoid multiple connections
    if (socketRef.current?.connected) return;

    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      query: { userId: user.id, username: user.username },
      // By default socket.io starts with polling and upgrades to websocket
    });

    socketRef.current = socket;
    setSocketInstance(socket);

    const handleConnect = () => {
      console.log('🌐 [Socket] Connected successfully! ID:', socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = (reason: string) => {
      console.log('🌐 [Socket] Disconnected. Reason:', reason);
      setIsConnected(false);
    };

    const handleConnectError = (err: Error) => {
      console.error('🌐 [Socket] Connection Error:', err.message);
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);

    if (socket.connected) {
      setIsConnected(true);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
    };
  }, [user]);

  useEffect(() => {
    if (!user && socketRef.current) {
      console.log('🔌 Disconnecting socket on logout');
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocketInstance(null);
      setIsConnected(false);
    }
  }, [user]);

  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected) {
      console.log(`📤 [Socket] Emitting event: "${event}"`, data);
      socketRef.current.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit "${event}" - socket not connected`);
    }
  }, []);

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socketRef.current) {
        // We use a specific listener to avoid duplicates if needed
        // but Socket.io .on() keeps adding. 
        // We rely on the caller to use off() or unique function references.
        socketRef.current.on(event, callback);
      }
    },
    [socketInstance],
  );

  const off = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    },
    [socketInstance],
  );

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    off,
  };
}
