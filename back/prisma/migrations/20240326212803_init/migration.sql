/*
  Warnings:

  - You are about to drop the column `f_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `l_name` on the `user` table. All the data in the column will be lost.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `f_name`,
    DROP COLUMN `l_name`,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL DEFAULT '';
