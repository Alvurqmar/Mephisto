import { loadGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId } = await request.json();
    const { gameId } = await params;
    const gameState = await loadGameState(gameId);
    const drawnCard = gameState.deck.shift();

    if (
      gameState.currentPhase !== "Action Phase" &&
      gameState.phaseAction !== "Loot"
    ) {
      return NextResponse.json(
        { error: "No puedes robar en esta fase" },
        { status: 400 }
      );
    }

    if (!drawnCard) {
      return NextResponse.json(
        { error: "El mazo está vacío" },
        { status: 400 }
      );
    }

    gameState.hands[playerId].push(drawnCard);

    await saveGameState(gameId, gameState);
    await pusher.trigger(`game-${gameId}`, "state-updated", {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
