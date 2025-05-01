import Board from "./board";
import Link from "next/link";
export default function Page() {

  return (
    <div className="bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center">
      <Board />
    </div>
  );
  }