import { makeAutoObservable, runInAction } from "mobx";
import Card from "../models/card";
import Field from "../models/field";
import Hand from "../models/hand";
import Player from "../models/player";
import { Slot } from "../models/slot";
import discardPile from "./discardPile";

export type Phase = "Main Phase" | "Action Phase" | "End Phase";
export type Action = "Loot" | "Fight" | "Summon" | null;

class GameStore {
  deck: Card[] = [];
  hands: Record<string, Hand> = {};
  currentTurn: string = "";
  currentPhase: Phase = "Main Phase";
  phaseAction: Action = null;
  players: Record<string, Player> = {};
  field: Field = new Field(3, 6);
  turnCounter: number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  loadPlayers() {
    const stored = localStorage.getItem("mephisto-players");
    if (stored) {
      try {
        const parsed: {
          key: string;
          name: string;
          favorPoints: number;
          soulPoints: number;
        }[] = JSON.parse(stored);

        this.players = {};

        parsed.forEach(({ key, name, favorPoints, soulPoints }) => {
          const player = new Player(name, key);
          player.favorPoints = favorPoints;
          player.soulPoints = soulPoints;

          this.players[key] = player;
        });

        if (!this.currentTurn || !this.players[this.currentTurn]) {
          this.currentTurn = "p1";
        }

        console.log("Jugadores cargados:", this.players);
      } catch (e) {
        console.error("Error loading players from localStorage", e);
      }
    }
  }

  async loadCards() {
    try {
      const res = await fetch("/api/cards");
      const data = await res.json();
      const cards = data.map(
        (cardData: any) =>
          new Card({
            id: cardData.id,
            name: cardData.name,
            type: cardData.type,
            cost: cardData.cost,
            attack: cardData.attack,
            durability: cardData.durability,
            effectId: cardData.effectId,
            effectType: cardData.effectType,
            soulPts: cardData.soulPts,
          })
      );

      runInAction(() => {
        this.deck = cards;
      });

      console.log("Cartas cargadas:", this.deck);
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  }

  initGame() {
    const playerKeys = Object.keys(this.players);
    const cards: Card[] = this.deck.map((data) => new Card(data));
    const shuffled = [...cards];
    this.deck = this.shuffle(shuffled);

    playerKeys.forEach((key, index) => {
      const player = this.players[key];
      const hand = new Hand();
      this.hands[key] = hand;

      hand.setPlayer(player);

      const cardCount =
        playerKeys.length === 2 ? (index === 0 ? 3 : 4) : index + 2;

      const handCards = this.deck.splice(0, cardCount).map((card) => {
        card.owner = key;
        return card;
      });

      hand.setCards(handCards);
      player.updateFP(cardCount);
    });

    if (playerKeys.length === 2) {
      this.field = new Field(3, 6, "2P");
      this.field.setFieldOwners2P(this.field);

      const cardsToPlace = this.deck.splice(0, 6);
      let placed = 0;

      for (let row = 0; row < this.field.rows; row++) {
        for (let col = 0; col < this.field.columns; col++) {
          const slot = this.field.slots[row][col];
          if (
            slot instanceof Slot &&
            slot.owner === null &&
            placed < cardsToPlace.length
          ) {
            this.field.setCard(row, col, cardsToPlace[placed]);
            placed++;
          }
        }
      }

      this.players["p1"].favorPoints = 3;
      this.players["p2"].favorPoints = 5;
    } else {
      this.field = new Field(7, 7, "3-4P");
      this.field.setFieldOwners34P(this.field, playerKeys);
      const cardsToPlace = this.deck.splice(0, 6);
      let placed = 0;

      for (let row = 0; row < this.field.rows; row++) {
        for (let col = 0; col < this.field.columns; col++) {
          const slot = this.field.slots[row][col];
          if (
            slot instanceof Slot &&
            slot.owner === null &&
            placed < cardsToPlace.length
          ) {
            this.field.setCard(row, col, cardsToPlace[placed]);
            placed++;
          }
        }
      }
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
    const discarded = discardPile.getCards;
    discardPile.clear();
    this.deck = this.shuffle([...discarded]);
  }
}
const gameStore = new GameStore();
export default gameStore;
