import { makeAutoObservable, runInAction } from "mobx";
import Card from "../models/card";
import DiscardPile from "../models/discardPile";

class DeckStore {
  deck: Card[] = [];
  discardPile: DiscardPile = new DiscardPile();

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
    } catch (error) {
      console.error("Error loading cards:", error);
    }
  }

  setDeck(deckData: any[]) {
    this.deck = deckData.map(Card.deserialize);
  }

  setDiscardPile(discardData: any[]) {
    this.discardPile.clear();
    this.discardPile.addCards(discardData.map(Card.deserialize));
  }

  shuffle() {
    const shuffled = [...this.deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    this.deck = shuffled;
  }

  restartDeck() {
    const discarded = this.discardPile.getCards;
    this.discardPile.clear();
    this.deck = discarded;
    this.shuffle();
  }
}

export default new DeckStore();
