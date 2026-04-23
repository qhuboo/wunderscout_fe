"use client";

import { useSearchParams, useRouter } from "next/navigation";
import GameUploadForm from "./GameUploadForm";
import { GameDataType } from "../types/types";

export default function Footer({
  gameData,
}: {
  gameData: GameDataType["data"] | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const visualizationType = searchParams.get("type");
  const player = searchParams.get("player");

  const validVisualizationTypes = gameData?.players.find(
    (p) => p.id === Number(player),
  )?.artifacts;

  console.log(validVisualizationTypes);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", e.target.value);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="border border-[#333]">
      <div className="bg-black font-mono uppercase tracking-widest text-[#d1d1d1] border-t border-[#333] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#444]">Action:</span>
            <GameUploadForm />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-xs text-[#444]">Visualization</span>
              <span className="text-xs text-[#22d3ee]">
                {validVisualizationTypes && (
                  <select
                    name="visualizationType"
                    value={visualizationType ? visualizationType : ""}
                    onChange={handleTypeChange}
                  >
                    {validVisualizationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                    <option value={"logo"}>logo</option>
                  </select>
                )}
              </span>
            </div>

            <div className="h-5 w-px bg-[#222]"></div>

            <div className="flex flex-col">
              <span className="text-xs text-[#444]">Player_ID</span>
              <span className="text-xs text-white">
                {searchParams.get("player") || "—"}
              </span>
            </div>

            <div className="h-5 w-px bg-[#222]"></div>

            <div className="flex flex-col">
              <span className="text-xs text-[#444]">Top_Speed</span>
              <span className="text-xs text-[#22d3ee]">
                {searchParams.get("player") ? "32.4 km/h" : "—"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#444]">Distance</span>
              <span className="text-xs text-white">
                {searchParams.get("player") ? "11.2 km" : "—"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-[#444]">Sprints</span>
              <span className="text-xs text-[#899499]">
                {searchParams.get("player") ? "47" : "—"}
              </span>
            </div>

            <div className="h-5 w-px bg-[#222]"></div>

            <div className="flex flex-col">
              <span className="text-xs text-[#444]">Team</span>
              <span className="text-xs text-[#899499]">Tottenham</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#333]">v8.2.1</span>
            <div className="w-1.5 h-1.5 bg-[#22d3ee]/30 rotate-45"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
