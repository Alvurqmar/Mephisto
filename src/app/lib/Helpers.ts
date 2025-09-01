import Card from "../models/card";
import Field from "../models/field";
import { GameState } from "../models/gameState";
import Player from "../models/player";
import { pool } from "./db";

export async function getLobbyPlayers(lobbyId: string) {
  const res = await pool.query(
    `
    SELECT user_id, name, player_key
    FROM lobby_players
    WHERE lobby_id = $1
    ORDER BY player_key ASC
    `,
    [lobbyId]
  );

  if (res.rows.length === 0) {
    throw new Error("No se encontraron jugadores para este lobby");
  }

  const players: Record<string, Player> = {};

  for (const row of res.rows) {
    const player = new Player(row.name, row.player_key);
    if (!row.player_key) {
      throw new Error(
        `Jugador con player_key inválido en lobby ${lobbyId}: ${JSON.stringify(
          row
        )}`
      );
    }

    player.favorPoints = 0;
    player.soulPoints = 0;
    player.isWinner = false;

    players[row.player_key] = player;
  }

  return players;
}

export async function loadCardsFromDB(): Promise<Card[]> {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT * FROM cards");
    return res.rows.map(Card.deserialize);
  } finally {
    client.release();
  }
}

export async function loadGameState(gameId: string): Promise<GameState> {
  const res = await pool.query("SELECT * FROM games WHERE id = $1", [gameId]);

  if (res.rowCount === 0) {
    throw new Error(`No game found with id ${gameId}`);
  }

  const game = res.rows[0];

  return {
    id: game.id,
    lobbyId: game.lobby_id,
    deck: (typeof game.deck === "string" ? JSON.parse(game.deck) : game.deck).map(Card.deserialize),
    discardPile: (typeof game.discard_pile === "string" ? JSON.parse(game.discard_pile) : game.discard_pile).map(Card.deserialize),
    hands: Object.fromEntries(
      Object.entries(
        typeof game.hands === "string" ? JSON.parse(game.hands) : game.hands
      ).map(([key, cards]) => [key, (cards as any[]).map(Card.deserialize)])
    ),
    field: Field.deserialize(typeof game.field === "string" ? JSON.parse(game.field) : game.field),
    currentTurn: game.current_turn,
    currentPhase: game.current_phase,
    phaseAction: game.phase_action,
    players: Object.fromEntries(
      Object.entries(
        typeof game.players === "string" ? JSON.parse(game.players) : game.players
      ).map(([key, playerData]) => [key, Player.deserialize(playerData)])
    ),
    turnCounter: game.turn_counter,
    winningSoulPoints: game.winning_soul_points,
    status: game.status,
  };
}

export async function saveGameState(gameId: string, gameState: GameState): Promise<void> {
  await pool.query(
    `
    UPDATE games
    SET
      deck = $1,
      discard_pile = $2,
      hands = $3,
      field = $4,
      current_turn = $5,
      current_phase = $6,
      phase_action = $7,
      players = $8,
      turn_counter = $9,
      winning_soul_points = $10,
      status = $11,
      updated_at = now()
    WHERE id = $12
    `,
    [
      JSON.stringify(gameState.deck),
      JSON.stringify(gameState.discardPile),
      JSON.stringify(gameState.hands),
      JSON.stringify(gameState.field),
      gameState.currentTurn,
      gameState.currentPhase,
      gameState.phaseAction,
      JSON.stringify(gameState.players),
      gameState.turnCounter,
      gameState.winningSoulPoints,
      gameState.status,
      gameId,
    ]
  );
}

export function findCardById(gameState: any, cardId: number) {
  for (const row of gameState.field.slots) {
    for (const slot of row) {
      if (slot.card && slot.card.id === cardId) {
        return slot.card;
      }
    }
  }

  for (const playerId of Object.keys(gameState.hands)) {
    const card = gameState.hands[playerId].find((c: any) => c.id === cardId);
    if (card) return card;
  }

  return null;
}
