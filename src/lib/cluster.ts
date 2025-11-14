import { Coord, Cluster } from "./types";
import { manhattan } from "./graph";

export function kmeans(points: { id: string; at: Coord }[], k: number): Cluster[] {
  if (points.length === 0) return [];
  if (points.length <= k) {
    return points.map((p) => ({ centroid: p.at, members: [p] }));
  }

  const cents = points.slice(0, k).map((p) => p.at);
  let changed = true;
  let guard = 0;
  const assigns: number[] = new Array(points.length).fill(0);

  while (changed && guard++ < 10) {
    changed = false;

    // Assignment step
    for (let i = 0; i < points.length; i++) {
      const best = argmin(cents.map((c) => manhattan(points[i].at, c)));
      if (assigns[i] !== best) {
        assigns[i] = best;
        changed = true;
      }
    }

    // Update step
    for (let j = 0; j < k; j++) {
      const mem = points.filter((_, i) => assigns[i] === j).map((p) => p.at);
      if (mem.length > 0) {
        cents[j] = mean(mem);
      }
    }
  }

  return cents.map((c, j) => ({
    centroid: c,
    members: points.filter((_, i) => assigns[i] === j),
  }));
}

function mean(arr: Coord[]): Coord {
  const sum = arr.reduce(
    (acc, [r, c]) => [acc[0] + r, acc[1] + c] as Coord,
    [0, 0] as Coord
  );
  return [Math.round(sum[0] / arr.length), Math.round(sum[1] / arr.length)];
}

function argmin(vals: number[]): number {
  return vals.reduce((bi, v, i, arr) => (v < arr[bi] ? i : bi), 0);
}
