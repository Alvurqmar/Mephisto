import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import gameStore from "../gameStore";

class LootActions {
  constructor() {
    makeAutoObservable(this);
  }

  async lootField(row: number, col: number, gameId: string, playerId: string) {
    try {
      const res = await fetch(`/api/games/${gameId}/actions/lootField`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col, playerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return false;
      }

      await gameStore.loadGameState(gameId);

      toast.success("Carta robada con éxito");
      return true;
    } catch (e) {
      toast.error("Error de conexión");
      return false;
    }
  }

  async lootDeck(gameId: string, playerId: string) {
    try {
      const res = await fetch(`/api/games/${gameId}/actions/lootDeck`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return false;
      }

      await gameStore.loadGameState(gameId);

      toast.success("Carta robada del mazo con éxito");
      return true;
    } catch (e) {
      toast.error("Error de conexión");
      return false;
    }
  }
}
const lootActions = new LootActions();
export default lootActions;