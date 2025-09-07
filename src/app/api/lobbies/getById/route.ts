import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { lobbyId } = await req.json();

    if (!lobbyId) {
      return NextResponse.json(
        { error: "Falta el lobbyId" },
        { status: 400 }
      );
    }

    const players = await pool.query(
      `SELECT name, player_key FROM lobby_players WHERE lobby_id = $1`,
      [lobbyId]
    );
    const result = await pool.query(
      `SELECT code FROM lobbies WHERE id = $1`,
      [lobbyId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Lobby no encontrado" },
        { status: 404 }
      );
    }

    const code = result.rows[0].code;
    return NextResponse.json({ code, players }, { status: 200 });

  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) errorMessage = err.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
