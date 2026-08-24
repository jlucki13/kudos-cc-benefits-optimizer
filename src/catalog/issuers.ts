import type { SeedIssuer } from './types';

export const issuers: SeedIssuer[] = [
  {
    slug: 'chase',
    name: 'JPMorgan Chase Bank, N.A.',
    displayName: 'Chase',
    brandColor: '#117ACA',
  },
  {
    slug: 'amex',
    name: 'American Express National Bank',
    displayName: 'American Express',
    brandColor: '#006FCF',
  },
  {
    slug: 'capital-one',
    name: 'Capital One, N.A.',
    displayName: 'Capital One',
    brandColor: '#004977',
  },
  {
    slug: 'citi',
    name: 'Citibank, N.A.',
    displayName: 'Citi',
    brandColor: '#056DAE',
  },
  {
    // Bilt is the consumer-facing brand; the current Bilt Blue card is issued by
    // Column N.A. with Cardless servicing, after the Wells Fargo partnership
    // ended in February 2026.
    slug: 'bilt',
    name: 'Column N.A.',
    displayName: 'Bilt',
    brandColor: '#1A1A1A',
  },
];

export default issuers;
