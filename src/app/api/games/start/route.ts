import { pool } from "@/app/lib/db";
import { getLobbyPlayers, loadCardsFromDB, loadDeck } from "@/app/lib/Helpers";
import { initGameState } from "@/app/lib/gameInit";
import { pusher } from "@/app/lib/pusher";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { lobbyId } = await request.json();

    const players = await getLobbyPlayers(lobbyId);
    const cards = await loadCardsFromDB();

    const deck = loadDeck(cards);
    const gameState = initGameState(players, deck);

    const result = await pool.query(
      `
  INSERT INTO games 
    (id, lobby_id, deck, discard_pile, hands, field, current_turn, current_phase, phase_action, players, turn_counter, winning_soul_points, status)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
  RETURNING id
  `,
      [
        lobbyId,
        lobbyId,
        JSON.stringify(gameState.deck),
        JSON.stringify(gameState.discardPile),
        JSON.stringify(gameState.hands),
        JSON.stringify(gameState.field),
        gameState.current_turn,
        gameState.current_phase,
        gameState.phase_action,
        JSON.stringify(gameState.players),
        gameState.turn_counter,
        gameState.winning_soul_points,
        gameState.status,
      ]
    );

    await pusher.trigger(`lobby-${lobbyId}`, "game-started", {
      gameId: lobbyId,
    });

    return Response.json({ gameId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "Error al iniciar la partida" },
      { status: 500 }
    );
  }
}
