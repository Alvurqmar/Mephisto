import Card from "@/app/models/card";
import Field from "@/app/models/field";

export function getFieldCards(field: Field) {
  const cards = [];
  for (let row = 0; row < field.slots.length; row++) {
    for (let col = 0; col < field.slots[row].length; col++) {
      const slot = field.slots[row][col];
      if (slot.card) {
        cards.push(slot.card);
      }
    }
  }
  return cards;
}

export function filterFieldType(field: Field, type: string) {
  const resCards = getFieldCards(field);
  return resCards.filter((card) => card.type === type);
}

export function cardPos(field: Field, cardId: number): { row: number; col: number } | null {
  for (let row = 0; row < field.slots.length; row++) {
    for (let col = 0; col < field.slots[row].length; col++) {
      const slot = field.slots[row][col];
      if (slot.card && slot.card.id === cardId) {
        return { row, col };
      }
    }
  }
  return null;
}

export function filterLaneType(field: Field, cardId: number, type: string, orientation: string): Card[] {
  const position = cardPos(field, cardId);
  if (!position) return [];
  
  const { row, col } = position;
  const cards: Card[] = [];
  
  if (orientation === 'horizontal') {
    for (let c = 0; c < field.slots[row].length; c++) {
      const slot = field.slots[row][c];
      if (slot.card && slot.card.id !== cardId) {
        cards.push(slot.card);
      }
    }
  } else if (orientation === 'vertical') {
    for (let r = 0; r < field.slots.length; r++) {
      const slot = field.slots[r][col];
      if (slot.card && slot.card.id !== cardId) {
        cards.push(slot.card);
      }
    }
  } else{
    console.error("orientation not defined") 
  }
  
  if (type) {
    const typeFilters = type.split('|');
    return cards.filter(card => typeFilters.includes(card.type));
  }
  
  return cards;
}

export function filterCardOwner(cards: Card[], playerId: string): Card[] {
  return cards.filter(card => card.owner === playerId);
}

