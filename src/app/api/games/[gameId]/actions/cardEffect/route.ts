import { executeEffect } from "@/app/lib/cardEffects/effectManager";
import { findCardById, loadGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const { playerId, cardId, effectId, effectType } = await request.json();
  const { gameId } = await params;

  const gameState = await loadGameState(gameId);


  const card = findCardById(gameState, cardId);
  if (!card) {
    return NextResponse.json({ error: "Carta no encontrada" }, { status: 400 });
  }

  const result = await executeEffect(effectType, effectId, {
    gameState,
    card,
    playerId,
  });

  await saveGameState(gameId, gameState);
  await pusher.trigger(`game-${gameId}`, "state-updated", {});

  return NextResponse.json({ success: true, message: result?.message });
}
