import { makeAutoObservable } from "mobx";
import Card, { CardData } from "../models/card";
import DiscardPile from "../models/discardPile";

class DeckStore {
  deck: Card[] = [];
  discardPile: DiscardPile = new DiscardPile();

  constructor() {
    makeAutoObservable(this);
  }

  setDeck(deckData: CardData[]) {
    this.deck = deckData.map(Card.deserialize);
  }

  setDiscardPile(discardData: CardData[]) {
    this.discardPile.clear();
    this.discardPile.addCards(discardData.map(Card.deserialize));
  }
}

const deckStore = new DeckStore();
export default deckStore;
