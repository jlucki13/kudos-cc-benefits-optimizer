import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'citi-strata-premier',
  issuer: 'citi',
  name: 'Citi Strata Premier℠ Card',
  shortName: 'Strata Premier',
  network: 'MASTERCARD',
  annualFeeCents: 9500,
  aprLowBps: 1949,
  aprHighBps: 2749,
  foreignTxFeeBps: null,
  pointsCurrency: 'citi-thankyou',
  art: {
    gradient: ['#0A1F3C', '#123A63', '#2C6E9B'],
    pattern: 'dots',
    textColor: '#FFFFFF',
    chipColor: '#CBB37A',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.citi.com/credit-cards/citi-strata-premier-credit-card',
  rewards: [
    {
      multiplierX100: 1000,
      category: 'on Citi Travel Bookings',
      description:
        '10x ThankYou® Points on hotels, car rentals and attractions booked through CitiTravel.com.',
    },
    {
      multiplierX100: 300,
      category: 'on Air Travel & Hotels',
      description: '3x ThankYou® Points on air travel and other hotel purchases.',
    },
    {
      multiplierX100: 300,
      category: 'at Restaurants',
      description: '3x ThankYou® Points at restaurants.',
    },
    {
      multiplierX100: 300,
      category: 'at Supermarkets',
      description: '3x ThankYou® Points at supermarkets.',
    },
    {
      multiplierX100: 300,
      category: 'on Gas & EV Charging',
      description: '3x ThankYou® Points at gas stations and EV charging stations.',
    },
    {
      multiplierX100: 100,
      category: 'on Everything Else',
      description: '1x ThankYou® Point per dollar on all other purchases.',
    },
  ],
  benefits: [
    {
      slug: 'citi-strata-hotel-benefit',
      title: '$100 Annual Hotel Benefit on $500+ Stays',
      shortTitle: 'Hotel Benefit',
      description:
        'Once each calendar year, take $100 off a single hotel stay of $500 or more, excluding taxes and fees, when booked through CitiTravel.com or by phone.',
      type: 'STATEMENT_CREDIT',
      valueCents: 10000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'citi-strata-entertainment',
      title: 'Citi Entertainment® Access',
      shortTitle: 'Citi Entertainment',
      description:
        'Access to presale tickets and exclusive experiences for concerts, sporting events and dining through Citi Entertainment®.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'citi-strata-travel-protections',
      title: 'Travel Protection Benefits',
      shortTitle: 'Travel Protection',
      description:
        'Travel protection benefits including trip and baggage related coverages, plus $0 liability on unauthorized purchases.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
  ],
};

export default card;
