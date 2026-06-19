-- CreateEnum
CREATE TYPE "IdType" AS ENUM ('CNI', 'PASSPORT', 'RESIDENCE_PERMIT', 'VOTER_CARD');

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "idType" "IdType",
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "placeOfBirth" TEXT;
