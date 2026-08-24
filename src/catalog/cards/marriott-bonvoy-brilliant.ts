import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'marriott-bonvoy-brilliant',
  issuer: 'amex',
  name: 'Marriott Bonvoy Brilliant® American Express® Card',
  shortName: 'Bonvoy Brilliant',
  network: 'AMEX',
  annualFeeCents: 65000,
  aprLowBps: 1949,
  aprHighBps: 2849,
  foreignTxFeeBps: null,
  pointsCurrency: 'marriott-bonvoy',
  art: {
    gradient: ['#4A2E12', '#8C6239', '#D4A857'],
    pattern: 'sheen',
    textColor: '#FFF8EC',
    chipColor: '#F0D08A',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.americanexpress.com/us/credit-cards/card/marriott-bonvoy-brilliant/',
  rewards: [
    {
      multiplierX100: 600,
      category: 'Marriott Bonvoy Hotels',
      description:
        'Earn 6x Marriott Bonvoy® points for each dollar of eligible purchases at hotels participating in Marriott Bonvoy.',
    },
    {
      multiplierX100: 300,
      category: 'Restaurants Worldwide & Flights Booked Direct',
      description:
        'Earn 3x points at restaurants worldwide and on flights booked directly with airlines.',
    },
    {
      multiplierX100: 200,
      category: 'All Other Purchases',
      description: 'Earn 2x points on all other eligible purchases.',
    },
  ],
  benefits: [
    {
      slug: 'brilliant-dining-credit',
      title: '$300 Annual Dining Credit',
      shortTitle: 'Dining Credit',
      description:
        'Up to $25 in statement credits each month, for up to $300 per calendar year, on eligible purchases at restaurants worldwide. Enrollment required. Unused monthly credits do not roll over.',
      type: 'STATEMENT_CREDIT',
      valueCents: 2500,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'brilliant-free-night-award',
      title: 'Annual Free Night Award (up to 85,000 points)',
      shortTitle: 'Free Night Award',
      description:
        'One Free Night Award each year after your card renewal month, redeemable at a participating Marriott Bonvoy hotel for a room costing up to 85,000 points. Resort fees may apply, and points can be topped up on more expensive rooms.',
      brandKey: 'marriott',
      type: 'POINTS_GRANT',
      valuePoints: 85000,
      cadence: 'ANNUAL',
      resetBasis: 'ANNIVERSARY',
      isHighlighted: true,
    },
    {
      slug: 'brilliant-platinum-elite-status',
      title: 'Marriott Bonvoy Platinum Elite Status',
      shortTitle: 'Platinum Elite',
      description:
        'Complimentary Marriott Bonvoy Platinum Elite status, which normally requires 50 qualifying nights per year and includes a 50% points bonus on stays, room upgrades and late checkout.',
      brandKey: 'marriott',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'brilliant-elite-night-credits',
      title: '25 Elite Night Credits',
      shortTitle: 'Elite Nights',
      description:
        'Receive 25 Elite Night Credits each calendar year toward the next level of Marriott Bonvoy Elite status.',
      brandKey: 'marriott',
      type: 'PERK',
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'brilliant-global-entry-credit',
      title: 'Global Entry or TSA PreCheck® Credit',
      shortTitle: 'Global Entry Credit',
      description:
        'A statement credit every four years of up to $120 for a Global Entry application fee, or up to $85 for TSA PreCheck® when applying through an official enrollment provider.',
      type: 'STATEMENT_CREDIT',
      valueCents: 12000,
      cadence: 'EVERY_N_YEARS',
      resetBasis: 'CALENDAR',
      everyNYears: 4,
    },
    {
      slug: 'brilliant-priority-pass',
      title: 'Priority Pass™ Select Lounge Access',
      shortTitle: 'Lounge Access',
      description: 'Complimentary Priority Pass™ Select airport lounge membership after enrollment.',
      brandKey: 'priority-pass',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
