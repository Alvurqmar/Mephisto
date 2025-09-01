import { EffectFn } from "../../effectManager";
import { CardType, EffectType } from "../../../../models/card";
import { registerEffect } from "../../registry";

const MPE: EffectFn = async ({ gameState, card, playerId }) => {
  const triggerCard = card;
  const currentPlayer = gameState.players[playerId];
  const currentHand = gameState.hands[playerId];
  const topCard = gameState.deck.shift();
  if (!topCard) return;

  gameState.deck.push(topCard);

  switch (topCard.type) {
    case CardType.SPELL: {
      const drawn = gameState.deck.shift();
      if (drawn) {
        currentHand.push(drawn);
      }
      break;
    }

    case CardType.MONSTER: {
        currentPlayer.updateFP(3);
      break;
    }

    case CardType.WEAPON:
    case CardType.ITEM: {
      triggerCard.durability = (triggerCard.durability || 0) + 1;
      break;
    }
  }
};

registerEffect(EffectType.AA, "MPE", MPE);

export default MPE;
