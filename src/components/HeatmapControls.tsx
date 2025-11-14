import { useState } from "react";
import { Warehouse, Coord } from "@/lib/types";
import { Activity, RefreshCw } from "lucide-react";

interface HeatmapControlsProps {
  warehouse: Warehouse;
  onCompute: (cells: Record<string, number>) => void;
}

export default function HeatmapControls({
  warehouse,
  onCompute,
}: HeatmapControlsProps) {
  const [simCount, setSimCount] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);

    // Simulate multiple random picking scenarios
    const frequencies: Record<string, number> = {};
    const locations = Object.values(warehouse.locations);

    for (let i = 0; i < simCount; i++) {
      // Random order size (3-8 items)
      const orderSize = Math.floor(Math.random() * 6) + 3;
      const picks = [];

      for (let j = 0; j < orderSize; j++) {
        picks.push(locations[Math.floor(Math.random() * locations.length)]);
      }

      // Count frequency of each location
      picks.forEach(([r, c]) => {
        const key = `${r},${c}`;
        frequencies[key] = (frequencies[key] || 0) + 1;
      });
    }

    setLoading(false);
    onCompute(frequencies);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Heatmap Analysis
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Simulate random picking scenarios to visualize frequently accessed
        locations
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Simulation Count
          </label>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={simCount}
            onChange={(e) => setSimCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>10</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {simCount}
            </span>
            <span>1000</span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              Generate Heatmap
            </>
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Legend
        </h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Low traffic
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 dark:bg-yellow-600 border border-yellow-400 dark:border-yellow-700 rounded" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Medium traffic
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 dark:bg-red-600 border border-red-600 dark:border-red-700 rounded" />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              High traffic
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-400">
          <strong>Tip:</strong> Use heatmaps to identify high-traffic zones and
          optimize warehouse layout
        </p>
      </div>
    </div>
  );
}
