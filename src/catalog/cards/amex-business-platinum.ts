import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'amex-business-platinum',
  issuer: 'amex',
  name: 'The Business Platinum Card® from American Express',
  shortName: 'Business Platinum',
  network: 'AMEX',
  annualFeeCents: 89500,
  aprLowBps: 1774,
  aprHighBps: 2849,
  foreignTxFeeBps: null,
  pointsCurrency: 'amex-membership-rewards',
  art: {
    gradient: ['#2B3440', '#4A5765', '#7E8A98'],
    pattern: 'sheen',
    textColor: '#F2F4F7',
    chipColor: '#B08D57',
  },
  dataAsOf: '2026-08-24',
  sourceUrl:
    'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/',
  rewards: [
    {
      multiplierX100: 500,
      category: 'Flights & Prepaid Hotels on AmexTravel.com',
      description:
        'Earn 5x Membership Rewards® points on flights and prepaid hotels booked on AmexTravel.com.',
    },
    {
      multiplierX100: 200,
      category: 'Key Business Categories',
      description:
        'Earn 2x points at U.S. construction material and hardware suppliers, electronic goods retailers, software and cloud system providers, and shipping providers, on up to $2 million of these purchases per calendar year.',
    },
    {
      multiplierX100: 200,
      category: 'Purchases of $5,000 or More',
      description:
        'Earn 2x points on each eligible purchase of $5,000 or more, on up to $2 million of these purchases per calendar year.',
    },
    {
      multiplierX100: 100,
      category: 'All Other Purchases',
      description: 'Earn 1x Membership Rewards® points on all other eligible purchases.',
    },
  ],
  benefits: [
    {
      slug: 'bizplat-hotel-credit',
      title: '$600 Annual Hotel Credit',
      shortTitle: 'Hotel Credit',
      description:
        'Up to $300 in statement credits semiannually (January–June and July–December), for up to $600 per calendar year, on prepaid Fine Hotels + Resorts® or The Hotel Collection bookings through American Express Travel. The Hotel Collection requires a two-night minimum stay.',
      brandKey: 'amex-travel',
      type: 'STATEMENT_CREDIT',
      valueCents: 30000,
      cadence: 'SEMIANNUAL',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'bizplat-indeed-credit',
      title: '$360 Annual Indeed Credit',
      shortTitle: 'Indeed Credit',
      description:
        'Up to $90 in statement credits each calendar quarter, for up to $360 per year, on purchases made at Indeed.com. Enrollment required.',
      brandKey: 'indeed',
      type: 'STATEMENT_CREDIT',
      valueCents: 9000,
      cadence: 'QUARTERLY',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'bizplat-hilton-business-credit',
      title: '$200 Annual Hilton for Business Credit',
      shortTitle: 'Hilton Credit',
      description:
        'Up to $50 in statement credits each calendar quarter, for up to $200 per year, on purchases made directly with Hilton. Requires Hilton for Business membership and enrollment.',
      brandKey: 'hilton',
      type: 'STATEMENT_CREDIT',
      valueCents: 5000,
      cadence: 'QUARTERLY',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'bizplat-dell-credit',
      title: '$150 Annual Dell Technologies Credit',
      shortTitle: 'Dell Credit',
      description:
        'Up to $150 in statement credits per calendar year on U.S. purchases made directly with Dell Technologies. From 2026 this is a single credit usable any time during the year rather than two semiannual halves. Enrollment required.',
      brandKey: 'dell',
      type: 'STATEMENT_CREDIT',
      valueCents: 15000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'bizplat-dell-bonus-credit-5k-spend',
      title: '$1,000 Dell Bonus Credit at $5,000 Dell Spend',
      shortTitle: 'Dell Bonus at $5k',
      description:
        'Spend $5,000 or more directly with Dell Technologies on the card in a calendar year to receive an additional $1,000 statement credit. Enrollment required.',
      brandKey: 'dell',
      type: 'SPEND_THRESHOLD',
      thresholdCents: 500000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'bizplat-adobe-credit-600-spend',
      title: '$250 Adobe Credit at $600 Adobe Spend',
      shortTitle: 'Adobe Credit',
      description:
        'Spend $600 or more on U.S. purchases directly with Adobe on the card in a calendar year to receive up to $250 in statement credits. Enrollment required.',
      brandKey: 'adobe',
      type: 'SPEND_THRESHOLD',
      thresholdCents: 60000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'bizplat-wireless-credit',
      title: '$120 Annual Wireless Credit',
      shortTitle: 'Wireless Credit',
      description:
        'Up to $10 in statement credits each month, for up to $120 per year, on wireless telephone service purchases made directly with a U.S. wireless provider. Enrollment required.',
      type: 'STATEMENT_CREDIT',
      valueCents: 1000,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'bizplat-airline-fee-credit',
      title: '$200 Airline Fee Credit',
      shortTitle: 'Airline Fee Credit',
      description:
        'Up to $200 in statement credits per calendar year on baggage fees and other incidentals charged by one qualifying airline you select each year. Enrollment required.',
      type: 'STATEMENT_CREDIT',
      valueCents: 20000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'bizplat-clear-plus-credit',
      title: '$219 CLEAR Plus Credit',
      shortTitle: 'CLEAR Plus Credit',
      description:
        'Up to $219 in statement credits per calendar year on a CLEAR Plus membership, matching the membership price after CLEAR raised it from $209 to $219 on July 1, 2026.',
      brandKey: 'clear',
      type: 'STATEMENT_CREDIT',
      valueCents: 21900,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'bizplat-pay-with-points-rebate',
      title: '35% Airline Pay With Points Rebate',
      shortTitle: '35% Points Rebate',
      description:
        'Get 35% of your Membership Rewards® points back — up to 1,000,000 points per calendar year — when you use Pay With Points for eligible flights on AmexTravel.com. Since September 18, 2025, first- and business-class tickets qualify only on your selected qualifying airline.',
      brandKey: 'amex-travel',
      type: 'PERK',
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'bizplat-global-entry-credit',
      title: 'Global Entry Credit',
      shortTitle: 'Global Entry Credit',
      description:
        'A statement credit of up to $120 toward a Global Entry application fee, available once every four years.',
      type: 'STATEMENT_CREDIT',
      valueCents: 12000,
      cadence: 'EVERY_N_YEARS',
      resetBasis: 'CALENDAR',
      everyNYears: 4,
    },
    {
      slug: 'bizplat-global-lounge-collection',
      title: 'American Express Global Lounge Collection',
      shortTitle: 'Lounge Access',
      description:
        'Access to the American Express Global Lounge Collection, including Centurion® Lounges and Priority Pass™ Select after enrollment.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
