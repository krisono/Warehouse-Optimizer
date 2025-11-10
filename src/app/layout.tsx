import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { TaskProvider } from "@/context/TaskContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { NotificationProvider } from "@/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Warehouse Optimizer Pro | AI-Powered Operations Dashboard",
  description:
    "Advanced warehouse optimization platform featuring AI-powered route optimization, real-time task management, and intelligent workflow automation for maximum operational efficiency.",
  keywords:
    "warehouse optimization, logistics, AI automation, route optimization, inventory management, warehouse management system",
  authors: [{ name: "Warehouse Optimizer Pro Team" }],
  openGraph: {
    title: "Warehouse Optimizer Pro",
    description: "AI-Powered Warehouse Operations Dashboard",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Warehouse Optimizer Pro",
    description: "AI-Powered Warehouse Operations Dashboard",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationProvider>
          <SettingsProvider>
            <ThemeProvider>
              <TaskProvider>{children}</TaskProvider>
            </ThemeProvider>
          </SettingsProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
