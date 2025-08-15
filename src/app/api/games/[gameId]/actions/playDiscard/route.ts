import { loadGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  const { gameId } = await params;
  const { playerId, cardId, row, col, discardIds } = await request.json();
  const gameState = await loadGameState(gameId);
  const hand = gameState.hands[playerId];
  const slot = gameState.field.slots[row]?.[col];

  if (playerId !== gameState.currentTurn) {
    return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
  }

  if (!slot) {
    return NextResponse.json({ error: "Posición inválida." }, { status: 400 });
  }
  if (slot.card) {
    return NextResponse.json({ error: "Casilla ocupada." }, { status: 400 });
  }

  const cardIndex = hand.findIndex((c: any) => c.id === cardId);
  if (cardIndex === -1) {
    return NextResponse.json(
      { error: "Carta no encontrada en mano." },
      { status: 400 }
    );
  }
  const card = hand[cardIndex];

  if (discardIds.length !== card.cost) {
    return NextResponse.json(
      { error: `Debes descartar exactamente ${card.cost} cartas.` },
      { status: 400 }
    );
  }

  const discardCards = discardIds.map((id: any) => {
    const idx = hand.findIndex((c: any) => c.id === id);
    if (idx === -1) {
      throw new Error(`Carta con id ${id} no encontrada en mano.`);
    }
    return hand[idx];
  });

  gameState.hands[playerId] = hand.filter(
    (c: any) => !discardIds.includes(c.id) && c.id !== cardId
  );

  gameState.discardPile.push(...discardCards);

  slot.card = card;

  await saveGameState(gameId, gameState);
  await pusher.trigger(`game-${gameId}`, "state-updated", {});

  return NextResponse.json({ success: true });
}
