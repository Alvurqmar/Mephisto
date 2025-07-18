interface Player {
  id: string;
  name: string;
  favor: number;
  soulPoints: number;
}

export default function Player({ name, favor, soulPoints }: Player) {
  return (
    <div className="text-center">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-sm">Favor: {favor}</p>
      <p className="text-sm">Soul Points: {soulPoints}</p>
    </div>
  );
}
