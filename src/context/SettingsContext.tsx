"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import PersistentDataManager, {
  UserPreferences,
  AppSettings,
} from "../lib/persistentDataManager";

interface SettingsContextType {
  userPreferences: UserPreferences;
  appSettings: AppSettings;
  isLoading: boolean;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (jsonData: string) => { success: boolean; message: string };
  getStorageInfo: () => { used: number; available: number; percentage: number };
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [dataManager] = useState(() => PersistentDataManager.getInstance());
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    theme: "auto",
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notifications: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      slaWarnings: true,
      taskAssignments: true,
      systemAlerts: true,
    },
    dashboard: {
      defaultView: "tasks",
      refreshInterval: 30000,
      autoRefresh: true,
      compactMode: false,
    },
    filters: {
      defaultPriority: ["Critical", "High"],
      defaultStatus: ["pending", "assigned", "in-progress"],
      defaultZones: ["A", "B", "C", "D"],
    },
  });

  const [appSettings, setAppSettings] = useState<AppSettings>({
    warehouse: {
      name: "Main Warehouse",
      location: "New York, NY",
      zones: ["A", "B", "C", "D"],
      workingHours: {
        start: "06:00",
        end: "22:00",
        timezone: "America/New_York",
      },
    },
    performance: {
      targetSLA: 15,
      maxTasksPerWorker: 5,
      prioritizationEnabled: true,
      routeOptimizationEnabled: true,
    },
    integrations: {
      wmsConnected: false,
      erpConnected: false,
      syncInterval: 300000,
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Validate and migrate data first
        dataManager.validateAndMigrateData();

        // Load settings
        const loadedPreferences = dataManager.loadUserPreferences();
        const loadedSettings = dataManager.loadAppSettings();

        setUserPreferences(loadedPreferences);
        setAppSettings(loadedSettings);

        // Apply theme preference
        applyTheme(loadedPreferences.theme);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [dataManager]);

  // Apply theme to document
  const applyTheme = (theme: "light" | "dark" | "auto") => {
    const root = document.documentElement;

    if (theme === "auto") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.classList.toggle("dark", isDarkMode);
    } else {
      root.classList.toggle("dark", theme === "dark");
    }
  };

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (userPreferences.theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("auto");

      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [userPreferences.theme]);

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    const updated = {
      ...userPreferences,
      ...preferences,
      // Deep merge nested objects
      notifications: {
        ...userPreferences.notifications,
        ...(preferences.notifications || {}),
      },
      dashboard: {
        ...userPreferences.dashboard,
        ...(preferences.dashboard || {}),
      },
      filters: {
        ...userPreferences.filters,
        ...(preferences.filters || {}),
      },
    };

    setUserPreferences(updated);
    dataManager.saveUserPreferences(updated);

    // Apply theme if it was updated
    if (preferences.theme) {
      applyTheme(preferences.theme);
    }
  };

  const updateAppSettings = (settings: Partial<AppSettings>) => {
    const updated = {
      ...appSettings,
      ...settings,
      // Deep merge nested objects
      warehouse: {
        ...appSettings.warehouse,
        ...(settings.warehouse || {}),
        workingHours: {
          ...appSettings.warehouse.workingHours,
          ...(settings.warehouse?.workingHours || {}),
        },
      },
      performance: {
        ...appSettings.performance,
        ...(settings.performance || {}),
      },
      integrations: {
        ...appSettings.integrations,
        ...(settings.integrations || {}),
      },
    };

    setAppSettings(updated);
    dataManager.saveAppSettings(updated);
  };

  const resetToDefaults = () => {
    // Clear all stored data
    dataManager.clearAllData();

    // Reset to default values
    const defaultPreferences = dataManager.loadUserPreferences();
    const defaultSettings = dataManager.loadAppSettings();

    setUserPreferences(defaultPreferences);
    setAppSettings(defaultSettings);

    applyTheme(defaultPreferences.theme);
  };

  const exportSettings = () => {
    return dataManager.exportData();
  };

  const importSettings = (jsonData: string) => {
    const result = dataManager.importData(jsonData);

    if (result.success) {
      // Reload settings after import
      const loadedPreferences = dataManager.loadUserPreferences();
      const loadedSettings = dataManager.loadAppSettings();

      setUserPreferences(loadedPreferences);
      setAppSettings(loadedSettings);
      applyTheme(loadedPreferences.theme);
    }

    return result;
  };

  const getStorageInfo = () => {
    return dataManager.getStorageInfo();
  };

  return (
    <SettingsContext.Provider
      value={{
        userPreferences,
        appSettings,
        isLoading,
        updateUserPreferences,
        updateAppSettings,
        resetToDefaults,
        exportSettings,
        importSettings,
        getStorageInfo,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
