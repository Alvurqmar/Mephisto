import { toast } from "react-toastify";
import { makeAutoObservable } from "mobx";
import cardActions from "./cardActions";
import phaseStore from "../phaseStore";

class SummonActions {
  constructor() {
    makeAutoObservable(this);
  }

  async summon(gameId: string, row: number, col: number) {
    const selectedCard = cardActions.selectedCard;
    const playerId = phaseStore.currentTurn;

    if (!selectedCard) {
      toast.error("No hay carta seleccionada.");
      return;
    }

    const res = await fetch(`/api/games/${gameId}/actions/summon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        row,
        col,
        cardId: selectedCard.id,
        playerId,
      }),
    });

    if (res.ok) {
      toast.success(`Invocaste con éxito, ganas 3 puntos de favor`);
    } else {
      const errorData = await res.json();
      toast.error(errorData.error);
    }
  }
}

const summonActions = new SummonActions();
export default summonActions;
