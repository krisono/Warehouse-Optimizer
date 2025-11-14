import type { Metadata } from "next";
import "./globals.css";
import { TaskProvider } from "@/context/TaskContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SettingsProvider } from "@/context/SettingsContext";

export const metadata: Metadata = {
  title: "Warehouse Optimizer - AI-Powered Warehouse Management",
  description:
    "Optimize warehouse operations with intelligent route planning, real-time analytics, and AI-powered task management. Reduce picking time by 40%.",
  keywords: [
    "warehouse optimization",
    "route planning",
    "logistics",
    "AI",
    "task management",
    "warehouse management system",
  ],
  authors: [{ name: "Nnaemeka Onochie" }],
  openGraph: {
    title: "Warehouse Optimizer - AI-Powered Warehouse Management",
    description:
      "Reduce picking time by 40% with intelligent route optimization and AI-powered task management.",
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
      <body className="antialiased">
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
