import { OptimizeResult } from "./types";

export async function exportPdf(
  leftResult: OptimizeResult | null,
  rightResult: OptimizeResult | null,
  leftSvg: string,
  rightSvg: string
): Promise<void> {
  // Minimal PDF export using data URLs
  // In production, use jsPDF or similar library
  
  const doc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Warehouse Optimization Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
    h2 { color: #4b5563; margin-top: 30px; }
    .metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .metric-card { border: 1px solid #d1d5db; padding: 15px; border-radius: 8px; }
    .metric-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .metric-value { font-size: 24px; font-weight: bold; color: #111827; }
    .svg-container { margin: 20px 0; border: 1px solid #e5e7eb; }
    .delta { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .delta-positive { color: #059669; }
    .delta-negative { color: #dc2626; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Warehouse Pick Path Optimization Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  
  ${leftResult ? `
  <h2>Strategy A</h2>
  <div class="metrics">
    <div class="metric-card">
      <div class="metric-label">Distance</div>
      <div class="metric-value">${leftResult.distanceMeters.toFixed(1)}m</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Time</div>
      <div class="metric-value">${Math.floor(leftResult.timeSeconds / 60)}m ${Math.floor(leftResult.timeSeconds % 60)}s</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Stops</div>
      <div class="metric-value">${leftResult.stops.length}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Unresolved</div>
      <div class="metric-value">${leftResult.missing.length}</div>
    </div>
  </div>
  <div class="svg-container">${leftSvg}</div>
  ` : ''}
  
  ${rightResult ? `
  <h2>Strategy B</h2>
  <div class="metrics">
    <div class="metric-card">
      <div class="metric-label">Distance</div>
      <div class="metric-value">${rightResult.distanceMeters.toFixed(1)}m</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Time</div>
      <div class="metric-value">${Math.floor(rightResult.timeSeconds / 60)}m ${Math.floor(rightResult.timeSeconds % 60)}s</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Stops</div>
      <div class="metric-value">${rightResult.stops.length}</div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Unresolved</div>
      <div class="metric-value">${rightResult.missing.length}</div>
    </div>
  </div>
  <div class="svg-container">${rightSvg}</div>
  ` : ''}
  
  ${leftResult && rightResult ? `
  <div class="delta">
    <h3>Comparison Delta</h3>
    <p class="${rightResult.distanceMeters < leftResult.distanceMeters ? 'delta-positive' : 'delta-negative'}">
      Distance: ${(rightResult.distanceMeters - leftResult.distanceMeters).toFixed(1)}m
      (${(((leftResult.distanceMeters - rightResult.distanceMeters) / leftResult.distanceMeters) * 100).toFixed(1)}%)
    </p>
    <p class="${rightResult.timeSeconds < leftResult.timeSeconds ? 'delta-positive' : 'delta-negative'}">
      Time: ${(rightResult.timeSeconds - leftResult.timeSeconds).toFixed(0)}s
    </p>
  </div>
  ` : ''}
</body>
</html>
  `.trim();

  const blob = new Blob([doc], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `warehouse-report-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
