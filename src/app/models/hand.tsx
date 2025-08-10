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
    cards.forEach((card) => {
      card.owner = this.player.key;
    });
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

  serialize() {
    return {
      cards: this.cards.map((card) => card.serialize()),
      player: this.player.serialize(),
    };
  }

  static deserialize(data: { cards: any[]; player: any }) {
    const hand = new Hand();
    hand.player = Player.deserialize(data.player);
    hand.cards = data.cards.map((cardData) => Card.deserialize(cardData));
    hand.cards.forEach((card) => (card.owner = hand.player.key));
    return hand;
  }
}

export default Hand;
