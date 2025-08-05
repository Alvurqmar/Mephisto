import Card, { CardType, EffectType } from "@/app/models/card";
import { toast } from "react-toastify";
import cardActions from "../actions/cardActions";
import gameStore from "../gameStore";
import { selectCardFromHand, selectCardInRow, selectTarget, swapCardsHandField, } from "./helpers";
import discardPile from "../../models/discardPile";
import effectResolver from "./effectResolver";

const AA: Record<
  string,
  (triggerCard: Card, originalCard?: Card) => Promise<boolean> | boolean
> = {
  MPE(triggerCard: Card) {
    const topCard = gameStore.deck.shift();
    if (!topCard) return false;

    toast.info(`Revelaste: ${topCard.name} (${topCard.type})`);
    gameStore.deck.push(topCard);

    const currentPlayer = gameStore.players[gameStore.currentTurn];
    const currentHand = gameStore.hands[gameStore.currentTurn];

    switch (topCard.type) {
      case CardType.SPELL:
        const drawn = gameStore.deck.shift();
        if (drawn) {
          currentHand.addCard(drawn);
          toast.success(`La carta revelada era un ${topCard.type}, robaste una carta.`);
        }
        break;
      case CardType.MONSTER:
        currentPlayer.updateFP(3);
        toast.success(`La carta revelada era un ${topCard.type}, ganaste 3 FP.`);
        break;
      case CardType.WEAPON:
      case CardType.ITEM:
        triggerCard.durability += 1;
        toast.success(`La carta revelada era un ${topCard.type}, este Item ha recuperado 1 durability.`);
        break;
    }

    return true;
  },

  PE(triggerCard: Card) {
    const pos = cardActions.cardPos(triggerCard);
    if (!pos) return false;

    const nonMonsters = gameStore.field.slots[pos.row].filter(
      s => s.card && s.card !== triggerCard && s.card.type !== CardType.MONSTER
    ).length;

    gameStore.players[gameStore.currentTurn].updateFP(1 + nonMonsters);
    toast.success(`Has ganado ${1 + nonMonsters} FP.`);
    return true;
  },

  StewE(triggerCard: Card) {
    const pos = cardActions.cardPos(triggerCard);
    if (!pos) return false;

    const monsters = gameStore.field.slots[pos.row].filter(
      s => s.card && s.card !== triggerCard && s.card.type === CardType.MONSTER
    ).length;

    gameStore.players[gameStore.currentTurn].updateFP(1 + monsters * 2);
    toast.success(`Has ganado ${1 + monsters * 2} FP.`);
    return true;
  },

  async TalismanE(triggerCard: Card) {
    const validCards = (c: Card) => c !== triggerCard && c.effectType === EffectType.AA && !!c.effectId;
    const targetCard = await selectTarget(validCards);
    if (!targetCard) return false;

    const effectFn = AA[targetCard.effectId];
    if (!effectFn) {
      toast.error(`El efecto ${targetCard.effectId} no está implementado.`);
      return false;
    }

    toast.info(`Talisman copia el efecto ${targetCard.effectId} de ${targetCard.name}`);
    return await effectFn(triggerCard, targetCard);
  },

  async TorchE(triggerCard: Card) {
    const currentPlayer = gameStore.players[gameStore.currentTurn];
    const topCard = gameStore.deck.shift();
    if (!topCard) return false;

    const pos = cardActions.cardPos(triggerCard);
    if (!pos) return false;

    const targetCard = await selectTarget(card =>
      card && card !== triggerCard &&
      card.type !== CardType.MONSTER &&
      pos.row === cardActions.cardPos(card)?.row
    );

    if (!targetCard) return false;

    const targetPos = cardActions.cardPos(targetCard);
    if (!targetPos) return false;

    gameStore.field.slots[targetPos.row][targetPos.col].card = topCard;
    if(topCard.effectType == EffectType.ETB){effectResolver.trigger(topCard);}
    discardPile.addCards([targetCard]);

    currentPlayer.updateFP(2);
    toast.success(`Se ha puesto ${targetCard.name} al fondo de la biblioteca. Ganas 2 FP.`);
    return true;
  },

  async TCE(triggerCard: Card) {
    const player = gameStore.players[gameStore.currentTurn];
    const pos = cardActions.cardPos(triggerCard);
    if (!pos) return false;

    if (player.favorPoints <= 0) {
      triggerCard.isTapped = false;
      toast.error("No puedes activar esta carta, no tienes FP");
      return false;
    }

    player.updateFP(-1);
    const hand = gameStore.hands[gameStore.currentTurn];

    const targetCard = await selectTarget(card =>
      card && card !== triggerCard &&
      card.type !== CardType.MONSTER &&
      pos.row === cardActions.cardPos(card)?.row
    );

    if (!targetCard) return false;

    const posTarget = cardActions.cardPos(targetCard);
    if (!posTarget) return false;

    gameStore.field.slots[posTarget.row][posTarget.col].card = null;
    hand.addCard(targetCard);

    toast.success(`Pagaste 1 FP y robaste ${targetCard.name}`);
    return true;
  },

  async KeyE(triggerCard: Card) {
    const handCard = await selectCardFromHand();
    if (!handCard) return false;

    const pos = cardActions.cardPos(triggerCard);
    if (!pos) return false;

    const fieldCard = await selectCardInRow(pos.row, triggerCard);
    if (!fieldCard) return false;

    const hand = gameStore.hands[gameStore.currentTurn];
    const posField = cardActions.cardPos(fieldCard);
    if (!posField) return false;

    hand.removeCard(handCard);
    gameStore.field.slots[posField.row][posField.col].card = null;

    hand.addCard(fieldCard);
    gameStore.field.slots[posField.row][posField.col].card = handCard;

    toast.success(`Intercambiaste ${handCard.name} por ${fieldCard.name}`);
    return true;
  },

  async GrimoireE() {
    const player = gameStore.players[gameStore.currentTurn];
    const slots = gameStore.field.slots;

    const validSpells: Card[] = [];
    for (const row of slots) {
      for (const slot of row) {
        if (slot.card && slot.card.type === CardType.SPELL && slot.card.cost === 0) {
          validSpells.push(slot.card);
        }
      }
    }

    if (validSpells.length === 0) {
      toast.error("No hay cartas SPELL de coste 0 disponibles en el campo.");
      return false;
    }

    const spellToPlay = await selectTarget(card => validSpells.includes(card));
    if (!spellToPlay) return false;

    spellToPlay.owner = player.key;
    const posSpell = cardActions.cardPos(spellToPlay);

    for (let row = 0; row < slots.length; row++) {
      for (let col = 0; col < slots[row].length; col++) {
        const slot = slots[row][col];
        if (!slot.card && slot.owner === player.key) {
          if (posSpell) slots[posSpell.row][posSpell.col].card = null;
          const played = cardActions.playCard(row, col, spellToPlay);
          if (played) {
            toast.success(`Has jugado ${spellToPlay.name} desde el campo.`);
            return true;
          } else {
            toast.error("No se pudo jugar la carta seleccionada.");
            return false;
          }
        }
      }
    }

    toast.error("No hay casillas vacías disponibles para jugar la carta.");
    return false;
  },

  async ShovelE(triggerCard: Card) {
    return await swapCardsHandField(triggerCard, c => c.type === CardType.MONSTER);
  },

  async HookshotE() {
    const hand = gameStore.hands[gameStore.currentTurn];
    const targetCard = await selectTarget(card => card.type !== CardType.SPELL);
    if (!targetCard) return false;

    const pos = cardActions.cardPos(targetCard);
    if (!pos) return false;

    gameStore.field.slots[pos.row][pos.col].card = null;
    hand.addCard(targetCard);

    toast.success(`Has añadido ${targetCard.name} a tu mano.`);
    return true;
  },
};
export default AA;