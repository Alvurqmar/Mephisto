import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import handStore from "../handStore";
import phaseStore, { Action } from "../phaseStore";
import deckStore from "../deckStore";
import playerStore from "../playerStore";
import fieldStore from "../fieldStore";

class PhaseActions {
  constructor() {
    makeAutoObservable(this);
  }

  setPhaseAction(action: Action) {
    if (
      action === "Summon" &&
      handStore.hands[phaseStore.currentTurn].cards.filter(
        (c) => c.type === "MONSTER"
      ).length === 0
    ) {
      toast.error("No tienes Monstruos para invocar.");
      return;
    }
    phaseStore.phaseAction = action;
  }

  changePhase() {
    const keys = Object.keys(playerStore.players);
    const currentIndex = keys.indexOf(phaseStore.currentTurn);

    switch (phaseStore.currentPhase) {
      case "Main Phase":
        phaseStore.currentPhase = "Action Phase";
        phaseStore.phaseAction = null;
        break;
      case "Action Phase":
        phaseStore.phaseAction = null;
        phaseStore.currentPhase = "End Phase";
        break;
      case "End Phase":
        this.endTurn();
        phaseStore.turnCounter++;
        phaseStore.currentPhase = "Main Phase";
        phaseStore.currentTurn = keys[(currentIndex + 1) % keys.length];
        break;
    }
  }

  endTurn() {
    if (deckStore.deck.length > 0) {
      const card = deckStore.deck.shift()!;
      handStore.hands[phaseStore.currentTurn].addCard(card);
    }
    for (let row = 0; row < fieldStore.field.slots.length; row++) {
      for (let col = 0; col < fieldStore.field.slots[row].length; col++) {
        const slot = fieldStore.field.slots[row][col];
        if (slot.card && slot.card.isTapped) {
          slot.card.isTapped = false;
        }
        if (slot.owner === null && !slot.card && deckStore.deck.length > 0) {
          const card = deckStore.deck.pop()!;
          slot.card = card;
          slot.owner = null;
        }
      }
    }

    toast.success(`Turno finalizado`);
  }
}

const phaseActions = new PhaseActions();
export default phaseActions;
