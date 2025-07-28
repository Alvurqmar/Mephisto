import { makeAutoObservable } from "mobx";
import gameStore, { Action, Phase } from "./gameStore";
import Card from "./card";
import { toast } from "react-toastify";
import discardPile from "./discardPile";

class GameActions {
  selectedCard: Card | null = null;
  discardSelection: Card[] = [];
  discardModal = false;
  pendingSlot: { row: number; col: number } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  fightState = {
    selectedRow: null as number | null,
    selectedMonsters: [] as Card[],
    selectedWeapons: [] as Card[],
    favorSpent: 0,
    isActive: false,
  };

  selectCard(card: Card | null) {
    this.selectedCard = card;
    this.discardSelection = [];
    this.discardModal = false;
  }

  setPhaseAction(action: Action) {
    if (
      action === "Summon" &&
      gameStore.hands[gameStore.currentTurn].cards.filter((c) => c.type === "MONSTER").length === 0
    ) {
      toast.error("No tienes Monstruos para invocar.");
      return;
    }
    gameStore.phaseAction = action;
  }

  changePhase() {
    const keys = Object.keys(gameStore.players);
    const currentIndex = keys.indexOf(gameStore.currentTurn);

    switch (gameStore.currentPhase) {
      case "Main Phase":
        gameStore.currentPhase = "Action Phase";
        gameStore.phaseAction = null;
        break;
      case "Action Phase":
        gameStore.phaseAction = null;
        gameStore.currentPhase = "End Phase";
        break;
      case "End Phase":
        gameActions.endTurn();
        gameStore.turnCounter++;
        gameStore.currentPhase = "Main Phase";
        gameStore.currentTurn = keys[(currentIndex + 1) % keys.length];
        break;
    }
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
  //TODO: Que al lootear no se cancele la seleccion en caso de error
  lootField(row: number, col: number) {
    const slot = gameStore.field.getSlot(row, col);
    const currentPlayerHand = gameStore.hands[gameStore.currentTurn];

    if (!slot || !slot.card) {
      toast.error("No hay carta en esa posición.");
      return;
    }

    if (slot.owner !== null && slot.owner !== gameStore.currentTurn) {
      toast.error("No puedes robar cartas del lado de otro jugador.");
      return;
    }

    if (slot.owner === null && slot.card.type === "MONSTER") {
      toast.error("No puedes robar monstruos.");
      return;
    }
    
    currentPlayerHand.addCard(slot.card);
    slot.card = null;
    toast.success(`Looteaste con éxito`);
  }

  lootDeck() {
    const currentPlayerHand = gameStore.hands[gameStore.currentTurn];
    const deck = gameStore.deck;

    if (deck.length === 0) {
      toast.error("El mazo está vacío.");
      return;
    }

    const drawnCard = deck.splice(0, 1)[0];
    currentPlayerHand.addCard(drawnCard);
    toast.success(`Looteaste con éxito`);
  }

  summon(row: number, col: number) {
    const slot = gameStore.field.slots[row][col];
    const selectedCard = this.selectedCard;

    if (!selectedCard || selectedCard.type !== "MONSTER") return;

    const previousCard = slot.card;
    slot.card = selectedCard;
    slot.owner = gameStore.currentTurn;

    const hand = gameStore.hands[gameStore.currentTurn];
    hand.removeCard(selectedCard);

    if (previousCard) {
      gameStore.hands[gameStore.currentTurn].addCard(previousCard);
    }
    gameStore.players[gameStore.currentTurn].updateFP(3);
    toast.success(`Invocaste con éxito`);
  }

  endTurn() {
    if (gameStore.deck.length > 0) {
      const card = gameStore.deck.shift()!;
      gameStore.hands[gameStore.currentTurn].addCard(card);
    }
    for (let row = 0; row < gameStore.field.slots.length; row++) {
      for (let col = 0; col < gameStore.field.slots[row].length; col++) {
        const slot = gameStore.field.slots[row][col];
        if (slot.owner === null && !slot.card && gameStore.deck.length > 0) {
          const card = gameStore.deck.pop()!;
          slot.card = card;
          slot.owner = null;
        }
      }
    }

    toast.success(`Turno finalizado`);
  }

  startFight(row: number) {
  this.fightState = {
    selectedRow: row,
    selectedMonsters: [],
    selectedWeapons: [],
    favorSpent: 0,
    isActive: true,
  };
}

toggleMonster(card: Card) {
  const selected = this.fightState.selectedMonsters;
  const index = selected.findIndex((c) => c.id === card.id);
  if (index !== -1) {
    selected.splice(index, 1);
  } else {
    selected.push(card);
  }
}

toggleWeapon(card: Card) {
  const selected = this.fightState.selectedWeapons;
  const index = selected.findIndex((c) => c.id === card.id);
  if (index !== -1) {
    selected.splice(index, 1);
  } else {
    selected.push(card);
  }
}

setFavorSpent(amount: number) {
  const player = gameStore.players[gameStore.currentTurn];
  if (amount <= player.favorPoints) {
    this.fightState.favorSpent = amount;
  } else {
    toast.error("No tienes suficiente Favor.");
  }
}

confirmFight() {
  const { selectedRow, selectedMonsters, selectedWeapons, favorSpent } = this.fightState;
  if (selectedRow === null) return;

  const fieldRow = gameStore.field.slots[selectedRow];
  const player = gameStore.players[gameStore.currentTurn];
  const hand = gameStore.hands[gameStore.currentTurn];

  const validMonsters = fieldRow
    .map((slot) => slot.card)
    .filter((card) => card?.type === "MONSTER");

  for (const monster of selectedMonsters) {
    if (!validMonsters.find((m) => m?.id === monster.id)) {
      toast.error("Has seleccionado monstruos inválidos.");
      return;
    }
  }

  const weaponAttack = selectedWeapons.reduce((sum, w) => sum + w.attack, 0);
  const totalAttack = weaponAttack + favorSpent;
  const totalMonsterAttack = selectedMonsters.reduce((sum, m) => sum + m.attack, 0);

  if (totalAttack < totalMonsterAttack) {
    toast.error("Tu ataque no es suficiente.");
    return;
  }

  selectedWeapons.forEach((weapon) => {
    weapon.durability -= 1;
  });

  player.updateFP(-favorSpent);

  selectedMonsters.forEach((monster) => {
    player.updateSP(monster.soulpts);

    for (const slot of fieldRow) {
      if (slot.card?.id === monster.id) {
        slot.card = null;
        break;
      }
    }
  });
  if (selectedMonsters.length > 0) {
  toast.success("¡Combate exitoso! Has obtenido puntos de alma.");

  this.fightState = {
    selectedRow: null,
    selectedMonsters: [],
    selectedWeapons: [],
    favorSpent: 0,
    isActive: false,
  }
  }else{
  toast.error("No has seleccionado monstruos para combatir.");
  };
}
cancelFight() {
  this.fightState = {
    selectedRow: null,
    selectedMonsters: [],
    selectedWeapons: [],
    favorSpent: 0,
    isActive: false,
  };
}

}

const gameActions = new GameActions();
export default gameActions;
