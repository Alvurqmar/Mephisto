import Card, { CardData } from "../models/card";
import Field from "../models/field";
import Player from "../models/player";
import { Slot } from "../models/slot";

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateInitialDeck(cardsData: CardData[]): Card[] {
  const cards = cardsData.map((data) => Card.deserialize(data));
  return shuffle(cards);
}

export function initGameState(players: Record<string, Player>, deck: Card[]) {
  const playerKeys = Object.keys(players);
  const shuffledDeck = shuffle([...deck]);
  const hands: Record<string, Card[]> = {};
  const winningSoulPoints = playerKeys.length === 2 ? 15 : 12;
  const discards: Card[] = [];

  playerKeys.forEach((key, index) => {
    const cardCount =
      playerKeys.length === 2 ? (index === 0 ? 3 : 4) : index + 2;

    const handCards = shuffledDeck.splice(0, cardCount).map((card) => {
      card.owner = key;
      return card;
    });

    hands[key] = handCards;
    players[key].favorPoints = cardCount;
  });

  let field: Field;
  if (playerKeys.length === 2) {
    field = new Field(3, 6, "2P");
    field.setFieldOwners2P(field);

    const cardsToPlace = shuffledDeck.splice(0, 6);
    let placed = 0;
    for (let row = 0; row < field.rows; row++) {
      for (let col = 0; col < field.columns; col++) {
        const slot = field.slots[row][col];
        if (
          slot instanceof Slot &&
          slot.owner === null &&
          placed < cardsToPlace.length
        ) {
          field.setCard(row, col, cardsToPlace[placed]);
          placed++;
        }
      }
    }
      players[playerKeys[0]].favorPoints = 3;
      players[playerKeys[1]].favorPoints = 5;
  } else {
    field = new Field(7, 7, "3-4P");
    field.setFieldOwners34P(field, playerKeys);

    const cardsToPlace = shuffledDeck.splice(0, 6);
    let placed = 0;
    for (let row = 0; row < field.rows; row++) {
      for (let col = 0; col < field.columns; col++) {
        const slot = field.slots[row][col];
        if (
          slot instanceof Slot &&
          slot.owner === null &&
          placed < cardsToPlace.length
        ) {
          field.setCard(row, col, cardsToPlace[placed]);
          placed++;
        }
      }
    }
  }

  return {
    deck: shuffledDeck.map((card) => card.serialize()),
    discardPile: discards.map((card) => card.serialize()),
    hands: Object.fromEntries(
      Object.entries(hands).map(([key, cards]) => [
        key,
        cards.map((card) => card.serialize()),
      ])
    ),
    field: field.serialize(),
    current_turn: playerKeys[0],
    current_phase: "Main Phase",
    phase_action: null,
    players: Object.fromEntries(
      Object.entries(players).map(([key, player]) => [key, player.serialize()])
    ),
    turn_counter: 1,
    winning_soul_points: winningSoulPoints,
    status: "in_progress",
  };
}
