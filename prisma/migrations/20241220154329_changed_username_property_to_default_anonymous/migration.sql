-- DropIndex
DROP INDEX "score_username_key";

-- AlterTable
ALTER TABLE "score" ALTER COLUMN "username" SET DEFAULT 'Anonymous';
