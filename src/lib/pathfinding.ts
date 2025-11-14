import { WarehouseLayout, Coord } from "@/types";

// Direction vectors for 4-way grid movement
const DIRECTIONS: Coord[] = [
  [1, 0],   // Down
  [-1, 0],  // Up
  [0, 1],   // Right
  [0, -1],  // Left
];

/**
 * Convert coordinate to unique string key
 */
const coordToKey = ([r, c]: Coord): string => `${r},${c}`;

/**
 * Parse string key back to coordinate
 */
const keyToCoord = (key: string): Coord => {
  const [r, c] = key.split(',').map(Number);
  return [r, c];
};

/**
 * Check if two coordinates are equal
 */
export const coordsEqual = (a: Coord, b: Coord): boolean => {
  return a[0] === b[0] && a[1] === b[1];
};

/**
 * Manhattan distance heuristic (L1 distance)
 */
export const manhattan = (a: Coord, b: Coord): number => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

/**
 * Euclidean distance (L2 distance) - for display purposes
 */
export const euclidean = (a: Coord, b: Coord): number => {
  const dr = a[0] - b[0];
  const dc = a[1] - b[1];
  return Math.sqrt(dr * dr + dc * dc);
};

/**
 * A* pathfinding algorithm for grid-based warehouse navigation
 * 
 * @param warehouse - Warehouse layout with grid configuration
 * @param start - Starting coordinate
 * @param goal - Target coordinate
 * @returns Array of coordinates representing the optimal path
 */
export function astarPath(
  warehouse: WarehouseLayout,
  start: Coord,
  goal: Coord
): Coord[] {
  // Quick exit if start equals goal
  if (coordsEqual(start, goal)) {
    return [start];
  }

  // Create set of blocked coordinates for O(1) lookup
  const blockedSet = new Set(warehouse.blocked.map(coordToKey));

  // Check if coordinate is within bounds and not blocked
  const isValid = ([r, c]: Coord): boolean => {
    if (r < 0 || c < 0 || r >= warehouse.rows || c >= warehouse.cols) {
      return false;
    }
    return !blockedSet.has(coordToKey([r, c]));
  };

  // Initialize data structures
  const openSet = new Set<string>([coordToKey(start)]);
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[coordToKey(start), 0]]);
  const fScore = new Map<string, number>([
    [coordToKey(start), manhattan(start, goal)]
  ]);

  // Main A* loop
  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current: string | null = null;
    let lowestF = Infinity;

    for (const nodeKey of openSet) {
      const f = fScore.get(nodeKey) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        current = nodeKey;
      }
    }

    if (!current) break;

    // Check if we reached the goal
    const currentCoord = keyToCoord(current);
    if (coordsEqual(currentCoord, goal)) {
      // Reconstruct path
      const path: Coord[] = [currentCoord];
      let backtrack = current;

      while (cameFrom.has(backtrack)) {
        backtrack = cameFrom.get(backtrack)!;
        path.unshift(keyToCoord(backtrack));
      }

      return path;
    }

    openSet.delete(current);

    // Explore neighbors
    for (const [dr, dc] of DIRECTIONS) {
      const neighbor: Coord = [currentCoord[0] + dr, currentCoord[1] + dc];
      const neighborKey = coordToKey(neighbor);

      if (!isValid(neighbor)) continue;

      // Tentative gScore (each step has cost of 1)
      const tentativeG = (gScore.get(current) ?? Infinity) + 1;

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        // This path to neighbor is better than any previous one
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + manhattan(neighbor, goal));

        if (!openSet.has(neighborKey)) {
          openSet.add(neighborKey);
        }
      }
    }
  }

  // No path found - return just the start position
  console.warn(`No path found from ${start} to ${goal}`);
  return [start];
}

/**
 * Build a complete path through multiple waypoints
 * 
 * @param warehouse - Warehouse layout
 * @param waypoints - Ordered list of coordinates to visit
 * @returns Complete path visiting all waypoints in order
 */
export function buildMultiWaypointPath(
  warehouse: WarehouseLayout,
  waypoints: Coord[]
): Coord[] {
  if (waypoints.length === 0) return [];
  if (waypoints.length === 1) return waypoints;

  const fullPath: Coord[] = [];

  for (let i = 0; i < waypoints.length - 1; i++) {
    const segment = astarPath(warehouse, waypoints[i], waypoints[i + 1]);

    if (i === 0) {
      // First segment: include all points
      fullPath.push(...segment);
    } else {
      // Subsequent segments: skip first point to avoid duplication
      fullPath.push(...segment.slice(1));
    }
  }

  return fullPath;
}

/**
 * Calculate path length in grid cells
 */
export function pathLength(path: Coord[]): number {
  if (path.length < 2) return 0;

  let length = 0;
  for (let i = 1; i < path.length; i++) {
    length += manhattan(path[i - 1], path[i]);
  }

  return length;
}

/**
 * Check if a coordinate is blocked in the warehouse
 */
export function isBlocked(warehouse: WarehouseLayout, coord: Coord): boolean {
  return warehouse.blocked.some(b => coordsEqual(b, coord));
}

/**
 * Get all valid neighbors of a coordinate
 */
export function getNeighbors(warehouse: WarehouseLayout, coord: Coord): Coord[] {
  const neighbors: Coord[] = [];
  const blockedSet = new Set(warehouse.blocked.map(coordToKey));

  for (const [dr, dc] of DIRECTIONS) {
    const neighbor: Coord = [coord[0] + dr, coord[1] + dc];
    const [r, c] = neighbor;

    if (r >= 0 && c >= 0 && r < warehouse.rows && c < warehouse.cols) {
      if (!blockedSet.has(coordToKey(neighbor))) {
        neighbors.push(neighbor);
      }
    }
  }

  return neighbors;
}
