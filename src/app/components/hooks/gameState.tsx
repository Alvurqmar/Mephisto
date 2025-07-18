import Card from "../card";

export type Player = "player1" | "player2";
export type Phase = "Main Phase" | "Action Phase" | "End Phase";
export type Action = "Loot" | "Fight" | "Summon" | null;

export interface GameState {
  deck: Card[];
  fieldCards: (Card | null)[][];
  playerFields: Record<Player, (Card | null)[][]>;
  hands: Record<Player, Card[]>;
  currentTurn: Player;
  currentPhase: Phase;
  phaseAction: Action;
  selectedCard: Card | null;
}

export type GameAction =
  | { type: "INIT_GAME"; payload: { cards: Card[] } }
  | { type: "CHANGE_PHASE" }
  | { type: "PHASE_ACTION"; payload: Action}
  | { type: "SELECT_CARD"; payload: Card | null }
  | {
      type: "PLAY_CARD";
      payload: { playerId: Player; card: Card; lane: number; slot: number };
    }
  | { type: "REMOVE_CARD_HAND"; payload: { playerId: Player; cards: Card[] } };

const emptyField = (): (Card | null)[][] =>
  Array(3)
    .fill(null)
    .map(() => Array(2).fill(null));

export const initialState: GameState = {
  deck: [],
  fieldCards: emptyField(),
  playerFields: {
    player1: emptyField(),
    player2: emptyField(),
  },
  hands: {
    player1: [],
    player2: [],
  },
  currentTurn: "player1",
  currentPhase: "Main Phase",
  phaseAction: null,
  selectedCard: null,
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INIT_GAME": {
      const shuffled = [...action.payload.cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return {
        ...state,
        deck: shuffled,
        fieldCards: [
          [shuffled[0], shuffled[1]],
          [shuffled[2], shuffled[3]],
          [shuffled[4], shuffled[5]],
        ],
        hands: {
          player1: shuffled.slice(6, 9),
          player2: shuffled.slice(9, 13),
        },
      };
    }
    case "CHANGE_PHASE": {
      if (state.currentPhase === "Main Phase") {
        return { ...state, currentPhase: "Action Phase", phaseAction: null };
      } else if (state.currentPhase === "Action Phase") {
        return { ...state, currentPhase: "End Phase" };
      } else {
        return {
          ...state,
          currentPhase: "Main Phase",
          currentTurn: state.currentTurn === "player1" ? "player2" : "player1",
        };
      }
    }
    case "PHASE_ACTION": {

      return { ...state, phaseAction: action.payload};
    }
    case "SELECT_CARD": {
      return { ...state, selectedCard: action.payload };
    }
    case "PLAY_CARD": {
      const { playerId, card, lane, slot } = action.payload;
      const newFields = state.playerFields[playerId].map((row, i) =>
        i === lane ? row.map((c, j) => (j === slot ? card : c)) : row
      );
      return {
        ...state,
        hands: {
          ...state.hands,
          [playerId]: state.hands[playerId].filter((c) => c.id !== card.id),
        },
        playerFields: {
          ...state.playerFields,
          [playerId]: newFields,
        },
      };
    }
    case "REMOVE_CARD_HAND": {
      const { playerId, cards } = action.payload;
      return {
        ...state,
        hands: {
          ...state.hands,
          [playerId]: state.hands[playerId].filter(
            (card) => !cards.some((c) => c.id === card.id)
          ),
        },
      };
    }
    default:
      return state;
  }
}
