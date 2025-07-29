import gameStore, { Action } from "../gameStore";
import { toast } from "react-toastify";

class PhaseActions {
  setPhaseAction(action: Action) {
    if (
      action === "Summon" &&
      gameStore.hands[gameStore.currentTurn].cards.filter(
        (c) => c.type === "MONSTER"
      ).length === 0
    ) {
      toast.error("No tienes Monstruos para invocar.");
      return;
    }
    gameStore.phaseAction = action;
  }

  changePhase() {
    const keys = Object.keys(gameStore.players);
    const currentIndex = keys.indexOf(gameStore.currentTurn);

    switch (gameStore.currentPhase) {
      case "Main Phase":
        gameStore.currentPhase = "Action Phase";
        gameStore.phaseAction = null;
        break;
      case "Action Phase":
        gameStore.phaseAction = null;
        gameStore.currentPhase = "End Phase";
        break;
      case "End Phase":
        this.endTurn();
        gameStore.turnCounter++;
        gameStore.currentPhase = "Main Phase";
        gameStore.currentTurn = keys[(currentIndex + 1) % keys.length];
        break;
    }
  }
  endTurn() {
    if (gameStore.deck.length > 0) {
      const card = gameStore.deck.shift()!;
      gameStore.hands[gameStore.currentTurn].addCard(card);
    }
    for (let row = 0; row < gameStore.field.slots.length; row++) {
      for (let col = 0; col < gameStore.field.slots[row].length; col++) {
        const slot = gameStore.field.slots[row][col];
        if (slot.owner === null && !slot.card && gameStore.deck.length > 0) {
          const card = gameStore.deck.pop()!;
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
