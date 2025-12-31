/*
  Warnings:

  - You are about to drop the column `sprintId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Sprint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_sprintId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "sprintId",
ADD COLUMN     "spaceId" INTEGER;

-- DropTable
DROP TABLE "Sprint";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;
