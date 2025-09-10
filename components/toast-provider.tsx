"use client";

import { useEffect, useState } from "react";
import { Toast, ToastAction, ToastClose, ToastDescription, ToastTitle } from "@/components/ui/toast";
import { notificationManager, Notification } from "@/lib/notifications";

export function ToastProvider() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const handleRemoveNotification = (id: string) => {
    notificationManager.removeNotification(id);
  };

  const handleActionClick = (notification: Notification) => {
    if (notification.action) {
      notification.action.onClick();
    }
    handleRemoveNotification(notification.id);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.slice(0, 3).map((notification) => (
        <Toast
          key={notification.id}
          variant={notification.type === 'default' ? 'default' : notification.type}
          onClose={() => handleRemoveNotification(notification.id)}
        >
          <div className="grid gap-1">
            <ToastTitle>{notification.title}</ToastTitle>
            <ToastDescription>{notification.message}</ToastDescription>
          </div>
          {notification.action && (
            <ToastAction
              onClick={() => handleActionClick(notification)}
            >
              {notification.action.label}
            </ToastAction>
          )}
          <ToastClose />
        </Toast>
      ))}
    </div>
  );
}
