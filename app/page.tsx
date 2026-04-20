import { Suspense } from "react";
import GameScreen from "./components/GameScreen";

const players = [
  { tracker_id: 1 },
  { tracker_id: 2 },
  { tracker_id: 3 },
  { tracker_id: 4 },
  { tracker_id: 5 },
  { tracker_id: 6 },
  { tracker_id: 7 },
  { tracker_id: 8 },
  { tracker_id: 9 },
  { tracker_id: 10 },
  { tracker_id: 11 },
  { tracker_id: 12 },
  { tracker_id: 13 },
  { tracker_id: 14 },
  { tracker_id: 15 },
  { tracker_id: 16 },
  { tracker_id: 17 },
  { tracker_id: 18 },
  { tracker_id: 19 },
  { tracker_id: 20 },
  { tracker_id: 21 },
  { tracker_id: 22 },
];

export default function Page() {
  return (
    <Suspense>
      <div className="flex-1 flex">
        <GameScreen players={players} visualizationType="logo" data={[]} />
      </div>
    </Suspense>
  );
}
