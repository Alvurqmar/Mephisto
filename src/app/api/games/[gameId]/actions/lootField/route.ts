import { fetchGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    const { row, col, playerId } = await request.json();
    const { gameId } = await params;
    const gameState = await fetchGameState(gameId);
    const slot = gameState.field.slots[row]?.[col];

    if (playerId !== gameState.currentTurn) {
      return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
    }

    if (!slot || !slot.card) {
      return NextResponse.json(
        { error: "No hay carta en esa posición." },
        { status: 400 }
      );
    }

    if (
      gameState.currentPhase !== "Action Phase" &&
      gameState.phaseAction !== "Loot"
    ) {
      return NextResponse.json(
        { error: "No puedes realizar esta acción en esta fase" },
        { status: 400 }
      );
    }

    if (slot.owner === null && slot.card.type === "MONSTER") {
      return NextResponse.json(
        { error: "No puedes robar monstruos." },
        { status: 400 }
      );
    }

    gameState.hands[playerId].push(slot.card);
    slot.card = null;
    gameState.currentPhase = "End Phase";
    gameState.phaseAction = null;

    await saveGameState(gameId, gameState);
    await pusher.trigger(`game-${gameId}`, "state-updated", { updated: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
