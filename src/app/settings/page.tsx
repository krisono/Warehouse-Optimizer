"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Settings,
  Palette,
  Bell,
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";
import { useNotifications } from "@/context/NotificationContext";
import PersistentDataManager from "@/lib/persistentDataManager";

export default function SettingsPage() {
  const router = useRouter();
  const { userPreferences, updateUserPreferences, isLoading } = useSettings();
  const { clearAllNotifications } = useNotifications();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [storageInfo, setStorageInfo] = useState(() => {
    try {
      return PersistentDataManager.getInstance().getStorageInfo();
    } catch {
      return { used: 0, available: 100, percentage: 0 };
    }
  });

  const handleThemeChange = (theme: "light" | "dark" | "auto") => {
    updateUserPreferences({ theme });
  };

  const handleNotificationToggle = (
    key: keyof typeof userPreferences.notifications,
    value: boolean
  ) => {
    updateUserPreferences({
      notifications: {
        ...userPreferences.notifications,
        [key]: value,
      },
    });
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = PersistentDataManager.getInstance().exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `warehouse-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsImporting(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const result = PersistentDataManager.getInstance().importData(data);
        setStorageInfo(PersistentDataManager.getInstance().getStorageInfo());
        alert(result.message);
      } catch (error) {
        console.error("Import failed:", error);
        alert("Import failed. Please check the file format.");
      } finally {
        setIsImporting(false);
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      PersistentDataManager.getInstance().clearAllData();
      setStorageInfo(PersistentDataManager.getInstance().getStorageInfo());
      clearAllNotifications();
      alert("All data cleared successfully!");
    }
  };

  const refreshStorageInfo = () => {
    try {
      setStorageInfo(PersistentDataManager.getInstance().getStorageInfo());
    } catch (error) {
      console.error("Failed to refresh storage info:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            Loading settings...
          </span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["light", "dark", "auto"] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      userPreferences.theme === theme
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="capitalize font-medium">{theme}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {theme === "auto"
                        ? "System"
                        : theme === "light"
                        ? "Always light"
                        : "Always dark"}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
          </div>
          <div className="space-y-4">
            {Object.entries({
              slaWarnings: {
                label: "SLA Warnings",
                desc: "Get notified when tasks are at risk of SLA breach",
              },
              taskAssignments: {
                label: "Task Assignments",
                desc: "Receive notifications about new task assignments",
              },
              systemAlerts: {
                label: "System Alerts",
                desc: "Important system updates and maintenance notices",
              },
              emailEnabled: {
                label: "Email Notifications",
                desc: "Send notifications to your email address",
              },
              pushEnabled: {
                label: "Push Notifications",
                desc: "Browser push notifications (requires permission)",
              },
            }).map(([key, { label, desc }]) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {desc}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      userPreferences.notifications[
                        key as keyof typeof userPreferences.notifications
                      ]
                    }
                    onChange={(e) =>
                      handleNotificationToggle(
                        key as keyof typeof userPreferences.notifications,
                        e.target.checked
                      )
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors ${
                      userPreferences.notifications[
                        key as keyof typeof userPreferences.notifications
                      ]
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        userPreferences.notifications[
                          key as keyof typeof userPreferences.notifications
                        ]
                          ? "translate-x-5"
                          : "translate-x-0"
                      } mt-0.5 ml-0.5`}
                    ></div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Data Management
            </h2>
          </div>

          <div className="space-y-6">
            {/* Storage Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Storage Usage
                </h3>
                <button
                  onClick={refreshStorageInfo}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {storageInfo.used.toLocaleString()} KB used of{" "}
                {storageInfo.available.toLocaleString()} KB available
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export Data"}
              </button>

              <button
                onClick={handleImportData}
                disabled={isImporting}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Upload className="h-4 w-4" />
                {isImporting ? "Importing..." : "Import Data"}
              </button>

              <button
                onClick={handleClearData}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Save className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Auto-refresh Dashboard
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically refresh dashboard data every{" "}
                  {userPreferences.dashboard?.refreshInterval || 30} seconds
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPreferences.dashboard?.autoRefresh !== false}
                  onChange={(e) =>
                    updateUserPreferences({
                      dashboard: {
                        ...userPreferences.dashboard,
                        autoRefresh: e.target.checked,
                      },
                    })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    userPreferences.dashboard?.autoRefresh !== false
                      ? "bg-blue-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      userPreferences.dashboard?.autoRefresh !== false
                        ? "translate-x-5"
                        : "translate-x-0"
                    } mt-0.5 ml-0.5`}
                  ></div>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Compact Mode
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Display more information in less space for better performance
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={userPreferences.dashboard?.compactMode === true}
                  onChange={(e) =>
                    updateUserPreferences({
                      dashboard: {
                        ...userPreferences.dashboard,
                        compactMode: e.target.checked,
                      },
                    })
                  }
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors ${
                    userPreferences.dashboard?.compactMode === true
                      ? "bg-blue-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                      userPreferences.dashboard?.compactMode === true
                        ? "translate-x-5"
                        : "translate-x-0"
                    } mt-0.5 ml-0.5`}
                  ></div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
