"use client";

import { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Package,
  Clock,
  BarChart3,
  Download,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("productivity");

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
      { zone: "A", orders: 456, efficiency: 96.2, workers: 8, avgTime: 7.2 },
      { zone: "B", orders: 523, efficiency: 94.8, workers: 12, avgTime: 8.1 },
      { zone: "C", orders: 389, efficiency: 92.5, workers: 6, avgTime: 8.9 },
      { zone: "D", orders: 479, efficiency: 93.7, workers: 4, avgTime: 8.4 },
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
    alert("Exporting analytics data to CSV...");
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? "text-green-600" : "text-red-600";
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? "↗" : "↘";
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
                <div className="p-2 bg-purple-600 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Analytics Dashboard
                  </h1>
                  <p className="text-xs text-slate-500">
                    Performance insights & metrics
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
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
                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {analyticsData.overview.totalOrders.toLocaleString()}
                </p>
                <p
                  className={`text-sm ${getGrowthColor(
                    analyticsData.overview.orderGrowth
                  )}`}
                >
                  {getGrowthIcon(analyticsData.overview.orderGrowth)}{" "}
                  {Math.abs(analyticsData.overview.orderGrowth)}% vs last period
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Avg Processing Time
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {analyticsData.overview.avgProcessingTime} min
                </p>
                <p
                  className={`text-sm ${getGrowthColor(
                    analyticsData.overview.timeImprovement
                  )}`}
                >
                  {getGrowthIcon(analyticsData.overview.timeImprovement)}{" "}
                  {Math.abs(analyticsData.overview.timeImprovement)}% vs last
                  period
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Worker Efficiency
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {analyticsData.overview.workerEfficiency}%
                </p>
                <p
                  className={`text-sm ${getGrowthColor(
                    analyticsData.overview.efficiencyGrowth
                  )}`}
                >
                  {getGrowthIcon(analyticsData.overview.efficiencyGrowth)}{" "}
                  {Math.abs(analyticsData.overview.efficiencyGrowth)}% vs last
                  period
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Cost per Order
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  ${analyticsData.overview.costPerOrder}
                </p>
                <p
                  className={`text-sm ${getGrowthColor(
                    analyticsData.overview.costReduction
                  )}`}
                >
                  {getGrowthIcon(analyticsData.overview.costReduction)}{" "}
                  {Math.abs(analyticsData.overview.costReduction)}% vs last
                  period
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Performance Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Daily Performance Trends
              </h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-slate-300 rounded text-sm"
              >
                <option value="productivity">Orders</option>
                <option value="efficiency">Efficiency</option>
                <option value="time">Avg Time</option>
              </select>
            </div>
            <div className="space-y-4">
              {analyticsData.dailyMetrics.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="w-12 text-sm font-medium text-slate-600">
                    {day.day}
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-100 rounded-full h-2 relative">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
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
          </div>

          {/* Zone Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Zone Performance Comparison
            </h3>
            <div className="space-y-4">
              {analyticsData.zonePerformance.map((zone, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-900">
                      Zone {zone.zone}
                    </h4>
                    <span className="text-sm text-slate-600">
                      {zone.workers} workers
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Orders</p>
                      <p className="font-semibold text-blue-600">
                        {zone.orders}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Efficiency</p>
                      <p className="font-semibold text-green-600">
                        {zone.efficiency}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Avg Time</p>
                      <p className="font-semibold text-amber-600">
                        {zone.avgTime}m
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers & Hourly Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Workers */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Top Performing Workers
            </h3>
            <div className="space-y-4">
              {analyticsData.topWorkers.map((worker, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
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
          </div>

          {/* Hourly Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Hourly Order Distribution
            </h3>
            <div className="space-y-3">
              {analyticsData.hourlyDistribution.map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
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
                    <div className="text-xs text-slate-500">
                      {hour.workers} workers
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
