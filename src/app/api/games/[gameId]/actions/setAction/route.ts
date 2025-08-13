import { loadGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId, action } = await request.json();
    const { gameId } = await params;
    const gameState = await loadGameState(gameId);

    if (
      action === "Summon" &&
      !gameState.hands[playerId].some((card: any) => card.type === "MONSTER")
    ) {
      return NextResponse.json(
        { error: "No tienes Monstruos para invocar." },
        { status: 400 }
      );
    }

    gameState.phaseAction = action;

    await saveGameState(gameId, gameState);

    await pusher.trigger(`game-${gameId}`, "state-updated", {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
