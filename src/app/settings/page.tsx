"use client";

import { useState } from "react";
import {
  Settings,
  Palette,
  Bell,
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  Info,
} from "lucide-react";
import { AppShell, PageHeader, Card } from "@/components/ui";
import { useSettings } from "@/context/SettingsContext";
import { useNotifications } from "@/context/NotificationContext";
import PersistentDataManager from "@/lib/persistentDataManager";

export default function SettingsPage() {
  const { userPreferences, updateUserPreferences, isLoading } = useSettings();
  const { clearAllNotifications } = useNotifications();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
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
    <AppShell>
      <PageHeader
        title="Settings"
        description="Adjust theme, demo data, and default routing options."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading settings...
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Section Menu */}
          <div className="lg:col-span-1">
            <Card>
              <nav className="space-y-1">
                {[
                  { id: "general", label: "General", icon: Settings },
                  { id: "notifications", label: "Notifications", icon: Bell },
                  { id: "data", label: "Data & Storage", icon: Database },
                  { id: "appearance", label: "Appearance", icon: Palette },
                  { id: "about", label: "About", icon: Info },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    {section.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Right: Section Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* General Settings */}
            {activeSection === "general" && (
              <Card
                header={{
                  title: "General Settings",
                  description:
                    "Default routing strategy and warehouse preferences",
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Default Routing Strategy
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Shortest path</option>
                      <option>Return-to-dock</option>
                      <option>Zone batching</option>
                    </select>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                      Applied to new route optimizations
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Default Warehouse Size
                    </label>
                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>Small (2 zones)</option>
                      <option selected>Medium (4 zones)</option>
                      <option>Large (8 zones)</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications */}
            {activeSection === "notifications" && (
              <Card
                header={{
                  title: "Notification Settings",
                  description: "Control which alerts and updates you receive",
                }}
              >
                <div className="space-y-4">
                  {Object.entries({
                    slaWarnings: {
                      label: "Show Simulation Tips",
                      desc: "Get notified when tasks are at risk of SLA breach",
                    },
                    taskAssignments: {
                      label: "Show Route Success Notifications",
                      desc: "Receive notifications about completed optimizations",
                    },
                    systemAlerts: {
                      label: "System Alerts",
                      desc: "Important system updates and maintenance notices",
                    },
                  }).map(([key, { label, desc }]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {label}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {desc}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            userPreferences.notifications?.[
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
                            userPreferences.notifications?.[
                              key as keyof typeof userPreferences.notifications
                            ]
                              ? "bg-blue-600"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                              userPreferences.notifications?.[
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
              </Card>
            )}

            {/* Data Management */}
            {activeSection === "data" && (
              <Card
                header={{
                  title: "Data & Storage",
                  description: "Manage demo data and browser storage",
                }}
              >
                <div className="space-y-6">
                  {/* Storage Info */}
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900 dark:text-white">
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
                        style={{
                          width: `${Math.min(storageInfo.percentage, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {(storageInfo.used / 1024).toFixed(2)} MB used of{" "}
                      {(storageInfo.available / 1024).toFixed(2)} MB available
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      All data is simulated and stored locally in your browser.
                    </p>
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
                      Reset Demo Data
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Appearance */}
            {activeSection === "appearance" && (
              <Card
                header={{
                  title: "Appearance",
                  description: "Customize the look and feel of the application",
                }}
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
                              : "border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                          }`}
                        >
                          <div className="capitalize font-medium">{theme}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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

                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-white">
                        Auto-refresh Dashboard
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Automatically refresh dashboard data every{" "}
                        {userPreferences.dashboard?.refreshInterval || 30}{" "}
                        seconds
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          userPreferences.dashboard?.autoRefresh !== false
                        }
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
                </div>
              </Card>
            )}

            {/* About */}
            {activeSection === "about" && (
              <Card
                header={{
                  title: "About This Project",
                  description: "Portfolio demo information and credits",
                }}
              >
                <div className="space-y-4 text-slate-600 dark:text-slate-400">
                  <p className="leading-relaxed">
                    This project is a simulation built by{" "}
                    <strong>Nnaemeka Onochie</strong> to explore warehouse
                    routing, task rules, and dashboard design. It demonstrates
                    practical applications of pathfinding, priority scoring, and
                    performance visualization in a logistics context.
                  </p>
                  <p className="leading-relaxed">
                    <strong>
                      No real customer data or live warehouse systems are
                      connected.
                    </strong>{" "}
                    All operations, metrics, and routes are simulated using
                    client-side algorithms. Data is stored locally in your
                    browser.
                  </p>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Portfolio & Contact
                    </h4>
                    <a
                      href="https://nnaemekaonochie.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                      nnaemekaonochie.com →
                    </a>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                      Tech Stack
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                      <li>• Next.js 16 with React 19 and TypeScript</li>
                      <li>• Tailwind CSS 4 for styling</li>
                      <li>• Client-side routing and optimization algorithms</li>
                      <li>• Local browser storage for persistence</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
