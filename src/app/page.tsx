import Image from "next/image";
import Link from "next/link";

export const metadata = {
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-uncial-antiqua)] bg-[url('/MephistoBG.jpg')] bg-cover bg-no-repeat bg-center">
      
      <header>
        <Image
          src="/mephisto_title.png"
          alt="Mephisto logo"
          width={320}
          height={100}
          priority
        />
      </header>


      <main className="flex flex-col gap-[128px] row-start-2 items-center sm:items-start">

        <section className="text-center sm:text-left">
          <ul className="list-inside text-sm/6 font-[family-name:var(--font-uncial-antiqua)] text-outline-dark">
            <li className="mb-4 text-2xl tracking-wide text-[#d4af37]">
              Bienvenido, si estás aquí es porque has hecho un pacto con un diablo muy poderoso, Mephisto.
            </li>
            <li className="mb-4 text-2xl tracking-wide text-[#d4af37]">
              A cambio de fuerza y poder, deberás conseguir las almas de los monstruos que encuentres en la mazmorra.
            </li>
            <li className="mb-4 text-2xl tracking-wide text-[#d4af37]">
              Pero no estás solo, habrá otros jugadores que intentarán conseguir las almas antes que tú.
            </li>
            <li className="mb-4 text-2xl tracking-wide text-[#d4af37]">
              Vence, o estarás condenado a servir a Mephisto por toda la eternidad. Buena suerte.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-6 items-center">
          <Link
            href="game"
            className="rounded-full border border-solid border-[#d4af37] px-6 py-3 text-xl text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
          >
            Comienza a jugar
          </Link>
        </section>

        <section className="flex flex-col gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="text-base tracking-wide text-[#d4af37]">
              Comienza seedeando la base de datos, para que puedas jugar.
            </span>
            <Link
              href="seed"
              className="rounded-full border border-solid border-[#d4af37] px-6 py-3 text-xl text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition-all"
            >
              Pulsa aquí 
            </Link>
          </div>
        </section>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-start">
        <a
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#000000] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          href="https://github.com/Alvurqmar/Mephisto"
          target="_blank"
          rel="noopener noreferrer"
        >
          Repositorio de Github
        </a>
        <a
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#000000] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
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