import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TaskProvider } from "@/context/TaskContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SettingsProvider } from "@/context/SettingsContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  title: "Warehouse Optimizer – Smart Route & Task Planning",
  description:
    "Plan warehouse picks, simulate routes, and monitor performance in a single dashboard. Portfolio demo project.",
  keywords: [
    "warehouse optimization",
    "route planning",
    "logistics",
    "task management",
    "warehouse management system",
    "operations dashboard",
  ],
  authors: [{ name: "Nnaemeka Onochie" }],
  openGraph: {
    title: "Warehouse Optimizer – Smart Route & Task Planning",
    description:
      "Reduce picking time with smart routing, task prioritization, and live performance analytics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-muted">
        <ThemeProvider>
          <SettingsProvider>
            <NotificationProvider>
              <TaskProvider>{children}</TaskProvider>
            </NotificationProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
