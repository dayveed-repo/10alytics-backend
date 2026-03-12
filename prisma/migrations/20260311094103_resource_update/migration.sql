/*
  Warnings:

  - You are about to drop the column `videoDuration` on the `Resource` table. All the data in the column will be lost.
  - Added the required column `videoDurationInMins` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "videoDuration",
ADD COLUMN     "videoDurationInMins" INTEGER NOT NULL,
ALTER COLUMN "videoFileType" DROP NOT NULL;
