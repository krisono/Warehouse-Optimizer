"use client";

import { useState } from "react";
import {
  Package,
  ArrowLeft,
  MapPin,
  Clock,
  Zap,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

export default function RoutesPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  // Mock route data
  const routes = [
    {
      id: "RT-001",
      name: "Electronics Zone Route",
      worker: "John Smith",
      tasks: ["WO-001", "WO-005", "WO-007"],
      estimatedTime: 45,
      actualTime: 42,
      distance: 285,
      efficiency: 96.8,
      status: "completed",
      startTime: "09:15 AM",
      endTime: "10:00 AM",
      zones: ["A", "B"],
      optimizationScore: 95,
    },
    {
      id: "RT-002",
      name: "Appliances & Kitchen Route",
      worker: "Maria Garcia",
      tasks: ["WO-002", "WO-006"],
      estimatedTime: 35,
      actualTime: null,
      distance: 420,
      efficiency: 89.2,
      status: "in-progress",
      startTime: "10:30 AM",
      endTime: null,
      zones: ["B", "C"],
      optimizationScore: 88,
    },
    {
      id: "RT-003",
      name: "Sports & Recreation Route",
      worker: "David Lee",
      tasks: ["WO-003", "WO-008", "WO-010"],
      estimatedTime: 55,
      actualTime: null,
      distance: 520,
      efficiency: 92.1,
      status: "pending",
      startTime: null,
      endTime: null,
      zones: ["C", "D"],
      optimizationScore: 91,
    },
    {
      id: "RT-004",
      name: "Multi-Zone Express Route",
      worker: "Sarah Johnson",
      tasks: ["WO-004", "WO-009"],
      estimatedTime: 28,
      actualTime: 25,
      distance: 180,
      efficiency: 98.5,
      status: "completed",
      startTime: "11:15 AM",
      endTime: "11:40 AM",
      zones: ["A", "D"],
      optimizationScore: 97,
    },
  ];

  const optimizationMetrics = {
    totalDistance: routes.reduce((sum, route) => sum + route.distance, 0),
    averageEfficiency:
      routes.reduce((sum, route) => sum + route.efficiency, 0) / routes.length,
    totalTasks: routes.reduce((sum, route) => sum + route.tasks.length, 0),
    energySaved: 34,
    timeReduction: 22,
  };

  const handleOptimizeRoutes = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setOptimizationProgress(i);
    }

    setIsOptimizing(false);
    alert(
      "Routes optimized successfully! 15% improvement in efficiency achieved."
    );
  };

  const handleResetRoutes = () => {
    if (
      confirm(
        "Are you sure you want to reset all routes to default configuration?"
      )
    ) {
      alert("Routes reset to default configuration.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-green-600";
    if (efficiency >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Route Optimization
                  </h1>
                  <p className="text-xs text-slate-500">
                    AI-powered path planning
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleResetRoutes}
                className="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleOptimizeRoutes}
                disabled={isOptimizing}
                className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Zap className="h-4 w-4" />
                <span>
                  {isOptimizing ? "Optimizing..." : "Optimize Routes"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Optimization Progress */}
        {isOptimizing && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                AI Route Optimization in Progress
              </h3>
              <span className="text-sm text-slate-600">
                {optimizationProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-emerald-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${optimizationProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              Analyzing patterns, calculating optimal paths, and minimizing
              travel time...
            </p>
          </div>
        )}

        {/* Optimization Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Distance
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {optimizationMetrics.totalDistance}m
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Avg Efficiency
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {optimizationMetrics.averageEfficiency.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Zap className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {optimizationMetrics.totalTasks}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Energy Saved
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {optimizationMetrics.energySaved}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Time Saved</p>
                <p className="text-2xl font-bold text-amber-600">
                  {optimizationMetrics.timeReduction}%
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {routes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {route.name}
                  </h3>
                  <p className="text-sm text-slate-600">Route ID: {route.id}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    route.status
                  )}`}
                >
                  {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-500">Assigned Worker</p>
                  <p className="text-sm font-medium text-slate-900">
                    {route.worker}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tasks</p>
                  <p className="text-sm font-medium text-slate-900">
                    {route.tasks.length} tasks
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Estimated Time</p>
                  <p className="text-sm font-medium text-slate-900">
                    {route.estimatedTime} min
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Distance</p>
                  <p className="text-sm font-medium text-slate-900">
                    {route.distance}m
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500">Efficiency</p>
                  <p
                    className={`text-lg font-bold ${getEfficiencyColor(
                      route.efficiency
                    )}`}
                  >
                    {route.efficiency}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Optimization Score</p>
                  <p
                    className={`text-lg font-bold ${getEfficiencyColor(
                      route.optimizationScore
                    )}`}
                  >
                    {route.optimizationScore}/100
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Zones: {route.zones.join(", ")} | Tasks:{" "}
                  {route.tasks.join(", ")}
                </div>
                <button
                  onClick={() => alert('Route details feature coming soon!')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Details
                </button>
              </div>

              {route.status === "completed" && route.actualTime && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">
                      Started: {route.startTime}
                    </span>
                    <span className="text-slate-500">
                      Completed: {route.endTime}
                    </span>
                    <span
                      className={`font-medium ${
                        route.actualTime <= route.estimatedTime
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Actual: {route.actualTime} min
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Route Visualization */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Warehouse Layout & Routes
          </h3>
          <div className="grid grid-cols-4 gap-4 h-96 bg-slate-50 rounded-lg p-4">
            {/* Zone A */}
            <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-blue-800 mb-2">Zone A</div>
              <div className="text-sm text-blue-600">Electronics</div>
              <div className="text-xs text-blue-500 mt-2">8 workers</div>
              <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 animate-pulse"></div>
            </div>

            {/* Zone B */}
            <div className="bg-emerald-100 rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-emerald-800 mb-2">
                Zone B
              </div>
              <div className="text-sm text-emerald-600">Appliances</div>
              <div className="text-xs text-emerald-500 mt-2">12 workers</div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
            </div>

            {/* Zone C */}
            <div className="bg-purple-100 rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-purple-800 mb-2">
                Zone C
              </div>
              <div className="text-sm text-purple-600">Sports</div>
              <div className="text-xs text-purple-500 mt-2">6 workers</div>
              <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 animate-pulse"></div>
            </div>

            {/* Zone D */}
            <div className="bg-amber-100 rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-amber-800 mb-2">
                Zone D
              </div>
              <div className="text-sm text-amber-600">Media</div>
              <div className="text-xs text-amber-500 mt-2">4 workers</div>
              <div className="w-3 h-3 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-600 text-center">
            Interactive route visualization • Click zones to view detailed paths
            • Routes updated in real-time
          </div>
        </div>
      </main>
    </div>
  );
}
