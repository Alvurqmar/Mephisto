'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { pusherClient } from "@/app/lib/pusherClient";

type Player = {
  name: string;
  player_key: string | null;
};

export default function LobbyPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [lobbyCode, setLobbyCode] = useState<string>("");

  useEffect(() => {
    async function fetchLobbyData() {
      try {
        const res = await fetch("/api/lobbies/getById", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lobbyId: gameId }),
        });
        if (!res.ok) throw new Error("No se pudo obtener el código del lobby");
        const data = await res.json();
        setLobbyCode(data.code);
        setPlayers(data.players.rows);
      } catch (err) {
        console.error(err);
      }
    }
    fetchLobbyData();
  }, [gameId]);

  async function joinLobby() {
    try {
      const res = await fetch("/api/lobbies/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lobbyId: gameId,
          name,
        }),
      });
      if (!res.ok) throw new Error("Error al unirse al lobby");
      const data = await res.json();

      const players = JSON.parse(localStorage.getItem("players") || "{}");
      players[gameId] = data.playerKey;
      localStorage.setItem("players", JSON.stringify(players));
    } catch (err) {
      console.error(err);
      alert("No se pudo unir al lobby");
    }
  }

  async function startGame() {
    try {
      const res = await fetch("/api/games/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lobbyId: gameId }),
      });
      if (!res.ok) throw new Error("Error al iniciar la partida");
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar la partida");
    }
  }

  useEffect(() => {
    const channel = pusherClient.subscribe(`lobby-${gameId}`);

    channel.bind("players-updated", (data: { players: Player[] }) => {
      setPlayers(data.players);
    });

    channel.bind("game-started", (data: { gameId: string }) => {
      router.push(`/game/${data.gameId}`);
    });

    return () => {
      pusherClient.unsubscribe(`lobby-${gameId}`);
    };
  }, [gameId, router]);

  return (
    <div
      className="flex flex-col items-center p-8 text-[#d4af37] min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/MephistoBG.jpg')" }}
    >
      <h1 className="text-3xl mb-4">
        Código del Lobby: {lobbyCode || "Cargando..."}
      </h1>

      <input
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 p-2 rounded border border-amber-500"
        disabled={players.length >= 4}
      />

      {players.length >= 4 ? (
        <div className="mb-4 p-3 bg-red-900 border border-red-600 rounded text-center">
          <p className="text-white">El lobby está lleno</p>
        </div>
      ) : (
        <button
          onClick={joinLobby}
          disabled={!name.trim()}
          className="mb-4 rounded-full border border-solid border-[#d4af37] px-6 py-3 text-xl hover:bg-[#d4af37] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#d4af37]"
        >
          Unirse al Lobby
        </button>
      )}

      <button
        onClick={startGame}
        className="rounded-full border border-solid border-[#d4af37] px-6 py-3 text-xl hover:bg-[#d4af37] hover:text-black transition-all"
      >
        Iniciar Partida
      </button>

      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl mb-4">
          Jugadores en el lobby: {players.length}/4
        </h2>
        <ul className="list-disc pl-5">
          {players.map((p) => (
            <li key={p.player_key}>{p.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
