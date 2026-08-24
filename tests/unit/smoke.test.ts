import { describe, expect, it } from 'vitest';

import { cards, issuers, pointsCurrencies } from '@/catalog';

describe('scaffold smoke', () => {
  it('exposes the catalog contract arrays', () => {
    expect(Array.isArray(issuers)).toBe(true);
    expect(Array.isArray(pointsCurrencies)).toBe(true);
    expect(Array.isArray(cards)).toBe(true);
  });
});
