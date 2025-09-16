import { NextResponse, NextRequest } from "next/server";
import { fetchGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { cardInField } from "@/app/stores/fieldStore";
import { findById } from "@/app/lib/gameHelpers/card";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const { cardId, updates, playerId } = await request.json();
  const gameState = await fetchGameState(gameId);

  if (playerId !== gameState.currentTurn) {
    return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
  }

  const cardFound = cardInField(gameState.field, cardId);
  if (cardFound) {
    const card = findById(gameState, cardId);
    if (updates.attack !== undefined) {
      card!.attack += updates.attack;
      card!.temporal = true;
    }
  }

  if (!cardFound) {
    return NextResponse.json(
      { error: "Card not found on the field." },
      { status: 404 }
    );
  }

  await saveGameState(gameId, gameState);
  await pusher.trigger(`game-${gameId}`, "state-updated", {});

  return NextResponse.json({ success: true });
}
