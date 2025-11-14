import { OptimizeResult } from "@/lib/types";
import {
  exportPickListTxt,
  exportPickListCsv,
  downloadText,
  downloadCsv,
} from "@/lib/export";
import { exportPdf } from "@/lib/pdf";
import {
  Clock,
  MapPin,
  Package,
  AlertTriangle,
  Download,
  FileText,
  Table,
  FileSpreadsheet,
} from "lucide-react";

interface MetricsPanelProps {
  result: OptimizeResult | null;
}

export default function MetricsPanel({ result }: MetricsPanelProps) {
  if (!result) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Metrics
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Run an optimization to see metrics
        </p>
      </div>
    );
  }

  const handleExportTxt = () => {
    const content = exportPickListTxt(result);
    downloadText(content, "pick-list.txt");
  };

  const handleExportCsv = () => {
    const content = exportPickListCsv(result);
    downloadCsv(content, "pick-list.csv");
  };

  const handleExportPdf = async () => {
    // Create simple HTML report
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Pick List Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { color: #1e40af; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #1e40af; color: white; }
  </style>
</head>
<body>
  <h1>Pick List Report</h1>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Distance</td><td>${result.distanceMeters.toFixed(1)}m</td></tr>
    <tr><td>Time</td><td>${(result.timeSeconds / 60).toFixed(1)}min</td></tr>
    <tr><td>Stops</td><td>${result.stops.length}</td></tr>
  </table>
  <h2>Pick Order</h2>
  <ol>
    ${result.stops
      .map((s) => `<li>${s.locationId} at (${s.at[0]}, ${s.at[1]})</li>`)
      .join("")}
  </ol>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pick-list-report.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Metrics
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleExportTxt}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Export as TXT"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportCsv}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Export as CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportPdf}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Export Report"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Distance</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {result.distanceMeters.toFixed(1)}m
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {(result.timeSeconds / 60).toFixed(1)}min
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
            <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Stops</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {result.stops.length}
            </p>
          </div>
        </div>

        {result.missing.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Missing
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {result.missing.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {result.missing.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-400 mb-2">
            Missing Items:
          </p>
          <div className="flex flex-wrap gap-2">
            {result.missing.map((item) => (
              <span
                key={item.sku}
                className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 rounded"
              >
                {item.sku}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
