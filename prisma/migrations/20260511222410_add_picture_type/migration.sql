/*
  Warnings:

  - Added the required column `type` to the `pictures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pictures` ADD COLUMN `type` ENUM('USER_AVATAR', 'REWARD_AVATAR') NOT NULL;
