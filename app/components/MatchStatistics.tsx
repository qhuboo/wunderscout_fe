import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { type GameDataType } from "../types/types";

export default function MatchStatistics({
  gameData,
}: {
  gameData: GameDataType["data"] | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePlayerClick = (id: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("player", id.toString());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="flex flex-col gap-4 px-2">
      <div className="">
        <div className="bg-[#d79326ff] font-bold text-black w-fit px-2">
          GAME INFO
        </div>
        <div className="border border-[#352b19ff] text-sm grid grid-cols-[30%_1fr]">
          <div className="border-r border-[#352b19ff] p-3">
            <div className="text-[#d79326ff] mb-1">Title</div>
            <div className="text-[#a4a4a4ff]">
              Tottenham vs Manchester United
            </div>
          </div>
          <div className="border-r border-[#352b19ff] p-3">
            <div className="text-[#d79326ff] mb-1">Description</div>
            <div className="text-[#a4a4a4ff]">
              Tottenham defeated Manchester United 1-0 in the 2025 Europa League
              Final in Bilbao, with Brennan Johnson scoring the only goal just
              before halftime to secure Spurs&apos; first major European trophy
              in over four decades.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-[#d79326ff] px-2 font-bold">MATCH EVENTS</div>
        <div className="flex flex-col">
          <div className="bg-[#0f1d34] grid gap-0.5 grid-cols-[20%_20%_1fr] grid-rows-[auto auto]">
            <div className="text-[#97aed4ff] bg-[#021b44ff] p-1 text-sm">
              Time
            </div>
            <div className="text-[#97aed4ff] bg-[#021b44ff] p-1 text-sm">
              Team
            </div>
            <div className="text-[#97aed4ff] bg-[#021b44ff] p-1 text-sm">
              Description of goal event.
            </div>
            <div className="bg-[#06142eff] p-1 text-sm">85&apos;</div>
            <div className="bg-[#06142eff] p-1 text-sm">Tottenham</div>
            <div className="bg-[#06142eff] p-1 text-sm">
              Swaz volley str8 into the top bins.
            </div>
            <div className="bg-[#06142eff] p-1 text-sm">85&apos;</div>
            <div className="bg-[#06142eff] p-1 text-sm">Tottenham</div>
            <div className="bg-[#06142eff] p-1 text-sm">
              Swaz volley str8 into the top bins.
            </div>
            <div className="bg-[#06142eff] p-1 text-sm">85&apos;</div>
            <div className="bg-[#06142eff] p-1 text-sm">Tottenham</div>
            <div className="bg-[#06142eff] p-1 text-sm">
              Swaz volley str8 into the top bins.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-[#d79326ff] px-2 font-bold">MATCH STATISTICS</div>
        <div className="overflow-hidden">
          <table className="w-full text-left border-collapse text-black">
            <thead className="bg-[#899499]/80 uppercase text-xs font-bold">
              <tr>
                <th className="px-4 py-3">Stats</th>
                <th className="px-4 py-3 text-right">ATL</th>
                <th className="px-4 py-3 text-right">NYC</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              <tr className="bg-[#899499]">
                <td className="px-4 py-3">Passes</td>
                <td className="px-4 py-3 text-right">387</td>
                <td className="px-4 py-3 text-right">312</td>
              </tr>
              <tr className="bg-[#899499]/80">
                <td className="px-4 py-3">Pass Acc</td>
                <td className="px-4 py-3 text-right">84%</td>
                <td className="px-4 py-3 text-right">79%</td>
              </tr>
              <tr className="bg-[#899499]">
                <td className="px-4 py-3">Shots</td>
                <td className="px-4 py-3 text-right">12</td>
                <td className="px-4 py-3 text-right">8</td>
              </tr>
              <tr className="bg-[#899499]/80">
                <td className="px-4 py-3">xG</td>
                <td className="px-4 py-3 text-right">1.8</td>
                <td className="px-4 py-3 text-right">1.2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div className="text-[#d79326ff] px-2 font-bold">PLAYER STATISTICS</div>
        <table
          style={{
            tableLayout: "fixed",
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "4px",
            backgroundColor: "#000",
          }}
        >
          <thead className="text-[#d79326ff] text-sm">
            <tr>
              <th className="text-left px-2 border-2 border-b-[#d79326ff]">
                Player ID
              </th>
              <th className="text-left px-2 border-2 border-b-[#d79326ff]">
                Name
              </th>
              <th className="text-left px-2 border-2 border-b-[#d79326ff]">
                Team
              </th>
            </tr>
          </thead>
          <tbody>
            {gameData &&
              gameData.players.map((player) => (
                <tr
                  key={player.id}
                  className="text-sm bg-[#05291D] text-[#047F54] border-1 border-dashed border-white"
                >
                  <td
                    className="text-left p-1 cursor-pointer"
                    onClick={() => handlePlayerClick(player.id)}
                  >
                    {player.id}
                  </td>
                  <td className="text-left px-2">{player.name}</td>
                  <td className="text-left px-2">{player.team_name}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
