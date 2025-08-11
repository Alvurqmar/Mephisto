import { makeAutoObservable } from "mobx";

export type Phase = "Main Phase" | "Action Phase" | "End Phase";
export type Action = "Loot" | "Fight" | "Summon" | null;
export type Status = "Playing" | "Finished";

class PhaseStore {
  currentTurn = "";
  currentPhase: Phase = "Main Phase";
  phaseAction: Action = null;
  status: Status = "Playing";
  turnCounter = 1;
  winningSoulPoints = 15;

  constructor() {
    makeAutoObservable(this);
  }

  setPhaseData(data: Partial<PhaseStore>) {
    Object.assign(this, data);
  }
}

export default new PhaseStore();
