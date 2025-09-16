import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

function generateLobbyCode(length = 5) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST() {
  try {
    let code = generateLobbyCode();

    let exists = await pool.query(`SELECT id FROM lobbies WHERE code = $1`, [code]);
    while ((exists.rowCount ?? 0) > 0) {
      code = generateLobbyCode();
      exists = await pool.query(`SELECT id FROM lobbies WHERE code = $1`, [code]);
    }

    const result = await pool.query(
      `INSERT INTO lobbies (status, code) VALUES ('waiting', $1) RETURNING id`,
      [code]
    );

    return NextResponse.json({ lobbyId: result.rows[0].id, code }, { status: 200 });
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) errorMessage = err.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
