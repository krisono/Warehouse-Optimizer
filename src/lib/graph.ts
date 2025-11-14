    import { Coord } from "./types";

export function manhattan(a: Coord, b: Coord): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function euclidean(a: Coord, b: Coord): number {
  return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

export function coordKey(coord: Coord): string {
  return `${coord[0]},${coord[1]}`;
}

export function parseCoordKey(key: string): Coord {
  const [r, c] = key.split(',').map(Number);
  return [r, c];
}

interface PathNode {
  coord: Coord;
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}

export function astar(
  start: Coord,
  goal: Coord,
  rows: number,
  cols: number,
  blocked: Set<string>
): Coord[] {
  const startKey = coordKey(start);
  const goalKey = coordKey(goal);

  if (startKey === goalKey) return [start];

  const open: PathNode[] = [
    { coord: start, g: 0, h: manhattan(start, goal), f: manhattan(start, goal), parent: null },
  ];
  const closed = new Set<string>();
  const gScores = new Map<string, number>([[startKey, 0]]);

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const currentKey = coordKey(current.coord);

    if (currentKey === goalKey) {
      return reconstructPath(current);
    }

    closed.add(currentKey);

    for (const neighbor of getNeighbors(current.coord, rows, cols, blocked)) {
      const neighborKey = coordKey(neighbor);
      if (closed.has(neighborKey)) continue;

      const tentativeG = current.g + 1;

      const existingG = gScores.get(neighborKey);
      if (existingG !== undefined && tentativeG >= existingG) continue;

      gScores.set(neighborKey, tentativeG);
      const h = manhattan(neighbor, goal);
      const f = tentativeG + h;

      const existingIndex = open.findIndex((n) => coordKey(n.coord) === neighborKey);
      if (existingIndex >= 0) {
        open[existingIndex] = { coord: neighbor, g: tentativeG, h, f, parent: current };
      } else {
        open.push({ coord: neighbor, g: tentativeG, h, f, parent: current });
      }
    }
  }

  return [start];
}

function getNeighbors(coord: Coord, rows: number, cols: number, blocked: Set<string>): Coord[] {
  const [r, c] = coord;
  const candidates: Coord[] = [
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1],
  ];

  return candidates.filter(([nr, nc]) => {
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return false;
    if (blocked.has(coordKey([nr, nc]))) return false;
    return true;
  });
}

function reconstructPath(node: PathNode): Coord[] {
  const path: Coord[] = [];
  let current: PathNode | null = node;
  while (current !== null) {
    path.unshift(current.coord);
    current = current.parent;
  }
  return path;
}

export class PathCache {
  private cache = new Map<string, Coord[]>();

  getCacheKey(from: Coord, to: Coord): string {
    return `${coordKey(from)}->${coordKey(to)}`;
  }

  get(from: Coord, to: Coord): Coord[] | undefined {
    return this.cache.get(this.getCacheKey(from, to));
  }

  set(from: Coord, to: Coord, path: Coord[]): void {
    this.cache.set(this.getCacheKey(from, to), path);
  }

  clear(): void {
    this.cache.clear();
  }
}
