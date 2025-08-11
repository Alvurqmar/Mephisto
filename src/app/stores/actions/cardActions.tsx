import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import Card, { EffectType } from "../../models/card";
import effectResolver from "../cardEffects/effectResolver";
import DiscardPile from "../../models/discardPile";
import fieldStore from "../fieldStore";
import handStore from "../handStore";
import phaseStore from "../phaseStore";

class CardActions {
  selectedCard: Card | null = null;
  discardSelection: Card[] = [];
  discardModal = false;
  pendingSlot: { row: number; col: number } | null = null;
  discardPile: DiscardPile = new DiscardPile();

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

  playCard(row: number, col: number, externalCard?: Card) {
    const slot = fieldStore.field.getSlot(row, col);
    const hand = handStore.hands[phaseStore.currentTurn];
    const card = externalCard ?? this.selectedCard;

    if (!slot) {
      return false;
    }
    if (slot.card) {
      return false;
    }

    if (!card) {
      toast.error("No hay una carta seleccionada.");
      return false;
    }

    const isCardInHand = hand.cards.some((c) => c.id === card.id);

    if (!isCardInHand && !externalCard) {
      toast.error("Solo puedes jugar cartas que estén en tu mano.");
      return false;
    }

    if (slot.owner !== card.owner) {
      toast.error("Solo puedes jugar cartas en tus propias casillas.");
      return false;
    }

    if (phaseStore.currentPhase !== "Main Phase") {
      toast.error("Solo puedes jugar cartas durante la Fase Principal.");
      return false;
    }

    if (card.type === "MONSTER") {
      toast.error("No puedes jugar cartas de tipo MONSTER en esta fase.");
      return false;
    }

    const cost = card.cost;
    //TODO Si el hechizo tiene coste debe pagarse
    if (card.type === "SPELL") {
      this.discardPile.addCards([card]);
      if (!externalCard) hand.removeCard(card);
      this.selectCard(null);
      toast.success("Carta de hechizo jugada y enviada a descartes.");
      return true;
    }

    if (cost === 0) {
      slot.card = card;
      if (!externalCard) hand.removeCard(card);
      this.selectCard(null);
      return true;
    }

    const otherCards = hand.cards.filter((c) => c.id !== card.id);

    if (otherCards.length < cost) {
      toast.error(`Necesitas descartar ${cost} cartas para jugar esta carta.`);
      return false;
    }

    this.pendingSlot = { row, col };
    this.discardModal = true;
    return false;
  }

  confirmDiscard(row: number, col: number) {
    const hand = handStore.hands[phaseStore.currentTurn];
    const card = this.selectedCard;
    const slot = fieldStore.field.getSlot(row, col);

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
    this.discardPile.addCards(this.discardSelection);

    slot.card = card;
    hand.removeCard(card);
    if (card.effectType == EffectType.ETB) {
      effectResolver.trigger(card);
    }
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

  slotIsOwned = (card: Card) => {
    for (let row = 0; row < fieldStore.field.rows; row++) {
      for (let col = 0; col < fieldStore.field.columns; col++) {
        const slot = fieldStore.field.slots[row][col];
        if (slot.card === card && slot.owner === card.owner) {
          return true;
        }
      }
    }
    return false;
  };

  cardPos = (card: Card) => {
    for (let row = 0; row < fieldStore.field.rows; row++) {
      for (let col = 0; col < fieldStore.field.columns; col++) {
        if (fieldStore.field.slots[row][col].card === card) {
          return { row, col };
        }
      }
    }
  };
}
const cardActions = new CardActions();
export default cardActions;
