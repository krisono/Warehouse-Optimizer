import { OptimizeResult } from "./types";

export function exportPickListTxt(result: OptimizeResult): string {
  const lines: string[] = [];
  lines.push("=".repeat(50));
  lines.push("WAREHOUSE PICK LIST");
  lines.push("=".repeat(50));
  lines.push("");
  lines.push(`Total Stops: ${result.stops.length}`);
  lines.push(`Total Distance: ${result.distanceMeters.toFixed(1)}m`);
  lines.push(`Estimated Time: ${formatTime(result.timeSeconds)}`);
  lines.push("");
  lines.push("PICK SEQUENCE:");
  lines.push("-".repeat(50));
  
  result.stops.forEach((stop, idx) => {
    lines.push(
      `${(idx + 1).toString().padStart(3)}. Location: ${stop.locationId.padEnd(15)} @ [${stop.at[0]}, ${stop.at[1]}]`
    );
  });

  if (result.missing.length > 0) {
    lines.push("");
    lines.push("UNRESOLVED ITEMS:");
    lines.push("-".repeat(50));
    result.missing.forEach((item) => {
      lines.push(`  SKU: ${item.sku} -> Location: ${item.locationId} (NOT FOUND)`);
    });
  }

  lines.push("");
  lines.push("=".repeat(50));
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push("=".repeat(50));

  return lines.join("\n");
}

export function exportPickListCsv(result: OptimizeResult): string {
  const lines: string[] = [];
  lines.push("Stop,LocationID,Row,Col,SKU");

  result.stops.forEach((stop, idx) => {
    lines.push(`${idx + 1},${stop.locationId},${stop.at[0]},${stop.at[1]},""`);
  });

  return lines.join("\n");
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}
