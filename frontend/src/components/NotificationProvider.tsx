"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client } from '@stomp/stompjs';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, type: Notification['type']) => void;
  clearNotifications: () => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081') + '/ws',
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/notifications', (message) => {
          if (message.body) {
            const data = JSON.parse(message.body);
            const text = `Leave update: ${data.employeeName}'s request is ${data.status}. ${data.managerComment ? 'Comment: ' + data.managerComment : ''}`;
            addNotification(text, data.status === 'APPROVED' ? 'success' : data.status === 'REJECTED' ? 'error' : 'info');
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const addNotification = (message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(7),
      message,
      type,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    setUnreadCount(prev => prev + 1);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, clearNotifications, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
