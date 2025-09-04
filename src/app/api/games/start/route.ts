import { pool } from "@/app/lib/db";
import { getLobbyPlayers, loadCardsFromDB, loadDeck } from "@/app/lib/Helpers";
import { initGameState } from "@/app/lib/gameInit";
import { pusher } from "@/app/lib/pusher";

export async function POST(request: Request) {
  try {
    const { lobbyId } = await request.json();

    const players = await getLobbyPlayers(lobbyId);
    const cardsData = await loadCardsFromDB();

    const deck = loadDeck(cardsData);
    const gameState = initGameState(players, deck);

    const result = await pool.query(
      `
  INSERT INTO games 
    (lobby_id, deck, discard_pile, hands, field, current_turn, current_phase, phase_action, players, turn_counter, winning_soul_points, status)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
  RETURNING id
  `,
      [
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

    const newGameId = result.rows[0].id;

    await pusher.trigger(`lobby-${lobbyId}`, "game-started", {
      gameId: newGameId,
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
