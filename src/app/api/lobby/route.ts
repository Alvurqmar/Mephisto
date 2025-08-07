import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET() {
  try {
    const lobby = await prisma.lobby.findFirst({
      include: { users: true },
    });

    if (!lobby) {
      return NextResponse.json({ error: 'Lobby no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ players: lobby.users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener el lobby' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const newLobby = await prisma.lobby.create({ data: {} });
    return NextResponse.json({ gameId: newLobby.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear el lobby' }, { status: 500 });
  }
}
