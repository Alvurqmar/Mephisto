import { cards } from "@/app/lib/cardBase";
import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

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
  BC: "BC",
};

export async function POST() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS cards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL,
        cost INTEGER NOT NULL,
        attack INTEGER NOT NULL,
        durability INTEGER NOT NULL,
        effectid VARCHAR(50),
        effecttype VARCHAR(10),
        soulpts INTEGER NOT NULL
      )
    `);

    const cardCount = await client.query("SELECT COUNT(*) FROM cards");
    if (parseInt(cardCount.rows[0].count) > 0) {
      await client.query("TRUNCATE TABLE cards RESTART IDENTITY");
    }

    for (const card of cards) {
      await client.query(
        `INSERT INTO cards (id, name, type, cost, attack, durability, effectid, effecttype, soulpts)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          card.id,
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

    return NextResponse.json({ message: "Seed de cartas completado" });
  } catch (error) {
    console.error("Error en seed:", error);
    return NextResponse.json({ error: "Error en seed" }, { status: 500 });
  } finally {
    client.release();
  }
}
