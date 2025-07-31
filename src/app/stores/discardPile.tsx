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
}
export default new DiscardPile();
