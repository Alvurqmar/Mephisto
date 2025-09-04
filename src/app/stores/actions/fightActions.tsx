import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import Card from "../../models/card";
import DiscardPile from "../../models/discardPile";
import playerStore from "../playerStore";
import phaseStore from "../phaseStore";
import fieldStore from "../fieldStore";

export interface Result {
  row: number;
  col: number;
  card: Card | null;
}
class FightActions {
  fightState = {
    targetSlots: [] as { row: number; col: number }[],
    selectedMonsters: [] as Card[],
    selectedWeapons: [] as Card[],
    favorSpent: 0,
    isActive: false,
  };
  discardPile: DiscardPile = new DiscardPile();

  constructor() {
    makeAutoObservable(this);
  }

  orientation(): { orientation: "rows" | "cols"; validIndexes: number[] } {
    const playerCount = Object.keys(playerStore.players).length;
    if (playerCount <= 2)
      return { orientation: "rows", validIndexes: [0, 1, 2] };

    let orientation: "rows" | "cols" = "rows";
    switch (phaseStore.currentTurn) {
      case "p1":
      case "p3":
        orientation = "cols";
        break;
      case "p2":
      case "p4":
        orientation = "rows";
        break;
    }

    return { orientation, validIndexes: [2, 3, 4] };
  }

  startFight(index: number) {
    const { orientation, validIndexes } = this.orientation();
    if (!validIndexes.includes(index)) return;

    const targetSlots: { row: number; col: number }[] = [];
    const { rows, columns } = fieldStore.field;

    if (orientation === "rows") {
      for (let col = 0; col < columns; col++)
        targetSlots.push({ row: index, col });
    } else {
      for (let row = 0; row < rows; row++)
        targetSlots.push({ row, col: index });
    }

    this.fightState = {
      targetSlots,
      selectedMonsters: [],
      selectedWeapons: [],
      favorSpent: 0,
      isActive: true,
    };
  }

  selectMonster(card: Card) {
    const selected = this.fightState.selectedMonsters;
    const index = selected.findIndex((c) => c.id === card.id);
    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(card);
    }
  }

  selectWeapon(card: Card) {
    const selected = this.fightState.selectedWeapons;
    const index = selected.findIndex((c) => c.id === card.id);
    if (index !== -1) {
      selected.splice(index, 1);
    } else {
      selected.push(card);
    }
  }

  setFavorSpent(amount: number) {
    const player = playerStore.players[phaseStore.currentTurn];
    if (amount <= player.favorPoints) this.fightState.favorSpent = amount;
    else toast.error("No tienes suficiente Favor.");
  }

  async fight(gameId: string, playerId: string) {
    const { targetSlots, selectedMonsters, selectedWeapons, favorSpent } =
      this.fightState;
    if (targetSlots.length === 0) return;

    const fieldCards = targetSlots
      .map(({ row, col }) => fieldStore.field.slots[row][col].card)
      .filter(Boolean) as Card[];

    const validMonsters = fieldCards.filter((card) => card.type === "MONSTER");

    for (const monster of selectedMonsters) {
      if (!validMonsters.find((m) => m.id === monster.id)) {
        toast.error("Has seleccionado monstruos inválidos.");
        return;
      }
    }

    const weaponAttack = selectedWeapons.reduce((sum, w) => sum + w.attack, 0);
    const totalAttack = weaponAttack + favorSpent;
    const totalMonsterAttack = selectedMonsters.reduce(
      (sum, m) => sum + m.attack,
      0
    );

    if (totalAttack < totalMonsterAttack) {
      toast.error("Tu ataque no es suficiente.");
      return;
    }

    const results: { row: number; col: number; card: Card | null }[] = [];
    const discardedCards: Card[] = [];
    let gainedSP = 0;

    selectedMonsters.forEach((monster) => {
      gainedSP += monster.soulPts;
      for (const { row, col } of targetSlots) {
        const slot = fieldStore.field.slots[row][col];
        if (slot.card?.id === monster.id) {
          slot.card = null;
          results.push({ row, col, card: null });
          discardedCards.push(monster);
          break;
        }
      }
    });

    selectedWeapons.forEach((weapon) => {
      weapon.durability -= 1;
      for (const { row, col } of targetSlots) {
        const slot = fieldStore.field.slots[row][col];
        if (slot.card?.id === weapon.id) {
          if (weapon.durability <= 0) {
            slot.card = null;
            results.push({ row, col, card: null });
            discardedCards.push(weapon);
            toast.warning(`${weapon.name} se ha roto y se ha descartado.`);
          } else {
            results.push({ row, col, card: weapon });
          }
          break;
        }
      }
    });

    try {
      await fetch(`/api/games/${gameId}/actions/fight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          results,
          favorSpent,
          gainedSP,
          discardedCards,
        }),
      });

      toast.success("¡Ganaste el combate!");

      this.fightState = {
        targetSlots: [],
        selectedMonsters: [],
        selectedWeapons: [],
        favorSpent: 0,
        isActive: false,
      };
    } catch {
      toast.error("Error al sincronizar combate.");
    }
  }

  cancelFight() {
    this.fightState = {
      targetSlots: [],
      selectedMonsters: [],
      selectedWeapons: [],
      favorSpent: 0,
      isActive: false,
    };
  }
}

const fightActions = new FightActions();
export default fightActions;
