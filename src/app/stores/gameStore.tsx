import { makeAutoObservable, runInAction } from "mobx";
import Card, { CardData } from "../models/card";
import Field from "../models/field";
import Hand from "../models/hand";
import Player from "../models/player";
import DiscardPile from "../models/discardPile";

export type Phase = "Main Phase" | "Action Phase" | "End Phase";
export type Action = "Loot" | "Fight" | "Summon" | null;
export type Status = "Playing" | "Finished";

class GameStore {
  deck: Card[] = [];
  discardPile: DiscardPile = new DiscardPile();
  hands: Record<string, Hand> = {};
  currentTurn: string = "";
  currentPhase: Phase = "Main Phase";
  phaseAction: Action = null;
  players: Record<string, Player> = {};
  field: Field = new Field(3, 6);
  turnCounter: number = 1;
  winningSoulPoints: number = 15;
  status: Status = "Playing";

  constructor() {
    makeAutoObservable(this);
  }

  async loadCards() {
    try {
      const res = await fetch("/api/seedCards");
      const data = await res.json();
      const cards = data.map(Card.deserialize);

      runInAction(() => {
        this.deck = cards;
      });

      console.log("Cartas cargadas:", this.deck);
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  }

  async loadGameState(gameId: string) {
    try {
      const res = await fetch(`/api/games/${gameId}`);
      if (!res.ok) {
        throw new Error(`Error fetching game state: ${res.statusText}`);
      }

      const gameData = await res.json();

      runInAction(() => {
        this.players = Object.fromEntries(
          Object.entries(gameData.players).map(([key, playerData]) => [
            key,
            Player.deserialize(playerData),
          ])
        );
        this.hands = Object.fromEntries(
          Object.entries(gameData.hands as Record<string, CardData[]>).map(
            ([playerKey, cards]) => {
              const hand = new Hand();
              hand.setPlayer(this.players[playerKey]);
              hand.setCards(cards.map(Card.deserialize));
              return [playerKey, hand];
            }
          )
        );

        this.deck = gameData.deck.map(Card.deserialize);

        this.discardPile.clear();
        if (gameData.discardPile) {
          this.discardPile.addCards(gameData.discardPile.map(Card.deserialize));
        }

        this.field = Field.deserialize(gameData.field);
        this.currentTurn = gameData.currentTurn;
        this.currentPhase = gameData.currentPhase;
        this.phaseAction = gameData.phaseAction;
        this.turnCounter = gameData.turnCounter;
        this.winningSoulPoints = gameData.winningSoulPoints;
        this.status = gameData.status;
      });

      console.log("Estado de la partida cargado:", this);
    } catch (error) {
      console.error("Error loading game state:", error);
    }
  }

  shuffle(cards: Card[]): Card[] {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getOpponents(player: Player | string): Player[] {
    const playerKey =
      typeof player === "string"
        ? player
        : Object.keys(this.players).find((key) => this.players[key] === player);

    if (!playerKey) return [];

    return Object.entries(this.players)
      .filter(([key]) => key !== playerKey)
      .map(([, opponent]) => opponent);
  }

  restartDeck() {
    const discarded = this.discardPile.getCards;
    this.discardPile.clear();
    this.deck = this.shuffle([...discarded]);
  }

  checkVictory(player: Player) {
    if (player.soulPoints >= this.winningSoulPoints) {
      player.isWinner = true;
      this.status = "Finished";
    }
  }
}
const gameStore = new GameStore();
export default gameStore;
