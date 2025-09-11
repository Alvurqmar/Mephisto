import { GameState } from "@/app/models/gameState";
import { updateFP } from "../../player";

export function VampireE(gameState: GameState) {
  const currentPlayer = gameState.currentTurn;


  updateFP(gameState, currentPlayer, 1);

  for (const playerId in gameState.players) {
    if (Object.prototype.hasOwnProperty.call(gameState.players, playerId)) {

      if (playerId !== currentPlayer) {
        updateFP(gameState, playerId, -2);
      }
    }
  }

  return gameState;
}

VampireE.requiresTarget = false;