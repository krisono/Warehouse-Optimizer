"use client";

import { useState } from "react";
import { WarehouseLayout, Coord } from "@/types";
import {
  Grid,
  Plus,
  Trash2,
  Download,
  Upload,
  Settings as SettingsIcon,
} from "lucide-react";

interface LayoutBuilderProps {
  value: WarehouseLayout;
  onChange: (layout: WarehouseLayout) => void;
}

export default function LayoutBuilder({ value, onChange }: LayoutBuilderProps) {
  const [selectedTool, setSelectedTool] = useState<
    "start" | "block" | "location" | "clear"
  >("location");
  const [locationInput, setLocationInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const handleCellClick = (row: number, col: number) => {
    const coord: Coord = [row, col];
    const updated = { ...value };

    switch (selectedTool) {
      case "start":
        updated.start = coord;
        break;

      case "block":
        const blockKey = `${row},${col}`;
        const blockIndex = updated.blocked.findIndex(
          (b) => `${b[0]},${b[1]}` === blockKey
        );
        if (blockIndex >= 0) {
          updated.blocked.splice(blockIndex, 1);
        } else {
          updated.blocked.push(coord);
        }
        break;

      case "location":
        if (locationInput.trim()) {
          updated.locations[locationInput.trim()] = coord;
          setLocationInput("");
        }
        break;

      case "clear":
        // Remove any location at this coord
        const locationKey = Object.keys(updated.locations).find(
          (key) =>
            updated.locations[key][0] === row &&
            updated.locations[key][1] === col
        );
        if (locationKey) {
          delete updated.locations[locationKey];
        }
        // Remove blocked if exists
        const clearBlockIndex = updated.blocked.findIndex(
          (b) => b[0] === row && b[1] === col
        );
        if (clearBlockIndex >= 0) {
          updated.blocked.splice(clearBlockIndex, 1);
        }
        // Clear start if it's here
        if (updated.start[0] === row && updated.start[1] === col) {
          updated.start = [0, 0];
        }
        break;
    }

    onChange(updated);
  };

  const getCellType = (
    row: number,
    col: number
  ): "empty" | "start" | "blocked" | "location" => {
    if (value.start[0] === row && value.start[1] === col) return "start";
    if (value.blocked.some((b) => b[0] === row && b[1] === col))
      return "blocked";
    const hasLocation = Object.values(value.locations).some(
      (l) => l[0] === row && l[1] === col
    );
    if (hasLocation) return "location";
    return "empty";
  };

  const getCellLabel = (row: number, col: number): string | null => {
    const entry = Object.entries(value.locations).find(
      ([_, coord]) => coord[0] === row && coord[1] === col
    );
    return entry ? entry[0] : null;
  };

  const getCellColor = (type: string): string => {
    switch (type) {
      case "start":
        return "bg-green-500 dark:bg-green-600 border-green-700 dark:border-green-500";
      case "blocked":
        return "bg-gray-800 dark:bg-gray-600 border-gray-900 dark:border-gray-700";
      case "location":
        return "bg-blue-500 dark:bg-blue-600 border-blue-700 dark:border-blue-500";
      default:
        return "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700";
    }
  };

  const updateDimensions = (rows: number, cols: number) => {
    onChange({ ...value, rows, cols });
  };

  const loadSample = async (filename: string) => {
    try {
      const response = await fetch(`/samples/${filename}`);
      const data = await response.json();
      onChange(data);
    } catch (error) {
      console.error("Failed to load sample:", error);
      alert("Failed to load sample layout");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Grid className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Layout Builder
          </h2>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
        >
          <SettingsIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Grid Dimensions
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rows
              </label>
              <input
                type="number"
                value={value.rows}
                onChange={(e) =>
                  updateDimensions(parseInt(e.target.value) || 10, value.cols)
                }
                min="5"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Columns
              </label>
              <input
                type="number"
                value={value.cols}
                onChange={(e) =>
                  updateDimensions(value.rows, parseInt(e.target.value) || 15)
                }
                min="5"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Load Sample
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadSample("small-warehouse.json")}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Small (10×15)
            </button>
            <button
              onClick={() => loadSample("grocery-warehouse.json")}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Grocery (20×25)
            </button>
            <button
              onClick={() => loadSample("large-warehouse.json")}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Large (30×40)
            </button>
          </div>
        </div>
      )}

      {/* Tool Selection */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTool("start")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTool === "start"
              ? "bg-green-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Set Start
        </button>
        <button
          onClick={() => setSelectedTool("block")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTool === "block"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Toggle Block
        </button>
        <button
          onClick={() => setSelectedTool("location")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTool === "location"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Add Location
        </button>
        <button
          onClick={() => setSelectedTool("clear")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedTool === "clear"
              ? "bg-red-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Clear Cell
        </button>
      </div>

      {/* Location Input */}
      {selectedTool === "location" && (
        <div className="mb-4">
          <input
            type="text"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            placeholder="Enter location ID (e.g., A-101)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Type a location ID, then click a cell to place it
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="overflow-auto max-h-[600px] border border-gray-300 dark:border-gray-600 rounded-lg">
        <div className="inline-block p-4 bg-gray-50 dark:bg-gray-900">
          {Array.from({ length: value.rows }).map((_, row) => (
            <div key={row} className="flex">
              {Array.from({ length: value.cols }).map((_, col) => {
                const cellType = getCellType(row, col);
                const label = getCellLabel(row, col);
                return (
                  <button
                    key={`${row}-${col}`}
                    onClick={() => handleCellClick(row, col)}
                    className={`w-10 h-10 m-0.5 border-2 rounded transition-all flex items-center justify-center text-xs font-bold ${getCellColor(
                      cellType
                    )}`}
                    title={label || `[${row}, ${col}]`}
                  >
                    {cellType === "start" && (
                      <span className="text-white">S</span>
                    )}
                    {cellType === "location" && (
                      <span className="text-white">•</span>
                    )}
                    {label && <span className="sr-only">{label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 dark:bg-green-600 border-2 border-green-700 dark:border-green-500 rounded"></div>
          <span className="text-gray-900 dark:text-white font-medium">
            Start (S)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 dark:bg-blue-600 border-2 border-blue-700 dark:border-blue-500 rounded"></div>
          <span className="text-gray-900 dark:text-white font-medium">
            Location (•)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-800 dark:bg-gray-600 border-2 border-gray-900 dark:border-gray-700 rounded"></div>
          <span className="text-gray-900 dark:text-white font-medium">
            Blocked
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
          <span className="text-gray-900 dark:text-white font-medium">
            Empty
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Locations:</span>
            <span className="ml-2 font-bold text-gray-900 dark:text-white">
              {Object.keys(value.locations).length}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Blocked:</span>
            <span className="ml-2 font-bold text-gray-900 dark:text-white">
              {value.blocked.length}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Grid:</span>
            <span className="ml-2 font-bold text-gray-900 dark:text-white">
              {value.rows}×{value.cols}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
