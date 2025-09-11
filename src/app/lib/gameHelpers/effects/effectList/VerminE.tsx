import { GameState } from "@/app/models/gameState";
import { drawCard } from "../../deck";

export function VerminE(gameState: GameState) {
  for (const playerId in gameState.players) {
    if (Object.prototype.hasOwnProperty.call(gameState.players, playerId)) {
      drawCard(gameState, playerId);
    }
  }

  return gameState;
}

VerminE.requiresTarget = false;
