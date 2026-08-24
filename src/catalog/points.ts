import type { SeedPointsCurrency, SeedPointsValuation } from './types';

/**
 * milliCentsPerPoint = cents-per-point x 1000. 1.5 cents/pt => 1500.
 *
 * All valuations below are ESTIMATES. Points-valuation guides are opinion, not
 * issuer-published rates; the only figures an issuer actually guarantees are the
 * fixed redemption rates (cash back / travel portal). Baseline figures verified
 * 2026-08-24 against the Upgraded Points "Travel Points and Miles: How Much Are
 * They Worth? [August 2026]" valuation guide
 * (https://upgradedpoints.com/travel/points-and-miles-valuations/).
 */
export const pointsCurrencies: SeedPointsCurrency[] = [
  {
    slug: 'chase-ultimate-rewards',
    name: 'Chase Ultimate Rewards',
    shortName: 'UR',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 2050,
        label: 'Typical value',
        notes:
          'Estimate. Reflects the ~2.05 cents/pt blended valuation published by points-valuation guides as of August 2026; achievable mainly via airline/hotel transfer partners, not guaranteed by Chase.',
      },
      {
        method: 'CASH_BACK',
        milliCentsPerPoint: 1000,
        label: 'Cash back / statement credit',
        notes: 'Chase redeems Ultimate Rewards for cash or statement credit at a fixed 1 cent per point.',
      },
      {
        method: 'TRAVEL_PORTAL',
        milliCentsPerPoint: 1000,
        label: 'Chase Travel (base rate)',
        notes:
          'The old flat 1.5 cents/pt Sapphire Reserve portal rate was retired on 2025-10-26 and replaced by Points Boost. Base portal redemptions are now 1 cent per point; Points Boost offers reach up to 2 cents on select flights and hotels. Modeled conservatively at the base rate.',
      },
      {
        method: 'TRANSFER_PARTNERS',
        milliCentsPerPoint: 2050,
        label: 'Airline & hotel transfer partners',
        notes: 'Estimate. Requires finding award space with a 1:1 transfer partner; real-world value varies widely.',
      },
    ],
  },
  {
    slug: 'amex-membership-rewards',
    name: 'American Express Membership Rewards',
    shortName: 'MR',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 2000,
        label: 'Typical value',
        notes:
          'Estimate. Reflects the ~2.0 cents/pt blended valuation published by points-valuation guides as of August 2026; achievable mainly via airline/hotel transfer partners.',
      },
      {
        method: 'CASH_BACK',
        milliCentsPerPoint: 600,
        label: 'Statement credit',
        notes:
          'Estimate at the low end of the 0.6-1.0 cents/pt range that valuation guides cite for statement-credit and gift-card style redemptions. Amex statement credits are widely reported at 0.6 cents per point.',
      },
      {
        method: 'TRAVEL_PORTAL',
        milliCentsPerPoint: 1000,
        label: 'Amex Travel (flights)',
        notes: 'Estimate. Roughly 1 cent per point booking flights through American Express Travel.',
      },
      {
        method: 'TRANSFER_PARTNERS',
        milliCentsPerPoint: 2000,
        label: 'Airline & hotel transfer partners',
        notes: 'Estimate. Requires finding award space with a transfer partner; real-world value varies widely.',
      },
    ],
  },
  {
    slug: 'capital-one-miles',
    name: 'Capital One Miles',
    shortName: 'Miles',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 2000,
        label: 'Typical value',
        notes:
          'Estimate. Valuation guides put 100,000 Capital One miles at roughly $2,000 as of August 2026, achieved via airline/hotel transfer partners.',
      },
      {
        method: 'TRAVEL_PORTAL',
        milliCentsPerPoint: 1000,
        label: 'Capital One Travel',
        notes: 'Capital One Travel bookings redeem at a fixed 1 cent per mile.',
      },
      {
        method: 'TRANSFER_PARTNERS',
        milliCentsPerPoint: 2000,
        label: 'Airline & hotel transfer partners',
        notes: 'Estimate. Requires finding award space with a transfer partner; real-world value varies widely.',
      },
    ],
  },
  {
    slug: 'marriott-bonvoy',
    name: 'Marriott Bonvoy Points',
    shortName: 'Bonvoy',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 700,
        label: 'Typical value',
        notes:
          'Estimate. Valuation guides put Marriott Bonvoy points at roughly 0.7-0.8 cents each as of August 2026. Marriott uses dynamic award pricing, so realized value varies by property and date.',
      },
    ],
  },
  {
    slug: 'hilton-honors',
    name: 'Hilton Honors Points',
    shortName: 'Honors',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 500,
        label: 'Typical value',
        notes:
          'Estimate. Valuation guides put Hilton Honors points in a 0.35-0.5 cents range as of August 2026; 0.5 cents is the optimistic end and assumes strong redemptions.',
      },
    ],
  },
  {
    slug: 'delta-skymiles',
    name: 'Delta SkyMiles',
    shortName: 'SkyMiles',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 1200,
        label: 'Typical value',
        notes:
          'Estimate. Valuation guides put Delta SkyMiles at roughly 1.2 cents each on average as of August 2026. SkyMiles are dynamically priced, so value swings with cash fares.',
      },
    ],
  },
  {
    slug: 'citi-thankyou',
    name: 'Citi ThankYou Points',
    shortName: 'ThankYou',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 1900,
        label: 'Typical value',
        notes:
          'Estimate. Valuation guides put Citi ThankYou points at roughly 1.9 cents each as of August 2026, achieved via airline/hotel transfer partners.',
      },
      {
        method: 'TRANSFER_PARTNERS',
        milliCentsPerPoint: 1900,
        label: 'Airline & hotel transfer partners',
        notes: 'Estimate. Requires finding award space with a transfer partner; real-world value varies widely.',
      },
    ],
  },
  {
    slug: 'bilt-points',
    name: 'Bilt Rewards Points',
    shortName: 'Bilt',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 2200,
        label: 'Typical value',
        notes:
          'Estimate. Valuation guides put Bilt Rewards points at roughly 2.2 cents each as of August 2026 — the highest-valued transferable currency in those guides.',
      },
      {
        method: 'TRANSFER_PARTNERS',
        milliCentsPerPoint: 2200,
        label: 'Airline & hotel transfer partners',
        notes: 'Estimate. Requires finding award space with a transfer partner; real-world value varies widely.',
      },
    ],
  },
  {
    slug: 'united-mileageplus',
    name: 'United MileagePlus Miles',
    shortName: 'MileagePlus',
    valuations: [
      {
        method: 'DEFAULT',
        milliCentsPerPoint: 1300,
        label: 'Typical value',
        notes:
          'Estimate, mid-range. Published 2026 valuations for United miles span roughly 1.2 to 1.35 cents each (NerdWallet ~1.2, FrequentMiler ~1.3, The Points Guy ~1.35). United uses dynamic award pricing, so realized value swings with cash fares.',
      },
    ],
  },
];

export default pointsCurrencies;
