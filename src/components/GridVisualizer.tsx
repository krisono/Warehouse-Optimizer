"use client";

import { useState, useRef, useEffect } from "react";
import { WarehouseLayout, OptimizeResult, Coord } from "@/types";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

interface GridVisualizerProps {
  layout: WarehouseLayout;
  result?: OptimizeResult;
  animate?: boolean;
}

export default function GridVisualizer({
  layout,
  result,
  animate = true,
}: GridVisualizerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  const cellSize = 20;
  const padding = 40;
  const width = layout.cols * cellSize + padding * 2;
  const height = layout.rows * cellSize + padding * 2;

  useEffect(() => {
    if (isAnimating && result && animate) {
      const startTime = Date.now();
      const duration = 5000; // 5 seconds for full animation

      const animateFrame = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimationProgress(progress);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateFrame);
        } else {
          setIsAnimating(false);
        }
      };

      animationRef.current = requestAnimationFrame(animateFrame);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isAnimating, result, animate]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setAnimationProgress(0);
    setIsAnimating(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const coordToPixel = (coord: Coord): { x: number; y: number } => {
    return {
      x: padding + coord[1] * cellSize + cellSize / 2,
      y: padding + coord[0] * cellSize + cellSize / 2,
    };
  };

  const getVisiblePath = (): Coord[] => {
    if (!result || !isAnimating || !animate) return result?.path || [];
    const totalPoints = result.path.length;
    const visibleCount = Math.floor(totalPoints * animationProgress);
    return result.path.slice(0, visibleCount);
  };

  const renderGrid = () => {
    const cells = [];
    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        const x = padding + col * cellSize;
        const y = padding + row * cellSize;

        let fillColor = "#ffffff";
        let strokeColor = "#e5e7eb";

        // Check cell type
        const isStart = layout.start[0] === row && layout.start[1] === col;
        const isBlocked = layout.blocked.some(
          (b) => b[0] === row && b[1] === col
        );
        const locationEntry = Object.entries(layout.locations).find(
          ([_, coord]) => coord[0] === row && coord[1] === col
        );

        if (isStart) {
          fillColor = "#10b981";
          strokeColor = "#059669";
        } else if (isBlocked) {
          fillColor = "#374151";
          strokeColor = "#1f2937";
        } else if (locationEntry) {
          fillColor = "#3b82f6";
          strokeColor = "#2563eb";
        }

        cells.push(
          <rect
            key={`${row}-${col}`}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1"
          />
        );

        // Add location labels
        if (locationEntry) {
          cells.push(
            <text
              key={`label-${row}-${col}`}
              x={x + cellSize / 2}
              y={y + cellSize / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="8"
              fill="#ffffff"
              fontWeight="bold"
            >
              •
            </text>
          );
        }

        // Add start marker
        if (isStart) {
          cells.push(
            <text
              key={`start-${row}-${col}`}
              x={x + cellSize / 2}
              y={y + cellSize / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fill="#ffffff"
              fontWeight="bold"
            >
              S
            </text>
          );
        }
      }
    }
    return cells;
  };

  const renderPath = () => {
    if (!result) return null;

    const visiblePath = getVisiblePath();
    if (visiblePath.length < 2) return null;

    const pathData = visiblePath
      .map((coord, idx) => {
        const point = coordToPixel(coord);
        return `${idx === 0 ? "M" : "L"} ${point.x} ${point.y}`;
      })
      .join(" ");

    return (
      <>
        {/* Path line */}
        <path
          d={pathData}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />

        {/* Stop markers */}
        {result.stops.map((stop, idx) => {
          const visibleIndex = visiblePath.findIndex(
            (p) => p[0] === stop.at[0] && p[1] === stop.at[1]
          );
          if (visibleIndex === -1) return null;

          const point = coordToPixel(stop.at);
          return (
            <g key={idx}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="8"
                fill="#ffffff"
                fontWeight="bold"
              >
                {idx + 1}
              </text>
            </g>
          );
        })}

        {/* Current position indicator */}
        {isAnimating && visiblePath.length > 0 && (
          <circle
            cx={coordToPixel(visiblePath[visiblePath.length - 1]).x}
            cy={coordToPixel(visiblePath[visiblePath.length - 1]).y}
            r="8"
            fill="#f59e0b"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              values="8;12;8"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Grid Visualization
        </h2>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {result && animate && (
            <>
              <button
                onClick={() => setIsAnimating(!isAnimating)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title={isAnimating ? "Pause" : "Play"}
              >
                {isAnimating ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => {
                  setAnimationProgress(0);
                  setIsAnimating(true);
                }}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                title="Restart animation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Reset view"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        className="overflow-hidden border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
        style={{ height: "600px", cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${
              pan.y / zoom
            }px)`,
            transformOrigin: "center",
          }}
        >
          {/* Grid */}
          {renderGrid()}

          {/* Path */}
          {renderPath()}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 border-2 border-green-700 rounded"></div>
          <span className="text-gray-900 dark:text-white font-medium">
            Start (S)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded"></div>
          <span className="text-gray-900 dark:text-white font-medium">
            Location (•)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-700 border-2 border-gray-900 rounded"></div>
          <span className="text-gray-900 dark:text-white font-medium">
            Blocked
          </span>
        </div>
        {result && (
          <>
            <div className="flex items-center gap-2">
              <div className="w-6 h-1 bg-yellow-500 rounded"></div>
              <span className="text-gray-900 dark:text-white font-medium">
                Path
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-600 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <span className="text-gray-900 dark:text-white font-medium">
                Stops
              </span>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      {result && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Distance:
              </span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {result.distanceMeters.toFixed(1)}m
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Time:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {Math.floor(result.timeSeconds / 60)}:
                {(result.timeSeconds % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Stops:</span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {result.stops.length}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                Efficiency:
              </span>
              <span className="ml-2 font-bold text-gray-900 dark:text-white">
                {result.efficiency.toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Help text */}
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
        💡 Click and drag to pan • Use zoom controls to adjust view • Play
        button to animate path
      </p>
    </div>
  );
}
