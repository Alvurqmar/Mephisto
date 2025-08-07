-- CreateEnum
CREATE TYPE "public"."card_type" AS ENUM ('MONSTER', 'ITEM', 'WEAPON', 'SPELL');

-- CreateEnum
CREATE TYPE "public"."effect_type" AS ENUM ('ETB', 'CE', 'AA');

-- CreateTable
CREATE TABLE "public"."Lobby" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lobby_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lobbyId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."card_type" NOT NULL,
    "cost" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "durability" INTEGER NOT NULL,
    "effectid" TEXT NOT NULL,
    "effecttype" "public"."effect_type" NOT NULL,
    "soulPts" INTEGER NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_lobbyId_key" ON "public"."User"("name", "lobbyId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_lobbyId_fkey" FOREIGN KEY ("lobbyId") REFERENCES "public"."Lobby"("id") ON DELETE SET NULL ON UPDATE CASCADE;
