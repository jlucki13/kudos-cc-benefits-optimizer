import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'delta-skymiles-reserve',
  issuer: 'amex',
  name: 'Delta SkyMiles® Reserve American Express Card',
  shortName: 'Delta Reserve',
  network: 'AMEX',
  annualFeeCents: 65000,
  aprLowBps: 1949,
  aprHighBps: 2849,
  foreignTxFeeBps: null,
  pointsCurrency: 'delta-skymiles',
  art: {
    gradient: ['#0B1E3D', '#153A6B', '#9B1B30'],
    pattern: 'sheen',
    textColor: '#F4F7FB',
    chipColor: '#C0C6D0',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-reserve-american-express-card/',
  rewards: [
    {
      multiplierX100: 300,
      category: 'Delta Purchases',
      description: 'Earn 3x SkyMiles on eligible purchases made directly with Delta.',
    },
    {
      multiplierX100: 100,
      category: 'All Other Purchases',
      description: 'Earn 1x SkyMiles on all other eligible purchases.',
    },
  ],
  benefits: [
    {
      slug: 'delta-reserve-companion-certificate',
      title: 'Annual Companion Certificate',
      shortTitle: 'Companion Certificate',
      description:
        'Each year after card renewal, receive a Companion Certificate good for one round-trip flight in Delta First, Delta Premium Select, Delta Comfort+® or Main Cabin within the U.S. and to Mexico, the Caribbean or Central America. Taxes and fees are the cardholder’s responsibility.',
      brandKey: 'delta',
      type: 'PERK',
      cadence: 'ANNUAL',
      resetBasis: 'ANNIVERSARY',
      isHighlighted: true,
    },
    {
      slug: 'delta-reserve-delta-stays-credit',
      title: '$200 Annual Delta Stays Credit',
      shortTitle: 'Delta Stays Credit',
      description:
        'Up to $200 in statement credits each year on prepaid hotels and vacation rentals booked through Delta Stays with the card.',
      brandKey: 'delta',
      type: 'STATEMENT_CREDIT',
      valueCents: 20000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'delta-reserve-resy-credit',
      title: '$240 Annual Resy Credit',
      shortTitle: 'Resy Credit',
      description:
        'Up to $20 in statement credits each month, for up to $240 per year, on eligible purchases at qualifying U.S. Resy restaurants. Enrollment required.',
      brandKey: 'resy',
      type: 'STATEMENT_CREDIT',
      valueCents: 2000,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
      isHighlighted: true,
    },
    {
      slug: 'delta-reserve-rideshare-credit',
      title: '$120 Annual Rideshare Credit',
      shortTitle: 'Rideshare Credit',
      description:
        'Up to $10 in statement credits each month, for up to $120 per year, on U.S. rideshare purchases with select providers. Enrollment required.',
      type: 'STATEMENT_CREDIT',
      valueCents: 1000,
      cadence: 'MONTHLY',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'delta-reserve-sky-club-visits',
      title: 'Delta Sky Club® Access — 15 Visits',
      shortTitle: 'Sky Club Visits',
      description:
        'Up to 15 Delta Sky Club® visits each Medallion Year when flying Delta, with entry permitted up to three hours before a departing flight.',
      brandKey: 'delta',
      type: 'PERK',
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'delta-reserve-unlimited-sky-club-75k-spend',
      title: 'Unlimited Delta Sky Club® Access at $75,000 Spend',
      shortTitle: 'Unlimited Club at $75k',
      description:
        'Spend $75,000 on the card during a calendar year to unlock unlimited Delta Sky Club® access, replacing the standard 15-visit allowance.',
      brandKey: 'delta',
      type: 'SPEND_THRESHOLD',
      thresholdCents: 7500000,
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'delta-reserve-mqd-headstart',
      title: '$2,500 MQD Headstart',
      shortTitle: 'MQD Headstart',
      description:
        'Receive $2,500 in Medallion Qualification Dollars at the start of each Medallion qualification year, giving a head start toward Delta elite status.',
      brandKey: 'delta',
      type: 'PERK',
      cadence: 'ANNUAL',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'delta-reserve-free-checked-bags',
      title: 'First and Second Checked Bags Free',
      shortTitle: 'Free Checked Bags',
      description:
        'The first and second checked bags are free for the primary cardholder on Delta flights.',
      brandKey: 'delta',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'delta-reserve-inflight-savings',
      title: '20% Back on Delta In-Flight Purchases',
      shortTitle: '20% In-Flight',
      description:
        'Receive a 20% statement credit on eligible in-flight purchases of food, drinks and audio headsets on Delta flights.',
      brandKey: 'delta',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
