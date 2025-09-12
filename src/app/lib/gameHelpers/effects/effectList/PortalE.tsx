import { GameState } from "@/app/models/gameState";
import Card from "@/app/models/card";
import { cardPos } from "../../field";
import { findByIdInHand, removeCardFromHand } from "../../hand";
import { findById} from "../../card";
import { updateFP } from "../../player";

export function PortalE(gameState: GameState, cardId: string, targets?: Card[]) {
  if (!targets || targets.length < 2) {
    console.warn("Key requires 2 targets.");
    return gameState;
  }

  const handCard = findByIdInHand(gameState, targets[0].id, targets[0].owner!);
  const fieldCard = findById(gameState, targets[1].id);

  if (!handCard || !fieldCard) {
    console.warn("One or more target cards not found in game state.");
    return gameState;
  }
  
  const handOwner = targets[0].owner!;
  const fieldCardPos = cardPos(gameState.field, fieldCard.id);
  if (!fieldCardPos) {
    console.warn("Field card position not found.");
    return gameState;
  }

  const { row: Row, col: Col } = fieldCardPos;
  const slot = gameState.field.slots[Row][Col];
  
  slot.card = handCard;


  removeCardFromHand(gameState, handCard.id, handOwner!);
  handCard.owner = null;
  fieldCard.owner = handOwner!;
  gameState.hands[handOwner!].push(fieldCard);


  updateFP(gameState, handOwner!, 3);

  return gameState;
}
PortalE.requiresTarget = true;
PortalE.targetRequirements = [
  {
    type: ["ITEM", "WEAPON", "SPELL", "MONSTER"],
    count: 1,
    location: "hand",
    owner: "any",
  },
  {
    type: ["ITEM", "WEAPON", "SPELL", "MONSTER"],
    count: 1,
    location: "field",
    owner: "any",
  },
];