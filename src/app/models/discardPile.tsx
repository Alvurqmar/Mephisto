import { makeAutoObservable } from "mobx";
import Card, { CardData } from "../models/card";
import { resetCard } from "../lib/gameHelpers/card";

class DiscardPile {
  cards: Card[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addCards(cards: Card[]) {
    cards.forEach((card) => {
      resetCard(card);
    });
    this.cards.push(...cards);
  }

  get getCards(): Card[] {
    return this.cards;
  }

  clear() {
    this.cards = [];
  }

  serialize() {
    return this.cards.map((card) => card.serialize());
  }

  static deserialize(data: CardData[]): DiscardPile {
    const discardPile = new DiscardPile();
    discardPile.cards = data.map((cardData) => Card.deserialize(cardData));
    return discardPile;
  }
}

export default DiscardPile;
