import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'amex-gold',
  issuer: 'amex',
  name: 'American Express® Gold Card',
  shortName: 'Amex Gold',
  network: 'AMEX',
  annualFeeCents: 32500,
  aprLowBps: 2124,
  aprHighBps: 2924,
  foreignTxFeeBps: null,
  pointsCurrency: 'amex-membership-rewards',
  art: {
    gradient: ['#C8A34A', '#E3C77E', '#A8842F'],
    pattern: 'sheen',
    textColor: '#2A2110',
    chipColor: '#8C6D24',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
  rewards: [
    {
      multiplierX100: 500,
      category: 'on Prepaid Hotels',
      description:
        '5x Membership Rewards® points on prepaid hotels booked on AmexTravel.com or in the Amex Travel app. Raised from 2x in the April 2026 refresh.',
    },
    {
      multiplierX100: 400,
      category: 'at Restaurants',
      description:
        '4x Membership Rewards® points at restaurants worldwide on up to $50,000 in purchases per calendar year, then 1x.',
    },
    {
      multiplierX100: 400,
      category: 'at U.S. Supermarkets',
      description:
        '4x Membership Rewards® points at U.S. supermarkets on up to $25,000 in purchases per calendar year, then 1x.',
    },
    {
      multiplierX100: 300,
      category: 'on Flights',
      description:
        '3x Membership Rewards® points on flights booked directly with airlines or on AmexTravel.com.',
    },
    {
      multiplierX100: 100,
      category: 'on Everything Else',
      description: '1x Membership Rewards® point per dollar on all other eligible purchases.',
    },
  ],
  benefits: [
    {
      slug: 'amex-gold-dining-credit',
      title: '$10 Monthly Dining Credit at Select Partners',
      shortTitle: 'Dining Credit',
      description:
        'Up to $10 in statement credits each month at Grubhub (including Seamless), The Cheesecake Factory, Five Guys, Buffalo Wild Wings and Wonder. Buffalo Wild Wings and Wonder were added in the April 2026 refresh. Enrollment required.',
      brandKey: 'grubhub',
      type: 'STATEMENT_CREDIT',
      valueCents: 1000,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'amex-gold-uber-cash',
      title: '$10 Monthly Uber Cash',
      shortTitle: 'Uber Cash',
      description:
        'Up to $10 in Uber Cash each month for U.S. Uber rides and Uber Eats orders, totalling up to $120 per calendar year. The Gold Card must be added to your Uber account.',
      brandKey: 'uber',
      type: 'STATEMENT_CREDIT',
      valueCents: 1000,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'amex-gold-resy-credit',
      title: '$50 Semiannual Resy Credit',
      shortTitle: 'Resy Credit',
      description:
        'Up to $50 in statement credits at over 10,000 qualifying U.S. Resy restaurants from January through June, and up to another $50 from July through December, for up to $100 each calendar year. Enrollment required.',
      brandKey: 'resy',
      type: 'STATEMENT_CREDIT',
      valueCents: 5000,
      cadence: 'SEMIANNUAL',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'amex-gold-dunkin-credit',
      title: "$7 Monthly Dunkin' Credit",
      shortTitle: "Dunkin' Credit",
      description:
        "Up to $7 in statement credits each month at U.S. Dunkin' locations, totalling up to $84 per calendar year. Enrollment required.",
      brandKey: 'dunkin',
      type: 'STATEMENT_CREDIT',
      valueCents: 700,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'amex-gold-hertz-five-star',
      title: 'Complimentary Hertz Five Star® Status',
      shortTitle: 'Hertz Five Star',
      description:
        'Complimentary Hertz Five Star® status on car rentals, added in the April 2026 refresh. Enrollment required.',
      brandKey: 'hertz',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
