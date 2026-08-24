import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'capital-one-venture-x',
  issuer: 'capital-one',
  name: 'Capital One Venture X Rewards Credit Card',
  shortName: 'Venture X',
  network: 'VISA',
  annualFeeCents: 39500,
  aprLowBps: 1949,
  aprHighBps: 2849,
  foreignTxFeeBps: null,
  pointsCurrency: 'capital-one-miles',
  art: {
    gradient: ['#1C1C1E', '#2E2E32', '#4A4A50'],
    pattern: 'plain',
    textColor: '#F4F4F5',
    chipColor: '#B9975B',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.capitalone.com/learn-grow/more-than-money/all-about-venture-x/',
  rewards: [
    {
      multiplierX100: 1000,
      category: 'Hotels & Rental Cars via Capital One Travel',
      description: 'Earn unlimited 10x miles on hotels and rental cars booked through Capital One Travel.',
    },
    {
      multiplierX100: 500,
      category: 'Flights & Vacation Rentals via Capital One Travel',
      description: 'Earn 5x miles on flights and vacation rentals booked through Capital One Travel.',
    },
    {
      multiplierX100: 200,
      category: 'All Other Purchases',
      description: 'Earn unlimited 2x miles on every other purchase, with no category caps.',
    },
  ],
  benefits: [
    {
      slug: 'venturex-annual-travel-credit',
      title: '$300 Annual Capital One Travel Credit',
      shortTitle: 'Travel Credit',
      description:
        'Up to $300 in statement credits each cardmember year for bookings made through the Capital One Travel portal. The credit resets on your card anniversary, not on January 1.',
      brandKey: 'capital-one-travel',
      type: 'STATEMENT_CREDIT',
      valueCents: 30000,
      cadence: 'ANNUAL',
      resetBasis: 'ANNIVERSARY',
      isHighlighted: true,
    },
    {
      slug: 'venturex-anniversary-miles',
      title: '10,000 Anniversary Bonus Miles',
      shortTitle: 'Anniversary Miles',
      description:
        'Receive 10,000 bonus miles every year starting on your first card anniversary — worth $100 toward travel at the fixed 1 cent per mile redemption rate.',
      type: 'POINTS_GRANT',
      valuePoints: 10000,
      cadence: 'ANNUAL',
      resetBasis: 'ANNIVERSARY',
      isHighlighted: true,
    },
    {
      slug: 'venturex-lounge-access',
      title: 'Capital One Lounge and Priority Pass™ Access',
      shortTitle: 'Lounge Access',
      description:
        'Complimentary access for the primary cardholder to Capital One Lounges and more than 1,300 lounges worldwide through Priority Pass™, after enrollment. From February 1, 2026, authorized users cost $125 each for their own unlimited access, and guests pay $45 per adult at Capital One Lounges and $35 per visit at Priority Pass lounges.',
      brandKey: 'priority-pass',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'venturex-global-entry-credit',
      title: 'Global Entry or TSA PreCheck® Credit',
      shortTitle: 'Global Entry Credit',
      description:
        'Up to $120 in statement credits toward a Global Entry or TSA PreCheck® application fee, available once every four years.',
      type: 'STATEMENT_CREDIT',
      valueCents: 12000,
      cadence: 'EVERY_N_YEARS',
      resetBasis: 'CALENDAR',
      everyNYears: 4,
    },
    {
      slug: 'venturex-premier-collection',
      title: 'Premier Collection Hotel Benefits',
      shortTitle: 'Premier Collection',
      description:
        'A $100 experience credit plus premium benefits with every hotel and vacation rental booked through the Capital One Premier Collection. Applies per eligible booking rather than on a fixed annual allowance.',
      brandKey: 'capital-one-travel',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'venturex-guest-lounge-75k-spend',
      title: 'Complimentary Guest Lounge Access at $75,000 Spend',
      shortTitle: 'Guest Access at $75k',
      description:
        'Spend $75,000 or more on the card in a year to unlock complimentary guest lounge access, which otherwise costs $45 per adult at Capital One Lounges and $35 per visit at Priority Pass lounges as of February 1, 2026.',
      type: 'SPEND_THRESHOLD',
      thresholdCents: 7500000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
