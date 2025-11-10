"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Settings,
  User,
  Bell,
  Database,
  Palette,
  Save,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      companyName: "Warehouse-Optimizer",
      timeZone: "UTC-8 (Pacific)",
      dateFormat: "MM/DD/YYYY",
      language: "English",
      refreshInterval: 30,
    },
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      taskAssignments: true,
      systemMaintenance: false,
      performanceReports: true,
      criticalAlerts: true,
    },
    users: {
      maxUsers: 50,
      sessionTimeout: 120,
      passwordPolicy: "strong",
      twoFactorAuth: true,
      ssoEnabled: false,
    },
    system: {
      autoBackup: true,
      backupFrequency: "daily",
      dataRetention: 365,
      performanceMode: "balanced",
      debugMode: false,
      maintenanceWindow: "02:00-04:00",
    },
    appearance: {
      theme: "light",
      primaryColor: "blue",
      compactMode: false,
      animations: true,
      highContrast: false,
    },
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    if (
      confirm("Are you sure you want to reset all settings to default values?")
    ) {
      alert("Settings reset to defaults.");
    }
  };

  const updateSetting = (category: string, key: string, value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "users", label: "User Management", icon: User },
    { id: "system", label: "System", icon: Database },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-600 rounded-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    System Settings
                  </h1>
                  <p className="text-xs text-slate-500">
                    Configure application preferences
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              {/* General Settings */}
              {activeTab === "general" && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    General Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.companyName}
                        onChange={(e) =>
                          updateSetting(
                            "general",
                            "companyName",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Time Zone
                        </label>
                        <select
                          value={settings.general.timeZone}
                          onChange={(e) =>
                            updateSetting("general", "timeZone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="UTC-8 (Pacific)">
                            UTC-8 (Pacific)
                          </option>
                          <option value="UTC-5 (Eastern)">
                            UTC-5 (Eastern)
                          </option>
                          <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                          <option value="UTC+1 (CET)">UTC+1 (CET)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Date Format
                        </label>
                        <select
                          value={settings.general.dateFormat}
                          onChange={(e) =>
                            updateSetting(
                              "general",
                              "dateFormat",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Data Refresh Interval (seconds):{" "}
                        {settings.general.refreshInterval}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="300"
                        value={settings.general.refreshInterval}
                        onChange={(e) =>
                          updateSetting(
                            "general",
                            "refreshInterval",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between py-3 border-b border-slate-200"
                        >
                          <div>
                            <p className="font-medium text-slate-900 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </p>
                            <p className="text-sm text-slate-600">
                              {key === "emailAlerts" &&
                                "Receive email notifications for important events"}
                              {key === "pushNotifications" &&
                                "Get browser push notifications in real-time"}
                              {key === "taskAssignments" &&
                                "Notifications when tasks are assigned to workers"}
                              {key === "systemMaintenance" &&
                                "Alerts about scheduled system maintenance"}
                              {key === "performanceReports" &&
                                "Weekly performance and analytics reports"}
                              {key === "criticalAlerts" &&
                                "Immediate alerts for critical system issues"}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value as boolean}
                              onChange={(e) =>
                                updateSetting(
                                  "notifications",
                                  key,
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* User Management Settings */}
              {activeTab === "users" && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    User Management
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Maximum Users
                        </label>
                        <input
                          type="number"
                          value={settings.users.maxUsers}
                          onChange={(e) =>
                            updateSetting(
                              "users",
                              "maxUsers",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.users.sessionTimeout}
                          onChange={(e) =>
                            updateSetting(
                              "users",
                              "sessionTimeout",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password Policy
                      </label>
                      <select
                        value={settings.users.passwordPolicy}
                        onChange={(e) =>
                          updateSetting(
                            "users",
                            "passwordPolicy",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="basic">Basic (8+ characters)</option>
                        <option value="strong">
                          Strong (8+ chars, numbers, symbols)
                        </option>
                        <option value="enterprise">
                          Enterprise (12+ chars, mixed case, numbers, symbols)
                        </option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-slate-200">
                      <div>
                        <p className="font-medium text-slate-900">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-slate-600">
                          Require 2FA for all user accounts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.users.twoFactorAuth}
                          onChange={(e) =>
                            updateSetting(
                              "users",
                              "twoFactorAuth",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === "system" && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    System Configuration
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-slate-200">
                      <div>
                        <p className="font-medium text-slate-900">
                          Automatic Backup
                        </p>
                        <p className="text-sm text-slate-600">
                          Enable automatic data backups
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.system.autoBackup}
                          onChange={(e) =>
                            updateSetting(
                              "system",
                              "autoBackup",
                              e.target.checked
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Backup Frequency
                        </label>
                        <select
                          value={settings.system.backupFrequency}
                          onChange={(e) =>
                            updateSetting(
                              "system",
                              "backupFrequency",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Data Retention (days)
                        </label>
                        <input
                          type="number"
                          value={settings.system.dataRetention}
                          onChange={(e) =>
                            updateSetting(
                              "system",
                              "dataRetention",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Performance Mode
                      </label>
                      <select
                        value={settings.system.performanceMode}
                        onChange={(e) =>
                          updateSetting(
                            "system",
                            "performanceMode",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="power-saver">Power Saver</option>
                        <option value="balanced">Balanced</option>
                        <option value="high-performance">
                          High Performance
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">
                    Appearance & Theme
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Theme
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {["light", "dark", "auto"].map((theme) => (
                          <button
                            key={theme}
                            onClick={() =>
                              updateSetting("appearance", "theme", theme)
                            }
                            className={`p-3 border rounded-lg text-center capitalize ${
                              settings.appearance.theme === theme
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-slate-300 hover:border-slate-400"
                            }`}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Primary Color
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          "blue",
                          "green",
                          "purple",
                          "red",
                          "orange",
                          "pink",
                        ].map((color) => (
                          <button
                            key={color}
                            onClick={() =>
                              updateSetting("appearance", "primaryColor", color)
                            }
                            className={`w-12 h-12 rounded-lg border-2 ${
                              settings.appearance.primaryColor === color
                                ? "border-slate-900"
                                : "border-slate-300"
                            }`}
                            style={{
                              backgroundColor:
                                color === "blue"
                                  ? "#3b82f6"
                                  : color === "green"
                                  ? "#10b981"
                                  : color === "purple"
                                  ? "#8b5cf6"
                                  : color === "red"
                                  ? "#ef4444"
                                  : color === "orange"
                                  ? "#f97316"
                                  : "#ec4899",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        {
                          key: "compactMode",
                          label: "Compact Mode",
                          desc: "Reduce spacing and padding for more content",
                        },
                        {
                          key: "animations",
                          label: "Animations",
                          desc: "Enable smooth transitions and animations",
                        },
                        {
                          key: "highContrast",
                          label: "High Contrast",
                          desc: "Increase contrast for better accessibility",
                        },
                      ].map((setting) => (
                        <div
                          key={setting.key}
                          className="flex items-center justify-between py-3 border-b border-slate-200"
                        >
                          <div>
                            <p className="font-medium text-slate-900">
                              {setting.label}
                            </p>
                            <p className="text-sm text-slate-600">
                              {setting.desc}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(
                                settings.appearance[setting.key as keyof typeof settings.appearance]
                              )}
                              onChange={(e) =>
                                updateSetting(
                                  "appearance",
                                  setting.key,
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
