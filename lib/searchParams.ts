import { redirect } from "next/navigation";
import { VISUALIZATION_TYPES, type VisualizationType } from "@/app/types/types";
import { SearchParams } from "next/dist/server/request/search-params";

const VALID_TYPES: Record<"none" | "player" | "team", VisualizationType[]> = {
  none: ["logo"],
  team: ["logo", "histogram", "kde"],
  player: ["logo", "histogram", "kde"],
};

function isVisualizationType(val: string): val is VisualizationType {
  return val in VISUALIZATION_TYPES;
}

export function validateSearchParams(
  gameId: string,
  raw: SearchParams,
): URLSearchParams {
  const player = typeof raw.player === "string" ? raw.player : undefined;
  const team = typeof raw.team === "string" ? raw.team : undefined;
  const type = typeof raw.type === "string" ? raw.type : undefined;

  // Both present is invalid — drop team, keep player, reset type
  if (player && team) {
    console.log("REDIRECTING");
    redirect(`/${gameId}?type=logo`);
  }

  const context = player ? "player" : team ? "team" : "none";
  console.log("context: ", context);
  const allowedTypes = VALID_TYPES[context];

  // Check if type is present, is a real VisualizationType, and is allowed for this context
  const isValid =
    type !== undefined &&
    isVisualizationType(type) &&
    allowedTypes.includes(type);

  if (!isValid) {
    // Redirect to the first allowed type for this context
    const params = new URLSearchParams();
    if (player) params.set("player", player);
    if (team) params.set("team", team);
    params.set("type", allowedTypes[0]);
    redirect(`/${gameId}?${params.toString()}`);
  }

  // If we reach here, everything is valid
  const params = new URLSearchParams();
  if (player) params.set("player", player);
  if (team) params.set("team", team);
  params.set("type", type as VisualizationType);
  return params;
}
