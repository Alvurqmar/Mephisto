import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function POST() {
  try {
    const newLobby = await prisma.lobby.create({ data: {} });
    return NextResponse.json({ gameId: newLobby.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear el lobby' }, { status: 500 });
  }
}
