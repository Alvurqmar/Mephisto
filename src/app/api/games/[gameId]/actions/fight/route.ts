import { NextResponse } from "next/server";
import { loadGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const { gameId } = await params;
  const { playerId, results, favorSpent, gainedSP, discardedCards } =
    await request.json();

  const gameState = await loadGameState(gameId);

  if (playerId !== gameState.currentTurn) {
    return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
  }

  results.forEach((res: any) => {
    const slot = gameState.field.slots[res.row][res.col];
    if (slot) slot.card = res.card ?? null;
  });

  if (favorSpent) {
    gameState.players[playerId].favorPoints -= favorSpent;
  }

  if (gainedSP) {
    gameState.players[playerId].soulPoints += gainedSP;
  }

  if (discardedCards && discardedCards.length > 0) {
    if (!gameState.discardPile) gameState.discardPile = [];
    gameState.discardPile.push(...discardedCards);
  }

  gameState.currentPhase = "End Phase";
  gameState.phaseAction = null;

  await saveGameState(gameId, gameState);
  await pusher.trigger(`game-${gameId}`, "state-updated", {});

  return NextResponse.json({ success: true });
}
