export interface HeatmapData {
  x: number[];
  y: number[];
  values: number[][];
}

export const VISUALIZATION_TYPES = ["logo", "kde", "histogram"] as const;

export type VisualizationType = (typeof VISUALIZATION_TYPES)[number];
