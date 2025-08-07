import { prisma } from "./prisma";
import { cards } from "./cardBase";
import { card_type, effect_type } from "../../generated/prisma";

const cardTypeMap: Record<string, card_type> = {
  MONSTER: card_type.MONSTER,
  ITEM: card_type.ITEM,
  WEAPON: card_type.WEAPON,
  SPELL: card_type.SPELL,
};

const effectTypeMap: Record<string, effect_type> = {
  ETB: effect_type.ETB,
  CE: effect_type.CE,
  AA: effect_type.AA,
};

async function main() {
  await prisma.card.deleteMany();

  await prisma.card.createMany({
    data: cards.map(({ name, type, cost, attack, durability, effectId, effectType, soulPts }) => ({
      name,
      type: cardTypeMap[type],
      cost,
      attack,
      durability,
      effectid: effectId,
      effecttype: effectTypeMap[effectType],
      soulPts,
    })),
  });

  console.log("Seed de cartas completado");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
