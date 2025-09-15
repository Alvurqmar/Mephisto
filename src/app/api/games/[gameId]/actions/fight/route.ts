import { NextRequest, NextResponse } from "next/server";
import { fetchGameState, saveGameState } from "@/app/lib/Helpers";
import { pusher } from "@/app/lib/pusher";
import { Result } from "@/app/stores/actions/fightActions";
import { addPassiveAbility, updateFP, updateSP } from "@/app/lib/gameHelpers/player";
import Card, { CardType, EffectType } from "@/app/models/card";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  const { playerId, results, favorSpent, gainedSP, discardedCards } =
    await request.json();

  const gameState = await fetchGameState(gameId);

  if (playerId !== gameState.currentTurn) {
    return NextResponse.json({ error: "No es tu turno" }, { status: 403 });
  }

  results.forEach((res: Result) => {
    const slot = gameState.field.slots[res.row][res.col];
    if (slot) slot.card = res.card ?? null;
  });

  discardedCards.forEach((card: Card) => {
    if(card.type === CardType.MONSTER && card.effectType === EffectType.CE){
      addPassiveAbility(playerId, card.effectId, gameState);
    }
  });

  if (favorSpent) {
    updateFP(gameState, playerId, -favorSpent);
  }

  if (gainedSP) {
    updateSP(gameState, playerId, gainedSP);
  }

  if (discardedCards && discardedCards.length > 0) {
    gameState.discardPile.addCards(discardedCards);
  }

  gameState.currentPhase = "End Phase";
  gameState.phaseAction = null;

  await saveGameState(gameId, gameState);
  await pusher.trigger(`game-${gameId}`, "state-updated", {});

  return NextResponse.json({ success: true });
}
