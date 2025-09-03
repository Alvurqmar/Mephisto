
import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Falta el código del lobby" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id FROM lobbies WHERE code = $1`,
      [code]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Lobby no encontrado" },
        { status: 404 }
      );
    }

    const lobbyId = result.rows[0].id;

    return NextResponse.json({ lobbyId }, { status: 200 });
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) errorMessage = err.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
