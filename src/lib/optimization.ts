import { Coord, OrderItem, WarehouseLayout, OptimizeParams, OptimizeResult } from "@/types";
import { astarPath, buildMultiWaypointPath, manhattan, pathLength } from "./pathfinding";

/**
 * Nearest Neighbor TSP heuristic
 * Greedily select the nearest unvisited location from current position
 */
export function nearestNeighborOrder(
  start: Coord,
  points: { id: string; at: Coord; sku?: string }[]
): { id: string; at: Coord; sku?: string }[] {
  if (points.length === 0) return [];

  const remaining = [...points];
  const ordered: typeof points = [];
  let current = start;

  while (remaining.length > 0) {
    let bestIndex = 0;
    let bestDistance = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = manhattan(current, remaining[i].at);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestIndex = i;
      }
    }

    const [next] = remaining.splice(bestIndex, 1);
    ordered.push(next);
    current = next.at;
  }

  return ordered;
}

/**
 * Calculate total path distance in meters
 */
export function calculateDistance(
  path: Coord[],
  cellSizeMeters: number = 1
): number {
  return pathLength(path) * cellSizeMeters;
}

/**
 * Calculate estimated time for route completion
 */
export function calculateTime(
  distanceMeters: number,
  pickCount: number,
  params: OptimizeParams
): number {
  const walkingSpeed = params.walkingSpeedMps ?? 1.2;
  const pickSeconds = params.pickSecondsPerItem ?? 6;

  const walkingTime = distanceMeters / walkingSpeed;
  const pickingTime = pickCount * pickSeconds;

  return Math.round(walkingTime + pickingTime);
}

/**
 * Calculate route efficiency score (0-100)
 * Based on path straightness and minimal backtracking
 */
export function calculateEfficiency(
  actualPath: Coord[],
  stops: Coord[],
  warehouse: WarehouseLayout
): number {
  if (stops.length === 0) return 100;

  // Calculate theoretical minimum distance (straight line between all stops)
  let theoreticalMin = 0;
  let prev = warehouse.start;
  for (const stop of stops) {
    theoreticalMin += manhattan(prev, stop);
    prev = stop;
  }

  // Calculate actual path distance
  const actualDistance = pathLength(actualPath);

  // Efficiency is ratio of theoretical to actual, capped at 100%
  if (theoreticalMin === 0) return 100;
  const efficiency = (theoreticalMin / actualDistance) * 100;

  return Math.min(100, Math.round(efficiency));
}

/**
 * Main optimization function
 * Integrates pathfinding and heuristics to create optimal route
 */
export async function optimizeRoute(
  warehouse: WarehouseLayout,
  order: OrderItem[],
  params: OptimizeParams
): Promise<OptimizeResult> {
  // Validate and map order items to coordinates
  const validItems: { sku: string; locationId: string; at: Coord }[] = [];
  const missing: OrderItem[] = [];

  for (const item of order) {
    const coord = warehouse.locations[item.locationId];
    if (!coord) {
      missing.push(item);
    } else {
      validItems.push({
        sku: item.sku,
        locationId: item.locationId,
        at: coord,
      });
    }
  }

  // Handle empty order
  if (validItems.length === 0) {
    return {
      path: [warehouse.start],
      stops: [],
      distanceMeters: 0,
      timeSeconds: 0,
      efficiency: 100,
      missing,
      metadata: {
        stopsCount: 0,
        avgDistanceBetweenStops: 0,
        routeComplexity: 0,
      },
    };
  }

  // Apply optimization strategy
  const orderedStops = nearestNeighborOrder(
    warehouse.start,
    validItems.map(v => ({
      id: v.locationId,
      at: v.at,
      sku: v.sku,
    }))
  );

  // Build waypoints array
  const waypoints: Coord[] = [warehouse.start, ...orderedStops.map(s => s.at)];

  // Add return to dock if specified
  if (params.strategy === "return_to_dock") {
    waypoints.push(warehouse.start);
  }

  // Build complete path using A*
  const fullPath = buildMultiWaypointPath(warehouse, waypoints);

  // Calculate metrics
  const cellSize = warehouse.cellSizeMeters ?? 1;
  const distanceMeters = calculateDistance(fullPath, cellSize);
  const timeSeconds = calculateTime(distanceMeters, validItems.length, params);
  const efficiency = calculateEfficiency(
    fullPath,
    orderedStops.map(s => s.at),
    warehouse
  );

  // Calculate metadata
  let totalStopDistance = 0;
  for (let i = 0; i < orderedStops.length; i++) {
    const from = i === 0 ? warehouse.start : orderedStops[i - 1].at;
    const to = orderedStops[i].at;
    totalStopDistance += manhattan(from, to);
  }

  const avgDistanceBetweenStops =
    orderedStops.length > 0
      ? Math.round((totalStopDistance / orderedStops.length) * cellSize)
      : 0;

  // Route complexity: ratio of total cells visited to stops
  const routeComplexity =
    orderedStops.length > 0
      ? Math.round((fullPath.length / orderedStops.length) * 10) / 10
      : 0;

  return {
    path: fullPath,
    stops: orderedStops.map(s => ({
      locationId: s.id,
      at: s.at,
      sku: s.sku,
    })),
    distanceMeters: Math.round(distanceMeters),
    timeSeconds,
    efficiency,
    missing,
    metadata: {
      stopsCount: orderedStops.length,
      avgDistanceBetweenStops,
      routeComplexity,
    },
  };
}

/**
 * Simple 2-opt improvement (optional enhancement)
 * Swaps pairs of edges to reduce path crossing
 */
export function twoOptImprove(
  stops: Coord[],
  warehouse: WarehouseLayout,
  maxIterations: number = 100
): Coord[] {
  if (stops.length < 4) return stops;

  let route = [...stops];
  let improved = true;
  let iteration = 0;

  while (improved && iteration < maxIterations) {
    improved = false;
    iteration++;

    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        // Calculate current distances
        const currentDist =
          manhattan(route[i - 1], route[i]) +
          manhattan(route[j], route[j + 1]);

        // Calculate swapped distances  
        const swappedDist =
          manhattan(route[i - 1], route[j]) +
          manhattan(route[i], route[j + 1]);

        if (swappedDist < currentDist) {
          // Reverse the segment between i and j
          const segment = route.slice(i, j + 1).reverse();
          route = [...route.slice(0, i), ...segment, ...route.slice(j + 1)];
          improved = true;
        }
      }
    }
  }

  return route;
}
