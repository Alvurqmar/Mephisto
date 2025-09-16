import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";
import { Action } from "../phaseStore";

class PhaseActions {
  constructor() {
    makeAutoObservable(this);
  }

  async setAction(
    gameId: string,
    playerId: string,
    action: Action
  ): Promise<boolean> {
    const res = await fetch(`/api/games/${gameId}/actions/setAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, action }),
    });

    if (res.ok) {
      return true;
    } else {
      const errorData = await res.json();
      toast.error(errorData.error);
      return false;
    }
  }

  async changePhase(gameId: string, playerId: string): Promise<boolean> {
    const res = await fetch(`/api/games/${gameId}/actions/changePhase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });

    if (res.ok) {
      return true;
    } else {
      const errorData = await res.json();
      toast.error(errorData.error);
      return false;
    }
  }
}
const phaseActions = new PhaseActions();
export default phaseActions;
