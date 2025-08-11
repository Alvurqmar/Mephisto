import { makeAutoObservable } from "mobx";
import Hand from "../models/hand";
import Player from "../models/player";
import Card from "../models/card";

class HandStore {
  hands: Record<string, Hand> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setHands(handsData: Record<string, any[]>, players: Record<string, Player>) {
    this.hands = Object.fromEntries(
      Object.entries(handsData).map(([playerKey, cardsData]) => {
        const hand = new Hand();
        hand.setPlayer(players[playerKey]);
        hand.setCards(cardsData.map(Card.deserialize));
        return [playerKey, hand];
      })
    );
  }

  updateHand(playerKey: string, cardsData: any[], player: Player) {
    const hand = new Hand();
    hand.setPlayer(player);
    hand.setCards(cardsData);
    this.hands[playerKey] = hand;
  }
}

export default new HandStore();
