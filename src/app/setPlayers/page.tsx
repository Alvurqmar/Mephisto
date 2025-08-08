"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ToastProvider from "../ui/toastProvider";

export default function SetupGame() {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(["", ""]);
  const router = useRouter();

  const handleCountChange = (count: number) => {
    setPlayerCount(count);
    setPlayerNames(Array(count).fill(""));
  };

  const handleNameChange = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

const handleStartGame = () => {
  for (let i = 0; i < playerNames.length; i++) {
    const name = playerNames[i].trim();
    if (name === "") {
      toast.error(`El nombre del jugador ${i + 1} no puede estar vacío.`);
      return;
    }
    if (name.length > 20) {
      toast.error(`El nombre del jugador ${i + 1} no puede tener más de 20 caracteres.`);
      return;
    }
  }

  const players = playerNames.map((name, index) => ({
    key: `p${index + 1}`,
    name: name.trim(),
    favorPoints: 0,
    soulPoints: 0,
  }));

  localStorage.setItem("mephisto-players", JSON.stringify(players));
  console.log("Jugadores guardados:", players);

  router.push("/game");
};



  return (
    <div className="min-h-screen p-10 bg-[url('/MephistoBG.jpg')] bg-cover bg-no-repeat bg-center text-[#d4af37] font-[family-name:var(--font-uncial-antiqua)]">
      <div className="max-w-xl mx-auto space-y-12 text-center">
        <div>
          <h2 className="text-2xl mb-4">¿Cuántos jugadores?</h2>
          <div className="flex justify-center gap-4">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => handleCountChange(n)}
                className={`px-4 py-2 border rounded-full transition ${
                  n === playerCount
                    ? "bg-[#d4af37] text-black"
                    : "border-[#d4af37] hover:bg-[#d4af37] hover:text-black"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl mb-4">Indique el nombre de los jugadores</h2>
          <div className="space-y-4">
            {playerNames.map((name, i) => (
              <input
                key={i}
                className="w-full px-4 py-2 rounded-md bg-black/70 border border-[#d4af37] text-[#d4af37] text-center"
                placeholder={`Jugador ${i + 1}`}
                value={name}
                onChange={(e) => handleNameChange(i, e.target.value)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="mt-6 px-8 py-3 rounded-full border border-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all text-xl"
        >
          Iniciar partida
        </button>
      </div>
      <ToastProvider />
    </div>
  );
}