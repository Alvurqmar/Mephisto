import Card, { CardType } from "@/app/models/card";
import Player from "@/app/models/player";
import { findById } from "../card";
import { GameState } from "@/app/models/gameState";


const passiveEffects: { [key: string]: (player: Player, card: Card, isDiscard: boolean, players: { [key: string]: Player }, gameState: GameState) => void } = {
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
  WitchE: (player: Player, playedCard: Card, isDiscard: boolean, players: { [key: string]: Player }) => {
  if (playedCard.type === CardType.SPELL) {
    const allPlayers = Object.values(players);
    const otherPlayers = allPlayers.filter(p => p.key !== player.key);
    if (otherPlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherPlayers.length);
        const randomOpponent = otherPlayers[randomIndex];
        randomOpponent.favorPoints = Math.max(0, randomOpponent.favorPoints - 1); 
    }
  }
},
  LichE: (player: Player, playedCard: Card, isDiscard: boolean, players: { [key: string]: Player }, gameState: GameState) => {
    const activatedCard = findById(gameState, playedCard.id);
    if(player.activationHistory[playedCard.id] === 1 && activatedCard && activatedCard.isTapped){
      activatedCard.isTapped = false;
    }
    
  }
};

export function checkPassiveEffects(cards: Card[], players: { [key: string]: Player }, playerId: string, isDiscard: boolean, gameState: GameState) {
  const player = players[playerId];
  if (!player) {
    console.log("player not found", "inputs:", cards, player);
    return;
  }
  cards.forEach((card) => {
    for (const abilityId of player.passiveEffects) {
      if (passiveEffects[abilityId]) {
        passiveEffects[abilityId](player, card, isDiscard, players, gameState);
      }
    }
  });
}