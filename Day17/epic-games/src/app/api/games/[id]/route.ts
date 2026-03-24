import { NextResponse } from 'next/server';
import { carouselGames, freeGames, highlights, gameLists } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id).toLowerCase();

    // Flatten all games from lib/data
    const allGames = [
      ...carouselGames,
      ...freeGames,
      ...highlights,
      ...gameLists.flatMap(list => list.items)
    ];

    const game = allGames.find(g => 
      (g.title?.toLowerCase() === decodedId) || 
      (g.name?.toLowerCase() === decodedId)
    );

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
