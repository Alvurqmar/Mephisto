import { GameState } from "@/app/models/gameState";

export function updateSP(gameState: GameState, playerId: string, amount: number) {
    gameState.players[playerId].soulPoints += amount;
    checkVictory(gameState, playerId);
}

export function updateFP(gameState: GameState, playerId: string, amount: number) {
    const updatedFP = gameState.players[playerId].favorPoints += amount;
    gameState.players[playerId].favorPoints = Math.max(0, Math.min(10, updatedFP));
}


 function checkVictory(gameState: GameState, playerId: string) {
    const player = gameState.players[playerId];

    if (player.soulPoints >= gameState.winningSoulPoints) {
      player.isWinner = true;
      gameState.status = "Finished";
    }
  }

  export function addPassiveAbility(playerId: string, ability: string, gameState: GameState) {
    const player = gameState.players[playerId];
    if (!player.passiveEffects.includes(ability)) {
      player.passiveEffects.push(ability);
    }
  }
