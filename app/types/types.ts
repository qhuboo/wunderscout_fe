import type { paths, components } from "./api";

export interface KdeData {
  x: number[];
  y: number[];
  values: number[][];
}

export interface HistogramData {
  xedges: number[];
  yedges: number[];
  values: number[][];
}

export type GameDataType =
  paths["/games/{gameId}"]["get"]["responses"]["200"]["content"]["application/json"];

export type PlayerDataType =
  paths["/games/{gameId}/players/{playerId}"]["get"]["responses"]["200"]["content"]["application/json"];

export type TeamDataType =
  paths["/games/{gameId}/teams/{teamId}"]["get"]["responses"]["200"]["content"]["application/json"];

export type VisualizationType = components["schemas"]["ArtifactType"] | "logo";

export const VISUALIZATION_TYPES: Record<VisualizationType, true> = {
  logo: true,
  kde: true,
  histogram: true,
};

export type ApiErrorType = components["schemas"]["ApiError"];
