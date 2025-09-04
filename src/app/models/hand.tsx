import { makeAutoObservable } from "mobx";
import Card, { CardData } from "./card";
import Player, { PlayerData } from "./player";

class Hand {
  cards: Card[] = [];
  player: Player = new Player("", "");

  constructor(cards: Card[] = [], player: Player = new Player("", "")) {
    this.cards = cards;
    this.player = player;
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

  static deserialize(data: {
    cards: CardData[];
    playerKey: string;
    playerData: PlayerData;
  }) {
    const hand = new Hand();
    hand.player = Player.deserialize(data.playerKey, data.playerData);
    hand.cards = data.cards.map((cardData) => Card.deserialize(cardData));
    hand.cards.forEach((card) => (card.owner = hand.player.key));
    return hand;
  }
}

export default Hand;
