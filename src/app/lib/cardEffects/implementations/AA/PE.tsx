import { EffectFn } from "../../effectManager";
import { CardType, EffectType } from "../../../../models/card";
import { registerEffect } from "../../registry";
import { Slot } from "@/app/models/slot";

const PE: EffectFn = async ({ gameState, card: triggerCard, playerId }) => {

  let cardPos: { row: number; col: number } | null = null;
  for (let row = 0; row < gameState.field.slots.length; row++) {
    for (let col = 0; col < gameState.field.slots[row].length; col++) {
      const slotCard = gameState.field.slots[row][col].card;
      if (slotCard?.id === triggerCard.id) {
        cardPos = { row, col };
        break;
      }
    }
    if (cardPos) break;
  }
  if (!cardPos) return;

  const nonMonsters = gameState.field.slots[cardPos.row].filter(
    (s: Slot) => s.card && s.card.id !== triggerCard.id && s.card.type !== CardType.MONSTER
  ).length;

  const currentPlayer = gameState.players[playerId];
  currentPlayer.updateFP(1 + nonMonsters);

};

registerEffect(EffectType.AA, "PE", PE);

export default PE;
