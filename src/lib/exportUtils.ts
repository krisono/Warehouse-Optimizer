import { OptimizeResult, Coord } from "@/types";

/**
 * Export optimization result as plain text pick list
 */
export function exportToTxt(result: OptimizeResult): string {
  const lines: string[] = [];

  lines.push("=".repeat(50));
  lines.push("WAREHOUSE PICK LIST");
  lines.push("=".repeat(50));
  lines.push("");

  if (result.stops.length === 0) {
    lines.push("No items to pick.");
    return lines.join("\n");
  }

  lines.push(`Total Stops: ${result.stops.length}`);
  lines.push(`Distance: ${result.distanceMeters} meters`);
  lines.push(`Estimated Time: ${formatTime(result.timeSeconds)}`);
  lines.push(`Efficiency: ${result.efficiency}%`);
  lines.push("");
  lines.push("=".repeat(50));
  lines.push("PICK SEQUENCE");
  lines.push("=".repeat(50));
  lines.push("");

  result.stops.forEach((stop, index) => {
    lines.push(`Step ${index + 1}:`);
    lines.push(`  Location: ${stop.locationId}`);
    lines.push(`  Grid Position: Row ${stop.at[0]}, Column ${stop.at[1]}`);
    if (stop.sku) {
      lines.push(`  SKU: ${stop.sku}`);
    }
    lines.push("");
  });

  if (result.missing && result.missing.length > 0) {
    lines.push("=".repeat(50));
    lines.push("UNRESOLVED ITEMS");
    lines.push("=".repeat(50));
    lines.push("");
    result.missing.forEach(item => {
      lines.push(`  SKU: ${item.sku}`);
      lines.push(`  Location: ${item.locationId} (NOT FOUND)`);
      if (item.qty) {
        lines.push(`  Quantity: ${item.qty}`);
      }
      lines.push("");
    });
  }

  lines.push("=".repeat(50));
  lines.push("END OF PICK LIST");
  lines.push("=".repeat(50));

  return lines.join("\n");
}

/**
 * Export optimization result as CSV
 */
export function exportToCsv(result: OptimizeResult): string {
  const rows: string[] = [];

  // Header
  rows.push("Step,Location ID,Row,Column,SKU,Distance from Previous (cells)");

  // Data rows
  let prevCoord: Coord | null = null;

  result.stops.forEach((stop, index) => {
    const distFromPrev = prevCoord
      ? Math.abs(stop.at[0] - prevCoord[0]) + Math.abs(stop.at[1] - prevCoord[1])
      : 0;

    rows.push(
      [
        index + 1,
        escapeCSV(stop.locationId),
        stop.at[0],
        stop.at[1],
        stop.sku ? escapeCSV(stop.sku) : "",
        distFromPrev,
      ].join(",")
    );

    prevCoord = stop.at;
  });

  return rows.join("\n");
}

/**
 * Export optimization result as JSON
 */
export function exportToJson(result: OptimizeResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Export full path coordinates as CSV
 */
export function exportPathToCsv(path: Coord[]): string {
  const rows: string[] = [];

  rows.push("Step,Row,Column");

  path.forEach((coord, index) => {
    rows.push(`${index + 1},${coord[0]},${coord[1]}`);
  });

  return rows.join("\n");
}

/**
 * Download text content as file
 */
export function downloadFile(content: string, filename: string, mimeType: string = "text/plain"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download optimization result as TXT file
 */
export function downloadPickListTxt(result: OptimizeResult): void {
  const content = exportToTxt(result);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(content, `pick-list-${timestamp}.txt`, "text/plain");
}

/**
 * Download optimization result as CSV file
 */
export function downloadPickListCsv(result: OptimizeResult): void {
  const content = exportToCsv(result);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(content, `pick-list-${timestamp}.csv`, "text/csv");
}

/**
 * Download optimization result as JSON file
 */
export function downloadPickListJson(result: OptimizeResult): void {
  const content = exportToJson(result);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(content, `pick-list-${timestamp}.json`, "application/json");
}

/**
 * Download full path as CSV
 */
export function downloadPathCsv(path: Coord[]): void {
  const content = exportPathToCsv(path);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(content, `route-path-${timestamp}.csv`, "text/csv");
}

/**
 * Helper: Escape CSV field if it contains special characters
 */
function escapeCSV(field: string): string {
  if (field.includes(",") || field.includes('"') || field.includes("\n")) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Helper: Format seconds into readable time
 */
function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} seconds`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return remainingSeconds > 0
      ? `${minutes} min ${remainingSeconds} sec`
      : `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours} hr ${remainingMinutes} min`
    : `${hours} hr`;
}

/**
 * Generate summary statistics for export
 */
export function generateSummary(result: OptimizeResult): {
  totalStops: number;
  totalDistance: string;
  estimatedTime: string;
  efficiency: string;
  unresolvedCount: number;
} {
  return {
    totalStops: result.stops.length,
    totalDistance: `${result.distanceMeters}m`,
    estimatedTime: formatTime(result.timeSeconds),
    efficiency: `${result.efficiency}%`,
    unresolvedCount: result.missing?.length ?? 0,
  };
}
