import { makeAutoObservable } from "mobx";
import gameStore from "../gameStore";
import Card from "../../models/card";
import { toast } from "react-toastify";
import discardPile from "../discardPile";

class CardActions {
  selectedCard: Card | null = null;
  discardSelection: Card[] = [];
  discardModal = false;
  pendingSlot: { row: number; col: number } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  selectCard(card: Card | null) {
    this.selectedCard = card;
    this.discardSelection = [];
    this.discardModal = false;
  }

  toggleDiscardCard(card: Card) {
    if (this.discardSelection.includes(card)) {
      this.discardSelection = this.discardSelection.filter(
        (c) => c.id !== card.id
      );
    } else {
      this.discardSelection.push(card);
    }
  }

  playCard(row: number, col: number) {
    const slot = gameStore.field.getSlot(row, col);
    const hand = gameStore.hands[gameStore.currentTurn];
    const card = this.selectedCard;

    if (!slot) {
      toast.error("No se encontró la casilla en el campo.");
      return;
    }

    if (slot.card) {
      toast.error("Esta casilla ya tiene una carta.");
      return;
    }

    if (!card) {
      toast.error("No hay una carta seleccionada.");
      return;
    }
    const isCardInHand = hand.cards.some((c) => c.id === card.id);
    if (!isCardInHand) {
      toast.error("Solo puedes jugar cartas que estén en tu mano.");
      return;
    }

    if (slot.owner !== gameStore.currentTurn) {
      toast.error("Solo puedes jugar cartas en tus propias casillas.");
      return;
    }

    if (gameStore.currentPhase !== "Main Phase") {
      toast.error("Solo puedes jugar cartas durante la Fase Principal.");
      return;
    }

    if (card.type === "MONSTER") {
      toast.error("No puedes jugar cartas de tipo MONSTER en esta fase.");
      return;
    }

    const cost = card.cost;

    if (card.type === "SPELL") {
      discardPile.addCard(card);
      hand.removeCard(card);
      this.selectCard(null);
      toast.success("Carta de hechizo jugada y enviada a descartes.");
      return;
    }

    if (cost === 0) {
      slot.card = card;
      hand.removeCard(card);
      this.selectCard(null);
      return;
    }

    const otherCards = hand.cards.filter((c) => c.id !== card.id);

    if (otherCards.length < cost) {
      toast.error(`Necesitas descartar ${cost} cartas para jugar esta carta.`);
      return;
    }

    this.pendingSlot = { row, col };
    this.discardModal = true;
  }

  confirmDiscard(row: number, col: number) {
    const hand = gameStore.hands[gameStore.currentTurn];
    const card = this.selectedCard;
    const slot = gameStore.field.getSlot(row, col);

    if (!card || !slot) return;

    const cost = card.cost;

    const isCardInHand = hand.cards.some((c) => c.id === card.id);
    if (!isCardInHand) {
      toast.error("Solo puedes jugar cartas que estén en tu mano.");
      return;
    }
    if (this.discardSelection.length !== cost) {
      alert(`Debes seleccionar exactamente ${cost} cartas para descartar.`);
      return;
    }

    this.discardSelection.forEach((c) => hand.removeCard(c));
    discardPile.addCards(this.discardSelection);

    slot.card = card;
    hand.removeCard(card);

    this.discardModal = false;
    this.discardSelection = [];
    this.pendingSlot = null;
    this.selectCard(null);
  }

  cancelDiscard() {
    this.discardModal = false;
    this.discardSelection = [];
    this.pendingSlot = null;
  }
}
const cardActions = new CardActions();
export default cardActions;
