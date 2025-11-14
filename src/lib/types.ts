export type Coord = [number, number];

export interface Warehouse {
  name: string;
  rows: number;
  cols: number;
  start: Coord;
  blocked: Coord[];
  locations: Record<string, Coord>;
  meta?: Record<string, string>;
}

export interface OrderItem {
  sku: string;
  locationId: string;
  qty?: number;
}

export interface OptimizeParams {
  strategy: "nearest" | "return_to_dock" | "zone_cluster";
  walkingSpeedMps?: number;
  pickSecondsPerItem?: number;
  distanceModel?: "manhattan" | "euclidean";
}

export interface OptimizeResult {
  path: Coord[];
  stops: { locationId: string; at: Coord }[];
  distanceMeters: number;
  timeSeconds: number;
  missing: OrderItem[];
}

export interface Cluster {
  centroid: Coord;
  members: { id: string; at: Coord }[];
}

export interface HeatmapData {
  cells: Record<string, number>;
  maxFrequency: number;
}
