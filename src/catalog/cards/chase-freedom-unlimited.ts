import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'chase-freedom-unlimited',
  issuer: 'chase',
  name: 'Chase Freedom Unlimited®',
  shortName: 'Freedom Unlimited',
  network: 'VISA',
  annualFeeCents: 0,
  aprLowBps: 1824,
  aprHighBps: 2774,
  foreignTxFeeBps: 300,
  pointsCurrency: 'chase-ultimate-rewards',
  art: {
    gradient: ['#1B4D8F', '#2E7BC4', '#5AA9E6'],
    pattern: 'plain',
    textColor: '#FFFFFF',
    chipColor: '#C7CCD1',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited',
  rewards: [
    {
      multiplierX100: 500,
      category: 'on Chase Travel',
      description: '5% cash back on travel purchased through Chase Travel℠.',
    },
    {
      multiplierX100: 300,
      category: 'on Dining',
      description:
        '3% cash back on dining at restaurants, including takeout and eligible delivery services.',
    },
    {
      multiplierX100: 300,
      category: 'at Drugstores',
      description: '3% cash back on drugstore purchases.',
    },
    {
      multiplierX100: 150,
      category: 'on Everything Else',
      description: '1.5% unlimited cash back on all other purchases.',
    },
  ],
  benefits: [
    {
      slug: 'cfu-dashpass',
      title: 'Complimentary DoorDash DashPass Membership',
      shortTitle: 'DashPass',
      description:
        'Six months of complimentary DashPass, giving $0 delivery fees and reduced service fees. Must be activated by December 31, 2027. While enrolled in DashPass you also get up to $10 off each quarter on eligible non-restaurant orders through the end of 2027.',
      brandKey: 'doordash',
      type: 'PERK',
      cadence: 'ONE_TIME',
      resetBasis: 'CALENDAR',
      registerByDate: '2027-12-31',
      isHighlighted: true,
    },
  ],
};

export default card;
