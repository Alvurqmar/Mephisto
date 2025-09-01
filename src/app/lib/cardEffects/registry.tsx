import { EffectType } from "@/app/models/card";
import { EffectFn } from "./effectManager";

export const registry: Record<EffectType, Record<string, EffectFn>> = {
  ETB: {},
  AA: {},
  CE: {},
};

export function registerEffect(effectType: EffectType, effectId: string, fn: EffectFn) {
  registry[effectType][effectId] = fn;
}
