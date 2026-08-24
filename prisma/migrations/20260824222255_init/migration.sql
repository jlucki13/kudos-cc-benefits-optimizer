-- CreateTable
CREATE TABLE "Issuer" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "brandColor" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PointsCurrency" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PointsValuation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "currencySlug" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "milliCentsPerPoint" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "notes" TEXT,
    CONSTRAINT "PointsValuation_currencySlug_fkey" FOREIGN KEY ("currencySlug") REFERENCES "PointsCurrency" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardProduct" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "issuerSlug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "annualFeeCents" INTEGER NOT NULL,
    "aprLowBps" INTEGER NOT NULL,
    "aprHighBps" INTEGER NOT NULL,
    "foreignTxFeeBps" INTEGER,
    "pointsCurrencySlug" TEXT,
    "art" JSONB NOT NULL,
    "dataAsOf" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "retiredAt" TEXT,
    CONSTRAINT "CardProduct_issuerSlug_fkey" FOREIGN KEY ("issuerSlug") REFERENCES "Issuer" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CardProduct_pointsCurrencySlug_fkey" FOREIGN KEY ("pointsCurrencySlug") REFERENCES "PointsCurrency" ("slug") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RewardRate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardProductSlug" TEXT NOT NULL,
    "multiplierX100" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "endsOn" TEXT,
    "sortOrder" INTEGER NOT NULL,
    CONSTRAINT "RewardRate_cardProductSlug_fkey" FOREIGN KEY ("cardProductSlug") REFERENCES "CardProduct" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Benefit" (
    "slug" TEXT NOT NULL PRIMARY KEY,
    "cardProductSlug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortTitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "brandKey" TEXT,
    "valueCents" INTEGER,
    "valuePoints" INTEGER,
    "thresholdCents" INTEGER,
    "cadence" TEXT NOT NULL,
    "periodsPerYear" INTEGER NOT NULL,
    "defaultResetBasis" TEXT NOT NULL,
    "everyNYears" INTEGER,
    "windowStart" TEXT,
    "windowEnd" TEXT,
    "registerByDate" TEXT,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL,
    "retiredAt" TEXT,
    CONSTRAINT "Benefit_cardProductSlug_fkey" FOREIGN KEY ("cardProductSlug") REFERENCES "CardProduct" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'local',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "UserPointsPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "currencySlug" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'DEFAULT',
    CONSTRAINT "UserPointsPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserPointsPreference_currencySlug_fkey" FOREIGN KEY ("currencySlug") REFERENCES "PointsCurrency" ("slug") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cardProductSlug" TEXT NOT NULL,
    "nickname" TEXT,
    "last4" TEXT,
    "openedAt" TEXT,
    "statementDayOfMonth" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "removedAt" TEXT,
    "plaidItemId" TEXT,
    "plaidAccountId" TEXT,
    CONSTRAINT "UserCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCard_cardProductSlug_fkey" FOREIGN KEY ("cardProductSlug") REFERENCES "CardProduct" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserCardBenefit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userCardId" TEXT NOT NULL,
    "benefitSlug" TEXT NOT NULL,
    "resetBasisOverride" TEXT,
    "anchorOverride" TEXT,
    "customValueCents" INTEGER,
    "isTracked" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "UserCardBenefit_userCardId_fkey" FOREIGN KEY ("userCardId") REFERENCES "UserCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCardBenefit_benefitSlug_fkey" FOREIGN KEY ("benefitSlug") REFERENCES "Benefit" ("slug") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BenefitPeriod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userCardBenefitId" TEXT NOT NULL,
    "periodStart" TEXT NOT NULL,
    "periodEnd" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "valueCentsSnapshot" INTEGER,
    "valuePointsSnapshot" INTEGER,
    "thresholdCentsSnapshot" INTEGER,
    CONSTRAINT "BenefitPeriod_userCardBenefitId_fkey" FOREIGN KEY ("userCardBenefitId") REFERENCES "UserCardBenefit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BenefitEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "benefitPeriodId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "amountCents" INTEGER,
    "amountPoints" INTEGER,
    "occurredAt" TEXT NOT NULL,
    "note" TEXT,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "externalTxnId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BenefitEntry_benefitPeriodId_fkey" FOREIGN KEY ("benefitPeriodId") REFERENCES "BenefitPeriod" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PointsValuation_currencySlug_method_key" ON "PointsValuation"("currencySlug", "method");

-- CreateIndex
CREATE INDEX "RewardRate_cardProductSlug_sortOrder_idx" ON "RewardRate"("cardProductSlug", "sortOrder");

-- CreateIndex
CREATE INDEX "Benefit_cardProductSlug_sortOrder_idx" ON "Benefit"("cardProductSlug", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "UserPointsPreference_userId_currencySlug_key" ON "UserPointsPreference"("userId", "currencySlug");

-- CreateIndex
CREATE INDEX "UserCard_userId_sortOrder_idx" ON "UserCard"("userId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "UserCardBenefit_userCardId_benefitSlug_key" ON "UserCardBenefit"("userCardId", "benefitSlug");

-- CreateIndex
CREATE INDEX "BenefitPeriod_periodEnd_idx" ON "BenefitPeriod"("periodEnd");

-- CreateIndex
CREATE INDEX "BenefitPeriod_userCardBenefitId_periodStart_idx" ON "BenefitPeriod"("userCardBenefitId", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "BenefitPeriod_userCardBenefitId_periodStart_key" ON "BenefitPeriod"("userCardBenefitId", "periodStart");

-- CreateIndex
CREATE UNIQUE INDEX "BenefitEntry_externalTxnId_key" ON "BenefitEntry"("externalTxnId");

-- CreateIndex
CREATE INDEX "BenefitEntry_benefitPeriodId_idx" ON "BenefitEntry"("benefitPeriodId");
