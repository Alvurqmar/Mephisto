import { pool } from "@/app/lib/db";
import { pusher } from "@/app/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { lobbyId, userId, name, playerKey } = await request.json();

    if (!lobbyId || !userId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const playersCountResult = await pool.query(
      `SELECT COUNT(*) FROM lobby_players WHERE lobby_id = $1`,
      [lobbyId]
    );
    const playersCount = parseInt(playersCountResult.rows[0].count, 10);

    // Validación para limitar a 4 jugadores
    if (playersCount >= 4) {
      return NextResponse.json(
        { error: "El lobby está lleno. No se pueden unir más jugadores." },
        { status: 403 }
      );
    }

    const assignedPlayerKey = playerKey ?? `p${playersCount + 1}`;

    await pool.query(
      `INSERT INTO lobby_players (lobby_id, user_id, name, player_key)
       VALUES ($1, $2, $3, $4)`,
      [lobbyId, userId, name, assignedPlayerKey]
    );

    const playersResult = await pool.query(
      `SELECT user_id, name, player_key FROM lobby_players WHERE lobby_id = $1`,
      [lobbyId]
    );

    await pusher.trigger(`lobby-${lobbyId}`, "players-updated", {
      players: playersResult.rows,
    });

    return NextResponse.json({ success: true, assignedPlayerKey }, { status: 200 });
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) errorMessage = err.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

