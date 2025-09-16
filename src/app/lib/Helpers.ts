import Card, { CardData } from "../models/card";
import DiscardPile from "../models/discardPile";
import Field from "../models/field";
import { GameState } from "../models/gameState";
import Player, { PlayerData } from "../models/player";
import { pool } from "./db";

export async function getLobbyPlayers(lobbyId: string) {
  const res = await pool.query(
    `
    SELECT name, player_key
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

export function loadDeck(cardsData: CardData[]): Card[] {
  const cards = cardsData.map((data) => Card.deserialize(data));
  return cards;
}

export async function fetchGameState(gameId: string): Promise<GameState> {
  const res = await pool.query("SELECT * FROM games WHERE id = $1", [gameId]);

  if (res.rowCount === 0) {
    throw new Error(`No game found with id ${gameId}`);
  }

  const game = res.rows[0];

  const deckData: CardData[] =
    typeof game.deck === "string" ? JSON.parse(game.deck) : game.deck;

  const discardPileData: CardData[] =
  typeof game.discard_pile === "string"
    ? JSON.parse(game.discard_pile)
    : game.discard_pile;

  const handsData: Record<string, CardData[]> =
    typeof game.hands === "string" ? JSON.parse(game.hands) : game.hands;

  const playersData: Record<string, PlayerData> =
    typeof game.players === "string" ? JSON.parse(game.players) : game.players;

  const fieldData =
    typeof game.field === "string" ? JSON.parse(game.field) : game.field;

  return {
    id: game.id,
    lobbyId: game.lobby_id,
    deck: deckData.map((cardData) => Card.deserialize(cardData)),
    discardPile: DiscardPile.deserialize(discardPileData),
    hands: Object.fromEntries(
      Object.entries(handsData).map(([key, cards]) => [
        key,
        cards.map((c) => Card.deserialize(c)),
      ])
    ),
    field: Field.deserialize(fieldData),
    currentTurn: game.current_turn,
    currentPhase: game.current_phase,
    phaseAction: game.phase_action,
    players: Object.fromEntries(
      Object.entries(playersData).map(([key, playerData]) => [
        key,
        Player.deserialize(key, playerData),
      ])
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
      JSON.stringify(gameState.discardPile.cards),
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

