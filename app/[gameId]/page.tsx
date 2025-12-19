import GameScreen from "../components/GameScreen";

type SearchParams = { [k: string]: string | string[] | undefined };

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ gameId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  console.log(resolvedParams);
  console.log(resolvedSearchParams);

  if (typeof resolvedSearchParams.type !== "string") {
    return;
  }

  return (
    <div className="border-2 border-amber-500 flex-1 flex">
      <GameScreen gameId={resolvedParams.gameId} visualizationType={resolvedSearchParams.type} />
    </div>
  );
}
