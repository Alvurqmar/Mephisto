import { makeAutoObservable } from "mobx";
import Card from "../../models/card";

class CardSelectionStore {
  active = false;
  filter: ((card: Card) => boolean) | null = null;
  onSelect: ((card: Card | null) => void) | null = null;
  handActive = false;
  handFilter: ((card: Card) => boolean) | null = null;
  handOnSelect: ((card: Card | null) => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  startSelection(
    filter: (card: Card) => boolean,
    onSelect: (card: Card | null) => void
  ) {
    this.active = true;
    this.filter = filter;
    this.onSelect = onSelect;
  }

  clearSelection() {
    this.active = false;
    this.filter = null;
    this.onSelect = null;

    this.clearHandSelection();
  }

  select(card: Card | null) {
    if (!this.active) return;
    if (this.filter && card && !this.filter(card)) return;

    if (this.onSelect) {
      this.onSelect(card);
    }
    this.clearSelection();
  }
  startHandSelection(
    filter: (card: Card) => boolean,
    onSelect: (card: Card | null) => void
  ) {
    this.handActive = true;
    this.handFilter = filter;
    this.handOnSelect = onSelect;
  }

  clearHandSelection() {
    this.handActive = false;
    this.handFilter = null;
    this.handOnSelect = null;
  }

  selectFromHand(card: Card | null) {
    if (!this.handActive) return;
    if (this.handFilter && card && !this.handFilter(card)) return;

    if (this.handOnSelect) {
      this.handOnSelect(card);
    }
    this.clearHandSelection();
  }
}

const cardSelection = new CardSelectionStore();
export default cardSelection;
