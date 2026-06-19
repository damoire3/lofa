/*
  Warnings:

  - You are about to alter the column `rentAmount` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `deposit` on the `contracts` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `flwTransactionId` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `expectedAmount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `commission` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `propertyId` on the `tenants` table. All the data in the column will be lost.
  - Added the required column `contractId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_propertyId_fkey";

-- AlterTable
ALTER TABLE "contracts" ALTER COLUMN "rentAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "deposit" DROP NOT NULL,
ALTER COLUMN "deposit" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "flwTransactionId",
ADD COLUMN     "contractId" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "expectedAmount" SET DATA TYPE INTEGER,
ALTER COLUMN "commission" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "propertyId";

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
