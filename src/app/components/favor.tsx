import { useEffect, useState } from 'react';

export default function Favor() {
    const [favor, setFavor] = useState(3);

function modifyFavor(current: number, change: number): number {
    return Math.max(0, Math.min(10, current + change));
  }
}