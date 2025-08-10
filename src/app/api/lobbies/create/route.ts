import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = await pool.query(
      `INSERT INTO lobbies (status) VALUES ('waiting') RETURNING id`
    );
    return NextResponse.json({ lobbyId: result.rows[0].id }, { status: 200 });
  } catch (err) {
    let errorMessage = "Unknown error";
    if (err instanceof Error) errorMessage = err.message;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
