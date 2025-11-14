import { Warehouse, Coord } from "@/lib/types";
import { useState, useRef } from "react";
import { Grid, Plus, Trash2, Upload, Save, Package } from "lucide-react";

interface LayoutEditorProps {
  value: Warehouse;
  onChange: (warehouse: Warehouse) => void;
}

export default function LayoutEditor({ value, onChange }: LayoutEditorProps) {
  const [mode, setMode] = useState<"blocked" | "location" | "start">("blocked");
  const [newLocationId, setNewLocationId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCellClick = (r: number, c: number) => {
    if (mode === "blocked") {
      const isBlocked = value.blocked.some(([br, bc]) => br === r && bc === c);
      const newBlocked = isBlocked
        ? value.blocked.filter(([br, bc]) => !(br === r && bc === c))
        : [...value.blocked, [r, c] as Coord];
      onChange({ ...value, blocked: newBlocked });
    } else if (mode === "start") {
      onChange({ ...value, start: [r, c] });
    } else if (mode === "location" && newLocationId.trim()) {
      onChange({
        ...value,
        locations: { ...value.locations, [newLocationId.trim()]: [r, c] },
      });
      setNewLocationId("");
    }
  };

  const handleRemoveLocation = (id: string) => {
    const { [id]: _, ...rest } = value.locations;
    onChange({ ...value, locations: rest });
  };

  const handleExport = () => {
    const json = JSON.stringify(value, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${value.name.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target?.result as string);
        onChange(imported);
      } catch (error) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  };

  const getCellContent = (r: number, c: number) => {
    if (value.start[0] === r && value.start[1] === c) return "S";
    const location = Object.entries(value.locations).find(
      ([_, [lr, lc]]) => lr === r && lc === c
    );
    if (location) return location[0].substring(0, 3);
    if (value.blocked.some(([br, bc]) => br === r && bc === c)) return "■";
    return "";
  };

  const getCellColor = (r: number, c: number) => {
    if (value.start[0] === r && value.start[1] === c)
      return "bg-green-500 text-white";
    if (Object.values(value.locations).some(([lr, lc]) => lr === r && lc === c))
      return "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700";
    if (value.blocked.some(([br, bc]) => br === r && bc === c))
      return "bg-gray-700 dark:bg-gray-600 text-gray-700 dark:text-gray-600";
    return "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Grid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Layout Editor
          </h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Import"
          >
            <Upload className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Export"
          >
            <Save className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {/* Mode Selector */}
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          onClick={() => setMode("blocked")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            mode === "blocked"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Toggle Blocked
        </button>
        <button
          onClick={() => setMode("start")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            mode === "start"
              ? "bg-green-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Set Start
        </button>
        <button
          onClick={() => setMode("location")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            mode === "location"
              ? "bg-purple-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          Add Location
        </button>
      </div>

      {mode === "location" && (
        <div className="mb-4">
          <input
            type="text"
            value={newLocationId}
            onChange={(e) => setNewLocationId(e.target.value)}
            placeholder="Location ID (e.g., A-101)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Grid */}
      <div className="overflow-x-auto mb-4">
        <div className="inline-block min-w-full">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `repeat(${value.cols}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: value.rows * value.cols }).map((_, idx) => {
              const r = Math.floor(idx / value.cols);
              const c = idx % value.cols;
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 text-xs font-mono border border-gray-300 dark:border-gray-600 rounded transition-colors ${getCellColor(
                    r,
                    c
                  )}`}
                  title={`(${r}, ${c})`}
                >
                  {getCellContent(r, c)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Locations List */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Locations ({Object.keys(value.locations).length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(value.locations).map(([id, [r, c]]) => (
            <div
              key={id}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 text-xs rounded border border-blue-200 dark:border-blue-800"
            >
              <span className="font-medium">{id}</span>
              <span className="text-blue-600 dark:text-blue-400">
                ({r},{c})
              </span>
              <button
                onClick={() => handleRemoveLocation(id)}
                className="ml-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
