import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'united-explorer',
  issuer: 'chase',
  name: 'United℠ Explorer Card',
  shortName: 'United Explorer',
  network: 'VISA',
  annualFeeCents: 15000,
  aprLowBps: 1974,
  aprHighBps: 2824,
  foreignTxFeeBps: null,
  pointsCurrency: 'united-mileageplus',
  art: {
    gradient: ['#0B2240', '#134A86', '#1E7FC4'],
    pattern: 'sheen',
    textColor: '#FFFFFF',
    chipColor: '#C0C4C9',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://creditcards.chase.com/travel-credit-cards/united/united-explorer',
  rewards: [
    {
      multiplierX100: 500,
      category: 'on United Hotels',
      description: '5x miles on hotel stays purchased through United Hotels.',
    },
    {
      multiplierX100: 300,
      category: 'on United Purchases',
      description: '3x miles on United® purchases made with the card.',
    },
    {
      multiplierX100: 200,
      category: 'on Dining',
      description: '2x miles on dining, including eligible delivery services.',
    },
    {
      multiplierX100: 200,
      category: 'on Hotels Booked Direct',
      description: '2x miles on hotel stays booked directly with the hotel.',
    },
    {
      multiplierX100: 100,
      category: 'on Everything Else',
      description: '1x mile per dollar on all other purchases.',
    },
  ],
  benefits: [
    {
      slug: 'ue-free-checked-bag',
      title: 'Free First Checked Bag',
      shortTitle: 'Free Checked Bag',
      description:
        'A free first checked bag for the primary cardmember and one travel companion on the same reservation, when you pay for the tickets with the card.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'ue-global-entry-credit',
      title: '$120 Global Entry, TSA PreCheck® or NEXUS Credit (Every 4 Years)',
      shortTitle: 'Global Entry Credit',
      description:
        'Up to $120 as a statement credit every four years to reimburse the application fee for Global Entry, TSA PreCheck® or NEXUS.',
      type: 'STATEMENT_CREDIT',
      valueCents: 12000,
      cadence: 'EVERY_N_YEARS',
      resetBasis: 'ANNIVERSARY',
      everyNYears: 4,
      isHighlighted: true,
    },
    {
      slug: 'ue-rideshare-credit',
      title: '$5 Monthly Rideshare Credit',
      shortTitle: 'Rideshare Credit',
      description:
        'Up to $5 back as a statement credit each month on eligible rideshare purchases, for up to $60 each calendar year. Enrollment required.',
      type: 'STATEMENT_CREDIT',
      valueCents: 500,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'ue-united-club-passes',
      title: 'Two United Club℠ One-Time Passes Each Year',
      shortTitle: 'United Club Passes',
      description:
        'Two United Club℠ one-time passes each year for the primary cardmember, valid for a single visit per pass.',
      type: 'PERK',
      cadence: 'ANNUAL',
      resetBasis: 'ANNIVERSARY',
    },
    {
      slug: 'ue-annual-travel-credit-threshold',
      title: '$100 United Travel Credit After $10,000 Annual Spend',
      shortTitle: '$10k Travel Credit',
      description:
        'Spend $10,000 on purchases within a calendar year and receive a $100 United travel credit.',
      type: 'SPEND_THRESHOLD',
      thresholdCents: 1000000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'ue-priority-boarding',
      title: 'Priority Boarding',
      shortTitle: 'Priority Boarding',
      description:
        'Priority boarding on United-operated flights for the cardmember and companions on the same reservation, ahead of general boarding.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'ue-inflight-discount',
      title: '25% Back on United Inflight Purchases',
      shortTitle: '25% Inflight',
      description:
        '25% back as a statement credit on United inflight purchases, including food, beverages and Wi-Fi, when you pay with the card.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
