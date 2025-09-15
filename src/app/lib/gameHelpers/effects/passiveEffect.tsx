import Card, { CardType } from "@/app/models/card";
import Player from "@/app/models/player";


const passiveEffects: { [key: string]: (player: Player, card: Card, isDiscard: boolean) => void } = {
  GoblinE: (player: Player, playedCard: Card) => {
    if (playedCard.type === CardType.WEAPON || playedCard.type === CardType.ITEM) {
      const currentFP = player.favorPoints;
      const newFP = Math.min(10, currentFP + 1);
      player.favorPoints = newFP;
    }
  },

  WatcherE: (player: Player, playedCard: Card) => {
    if (playedCard.type === CardType.SPELL) {
      const currentFP = player.favorPoints;
      const newFP = Math.min(10, currentFP + 1);
      player.favorPoints = newFP;
    }
  },

  WraithE: (player: Player, playedCard: Card, isDiscard: boolean) => {
    if (playedCard.type === CardType.MONSTER && isDiscard === false) {
      const currentFP = player.favorPoints;
      const newFP = Math.min(10, currentFP + 1);
      player.favorPoints = newFP;
    }
  },
  ZombieE: (player: Player, playedCard: Card) => {
    if (playedCard.type === CardType.MONSTER) {
      const currentFP = player.favorPoints;
      const newFP = Math.min(10, currentFP + 1);
      player.favorPoints = newFP;
    }
  },
};

export function checkPassiveEffects(cards: Card[], players: { [key: string]: Player }, playerId: string, isDiscard: boolean) {
  const player = players[playerId];
  if (!player) {
    console.log("player not found", "inputs:", cards, player);
    return;
  }
  cards.forEach((card) => {
    for (const abilityId of player.passiveEffects) {
      if (passiveEffects[abilityId]) {
        passiveEffects[abilityId](player, card, isDiscard);
      }
    }
  });
}