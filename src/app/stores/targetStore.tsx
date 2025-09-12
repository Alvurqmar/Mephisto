import { makeAutoObservable } from "mobx";
import Card from "../models/card";

export interface TargetRequirement {
  type: string | string[];
  count: number;
  location?: string | string[];
  owner?: string;
  orientation?: string;
  label?: string;
}

class TargetStore {
  isTargetModalOpen = false;
  targetRequirements: TargetRequirement[] | null = null;
  selectedTargets: Card[] = [];
  effectCallback: ((targets: Card[]) => void) | null = null;
  effectCardId: string | null = null;
  currentRequirementIndex = 0;
  private allSelectedTargets: Card[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  openTargetModal(
    requirements: TargetRequirement[],
    callback: (targets: Card[]) => void,
    cardId: string
  ) {
    this.isTargetModalOpen = true;
    this.targetRequirements = requirements;
    this.effectCallback = callback;
    this.selectedTargets = [];
    this.allSelectedTargets = [];
    this.effectCardId = cardId;
    this.currentRequirementIndex = 0;
  }

  closeTargetModal() {
    this.isTargetModalOpen = false;
    this.targetRequirements = null;
    this.effectCallback = null;
    this.selectedTargets = [];
    this.allSelectedTargets = [];
    this.effectCardId = null;
    this.currentRequirementIndex = 0;
  }

  toggleTarget(target: Card) {
    const currentRequirement = this.targetRequirements?.[this.currentRequirementIndex];
    if (currentRequirement && this.selectedTargets.length >= currentRequirement.count && !this.selectedTargets.includes(target)) {
      return;
    }

    const index = this.selectedTargets.findIndex(t => t.id === target.id);
    if (index > -1) {
      this.selectedTargets.splice(index, 1);
    } else {
      this.selectedTargets.push(target);
    }
  }

  confirmSelection() {
    if (!this.targetRequirements) return;

    this.allSelectedTargets.push(...this.selectedTargets);
    
    if (this.currentRequirementIndex < this.targetRequirements.length - 1) {
      this.currentRequirementIndex += 1;
      this.selectedTargets = [];
    } else {
      this.effectCallback!(this.allSelectedTargets);
      this.closeTargetModal();
    }
  }
}

const targetStore = new TargetStore();
export default targetStore;