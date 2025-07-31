import { makeAutoObservable } from "mobx";
import Card from "./card";
import Player from "./player";

class Hand {
  cards: Card[] = [];
  player: Player = new Player("", "");

  constructor() {
    makeAutoObservable(this);
  }

  setCards(cards: Card[]) {
    cards.forEach((card) => {card.owner = this.player.key })
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
     card.owner = this.player.key;
    this.cards.push(card);
  }
}

export default Hand;
