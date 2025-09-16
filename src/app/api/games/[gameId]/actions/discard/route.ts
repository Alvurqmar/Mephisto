import { fetchGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const { playerId, cardId } = await request.json();
  const gameState = await fetchGameState(gameId);

  if (playerId !== gameState.currentTurn) {
    return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
  }

  for (let row = 0; row < gameState.field.slots.length; row++) {
    for (let col = 0; col < gameState.field.slots[row].length; col++) {
      const slot = gameState.field.slots[row][col];
      if (slot.card && slot.card.id === cardId) {
        gameState.discardPile.addCards([slot.card]);
        slot.card = null;
      }
    }
  }

  await saveGameState(gameId, gameState);
  await pusher.trigger(`game-${gameId}`, "state-updated", {});
  return NextResponse.json({ success: true });
}
