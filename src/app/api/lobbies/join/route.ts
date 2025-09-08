import { pool } from "@/app/lib/db";
import { pusher } from "@/app/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lobbyId, name } = await request.json();

    if (!lobbyId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const playersCountResult = await pool.query(
      `SELECT COUNT(*) FROM lobby_players WHERE lobby_id = $1`,
      [lobbyId]
    );
    const playersCount = parseInt(playersCountResult.rows[0].count, 10);

    if (playersCount >= 4) {
      return NextResponse.json(
        { error: "El lobby está lleno. No se pueden unir más jugadores." },
        { status: 403 }
      );
    }

    const playerKey = `p${playersCount + 1}`;

    await pool.query(
      `INSERT INTO lobby_players (lobby_id, name, player_key)
       VALUES ($1, $2, $3)`,
      [lobbyId, name, playerKey]
    );

      if (playersCount === 3) {
      await pool.query(
        `UPDATE lobbies SET status = 'full' WHERE id = $1`,
        [lobbyId]
      );
    }

    const playersResult = await pool.query(
      `SELECT name, player_key FROM lobby_players WHERE lobby_id = $1`,
      [lobbyId]
    );

    await pusher.trigger(`lobby-${lobbyId}`, "players-updated", {
      players: playersResult.rows,
    });

    return NextResponse.json({ success: true, playerKey }, { status: 200 });
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) errorMessage = err.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

