import { loadGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { playerId } = await request.json();
  const { gameId } = await params;
  const gameState = await loadGameState(gameId);
  const keys = Object.keys(gameState.players);
  const turn = keys.indexOf(gameState.currentTurn);
  const drawnCard = gameState.deck.shift();

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
      gameState.hands[playerId].push(drawnCard);

      for (let row = 0; row < gameState.field.slots.length; row++) {
        for (let col = 0; col < gameState.field.slots[row].length; col++) {
          const slot = gameState.field.slots[row][col];
          if (slot.card && slot.card.isTapped) {
            slot.card.isTapped = false;
          }
          if (!slot.card && slot.owner === null && gameState.deck.length > 0) {
            const card = gameState.deck.pop();
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
