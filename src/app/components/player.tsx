interface PlayerProps {
  name: string;
  favor: number;
  isOpponent?: boolean;
  soulPoints: number;
}

export default function Player({ name, favor, soulPoints,  isOpponent = false }: PlayerProps) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm">Favor: {favor}</p>
      <p className="text-sm">Soul Points: {soulPoints}</p>
    </div>
  );
}
