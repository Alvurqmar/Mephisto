import { drawCard } from "@/app/lib/gameHelpers/deck";
import { fetchGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  try {
    const { playerId } = await request.json();
    const { gameId } = await params;
    const gameState = await fetchGameState(gameId);

    if (playerId !== gameState.currentTurn) {
      return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
    }

    if (
      gameState.currentPhase !== "Action Phase" &&
      gameState.phaseAction !== "Loot"
    ) {
      return NextResponse.json(
        { error: "No puedes robar en esta fase" },
        { status: 400 }
      );
    }

    drawCard(gameState, playerId);

    gameState.currentPhase = "End Phase";
    gameState.phaseAction = null;

    await saveGameState(gameId, gameState);
    await pusher.trigger(`game-${gameId}`, "state-updated", {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
