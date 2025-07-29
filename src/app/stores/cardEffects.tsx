import type Card from "../models/card";

export type CardEffect = (params: {
  source: Card;
  target?: Card;
  row?: number;
  col?: number;
}) => void;

export const cardEffects: Record<string, CardEffect> = {
    "BlazingE": ({ target }: { target?: Card }) => {
        if (target) {
            target.attack += 3;
        }
    }
};