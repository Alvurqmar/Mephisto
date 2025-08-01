import { makeAutoObservable, runInAction } from "mobx";
import Card from "../models/card";
import Player from "../models/player";
import Hand from "../models/hand";
import Field from "../models/field";

export type Phase = "Main Phase" | "Action Phase" | "End Phase";
export type Action = "Loot" | "Fight" | "Summon" | null;

class GameStore {
  deck: Card[] = [];
  hands: Record<string, Hand> = {};
  currentTurn: string = "";
  currentPhase: Phase = "Main Phase";
  phaseAction: Action = null;
  players: Record<string, Player> = {};
  field: Field = new Field(6, 4);
  turnCounter: number = 0;

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
  setFieldOwners2P = (field: Field) => {
    const rows = field.rows;
    const cols = field.columns;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 2; col++) {
        field.setOwner(row, col, "p1");
      }

      for (let col = 2; col < 4; col++) {
        field.setOwner(row, col, null);
      }

      for (let col = 4; col < 6; col++) {
        field.setOwner(row, col, "p2");
      }
    }
  };

  initGame() {
    const playerKeys = Object.keys(this.players);
    const cards: Card[] = this.deck.map((data) => new Card(data));
    const shuffled = [...cards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.deck = shuffled;

    if (playerKeys.length === 2) {
      playerKeys.forEach((key, index) => {
        const player = this.players[key];
        const hand = new Hand();
        this.hands[key] = hand;

        hand.setPlayer(player);
        hand.setCards(
          this.deck.splice(0, index === 0 ? 3 : 4).map((card) => {
            card.owner = key;
            return card;
          })
        );
      });
      this.players["p1"].favorPoints = 3;
      this.players["p2"].favorPoints = 5;

      this.field = new Field(3, 6);
      this.setFieldOwners2P(this.field);
      let cardsToPlace = this.deck.splice(0, 6);
      let placed = 0;
      for (let row = 0; row < this.field.rows; row++) {
        for (let col = 0; col < this.field.columns; col++) {
          const slot = this.field.slots[row][col];
          if (slot.owner === null && placed < cardsToPlace.length) {
            this.field.setCard(row, col, cardsToPlace[placed]);
            placed++;
          }
        }
      }
    } else {
      console.error(
        "El número de jugadores debe ser 2 para iniciar el juego POR AHORA"
      );
    }
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
}
const gameStore = new GameStore();
export default gameStore;
