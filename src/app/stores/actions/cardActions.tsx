import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import Card, { EffectType } from "../../models/card";
import fieldStore from "../fieldStore";
import handStore from "../handStore";
import phaseStore from "../phaseStore";
import {
  effects,
  EffectWithTargets,
  fetchCardEffect,
} from "@/app/lib/gameHelpers/effects/cardEffect";
import targetStore from "../targetStore";

class CardActions {
  selectedCard: Card | null = null;
  discardSelection: Card[] = [];
  discardModal = false;
  pendingSlot: { row: number; col: number } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private async handleETBEffect(card: Card, gameId: string) {
    if (!card.effectId) {
      console.warn("Card has no effect ID.");
      return;
    }

    const effect = effects[
      card.effectId as keyof typeof effects
    ] as EffectWithTargets;

    if (!effect) {
      console.warn(`Effect ${card.effectId} not found.`);
      return;
    }

    if (effect.requiresTarget) {
      targetStore.openTargetModal(
        effect.targetRequirements!,
        async (targets: Card[]) => {
          try {
            await fetchCardEffect(
              phaseStore.currentTurn,
              card.effectId,
              card.id.toString(),
              gameId,
              targets
            );
          } catch (error) {
            console.error("Failed to activate effect:", error);
            toast.error("Error al activar el efecto de la carta.");
          }
        }
      );
    } else {
      try {
        await fetchCardEffect(
          phaseStore.currentTurn,
          card.effectId,
          card.id.toString(),
          gameId
        );
      } catch (error) {
        console.error("Failed to activate effect:", error);
        toast.error("Error al activar el efecto de la carta.");
      }
    }
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

    if (!slot) {
      toast.error("Casilla inválida o vacía.");
      return false;
    }

    if (slot.card) {
      toast.error("Ya hay una carta en esta casilla.");
      return false;
    }

    if (!card) {
      toast.error("No hay una carta seleccionada.");
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

  async sendPlayRequest(row: number, col: number, gameId: string, discardIds: number[]) {
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
      if (hasETBEffect) {
      await this.handleETBEffect(selectedCard, gameId);
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