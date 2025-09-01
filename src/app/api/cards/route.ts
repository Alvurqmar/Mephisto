import { pool } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM cards");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error obteniendo cartas:", error);
    return NextResponse.json({ error: "Error al obtener cartas" }, { status: 500 });
  } finally {
    client.release();
  }
}