/*
  Warnings:

  - You are about to drop the column `epicId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Epic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subtask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubtaskAssignee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Epic" DROP CONSTRAINT "Epic_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Subtask" DROP CONSTRAINT "Subtask_taskId_fkey";

-- DropForeignKey
ALTER TABLE "SubtaskAssignee" DROP CONSTRAINT "SubtaskAssignee_subtaskId_fkey";

-- DropForeignKey
ALTER TABLE "SubtaskAssignee" DROP CONSTRAINT "SubtaskAssignee_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_epicId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "epicId";

-- DropTable
DROP TABLE "Epic";

-- DropTable
DROP TABLE "Subtask";

-- DropTable
DROP TABLE "SubtaskAssignee";
