"use client";

import { useTask } from "../context/TaskContext";
import { type PrioritizedTask } from "../lib/taskPrioritizer";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Target,
  Users,
  MapPin,
  Zap,
  BarChart3,
} from "lucide-react";

export default function PrioritizationDashboard() {
  const { prioritizedTasks, prioritizationInsights, reprioritizeTasks } =
    useTask();

  const urgencyColors: Record<PrioritizedTask["urgencyLevel"], string> = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  const urgencyTextColors: Record<PrioritizedTask["urgencyLevel"], string> = {
    critical: "text-red-700 dark:text-red-300",
    high: "text-orange-700 dark:text-orange-300",
    medium: "text-yellow-700 dark:text-yellow-300",
    low: "text-green-700 dark:text-green-300",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            AI Task Prioritization
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Intelligent task prioritization based on SLA, revenue, and
            operational constraints
          </p>
        </div>
        <button
          onClick={reprioritizeTasks}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center space-x-2"
        >
          <Zap className="h-4 w-4" />
          <span>Re-prioritize</span>
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl p-6 border border-custom">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Critical Tasks
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {prioritizationInsights.criticalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-custom">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Avg Priority Score
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {prioritizationInsights.averagePriorityScore.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-custom">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <MapPin className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Top Bottleneck
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Zone {prioritizationInsights.topBottleneck}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-custom">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Total Prioritized
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {prioritizedTasks.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {prioritizationInsights.recommendedActions.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-custom">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            AI Recommendations
          </h3>
          <div className="space-y-2">
            {prioritizationInsights.recommendedActions.map(
              (action: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-muted rounded-lg"
                >
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {action}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Prioritized Task List */}
      <div className="bg-card rounded-xl border border-custom">
        <div className="p-6 border-b border-custom">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Prioritized Task Queue
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tasks automatically ranked by AI priority algorithm
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {prioritizedTasks.slice(0, 10).map((task: PrioritizedTask) => (
              <div
                key={task.id}
                className="border border-custom rounded-lg p-4 hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        urgencyColors[task.urgencyLevel]
                      }`}
                    />
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {task.id}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Zone {task.location.zone} • ${task.revenue}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Priority: {task.priorityScore.toFixed(3)}
                      </p>
                      <p
                        className={`text-xs ${
                          urgencyTextColors[task.urgencyLevel]
                        }`}
                      >
                        {task.urgencyLevel.toUpperCase()}
                      </p>
                    </div>

                    {task.recommendedWorker && (
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Recommended
                        </p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {task.recommendedWorker.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Priority Factors */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-custom">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        SLA Urgency
                      </p>
                      <p className="text-sm font-medium">
                        {(task.priorityFactors.slaUrgency * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Revenue Impact
                      </p>
                      <p className="text-sm font-medium">
                        {(task.priorityFactors.revenueImpact * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Skill Complexity
                      </p>
                      <p className="text-sm font-medium">
                        {(task.priorityFactors.skillComplexity * 100).toFixed(
                          0
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </div>

                {task.estimatedDelay !== undefined &&
                  task.estimatedDelay > 0 && (
                    <div className="mt-3 pt-3 border-t border-custom">
                      <div className="flex items-center space-x-2 text-amber-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          Estimated delay: {task.estimatedDelay} minutes if not
                          prioritized
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
