import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import Card, { CardData } from "@/app/models/card";
import Field from "@/app/models/field";
import Player, { PlayerData } from "@/app/models/player";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  try {
    const result = await pool.query("SELECT * FROM games WHERE id = $1", [
      gameId,
    ]);

    if (result.rowCount === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const game = result.rows[0];

    const parsedGame = {
      id: game.id,
      lobby_id: game.lobby_id,
      deck: (typeof game.deck === "string"
        ? JSON.parse(game.deck)
        : game.deck
      ).map(Card.deserialize),
      discardPile: (typeof game.discard_pile === "string"
        ? JSON.parse(game.discard_pile)
        : game.discard_pile
      ).map(Card.deserialize),
      hands: Object.fromEntries(
        Object.entries(
          typeof game.hands === "string" ? JSON.parse(game.hands) : game.hands
        ).map(([key, cards]) => [key, (cards as CardData[]).map(Card.deserialize)])
      ),

      field: Field.deserialize(
        typeof game.field === "string" ? JSON.parse(game.field) : game.field
      ),
      currentTurn: game.current_turn,
      currentPhase: game.current_phase,
      phaseAction: game.phase_action,
      players: Object.fromEntries(
        Object.entries(
          typeof game.players === "string"
            ? JSON.parse(game.players)
            : game.players
        ).map(([key, playerData]) => [key, Player.deserialize(key, playerData as PlayerData)])
      ),
      turnCounter: game.turn_counter,
      winningSoulPoints: game.winning_soul_points,
      status: game.status,
    };

    return NextResponse.json(parsedGame);
  } catch (error) {
    console.error("Error fetching game:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
