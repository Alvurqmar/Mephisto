'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { pusherClient } from "../../lib/pusherClient";

export default function LobbyPage() {
  const { gameId } = useParams();
  const [players, setPlayers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedName = sessionStorage.getItem(`mephisto_name_${gameId}`);
    if (savedName) setName(savedName);
  }, [gameId]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const res = await fetch(`/api/lobby/${gameId}`);
      const data = await res.json();
      if (res.ok) setPlayers(data.players);
    };

    fetchPlayers();

    const channel = pusherClient.subscribe(`lobby-${gameId}`);
    channel.bind("update-players", (data: { players: string[] }) => {
      setPlayers(data.players);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [gameId]);

  const handleJoin = async () => {
    if (!name.trim()) return alert("Por favor, introduce un nombre");

    setLoading(true);
    try {
      const res = await fetch(`/api/lobby/${gameId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem(`mephisto_name_${gameId}`, name.trim());
      } else {
        alert(data.error || "Error al unirse");
      }
    } catch {
      alert("Error conectando con el servidor");
    }
    setLoading(false);
  };

  const isHost = name.trim() && players.length > 0 && name.trim() === players[0];
  const canStart = isHost && players.length >= 2 && players.length <= 4;

  return (
    <div className="p-8 min-h-screen bg-[#000000cc] text-[#d4af37] font-[family-name:var(--font-uncial-antiqua)]">
      <h1 className="text-3xl mb-4">Sala de espera - ID: {gameId}</h1>

      <div className="mb-6">
        <h2 className="text-xl mb-2">Jugadores conectados:</h2>
        {players.length === 0 ? (
          <p>No hay jugadores aún</p>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {players.map((p, i) => (
              <li key={p} className={i === 0 ? "font-bold" : ""}>
                {p} {i === 0 && "(Host)"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!players.includes(name.trim()) ? (
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-2 py-1 rounded border border-[#d4af37] bg-black text-[#d4af37]"
            disabled={loading}
          />
          <button
            onClick={handleJoin}
            className="px-4 py-1 rounded border border-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
            disabled={loading}
          >
            {loading ? "Uniendo..." : "Unirse a la partida"}
          </button>
        </div>
      ) : (
        <p className="mb-4">Ya estás en la partida como <strong>{name}</strong>.</p>
      )}

      {canStart && (
        <button
          onClick={() => alert("Iniciar partida (a implementar)")}
          className="mt-6 px-6 py-2 rounded bg-[#d4af37] text-black font-bold hover:bg-yellow-400 transition"
        >
          Iniciar partida
        </button>
      )}
    </div>
  );
}
