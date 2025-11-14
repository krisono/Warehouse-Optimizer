"use client";

import { useState } from "react";
import { OrderItem, WarehouseLayout } from "@/types";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  FileText,
  Trash2,
} from "lucide-react";

interface OrderInputProps {
  value: OrderItem[];
  layout: WarehouseLayout;
  onChange: (items: OrderItem[]) => void;
}

export default function OrderInput({
  value,
  layout,
  onChange,
}: OrderInputProps) {
  const [textInput, setTextInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validateItems = (items: OrderItem[]): string[] => {
    const errors: string[] = [];
    const locationIds = Object.keys(layout.locations);

    items.forEach((item, idx) => {
      if (!item.sku || item.sku.trim() === "") {
        errors.push(`Row ${idx + 1}: SKU/Item is required`);
      }
      if (!item.locationId || item.locationId.trim() === "") {
        errors.push(`Row ${idx + 1}: Location is required`);
      } else if (!locationIds.includes(item.locationId)) {
        errors.push(
          `Row ${idx + 1}: Location "${
            item.locationId
          }" not found in warehouse layout`
        );
      }
      if (item.qty && item.qty <= 0) {
        errors.push(`Row ${idx + 1}: Quantity must be greater than 0`);
      }
    });

    return errors;
  };

  const parseCSV = (csv: string): OrderItem[] => {
    const lines = csv.trim().split("\n");
    const items: OrderItem[] = [];

    // Skip header if present
    const startIdx =
      lines[0]?.toLowerCase().includes("item") ||
      lines[0]?.toLowerCase().includes("sku")
        ? 1
        : 0;

    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(",").map((p) => p.trim());
      if (parts.length >= 2) {
        items.push({
          sku: parts[0],
          locationId: parts[1],
          qty: parts[2] ? parseInt(parts[2]) : 1,
          productName: parts[3] || undefined,
        });
      }
    }

    return items;
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;

    const items = parseCSV(textInput);
    const errors = validateItems(items);

    setValidationErrors(errors);
    if (errors.length === 0) {
      onChange(items);
      setTextInput("");
      setUploadStatus("success");
      setTimeout(() => setUploadStatus("idle"), 3000);
    } else {
      setUploadStatus("error");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const items = parseCSV(text);
      const errors = validateItems(items);

      setValidationErrors(errors);
      if (errors.length === 0) {
        onChange(items);
        setUploadStatus("success");
        setTimeout(() => setUploadStatus("idle"), 3000);
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      setValidationErrors(["Failed to read file"]);
      setUploadStatus("error");
    }

    // Reset input
    e.target.value = "";
  };

  const handleManualAdd = () => {
    onChange([...value, { sku: "", locationId: "", qty: 1 }]);
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    val: string | number
  ) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const unresolvedItems = value.filter(
    (item) =>
      item.locationId &&
      !Object.keys(layout.locations).includes(item.locationId)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Order Input
        </h2>
      </div>

      {/* Upload Methods */}
      <div className="space-y-4 mb-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload CSV File
          </label>
          <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer transition-colors bg-gray-50 dark:bg-gray-900">
            <Upload className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose CSV file or drag here
            </span>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Paste CSV Data
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="item,location,quantity&#10;Widget A,A-101,5&#10;Widget B,B-205,3"
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm"
            rows={4}
          />
          <button
            onClick={handleTextSubmit}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Parse & Add Items
          </button>
        </div>

        {/* Status Messages */}
        {uploadStatus === "success" && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              Items loaded successfully!
            </span>
          </div>
        )}

        {uploadStatus === "error" && validationErrors.length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                Validation Errors:
              </span>
            </div>
            <ul className="text-sm text-red-600 dark:text-red-400 space-y-1 ml-7">
              {validationErrors.slice(0, 5).map((error, i) => (
                <li key={i}>• {error}</li>
              ))}
              {validationErrors.length > 5 && (
                <li>• ...and {validationErrors.length - 5} more errors</li>
              )}
            </ul>
          </div>
        )}

        {/* Unresolved Locations Warning */}
        {unresolvedItems.length > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                {unresolvedItems.length} item(s) with unknown locations:
              </span>
            </div>
            <ul className="text-sm text-yellow-600 dark:text-yellow-400 space-y-1 ml-7">
              {unresolvedItems.slice(0, 3).map((item, i) => (
                <li key={i}>
                  • {item.sku} → {item.locationId}
                </li>
              ))}
              {unresolvedItems.length > 3 && (
                <li>• ...and {unresolvedItems.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Manual Entry Table */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order Items ({value.length})
          </h3>
          <button
            onClick={handleManualAdd}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Add Item
          </button>
        </div>

        {value.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No items yet. Upload a CSV or add items manually.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {value.map((item, index) => {
                  const isValid = Object.keys(layout.locations).includes(
                    item.locationId
                  );
                  return (
                    <tr key={index} className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.sku}
                          onChange={(e) =>
                            handleItemChange(index, "sku", e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          placeholder="SKU or item name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.locationId}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "locationId",
                              e.target.value
                            )
                          }
                          className={`w-full px-2 py-1 border rounded text-sm ${
                            isValid || !item.locationId
                              ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                              : "border-red-500 dark:border-red-600 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-400"
                          }`}
                          placeholder="Location ID"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.qty || 1}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "qty",
                              parseInt(e.target.value) || 1
                            )
                          }
                          min="1"
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Format Help */}
      <details className="text-sm text-gray-600 dark:text-gray-400">
        <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          CSV Format Help
        </summary>
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
          <p className="mb-2">Expected format (with or without header):</p>
          <pre className="text-xs font-mono bg-white dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white overflow-x-auto">
            sku,location,quantity,productName SKU-001,A-101,5,Widget A
            SKU-002,B-205,3,Widget B SKU-003,C-310,2,Widget C
          </pre>
        </div>
      </details>
    </div>
  );
}
