import playerStore from "./playerStore";
import handStore from "./handStore";
import deckStore from "./deckStore";
import fieldStore from "./fieldStore";
import phaseStore from "./phaseStore";
import { makeAutoObservable, runInAction } from "mobx";

class GameStore {
  playersStore = playerStore;
  handsStore = handStore;
  deckStore = deckStore;
  fieldStore = fieldStore;
  phaseStore = phaseStore;
  isLoading = false;
  isLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadGameState(gameId: string) {
    this.isLoading = true;
    try {
      const res = await fetch(`/api/games/${gameId}`);
      if (!res.ok) throw new Error("Error fetching game state");
      const gameData = await res.json();

      runInAction(() => {
      this.playersStore.setPlayers(gameData.players);
      this.handsStore.setHands(gameData.hands, this.playersStore.players);
      this.deckStore.setDeck(gameData.deck);
      this.deckStore.setDiscardPile(gameData.discardPile);
      this.fieldStore.setField(gameData.field);
      this.phaseStore.setPhaseData({
        currentTurn: gameData.currentTurn,
        currentPhase: gameData.currentPhase,
        phaseAction: gameData.phaseAction,
        status: gameData.status,
        turnCounter: gameData.turnCounter,
        winningSoulPoints: gameData.winningSoulPoints,
      });
      this.isLoaded = true;
    });
    } catch (error) {
      console.error("Error loading game state:", error);
      runInAction(() => {
        this.isLoaded = false;
      });
    } finally {
      runInAction(() => {
      this.isLoading = false;
    });
  }
}
}

const gameStore = new GameStore();
export default gameStore;
