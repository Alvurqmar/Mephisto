import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import Card, { CardType, EffectType } from "../../models/card";
import fieldStore, { cardInField, getCard } from "../fieldStore";
import handStore from "../handStore";
import phaseStore from "../phaseStore";
import { handleETBEffect } from "@/app/lib/gameHelpers/effects/cardEffect";
import { updateCard } from "@/app/lib/gameHelpers/card";

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
    if (this.discardSelection.some((c) => c.id === card.id)) {
      this.discardSelection = this.discardSelection.filter(
        (c) => c.id !== card.id
      );
    } else {
      this.discardSelection.push(card);
    }
  }

  playCard(row: number, col: number, gameId: string, externalCard?: Card) {
    const slot = fieldStore.field.getSlot(row, col);
    const hand = handStore.hands[phaseStore.currentTurn];
    const card = externalCard ?? this.selectedCard;

    if (!card) {
      toast.error("No hay una carta seleccionada.");
      return false;
    }

    if (cardInField(fieldStore.field, card.id)) {
      toast.error("Carta ya en el campo.");
      return false;
    }

    if (card?.owner !== phaseStore.currentTurn) {
      toast.error("No es tu turno.");
      return false;
    }

    if (phaseStore.currentPhase !== "Main Phase") {
      toast.error("Solo puedes jugar cartas durante la Main Phase.");
      return false;
    }

    if (!slot) {
      toast.error("Casilla inválida o vacía.");
      return false;
    }

    if (slot.card) {
      toast.error("Ya hay una carta en esta casilla.");
      return false;
    }

    if (slot.owner !== card.owner) {
      toast.error("Solo puedes jugar cartas en tus propias casillas.");
      return false;
    }

    if (card.type === "MONSTER") {
      toast.error("Solo puedes jugar cartas de Monstruo con la acción Summon.");
      return false;
    }

    const cost = card.cost;

    if (cost === 0) {
      this.pendingSlot = { row, col };
      this.discardModal = false;
      this.sendPlayRequest(row, col, gameId, []);
      return true;
    }

    const otherCards = hand.cards.filter((c) => c.id !== card.id);

    if (otherCards.length < cost) {
      toast.error(`Necesitas descartar ${cost} carta/s para jugar esta carta.`);
      return false;
    }

    this.pendingSlot = { row, col };
    this.discardModal = true;
    return false;
  }

  async sendPlayRequest(
    row: number,
    col: number,
    gameId: string,
    discardIds: number[]
  ) {
    if (!this.selectedCard) return;

    const selectedCard = this.selectedCard;
    const hasETBEffect = selectedCard.effectType === EffectType.ETB;

    const res = await fetch(`/api/games/${gameId}/actions/playDiscard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: phaseStore.currentTurn,
        cardId: this.selectedCard.id,
        row,
        col,
        discardIds,
      }),
    });

    if (res.ok) {
      toast.success("Carta jugada correctamente.");

      if (selectedCard.type === CardType.SPELL) {
        const wand = getCard(fieldStore.field, 34);
        if (wand) {
          await updateCard(gameId, wand.id, { attack: 3 });
        }
      }
      
      if (hasETBEffect) {
        await handleETBEffect(selectedCard, gameId);
      }
      this.selectCard(null);
      this.discardSelection = [];
      this.pendingSlot = null;
      this.discardModal = false;
    } else {
      const error = await res.json();
      toast.error(error.error);
    }
  }

  confirmDiscard(gameId: string) {
    if (!this.pendingSlot) return;
    const { row, col } = this.pendingSlot;
    const discardIds = this.discardSelection.map((c) => c.id);
    this.sendPlayRequest(row, col, gameId, discardIds);
  }

  cancelDiscard = () => {
    this.discardSelection = [];
    this.discardModal = false;
    this.pendingSlot = null;
  };
}

const cardActions = new CardActions();
export default cardActions;
