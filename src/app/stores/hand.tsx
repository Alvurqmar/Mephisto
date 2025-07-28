import { makeAutoObservable } from "mobx";
import Card from "../models/card";
import Player from "../models/player";

class Hand {
  cards: Card[] = [];
  player: Player = new Player("");

  constructor() {
    makeAutoObservable(this);
  }

  updateHand(cards: Card[]) {
    this.cards = cards;
  }

  setPlayer(player: Player) {
    this.player = player;
  }

  removeCard(card: Card) {
    const index = this.cards.findIndex((c) => c.id === card.id);
    if (index !== -1) {
      this.cards.splice(index, 1);
    }
  }
  addCard(card: Card) {
    this.cards.push(card);
  }
}

export default Hand;
