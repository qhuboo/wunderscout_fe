import GameScreen from "./components/GameScreen";

export default function Page() {
  const defaultId = "1111";
  return (
  <div className="border-2 border-amber-500 flex-1 flex">
    <GameScreen gameId={defaultId} />
  </div>
  );
}
