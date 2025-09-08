import Card from "../models/card";
import Field from "../models/field";
import Player from "../models/player";
import { Slot } from "../models/slot";
import { shuffle } from "./gameHelpers/deck";

export function initCardsField(cards: Card[], field: Field): void{
    let placed = 0;
    for (let row = 0; row < field.rows; row++) {
      for (let col = 0; col < field.columns; col++) {
        const slot = field.slots[row][col];
        if (
          slot instanceof Slot &&
          slot.owner === null &&
          placed < cards.length
        ) {
          field.setCard(row, col, cards[placed]);
          placed++;
        }
      }
    }
}
export function initGameState(players: Record<string, Player>, deck: Card[]) {
  const playerKeys = Object.keys(players);
  const shuffledDeck = shuffle([...deck]);
  const hands: Record<string, Card[]> = {};
  const winningSoulPoints = playerKeys.length === 2 ? 15 : 12;
  const discards: Card[] = [];

  if (playerKeys.length === 2) {
    players[playerKeys[0]].setOrientation("horizontal");
    players[playerKeys[1]].setOrientation("horizontal");
  } else {
    players["p1"].setOrientation("vertical");
    players["p2"].setOrientation("horizontal");
    players["p3"].setOrientation("vertical");
    if (playerKeys.includes("p4")) players["p4"].setOrientation("horizontal");
  }

  playerKeys.forEach((key, index) => {
    const cardCount = playerKeys.length === 2 ? (index === 0 ? 3 : 4) : index + 2;
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
    initCardsField(cardsToPlace, field);

    players[playerKeys[0]].favorPoints = 3;
    players[playerKeys[1]].favorPoints = 5;
  } else {
    field = new Field(7, 7, "3-4P");
    field.setFieldOwners34P(field, playerKeys);
    const cardsToPlace = shuffledDeck.splice(0, 6);
    initCardsField(cardsToPlace, field);
  }

  return {
    deck: shuffledDeck.map((card) => card.serialize()),
    discardPile: discards.map((card) => card.serialize()),
    hands: Object.fromEntries(
      Object.entries(hands).map(([key, cards]) => [key, cards.map((card) => card.serialize())])
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
    status: "playing",
  };
}

