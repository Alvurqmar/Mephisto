import { EffectType } from "@/app/models/card";
import "./effectIndex";
import { registry } from "./registry";
export interface EffectContext {
  gameState: any;
  card: any;
  playerId: string;
  targetId?: string;
}

export type EffectFn = (ctx: EffectContext) => Promise<void>;

export async function executeEffect(
  effectType: EffectType,
  effectId: string,
  ctx: EffectContext
) {
  const effect = registry[effectType]?.[effectId];
  if (!effect) {
    console.warn(`Efecto no encontrado: ${effectType} - ${effectId}`);
    return;
  }
  await effect(ctx);
  if (effectType === EffectType.AA) {
    ctx.card.isTapped = true;
    ctx.card.durability -= 1;
    if (ctx.card.durability <= 0) {
       const field = ctx.gameState.field;
    for (let row = 0; row < field.slots.length; row++) {
      for (let col = 0; col < field.slots[row].length; col++) {
        if (field.slots[row][col].card?.id === ctx.card.id) {
          field.slots[row][col].card = null;
        }
      }
    }
      ctx.gameState.discardPile.push(ctx.card);
    }
  }
  return { message: `Efecto ${ctx.card.name} activado con éxito.` };
}
