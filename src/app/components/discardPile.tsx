import { makeAutoObservable } from "mobx";
import Card from "./card";


class DiscardPile {
    cards: Card[] = [];

constructor() {
    makeAutoObservable(this);
}

    addCard(card: Card) {
        this.cards.push(card);
    }

    addCards(cards: Card[]) {
        this.cards.push(...cards);
    }
    
}
export default new DiscardPile();