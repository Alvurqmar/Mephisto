'use client';

import Board from './board';

export default function Page() {

  return (
    <div className="bg-[url('/GameBg.jpg')] bg-cover bg-no-repeat bg-center">
      <Board />
    </div>
  );
}
