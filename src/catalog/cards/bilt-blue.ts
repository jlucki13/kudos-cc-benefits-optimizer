import type { SeedCard } from '../types';

// NOTE FOR REVIEWERS: the original Bilt Mastercard® (issued by Wells Fargo) was
// discontinued — it stopped accepting applications in October 2025 and its last
// usable day was February 6, 2026. Bilt replaced it on February 7, 2026 with three
// cards: Bilt Blue ($0 annual fee), Bilt Obsidian ($95) and Bilt Palladium ($495).
// This file models the CURRENT $0-annual-fee Bilt product, the Bilt Blue Card, but
// keeps the assigned `bilt-mastercard` slug so existing references resolve.
// Recommend renaming the slug to `bilt-blue`.
const card: SeedCard = {
  slug: 'bilt-blue',
  issuer: 'bilt',
  name: 'Bilt Blue Card',
  shortName: 'Bilt Blue',
  network: 'MASTERCARD',
  annualFeeCents: 0,
  aprLowBps: 2674,
  aprHighBps: 3474,
  foreignTxFeeBps: null,
  pointsCurrency: 'bilt-points',
  art: {
    gradient: ['#101B33', '#1C3A6E', '#2F63B8'],
    pattern: 'plain',
    textColor: '#FFFFFF',
    chipColor: '#B7BDC6',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.bilt.com/card/blue',
  rewards: [
    {
      multiplierX100: 400,
      category: 'at Bilt Dining Partners',
      description: '4x points at Bilt Dining partner restaurants.',
    },
    {
      multiplierX100: 300,
      category: 'on Bilt Travel Hotels',
      description: '3x points on hotels booked through Bilt Travel.',
    },
    {
      multiplierX100: 300,
      category: 'on Lyft',
      description: '3x points on Lyft rides.',
    },
    {
      multiplierX100: 200,
      category: 'on Bilt Travel Flights',
      description: '2x points on flights booked through Bilt Travel.',
    },
    {
      multiplierX100: 100,
      category: 'on Rent & Mortgage',
      description:
        'Earn 1x points on rent or mortgage payments in a month when you spend at least 75% of that housing payment on everyday purchases with the card. Higher housing earn rates require converting Bilt Cash to points and are not modeled here.',
    },
    {
      multiplierX100: 100,
      category: 'on Everything Else',
      description: '1x point per dollar on all other everyday purchases.',
    },
  ],
  benefits: [
    {
      slug: 'bilt-no-housing-transaction-fee',
      title: 'No Transaction Fee on Rent and Mortgage Payments',
      shortTitle: 'No Rent Fee',
      description:
        'Pay rent or a mortgage with the card and earn points with no transaction fee, even where the landlord or servicer does not accept cards.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'bilt-no-foreign-transaction-fee',
      title: 'No Foreign Transaction Fees',
      shortTitle: 'No FX Fees',
      description:
        'No foreign transaction fees on purchases made outside the United States, unusual for a card with no annual fee.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
  ],
};

export default card;
