"use client";

import { useState, useEffect } from "react";
import {
  Package,
  List,
  MapPin,
  Settings,
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  User,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useTask, Task } from "@/context/TaskContext";
import { AssignTaskModal } from "@/components/AssignTaskModal";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [assignModalTask, setAssignModalTask] = useState<Task | null>(null);
  const { tasks, workers, updateTaskStatus, refreshTasks } = useTask();

  useEffect(() => {
    const initializeComponent = () => {
      setMounted(true);
    };
    
    initializeComponent();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [mounted]);

  // Calculate metrics from real data
  const activeTasks = tasks.filter(t => t.status !== 'completed').length;
  const totalRevenue = tasks.reduce((sum, task) => {
    const revenue = parseFloat(task.revenue.replace('$', '').replace(',', ''));
    return sum + revenue;
  }, 0);
  const avgPickTime = tasks.reduce((sum, task) => sum + task.estimatedTime, 0) / Math.max(tasks.length, 1);
  const completionRate = tasks.filter(t => t.status === 'completed').length / Math.max(tasks.length, 1) * 100;

  const metrics = [
    {
      label: "Active Tasks",
      value: activeTasks.toString(),
      change: "+12% from yesterday",
      icon: BarChart3,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Route Efficiency",
      value: `${Math.min(completionRate + 20, 100).toFixed(1)}%`,
      change: "+3.2% optimized",
      icon: MapPin,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "Avg. Pick Time",
      value: `${avgPickTime.toFixed(1)}m`,
      change: "22% faster",
      icon: Clock,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Total Revenue",
      value: `$${(totalRevenue / 1000).toFixed(1)}k`,
      change: "vs. manual routing",
      icon: Activity,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const zones = [
    {
      zone: "Zone A (Electronics)",
      workers: 8,
      status: "Optimal",
      color: "green",
    },
    {
      zone: "Zone B (Appliances)",
      workers: 12,
      status: "Busy",
      color: "amber",
    },
    { zone: "Zone C (Sports)", workers: 6, status: "Normal", color: "green" },
    { zone: "Zone D (Media)", workers: 4, status: "Idle", color: "slate" },
  ];

  const services = [
    { service: "Route Optimizer", status: "online" },
    { service: "Task Scheduler", status: "online" },
    { service: "Database", status: "online" },
    { service: "API Gateway", status: "warning" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center h-auto sm:h-16 py-4 sm:py-0">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Warehouse-Optimizer
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

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tasks"
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            <List className="h-4 w-4" />
            <span>Task Management</span>
          </Link>
          <Link
            href="/routes"
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            <MapPin className="h-4 w-4" />
            <span>Route Optimization</span>
          </Link>
          <Link
            href="/analytics"
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analytics Dashboard</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            <Settings className="h-4 w-4" />
            <span>System Settings</span>
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-600 truncate">
                    {metric.label}
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                    {metric.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-emerald-500 mr-1 flex-shrink-0" />
                    <span className="text-sm text-emerald-600 font-medium truncate">
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 ${metric.bgColor} rounded-lg flex-shrink-0 ml-4`}
                >
                  <metric.icon
                    className={`h-6 w-6 sm:h-8 sm:w-8 ${metric.iconColor}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Priority Tasks Queue */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  High Priority Queue
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">AI Optimized</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start space-x-4 min-w-0 flex-1">
                        <div
                          className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${
                            task.urgency === "high"
                              ? "bg-red-500"
                              : task.urgency === "medium"
                              ? "bg-amber-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900">
                              {task.id}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                task.priority === "Critical"
                                  ? "bg-red-100 text-red-700"
                                  : task.priority === "High"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-1 truncate">
                            {task.product}
                          </p>
                          <p className="text-xs text-slate-500">
                            {task.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                        <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-6">
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-slate-500">SLA Time</p>
                            <p className="font-medium text-slate-900">
                              {task.sla}
                            </p>
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-slate-500">Revenue</p>
                            <p className="font-medium text-emerald-600">
                              {task.revenue}
                            </p>
                          </div>
                        </div>
                        {task.status === 'pending' ? (
                          <button 
                            onClick={() => setAssignModalTask(task)}
                            className="w-full sm:w-auto px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2"
                          >
                            <User className="h-4 w-4" />
                            <span>Assign</span>
                          </button>
                        ) : task.status === 'assigned' ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="text-left sm:text-right">
                              <p className="text-xs text-slate-500">Assigned to</p>
                              <p className="font-medium text-blue-600 text-sm">
                                {task.assignedWorker}
                              </p>
                            </div>
                            <button 
                              onClick={() => updateTaskStatus(task.id, 'in-progress')}
                              className="px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors"
                            >
                              Start
                            </button>
                          </div>
                        ) : task.status === 'in-progress' ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="text-left sm:text-right">
                              <p className="text-xs text-slate-500">In Progress</p>
                              <p className="font-medium text-blue-600 text-sm">
                                {task.assignedWorker}
                              </p>
                            </div>
                            <button 
                              onClick={() => updateTaskStatus(task.id, 'completed')}
                              className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              <span>Complete</span>
                            </button>
                          </div>
                        ) : (
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-slate-500">Status</p>
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                              Completed
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Status & Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Zone Status</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {zones.map((zone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            zone.color === "green"
                              ? "bg-green-500"
                              : zone.color === "amber"
                              ? "bg-amber-500"
                              : "bg-slate-400"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {zone.zone}
                          </p>
                          <p className="text-xs text-slate-500">
                            {zone.workers} workers
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
                          zone.status === "Optimal"
                            ? "bg-green-100 text-green-700"
                            : zone.status === "Busy"
                            ? "bg-amber-100 text-amber-700"
                            : zone.status === "Normal"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {zone.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">System Health</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm text-slate-700 min-w-0 flex-1 truncate">
                        {service.service}
                      </span>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {service.status === "online" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            service.status === "online"
                              ? "text-green-600"
                              : "text-amber-600"
                          }`}
                        >
                          {service.status === "online" ? "Online" : "Warning"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/tasks">
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center space-x-2 shadow-lg">
              <List className="h-5 w-5" />
              <span>Manage Tasks</span>
            </button>
          </Link>
          <Link href="/routes">
            <button className="px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 shadow-lg">
              <MapPin className="h-5 w-5" />
              <span>Optimize Routes</span>
            </button>
          </Link>
          <button 
            onClick={refreshTasks}
            className="px-6 py-3 bg-slate-600 text-white font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Refresh Data</span>
          </button>
          <Link href="/settings">
            <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 shadow-lg">
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          </Link>
        </div>
      </main>

      {/* Assignment Modal */}
      {assignModalTask && (
        <AssignTaskModal
          task={assignModalTask}
          isOpen={!!assignModalTask}
          onClose={() => setAssignModalTask(null)}
        />
      )}
    </div>
  );
}
