"use client";

import { useState, useEffect } from "react";
import { Package, MapPin, Clock, Zap, RotateCcw } from "lucide-react";
import { AppShell, PageHeader, Card, Stat } from "@/components/ui";
import RouteOptimizer, {
  type Route,
  type OptimizationResult,
} from "../../lib/routeOptimizer";

export default function RoutesPage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [metrics, setMetrics] = useState<OptimizationResult["metrics"]>({
    totalDistance: 0,
    averageEfficiency: 0,
    improvementPercentage: 0,
    energySaved: 0,
    timeReduction: 0,
  });
  const [optimizer] = useState(() => {
    const opt = new RouteOptimizer();
    return opt;
  });

  // Initialize with optimized routes on component mount
  useEffect(() => {
    const initializeRoutes = () => {
      const { tasks, workers } = optimizer.generateMockData();
      const result = optimizer.optimizeRoutes(tasks, workers);
      return result;
    };

    const result = initializeRoutes();
    setRoutes(result.routes);
    setMetrics(result.metrics);
  }, [optimizer]);

  const handleOptimizeRoutes = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process with real calculation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setOptimizationProgress(i);
    }

    // Generate new optimized routes
    const { tasks, workers } = optimizer.generateMockData();
    const result = optimizer.optimizeRoutes(tasks, workers);
    setRoutes(result.routes);
    setMetrics(result.metrics);

    setIsOptimizing(false);
  };

  const handleResetRoutes = () => {
    if (
      confirm(
        "Are you sure you want to reset all routes to default configuration?"
      )
    ) {
      // Reset to initial state
      const { tasks, workers } = optimizer.generateMockData();
      const result = optimizer.optimizeRoutes(tasks, workers);
      setRoutes(result.routes);
      setMetrics(result.metrics);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return "text-green-600";
    if (efficiency >= 85) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AppShell>
      <PageHeader
        badge="Simulation"
        title="Route Planner"
        description="Draw your layout, load a pick list, and see how route rules affect walk time."
        actions={
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
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Zap className="h-4 w-4" />
              <span>{isOptimizing ? "Optimizing..." : "Optimize Routes"}</span>
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Optimization Progress */}
        {isOptimizing && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100 dark:text-slate-100">
                Route Optimization in Progress
              </h3>
              <span className="text-sm text-slate-300 dark:text-slate-300">
                {optimizationProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${optimizationProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-300 dark:text-slate-300 mt-2">
              Calculating shortest walking paths and grouping nearby picks for
              optimal routes...
            </p>
          </Card>
        )}

        {/* Two-column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Route Summary & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card
              header={{
                title: "Route Summary",
                description: "Current optimization metrics",
              }}
            >
              <div className="space-y-4">
                <Stat
                  icon={<MapPin className="h-5 w-5" />}
                  label="Total Distance"
                  value={`${metrics.totalDistance}m`}
                  sublabel="Walking distance"
                />
                <Stat
                  icon={<Clock className="h-5 w-5" />}
                  label="Estimated Time"
                  value={`${Math.round(metrics.totalDistance / 50)}min`}
                  sublabel="At avg walking speed"
                />
                <Stat
                  icon={<Package className="h-5 w-5" />}
                  label="Total Stops"
                  value={routes
                    .reduce((sum, route) => sum + route.tasks.length, 0)
                    .toString()}
                  sublabel="Pick locations"
                />
              </div>
            </Card>

            {/* Strategy Info */}
            <Card
              header={{
                title: "Routing Strategy",
                description: "How routes are computed",
              }}
            >
              <div className="space-y-3 text-sm text-slate-600">
                <p>
                  <strong>Shortest-path routing:</strong> Minimizes walking
                  distance between picks
                </p>
                <p>
                  <strong>Zone batching:</strong> Groups nearby items to reduce
                  backtracking
                </p>
                <p>
                  <strong>Return-to-dock:</strong> Routes end at starting
                  position
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column: Warehouse Visualizer & Routes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Warehouse Layout Visualizer */}
            <Card
              header={{
                title: "Warehouse Layout & Routes",
                description: "Simulated 4-zone warehouse with active routes",
              }}
            >
              <div className="grid grid-cols-4 gap-4 h-80 bg-slate-50 rounded-lg p-4">
                {/* Zone A */}
                <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-lg font-bold text-blue-800 mb-2">
                    Zone A
                  </div>
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
                  <div className="text-xs text-emerald-500 mt-2">
                    12 workers
                  </div>
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

              {/* Legend */}
              <div className="mt-4 flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Active worker</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>Pick location</span>
                </div>
              </div>
            </Card>

            {/* Route Steps Example */}
            {routes.length > 0 && (
              <Card
                header={{
                  title: "Route Steps - Example",
                  description: `${routes[0].name || `Route ${routes[0].id}`}`,
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-2 bg-slate-800 dark:bg-slate-800 rounded">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold mt-0.5">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
                        Start at Dock
                      </p>
                      <p className="text-xs text-slate-300 dark:text-slate-300 font-medium">
                        Zone entry point
                      </p>
                    </div>
                  </div>
                  {routes[0].tasks.slice(0, 3).map((task, idx) => (
                    <div
                      key={`task-${idx}`}
                      className="flex items-start gap-3 p-2 bg-slate-800 dark:bg-slate-800 rounded"
                    >
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold mt-0.5">
                        {idx + 2}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
                          Pick item {String(task)}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-400">
                          Aisle {routes[0].zones?.[0] || "A"}-
                          {String(task).padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3 p-2 bg-slate-800 dark:bg-slate-800 rounded">
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold mt-0.5">
                      ✓
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
                        Return to Dock
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-400">
                        Complete and stage order
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Optimization Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <Stat
              icon={<MapPin className="h-6 w-6" />}
              label="Total Distance"
              value={`${metrics.totalDistance}m`}
              sublabel="Walking paths"
            />
          </Card>
          <Card>
            <Stat
              icon={<Zap className="h-6 w-6" />}
              label="Avg Efficiency"
              value={`${metrics.averageEfficiency.toFixed(1)}%`}
              sublabel="Route quality"
            />
          </Card>
          <Card>
            <Stat
              icon={<Package className="h-6 w-6" />}
              label="Total Tasks"
              value={routes
                .reduce((sum, route) => sum + route.tasks.length, 0)
                .toString()}
              sublabel="Pick orders"
            />
          </Card>
          <Card>
            <Stat
              icon={<Zap className="h-6 w-6" />}
              label="Energy Saved"
              value={`${metrics.energySaved}%`}
              sublabel="vs unoptimized"
            />
          </Card>
          <Card>
            <Stat
              icon={<Clock className="h-6 w-6" />}
              label="Time Saved"
              value={`${metrics.timeReduction}%`}
              sublabel="vs baseline"
            />
          </Card>
        </div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {routes.map((route) => (
            <Card
              key={route.id}
              header={{
                title: route.name || `Route ${route.id}`,
                description: `Route ID: ${route.id}`,
                action: (
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      route.status || "pending"
                    )}`}
                  >
                    {(route.status || "pending").charAt(0).toUpperCase() +
                      (route.status || "pending").slice(1)}
                  </span>
                ),
              }}
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-400">
                      Assigned Worker
                    </p>
                    <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
                      {route.worker.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-400">
                      Tasks
                    </p>
                    <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
                      {route.tasks.length} picks
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-400">
                      Estimated Time
                    </p>
                    <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
                      {route.estimatedTime} min
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-400">
                      Distance
                    </p>
                    <p className="text-sm font-medium text-slate-100 dark:text-slate-100">
                      {route.totalDistance}m
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-400">
                      Efficiency
                    </p>
                    <p
                      className={`text-lg font-bold ${getEfficiencyColor(
                        route.efficiency
                      )}`}
                    >
                      {route.efficiency}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Quality Score
                    </p>
                    <p
                      className={`text-lg font-bold ${getEfficiencyColor(
                        route.optimizationScore
                      )}`}
                    >
                      {route.optimizationScore}/100
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Route details feature coming soon!")}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>

                {route.status === "completed" && route.actualTime && (
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Started: {route.startTime || "Not started"}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        Completed: {route.endTime || "In progress"}
                      </span>
                      <span
                        className={`font-medium ${
                          (route.actualTime || 0) <= route.estimatedTime
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        Actual: {route.actualTime || 0} min
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
