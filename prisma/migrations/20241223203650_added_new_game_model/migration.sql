/*
  Warnings:

  - You are about to drop the `score` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "score";

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'Anonymous',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameTime" DOUBLE PRECISION NOT NULL,
    "gameId" INTEGER NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
