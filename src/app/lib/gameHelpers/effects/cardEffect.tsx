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
import { TorchE } from "./effectList/TorchE";
import playerStore from "@/app/stores/playerStore";
import targetStore from "@/app/stores/targetStore";
import phaseStore from "@/app/stores/phaseStore";
import { toast } from "react-toastify";
import { VampireE } from "./effectList/VampireE";
import { TCE } from "./effectList/TCE";
import { CorruptorE } from "./effectList/CorruptorE";
import { ForkE } from "./effectList/ForkE";
import { SpiderE } from "./effectList/SpiderE";
import { MalletE } from "./effectList/MalletE";
import { GreataxeE } from "./effectList/Greataxe";
import { KeyE } from "./effectList/KeyE";
import { PortalE } from "./effectList/PortalE";
import { ShovelE } from "./effectList/ShovelE";
import { SkewerE } from "./effectList/SkewerE";
import { BloodthirsterE } from "./effectList/BloodthirsterE";
import { ArcanifeE } from "./effectList/ArcanifeE";
import { TransmuteE } from "./effectList/TransmuteE";
import { GrimoireE } from "./effectList/GrimoireE";

export const effects = {
  MPE,
  SFE,
  PE,
  StewE,
  TalismanE, //FIX
  HookshotE,
  BlazingE,
  UpgradeE,
  RepeaterE,
  VerminE,
  TorchE,
  VampireE,
  TCE,
  CorruptorE,
  ForkE,
  SpiderE,
  GreataxeE,
  MalletE,
  KeyE,
  PortalE,
  ShovelE,
  SkewerE,
  BloodthirsterE,
  ArcanifeE,
  TransmuteE,
  GrimoireE,
  //IMPLEMENTADOS
  //BWE
  //GoblinE,
  //WatcherE,
  //WraithE,
  //ZombieE,

  //NO IMPLEMENTADOS
  //LichE,
  //WitchE,

  //OozeE,
  //DKE,
  //SkeletonE,
  //TrollE,

  //BoomerangE,
  //SlingshotE,
  //IlluminateE,
  //TeleportE,
};

export interface EffectWithTargets {
  (gameState: GameState, cardId: string, targets?: Card[]): GameState;
  requiresTarget?: boolean;
  targetRequirements?: {
    type: string | string[];
    count: number;
    location: string;
    owner: string;
    orientation?: string;
  }[];
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
  const effect = effects[effectId as keyof typeof effects] as EffectWithTargets;

if (effect && effect.requiresTarget && effect.targetRequirements && !targets) {
    let requirements = effect.targetRequirements;
    const effectCard = targetStore.effectCardId;
    if (effectCard) {
      const player = playerStore.players[phaseStore.currentTurn];
      if (player && player.orientation) {
        requirements = requirements.map(req => ({ ...req, orientation: player.orientation }));
      }
    }
    
    targetStore.openTargetModal(
      requirements,
      async (selectedTargets) => {
        await fetchCardEffect(playerId, effectId, cardId, gameId, selectedTargets);
      },
      cardId
    );
    return;
  }

  try {
    const response = await fetch(`/api/games/${gameId}/actions/cardEffect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId,
        effectId,
        cardId,
        targets,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    toast.success("Efecto de carta activado.");
    return await response.json();
  } catch (error) {
    toast.error("El efecto no se ha activado.");
    console.error("Error using effect:", error);
    throw error;
  }
}

export async function handleETBEffect(card: Card, gameId: string) {
  if (!card.effectId) {
    console.warn("Card has no effect ID.");
    return;
  }

  try {
    await fetchCardEffect(
      phaseStore.currentTurn,
      card.effectId,
      card.id.toString(),
      gameId
    );
  } catch (error) {
    console.error("Failed to activate effect:", error);
    toast.error("Error al activar el efecto de la carta.");
  }
}
