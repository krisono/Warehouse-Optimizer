import { Warehouse, OptimizeResult, HeatmapData, Coord } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface PathVisualizerProps {
  warehouse: Warehouse;
  result: OptimizeResult | null;
  heatmap?: HeatmapData | null;
  animate?: boolean;
}

export default function PathVisualizer({
  warehouse,
  result,
  heatmap,
  animate = false,
}: PathVisualizerProps) {
  const [scale, setScale] = useState(1);
  const [animationProgress, setAnimationProgress] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animate || !result) {
      // When not animating, set progress to 1 using setTimeout to avoid setState in effect
      const timer = setTimeout(() => setAnimationProgress(1), 0);
      return () => clearTimeout(timer);
    }

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    let animationId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      if (progress < 1) {
        animationId = requestAnimationFrame(updateProgress);
      }
    };

    animationId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [result, animate]);

  const cellSize = 40;
  const width = warehouse.cols * cellSize;
  const height = warehouse.rows * cellSize;

  const getHeatmapColor = (r: number, c: number) => {
    if (!heatmap) return null;
    const freq = heatmap.cells[`${r},${c}`] || 0;
    if (freq === 0) return null;
    const intensity = freq / heatmap.maxFrequency;
    if (intensity < 0.3) return "rgba(59, 130, 246, 0.3)"; // blue
    if (intensity < 0.7) return "rgba(234, 179, 8, 0.5)"; // yellow
    return "rgba(239, 68, 68, 0.7)"; // red
  };

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.5));
  const handleReset = () => setScale(1);

  const visiblePathLength = Math.floor(
    result ? result.path.length * animationProgress : 0
  );
  const visiblePath = result ? result.path.slice(0, visiblePathLength) : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Path Visualization
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleZoomIn}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
        <svg
          ref={svgRef}
          width={width * scale}
          height={height * scale}
          viewBox={`0 0 ${width} ${height}`}
          className="mx-auto"
        >
          {/* Grid Background */}
          {Array.from({ length: warehouse.rows }).map((_, r) =>
            Array.from({ length: warehouse.cols }).map((_, c) => {
              const heatColor = getHeatmapColor(r, c);
              const isBlocked = warehouse.blocked.some(
                ([br, bc]) => br === r && bc === c
              );
              const isStart =
                warehouse.start[0] === r && warehouse.start[1] === c;
              const location = Object.entries(warehouse.locations).find(
                ([_, [lr, lc]]) => lr === r && lc === c
              );

              let fill = "white";
              if (heatColor) fill = heatColor;
              else if (isBlocked) fill = "#374151";
              else if (isStart) fill = "#10b981";
              else if (location) fill = "#dbeafe";

              return (
                <g key={`${r}-${c}`}>
                  <rect
                    x={c * cellSize}
                    y={r * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={fill}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  {isStart && (
                    <text
                      x={c * cellSize + cellSize / 2}
                      y={r * cellSize + cellSize / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      S
                    </text>
                  )}
                  {location && (
                    <text
                      x={c * cellSize + cellSize / 2}
                      y={r * cellSize + cellSize / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#1e40af"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {location[0].substring(0, 4)}
                    </text>
                  )}
                </g>
              );
            })
          )}

          {/* Path */}
          {visiblePath.length > 1 && (
            <polyline
              points={visiblePath
                .map(
                  ([r, c]) =>
                    `${c * cellSize + cellSize / 2},${
                      r * cellSize + cellSize / 2
                    }`
                )
                .join(" ")}
              fill="none"
              stroke="#7c3aed"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          )}

          {/* Stops */}
          {result?.stops.map((stop, idx) => {
            if (
              idx >=
              visiblePathLength / (result.path.length / result.stops.length)
            )
              return null;
            const [r, c] = stop.at;
            return (
              <g key={`stop-${idx}`}>
                <circle
                  cx={c * cellSize + cellSize / 2}
                  cy={r * cellSize + cellSize / 2}
                  r="6"
                  fill="#7c3aed"
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={c * cellSize + cellSize / 2}
                  y={r * cellSize - 8}
                  textAnchor="middle"
                  fill="#7c3aed"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {idx + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {animate && result && animationProgress < 1 && (
        <div className="mt-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 dark:bg-purple-500 transition-all duration-100"
              style={{ width: `${animationProgress * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
            {(animationProgress * 100).toFixed(0)}% complete
          </p>
        </div>
      )}
    </div>
  );
}
