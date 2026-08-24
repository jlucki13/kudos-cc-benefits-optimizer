import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'amex-blue-cash-preferred',
  issuer: 'amex',
  name: 'Blue Cash Preferred® Card from American Express',
  shortName: 'Blue Cash Preferred',
  network: 'AMEX',
  annualFeeCents: 9500,
  aprLowBps: 1949,
  aprHighBps: 2849,
  foreignTxFeeBps: 270,
  art: {
    gradient: ['#1657A8', '#2E7ED6', '#7FB8EC'],
    pattern: 'sheen',
    textColor: '#FFFFFF',
    chipColor: '#C4C9CE',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/',
  rewards: [
    {
      multiplierX100: 600,
      category: 'at U.S. Supermarkets',
      description:
        '6% cash back at U.S. supermarkets on up to $6,000 in purchases per year, then 1%.',
    },
    {
      multiplierX100: 600,
      category: 'on Select Streaming',
      description: '6% cash back on select U.S. streaming subscriptions.',
    },
    {
      multiplierX100: 300,
      category: 'at U.S. Gas Stations',
      description: '3% cash back at eligible U.S. gas stations.',
    },
    {
      multiplierX100: 300,
      category: 'on Transit',
      description:
        '3% cash back on transit, including taxis and rideshare, parking, tolls, trains and buses.',
    },
    {
      multiplierX100: 100,
      category: 'on Everything Else',
      description: '1% cash back on all other purchases.',
    },
  ],
  benefits: [
    {
      slug: 'bcp-disney-streaming-credit',
      title: '$10 Monthly Disney Streaming Credit',
      shortTitle: 'Disney Credit',
      description:
        'Up to $10 back each month as a statement credit on an eligible Disney streaming subscription, totalling up to $120 per year. Raised from $7 per month in August 2025 and no longer carries a minimum spend requirement. Enrollment required.',
      brandKey: 'disney',
      type: 'STATEMENT_CREDIT',
      valueCents: 1000,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
  ],
};

export default card;
