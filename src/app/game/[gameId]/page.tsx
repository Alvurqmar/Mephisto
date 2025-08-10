import BoardView from "@/app/views/boardView";

interface PageProps {
  params: Promise<{ gameId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { gameId } = await params;

  return (
    <div>
      <BoardView gameId={gameId} />
    </div>
  );
}
