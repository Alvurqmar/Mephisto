import playerStore from "./playerStore";
import handStore from "./handStore";
import deckStore from "./deckStore";
import fieldStore from "./fieldStore";
import phaseStore from "./phaseStore";

class GameStore {
  playersStore = playerStore;
  handsStore = handStore;
  deckStore = deckStore;
  fieldStore = fieldStore;
  phaseStore = phaseStore;

  async loadGameState(gameId: string) {
    const res = await fetch(`/api/games/${gameId}`);
    if (!res.ok) throw new Error("Error fetching game state");
    const gameData = await res.json();

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
  }
}

const gameStore = new GameStore();
export default gameStore;
