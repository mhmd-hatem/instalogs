/*
  Warnings:

  - You are about to drop the column `TeamId` on the `event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_TeamId_fkey`;

-- AlterTable
ALTER TABLE `event` DROP COLUMN `TeamId`,
    ADD COLUMN `teamId` INTEGER NULL,
    MODIFY `event` ENUM('LOGIN', 'LOGOUT', 'GET_EVENTS', 'CREATE_INCIDENT', 'UPDATE_INCIDENT', 'DELETE_INCIDENT', 'EXIT_TEAM', 'REMOVE_TEAMMATE', 'ADD_TEAMMATE', 'CREATE_TEAM', 'UPDATE_TEAM', 'DELETE_TEAM', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER') NOT NULL;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
