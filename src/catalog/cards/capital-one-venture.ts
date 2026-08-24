import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'capital-one-venture',
  issuer: 'capital-one',
  name: 'Capital One Venture Rewards Credit Card',
  shortName: 'Venture Rewards',
  network: 'MASTERCARD',
  annualFeeCents: 9500,
  aprLowBps: 1949,
  aprHighBps: 2849,
  foreignTxFeeBps: null,
  pointsCurrency: 'capital-one-miles',
  art: {
    gradient: ['#12324A', '#1D5C7A', '#2E8AA8'],
    pattern: 'sheen',
    textColor: '#FFFFFF',
    chipColor: '#C9C9C9',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.capitalone.com/credit-cards/venture/',
  rewards: [
    {
      multiplierX100: 500,
      category: 'on Capital One Travel',
      description:
        '5x miles on hotels and rental cars booked through Capital One Travel.',
    },
    {
      multiplierX100: 200,
      category: 'on Everything Else',
      description: 'Unlimited 2x miles on every purchase, every day.',
    },
  ],
  benefits: [
    {
      slug: 'c1-venture-global-entry-credit',
      title: '$120 Global Entry or TSA PreCheck® Credit (Every 4 Years)',
      shortTitle: 'Global Entry Credit',
      description:
        'Up to $120 as a statement credit for the Global Entry or TSA PreCheck® application fee, one credit per account every four years. The account must be open and in good standing when the credit is applied.',
      type: 'STATEMENT_CREDIT',
      valueCents: 12000,
      cadence: 'EVERY_N_YEARS',
      resetBasis: 'ANNIVERSARY',
      everyNYears: 4,
      isHighlighted: true,
    },
    {
      slug: 'c1-venture-lifestyle-collection',
      title: '$50 Experience Credit on Lifestyle Collection Bookings',
      shortTitle: 'Lifestyle Credit',
      description:
        'A $50 experience credit with every hotel and vacation rental booked through the Capital One Lifestyle Collection. Awarded per qualifying booking rather than on a fixed annual cycle.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'c1-venture-hertz-five-star',
      title: 'Complimentary Hertz Five Star® Status',
      shortTitle: 'Hertz Five Star',
      description: 'Complimentary Hertz Five Star® status on car rentals. Enrollment required.',
      brandKey: 'hertz',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'c1-venture-travel-accident-insurance',
      title: 'Travel Accident Insurance',
      shortTitle: 'Travel Accident',
      description:
        'Complimentary travel accident insurance when you use the card to pay for your fare.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'c1-venture-roadside-assistance',
      title: '24-Hour Roadside Assistance',
      shortTitle: 'Roadside Assist',
      description:
        '24-hour roadside assistance including towing, gas delivery, jump-starting and tire changes. Service fees may apply.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'c1-venture-concierge',
      title: 'World Elite Mastercard® Concierge',
      shortTitle: 'Concierge',
      description: 'World Elite Mastercard® concierge service available 24 hours a day.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
