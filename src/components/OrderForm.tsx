import { OrderItem, OptimizeParams } from "@/lib/types";
import { useState, useRef } from "react";
import { ShoppingCart, Upload, Play, Plus, Trash2 } from "lucide-react";

interface OrderFormProps {
  value: OrderItem[];
  onChange: (order: OrderItem[]) => void;
  params: OptimizeParams;
  setParams: (params: OptimizeParams) => void;
  onOptimize: () => void;
  loading: boolean;
}

export default function OrderForm({
  value,
  onChange,
  params,
  setParams,
  onOptimize,
  loading,
}: OrderFormProps) {
  const [newSku, setNewSku] = useState("");
  const [newLocationId, setNewLocationId] = useState("");
  const [newQty, setNewQty] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddItem = () => {
    if (!newSku.trim() || !newLocationId.trim()) return;
    onChange([
      ...value,
      { sku: newSku.trim(), locationId: newLocationId.trim(), qty: newQty },
    ]);
    setNewSku("");
    setNewLocationId("");
    setNewQty(1);
  };

  const handleRemoveItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split("\n").filter((l) => l.trim());
        const items: OrderItem[] = [];

        for (let i = 1; i < lines.length; i++) {
          const [sku, locationId, qtyStr] = lines[i]
            .split(",")
            .map((s) => s.trim());
          if (sku && locationId) {
            items.push({ sku, locationId, qty: parseInt(qtyStr) || 1 });
          }
        }

        onChange(items);
      } catch (_error) {
        alert("Invalid CSV file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Order Details
          </h3>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Import CSV"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleImportCsv}
          className="hidden"
        />
      </div>

      {/* Add Item Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
        <input
          type="text"
          value={newSku}
          onChange={(e) => setNewSku(e.target.value)}
          placeholder="SKU"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <input
          type="text"
          value={newLocationId}
          onChange={(e) => setNewLocationId(e.target.value)}
          placeholder="Location"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <input
          type="number"
          value={newQty}
          onChange={(e) => setNewQty(parseInt(e.target.value) || 1)}
          min="1"
          placeholder="Qty"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <button
          onClick={handleAddItem}
          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Order Items List */}
      <div className="mb-4 max-h-48 overflow-y-auto">
        {value.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
            No items added. Add items or import CSV.
          </p>
        ) : (
          <div className="space-y-2">
            {value.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.sku}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">→</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {item.locationId}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500">
                    ×{item.qty || 1}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveItem(idx)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optimization Parameters */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Strategy
          </label>
          <select
            value={params.strategy}
            onChange={(e) =>
              setParams({
                ...params,
                strategy: e.target.value as OptimizeParams["strategy"],
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="nearest">Nearest Neighbor</option>
            <option value="return_to_dock">Return to Dock</option>
            <option value="zone_cluster">Zone Cluster</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Walking Speed (m/s)
            </label>
            <input
              type="number"
              value={params.walkingSpeedMps}
              onChange={(e) =>
                setParams({
                  ...params,
                  walkingSpeedMps: parseFloat(e.target.value),
                })
              }
              step="0.1"
              min="0.5"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pick Time (sec/item)
            </label>
            <input
              type="number"
              value={params.pickSecondsPerItem}
              onChange={(e) =>
                setParams({
                  ...params,
                  pickSecondsPerItem: parseInt(e.target.value),
                })
              }
              min="1"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Optimize Button */}
      <button
        onClick={onOptimize}
        disabled={loading || value.length === 0}
        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 dark:from-purple-500 dark:to-blue-500 dark:hover:from-purple-600 dark:hover:to-blue-600 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Optimizing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Optimize Route
          </>
        )}
      </button>
    </div>
  );
}
