"use client";

import { type VisualizationType } from "@/app/types/types";

import ThreeScene from "./ThreeScene";
import GameUploadForm from "./GameUploadForm";
import ProcessingMetrics from "./ProcessingMetrics";
import MatchStatistics from "./MatchStatistics";
import Footer from "./Footer";

export default function GameScreen({
  gameData,
  visualizationType,
  data,
}: {
  gameData: unknown;
  visualizationType: VisualizationType;
  data: unknown;
}) {
  return (
    <div className="p-2 flex-1">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[30%_70%] h-full min-h-0">
        <MatchStatistics gameData={gameData} />
        <div className="grid grid-rows-[auto_1fr_auto]">
          <ProcessingMetrics />
          <div className="relative overflow-hidden min-h-0">
            <ThreeScene visualizationType={visualizationType} data={data} />
          </div>
          <Footer visualizationType={visualizationType} />
        </div>
      </div>
      {/* TODO: Mobile Layout */}
      <div className="lg:hidden h-full border-2 border-white">
        <div className="grid grid-rows-[1fr_7fr_auto] h-full">
          <div className="border-1 border-dashed border-white">Item 1</div>
          <div className="overflow-hidden min-h-0 border-1 border-dashed border-white">
            <ThreeScene visualizationType={visualizationType} data={data} />
          </div>
          <div className="border-1 border-dashed border-white">
            <GameUploadForm />
          </div>
        </div>
      </div>
    </div>
  );
}
