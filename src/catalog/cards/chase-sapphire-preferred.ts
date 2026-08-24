import type { SeedCard } from '../types';

const card: SeedCard = {
  slug: 'chase-sapphire-preferred',
  issuer: 'chase',
  name: 'Chase Sapphire Preferred® Card',
  shortName: 'Sapphire Preferred',
  network: 'VISA',
  annualFeeCents: 9500,
  aprLowBps: 1824,
  aprHighBps: 2774,
  foreignTxFeeBps: null,
  pointsCurrency: 'chase-ultimate-rewards',
  art: {
    gradient: ['#0B2A5B', '#12447F', '#1E63A8'],
    pattern: 'guilloche',
    textColor: '#FFFFFF',
    chipColor: '#D8B86A',
  },
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred',
  rewards: [
    {
      multiplierX100: 500,
      category: 'on Chase Travel',
      description: '5x points on travel purchased through Chase Travel℠.',
    },
    {
      multiplierX100: 300,
      category: 'on Dining',
      description: '3x points on dining, including takeout and eligible delivery services.',
    },
    {
      multiplierX100: 300,
      category: 'on Vacation Homes',
      description:
        '3x points on vacation home rentals booked with Airbnb, Vrbo, Vacasa, Plum Guide, Homestay.com and HomeAway. Added in the June 2026 refresh.',
    },
    {
      multiplierX100: 300,
      category: 'on Gas & EV Charging',
      description: '3x points on gas stations and EV charging. Added in the June 2026 refresh.',
    },
    {
      multiplierX100: 300,
      category: 'on Select Streaming',
      description: '3x points on select streaming services.',
    },
    {
      multiplierX100: 300,
      category: 'on Online Groceries',
      description:
        '3x points on online grocery purchases, excluding Walmart, Target and wholesale clubs.',
    },
    {
      multiplierX100: 200,
      category: 'on Other Travel',
      description: '2x points on all other travel purchases booked outside of Chase Travel℠.',
    },
    {
      multiplierX100: 100,
      category: 'on Everything Else',
      description: '1x point per dollar on all other purchases.',
    },
  ],
  benefits: [
    {
      slug: 'csp-hotel-credit',
      title: '$100 Annual Chase Travel℠ Hotel Credit',
      shortTitle: 'Hotel Credit',
      description:
        'Up to $100 in statement credits each anniversary year toward hotel stays booked through Chase Travel℠. Doubled from $50 in the June 2026 refresh; unused credit is forfeited at the end of the anniversary year.',
      type: 'STATEMENT_CREDIT',
      valueCents: 10000,
      cadence: 'ANNUAL',
      resetBasis: 'ANNIVERSARY',
      isHighlighted: true,
    },
    {
      slug: 'csp-global-entry-credit',
      title: '$120 Global Entry, TSA PreCheck® or NEXUS Credit (Every 4 Years)',
      shortTitle: 'Global Entry Credit',
      description:
        'Up to $120 in statement credits once every four years toward the application fee for Global Entry, TSA PreCheck® or NEXUS. Added in the June 2026 refresh.',
      type: 'STATEMENT_CREDIT',
      valueCents: 12000,
      cadence: 'EVERY_N_YEARS',
      resetBasis: 'ANNIVERSARY',
      everyNYears: 4,
      isHighlighted: true,
    },
    {
      slug: 'csp-apple-tv-subscription',
      title: 'Complimentary One-Year Apple TV Subscription',
      shortTitle: 'Apple TV Year',
      description:
        'A complimentary one-year Apple TV subscription, a value of up to $156. Must be activated by December 31, 2026.',
      brandKey: 'apple',
      type: 'PERK',
      cadence: 'ONE_TIME',
      resetBasis: 'CALENDAR',
      registerByDate: '2026-12-31',
      isHighlighted: true,
    },
    {
      slug: 'csp-dashpass',
      title: 'Complimentary DoorDash DashPass Membership',
      shortTitle: 'DashPass',
      description:
        'At least one year of complimentary DashPass, giving $0 delivery fees and reduced service fees, plus a $10 monthly promo on eligible non-restaurant orders. Must be activated by December 31, 2027.',
      brandKey: 'doordash',
      type: 'PERK',
      cadence: 'ONE_TIME',
      resetBasis: 'CALENDAR',
      registerByDate: '2027-12-31',
    },
    {
      slug: 'csp-travel-protections',
      title: 'Trip Cancellation and Interruption Insurance',
      shortTitle: 'Trip Protection',
      description:
        'Trip cancellation and interruption insurance, trip delay reimbursement, lost and delayed baggage coverage, and emergency evacuation and transportation coverage of up to $100,000.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
    {
      slug: 'csp-primary-rental-cdw',
      title: 'Primary Auto Rental Collision Damage Waiver',
      shortTitle: 'Primary Rental CDW',
      description:
        'Primary auto rental collision damage waiver on eligible rentals when you decline the rental company coverage and pay with the card.',
      type: 'PERK',
      cadence: 'NONE',
      resetBasis: 'CALENDAR',
    },
  ],
};

export default card;
