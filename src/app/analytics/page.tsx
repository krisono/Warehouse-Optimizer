"use client";

import { useState } from "react";
import {
  TrendingUp,
  Users,
  Package,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react";
import { AppShell, PageHeader, Card, Stat } from "@/components/ui";
import PrioritizationDashboard from "../../components/PrioritizationDashboard";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("productivity");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalOrders: 1847,
      orderGrowth: 12.5,
      avgProcessingTime: 8.4,
      timeImprovement: -15.2,
      workerEfficiency: 94.2,
      efficiencyGrowth: 8.1,
      costPerOrder: 2.84,
      costReduction: -7.3,
    },
    dailyMetrics: [
      { day: "Mon", orders: 245, efficiency: 92, avgTime: 8.2, workers: 28 },
      { day: "Tue", orders: 267, efficiency: 94, avgTime: 8.1, workers: 30 },
      { day: "Wed", orders: 289, efficiency: 96, avgTime: 7.9, workers: 32 },
      { day: "Thu", orders: 312, efficiency: 95, avgTime: 8.0, workers: 31 },
      { day: "Fri", orders: 298, efficiency: 93, avgTime: 8.3, workers: 29 },
      { day: "Sat", orders: 234, efficiency: 91, avgTime: 8.6, workers: 25 },
      { day: "Sun", orders: 202, efficiency: 89, avgTime: 8.8, workers: 22 },
    ],
    zonePerformance: [
      {
        zone: "A",
        name: "Fast Moving Picks",
        orders: 456,
        efficiency: 97.5,
        workers: 12,
        avgTime: 7.2,
      },
      {
        zone: "B",
        name: "Standard Shelving",
        orders: 523,
        efficiency: 94.2,
        workers: 15,
        avgTime: 8.1,
      },
      {
        zone: "C",
        name: "High-Bay Pallets",
        orders: 389,
        efficiency: 91.8,
        workers: 8,
        avgTime: 8.9,
      },
      {
        zone: "R",
        name: "Receiving Room",
        orders: 479,
        efficiency: 89.5,
        workers: 10,
        avgTime: 8.4,
      },
      {
        zone: "F",
        name: "Refrigerated Storage",
        orders: 368,
        efficiency: 93.7,
        workers: 6,
        avgTime: 9.2,
      },
      {
        zone: "P",
        name: "Packing",
        orders: 412,
        efficiency: 96.3,
        workers: 14,
        avgTime: 7.8,
      },
      {
        zone: "S",
        name: "Shipping/Staging",
        orders: 398,
        efficiency: 88.9,
        workers: 11,
        avgTime: 8.7,
      },
    ],
    topWorkers: [
      { name: "Sarah Johnson", orders: 127, efficiency: 98.5, rating: 4.9 },
      { name: "Mike Chen", orders: 119, efficiency: 97.2, rating: 4.8 },
      { name: "Lisa Rodriguez", orders: 115, efficiency: 96.8, rating: 4.7 },
      { name: "David Kim", orders: 108, efficiency: 95.9, rating: 4.6 },
      { name: "Emma Wilson", orders: 104, efficiency: 95.1, rating: 4.5 },
    ],
    hourlyDistribution: [
      { hour: "6AM", orders: 12, workers: 8 },
      { hour: "7AM", orders: 28, workers: 15 },
      { hour: "8AM", orders: 45, workers: 22 },
      { hour: "9AM", orders: 67, workers: 28 },
      { hour: "10AM", orders: 89, workers: 32 },
      { hour: "11AM", orders: 94, workers: 35 },
      { hour: "12PM", orders: 103, workers: 38 },
      { hour: "1PM", orders: 98, workers: 36 },
      { hour: "2PM", orders: 87, workers: 34 },
      { hour: "3PM", orders: 76, workers: 30 },
      { hour: "4PM", orders: 65, workers: 28 },
      { hour: "5PM", orders: 54, workers: 24 },
    ],
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const handleExport = () => {
    const headers = [
      "Zone",
      "Name",
      "Orders",
      "Efficiency %",
      "Workers",
      "Avg Time (min)",
    ];
    const rows = analyticsData.zonePerformance.map((z) =>
      [z.zone, z.name, z.orders, z.efficiency, z.workers, z.avgTime].join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `warehouse-analytics-${timeRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? "↗" : "↘";
  };

  return (
    <AppShell>
      <PageHeader
        badge="Demo Data"
        title="Performance Dashboard"
        description="Explore simulated throughput, time per order, and zone-level performance."
        actions={
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 dark:hover:border-slate-500 transition-colors cursor-pointer shadow-sm"
            >
              <option value="day" className="font-medium">
                Today
              </option>
              <option value="week" className="font-medium">
                This Week
              </option>
              <option value="month" className="font-medium">
                This Month
              </option>
              <option value="quarter" className="font-medium">
                This Quarter
              </option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("prioritization")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "prioritization"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              Task Prioritization
            </button>
          </nav>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <Stat
                  icon={<Package className="h-6 w-6" />}
                  label="Total Orders"
                  value={analyticsData.overview.totalOrders.toLocaleString()}
                  sublabel={`${getGrowthIcon(
                    analyticsData.overview.orderGrowth,
                  )} ${Math.abs(
                    analyticsData.overview.orderGrowth,
                  )}% vs last period`}
                />
              </Card>
              <Card>
                <Stat
                  icon={<Clock className="h-6 w-6" />}
                  label="Avg Processing Time"
                  value={`${analyticsData.overview.avgProcessingTime} min`}
                  sublabel={`${getGrowthIcon(
                    analyticsData.overview.timeImprovement,
                  )} ${Math.abs(
                    analyticsData.overview.timeImprovement,
                  )}% vs last period`}
                />
              </Card>
              <Card>
                <Stat
                  icon={<Users className="h-6 w-6" />}
                  label="Worker Efficiency"
                  value={`${analyticsData.overview.workerEfficiency}%`}
                  sublabel={`${getGrowthIcon(
                    analyticsData.overview.efficiencyGrowth,
                  )} ${Math.abs(
                    analyticsData.overview.efficiencyGrowth,
                  )}% vs last period`}
                />
              </Card>
              <Card>
                <Stat
                  icon={<TrendingUp className="h-6 w-6" />}
                  label="Cost per Order"
                  value={`$${analyticsData.overview.costPerOrder}`}
                  sublabel={`${getGrowthIcon(
                    analyticsData.overview.costReduction,
                  )} ${Math.abs(
                    analyticsData.overview.costReduction,
                  )}% vs last period`}
                />
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Performance Chart */}
              <Card
                header={{
                  title: "Daily Performance Trends",
                  description: "Order volume and efficiency patterns",
                  action: (
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="px-3 py-1 border border-slate-300 rounded text-sm"
                    >
                      <option value="productivity">Orders</option>
                      <option value="efficiency">Efficiency</option>
                      <option value="time">Avg Time</option>
                    </select>
                  ),
                }}
              >
                <div className="space-y-4">
                  {analyticsData.dailyMetrics.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="w-12 text-sm font-medium text-slate-600">
                        {day.day}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-slate-100 rounded-full h-2 relative">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width:
                                selectedMetric === "productivity"
                                  ? `${(day.orders / 350) * 100}%`
                                  : selectedMetric === "efficiency"
                                    ? `${day.efficiency}%`
                                    : `${(10 - day.avgTime) * 10}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-medium text-slate-900">
                        {selectedMetric === "productivity"
                          ? day.orders
                          : selectedMetric === "efficiency"
                            ? `${day.efficiency}%`
                            : `${day.avgTime}m`}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Zone Performance */}
              <Card
                header={{
                  title: "Zone Performance Comparison",
                  description: "Throughput and efficiency by warehouse zone",
                }}
              >
                <div className="space-y-3">
                  {analyticsData.zonePerformance.map((zone, index) => (
                    <div
                      key={index}
                      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100">
                            Zone {zone.zone}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                            {zone.name}
                          </p>
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                          {zone.workers} workers
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 font-semibold mb-1">
                            Orders
                          </p>
                          <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                            {zone.orders}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 font-semibold mb-1">
                            Efficiency
                          </p>
                          <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                            {zone.efficiency}%
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400 font-semibold mb-1">
                            Avg Time
                          </p>
                          <p className="font-bold text-amber-600 dark:text-amber-400 text-lg">
                            {zone.avgTime}m
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Top Performers & Hourly Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Workers */}
              <Card
                header={{
                  title: "Top Workers This Week",
                  description: "Highest-performing associates by order volume",
                }}
              >
                <div className="space-y-4">
                  {analyticsData.topWorkers.map((worker, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {worker.name}
                          </p>
                          <p className="text-sm text-slate-600">
                            {worker.orders} orders completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {worker.efficiency}%
                        </p>
                        <div className="flex items-center space-x-1">
                          <span className="text-amber-500">★</span>
                          <span className="text-sm text-slate-600">
                            {worker.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Hourly Distribution */}
              <Card
                header={{
                  title: "Hourly Order Distribution",
                  description: "Peak hours and staffing alignment",
                }}
              >
                <div className="space-y-3">
                  {analyticsData.hourlyDistribution.map((hour, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="w-16 text-sm font-medium text-slate-600">
                        {hour.hour}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-slate-100 rounded-full h-2 relative">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${(hour.orders / 103) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-20 text-right">
                        <div className="text-sm font-medium text-slate-900">
                          {hour.orders} orders
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                          {hour.workers} workers
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === "prioritization" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>How tasks are scored:</strong> Tasks are ranked 0–100
              based on SLA risk (deadline proximity), order value (revenue
              impact), and distance from current position. Higher scores
              indicate tasks that should be picked sooner.
            </p>
          </div>
        )}

        {activeTab === "prioritization" && <PrioritizationDashboard />}
      </div>
    </AppShell>
  );
}
