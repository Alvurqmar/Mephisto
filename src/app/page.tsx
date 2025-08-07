'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [joinGameId, setJoinGameId] = useState("");

  const createGame = async () => {
    try {
      const res = await fetch("/api/lobby", { method: "POST" });
      const { gameId } = await res.json();
      router.push(`/lobby/${gameId}`);
    } catch (error) {
      alert("Error creando la partida");
    }
  };

  const joinGame = () => {
    if (joinGameId.trim() === "") {
      alert("Ingresa un código de partida válido");
      return;
    }
    router.push(`/lobby/${joinGameId.trim()}`);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-uncial-antiqua)] bg-[url('/MephistoBG.jpg')] bg-cover bg-no-repeat bg-center">
      <header>
        <Image
          className="w-auto h-auto"
          src="/mephisto_title.png"
          alt="Mephisto logo"
          width={300}
          height={100}
          priority
        />
      </header>

      <main className="flex flex-col gap-[128px] row-start-2 items-center justify-center sm:items-center">
        <section className="text-center sm:text-left">
          <ul className="list-inside text-sm/6 font-[family-name:var(--font-uncial-antiqua)] text-outline-dark">
            <li className="mb-4 text-2xl tracking-wide text-[#d4af37]">
              Bienvenido, si estás aquí es porque has hecho un pacto con un
              diablo muy poderoso, Mephisto.
            </li>
            <li className="mb-4 text-2xl tracking-wide text-[#d4af37]">
              A cambio de fuerza y poder, deberás conseguir las almas de los
              monstruos que encuentres en la mazmorra.
            </li>
            <li className="mb-4 text-2xl tracking-wide text-[#d4af37]">
              Pero no estás solo, habrá otros jugadores que intentarán conseguir
              las almas antes que tú.
            </li>
            <li className="mb-4 text-2xl tracking-wide text-[#d4af37]">
              Vence, o estarás condenado a servir a Mephisto por toda la
              eternidad. Buena suerte.
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-1 items-center">
          <button
            onClick={createGame}
            className="rounded-full border border-[#d4af37] px-8 py-4 text-xl text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
          >
            Crear nueva partida
          </button>

          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Código de partida"
              value={joinGameId}
              onChange={(e) => setJoinGameId(e.target.value)}
              className="px-4 py-2 rounded-md bg-black/70 border border-[#d4af37] text-[#d4af37]"
            />
            <button
              onClick={joinGame}
              className="rounded-full border border-[#d4af37] px-6 py-2 text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition"
            >
              Unirse a partida
            </button>
          </div>
        </section>
      </main>

      <footer className="row-start-3 flex flex-col sm:flex-row gap-6 flex-wrap items-center justify-center sm:justify-start text-center sm:text-left">
        <a
          className="rounded-full border border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#000000] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          href="https://github.com/Alvurqmar/Mephisto"
          target="_blank"
          rel="noopener noreferrer"
        >
          Repositorio de Github
        </a>
        <a
          className="rounded-full border border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#000000] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          href="https://sites.google.com/view/mephisto/home/rules"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mira las reglas originales aquí
        </a>
      </footer>
    </div>
  );
}
