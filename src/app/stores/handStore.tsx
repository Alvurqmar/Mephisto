import { makeAutoObservable } from "mobx";
import Hand from "../models/hand";
import Player from "../models/player";
import Card, { CardData } from "../models/card";

class HandStore {
  hands: Record<string, Hand> = {};

  constructor() {
    makeAutoObservable(this);
  }

  setHands(handsData: Record<string, CardData[]>, players: Record<string, Player>) {
    this.hands = Object.fromEntries(
      Object.entries(handsData).map(([playerKey, cardsData]) => {
        const hand = new Hand();
        hand.setPlayer(players[playerKey]);
        hand.setCards(cardsData.map(Card.deserialize));
        return [playerKey, hand];
      })
    );
  }
}

const handStore = new HandStore();
export default handStore;
