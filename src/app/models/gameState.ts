import Card from "./card";
import DiscardPile from "./discardPile";
import Field from "./field";
import Hand from "./hand";
import Player from "./player";

export interface GameState {
  id: string;
  lobbyId: string;
  deck: Card[];
  discardPile: DiscardPile;
  hands: Record<string, Card[]>;
  field: Field;
  currentTurn: string;       
  currentPhase: string;        
  phaseAction: string | null;
  players: Record<string, Player>; 
  turnCounter: number;
  winningSoulPoints: number;
  status: string;              
}