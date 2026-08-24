import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'hilton-honors-aspire',
  issuer: 'amex',
  name: 'Hilton Honors American Express Aspire Card',
  shortName: 'Hilton Aspire',
  network: 'AMEX',
  annualFeeCents: 55000,
  aprLowBps: 1949,
  aprHighBps: 2849,
  foreignTxFeeBps: null,
  pointsCurrency: 'hilton-honors',
  art: {
    gradient: ['#111111', '#2A211A', '#C8811F'],
    pattern: 'sheen',
    textColor: '#FDF6EA',
    chipColor: '#E0A94A',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-aspire/',
  rewards: [
    {
      multiplierX100: 1400,
      category: 'Hilton Portfolio Hotels & Resorts',
      description:
        'Earn 14x Hilton Honors bonus points for each dollar spent on eligible purchases at hotels and resorts within the Hilton portfolio.',
    },
    {
      multiplierX100: 700,
      category: 'Flights, Car Rentals & U.S. Restaurants',
      description:
        'Earn 7x points on flights booked directly with airlines or on amextravel.com, on car rentals booked directly with select rental companies, and at U.S. restaurants.',
    },
    {
      multiplierX100: 300,
      category: 'All Other Purchases',
      description: 'Earn 3x Hilton Honors bonus points on all other eligible purchases.',
    },
  ],
  benefits: [
    {
      slug: 'aspire-resort-credit',
      title: '$400 Annual Hilton Resort Credit',
      shortTitle: 'Resort Credit',
      description:
        'Up to $200 in statement credits semiannually (January–June and July–December), for up to $400 per calendar year, on eligible purchases made directly with participating Hilton Resorts. Enrollment required.',
      brandKey: 'hilton',
      type: 'STATEMENT_CREDIT',
      valueCents: 20000,
      cadence: 'SEMIANNUAL',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'aspire-flight-credit',
      title: '$200 Annual Flight Credit',
      shortTitle: 'Flight Credit',
      description:
        'Up to $50 in statement credits each calendar quarter, for up to $200 per year, on eligible flight purchases. Enrollment required.',
      type: 'STATEMENT_CREDIT',
      valueCents: 5000,
      cadence: 'QUARTERLY',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'aspire-annual-free-night-reward',
      title: 'Annual Free Night Reward',
      shortTitle: 'Free Night',
      description:
        'One Free Night Reward from Hilton Honors in your first year of card membership and every year upon card renewal, valid at nearly any property in the Hilton portfolio with no points cap. Certificates are valid for 12 months from issue and the stay must be completed within that window.',
      brandKey: 'hilton',
      type: 'PERK',
      cadence: 'ANNUAL',
      resetBasis: 'ANNIVERSARY',
      isHighlighted: true,
    },
    {
      slug: 'aspire-diamond-status',
      title: 'Hilton Honors Diamond Status',
      shortTitle: 'Diamond Status',
      description:
        'Complimentary Hilton Honors Diamond status for the cardholder. From 2026, earning Diamond by stay activity otherwise requires 25 stays, 50 nights, or $11,500 in qualifying spend in a calendar year.',
      brandKey: 'hilton',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'aspire-clear-plus-credit',
      title: '$219 CLEAR Plus Credit',
      shortTitle: 'CLEAR Plus Credit',
      description:
        'Up to $219 in statement credits per calendar year after you pay for a CLEAR Plus membership with the card, matching the membership price after CLEAR raised it from $209 to $219 on July 1, 2026.',
      brandKey: 'clear',
      type: 'STATEMENT_CREDIT',
      valueCents: 21900,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'aspire-free-night-30k-spend',
      title: 'Bonus Free Night Reward at $30,000 Spend',
      shortTitle: 'Free Night at $30k',
      description:
        'Spend $30,000 on the card in a calendar year to earn an additional Free Night Reward, on top of the annual renewal reward.',
      brandKey: 'hilton',
      type: 'SPEND_THRESHOLD',
      thresholdCents: 3000000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'aspire-free-night-60k-spend',
      title: 'Third Free Night Reward at $60,000 Spend',
      shortTitle: 'Free Night at $60k',
      description:
        'Spend a further $30,000 — $60,000 total in a calendar year — to earn a third Free Night Reward.',
      brandKey: 'hilton',
      type: 'SPEND_THRESHOLD',
      thresholdCents: 6000000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
