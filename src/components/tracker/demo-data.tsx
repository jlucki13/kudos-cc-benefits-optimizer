/**
 * Rich demo data for W4 screens, reachable via `?demo=1` on /, /tracker and
 * /overview. Dev-preview only: the real pages default to the empty fixtures
 * until W5 wires the query layer. Never imported by the data layer.
 */
import type { CardVM, TrackerItemVM, TrackerVM } from '@/lib/view-models';

import { catalogFixture, csrFixture } from '@/lib/fixtures';

const csrCard = { userCardId: csrFixture.userCardId, cardShortName: csrFixture.shortName, cardArt: csrFixture.art };
const vxArt = catalogFixture[1].art;
const vxCard = { userCardId: 'fixture-vx', cardShortName: 'Venture X', cardArt: vxArt };

const doordash: TrackerItemVM = {
  ...csrCard,
  slug: 'csr-doordash-monthly',
  kind: 'STATEMENT_CREDIT',
  title: '$25 monthly DoorDash credit',
  shortTitle: 'DoorDash Credit',
  description: 'Up to $25 in DoorDash credits each month with DashPass.',
  brandKey: 'doordash',
  cadenceLabel: '$25 per month',
  isHighlighted: false,
  currentPeriod: {
    id: null,
    start: '2026-08-01',
    end: '2026-09-01',
    label: 'Aug 2026',
    status: 'open',
    valueCents: 2500,
    usedCents: 1000,
    remainingCents: 1500,
    percentUsed: 40,
    daysLeft: 5,
  },
};

const diningH2: TrackerItemVM = {
  ...csrCard,
  ...csrFixture.redeemable[2],
  currentPeriod: { ...csrFixture.redeemable[2].currentPeriod!, daysLeft: 22 },
};

const travelCredit: TrackerItemVM = { ...csrCard, ...csrFixture.redeemable[0] };
const editCredit: TrackerItemVM = { ...csrCard, ...csrFixture.redeemable[1] };

const vxTravelCredit: TrackerItemVM = {
  ...vxCard,
  slug: 'vx-travel-credit',
  kind: 'STATEMENT_CREDIT',
  title: '$300 annual travel credit via Capital One Travel',
  shortTitle: 'Capital One Travel Credit',
  description: 'Up to $300 back annually on bookings through Capital One Travel.',
  brandKey: 'capital-one-travel',
  cadenceLabel: '$300 per year',
  isHighlighted: true,
  currentPeriod: {
    id: null,
    start: '2025-11-30',
    end: '2026-11-30',
    label: '2026 Cardmember Year',
    status: 'open',
    valueCents: 30000,
    usedCents: 0,
    remainingCents: 30000,
    percentUsed: 0,
    daysLeft: 97,
  },
};

const ihgThreshold: TrackerItemVM = { ...csrCard, ...csrFixture.other[0] };

const lyftUsed: TrackerItemVM = {
  ...csrCard,
  slug: 'csr-lyft-credit',
  kind: 'STATEMENT_CREDIT',
  title: '$120 annual Lyft in-app credit',
  shortTitle: 'Lyft Credit',
  description: 'Up to $10 in Lyft credits per month, applied in-app.',
  brandKey: 'lyft',
  cadenceLabel: '$120 per year',
  isHighlighted: false,
  currentPeriod: {
    id: 'demo-lyft',
    start: '2026-01-01',
    end: '2027-01-01',
    label: '2026',
    status: 'open',
    valueCents: 12000,
    usedCents: 12000,
    remainingCents: 0,
    percentUsed: 100,
    daysLeft: 130,
  },
};

const diningH1Missed: TrackerItemVM = {
  ...csrCard,
  ...csrFixture.redeemable[2],
  currentPeriod: {
    id: 'demo-dining-h1',
    start: '2026-01-01',
    end: '2026-07-01',
    label: 'Jan–Jun 2026',
    status: 'closed',
    valueCents: 15000,
    usedCents: 0,
    remainingCents: 15000,
    percentUsed: 0,
    daysLeft: -54,
  },
};

const priorityPass: TrackerItemVM = { ...csrCard, ...csrFixture.other[2] };

export const demoTrackerVM: TrackerVM = {
  groups: [
    { key: 'expiring', label: 'Expiring soon', items: [diningH2, doordash] },
    { key: 'available', label: 'Available now', items: [editCredit, vxTravelCredit, travelCredit, ihgThreshold] },
    { key: 'used', label: 'Used', items: [lyftUsed] },
    { key: 'missed', label: 'Missed', items: [diningH1Missed] },
    { key: 'untracked', label: 'Not tracked', items: [priorityPass] },
  ],
  totals: {
    capturedCents: 38000,
    addressableToDateCents: 154500,
    claimableNowCents: 101500,
    forfeitedCents: 15000,
    unopenedCents: 0,
    faceValueCents: 182000,
  },
};

const ventureXCard: CardVM = {
  userCardId: 'fixture-vx',
  slug: 'capital-one-venture-x',
  name: 'Capital One Venture X Rewards Credit Card',
  shortName: 'Venture X',
  issuerDisplayName: 'Capital One',
  issuerBrandColor: '#D03027',
  network: 'VISA',
  last4: '4021',
  art: vxArt,
  annualFeeLabel: '$395',
  aprLabel: '19.99% - 29.24%',
  foreignTxFeeLabel: 'None',
  dataAsOf: '2026-08-24',
  sourceUrl: 'https://www.capitalone.com/credit-cards/venture-x/',
  pointsCurrencyName: 'Capital One Miles',
  redemptionMethod: 'DEFAULT',
  centsPerPointLabel: '1¢ per mile',
  rewards: [
    {
      multiplierLabel: '10x',
      category: 'on Hotels & Rental Cars via Capital One Travel',
      description: '10x miles on hotels and rental cars booked through Capital One Travel.',
    },
    { multiplierLabel: '2x', category: 'on Everywhere', description: '2x miles on every purchase.' },
  ],
  redeemable: [vxTravelCredit],
  other: [],
  roi: {
    annualFeeCents: 39500,
    capturedCents: 40000,
    addressableToDateCents: 70000,
    claimableNowCents: 30000,
    forfeitedCents: 0,
    unopenedCents: 0,
    faceValueCents: 70000,
    netCents: 500,
    projectedNetCents: 30500,
    isWorthItToday: true,
  },
};

export const demoWalletVM: CardVM[] = [csrFixture, ventureXCard];
