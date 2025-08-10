import { Pool } from "pg";
import { cards } from "./cardBase";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const cardTypeMap: Record<string, string> = {
  MONSTER: "MONSTER",
  ITEM: "ITEM",
  WEAPON: "WEAPON",
  SPELL: "SPELL",
};

const effectTypeMap: Record<string, string> = {
  ETB: "ETB",
  CE: "CE",
  AA: "AA",
};

async function main() {
  const client = await pool.connect();

  try {
    await client.query("DELETE FROM cards");

    for (const card of cards) {
      await client.query(
        `INSERT INTO cards 
          (name, type, cost, attack, durability, effectid, effecttype, soulpts)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          card.name,
          cardTypeMap[card.type],
          card.cost,
          card.attack,
          card.durability,
          card.effectId,
          effectTypeMap[card.effectType],
          card.soulPts,
        ]
      );
    }

    console.log("Seed de cartas completado");
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
