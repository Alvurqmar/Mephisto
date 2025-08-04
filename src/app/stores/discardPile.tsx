import { makeAutoObservable } from "mobx";
import Card from "../models/card";

class DiscardPile {
  cards: Card[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addCards(cards: Card[]) {
    cards.forEach((card) => {
      card.owner = null;
    });
    this.cards.push(...cards);
  }

  get getCards(): Card[] {
    return this.cards;
  }

  clear() {
    this.cards = [];
  }
}

const discardPile = new DiscardPile();
export default discardPile;
