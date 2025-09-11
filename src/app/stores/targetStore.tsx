import { makeAutoObservable } from "mobx";
import Card from "../models/card";

export interface TargetRequirement {
  type: string | string[];
  count: number;
  location?: string;
  owner?: string;
  orientation?: string;
}

class TargetStore {
  isTargetModalOpen = false;
  targetRequirements: TargetRequirement | null = null;
  selectedTargets: Card[] = [];
  effectCallback: ((targets: Card[]) => void) | null = null;
  effectCardId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openTargetModal(
    requirements: TargetRequirement,
    callback: (targets: Card[]) => void,
    cardId: string
  ) {
    this.isTargetModalOpen = true;
    this.targetRequirements = requirements;
    this.effectCallback = callback;
    this.selectedTargets = [];
    this.effectCardId = cardId;
  }

  closeTargetModal() {
    this.isTargetModalOpen = false;
    this.targetRequirements = null;
    this.effectCallback = null;
    this.selectedTargets = [];
    this.effectCardId = null;
  }

  toggleTarget(target: Card) {
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