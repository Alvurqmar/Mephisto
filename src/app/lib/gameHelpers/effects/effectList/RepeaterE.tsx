import { GameState } from "@/app/models/gameState";
import { findById } from "../../card";


export function RepeaterE(gameState: GameState, cardId: string) {
  const numericCardId = parseInt(cardId);
  const card = findById(gameState, numericCardId);

  if(card){
  card.isTapped! = true;
  }

  return gameState;
}

RepeaterE.requiresTarget = false;