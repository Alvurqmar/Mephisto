import { cardEffect } from "@/app/lib/gameHelpers/effects/cardEffect";
import { fetchGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ gameId: string }> }) {
  try {
    const { playerId, effectId, cardId, targets } = await request.json();
    const { gameId } = await params;
    const gameState = await fetchGameState(gameId);
    console.log("Effect API called with:", { playerId, effectId, cardId, targets, gameId });

    if (playerId !== gameState.currentTurn) {
      return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
    }

    const updatedState = cardEffect(gameState, effectId, cardId, targets);

    await saveGameState(gameId, updatedState);
    await pusher.trigger(`game-${gameId}`, "state-updated", {});

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Effect error:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}