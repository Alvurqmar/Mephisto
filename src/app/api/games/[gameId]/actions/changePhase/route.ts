import { drawCard, restartDeck } from "@/app/lib/gameHelpers/deck";
import { fetchGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const { playerId } = await request.json();
  const { gameId } = await params;
  const gameState = await fetchGameState(gameId);
  const keys = Object.keys(gameState.players);
  const turn = keys.indexOf(gameState.currentTurn);

  if (playerId !== gameState.currentTurn) {
    return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
  }

  switch (gameState.currentPhase) {
    case "Main Phase":
      gameState.currentPhase = "Action Phase";
      gameState.phaseAction = null;
      break;
    case "Action Phase":
      gameState.phaseAction = null;
      gameState.currentPhase = "End Phase";
      break;
    case "End Phase":
      drawCard(gameState, playerId);

      if (gameState.deck.length <= 0) {
        restartDeck(gameState);
      }
      
      for (let row = 0; row < gameState.field.slots.length; row++) {
        for (let col = 0; col < gameState.field.slots[row].length; col++) {
          const slot = gameState.field.slots[row][col];
          if (slot.card && slot.card.isTapped) {
            slot.card.isTapped = false;
          }

          if (!slot.card && slot.owner === null) {
            const card = gameState.deck.pop() ?? null;
            slot.card = card;
            slot.owner = null;
          }
        }
      }
      gameState.turnCounter++;
      gameState.currentTurn = keys[(turn + 1) % keys.length];
      gameState.currentPhase = "Main Phase";
      gameState.phaseAction = null;
      break;
  }

  await saveGameState(gameId, gameState);
  await pusher.trigger(`game-${gameId}`, "state-updated", {});

  return NextResponse.json({ success: true });
}
