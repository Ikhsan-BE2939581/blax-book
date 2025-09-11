import { useState, useCallback } from 'react';
import { NotificationProps } from '@/components/ui/notification';

export interface CreateNotificationOptions {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export interface NotificationHook {
  notifications: NotificationProps[];
  addNotification: (options: CreateNotificationOptions) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  success: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
}

let notificationIdCounter = 0;

export const useNotification = (): NotificationHook => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const generateId = useCallback(() => {
    notificationIdCounter += 1;
    return `notification-${notificationIdCounter}-${Date.now()}`;
  }, []);

  const addNotification = useCallback(
    (options: CreateNotificationOptions): string => {
      const id = generateId();
      const notification: NotificationProps = {
        id,
        ...options,
        onClose: (notificationId: string) => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== notificationId)
          );
        },
      };

      setNotifications((prev) => [...prev, notification]);
      return id;
    },
    [generateId]
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'success', title, message, duration }),
    [addNotification]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'error', title, message, duration }),
    [addNotification]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'info', title, message, duration }),
    [addNotification]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) =>
      addNotification({ type: 'warning', title, message, duration }),
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    info,
    warning,
  };
};