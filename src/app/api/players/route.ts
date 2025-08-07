import { NextResponse } from "next/server";
import {prisma} from "../../lib/prisma";

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      select: {
        userId: true,
        name: true,
        favor: true,
        soul: true,
      },
    });

    const response = players.map((p) => ({
      key: p.userId,
      name: p.name,
      favorPoints: p.favor,
      soulPoints: p.soul,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json({ error: "Error fetching players" }, { status: 500 });
  }
}
