import { fetchCards } from '../../lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const cards = await fetchCards();
      return NextResponse.json(cards);
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }
  }
