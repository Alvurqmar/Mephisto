import Card, { EffectType } from "@/app/models/card";
import AA from "./AAEffects";
import ETB from "./ETBEffects";
import CE from "./CEEffects";

const effectMap: Record<EffectType, Record<string, (card: Card) => void>> = {
  [EffectType.AA]: AA,
  [EffectType.ETB]: ETB,
  [EffectType.CE]: CE,
};

class EffectResolver {
  async trigger(card: Card) {
    if (!card.effectId || !card.effectType) return false;

    const effectFn = effectMap[card.effectType]?.[card.effectId];
    if (!effectFn) return;

    const result = await effectFn(card);

    if (card.effectType === EffectType.AA && result) {
      card.isTapped = true;
    }

    return result;
  }
}

const effectResolver = new EffectResolver();
export default effectResolver;
