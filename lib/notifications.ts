export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notifyListeners();

    // Auto-remove success notifications after 5 seconds
    if (newNotification.type === 'success') {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, 5000);
    }

    return newNotification.id;
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  getNotifications() {
    return [...this.notifications];
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }
}

export const notificationManager = new NotificationManager();

// Helper functions for common notifications
export const notify = {
  success: (title: string, message: string, action?: Notification['action']) => {
    return notificationManager.addNotification({
      type: 'success',
      title,
      message,
      action,
    });
  },

  error: (title: string, message: string, action?: Notification['action']) => {
    return notificationManager.addNotification({
      type: 'error',
      title,
      message,
      action,
    });
  },

  warning: (title: string, message: string, action?: Notification['action']) => {
    return notificationManager.addNotification({
      type: 'warning',
      title,
      message,
      action,
    });
  },

  info: (title: string, message: string, action?: Notification['action']) => {
    return notificationManager.addNotification({
      type: 'info',
      title,
      message,
      action,
    });
  },
};
