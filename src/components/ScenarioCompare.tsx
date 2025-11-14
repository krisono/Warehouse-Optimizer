import { Warehouse, OptimizeResult } from "@/lib/types";
import { calculateDelta } from "@/lib/metrics";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface ScenarioCompareProps {
  warehouse: Warehouse;
  left: OptimizeResult | null;
  right: OptimizeResult | null;
}

export default function ScenarioCompare({
  warehouse,
  left,
  right,
}: ScenarioCompareProps) {
  if (!left || !right) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Scenario Comparison
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Select two strategies to compare
        </p>
      </div>
    );
  }

  const delta = calculateDelta(left, right);

  const distancePct = delta
    ? (delta.distanceDelta / left.distanceMeters) * 100
    : 0;
  const timePct = delta ? (delta.timeDelta / left.timeSeconds) * 100 : 0;
  const stopsPct = delta
    ? ((right.stops.length - left.stops.length) / left.stops.length) * 100
    : 0;

  const getIcon = (pct: number) => {
    if (pct > 0)
      return (
        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
      );
    if (pct < 0)
      return (
        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
      );
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getColor = (pct: number) => {
    if (pct > 0) return "text-red-600 dark:text-red-400";
    if (pct < 0) return "text-green-600 dark:text-green-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Scenario Comparison
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Left Result */}
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Strategy A
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Distance:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {left.distanceMeters.toFixed(1)}m
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Time:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {(left.timeSeconds / 60).toFixed(1)}min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Stops:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {left.stops.length}
              </span>
            </div>
          </div>
        </div>

        {/* Right Result */}
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Strategy B
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Distance:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {right.distanceMeters.toFixed(1)}m
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Time:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {(right.timeSeconds / 60).toFixed(1)}min
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Stops:
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {right.stops.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delta */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Improvement (A vs B)
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            {getIcon(distancePct)}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Distance
              </p>
              <p className={`text-sm font-medium ${getColor(distancePct)}`}>
                {distancePct.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getIcon(timePct)}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
              <p className={`text-sm font-medium ${getColor(timePct)}`}>
                {timePct.toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getIcon(stopsPct)}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Stops</p>
              <p className={`text-sm font-medium ${getColor(stopsPct)}`}>
                {stopsPct.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Comparison */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Path A
          </p>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  (left.distanceMeters /
                    Math.max(left.distanceMeters, right.distanceMeters)) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Path B
          </p>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{
                width: `${Math.min(
                  (right.distanceMeters /
                    Math.max(left.distanceMeters, right.distanceMeters)) *
                    100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
