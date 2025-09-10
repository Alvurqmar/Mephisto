import { makeAutoObservable } from "mobx";
import Card from "../models/card";

export interface TargetRequirement {
  type: string | string[]; 
  count: number;
  location?: string;
  owner?: string; 
}

class TargetStore {
  isTargetModalOpen = false;
  targetRequirements: TargetRequirement | null = null;
  selectedTargets: Card[] = [];
  effectCallback: ((targets: Card[]) => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openTargetModal(
    requirements: TargetRequirement, 
    callback: (targets: Card[]) => void,
  ) {
    this.isTargetModalOpen = true;
    this.targetRequirements = requirements;
    this.effectCallback = callback;
    this.selectedTargets = [];
  }

  closeTargetModal() {
    this.isTargetModalOpen = false;
    this.targetRequirements = null;
    this.effectCallback = null;
    this.selectedTargets = [];
  }

  toggleTarget(target: Card ) {
    const index = this.selectedTargets.findIndex(t => t.id === target.id);
    if (index > -1) {
      this.selectedTargets.splice(index, 1);
    } else {
      if (this.selectedTargets.length < (this.targetRequirements?.count || 0)) {
        this.selectedTargets.push(target);
      }
    }
  }

  confirmSelection() {
    if (this.effectCallback && this.selectedTargets.length === this.targetRequirements?.count) {
      this.effectCallback(this.selectedTargets);
      this.closeTargetModal();
    }
  }
}

const targetStore = new TargetStore();
export default targetStore;