import { expect, test } from '@playwright/test';

/**
 * The end-to-end promise of the app, asserted once.
 *
 * Runs against a freshly seeded database with the clock frozen at 2026-08-24
 * (see playwright.config.ts) so assertions about days remaining and expired
 * periods stay true tomorrow.
 *
 * The assertion that matters most is the last pair. The Sapphire Reserve dining
 * credit is $150 twice a year — two independent buckets — so claiming the
 * second half must leave the first half untouched and still forfeited. If those
 * ever collapse into one $300 annual credit, every screen can still look right
 * while the app quietly stops doing its job.
 */
test('add a card, claim a credit, and see the tracker reflect it', async ({ page }) => {
  // The wallet starts empty, so the app opens on its first-run state.
  await page.goto('/tracker');
  await expect(page.getByText('No cards yet')).toBeVisible();

  await page.goto('/cards/add');
  await page.getByLabel('Search the card catalog').fill('Sapphire Reserve');
  await page.getByRole('button', { name: 'Add', exact: true }).first().click();

  // Adding takes you straight to the new card rather than back to the list.
  await page.waitForURL(/\/cards\?card=/);
  await expect(page.getByText('Chase Sapphire Reserve®').first()).toBeVisible();
  await expect(page.getByText('$795', { exact: true }).first()).toBeVisible();

  // The dining credit advertises its per-period shape, not an annualised $300.
  await expect(page.getByText('$150 twice a year • $300 total')).toBeVisible();

  // Claim the current (Jul–Dec) half.
  await page.getByText('Sapphire Reserve Exclusive Tables Dining Credit').first().click();
  const claim = page.getByRole('button', { name: /Mark full amount used/ });
  await expect(claim).toBeVisible();
  await claim.click();

  await page.goto('/tracker');

  // One catalog benefit, two rows, because it is genuinely two buckets.
  // Tracker rows show the short title.
  const diningRow = (period: string) =>
    page.locator('div').filter({ hasText: 'Dining Credit' }).filter({ hasText: period }).last();

  // The claimed Jul–Dec half is done...
  const claimed = diningRow('Jul–Dec 2026');
  await expect(claimed).toContainText('$150 of $150 used');
  await expect(claimed).toContainText('Used');

  // ...and the Jan–Jun half is still independently forfeited. This is the point:
  // claiming one half must leave the other untouched.
  const forfeited = diningRow('Jan–Jun 2026');
  await expect(forfeited).toContainText('$0 of $150 used');
  await expect(forfeited).toContainText('Expired');

  // Perks and spend thresholds are shown but never priced in dollars.
  await page.goto('/overview');
  await expect(
    page.getByText(/spend-threshold benefits and perks are\s+never converted to dollars/i),
  ).toBeVisible();
});
