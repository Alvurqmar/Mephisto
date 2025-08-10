import Card from "../models/card";
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

