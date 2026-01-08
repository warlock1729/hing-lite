/*
  Warnings:

  - A unique constraint covering the columns `[inviteCode]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sprintId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Made the column `inviteCode` on table `Workspace` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "sprintId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Workspace" ALTER COLUMN "inviteCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_inviteCode_key" ON "Workspace"("inviteCode");
