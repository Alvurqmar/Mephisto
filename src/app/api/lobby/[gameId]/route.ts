import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { pusher } from "../../../lib/pusher";

export async function GET(
  _req: NextRequest,
  context: { params: { gameId: string } }
) {
  const { gameId } = context.params;

  const players = await prisma.user.findMany({
    where: { lobbyId: gameId },
    select: { name: true },
  });

  return NextResponse.json({ players: players.map(p => p.name) });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { gameId: string } }
) {
  const { gameId } = params;

  const { name } = await req.json();

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  }

  const existingUsers = await prisma.user.findMany({ where: { lobbyId: gameId } });

  if (existingUsers.length >= 4) {
    return NextResponse.json({ error: "Lobby lleno" }, { status: 400 });
  }

  const nameExists = existingUsers.some(user => user.name === name.trim());
  if (nameExists) {
    return NextResponse.json({ error: "Nombre ya existe" }, { status: 400 });
  }

  await prisma.user.create({
    data: { name: name.trim(), lobbyId: gameId },
  });

  const updatedPlayers = await prisma.user.findMany({
    where: { lobbyId: gameId },
    select: { name: true },
  });

  await pusher.trigger(`lobby-${gameId}`, "update-players", {
    players: updatedPlayers.map(p => p.name),
  });

  return NextResponse.json({ players: updatedPlayers.map(p => p.name) });
}
