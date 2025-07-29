import { makeAutoObservable } from "mobx";
import gameStore from "../gameStore";
import Card from "../../models/card";
import { toast } from "react-toastify";
import discardPile from "../discardPile";
import phaseActions from "./phaseActions";

class FightActions {
  fightState = {
    selectedRow: null as number | null,
    selectedMonsters: [] as Card[],
    selectedWeapons: [] as Card[],
    favorSpent: 0,
    isActive: false,
  };

  constructor() {
    makeAutoObservable(this);
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

  selectMonster(card: Card) {
    const selected = this.fightState.selectedMonsters;
    const index = selected.findIndex((c) => c.id === card.id);
    if (index !== -1) selected.splice(index, 1);
    else selected.push(card);
  }

  selectWeapon(card: Card) {
    const selected = this.fightState.selectedWeapons;
    const index = selected.findIndex((c) => c.id === card.id);
    if (index !== -1) selected.splice(index, 1);
    else selected.push(card);
  }

  setFavorSpent(amount: number) {
    const player = gameStore.players[gameStore.currentTurn];
    if (amount <= player.favorPoints) {
      this.fightState.favorSpent = amount;
    } else {
      toast.error("No tienes suficiente Favor.");
    }
  }

  fight() {
    const { selectedRow, selectedMonsters, selectedWeapons, favorSpent } =
      this.fightState;
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
    const totalMonsterAttack = selectedMonsters.reduce(
      (sum, m) => sum + m.attack,
      0
    );

    if (totalAttack < totalMonsterAttack) {
      toast.error("Tu ataque no es suficiente.");
      return;
    }

    selectedWeapons.forEach((weapon) => {
      weapon.durability -= 1;
      if (weapon.durability <= 0) {
        hand.removeCard(weapon);
        discardPile.addCard(weapon);
        toast.update(`${weapon.name} se ha roto y se ha descartado.`);
      }
    });

    player.updateFP(-favorSpent);

    selectedMonsters.forEach((monster) => {
      player.updateSP(monster.soulpts);

      for (const slot of fieldRow) {
        if (slot.card?.id === monster.id) {
          slot.card = null;
          discardPile.addCard(monster);
          break;
        }
      }
    });
    if (selectedMonsters.length > 0) {
      toast.success("¡Combate exitoso! Has obtenido puntos de alma.");
      
      phaseActions.changePhase();
      this.fightState = {
        selectedRow: null,
        selectedMonsters: [],
        selectedWeapons: [],
        favorSpent: 0,
        isActive: false,
      };
    } else {
      toast.error("No has seleccionado monstruos para combatir.");
    }
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
const fightActions = new FightActions();
export default fightActions;
