"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: {
    label: string;
    action: () => void;
    primary?: boolean;
  }[];
  persistent?: boolean; // If true, notification won't auto-dismiss
  priority?: "low" | "normal" | "high" | "critical";
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  getNotificationsByType: (type: Notification["type"]) => Notification[];
  getUnreadNotifications: () => Notification[];
  showSLAWarning: (
    taskId: string,
    taskName: string,
    timeRemaining: number
  ) => void;
  showTaskAssignment: (
    taskId: string,
    taskName: string,
    workerName: string
  ) => void;
  showSystemAlert: (
    title: string,
    message: string,
    priority?: Notification["priority"]
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("warehouse-notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(
          parsed.map((notif: any) => ({
            ...notif,
            timestamp: new Date(notif.timestamp),
          }))
        );
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "warehouse-notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  // Auto-remove notifications after 5 minutes (unless persistent)
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.filter((notif) => {
          if (notif.persistent) return true;
          const now = new Date();
          const age = now.getTime() - notif.timestamp.getTime();
          return age < 5 * 60 * 1000; // 5 minutes
        })
      );
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const generateId = () =>
    `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addNotification = useCallback(
    (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
      const id = generateId();
      const newNotification: Notification = {
        ...notificationData,
        id,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => {
        // Keep only last 50 notifications to prevent memory issues
        const updated = [newNotification, ...prev].slice(0, 50);
        return updated;
      });

      // Show browser notification if permission is granted
      if ("Notification" in window && Notification.permission === "granted") {
        try {
          const browserNotif = new Notification(notificationData.title, {
            body: notificationData.message,
            icon: "/favicon.ico",
            tag: id,
          });

          // Auto-close browser notification after 5 seconds
          setTimeout(() => {
            browserNotif.close();
          }, 5000);
        } catch (error) {
          console.error("Failed to show browser notification:", error);
        }
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const getNotificationsByType = useCallback(
    (type: Notification["type"]) => {
      return notifications.filter((notif) => notif.type === type);
    },
    [notifications]
  );

  const getUnreadNotifications = useCallback(() => {
    return notifications.filter((notif) => !notif.read);
  }, [notifications]);

  // Specialized notification creators
  const showSLAWarning = useCallback(
    (taskId: string, taskName: string, timeRemaining: number) => {
      addNotification({
        type: "warning",
        title: "SLA Warning",
        message: `Task "${taskName}" has ${timeRemaining} minutes remaining before SLA breach`,
        priority: "high",
        persistent: true,
        actions: [
          {
            label: "View Task",
            action: () => {
              // Navigate to task detail - this would typically use router
              window.location.href = `/tasks?highlight=${taskId}`;
            },
            primary: true,
          },
          {
            label: "Reassign",
            action: () => {
              // Open reassignment modal
              console.log(`Reassigning task ${taskId}`);
            },
          },
        ],
      });
    },
    [addNotification]
  );

  const showTaskAssignment = useCallback(
    (taskId: string, taskName: string, workerName: string) => {
      addNotification({
        type: "info",
        title: "Task Assigned",
        message: `Task "${taskName}" has been assigned to ${workerName}`,
        priority: "normal",
        actions: [
          {
            label: "View Details",
            action: () => {
              window.location.href = `/tasks?highlight=${taskId}`;
            },
          },
        ],
      });
    },
    [addNotification]
  );

  const showSystemAlert = useCallback(
    (
      title: string,
      message: string,
      priority: Notification["priority"] = "normal"
    ) => {
      addNotification({
        type: priority === "critical" ? "error" : "info",
        title,
        message,
        priority,
        persistent: priority === "critical",
      });
    },
    [addNotification]
  );

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        getNotificationsByType,
        getUnreadNotifications,
        showSLAWarning,
        showTaskAssignment,
        showSystemAlert,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

// Hook for requesting notification permission
export function useNotificationPermission() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return permission;
  };

  return { permission, requestPermission };
}
