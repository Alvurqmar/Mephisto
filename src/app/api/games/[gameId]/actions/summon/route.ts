import { updateFP } from "@/app/lib/gameHelpers/player";
import { fetchGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import Card from "@/app/models/card";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const { gameId } = await params;
  const { row, col, cardId, playerId } = await request.json();
  const gameState = await fetchGameState(gameId);
  const hand = gameState.hands[playerId];
  const cardIndex = hand.findIndex((c: Card) => c.id === cardId);
  const selectedCard = hand[cardIndex];
  const slot = gameState.field.slots[row]?.[col];
  const previousCard = slot.card || null;

  if (playerId !== gameState.currentTurn) {
    return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
  }

  if (cardIndex === -1) {
    return NextResponse.json(
      { error: "Carta no encontrada en tu mano." },
      { status: 400 }
    );
  }

  if (selectedCard.type !== "MONSTER") {
    return NextResponse.json(
      { error: "Solo puedes invocar monstruos." },
      { status: 400 }
    );
  }

  if (!slot) {
    return NextResponse.json({ error: "Posición inválida." }, { status: 400 });
  }

  hand.splice(cardIndex, 1);

  slot.card = selectedCard;

  if (previousCard) {
    hand.push(previousCard);
    previousCard.owner = playerId;
  }

  updateFP(gameState, playerId, 3);
  gameState.currentPhase = "End Phase";
  gameState.phaseAction = null;
  
  await saveGameState(gameId, gameState);
  await pusher.trigger(`game-${gameId}`, "state-updated", {});

  return NextResponse.json({ success: true });
}
