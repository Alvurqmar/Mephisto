import Card from "../../models/card";
import cardSelection from "./cardSelection";
import cardActions from "../actions/cardActions";
import { toast } from "react-toastify";
import fieldStore from "../fieldStore";
import phaseStore from "../phaseStore";
import handStore from "../handStore";

export function selectTarget(
  filter: (card: Card) => boolean,
): Promise<Card | null> {
  return new Promise((resolve) => {
    cardSelection.startSelection(filter, resolve);
  });
}

export function selectCardFromHand(
  filter: (card: Card) => boolean = () => true
): Promise<Card | null> {
  return new Promise((resolve) => {
    cardSelection.startHandSelection(filter, resolve);
  });
}

export async function selectCardInRow(
  row: number,
  excludeCard?: Card,
  typeCheck?: (c: Card) => boolean
): Promise<Card | null> {
  return await selectTarget(card => {
    const pos = cardActions.cardPos(card);
    if (!pos || pos.row !== row) return false;
    if (excludeCard && card === excludeCard) return false;
    if (typeCheck && !typeCheck(card)) return false;
    return true;
  });
}

export async function swapCardsHandField(
  triggerCard: Card,
  handFilter: (c: Card) => boolean
): Promise<boolean> {
  const hand = handStore.hands[phaseStore.currentTurn];
  const pos = cardActions.cardPos(triggerCard);
  if (!pos) return false;

  const fieldCard = await selectCardInRow(pos.row, triggerCard);
  if (!fieldCard) return false;

  const handCards = hand.cards.filter(handFilter);
  if (handCards.length === 0) {
    toast.error("No tienes cartas válidas en tu mano para intercambiar.");
    return false;
  }

  const handCard = await selectTarget(card => handCards.includes(card));
  if (!handCard) return false;

  const fieldCardPos = cardActions.cardPos(fieldCard);
  if (!fieldCardPos) return false;

  hand.removeCard(handCard);
  fieldStore.field.slots[fieldCardPos.row][fieldCardPos.col].card = null;

  hand.addCard(fieldCard);
  fieldStore.field.slots[fieldCardPos.row][fieldCardPos.col].card = handCard;

  toast.success(`Intercambiaste ${handCard.name} por ${fieldCard.name} en la fila ${pos.row + 1}`);
  return true;
}
