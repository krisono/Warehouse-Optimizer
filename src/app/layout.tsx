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
  title: "Warehouse Optimizer - Algorithm-Powered Warehouse Management",
  description:
    "Optimize warehouse operations with intelligent route planning, real-time analytics, and algorithm-powered task management. Reduce picking time by 40%.",
  keywords: [
    "warehouse optimization",
    "route planning",
    "logistics",
    "algorithms",
    "task management",
    "warehouse management system",
  ],
  authors: [{ name: "Nnaemeka Onochie" }],
  openGraph: {
    title: "Warehouse Optimizer - Algorithm-Powered Warehouse Management",
    description:
      "Reduce picking time by 40% with intelligent route optimization and algorithm-powered task management.",
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
