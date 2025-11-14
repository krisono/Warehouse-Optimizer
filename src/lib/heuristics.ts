import { Coord } from "./types";
import { manhattan } from "./graph";

export interface OrderStop {
  id: string;
  at: Coord;
  sku?: string;
}

export function nearestNeighbor(start: Coord, stops: OrderStop[]): OrderStop[] {
  if (stops.length === 0) return [];

  const ordered: OrderStop[] = [];
  const remaining = [...stops];
  let current = start;

  while (remaining.length > 0) {
    let minDist = Infinity;
    let minIndex = 0;

    for (let i = 0; i < remaining.length; i++) {
      const dist = manhattan(current, remaining[i].at);
      if (dist < minDist) {
        minDist = dist;
        minIndex = i;
      }
    }

    const next = remaining.splice(minIndex, 1)[0];
    ordered.push(next);
    current = next.at;
  }

  return ordered;
}

export function twoOptOrder(order: OrderStop[]): OrderStop[] {
  if (order.length < 4) return order;

  const path = order.slice();
  let improved = true;
  let guard = 0;

  while (improved && guard++ < 5) {
    improved = false;
    for (let i = 1; i < path.length - 2; i++) {
      for (let k = i + 1; k < path.length - 1; k++) {
        const before =
          manhattan(path[i - 1].at, path[i].at) + manhattan(path[k].at, path[k + 1].at);
        const after =
          manhattan(path[i - 1].at, path[k].at) + manhattan(path[i].at, path[k + 1].at);
        
        if (after < before) {
          const mid = path.slice(i, k + 1).reverse();
          path.splice(i, k - i + 1, ...mid);
          improved = true;
        }
      }
    }
  }

  return path;
}
