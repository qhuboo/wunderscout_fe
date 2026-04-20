import { notFound } from "next/navigation";
import { validateSearchParams } from "@/lib/searchParams";
import GameScreen from "../components/GameScreen";
import {
  fetchGameData,
  fetchJson,
  fetchPlayerJsonUrl,
  fetchTeamJsonUrl,
} from "@/lib/utils";
import { SearchParams } from "next/dist/server/request/search-params";
import { VisualizationType } from "../types/types";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { gameId } = await params;
  const rawSearchParams = await searchParams;

  const validSearchParams = validateSearchParams(gameId, rawSearchParams);

  const type = validSearchParams.get("type") as VisualizationType;
  const player = validSearchParams.get("player");
  const team = validSearchParams.get("team");

  const res = await fetchGameData(gameId, validSearchParams);

  if (res.error) {
    notFound();
  }

  const { data: gameData } = res;

  let jsonData = null;
  if (type != "logo") {
    let url;
    if (player && gameData.players.some((p) => p.id == player)) {
      console.log("Fetching player data");
      const res = await fetchPlayerJsonUrl(gameId, player, validSearchParams);

      if (res.error) {
        notFound();
      }

      const { data } = res;
      url = data?.url;
    }

    if (team && gameData.teams.some((t) => t.id == team)) {
      console.log("Fetching team data");
      const res = await fetchTeamJsonUrl(gameId, team, validSearchParams);

      if (res.error) {
        notFound();
      }

      const { data } = res;
      url = data?.url;
    }

    if (!url) {
      notFound();
    }

    jsonData = await fetchJson(url);

    if (!jsonData) {
      notFound();
    }
  }

  return (
    <div className="flex-1 flex">
      <GameScreen
        gameData={gameData}
        visualizationType={type}
        data={jsonData}
      />
    </div>
  );
}
