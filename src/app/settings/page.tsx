"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Settings,
  Palette,
  Save,
  RefreshCw,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const { 
    theme, 
    primaryColor, 
    compactMode, 
    animations, 
    highContrast, 
    setTheme, 
    setPrimaryColor, 
    setCompactMode, 
    setAnimations, 
    setHighContrast,
    resetToDefaults 
  } = useTheme();

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    alert("Settings saved successfully! Your preferences are now active.");
  };

  const colorOptions = [
    { name: "Blue", value: "blue" },
    { name: "Green", value: "green" },
    { name: "Purple", value: "purple" },
    { name: "Orange", value: "orange" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-card border-b border-custom shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              System Settings
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-xl shadow-sm border border-custom">
          <div className="p-6 border-b border-custom">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Appearance & Theme Settings
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Customize the look and feel of your warehouse optimization dashboard
            </p>
          </div>
          
          <div className="p-6 space-y-8">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Theme Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center space-x-3 p-4 border rounded-lg transition-all ${
                    theme === 'light' 
                      ? 'border-primary bg-primary-light text-primary' 
                      : 'border-custom hover:border-slate-300'
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="font-medium">Light Mode</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center space-x-3 p-4 border rounded-lg transition-all ${
                    theme === 'dark' 
                      ? 'border-primary bg-primary-light text-primary' 
                      : 'border-custom hover:border-slate-300'
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="font-medium">Dark Mode</span>
                </button>
              </div>
            </div>

            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Primary Color Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setPrimaryColor(color.value)}
                    className={`flex items-center justify-center p-4 border rounded-lg transition-all ${
                      primaryColor === color.value
                        ? 'border-primary bg-primary-light'
                        : 'border-custom hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full mr-2 ${
                      color.value === 'blue' ? 'bg-blue-500' :
                      color.value === 'green' ? 'bg-green-500' :
                      color.value === 'purple' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}></div>
                    <span className="font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Display Preferences
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Compact Mode</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Reduce spacing and font sizes for denser information display</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compactMode}
                      onChange={(e) => setCompactMode(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Enable Animations</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Show smooth transitions and hover effects throughout the interface</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={animations}
                      onChange={(e) => setAnimations(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">High Contrast Mode</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Enhance visibility with high contrast colors for better accessibility</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Reset Section */}
            <div className="pt-6 border-t border-custom">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Reset Appearance</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Restore all appearance settings to their default values</p>
                </div>
                <button
                  onClick={resetToDefaults}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}