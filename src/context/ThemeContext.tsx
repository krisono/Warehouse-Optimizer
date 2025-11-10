"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  primaryColor: string;
  compactMode: boolean;
  animations: boolean;
  highContrast: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setPrimaryColor: (color: string) => void;
  setCompactMode: (compact: boolean) => void;
  setAnimations: (animations: boolean) => void;
  setHighContrast: (contrast: boolean) => void;
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const defaultTheme = {
  theme: "light" as const,
  primaryColor: "blue",
  compactMode: false,
  animations: true,
  highContrast: false,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<"light" | "dark">(defaultTheme.theme);
  const [primaryColor, setPrimaryColorState] = useState(
    defaultTheme.primaryColor
  );
  const [compactMode, setCompactModeState] = useState(defaultTheme.compactMode);
  const [animations, setAnimationsState] = useState(defaultTheme.animations);
  const [highContrast, setHighContrastState] = useState(
    defaultTheme.highContrast
  );

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("warehouse-theme");
    if (savedTheme) {
      try {
        const parsed = JSON.parse(savedTheme);
        setThemeState(parsed.theme || defaultTheme.theme);
        setPrimaryColorState(parsed.primaryColor || defaultTheme.primaryColor);
        setCompactModeState(parsed.compactMode || defaultTheme.compactMode);
        setAnimationsState(
          parsed.animations !== undefined
            ? parsed.animations
            : defaultTheme.animations
        );
        setHighContrastState(parsed.highContrast || defaultTheme.highContrast);
      } catch (error) {
        console.warn("Failed to parse saved theme settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      theme,
      primaryColor,
      compactMode,
      animations,
      highContrast,
    };
    localStorage.setItem("warehouse-theme", JSON.stringify(settings));

    // Apply theme classes to document
    const html = document.documentElement;

    // Remove existing theme classes
    html.classList.remove("light", "dark");
    html.classList.remove("compact");
    html.classList.remove("no-animations");
    html.classList.remove("high-contrast");
    html.classList.remove(
      "theme-blue",
      "theme-green",
      "theme-purple",
      "theme-orange"
    );

    // Apply new theme classes
    html.classList.add(theme);
    if (compactMode) html.classList.add("compact");
    if (!animations) html.classList.add("no-animations");
    if (highContrast) html.classList.add("high-contrast");
    html.classList.add(`theme-${primaryColor}`);

    // Update CSS custom properties for dynamic theming
    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#f1f5f9");
      root.style.setProperty("--card-bg", "#1a1a1a");
      root.style.setProperty("--border-color", "#334155");
      root.style.setProperty("--muted-bg", "#0f172a");
      root.style.setProperty("--secondary", "#64748b");
      root.style.setProperty("--secondary-hover", "#94a3b8");
    } else {
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--foreground", "#0f172a");
      root.style.setProperty("--card-bg", "#ffffff");
      root.style.setProperty("--border-color", "#e2e8f0");
      root.style.setProperty("--muted-bg", "#f8fafc");
      root.style.setProperty("--secondary", "#64748b");
      root.style.setProperty("--secondary-hover", "#475569");
    }

    // Set accent colors
    root.style.setProperty("--accent", "#8b5cf6");
    root.style.setProperty("--accent-hover", "#7c3aed");

    // Set primary color variables
    const colorMap = {
      blue: {
        primary: "#2563eb",
        primaryHover: "#1d4ed8",
        primaryDark: "#1e40af",
        primaryLight: "#dbeafe",
      },
      green: {
        primary: "#059669",
        primaryHover: "#047857",
        primaryDark: "#065f46",
        primaryLight: "#d1fae5",
      },
      purple: {
        primary: "#7c3aed",
        primaryHover: "#6d28d9",
        primaryDark: "#5b21b6",
        primaryLight: "#e9d5ff",
      },
      orange: {
        primary: "#ea580c",
        primaryHover: "#c2410c",
        primaryDark: "#9a3412",
        primaryLight: "#fed7aa",
      },
    };

    const colors =
      colorMap[primaryColor as keyof typeof colorMap] || colorMap.blue;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-hover", colors.primaryHover);
    root.style.setProperty("--primary-dark", colors.primaryDark);
    root.style.setProperty("--primary-light", colors.primaryLight);
  }, [theme, primaryColor, compactMode, animations, highContrast]);

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
  };

  const setCompactMode = (compact: boolean) => {
    setCompactModeState(compact);
  };

  const setAnimations = (anim: boolean) => {
    setAnimationsState(anim);
  };

  const setHighContrast = (contrast: boolean) => {
    setHighContrastState(contrast);
  };

  const resetToDefaults = () => {
    setThemeState(defaultTheme.theme);
    setPrimaryColorState(defaultTheme.primaryColor);
    setCompactModeState(defaultTheme.compactMode);
    setAnimationsState(defaultTheme.animations);
    setHighContrastState(defaultTheme.highContrast);
  };

  return (
    <ThemeContext.Provider
      value={{
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
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
