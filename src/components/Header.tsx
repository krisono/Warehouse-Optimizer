import { Package } from "lucide-react";
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
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Warehouse Optimizer
                </h1>
                <p className="text-xs text-slate-500">
                  AI-Powered Operations Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">
                System Online
              </span>
            </div>
            <NotificationBell />
            {mounted && (
              <div className="text-right">
                <p className="text-xs text-slate-500">Live Time</p>
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
