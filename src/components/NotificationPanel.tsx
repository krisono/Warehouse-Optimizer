"use client";

import React, { useState } from "react";
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  Trash2,
} from "lucide-react";
import {
  useNotifications,
  type Notification,
} from "@/context/NotificationContext";

interface NotificationItemProps {
  notification: Notification;
  onClose: (id: string) => void;
  onMarkRead: (id: string) => void;
}

function NotificationItem({
  notification,
  onClose,
  onMarkRead,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-amber-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case "critical":
        return "bg-red-50 dark:bg-red-900/20";
      case "high":
        return "bg-amber-50 dark:bg-amber-900/20";
      default:
        return "bg-white dark:bg-slate-800";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div
      className={`border-l-4 ${getBorderColor()} ${getPriorityColor()} p-4 rounded-r-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-all ${
        !notification.read ? "ring-2 ring-blue-100 dark:ring-blue-900/30" : ""
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4
                className={`text-sm font-medium ${
                  notification.read
                    ? "text-slate-600 dark:text-slate-400"
                    : "text-slate-900 dark:text-slate-100"
                }`}
              >
                {notification.title}
              </h4>
              <p
                className={`text-sm mt-1 ${
                  notification.read
                    ? "text-slate-500 dark:text-slate-500"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {notification.message}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-500">
                  {formatTime(notification.timestamp)}
                </span>
                {notification.priority === "critical" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                    Critical
                  </span>
                )}
                {notification.priority === "high" && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    High Priority
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1 ml-4">
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification.id)}
                  className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Mark as read"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => onClose(notification.id)}
                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {notification.actions && notification.actions.length > 0 && (
            <div className="flex items-center space-x-2 mt-3">
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    action.primary
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    unreadCount,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    getUnreadNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState<"all" | "unread">("all");
  const filteredNotifications =
    filter === "unread" ? getUnreadNotifications() : notifications;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:static lg:inset-auto">
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-25 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-xl border-l border-slate-200 dark:border-slate-700 lg:relative lg:w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter and Actions */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  filter === "all"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                  filter === "unread"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <div className="flex items-center space-x-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="p-2 text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={clearAllNotifications}
                className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                  {filter === "unread"
                    ? "No unread notifications"
                    : "No notifications"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  {filter === "unread"
                    ? "All caught up! Check back later for updates."
                    : "You'll receive notifications here for task assignments, SLA warnings, and system alerts."}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onClose={removeNotification}
                    onMarkRead={markAsRead}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification Bell Icon with Badge
export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        title={`${unreadCount} unread notifications`}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
