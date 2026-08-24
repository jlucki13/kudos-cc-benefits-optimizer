/**
 * The card catalog: reference data, versioned in git, source of truth.
 *
 * Seeded into the database by prisma/seed.ts via slug-keyed upserts, so this
 * can be edited and re-seeded without disturbing any user's redemption history.
 *
 * Provenance: every figure was checked against live web search on the
 * `dataAsOf` date. `sourceUrl` is the issuer's canonical product page and is
 * the right thing for the app to link to, but note that direct page fetching
 * was blocked in the build environment, so these are citations rather than
 * fetch receipts. Benefit terms change often — treat this as a tracker's
 * working copy, not an authority.
 */
import type { SeedCard } from './types';

export { issuers } from './issuers';
export { pointsCurrencies } from './points';
export type * from './types';

import amexBlueCashPreferred from './cards/amex-blue-cash-preferred';
import amexBusinessPlatinum from './cards/amex-business-platinum';
import amexGold from './cards/amex-gold';
import amexPlatinum from './cards/amex-platinum';
import biltBlue from './cards/bilt-blue';
import capitalOneVenture from './cards/capital-one-venture';
import capitalOneVentureX from './cards/capital-one-venture-x';
import chaseFreedomUnlimited from './cards/chase-freedom-unlimited';
import chaseSapphirePreferred from './cards/chase-sapphire-preferred';
import chaseSapphireReserve from './cards/chase-sapphire-reserve';
import citiStrataPremier from './cards/citi-strata-premier';
import deltaSkymilesReserve from './cards/delta-skymiles-reserve';
import hiltonHonorsAspire from './cards/hilton-honors-aspire';
import marriottBonvoyBrilliant from './cards/marriott-bonvoy-brilliant';
import unitedExplorer from './cards/united-explorer';

export const cards: SeedCard[] = [
  chaseSapphireReserve,
  chaseSapphirePreferred,
  chaseFreedomUnlimited,
  amexPlatinum,
  amexBusinessPlatinum,
  amexGold,
  amexBlueCashPreferred,
  capitalOneVentureX,
  capitalOneVenture,
  citiStrataPremier,
  marriottBonvoyBrilliant,
  hiltonHonorsAspire,
  deltaSkymilesReserve,
  unitedExplorer,
  biltBlue,
];

export const cardsBySlug = new Map(cards.map((c) => [c.slug, c]));
