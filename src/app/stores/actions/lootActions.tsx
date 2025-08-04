import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import gameStore from "../gameStore";

class LootActions {
  constructor() {
    makeAutoObservable(this);
  }

  lootField(row: number, col: number): boolean {
    const slot = gameStore.field.getSlot(row, col);
    const currentPlayerHand = gameStore.hands[gameStore.currentTurn];

    if (!slot || !slot.card) {
      toast.error("No hay carta en esa posición.");
      return false;
    }

    if (slot.owner !== null && slot.owner !== gameStore.currentTurn) {
      toast.error("No puedes robar cartas del lado de otro jugador.");
      return false;
    }

    if (slot.owner === null && slot.card.type === "MONSTER") {
      toast.error("No puedes robar monstruos.");
      return false;
    }

    currentPlayerHand.addCard(slot.card);
    slot.card = null;
    toast.success(`Looteaste con éxito`);
    return true;
  }

  lootDeck() {
    const currentPlayerHand = gameStore.hands[gameStore.currentTurn];
    const deck = gameStore.deck;

    if (deck.length === 0) {
      gameStore.restartDeck();
    }

    const drawnCard = gameStore.deck.shift();

    if (!drawnCard) {
      toast.error("No hay cartas en el mazo para lootear.");
      return;
    }

    currentPlayerHand.addCard(drawnCard);
    toast.success(`Looteaste con éxito`);
  }
}
const lootActions = new LootActions();
export default lootActions;
