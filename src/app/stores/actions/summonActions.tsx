import gameStore from "../gameStore";
import { toast } from "react-toastify";
import cardActions from "./cardActions";

class SummonActions {

  summon(row: number, col: number) {
    const slot = gameStore.field.slots[row][col];
    const selectedCard = cardActions.selectedCard;

    if (!selectedCard || selectedCard.type !== "MONSTER") return;

    const previousCard = slot.card;
    slot.card = selectedCard;

    const hand = gameStore.hands[gameStore.currentTurn];
    hand.removeCard(selectedCard);
    selectedCard.owner=null;

    if (previousCard) {
      gameStore.hands[gameStore.currentTurn].addCard(previousCard);
    }

    gameStore.players[gameStore.currentTurn].updateFP(3);
    toast.success(`Invocaste con éxito, ganas 3 puntos de favor`);
  }
}
const summonActions = new SummonActions();
export default summonActions;
