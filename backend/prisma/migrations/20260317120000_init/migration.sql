-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "DumpsterStatus" AS ENUM ('AVAILABLE', 'RENTED');

-- CreateEnum
CREATE TYPE "RentalStatus" AS ENUM ('ACTIVE', 'FINISHED');

-- CreateTable
CREATE TABLE "Dumpster" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "status" "DumpsterStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dumpster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "reference" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "notes" TEXT,
    "status" "RentalStatus" NOT NULL DEFAULT 'ACTIVE',
    "dumpsterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dumpster_serialNumber_key" ON "Dumpster"("serialNumber");

-- CreateIndex
CREATE INDEX "Rental_dumpsterId_idx" ON "Rental"("dumpsterId");

-- CreateIndex
CREATE INDEX "Rental_status_idx" ON "Rental"("status");

-- CreateIndex
CREATE INDEX "Rental_customerName_idx" ON "Rental"("customerName");

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_dumpsterId_fkey" FOREIGN KEY ("dumpsterId") REFERENCES "Dumpster"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
