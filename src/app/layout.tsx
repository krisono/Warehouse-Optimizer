import type { Metadata } from "next";
import "./globals.css";
import { TaskProvider } from "@/context/TaskContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
          <NotificationProvider>
            <TaskProvider>{children}</TaskProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
