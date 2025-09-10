import { GameState } from "@/app/models/gameState";
import { MPE } from "./effectList/MPE";
import Card from "@/app/models/card";
import { SFE } from "./effectList/SFE";
import { PE } from "./effectList/PE";
import { StewE } from "./effectList/StewE";
import { TalismanE } from "./effectList/TalismanE";
import { BlazingE } from "./effectList/BlazingE";
import { UpgradeE } from "./effectList/UpgradeE";
import { RepeaterE } from "./effectList/RepeaterE";
import { VerminE } from "./effectList/VerminE";
import { HookshotE } from "./effectList/HookshotE";

export const effects = {
  MPE,
  SFE,
  PE,
  StewE,
  TalismanE,
  HookshotE,
  BlazingE,
  UpgradeE,
  RepeaterE,
  VerminE,
  

};

export interface EffectWithTargets {
  (gameState: GameState, cardId: string, targets?: Card[]): GameState;
  requiresTarget?: boolean;
  targetRequirements?: {
    type: string | string[];
    count: number;
    location?: string;
    owner?: string;
  };
}

export function cardEffect(
  gameState: GameState, 
  effectId: string, 
  cardId: string, 
  targets?: Card[]
): GameState {
  const effect = effects[effectId as keyof typeof effects] as EffectWithTargets;
  
  if (effect) {
    return effect(gameState, cardId, targets);
  } else {
    console.warn(`Effect ${effectId} not found`);
    return gameState;
  }
}

export async function fetchCardEffect(
  playerId: string, 
  effectId: string, 
  cardId: string, 
  gameId: string,
  targets?: Card[]
) {
  console.log("gameId", gameId, "playerId", playerId, "effectId", effectId, "cardId", cardId, "targets", targets);
  
  try {
    const response = await fetch(`/api/games/${gameId}/actions/cardEffect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        playerId, 
        effectId, 
        cardId,
        targets 
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error using effect:', error);
    throw error;
  }
}