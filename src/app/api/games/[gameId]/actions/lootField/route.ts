import { loadGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  context: { params: { gameId: string } }
) {
  try {
    const { params } = await context;
    const { row, col, playerId } = await request.json();
    const { gameId } = await params;
    const gameState = await loadGameState(gameId);
    const slot = gameState.field.slots[row]?.[col];

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

    await saveGameState(gameId, gameState);
    await pusher.trigger(`game-${gameId}`, "state-updated", { updated: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
