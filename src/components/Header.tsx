import {
  Package,
  Route,
  BarChart3,
  ListTodo,
  Settings as SettingsIcon,
} from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "./NotificationPanel";

interface HeaderProps {
  currentTime: string;
  mounted: boolean;
}

export function Header({ currentTime, mounted }: HeaderProps) {
  return (
    <nav className="bg-white shadow-lg border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-slate-900">
                  Warehouse Optimizer
                </h1>
                <p className="hidden sm:block text-xs text-slate-500">
                  Smart Route & Task Planning
                </p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                href="/routes"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Route className="h-4 w-4" />
                <span>Route Planner</span>
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Performance</span>
              </Link>
              <Link
                href="/tasks"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <ListTodo className="h-4 w-4" />
                <span>Task Board</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                System Online
              </span>
            </div>
            <NotificationBell />
            {mounted && (
              <div className="text-right hidden md:block">
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  Live Time
                </p>
                <p className="font-mono text-sm font-medium text-slate-900">
                  {currentTime}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
