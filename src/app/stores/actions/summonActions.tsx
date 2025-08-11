import { toast } from "react-toastify";
import cardActions from "./cardActions";
import { makeAutoObservable } from "mobx";
import fieldStore from "../fieldStore";
import handStore from "../handStore";
import phaseStore from "../phaseStore";
import playerStore from "../playerStore";

class SummonActions {
  constructor() {
    makeAutoObservable(this);
  }

  summon(row: number, col: number) {
    const slot = fieldStore.field.slots[row][col];
    const selectedCard = cardActions.selectedCard;

    if (!selectedCard || selectedCard.type !== "MONSTER") return;

    const previousCard = slot.card;

    const hand = handStore.hands[phaseStore.currentTurn];
    hand.removeCard(selectedCard);
    selectedCard.owner = null;
    slot.card = selectedCard;
    if (previousCard) {
      handStore.hands[phaseStore.currentTurn].addCard(previousCard);
    }

    playerStore.players[phaseStore.currentTurn].updateFP(3);
    toast.success(`Invocaste con éxito, ganas 3 puntos de favor`);
  }
}
const summonActions = new SummonActions();
export default summonActions;
