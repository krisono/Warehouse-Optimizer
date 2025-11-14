import { OptimizeResult, Coord } from "./types";
import { manhattan, euclidean } from "./graph";

export function calculateMetrics(
  result: OptimizeResult,
  distanceModel: "manhattan" | "euclidean" = "manhattan"
): {
  totalDistance: number;
  avgDistanceBetweenStops: number;
  estimatedTime: string;
  pickCount: number;
} {
  const distFn = distanceModel === "euclidean" ? euclidean : manhattan;
  
  let totalDist = 0;
  for (let i = 1; i < result.path.length; i++) {
    totalDist += distFn(result.path[i - 1], result.path[i]);
  }

  const avgDist = result.stops.length > 0 ? totalDist / result.stops.length : 0;
  
  const minutes = Math.floor(result.timeSeconds / 60);
  const seconds = Math.floor(result.timeSeconds % 60);
  const timeStr = `${minutes}m ${seconds}s`;

  return {
    totalDistance: parseFloat(totalDist.toFixed(1)),
    avgDistanceBetweenStops: parseFloat(avgDist.toFixed(1)),
    estimatedTime: timeStr,
    pickCount: result.stops.length,
  };
}

export function calculateDelta(
  resultA: OptimizeResult | null,
  resultB: OptimizeResult | null
): {
  distanceDelta: number;
  timeDelta: number;
  percentImprovement: number;
} | null {
  if (!resultA || !resultB) return null;

  const distDelta = resultB.distanceMeters - resultA.distanceMeters;
  const timeDelta = resultB.timeSeconds - resultA.timeSeconds;
  const pctImprovement =
    resultA.distanceMeters > 0
      ? ((resultA.distanceMeters - resultB.distanceMeters) / resultA.distanceMeters) * 100
      : 0;

  return {
    distanceDelta: parseFloat(distDelta.toFixed(1)),
    timeDelta: parseFloat(timeDelta.toFixed(1)),
    percentImprovement: parseFloat(pctImprovement.toFixed(1)),
  };
}
